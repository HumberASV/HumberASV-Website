/**
 * @file ControlOverlay.tsx
 * @description UI overlay containing sliders and buttons to control the mapping visualizer state.
 * 
 * @remarks
 * This component provides a user interface overlay for controlling various aspects of the mapping visualizer, including heading and velocity sliders, as well as toggle buttons for visual elements like grids, axes, legends, course trails, and fog of war.
 * It uses Material-UI components for styling and layout, and interacts with the Redux store to read and update the application state.
 * The overlay can be configured to show or hide specific controls based on the provided props.
 */
import React from 'react';
import { Paper, Typography, Box, Slider, Button, Stack, Tooltip, alpha, useTheme } from '@mui/material';
import { darken } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { setCurrentHeading, setCurrentSpeed } from '../../store/slices/simulationSlice';
import {
  setShowGlobalGrid, setShowGlobalAxes, setShowLocalAxes, setShowLocalGrid,
  setShowLegend, setShowCourseTrail, setShowFogOfWar,
} from '../../store/slices/visualizationSlice';
import { setASVSpeed, setASVHeading } from '../../store/slices/telemetrySlice';

/**
 * @interface ControlOverlayProps
 * @description Properties for the {@link ControlOverlay} component.
 * @see {@link ControlOverlay}
 * @property {boolean} [showLocalRotation] - If true, shows the local rotation (heading) slider.
 * @property {boolean} [showVelocity] - If true, shows the velocity slider.
 * @property {boolean} [showGlobalX] - If true, shows the global X-axis toggle button.
 * @property {boolean} [showGlobalY] - If true, shows the global Y-axis toggle button.
 * @property {boolean} [showGlobalGrid] - If true, shows the global grid toggle button.
 * @property {boolean} [showGlobalAxes] - If true, shows the global axes toggle button.
 * @property {boolean} [showLocalAxes] - If true, shows the local axes toggle button.
 * @property {boolean} [showLocalGrid] - If true, shows the local grid toggle button.
 * @property {boolean} [showLegend] - If true, shows the legend toggle button.
 * @property {boolean} [showCourseTrail] - If true, shows the course trail toggle button.
 * @property {boolean} [showFogOfWar] - If true, shows the fog of war toggle button.
 * @property {boolean} [showObjectHeading] - If true, shows the object heading slider.
 * @property {boolean} [showCurrentHeading] - If true, shows the current heading slider.
 * @property {boolean} [showCurrentSpeed] - If true, shows the current speed slider.
 * @property {number} [velocityMax] - The maximum value for the velocity slider. Defaults to 2 m/s.
 * @property {string} [title] - The title displayed at the top of the overlay. Defaults to "Simulation Controls".
 * @property {boolean} [isLocked] - When true, disables sliders (live data is driving values). Defaults to false.
 */
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
  showFogOfWar?: boolean;
  showObjectHeading?: boolean;
  showCurrentHeading?: boolean;
  showCurrentSpeed?: boolean;
  velocityMax?: number;
  title?: string;
  /** When true, simulation sliders are disabled (live data is driving values). */
  isLocked?: boolean;
}
/**
 * @component ControlOverlay
 * @description UI overlay containing sliders and buttons to control the mapping visualizer state.
 * @param {ControlOverlayProps} props - Properties for the component.
 * @remarks
 * The ControlOverlay component provides a user interface overlay for controlling various aspects of the mapping visualizer, 
 * including heading and velocity sliders, as well as toggle buttons for visual elements like grids, axes, legends,
 *  course trails, and fog of war.
 */
export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  showLocalRotation = false,
  showVelocity = false,
  showGlobalGrid = false,
  showGlobalAxes = false,
  showLocalAxes = false,
  showLocalGrid = false,
  showLegend = false,
  showCourseTrail = false,
  showFogOfWar = false,
  showObjectHeading = false,
  showCurrentHeading = false,
  showCurrentSpeed = false,
  velocityMax = 2,
  title = "Simulation Controls",
  isLocked = false,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Read values from the Redux store
  const heading = useAppSelector(state => state.telemetry.asv.heading);
  const speed = useAppSelector(state => state.telemetry.asv.speed);
  const currentHeading = useAppSelector(state => state.simulation.currentHeading);
  const currentSpeed = useAppSelector(state => state.simulation.currentSpeed);
  const gridEnabled = useAppSelector(state => state.visualization.showGlobalGrid);
  const globalAxesEnabled = useAppSelector(state => state.visualization.showGlobalAxes);
  const axesEnabled = useAppSelector(state => state.visualization.showLocalAxes);
  const localGridEnabled = useAppSelector(state => state.visualization.showLocalGrid);
  const legendEnabled = useAppSelector(state => state.visualization.showLegend);
  const courseTrailEnabled = useAppSelector(state => state.visualization.showCourseTrail);
  const fogOfWarEnabled = useAppSelector(state => state.visualization.showFogOfWar);

  const hasMainControls = showLocalRotation || showVelocity || showObjectHeading || showCurrentHeading || showCurrentSpeed;
  const hasToggleControls = showGlobalGrid || showGlobalAxes || showLocalAxes || showLocalGrid || showLegend || showCourseTrail || showFogOfWar;

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
            {showCurrentSpeed && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ color: theme.palette.map.grid, fontSize: '0.75rem' }}>Current Speed (m/s)</Typography>
                  <Typography sx={{ color: theme.palette.map.current, fontFamily: 'monospace', fontSize: '0.75rem' }}>{currentSpeed.toFixed(1)}</Typography>
                </Box>
                <Slider
                  size="small" min={0} max={5} step={0.1}
                  value={currentSpeed}
                  onChange={(_, val) => dispatch(setCurrentSpeed(val as number))}
                  disabled={isLocked}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v.toFixed(1)} m/s`}
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
            {showFogOfWar && (
              <Tooltip title="Toggle fog of war (hides unvisited cells)" placement="top">
                <Button
                  variant="contained" size="small"
                  onClick={() => dispatch(setShowFogOfWar(!fogOfWarEnabled))}
                  sx={{
                    bgcolor: fogOfWarEnabled ? theme.palette.scene.skyDark : theme.palette.gui.secondary,
                    color: fogOfWarEnabled ? theme.palette.common.white : theme.palette.gui.muted,
                    fontSize: '0.75rem', textTransform: 'none',
                    '&:hover': { bgcolor: fogOfWarEnabled ? darken(theme.palette.scene.skyDark, 0.2) : theme.palette.gui.faint }
                  }}
                >
                  Fog of War
                </Button>
              </Tooltip>
            )}
          </Box>
        </Paper>
      )}
    </Stack>
  );
};
