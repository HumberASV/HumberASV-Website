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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExploreIcon from '@mui/icons-material/Explore';


// HUD Components
import { Legend } from './panels/Legend';
import { ControlOverlay } from './panels/ControlOverlay';
import { ForceVectorsPanel } from './panels/ForceVectorsPanel';
import { CompassRose } from './svg/CompassRose';
import { DirectionButtons } from './svg/DirectionButtons';

/**
 * MappingVisualizer component.
 * Handles the animation loop for movement based on velocity and rotation.
 */
export default function MappingVisualizer() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [controlsDrawerOpen, setControlsDrawerOpen] = React.useState(false);

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

  // Interactive Viewport State (Zoom & Pan)
  const [viewOffset, setViewOffset] = React.useState({ x: 0, y: 0 });
  const [userScale, setUserScale] = React.useState(1);
  const [isPanning, setIsPanning] = React.useState(false);

  /**
   * Flow Control Dragging logic
   * This handles rotating the flow direction by dragging on the compass rose.
   */
  const flowSvgRef = React.useRef<SVGSVGElement>(null);
  const [isDraggingHeading, setIsDraggingHeading] = React.useState(false);
  const [flowOffset, setFlowOffset] = React.useState({ x: 0, y: 0 });
  const [isDraggingOverlay, setIsDraggingOverlay] = React.useState(false);
  const overlayDragStartRef = React.useRef({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const lastTapRef = React.useRef<number>(Date.now());
  const pointersRef = React.useRef<Map<number, { x: number, y: number }>>(new Map());
  const lastPosRef = React.useRef({ x: 0, y: 0 });
  const initialDistRef = React.useRef<number | null>(null);
  const initialScaleRef = React.useRef(1);

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setUserScale(prev => Math.max(0.1, Math.min(prev * delta, 10)));
  }, []);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    if (isDraggingHeading) return;

    // Double-tap/click gesture detection for view reset
    const now = Date.now();
    const DOUBLE_TAP_THRESHOLD = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_THRESHOLD && pointersRef.current.size === 0) {
      setViewOffset({ x: 0, y: 0 });
      setUserScale(1);
      lastTapRef.current = 0; // Prevent consecutive reset loops
      return;
    }
    lastTapRef.current = now;

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    
    if (pointersRef.current.size === 1) {
      setIsPanning(true);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } else if (pointersRef.current.size === 2) {
      setIsPanning(false);
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      initialDistRef.current = dist;
      initialScaleRef.current = userScale;
    }
  }, [isDraggingHeading, userScale]);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    
    if (pointersRef.current.size === 1 && isPanning) {
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      setViewOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    } else if (pointersRef.current.size === 2 && initialDistRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const scaleFactor = dist / initialDistRef.current;
      setUserScale(Math.max(0.1, Math.min(initialScaleRef.current * scaleFactor, 10)));
    }
  }, [isPanning]);

  const handlePointerUp = React.useCallback((e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) {
      setIsPanning(false);
    } else if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      if (remaining) lastPosRef.current = { x: remaining.x, y: remaining.y };
      setIsPanning(true);
    }
    initialDistRef.current = null;
  }, []);

  const updateHeadingFromCoords = React.useCallback((clientX: number, clientY: number) => {
    if (!flowSvgRef.current) return;
    const rect = flowSvgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let heading = (Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI) + 90;
    heading = (Math.round(heading) + 360) % 360;
    dispatch(setCurrentHeading(heading));
  }, [dispatch]);

  React.useEffect(() => {
    const handleGlobalMove = (e: PointerEvent) => {
      if (isDraggingHeading) updateHeadingFromCoords(e.clientX, e.clientY);
    };
    const handleGlobalUp = () => setIsDraggingHeading(false);

    if (isDraggingHeading) {
      window.addEventListener('pointermove', handleGlobalMove);
      window.addEventListener('pointerup', handleGlobalUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('pointerup', handleGlobalUp);
    };
  }, [isDraggingHeading, updateHeadingFromCoords]);

  // Derived vectors for panel
  const currentRad = (currentHeading || 0) * Math.PI / 180;

  // Define consistent dimensions and scale to maximize the visual area
  // Using 16:9 for desktop and 4:3 for mobile
  const mapWidth = isMobile ? 800 : 1600;
  const mapHeight = isMobile ? 600 : 900;
  // Scale adjusted to fill the frame better
  const mapScale = isMobile ? 0.9 : 1.25;

  // Responsive sizing for the interactive flow controller to ensure touch targets are sufficient for mobile users
  const flowControlSize = isMobile ? 180 : 140;
  const flowCenter = flowControlSize / 2;
  const flowOuterRadius = flowCenter - (isMobile ? 12 : 10);
  const flowInnerRadius = flowOuterRadius * 0.75;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#0f172a', 
        py: { xs: 2, md: 3 }, 
        px: { xs: 0, sm: 2, md: 4 }, 
        pb: { xs: 10, md: 6 } // Extra padding for sticky nav
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 0, sm: 4 }, maxWidth: '1800px' }}>
        <Stack spacing={2}>
          {/* Tabs Section - Centered for better balance */}
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'center', px: { xs: 2, sm: 0 } }}>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ bgcolor: '#1e293b', borderRadius: 2, '& .MuiTabs-indicator': { backgroundColor: '#38bdf8' } }}>
                <Tab label="Coordinate Mapping" sx={{ color: '#94a3b8', '&.Mui-selected': { color: '#38bdf8' } }} />
                <Tab label="Force Simulation" sx={{ color: '#94a3b8', '&.Mui-selected': { color: '#38bdf8' } }} />
              </Tabs>
            </Box>
          )}

          {/* Top Section: Primary Visualizer Canvas */}
          <Box 
            ref={containerRef}
            sx={{ 
              position: 'relative', 
              bgcolor: '#1e293b', 
              borderRadius: { xs: 0, sm: 3 }, 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
              border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)',
              aspectRatio: { xs: '4/3', md: '16/9' },
              maxHeight: '70vh'
            }}
          >
            {/* Overlayed Legend Accordion - Top Left (Desktop Only) */}
            {!isMobile && showLegend && (
              <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10, width: 240 }}>
                <Accordion 
                  sx={{ 
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
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    sx={{ '& .MuiAccordionSummary-content': { my: 1 } }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.primary.light }}>
                      System Legend
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2, pt: 0 }}>
                    <Legend variant={activeTab === 1 ? 'forces' : 'mapping'} disablePaper hideTitle />
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {/* Overlayed Title - Bottom Left */}
            <Box sx={{ position: 'absolute', bottom: { xs: 16, md: 24 }, left: { xs: 16, md: 24 }, zIndex: 10, pointerEvents: 'none' }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                System Visualizer v2
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 1)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', display: 'block' }}>
                Global-Local Coordinate Mapping
              </Typography>
            </Box>

            {/* Controls Trigger & Reset View - Overlayed on Map */}
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
              {(viewOffset.x !== 0 || viewOffset.y !== 0 || userScale !== 1) && (
                <IconButton
                  onClick={() => { setViewOffset({ x: 0, y: 0 }); setUserScale(1); }}
                  sx={{ bgcolor: 'rgba(15, 23, 42, 0.9)', color: '#fbbf24', border: '1px solid', borderColor: 'divider', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(30, 41, 59, 1)' } }}
                  title="Reset View"
                >
                  <RestartAltIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              )}
              {activeTab === 1 && (
                <IconButton
                  onClick={() => dispatch(setShowCompass(!showCompass))}
                  sx={{ 
                    bgcolor: 'rgba(15, 23, 42, 0.9)', 
                    color: showCompass ? '#38bdf8' : '#94a3b8', 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    backdropFilter: 'blur(4px)', 
                    '&:hover': { bgcolor: 'rgba(30, 41, 59, 1)' } 
                  }}
                  title="Toggle Flow Control"
                >
                  <ExploreIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              )}
              {showControls && (
                <IconButton
                  onClick={() => setControlsDrawerOpen(true)}
                  sx={{ bgcolor: 'rgba(15, 23, 42, 0.9)', color: '#38bdf8', border: '1px solid', borderColor: 'divider', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(30, 41, 59, 1)' } }}
                >
                  <TuneIcon fontSize={isMobile ? 'small' : 'medium'} />
                </IconButton>
              )}
            </Stack>

        <MapView 
              width={mapWidth}
              height={mapHeight}
              scale={mapScale * userScale}
              offset={viewOffset}
              interactionProps={{
                onWheel: handleWheel,
                onPointerDown: handlePointerDown,
                onPointerMove: handlePointerMove,
                onPointerUp: handlePointerUp,
                onPointerCancel: handlePointerUp,
                onDoubleClick: () => { setViewOffset({ x: 0, y: 0 }); setUserScale(1); }
              }}
              mappingData={{ globalX, globalY, setGlobalX, setGlobalY }} 
            />

            {/* Flow Control Overlay (Interactive) */}
            {activeTab === 1 && showCompass && (
              <Box 
                ref={overlayRef}
                onPointerDown={(e) => {
                  // Stop map panning when interacting with overlay
                  e.stopPropagation(); 
                  setIsDraggingOverlay(true);
                  overlayDragStartRef.current = { x: e.clientX - flowOffset.x, y: e.clientY - flowOffset.y };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!isDraggingOverlay || !containerRef.current || !overlayRef.current) return;
                  
                  const targetX = e.clientX - overlayDragStartRef.current.x;
                  const targetY = e.clientY - overlayDragStartRef.current.y;
                  
                  const container = containerRef.current.getBoundingClientRect();
                  const overlay = overlayRef.current.getBoundingClientRect();
                  
                  // Calculate where the overlay would be at zero offset
                  const initialLeft = overlay.left - flowOffset.x;
                  const initialTop = overlay.top - flowOffset.y;
                  
                  // Clamp boundaries based on the parent container dimensions
                  const minX = container.left - initialLeft;
                  const maxX = container.right - initialLeft - overlay.width;
                  const minY = container.top - initialTop;
                  const maxY = container.bottom - initialTop - overlay.height;
                  
                  setFlowOffset({
                    x: Math.max(minX, Math.min(targetX, maxX)),
                    y: Math.max(minY, Math.min(targetY, maxY))
                  });
                }}
                onPointerUp={(e) => {
                  setIsDraggingOverlay(false);
                  try {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  } catch { /* ignore */ }

                  if (!containerRef.current || !overlayRef.current) return;
                  
                  const container = containerRef.current.getBoundingClientRect();
                  const overlay = overlayRef.current.getBoundingClientRect();
                  
                  // Calculate the boundaries relative to the starting position (0,0 offset)
                  const initialLeft = overlay.left - flowOffset.x;
                  const initialTop = overlay.top - flowOffset.y;
                  
                  const minX = container.left - initialLeft;
                  const maxX = container.right - initialLeft - overlay.width;
                  const minY = container.top - initialTop;
                  const maxY = container.bottom - initialTop - overlay.height;

                  // Logic: determine which corner is closest and snap to it
                  const snapX = Math.abs(flowOffset.x - minX) < Math.abs(flowOffset.x - maxX) ? minX : maxX;
                  const snapY = Math.abs(flowOffset.y - minY) < Math.abs(flowOffset.y - maxY) ? minY : maxY;
                  
                  setFlowOffset({ x: snapX, y: snapY });
                }}
                sx={{ 
                  position: 'absolute', 
                  bottom: { xs: 12, md: 24 }, 
                  right: { xs: 12, md: 24 }, 
                  zIndex: 10, 
                  bgcolor: 'rgba(15, 23, 42, 0.85)', 
                  p: isMobile ? 1.5 : 2, 
                  borderRadius: 2, 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)', 
                  textAlign: 'center',
                  transform: `translate(${flowOffset.x}px, ${flowOffset.y}px)`,
                  transition: isDraggingOverlay ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: isDraggingOverlay ? 'grabbing' : 'grab',
                  touchAction: 'none'
                }}
              >
                <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 800, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flow Control</Typography>
                <svg 
                  ref={flowSvgRef} 
                  width={flowControlSize} height={flowControlSize} 
                  style={{ cursor: isDraggingHeading ? 'grabbing' : 'crosshair', touchAction: 'none' }} 
                  onPointerDown={(e) => { e.stopPropagation(); setIsDraggingHeading(true); updateHeadingFromCoords(e.clientX, e.clientY); }}
                >
                  <DirectionButtons cx={flowCenter} cy={flowCenter} radius={flowOuterRadius} currentHeading={currentHeading} onSelect={(val) => dispatch(setCurrentHeading(val))} />
                  <CompassRose cx={flowCenter} cy={flowCenter} radius={flowInnerRadius} heading={currentHeading} color={theme.palette.info.main} />
                </svg>
              </Box>)}
          </Box>

          {/* Bottom Section: Dashboard Controls & Info */}
          <Stack spacing={3} sx={{ px: { xs: 2, sm: 0 } }}>
            <Grid container spacing={3} alignItems="stretch">
              {/* Info Column: Legend */}
              <Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{ display: { xs: 'block', md: 'none' } }}>
                {showLegend && <Legend variant={activeTab === 1 ? 'forces' : 'mapping'} />}
              </Grid>
              
              {/* Simulation Column: Force Analysis */}
              {activeTab === 1 && (
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <ForceVectorsPanel objectHeading={objectHeading} currentRad={currentRad} currentSpeed={velocity ?? 0} />
                </Grid>
              )}

              {/* Navigation Column: Dedicated Compass */}
              {activeTab === 1 && showCompass && !isMobile && (
                <Grid size={{ xs: 12, md: 12, lg: 4 }}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.primary.light, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Vessel Heading</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                      <svg width="120" height="120">
                        <CompassRose cx={60} cy={60} radius={50} heading={objectHeading} />
                      </svg>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Stack>
        </Stack>

        {/* Right-Side Controls Drawer (Overlays the visual) */}
        <Drawer
          anchor="right"
          open={controlsDrawerOpen}
          onClose={() => setControlsDrawerOpen(false)}
          slotProps={{
            backdrop: {
              sx: { bgcolor: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(2px)' }
            },
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
            <ControlOverlay
              title={activeTab === 1 ? "Simulation Params" : "Mapping Params"}
              showLocalRotation={activeTab === 0}
              showVelocity
              showGlobalGrid
              showLocalAxes
              showLegend
              showObjectHeading={activeTab === 1}
              showCurrentHeading={activeTab === 1}
            />
          </Box>
        </Drawer>
      </Container>

      {/* Mobile Sticky Bottom Navigation */}
      {isMobile && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
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
