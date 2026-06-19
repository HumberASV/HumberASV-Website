/**
 * @file MappingVisualizer.tsx
 * @description The main container for the Mapping Visualizer, coordinating state between the canvas and controls.
 * 
 * @remarks
 * - The component manages the ASV's position and heading, simulating movement based on telemetry or user input.
 * - it is different from the MapCanvas in that it is responsible for the overall layout and state management, 
 *  while the MapCanvas focuses on rendering the map and ASV.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useMapAnimation } from '../../hooks/useMapAnimation';
import { useAutoPathAnimation } from '../../hooks/useAutoPathAnimation';
import { useAppSelector, useAppDispatch, type RootState } from '../../store';
import { getTokenFromCookie } from '../../utils/cookie';
import {
  setActiveTab,
  setCurrentHeading,
  setShowCompass,
  setSimMode,
} from '../../store/slices/visualizerSlice';
import { clearCourseTrail, appendCourseTrailPoint, setASVSpeed, setASVHeading } from '../../store/slices/statusSlice';
import { regenerateMockTelemetry } from '../../store/actions/fetchTelemetry';
import { retryConnection } from '../../store/actions/connectionActions';
import { GLOBAL_GRID_SIZE } from '../../utils/types';

import { MapCanvas } from './MapCanvas';
import { Legend } from './panels/Legend';
import { InfoPopover } from './panels/InfoPopover';
import { ControlsDrawer } from './panels/ControlsDrawer';
import { MobileBottomNav } from './panels/MobileBottomNav';

export default function MappingVisualizer() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLandscape = useMediaQuery('(orientation: landscape)');

  const token = useAppSelector((state: RootState) => state.token.token);

  // Redirect to /connect if there is no token in either Redux state or the cookie.
  // This acts as a safety net for cases where the component mounts without a valid session
  // (e.g., direct navigation or cookie expiry after the page was already open).
  React.useEffect(() => {
    if (!token && !getTokenFromCookie()) {
      navigate('/connect');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally runs once on mount.

  const [controlsDrawerOpen, setControlsDrawerOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [infoAnchor, setInfoAnchor] = React.useState<HTMLElement | null>(null);

  // Desktop mode when on a large screen, or when a mobile user enters landscape fullscreen
  const isDesktopMode = !isMobile || (isFullscreen && isLandscape);

  const { activeTab, showLegend, showControls, showCompass, simMode, currentHeading } =
    useAppSelector((state: RootState) => state.controls);

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

  const mappingPaused = !isConnected && !autoSimActive && activeTab !== 0;

  const { globalX: manualX, globalY: manualY, setGlobalX, setGlobalY } = useMapAnimation(
    autoSimActive ? 0 : mappingPaused ? 0 : speed,
    heading,
  );
  const { autoX, autoY, autoHeading } = useAutoPathAnimation(autoSimActive, 2.0);

  const globalX = autoSimActive ? autoX : manualX;
  const globalY = autoSimActive ? autoY : manualY;

  const plan = useAppSelector((state: RootState) => state.telemetry.planning.plan);

  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);
  // In auto mode the vessel teleports from objective back to start in one frame.
  // We defer the trail clear until that teleport is detected (large position jump)
  // so no spurious points appear during the frames the vessel dwells at the objective.
  const pendingAutoClearRef = React.useRef(false);
  const pendingAutoClearPosRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    pendingAutoClearRef.current = false;
    pendingAutoClearPosRef.current = null;
    lastPointRef.current = null;
    dispatch(clearCourseTrail());
  }, [simMode]);

  React.useEffect(() => {
    if (isConnected) return;
    if (autoSimActive && plan.length === 0) return;

    if (pendingAutoClearRef.current) {
      const obj = pendingAutoClearPosRef.current!;
      if (Math.hypot(globalX - obj.x, globalY - obj.y) > 1.0) {
        // Vessel has jumped far from the objective — the auto loop has reset.
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
      // Grid wrap-around — break the trail rather than draw a line across the map
      lastPointRef.current = { x: globalX, y: globalY };
      dispatch(clearCourseTrail());
      dispatch(appendCourseTrailPoint({ x: globalX, y: globalY }));
    } else if (prev === null || dist >= SAMPLE_DIST) {
      lastPointRef.current = { x: globalX, y: globalY };
      dispatch(appendCourseTrailPoint({ x: globalX, y: globalY }));
    }
  }, [globalX, globalY]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset trail when the vessel reaches the objective; regenerate map in manual mode.
  const atObjectiveRef = React.useRef(false);
  React.useEffect(() => {
    const objectiveCell = plan[plan.length - 1];
    if (!objectiveCell) return;
    const col = Math.floor(globalX + GLOBAL_GRID_SIZE / 2);
    const row = Math.floor(globalY + GLOBAL_GRID_SIZE / 2);
    if (col === objectiveCell.x && row === objectiveCell.y) {
      if (!atObjectiveRef.current) {
        atObjectiveRef.current = true;
        if (autoSimActive) {
          // Freeze recording; the position effect will clear and restart once the
          // auto animation jumps back to the start of the path.
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(newValue));
  };

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

  // Derived values for sub-components
  const currentRad = (currentHeading || 0) * Math.PI / 180;
  const mapWidth = isDesktopMode ? 1600 : 800;
  const mapHeight = isDesktopMode ? 900 : 600;
  const mapScale = isDesktopMode ? 1.25 : 0.9;
  const flowControlSize = isDesktopMode ? 140 : 180;
  const flowCenter = flowControlSize / 2;
  const flowOuterRadius = flowCenter - (isDesktopMode ? 10 : 12);
  const flowInnerRadius = flowOuterRadius * 0.75;

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
          <MapCanvas
            isDesktopMode={isDesktopMode}
            isFullscreen={isFullscreen}
            isMobile={isMobile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            showLegend={showLegend}
            showControls={showControls}
            showCompass={showCompass}
            isConnected={isConnected}
            connectionStatus={connectionStatus}
            autoSimActive={autoSimActive}
            onSimModeToggle={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
            currentHeading={currentHeading}
            onHeadingChange={(h) => dispatch(setCurrentHeading(h))}
            globalX={globalX}
            globalY={globalY}
            setGlobalX={setGlobalX}
            setGlobalY={setGlobalY}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            mapScale={mapScale}
            autoHeading={autoHeading}
            flowControlSize={flowControlSize}
            flowCenter={flowCenter}
            flowOuterRadius={flowOuterRadius}
            flowInnerRadius={flowInnerRadius}
            onToggleCompass={() => dispatch(setShowCompass(!showCompass))}
            onOpenControlsDrawer={() => setControlsDrawerOpen(true)}
            onSetInfoAnchor={setInfoAnchor}
            infoAnchor={infoAnchor}
            onToggleFullscreen={toggleFullscreen}
            joystickProps={!isConnected && !autoSimActive ? {
              joy: joyState,
              lw: joyLw,
              rw: joyRw,
              onJoyChange: handleJoyChange,
            } : undefined}
          />

          {/* Mobile-only legend below the canvas (non-fullscreen) */}
          {!isFullscreen && (
            <Stack spacing={3} sx={{ px: { xs: 2, sm: 0 } }}>
              <Grid container spacing={3} alignItems="stretch">
                <Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{ display: { xs: 'block', md: 'none' } }}>
                  {showLegend && <Legend variant={activeTab === 1 ? 'forces' : 'mapping'} />}
                </Grid>
              </Grid>
            </Stack>
          )}
        </Stack>
      </Container>

      <InfoPopover anchor={infoAnchor} onClose={() => setInfoAnchor(null)} />

      <ControlsDrawer
        open={controlsDrawerOpen}
        onClose={() => setControlsDrawerOpen(false)}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        autoSimActive={autoSimActive}
        activeTab={activeTab}
        heading={heading}
        speed={speed}
        currentRad={currentRad}
        onSimModeToggle={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
        onRegenerateMap={() => {
          pendingAutoClearRef.current = false;
          pendingAutoClearPosRef.current = null;
          lastPointRef.current = null;
          dispatch(regenerateMockTelemetry());
          dispatch(clearCourseTrail());
        }}
        onRetryConnection={() => {
          if (!token && !getTokenFromCookie()) {
            navigate('/connect');
            return;
          }
          dispatch(retryConnection());
        }}
        onHeadingChange={(h) => dispatch(setASVHeading(h))}
      />

      {!isDesktopMode && (
        <MobileBottomNav activeTab={activeTab} onChange={handleTabChange} />
      )}
    </Box>
  );
}
