/**
 * @file MappingVisualizer.tsx
 * @description The main container for the Mapping Visualizer, coordinating state between the canvas and controls.
 */
import React from 'react';
import {
  Box,
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
  IconButton
} from '@mui/material';
import { useGesture, useDrag } from '@use-gesture/react';
import { Map as MapView } from './Map';
import { useMapAnimation } from '../../hooks/useMapAnimation';
import { useAppSelector, useAppDispatch, type RootState } from '../../store';
import {
  setActiveTab,
  setCurrentHeading,
  setShowCompass
} from '../../store/slices/controlsSlice';

// Icons
import TuneIcon from '@mui/icons-material/Tune';
import SpeedIcon from '@mui/icons-material/Speed';
import MapIcon from '@mui/icons-material/Map';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExploreIcon from '@mui/icons-material/Explore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

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

  // Desktop layout when explicitly on desktop, or when mobile user enters landscape fullscreen
  const isDesktopMode = !isMobile || (isFullscreen && isLandscape);

  const {
    localRotation,
    velocity,
    activeTab,
    showLegend,
    showControls,
    showCompass,
    objectHeading,
    currentHeading
  } = useAppSelector((state: RootState) => state.controls);

  const { globalX, globalY, setGlobalX, setGlobalY } = useMapAnimation(velocity, localRotation);

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
    if (!flowSvgRef.current) return;
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
              mappingData={{ globalX, globalY, setGlobalX, setGlobalY }}
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
              {activeTab === 1 && (
                <ForceVectorsPanel objectHeading={objectHeading} currentRad={currentRad} currentSpeed={velocity ?? 0} />
              )}
              {activeTab === 1 && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.primary.light, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Vessel Heading</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="120" height="120">
                      <CompassRose cx={60} cy={60} radius={50} heading={objectHeading} />
                    </svg>
                  </Box>
                </Paper>
              )}
              <ControlOverlay
                title={activeTab === 1 ? "Simulation Params" : "Mapping Params"}
                showLocalRotation
                showVelocity
                showGlobalGrid
                showLocalAxes
                showLegend
                showObjectHeading={activeTab === 1}
                showCurrentHeading={activeTab === 1}
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
