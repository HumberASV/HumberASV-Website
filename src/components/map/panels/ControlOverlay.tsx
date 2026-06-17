/**
 * @file ControlOverlay.tsx
 * @description UI overlay containing sliders and buttons to control the mapping visualizer state.
 */
import React from 'react';
import { Paper, Typography, Box, Slider, Button, Stack, alpha, useTheme } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import {
  setCurrentHeading,
  setShowGlobalGrid, setShowGlobalAxes, setShowLocalAxes, setShowLocalGrid, setShowLegend, setShowCourseTrail,
} from '../../../store/slices/visualizerSlice';
import { setASVSpeed, setASVHeading } from '../../../store/slices/statusSlice';

interface ControlOverlayProps {
  showLocalRotation?: boolean;
  showVelocity?: boolean;
  showGlobalX?: boolean;
  showGlobalY?: boolean;
  showGlobalGrid?: boolean;
  showGlobalAxes?: boolean;
  showLocalAxes?: boolean;
  showLocalGrid?: boolean;
  showLegend?: boolean;
  showCourseTrail?: boolean;
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
  showGlobalAxes = false,
  showLocalAxes = false,
  showLocalGrid = false,
  showLegend = false,
  showCourseTrail = false,
  showObjectHeading = false,
  showCurrentHeading = false,
  velocityMax = 2,
  title = "Simulation Controls",
  isLocked = false,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const heading = useAppSelector(state => state.telemetry.asv.heading);
  const speed = useAppSelector(state => state.telemetry.asv.speed);
  const currentHeading = useAppSelector(state => state.controls.currentHeading);
  const gridEnabled = useAppSelector(state => state.controls.showGlobalGrid);
  const globalAxesEnabled = useAppSelector(state => state.controls.showGlobalAxes);
  const axesEnabled = useAppSelector(state => state.controls.showLocalAxes);
  const localGridEnabled = useAppSelector(state => state.controls.showLocalGrid);
  const legendEnabled = useAppSelector(state => state.controls.showLegend);
  const courseTrailEnabled = useAppSelector(state => state.controls.showCourseTrail);

  const hasMainControls = showLocalRotation || showVelocity || showObjectHeading || showCurrentHeading;
  const hasToggleControls = showGlobalGrid || showGlobalAxes || showLocalAxes || showLocalGrid || showLegend || showCourseTrail;

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
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Heading (°)</Typography>
                  <Typography sx={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.75rem' }}>{heading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={359} step={1}
                  value={heading}
                  onChange={(_, val) => dispatch(setASVHeading(val as number))}
                  disabled={isLocked}
                  sx={{ color: '#f59e0b' }}
                />
              </Box>
            )}
            {showVelocity && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Velocity</Typography>
                  <Typography sx={{ color: '#34d399', fontFamily: 'monospace', fontSize: '0.75rem' }}>{speed.toFixed(2)}</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={velocityMax} step={0.01}
                  value={speed}
                  onChange={(_, val) => dispatch(setASVSpeed(val as number))}
                  disabled={isLocked}
                  sx={{ color: '#10b981' }}
                />
              </Box>
            )}
            {showObjectHeading && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Object Heading (°)</Typography>
                  <Typography sx={{ color: '#fb923c', fontFamily: 'monospace', fontSize: '0.75rem' }}>{heading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={359} step={1}
                  value={heading}
                  onChange={(_, val) => dispatch(setASVHeading(val as number))}
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
            {showGlobalAxes && (
              <Button
                variant="contained" size="small"
                onClick={() => dispatch(setShowGlobalAxes(!globalAxesEnabled))}
                sx={{
                  bgcolor: globalAxesEnabled ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                  color: globalAxesEnabled ? 'white' : '#94a3b8',
                  fontSize: '0.75rem', textTransform: 'none',
                  '&:hover': { bgcolor: globalAxesEnabled ? 'primary.dark' : '#475569' }
                }}
              >
                Global Axes
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
            {showLocalGrid && (
              <Button
                variant="contained" size="small"
                onClick={() => dispatch(setShowLocalGrid(!localGridEnabled))}
                sx={{
                  bgcolor: localGridEnabled ? 'primary.main' : 'rgba(51, 65, 85, 0.9)',
                  color: localGridEnabled ? 'white' : '#94a3b8',
                  fontSize: '0.75rem', textTransform: 'none',
                  '&:hover': { bgcolor: localGridEnabled ? 'primary.dark' : '#475569' }
                }}
              >
                Local Grid
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
            {showCourseTrail && (
              <Button
                variant="contained" size="small"
                onClick={() => dispatch(setShowCourseTrail(!courseTrailEnabled))}
                sx={{
                  bgcolor: courseTrailEnabled ? '#b45309' : 'rgba(51, 65, 85, 0.9)',
                  color: courseTrailEnabled ? 'white' : '#94a3b8',
                  fontSize: '0.75rem', textTransform: 'none',
                  '&:hover': { bgcolor: courseTrailEnabled ? '#92400e' : '#475569' }
                }}
              >
                Course Trail
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};
