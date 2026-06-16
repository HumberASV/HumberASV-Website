/**
 * @file ControlOverlay.tsx
 * @description UI overlay containing sliders and buttons to control the mapping visualizer state.
 */
import React from 'react';
import { Paper, Typography, Box, Slider, Button, Stack, alpha, useTheme } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import {
  setLocalRotation, setVelocity, setObjectHeading, setCurrentHeading,
  setShowGlobalGrid, setShowLocalAxes, setShowLegend,
} from '../../../store/slices/controlsSlice';

interface ControlOverlayProps {
  showLocalRotation?: boolean;
  showVelocity?: boolean;
  showGlobalX?: boolean;
  showGlobalY?: boolean;
  showGlobalGrid?: boolean;
  showLocalAxes?: boolean;
  showLegend?: boolean;
  showObjectHeading?: boolean;
  showCurrentHeading?: boolean;
  velocityMax?: number;
  title?: string;
  /** When true, simulation sliders are disabled (live data is driving values). */
  isLocked?: boolean;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  showLocalRotation = false,
  showVelocity = false,
  showGlobalGrid = false,
  showLocalAxes = false,
  showLegend = false,
  showObjectHeading = false,
  showCurrentHeading = false,
  velocityMax = 2,
  title = "Simulation Controls",
  isLocked = false,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const localRotation = useAppSelector(state => state.controls.localRotation);
  const velocity = useAppSelector(state => state.controls.velocity);
  const objectHeading = useAppSelector(state => state.controls.objectHeading);
  const currentHeading = useAppSelector(state => state.controls.currentHeading);
  const gridEnabled = useAppSelector(state => state.controls.showGlobalGrid);
  const axesEnabled = useAppSelector(state => state.controls.showLocalAxes);
  const legendEnabled = useAppSelector(state => state.controls.showLegend);

  const hasMainControls = showLocalRotation || showVelocity || showObjectHeading || showCurrentHeading;
  const hasToggleControls = showGlobalGrid || showLocalAxes || showLegend;

  return (
    <Stack spacing={2}>
      {hasMainControls && (
        <Paper sx={{
          p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 3, color: 'white',
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>{title}</Typography>
            {isLocked && (
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>● LIVE</Typography>
            )}
          </Box>
          <Stack spacing={2.5}>
            {showLocalRotation && (
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
                  onChange={(_, val) => dispatch(setLocalRotation(val as number))}
                  disabled={isLocked}
                  sx={{ color: '#f59e0b' }}
                />
              </Box>
            )}
            {showVelocity && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Velocity</Typography>
                  <Typography sx={{ color: '#34d399', fontFamily: 'monospace', fontSize: '0.75rem' }}>{velocity.toFixed(2)}</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={velocityMax} step={0.01}
                  value={velocity}
                  onChange={(_, val) => dispatch(setVelocity(val as number))}
                  disabled={isLocked}
                  sx={{ color: '#10b981' }}
                />
              </Box>
            )}
            {showObjectHeading && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Object Heading (°)</Typography>
                  <Typography sx={{ color: '#fb923c', fontFamily: 'monospace', fontSize: '0.75rem' }}>{objectHeading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={360} step={1}
                  value={objectHeading}
                  onChange={(_, val) => dispatch(setObjectHeading(val as number))}
                  disabled={isLocked}
                  sx={{ color: '#f97316' }}
                />
              </Box>
            )}
            {showCurrentHeading && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Current Heading (°)</Typography>
                  <Typography sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.75rem' }}>{currentHeading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={360} step={1}
                  value={currentHeading}
                  onChange={(_, val) => dispatch(setCurrentHeading(val as number))}
                  disabled={isLocked}
                  sx={{ color: '#3b82f6' }}
                />
              </Box>
            )}
          </Stack>
        </Paper>
      )}

      {hasToggleControls && (
        <Paper sx={{
          p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 3, color: 'white',
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>Visual Toggles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {showGlobalGrid && (
              <Button
                variant="contained" size="small"
                onClick={() => dispatch(setShowGlobalGrid(!gridEnabled))}
                sx={{
                  bgcolor: gridEnabled ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                  color: gridEnabled ? 'white' : '#94a3b8',
                  fontSize: '0.75rem', textTransform: 'none',
                  '&:hover': { bgcolor: gridEnabled ? 'primary.dark' : '#475569' }
                }}
              >
                Global Grid
              </Button>
            )}
            {showLocalAxes && (
              <Button
                variant="contained" size="small"
                onClick={() => dispatch(setShowLocalAxes(!axesEnabled))}
                sx={{
                  bgcolor: axesEnabled ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                  color: axesEnabled ? 'white' : '#94a3b8',
                  fontSize: '0.75rem', textTransform: 'none',
                  '&:hover': { bgcolor: axesEnabled ? 'primary.dark' : '#475569' }
                }}
              >
                Local Axes
              </Button>
            )}
            {showLegend && (
              <Button
                variant="contained" size="small"
                onClick={() => dispatch(setShowLegend(!legendEnabled))}
                sx={{
                  bgcolor: legendEnabled ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                  color: legendEnabled ? 'white' : '#94a3b8',
                  fontSize: '0.75rem', textTransform: 'none',
                  '&:hover': { bgcolor: legendEnabled ? 'primary.dark' : '#475569' }
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
