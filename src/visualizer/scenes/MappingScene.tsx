/**
 * @file MappingScene.tsx
 * @description Animation orchestrator for the mapping visualizer scene.
 * Renamed from MappingVisualizer.tsx. Uses useEnginePhysics and dispatches
 * scene events for objective reached and map regeneration.
 */
import React from 'react';
import { Box, Container, Stack, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEnginePhysics } from '../../hooks/useEnginePhysics';
import { useAutoPathAnimation } from '../../hooks/useAutoPathAnimation';
import { useAppSelector, useAppDispatch, type RootState } from '../../store';

import { clearCourseTrail, appendCourseTrailPoint, setASVSpeed, setASVHeading } from '../../store/slices/telemetrySlice';
import { regenerateMockTelemetry } from '../../store/actions/fetchTelemetry';
import { dispatchSceneEvent, selectActiveScene } from '../../store/slices/sceneSlice';
import { revealAroundPosition, resetFog } from '../../store/slices/fogOfWarSlice';
import { GLOBAL_GRID_SIZE, GLOBAL_CELL_SIZE, LOCAL_CELL_SIZE } from '../../utils/types';

import { SceneCanvas } from './SceneCanvas';
import { Legend } from '../controls/Legend';
import { MobileBottomNav } from '../controls/MobileBottomNav';
import * as SceneHUD from '../hud/SceneHUD';

