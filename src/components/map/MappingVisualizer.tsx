/**
 * @file MappingVisualizer.tsx
 * @description The main container for the Mapping Visualizer, coordinating state between the canvas and controls.
 */
import React from 'react';
import { Box, Container, Stack, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useMapAnimation } from '../../hooks/useMapAnimation';
import { useAutoPathAnimation } from '../../hooks/useAutoPathAnimation';
import { useAppSelector, useAppDispatch, type RootState } from '../../store';
import {
  setActiveTab,
  setCurrentHeading,
  setShowCompass,
  setSimMode,
} from '../../store/slices/visualizerSlice';
import { clearCourseTrail, appendCourseTrailCell } from '../../store/slices/statusSlice';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLandscape = useMediaQuery('(orientation: landscape)');

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

  const { globalX: manualX, globalY: manualY, setGlobalX, setGlobalY } = useMapAnimation(
    autoSimActive ? 0 : speed,
    heading,
  );
  const { autoX, autoY, autoHeading } = useAutoPathAnimation(autoSimActive, 2.0);

  const globalX = autoSimActive ? autoX : manualX;
  const globalY = autoSimActive ? autoY : manualY;

  const plan = useAppSelector((state: RootState) => state.telemetry.planning.plan);

  // Set-based dedup: only dispatch appendCourseTrailCell when a genuinely new cell is entered.
  const trailSetRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    trailSetRef.current.clear();
    dispatch(clearCourseTrail());
  }, [simMode]);

  React.useEffect(() => {
    if (isConnected) return;
    const col = Math.floor(globalX + GLOBAL_GRID_SIZE / 2);
    const row = Math.floor(globalY + GLOBAL_GRID_SIZE / 2);
    if (col < 0 || col >= GLOBAL_GRID_SIZE || row < 0 || row >= GLOBAL_GRID_SIZE) return;
    const key = `${col},${row}`;
    if (!trailSetRef.current.has(key)) {
      trailSetRef.current.add(key);
      dispatch(appendCourseTrailCell({ col, row, heading: autoSimActive ? autoHeading : heading }));
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
        trailSetRef.current.clear();
        dispatch(clearCourseTrail());
        if (!autoSimActive) dispatch(regenerateMockTelemetry());
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
        bgcolor: '#0f172a',
        ...(isFullscreen ? {
          position: 'fixed',
          inset: 0,
          zIndex: 1150,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          pt: 'env(safe-area-inset-top)',
          pb: 'env(safe-area-inset-bottom)',
          pl: 'env(safe-area-inset-left)',
          pr: 'env(safe-area-inset-right)',
        } : {
          minHeight: '100vh',
          py: { xs: 2, md: 3 },
          px: { xs: 0, sm: 2, md: 4 },
          pb: { xs: 0, md: 6 },
        })
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 0, sm: 4 },
          maxWidth: '1800px',
          ...(isFullscreen && { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', px: 0 }),
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
          trailSetRef.current.clear();
          dispatch(regenerateMockTelemetry());
          dispatch(clearCourseTrail());
        }}
        onRetryConnection={() => dispatch(retryConnection())}
      />

      {!isDesktopMode && !isFullscreen && (
        <MobileBottomNav activeTab={activeTab} onChange={handleTabChange} />
      )}
    </Box>
  );
}
