/**
 * @file MappingVisualizer.tsx
 * @description The main container for the Mapping Visualizer, coordinating state between the canvas and controls.
 */
import React from 'react';
import {
  Box,
  Chip,
  Container,
  Typography,
  Tabs,
  Tab,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Grid,
  Drawer,
  Paper,
  IconButton,
  Tooltip,
  Popover,
  Divider,
  Switch,
  Button,
  CircularProgress,
} from '@mui/material';
import { useGesture, useDrag } from '@use-gesture/react';
import { Map as MapView } from './Map';
import { useMapAnimation } from '../../hooks/useMapAnimation';
import { useAutoPathAnimation } from '../../hooks/useAutoPathAnimation';
import { useAppSelector, useAppDispatch, type RootState } from '../../store';
import {
  setActiveTab,
  setCurrentHeading,
  setShowCompass,
  setSimMode,
} from '../../store/slices/controlsSlice';
import { clearCourseTrail, appendCourseTrailCell } from '../../store/slices/statusSlice';
import { regenerateMockTelemetry } from '../../store/actions/fetchTelemetry';
import { retryConnection } from '../../store/actions/connectionActions';
import { TELEMETRY_WS_URL } from '../../config/connection';
import { GLOBAL_GRID_SIZE } from '../../utils/types';

// Icons
import TuneIcon from '@mui/icons-material/Tune';
import SpeedIcon from '@mui/icons-material/Speed';
import MapIcon from '@mui/icons-material/Map';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExploreIcon from '@mui/icons-material/Explore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WifiIcon from '@mui/icons-material/Wifi';

// HUD Components
import { Legend } from './panels/Legend';
import { ControlOverlay } from './panels/ControlOverlay';
import { ForceVectorsPanel } from './panels/ForceVectorsPanel';
import { CompassRose, DirectionButtons } from './svg/CompassRose';

/**
 * MappingVisualizer component.
 * Handles the animation loop for movement based on velocity and rotation.
 */
