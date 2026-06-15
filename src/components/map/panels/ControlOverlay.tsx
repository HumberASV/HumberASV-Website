/**
 * @file ControlOverlay.tsx
 * @description UI overlay containing sliders and buttons to control the mapping visualizer state.
 */
import React from 'react';
import { Paper, Typography, Box, Slider, Button, Stack, alpha, useTheme } from '@mui/material';
import { GLOBAL_GRID_SIZE } from '../../../utils/telemetry/mapUtils';

/**
 * Props for the ControlOverlay component.
 */
interface ControlOverlayProps {
  localRotation?: number;
  setLocalRotation?: (val: number) => void;
  velocity?: number;
  setVelocity?: (val: number) => void;
  globalX?: number;
  setGlobalX?: (val: number) => void;
  globalY?: number;
  setGlobalY?: (val: number) => void;
  showGlobalGrid?: boolean;
  setShowGlobalGrid?: (val: boolean) => void;
  showLocalAxes?: boolean;
  setShowLocalAxes?: (val: boolean) => void;
  showLegend?: boolean;
  setShowLegend?: (val: boolean) => void;
  objectHeading?: number;
  setObjectHeading?: (val: number) => void;
  currentHeading?: number;
  setCurrentHeading?: (val: number) => void;
  velocityMax?: number;
  title?: string;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  localRotation, setLocalRotation,
  velocity, setVelocity,
  globalX, setGlobalX,
  globalY, setGlobalY,
  showGlobalGrid, setShowGlobalGrid,
  showLocalAxes, setShowLocalAxes,
  showLegend, setShowLegend,
  objectHeading, setObjectHeading,
  currentHeading, setCurrentHeading,
  velocityMax = 2,
  title = "Simulation Controls"
}) => {
  const theme = useTheme();

  return (
    <Stack spacing={2}>
      {/* Main Controls Panel */}
      <Paper sx={{ 
        p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 3, color: 'white',
        border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>{title}</Typography>
        <Stack spacing={2.5}>
          {setLocalRotation && localRotation !== undefined && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Rotation (°)</Typography>
                <Typography sx={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {localRotation < 0 ? 360 + localRotation : localRotation}°
                </Typography>
              </Box>
              <Slider
                size="small" min={-180} max={180} step={5}
                value={localRotation}
                onChange={(_, val) => setLocalRotation(val as number)}
                sx={{ color: '#f59e0b' }}
              />
            </Box>
          )}
          {setVelocity && velocity !== undefined && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Velocity</Typography>
                <Typography sx={{ color: '#34d399', fontFamily: 'monospace', fontSize: '0.75rem' }}>{velocity.toFixed(2)}</Typography>
              </Box>
              <Slider
                size="small" min={0} max={velocityMax} step={0.01}
                value={velocity}
                onChange={(_, val) => setVelocity(val as number)}
                sx={{ color: '#10b981' }}
              />
            </Box>
          )}
          {setObjectHeading && objectHeading !== undefined && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Object Heading (°)</Typography>
                <Typography sx={{ color: '#fb923c', fontFamily: 'monospace', fontSize: '0.75rem' }}>{objectHeading}°</Typography>
              </Box>
              <Slider
                size="small" min={0} max={360} step={1}
                value={objectHeading}
                onChange={(_, val) => setObjectHeading(val as number)}
                sx={{ color: '#f97316' }}
              />
            </Box>
          )}
          {setCurrentHeading && currentHeading !== undefined && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Current Heading (°)</Typography>
                <Typography sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.75rem' }}>{currentHeading}°</Typography>
              </Box>
              <Slider
                size="small" min={0} max={360} step={1}
                value={currentHeading}
                onChange={(_, val) => setCurrentHeading(val as number)}
                sx={{ color: '#3b82f6' }}
              />
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Positioning & Stats Panel */}
      {globalX !== undefined && globalY !== undefined && (
        <Paper sx={{ 
          p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 3, color: 'white',
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>Positioning</Typography>
          <Stack spacing={2}>
            {setGlobalX && setGlobalY && (
              <>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>X Position</Typography>
                    <Typography sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.75rem' }}>{globalX.toFixed(1)}</Typography>
                  </Box>
                  <Slider
                    size="small" min={0} max={GLOBAL_GRID_SIZE} step={0.1}
                    value={globalX}
                    onChange={(_, val) => setGlobalX(val as number)}
                    sx={{ color: '#3b82f6' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Y Position</Typography>
                    <Typography sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.75rem' }}>{globalY.toFixed(1)}</Typography>
                  </Box>
                  <Slider
                    size="small" min={0} max={GLOBAL_GRID_SIZE} step={0.1}
                    value={globalY}
                    onChange={(_, val) => setGlobalY(val as number)}
                    sx={{ color: '#3b82f6' }}
                  />
                </Box>
              </>
            )}
            
            <Box sx={{ pt: 1, borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
              <Stack spacing={0.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>Global Frame:</Typography>
              <Typography sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.75rem' }}>10×10 units</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>Position:</Typography>
              <Typography sx={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.75rem' }}>({globalX.toFixed(1)}, {globalY.toFixed(1)})</Typography>
            </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}

      {(setShowGlobalGrid || setShowLocalAxes || setShowLegend) && (
        <Paper sx={{ 
          p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 3, color: 'white',
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>Visual Toggles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {setShowGlobalGrid && showGlobalGrid !== undefined && (
            <Button
              variant="contained" size="small"
              onClick={() => setShowGlobalGrid(!showGlobalGrid)}
              sx={{ 
                bgcolor: showGlobalGrid ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                color: showGlobalGrid ? 'white' : '#94a3b8',
                fontSize: '0.75rem', textTransform: 'none',
                '&:hover': { bgcolor: showGlobalGrid ? 'primary.dark' : '#475569' }
              }}
            >
              Global Grid
            </Button>
          )}
          {setShowLocalAxes && showLocalAxes !== undefined && (
            <Button
              variant="contained" size="small"
              onClick={() => setShowLocalAxes(!showLocalAxes)}
              sx={{ 
                bgcolor: showLocalAxes ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                color: showLocalAxes ? 'white' : '#94a3b8',
                fontSize: '0.75rem', textTransform: 'none',
                '&:hover': { bgcolor: showLocalAxes ? 'primary.dark' : '#475569' }
              }}
            >
              Local Axes
            </Button>
          )}
          {setShowLegend && showLegend !== undefined && (
            <Button
              variant="contained" size="small"
              onClick={() => setShowLegend(!showLegend)}
              sx={{ 
                bgcolor: showLegend ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                color: showLegend ? 'white' : '#94a3b8',
                fontSize: '0.75rem', textTransform: 'none',
                '&:hover': { bgcolor: showLegend ? 'primary.dark' : '#475569' }
              }}
            >
              Legend
            </Button>
          )}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};