export default function MappingScene() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isLandscape = useMediaQuery('(orientation: landscape)');

    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const isDesktopMode = !isMobile || (isFullscreen && isLandscape);

    const activeSceneId = useAppSelector(selectActiveScene);
    const simMode = useAppSelector((state: RootState) => state.simulation.simMode);
    const showLegend = useAppSelector((state: RootState) => state.visualization.showLegend);
    const { speed, heading } = useAppSelector((state: RootState) => state.telemetry.asv);
    const connectionStatus = useAppSelector((state: RootState) => state.connection.status);
    const isConnected = connectionStatus === 'connected';
    const autoSimActive = !isConnected && simMode === 'automatic';

    // Joystick state — only active in manual sim mode
    const VELOCITY_MAX = 2.0;
    const TURN_RATE = 90; // deg/s at full x deflection
    const [joyState, setJoyState] = React.useState({ x: 0, y: 0 });
    const joyRef = React.useRef({ x: 0, y: 0 });

    const handleJoyChange = React.useCallback((j: { x: number; y: number }) => {
        joyRef.current = j;
        setJoyState(j);
        dispatch(setASVSpeed(j.y * VELOCITY_MAX));
    }, [dispatch]);

    const headingRef = React.useRef(heading);
    const lastDispatchedHeadingRef = React.useRef(-1);
    React.useEffect(() => { headingRef.current = heading; }, [heading]);

    React.useEffect(() => {
        if (isConnected || autoSimActive) return;
        let lastTime: number | null = null;
        let rafId: number;
        const loop = (now: number) => {
            if (lastTime !== null) {
                const dt = (now - lastTime) / 1000;
                const x = joyRef.current.x;
                if (Math.abs(x) > 0.05) {
                    const next = ((headingRef.current + x * TURN_RATE * dt) + 360) % 360;
                    headingRef.current = next;
                    const rounded = Math.round(next);
                    if (rounded !== lastDispatchedHeadingRef.current) {
                        lastDispatchedHeadingRef.current = rounded;
                        dispatch(setASVHeading(rounded));
                    }
                }
            }
            lastTime = now;
            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafId);
    }, [isConnected, autoSimActive, dispatch]);

    const joyLw = Math.max(-1, Math.min(1, joyState.y + joyState.x));
    const joyRw = Math.max(-1, Math.min(1, joyState.y - joyState.x));

    const mappingPaused = !isConnected && !autoSimActive && activeSceneId !== 'mapping';

    const { globalX: manualX, globalY: manualY, setGlobalX, setGlobalY } = useEnginePhysics(
        autoSimActive ? 0 : mappingPaused ? 0 : speed,
        heading,
    );
    const { autoX, autoY, autoHeading } = useAutoPathAnimation(autoSimActive, 2.0);

    const globalX = autoSimActive ? autoX : manualX;
    const globalY = autoSimActive ? autoY : manualY;

    // Sync manual position to auto position when leaving auto mode so there's no jump.
    const prevAutoSimRef = React.useRef(autoSimActive);
    React.useEffect(() => {
        const was = prevAutoSimRef.current;
        prevAutoSimRef.current = autoSimActive;
        if (was && !autoSimActive) {
            setGlobalX(autoX);
            setGlobalY(autoY);
        }
    }, [autoSimActive]); // eslint-disable-line react-hooks/exhaustive-deps

    const plan = useAppSelector((state: RootState) => state.telemetry.planning.plan);

    const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);
    const pendingAutoClearRef = React.useRef(false);
    const pendingAutoClearPosRef = React.useRef<{ x: number; y: number } | null>(null);

    // Regenerate mock telemetry when the basestation drops mid-session.
    const prevStatusRef = React.useRef(connectionStatus);
    React.useEffect(() => {
        const prev = prevStatusRef.current;
        prevStatusRef.current = connectionStatus;
        if (prev === 'connected' && connectionStatus === 'mock') {
            pendingAutoClearRef.current = false;
            pendingAutoClearPosRef.current = null;
            lastPointRef.current = null;
            dispatch(clearCourseTrail());
            dispatch(regenerateMockTelemetry());
        }
    }, [connectionStatus, dispatch]);

    React.useEffect(() => {
        pendingAutoClearRef.current = false;
        pendingAutoClearPosRef.current = null;
        lastPointRef.current = null;
        dispatch(clearCourseTrail());
    }, [dispatch, simMode]);

    React.useEffect(() => {
        if (isConnected) return;
        if (autoSimActive && plan.length === 0) return;

        if (pendingAutoClearRef.current) {
            const obj = pendingAutoClearPosRef.current!;
            if (Math.hypot(globalX - obj.x, globalY - obj.y) > 1.0) {
                pendingAutoClearRef.current = false;
                pendingAutoClearPosRef.current = null;
                lastPointRef.current = { x: globalX, y: globalY };
                dispatch(clearCourseTrail());
                dispatch(appendCourseTrailPoint({ x: globalX, y: globalY }));
            }
            return;
        }

        const prev = lastPointRef.current;
        const SAMPLE_DIST = 0.3;
        const WRAP_DIST = 5.0;
        const dist = prev !== null ? Math.hypot(globalX - prev.x, globalY - prev.y) : 0;

        if (prev !== null && dist >= WRAP_DIST) {
            lastPointRef.current = { x: globalX, y: globalY };
            dispatch(clearCourseTrail());
            dispatch(appendCourseTrailPoint({ x: globalX, y: globalY }));
        } else if (prev === null || dist >= SAMPLE_DIST) {
            lastPointRef.current = { x: globalX, y: globalY };
            dispatch(appendCourseTrailPoint({ x: globalX, y: globalY }));
        }
    }, [globalX, globalY]); // eslint-disable-line react-hooks/exhaustive-deps

    const atObjectiveRef = React.useRef(false);
    React.useEffect(() => {
        const objectiveCell = plan[plan.length - 1];
        if (!objectiveCell) return;
        const col = Math.floor(globalX + GLOBAL_GRID_SIZE / 2);
        const row = Math.floor(globalY + GLOBAL_GRID_SIZE / 2);
        if (col === objectiveCell.x && row === objectiveCell.y) {
            if (!atObjectiveRef.current) {
                atObjectiveRef.current = true;
                dispatch(dispatchSceneEvent({ type: 'OBJECTIVE_REACHED', sceneId: 'mapping', payload: { x: globalX, y: globalY } }));
                if (autoSimActive) {
                    pendingAutoClearRef.current = true;
                    pendingAutoClearPosRef.current = { x: globalX, y: globalY };
                } else {
                    lastPointRef.current = null;
                    dispatch(clearCourseTrail());
                    dispatch(regenerateMockTelemetry());
                }
            }
        } else {
            atObjectiveRef.current = false;
        }
    }, [globalX, globalY, plan]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fog reveal: dispatch when the vessel moves to a new local-cell position.
    // Convert global-cell coords → world units → local-cell grid index (100×100 grid).
    const lastFogCellRef = React.useRef<{ col: number; row: number } | null>(null);
    React.useEffect(() => {
        const halfSpan = (GLOBAL_GRID_SIZE * GLOBAL_CELL_SIZE) / 2; // 400 world units
        const col = Math.floor((globalX * GLOBAL_CELL_SIZE + halfSpan) / LOCAL_CELL_SIZE);
        const row = Math.floor((globalY * GLOBAL_CELL_SIZE + halfSpan) / LOCAL_CELL_SIZE);
        const last = lastFogCellRef.current;
        if (last === null || last.col !== col || last.row !== row) {
            lastFogCellRef.current = { col, row };
            dispatch(revealAroundPosition({ col, row }));
        }
    }, [globalX, globalY, dispatch]);

    const handleRegenerateMap = React.useCallback(() => {
        pendingAutoClearRef.current = false;
        pendingAutoClearPosRef.current = null;
        lastPointRef.current = null;
        lastFogCellRef.current = null;
        dispatch(regenerateMockTelemetry());
        dispatch(clearCourseTrail());
        dispatch(resetFog());
        dispatch(dispatchSceneEvent({ type: 'MAP_REGENERATED', sceneId: 'mapping' }));
    }, [dispatch]);

    const exitFullscreen = () => {
        setIsFullscreen(false);
        try { screen.orientation.unlock(); } catch { /* not supported */ }
    };

    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            setIsFullscreen(true);
            try { await screen.orientation.lock('landscape'); } catch { /* not supported (e.g. iOS) */ }
        } else {
            exitFullscreen();
        }
    };

    React.useEffect(() => {
        document.body.style.overflow = isFullscreen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isFullscreen]);

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') exitFullscreen(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const joystickProps = !isConnected && !autoSimActive ? {
        joy: joyState,
        lw: joyLw,
        rw: joyRw,
        onJoyChange: handleJoyChange,
    } : undefined;

    return (
        <Box
            sx={{
                bgcolor: theme.palette.scene.skyDark,
                ...(isFullscreen ? {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1150,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    pt: 'env(safe-area-inset-top)',
                    pb: !isDesktopMode ? 'calc(56px + env(safe-area-inset-bottom))' : 'env(safe-area-inset-bottom)',
                    pl: 'env(safe-area-inset-left)',
                    pr: 'env(safe-area-inset-right)',
                } : {
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    py: { xs: 2, md: 3 },
                    px: { xs: 0, sm: 2, md: 4 },
                    pb: { xs: '56px', md: 6 },
                })
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    px: { xs: 0, sm: 4 },
                    maxWidth: '1800px',
                    flex: 1,
                    ...(isFullscreen && { minHeight: 0, display: 'flex', flexDirection: 'column', px: 0 }),
                }}
            >
                <Stack
                    spacing={isFullscreen ? 1 : 2}
                    sx={isFullscreen ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : {}}
                >
                    <SceneCanvas
                        globalX={globalX}
                        globalY={globalY}
                        setGlobalX={setGlobalX}
                        setGlobalY={setGlobalY}
                        autoHeading={autoSimActive ? autoHeading : undefined}
                        isDesktopMode={isDesktopMode}
                        isFullscreen={isFullscreen}
                        isMobile={isMobile}
                        onToggleFullscreen={toggleFullscreen}
                        onRegenerateMap={handleRegenerateMap}
                        joystickProps={joystickProps}
                    >
                        <SceneHUD.Tabs />
                        <SceneHUD.StatusBadges />
                        <SceneHUD.Toolbar />
                        <SceneHUD.Title />
                        {joystickProps && <SceneHUD.JoystickHUD {...joystickProps} />}
                        <SceneHUD.LegendPanel />
                        <SceneHUD.ConnectingOverlay />
                    </SceneCanvas>

                    {!isFullscreen && (
                        <Stack spacing={3} sx={{ px: { xs: 2, sm: 0 } }}>
                            <Grid container spacing={3} alignItems="stretch">
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{ display: { xs: 'block', md: 'none' } }}>
                                    {showLegend && <Legend variant={activeSceneId === 'forces' ? 'forces' : 'mapping'} />}
                                </Grid>
                            </Grid>
                        </Stack>
                    )}
                </Stack>
            </Container>

            {!isDesktopMode && (
                <MobileBottomNav />
            )}
        </Box>
    );
}
