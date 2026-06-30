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
import {
    revealGlobalAroundPosition,
    resetDiscovery,
    bulkPromoteObstacles,
    revealAllKnownCells,
} from '../../store/slices/discoveredGridSlice';
import { CellTypes, GLOBAL_GRID_SIZE, GLOBAL_CELL_SIZE, LOCAL_CELL_SIZE, LOCAL_GRID_WORLD_SIZE } from '../../utils/types';

import { SceneCanvas } from './SceneCanvas';
import { Legend } from '../controls/Legend';
import { MobileBottomNav } from '../controls/MobileBottomNav';
import * as SceneHUD from '../hud/SceneHUD';

/**
 * @component MappingScene
 * @description The main mapping visualizer scene component. 
 *  It orchestrates the animation loop, handles user input, and renders the map, ASV, and HUD.
 * @remarks
 * This component uses the `useEnginePhysics` hook to simulate the ASV's movement based on speed and heading.
 * It dispatches scene events for objective reached and map regeneration, and manages the course trail.
 * 
 * @returns a React element representing the mapping visualizer scene.
 */
export default function MappingScene() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isLandscape = useMediaQuery('(orientation: landscape)');

    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Determine if the app is in desktop mode (not mobile or in fullscreen landscape)
    const isDesktopMode = !isMobile || (isFullscreen && isLandscape);

    // Redux state selectors
    const activeSceneId = useAppSelector(selectActiveScene);
    const simMode = useAppSelector((state: RootState) => state.simulation.simMode);
    const showLegend = useAppSelector((state: RootState) => state.visualization.showLegend);
    const { speed, heading } = useAppSelector((state: RootState) => state.telemetry.asv);
    const connectionStatus = useAppSelector((state: RootState) => state.connection.status);
    const isConnected = connectionStatus === 'connected';
    const fineGrid = useAppSelector((state: RootState) => state.simulation.fineGrid);
    const occupancyGrid = useAppSelector((state: RootState) => state.telemetry.map.occupancyGrid);
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

    // Animation loop for heading updates based on joystick input
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

    // Clear the course trail when the sim mode changes (e.g., from manual to auto).
    React.useEffect(() => {
        pendingAutoClearRef.current = false;
        pendingAutoClearPosRef.current = null;
        lastPointRef.current = null;
        dispatch(clearCourseTrail());
    }, [dispatch, simMode]);

    // Sample the vessel's position and append to the course trail when moving. Clear the trail if the vessel jumps far away.
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

    // Dispatch an OBJECTIVE_REACHED event when the vessel reaches the objective cell. 
    // If in auto mode, clear the course trail and regenerate mock telemetry.
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

    // When the map loads or regenerates, record the vessel's current position as baseline
    // WITHOUT revealing it. This prevents the default (0,0) position from uncovering the
    // map center before the vessel has actually traveled there. React runs effects in
    // definition order, so this fires before the reveal effect below when fineGrid changes.
    const lastFogCellRef = React.useRef<{ col: number; row: number } | null>(null);
    const fineOffset = (GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE; // 400 world units
    React.useEffect(() => {
        if (fineGrid.length === 0) return;
        lastFogCellRef.current = {
            col: Math.floor(globalX + GLOBAL_GRID_SIZE / 2),
            row: Math.floor(globalY + GLOBAL_GRID_SIZE / 2),
        };
    }, [fineGrid]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reveal global cells and promote fineGrid obstacles only when the vessel actually moves.
    React.useEffect(() => {
        if (fineGrid.length === 0) return;

        const gCol = Math.floor(globalX + GLOBAL_GRID_SIZE / 2);
        const gRow = Math.floor(globalY + GLOBAL_GRID_SIZE / 2);
        const last = lastFogCellRef.current;

        // Skip if position hasn't changed (includes the initial load position captured above).
        if (last === null || (last.col === gCol && last.row === gRow)) return;

        lastFogCellRef.current = { col: gCol, row: gRow };
        dispatch(revealGlobalAroundPosition({ col: gCol, row: gRow }));

        // Promote only the global cells that overlap the LocalGrid's actual visible area.
        // LocalGrid covers ±LOCAL_GRID_WORLD_SIZE/2 px from the vessel center — compute the
        // exact global cell range instead of a fixed radius to avoid over-marking.
        const worldCX = globalX * GLOBAL_CELL_SIZE;
        const worldCY = globalY * GLOBAL_CELL_SIZE;
        const half = LOCAL_GRID_WORLD_SIZE / 2; // 60 px
        const cMin = Math.max(0, Math.floor((worldCX - half + fineOffset) / GLOBAL_CELL_SIZE));
        const cMax = Math.min(GLOBAL_GRID_SIZE - 1, Math.floor((worldCX + half + fineOffset) / GLOBAL_CELL_SIZE));
        const rMin = Math.max(0, Math.floor((worldCY - half + fineOffset) / GLOBAL_CELL_SIZE));
        const rMax = Math.min(GLOBAL_GRID_SIZE - 1, Math.floor((worldCY + half + fineOffset) / GLOBAL_CELL_SIZE));

        const promoteCols: number[] = [];
        const promoteRows: number[] = [];
        for (let nr = rMin; nr <= rMax; nr++) {
            for (let nc = cMin; nc <= cMax; nc++) {
                const worldXMin = (nc - GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE;
                const worldYMin = (nr - GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE;
                const fColStart = Math.max(0, Math.floor((worldXMin + fineOffset) / LOCAL_CELL_SIZE));
                const fRowStart = Math.max(0, Math.floor((worldYMin + fineOffset) / LOCAL_CELL_SIZE));
                const fColEnd   = Math.min(fineGrid[0]?.length ?? 0, Math.ceil((worldXMin + GLOBAL_CELL_SIZE + fineOffset) / LOCAL_CELL_SIZE));
                const fRowEnd   = Math.min(fineGrid.length,           Math.ceil((worldYMin + GLOBAL_CELL_SIZE + fineOffset) / LOCAL_CELL_SIZE));

                let hasObstacle = false;
                outer: for (let fi = fRowStart; fi < fRowEnd; fi++) {
                    for (let fj = fColStart; fj < fColEnd; fj++) {
                        if (fineGrid[fi]?.[fj]?.type === CellTypes.occupied) {
                            hasObstacle = true;
                            break outer;
                        }
                    }
                }
                if (hasObstacle) {
                    promoteCols.push(nc);
                    promoteRows.push(nr);
                }
            }
        }
        if (promoteCols.length > 0) {
            dispatch(bulkPromoteObstacles({ cols: promoteCols, rows: promoteRows }));
        }
    }, [globalX, globalY, fineGrid, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    // Live mode: immediately reveal all cells the basestation knows about.
    // Unknown cells (absent from occupancyGrid) remain hidden behind fog.
    React.useEffect(() => {
        if (!isConnected) return;
        const cols: number[] = [];
        const rows: number[] = [];
        occupancyGrid.forEach((gridRow, ri) => {
            gridRow.forEach((cell, ci) => {
                if (cell.type !== undefined && cell.type !== CellTypes.empty) {
                    cols.push(ci);
                    rows.push(ri);
                }
            });
        });
        if (cols.length > 0) dispatch(revealAllKnownCells({ cols, rows }));
    }, [occupancyGrid, isConnected, dispatch]);

    /**
     * @constant handleRegenerateMap
     * @description Callback to regenerate the mock telemetry map.
     * @remarks
     * This function resets the auto-clear state, clears the course trail, and dispatches actions to regenerate the map and reset discovery.
     * It also dispatches a scene event indicating that the map has been regenerated.
     */
    const handleRegenerateMap = React.useCallback(() => {
        pendingAutoClearRef.current = false;
        pendingAutoClearPosRef.current = null;
        lastPointRef.current = null;
        dispatch(regenerateMockTelemetry());
        dispatch(clearCourseTrail());
        dispatch(resetDiscovery());
        dispatch(dispatchSceneEvent({ type: 'MAP_REGENERATED', sceneId: 'mapping' }));
    }, [dispatch]);

    // You know what this does. It exits fullscreen mode and unlocks the screen orientation if supported.
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
