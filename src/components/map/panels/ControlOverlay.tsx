/**
 * @file ControlOverlay.tsx
 * @description UI overlay containing sliders and buttons to control the mapping visualizer state.
 */
import React from 'react';
import { Paper, Typography, Box, Slider, Button, Stack, Tooltip, alpha, useTheme } from '@mui/material';
import { darken } from '@mui/material/styles';
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
          p: 2, bgcolor: theme.palette.gui.primary, backdropFilter: 'blur(10px)', borderRadius: 3, color: theme.palette.common.white,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>{title}</Typography>
            {isLocked && (
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.status.primary.autonomous, textTransform: 'uppercase', letterSpacing: '0.08em' }}>● LIVE</Typography>
            )}
          </Box>
          <Stack spacing={2.5}>
            {showLocalRotation && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: theme.palette.map.grid, fontSize: '0.75rem' }}>Heading (°)</Typography>
                  <Typography sx={{ color: theme.palette.sim.manual, fontFamily: 'monospace', fontSize: '0.75rem' }}>{heading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={359} step={1}
                  value={heading}
                  onChange={(_, val) => dispatch(setASVHeading(val as number))}
                  disabled={isLocked}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v}°`}
                  sx={{ color: theme.palette.map.drag }}
                />
              </Box>
            )}
            {showVelocity && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: theme.palette.map.grid, fontSize: '0.75rem' }}>Velocity</Typography>
                  <Typography sx={{ color: theme.palette.map.yAxis, fontFamily: 'monospace', fontSize: '0.75rem' }}>{speed.toFixed(2)}</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={velocityMax} step={0.01}
                  value={speed}
                  onChange={(_, val) => dispatch(setASVSpeed(val as number))}
                  disabled={isLocked}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => v.toFixed(2)}
                  sx={{ color: theme.palette.map.yAxis }}
                />
              </Box>
            )}
            {showObjectHeading && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: theme.palette.map.grid, fontSize: '0.75rem' }}>Object Heading (°)</Typography>
                  <Typography sx={{ color: theme.palette.map.drag, fontFamily: 'monospace', fontSize: '0.75rem' }}>{heading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={359} step={1}
                  value={heading}
                  onChange={(_, val) => dispatch(setASVHeading(val as number))}
                  disabled={isLocked}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v}°`}
                  sx={{ color: theme.palette.map.drag }}
                />
              </Box>
            )}
            {showCurrentHeading && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: theme.palette.map.grid, fontSize: '0.75rem' }}>Current Heading (°)</Typography>
                  <Typography sx={{ color: theme.palette.sim.connecting, fontFamily: 'monospace', fontSize: '0.75rem' }}>{currentHeading}°</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={360} step={1}
                  value={currentHeading}
                  onChange={(_, val) => dispatch(setCurrentHeading(val as number))}
                  disabled={isLocked}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v}°`}
                  sx={{ color: theme.palette.map.current }}
                />
              </Box>
            )}
          </Stack>
        </Paper>
      )}

      {hasToggleControls && (
        <Paper sx={{
          p: 2, bgcolor: theme.palette.gui.primary, backdropFilter: 'blur(10px)', borderRadius: 3, color: theme.palette.common.white,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, fontSize: '0.75rem', textTransform: 'uppercase', color: theme.palette.primary.light }}>Visual Toggles</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {showGlobalGrid && (
              <Tooltip title="Toggle the global coordinate grid overlay" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowGlobalGrid(!gridEnabled))}
                  sx={{
                    bgcolor: gridEnabled ? 'primary.main' : theme.palette.gui.secondary,
                    color: gridEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: gridEnabled ? 'primary.dark' : theme.palette.gui.faint }
                  }}
                >
                  Global Grid
                </Button>
              </Tooltip>
            )}
            {showGlobalAxes && (
              <Tooltip title="Toggle the global X/Y origin axes" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowGlobalAxes(!globalAxesEnabled))}
                  sx={{
                    bgcolor: globalAxesEnabled ? 'primary.main' : theme.palette.gui.secondary,
                    color: globalAxesEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: globalAxesEnabled ? 'primary.dark' : theme.palette.gui.faint }
                  }}
                >
                  Global Axes
                </Button>
              </Tooltip>
            )}
            {showLocalAxes && (
              <Tooltip title="Toggle the vessel's local coordinate axes" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowLocalAxes(!axesEnabled))}
                  sx={{
                    bgcolor: axesEnabled ? 'primary.main' : theme.palette.gui.secondary,
                    color: axesEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: axesEnabled ? 'primary.dark' : theme.palette.gui.faint }
                  }}
                >
                  Local Axes
                </Button>
              </Tooltip>
            )}
            {showLocalGrid && (
              <Tooltip title="Toggle the fine-resolution local grid around the vessel" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowLocalGrid(!localGridEnabled))}
                  sx={{
                    bgcolor: localGridEnabled ? 'primary.main' : theme.palette.gui.secondary,
                    color: localGridEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: localGridEnabled ? 'primary.dark' : theme.palette.gui.faint }
                  }}
                >
                  Local Grid
                </Button>
              </Tooltip>
            )}
            {showLegend && (
              <Tooltip title="Toggle the map legend panel" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowLegend(!legendEnabled))}
                  sx={{
                    bgcolor: legendEnabled ? 'primary.main' : theme.palette.gui.secondary,
                    color: legendEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: legendEnabled ? 'primary.dark' : theme.palette.gui.faint }
                  }}
                >
                  Legend
                </Button>
              </Tooltip>
            )}
            {showCourseTrail && (
              <Tooltip title="Toggle the vessel's historical course trail" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowCourseTrail(!courseTrailEnabled))}
                  sx={{
                    bgcolor: courseTrailEnabled ? theme.palette.map.courseTrail : theme.palette.gui.secondary,
                    color: courseTrailEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: courseTrailEnabled ? darken(theme.palette.map.courseTrail, 0.2) : theme.palette.gui.faint }
                  }}
                >
                  Course Trail
                </Button>
              </Tooltip>
            )}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};