export default function MappingVisualizer() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [controlsDrawerOpen, setControlsDrawerOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [infoAnchor, setInfoAnchor] = React.useState<HTMLElement | null>(null);

  // Desktop layout when explicitly on desktop, or when mobile user enters landscape fullscreen
  const isDesktopMode = !isMobile || (isFullscreen && isLandscape);

  const {
    activeTab,
    showLegend,
    showControls,
    showCompass,
    currentHeading,
    velocity,
    localRotation,
    objectHeading,
    simMode,
  } = useAppSelector((state: RootState) => state.controls);

  const connectionStatus = useAppSelector((state: RootState) => state.connection.status);
  const isConnected = connectionStatus === 'connected';

  const { speed: asvSpeed, heading: asvHeading } = useAppSelector(
    (state: RootState) => state.telemetry.asv
  );

  // Live connection drives values; simulation lets the user control them via sliders.
  const effectiveSpeed = isConnected ? asvSpeed : velocity;
  const effectiveHeading = isConnected ? asvHeading : localRotation;

  // In automatic sim mode the vessel follows the planned path; manual lets sliders control movement.
  const autoSimActive = !isConnected && simMode === 'automatic';

  const { globalX: manualX, globalY: manualY, setGlobalX, setGlobalY } = useMapAnimation(
    autoSimActive ? 0 : effectiveSpeed,
    effectiveHeading,
  );
  const { autoX, autoY, autoHeading } = useAutoPathAnimation(autoSimActive, 2.0);

  const globalX = autoSimActive ? autoX : manualX;
  const globalY = autoSimActive ? autoY : manualY;

  const plan = useAppSelector((state: RootState) => state.telemetry.planning.plan);

  // Set-based dedup: only dispatch appendCourseTrailCell when a genuinely new cell is entered.
  // Cleared together with the Redux trail so they stay in sync.
  const trailSetRef = React.useRef<Set<string>>(new Set());

  // Clear the trail when the simulation mode switches (manual ↔ automatic).
  React.useEffect(() => {
    trailSetRef.current.clear();
    dispatch(clearCourseTrail());
  }, [simMode]);

  // Tab-independent trail tracking: always runs regardless of activeTab so switching to
  // Force Simulation and back leaves no gaps in the course-over-ground trail.
  React.useEffect(() => {
    if (isConnected) return;
    const col = Math.floor(globalX + GLOBAL_GRID_SIZE / 2);
    const row = Math.floor(globalY + GLOBAL_GRID_SIZE / 2);
    if (col < 0 || col >= GLOBAL_GRID_SIZE || row < 0 || row >= GLOBAL_GRID_SIZE) return;
    const key = `${col},${row}`;
    if (!trailSetRef.current.has(key)) {
      trailSetRef.current.add(key);
      const heading = autoSimActive ? autoHeading : effectiveHeading;
      dispatch(appendCourseTrailCell({ col, row, heading }));
    }
  }, [globalX, globalY]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset trail when the vessel reaches the objective cell (any mode).
  // In manual mode also regenerates the map so there is always a new target.
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
        if (!autoSimActive) {
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

  // Viewport state (zoom & pan)
  const [viewOffset, setViewOffset] = React.useState({ x: 0, y: 0 });
  const [userScale, setUserScale] = React.useState(1);
  const userScaleRef = React.useRef(userScale);
  React.useEffect(() => { userScaleRef.current = userScale; }, [userScale]);

  // Refs
  const containerRef = React.useRef<HTMLDivElement>(null);
  const flowSvgRef = React.useRef<Element>(null);

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

  // Lock body scroll and handle Escape while the overlay is open
  React.useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') exitFullscreen(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Map: pan, pinch-zoom, and wheel-zoom
  const mapBind = useGesture(
    {
      onDrag: ({ delta: [dx, dy], pinching }) => {
        if (pinching) return;
        setViewOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      },
      onPinch: ({ offset: [scale] }) => {
        setUserScale(Math.max(0.1, Math.min(scale, 10)));
      },
      onWheel: ({ delta: [, dy] }) => {
        setUserScale(prev => Math.max(0.1, Math.min(prev * (dy > 0 ? 0.9 : 1.1), 10)));
      },
    },
    {
      drag: { filterTaps: true },
      pinch: { from: () => [userScaleRef.current, 0] },
    }
  );

  // Compass: drag to set current heading angle
  const headingBind = useDrag(({ xy: [x, y] }) => {
    if (!flowSvgRef.current || isConnected) return;
    const rect = flowSvgRef.current.getBoundingClientRect();
    const heading = (Math.atan2(y - (rect.top + rect.height / 2), x - (rect.left + rect.width / 2)) * 180 / Math.PI) + 90;
    dispatch(setCurrentHeading((Math.round(heading) + 360) % 360));
  });

  // Derived vectors for panel
  const currentRad = (currentHeading || 0) * Math.PI / 180;

  const mapWidth = isDesktopMode ? 1600 : 800;
  const mapHeight = isDesktopMode ? 900 : 600;
  const mapScale = isDesktopMode ? 1.25 : 0.9;

  const flowControlSize = isDesktopMode ? 140 : 180;
  const flowCenter = flowControlSize / 2;
  const flowOuterRadius = flowCenter - (isDesktopMode ? 10 : 12);
  const flowInnerRadius = flowOuterRadius * 0.75;

  // Shared style for all canvas HUD icon buttons — fixed 40×40px touch target
  const hudBtnSx = {
    width: 40,
    height: 40,
    bgcolor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid',
    borderColor: 'divider',
    backdropFilter: 'blur(4px)',
    '&:hover': { bgcolor: 'rgba(30, 41, 59, 1)' },
  } as const;

  return (
    <Box
      sx={{
        bgcolor: '#0f172a',
        ...(isFullscreen ? {
          // Fixed overlay: sits above AppBar (z-1100) but below Drawer portal (z-1200)
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
          ...(isFullscreen && { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', px: 0 })
        }}
      >
        <Stack
          spacing={isFullscreen ? 1 : 2}
          sx={isFullscreen ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : {}}
        >
          {/* Primary Visualizer Canvas */}
          <Box
            ref={containerRef}
            sx={{
              position: 'relative',
              bgcolor: '#1e293b',
              borderRadius: { xs: 0, sm: 3 },
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
              border: isDesktopMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
              ...(isFullscreen ? {
                flex: 1,
                minHeight: 0,
                maxHeight: 'none',
                // SVG has inline height:auto — override so it fills the canvas in fullscreen
                '& svg': { height: '100% !important' },
              } : {
                aspectRatio: { xs: '4/3', md: '16/9' },
                maxHeight: '70vh',
              })
            }}
          >
            {/* Tabs — top-left flush (desktop mode only) */}
            {isDesktopMode && (
              <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0 0 8px 0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: theme.shadows[10],
                    minHeight: 0,
                    '& .MuiTabs-indicator': { backgroundColor: '#38bdf8' },
                    '& .MuiTab-root': { minHeight: 40, py: 1 },
                  }}
                >
                  <Tab label="Coordinate Mapping" sx={{ color: '#94a3b8', '&.Mui-selected': { color: '#38bdf8' }, fontSize: '0.75rem' }} />
                  <Tab label="Force Simulation" sx={{ color: '#94a3b8', '&.Mui-selected': { color: '#38bdf8' }, fontSize: '0.75rem' }} />
                </Tabs>
              </Box>
            )}

            {/* Connection status + sim mode badges — top-left below tabs */}
            <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: isDesktopMode ? 48 : 8, left: 8, zIndex: 10 }}>
              <Chip
                size="small"
                label={isConnected ? 'LIVE' : connectionStatus === 'connecting' ? 'CONNECTING' : 'SIM'}
                sx={{
                  pointerEvents: 'none',
                  bgcolor: isConnected ? 'rgba(16,185,129,0.15)' : connectionStatus === 'connecting' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                  color: isConnected ? '#10b981' : connectionStatus === 'connecting' ? '#60a5fa' : '#f59e0b',
                  border: `1px solid ${isConnected ? '#10b981' : connectionStatus === 'connecting' ? '#60a5fa' : '#f59e0b'}`,
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  height: 20,
                  letterSpacing: '0.06em',
                }}
              />
              {!isConnected && (
                <Tooltip title={autoSimActive ? 'Switch to manual control' : 'Switch to automatic'} placement="right">
                  <Chip
                    size="small"
                    label={autoSimActive ? 'AUTO' : 'MAN'}
                    onClick={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: autoSimActive ? 'rgba(167,139,250,0.15)' : 'rgba(251,191,36,0.15)',
                      color: autoSimActive ? '#a78bfa' : '#fbbf24',
                      border: `1px solid ${autoSimActive ? '#a78bfa' : '#fbbf24'}`,
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      height: 20,
                      letterSpacing: '0.06em',
                    }}
                  />
                </Tooltip>
              )}
            </Stack>

            {/* Title — bottom-left */}
            <Box sx={{ position: 'absolute', bottom: { xs: 16, md: 24 }, left: { xs: 16, md: 24 }, zIndex: 10, pointerEvents: 'none' }}>
              <Typography variant={isDesktopMode ? 'h6' : 'subtitle1'} sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                System Visualizer v2
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 1)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', display: 'block' }}>
                Global-Local Coordinate Mapping
              </Typography>
            </Box>

            {/* Reset view & toolbar — top-right */}
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
              {(viewOffset.x !== 0 || viewOffset.y !== 0 || userScale !== 1) && (
                <IconButton onClick={() => { setViewOffset({ x: 0, y: 0 }); setUserScale(1); }} sx={{ ...hudBtnSx, color: '#fbbf24' }} title="Reset View">
                  <RestartAltIcon fontSize="small" />
                </IconButton>
              )}
              {activeTab === 1 && (
                <IconButton onClick={() => dispatch(setShowCompass(!showCompass))} sx={{ ...hudBtnSx, color: showCompass ? '#38bdf8' : '#94a3b8' }} title="Toggle Flow Control">
                  <ExploreIcon fontSize="small" />
                </IconButton>
              )}
              {showControls && (
                <IconButton onClick={() => setControlsDrawerOpen(true)} sx={{ ...hudBtnSx, color: '#38bdf8' }}>
                  <TuneIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                onClick={(e) => setInfoAnchor(infoAnchor ? null : e.currentTarget)}
                sx={{ ...hudBtnSx, color: infoAnchor ? '#38bdf8' : '#94a3b8' }}
                title="About this visualizer"
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* Bottom-right HUD: accordions (desktop) + fullscreen button (mobile) */}
            <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              {isDesktopMode && (showLegend || (activeTab === 1 && showCompass)) && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  {showLegend && (
                    <Box sx={{ width: 240 }}>
                      <Accordion
                        sx={{
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          bgcolor: 'rgba(15, 23, 42, 0.85)',
                          color: 'white',
                          backdropFilter: 'blur(12px)',
                          backgroundImage: 'none',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px !important',
                          boxShadow: theme.shadows[10],
                          '&:before': { display: 'none' },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandLessIcon sx={{ color: 'white' }} />}
                          sx={{ '& .MuiAccordionSummary-content': { my: 1 } }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.primary.light }}>
                            System Legend
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 2 }}>
                          <Legend variant={activeTab === 1 ? 'forces' : 'mapping'} disablePaper hideTitle />
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  )}
                  {activeTab === 1 && showCompass && (
                    <Box sx={{ width: 200 }}>
                      <Accordion
                        sx={{
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          bgcolor: 'rgba(15, 23, 42, 0.85)',
                          color: 'white',
                          backdropFilter: 'blur(12px)',
                          backgroundImage: 'none',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px !important',
                          boxShadow: theme.shadows[10],
                          '&:before': { display: 'none' },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandLessIcon sx={{ color: 'white' }} />}
                          sx={{ '& .MuiAccordionSummary-content': { my: 1 } }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.info.main }}>
                            Flow Control
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'center' }}>
                          <Box
                            ref={flowSvgRef}
                            component="svg"
                            width={flowControlSize}
                            height={flowControlSize}
                            sx={{ cursor: 'crosshair', touchAction: 'none', display: 'block' }}
                            {...headingBind()}
                          >
                            <DirectionButtons cx={flowCenter} cy={flowCenter} radius={flowOuterRadius} currentHeading={currentHeading} onSelect={(val) => dispatch(setCurrentHeading(val))} />
                            <CompassRose cx={flowCenter} cy={flowCenter} radius={flowInnerRadius} heading={currentHeading} color={theme.palette.info.main} />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  )}
                </Box>
              )}
              {/* Portrait fullscreen: inline compass panel (no accordion) */}
              {isFullscreen && !isDesktopMode && activeTab === 1 && showCompass && (
                <Box
                  sx={{
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    p: 1.5,
                    boxShadow: theme.shadows[10],
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.info.main, display: 'block', textAlign: 'center', mb: 1 }}>
                    Flow Control
                  </Typography>
                  <Box
                    ref={flowSvgRef}
                    component="svg"
                    width={140}
                    height={140}
                    sx={{ cursor: 'crosshair', touchAction: 'none', display: 'block' }}
                    {...headingBind()}
                  >
                    <DirectionButtons cx={70} cy={70} radius={60} currentHeading={currentHeading} onSelect={(val) => dispatch(setCurrentHeading(val))} />
                    <CompassRose cx={70} cy={70} radius={45} heading={currentHeading} color={theme.palette.info.main} />
                  </Box>
                </Box>
              )}
              {isMobile && (
                <IconButton onClick={toggleFullscreen} sx={{ ...hudBtnSx, color: isFullscreen ? '#38bdf8' : '#94a3b8' }} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (landscape)'}>
                  {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
              )}
            </Box>

            {connectionStatus === 'connecting' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 19,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(15, 23, 42, 0.55)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <CircularProgress aria-label="Loading…" sx={{ color: '#60a5fa' }} />
              </Box>
            )}

            <MapView
              width={mapWidth}
              height={mapHeight}
              scale={mapScale * userScale}
              offset={viewOffset}
              preserveAspectRatio={isFullscreen ? 'xMidYMid slice' : undefined}
              interactionProps={{
                ...mapBind(),
                onDoubleClick: () => { setViewOffset({ x: 0, y: 0 }); setUserScale(1); },
              }}
              mappingData={{ globalX, globalY, setGlobalX, setGlobalY, localRotationOverride: autoSimActive ? autoHeading : undefined }}
            />
          </Box>

          {/* Dashboard Controls & Info (non-fullscreen only) */}
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

        {/* Info Popover */}
        <Popover
          open={Boolean(infoAnchor)}
          anchorEl={infoAnchor}
          onClose={() => setInfoAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: '#0f172a',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundImage: 'none',
                borderRadius: 2,
                p: 2.5,
                maxWidth: 320,
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.6)',
              },
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
            System Visualizer
          </Typography>

          {/* LIVE vs SIM */}
          <Stack spacing={0.5} mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', letterSpacing: '0.05em' }}>LIVE</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
              Connected to the ASV basestation over WebSocket. All telemetry — speed, heading, position, grid maps — streams from the vessel in real time. Simulation controls are locked.
            </Typography>
          </Stack>

          <Stack spacing={0.5} mb={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#f59e0b', letterSpacing: '0.05em' }}>SIM</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
              No live connection. A 20×20 map is generated procedurally using Gaussian noise blurred into obstacle islands, then BFS finds a navigable path between two free cells.
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />

          {/* AUTO vs MAN */}
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
            Simulation Modes
          </Typography>

          <Stack spacing={0.5} mb={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#a78bfa', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a78bfa', letterSpacing: '0.05em' }}>AUTO</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
              The vessel follows the planned BFS path from current position to objective, looping continuously. If the objective is unreachable the vessel holds position. The course-over-ground trail marks every visited cell.
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fbbf24', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#fbbf24', letterSpacing: '0.05em' }}>MAN</Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', pl: 2.5, display: 'block' }}>
              Full manual control. Use the velocity and rotation sliders in the settings drawer to drive the vessel around the map. The grid wraps seamlessly at the boundary.
            </Typography>
          </Stack>
        </Popover>

        {/* Controls Drawer */}
        <Drawer
          anchor="right"
          open={controlsDrawerOpen}
          onClose={() => setControlsDrawerOpen(false)}
          slotProps={{
            backdrop: { sx: { bgcolor: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(2px)' } },
            paper: {
              sx: {
                width: { xs: '100%', sm: 360 },
                bgcolor: '#0f172a',
                color: 'white',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundImage: 'none',
                p: 0,
                display: 'flex',
                flexDirection: 'column'
              }
            }
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>System Configuration</Typography>
            <IconButton onClick={() => setControlsDrawerOpen(false)} sx={{ color: 'white' }}>
              <TuneIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Stack spacing={2}>
              {/* Sim mode toggle — only visible in simulation (no live connection) */}
              {!isConnected && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                    Simulation Mode
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: autoSimActive ? '#a78bfa' : '#fbbf24' }}>
                        {autoSimActive ? 'Automatic' : 'Manual'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {autoSimActive
                          ? 'Vessel follows the planned BFS path'
                          : 'Control velocity and heading via sliders'}
                      </Typography>
                    </Box>
                    <Tooltip title={autoSimActive ? 'Switch to manual control' : 'Switch to automatic'} placement="left">
                      <Switch
                        checked={autoSimActive}
                        onChange={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#a78bfa' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#a78bfa' },
                          '& .MuiSwitch-switchBase': { color: '#fbbf24' },
                          '& .MuiSwitch-track': { bgcolor: '#fbbf24' },
                        }}
                      />
                    </Tooltip>
                  </Box>
                </Paper>
              )}
              {/* Regenerate simulation map */}
              {!isConnected && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                    Simulation Data
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AutorenewIcon />}
                    onClick={() => { trailSetRef.current.clear(); dispatch(regenerateMockTelemetry()); dispatch(clearCourseTrail()); }}
                    sx={{
                      color: '#a78bfa',
                      borderColor: 'rgba(167,139,250,0.4)',
                      '&:hover': { borderColor: '#a78bfa', bgcolor: 'rgba(167,139,250,0.08)' },
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Regenerate Map
                  </Button>
                  <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1 }}>
                    New Gaussian noise field, obstacle islands, and BFS path
                  </Typography>
                </Paper>
              )}

              {/* Basestation TCP reconnect */}
              <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                  Basestation Connection
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={connectionStatus === 'connecting'}
                  startIcon={connectionStatus === 'connecting'
                    ? <CircularProgress size={14} sx={{ color: '#60a5fa' }} />
                    : <WifiIcon />}
                  onClick={() => dispatch(retryConnection())}
                  sx={{
                    color: isConnected ? '#10b981' : '#60a5fa',
                    borderColor: isConnected ? 'rgba(16,185,129,0.4)' : 'rgba(96,165,250,0.4)',
                    '&:hover': {
                      borderColor: isConnected ? '#10b981' : '#60a5fa',
                      bgcolor: isConnected ? 'rgba(16,185,129,0.08)' : 'rgba(96,165,250,0.08)',
                    },
                    '&.Mui-disabled': { color: '#60a5fa', borderColor: 'rgba(96,165,250,0.2)' },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {isConnected ? 'Reconnect' : connectionStatus === 'connecting' ? 'Connecting…' : 'Connect to Basestation'}
                </Button>
                <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 1, wordBreak: 'break-all' }}>
                  {TELEMETRY_WS_URL}
                </Typography>
              </Paper>

              {activeTab === 1 && (
                <ForceVectorsPanel objectHeading={isConnected ? asvHeading : objectHeading} currentRad={currentRad} currentSpeed={effectiveSpeed} />
              )}
              {activeTab === 1 && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.primary.light, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Vessel Heading</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="120" height="120">
                      <CompassRose cx={60} cy={60} radius={50} heading={effectiveHeading} />
                    </svg>
                  </Box>
                </Paper>
              )}
              <ControlOverlay
                title={activeTab === 1 ? "Simulation Params" : "Mapping Params"}
                showLocalRotation={!isConnected && !autoSimActive}
                showVelocity={!isConnected && !autoSimActive}
                showObjectHeading={activeTab === 1 && !isConnected}
                showGlobalGrid
                showLocalAxes
                showLegend
                showCurrentHeading={activeTab === 1}
                isLocked={isConnected}
              />
            </Stack>
          </Box>
        </Drawer>
      </Container>

      {/* Mobile Bottom Navigation — sticky so it stays within the visualizer, not the whole viewport */}
      {!isDesktopMode && !isFullscreen && (
        <Paper
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            borderRadius: 0,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              bgcolor: '#0f172a',
              '& .Mui-selected': { color: '#38bdf8 !important' },
              '& .MuiBottomNavigationAction-root': { color: '#94a3b8' }
            }}
          >
            <BottomNavigationAction label="Mapping" icon={<MapIcon />} />
            <BottomNavigationAction label="Forces" icon={<SpeedIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
