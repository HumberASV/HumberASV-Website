
/**
 * @file ControlsDrawer.tsx
 * @description Drawer panel for controlling the ASV visualizer. Contains simulation mode toggles, connection status, and other control options.
 * @author Carson Fujita
 * @license MIT
 */
import React from 'react';
import {
    Drawer, Box, Typography, Stack, Paper, Button, Switch,
    Tooltip, IconButton, CircularProgress, useTheme, alpha,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WifiIcon from '@mui/icons-material/Wifi';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSimMode, setCurrentHeading } from '../../store/slices/simulationSlice';
import { selectActiveScene } from '../../store/slices/sceneSlice';
import { setASVHeading } from '../../store/slices/telemetrySlice';
import { retryConnection } from '../../store/actions/connectionActions';
import { ForceVectorsPanel } from './ForceVectorsPanel';
import { ControlOverlay } from './ControlOverlay';
import { InteractiveCompass } from '../svg/CompassRose';
import { TELEMETRY_WS_URL } from '../../config/connection';

/**
 * @interface ControlsDrawerProps
 * @description Properties for the {@link ControlsDrawer} component.
 * @see {@link ControlsDrawer}
 * @property {boolean} open - Whether the drawer is open or closed.
 * @property {() => void} onClose - Callback function to close the drawer.
 * @property {() => void} onRegenerateMap - Callback function to regenerate the map and BFS path.
 */
export interface ControlsDrawerProps {
    open: boolean;
    onClose: () => void;
    onRegenerateMap: () => void;
}
/**
 * @component ControlsDrawer
 * @description Drawer panel for controlling the ASV visualizer. Contains simulation mode toggles, connection status, and other control options.
 * @param {ControlsDrawerProps} props - Properties for the component.
 * @remarks
 * The ControlsDrawer component provides a side panel for controlling various aspects of the ASV visualizer, including simulation mode toggles, connection status, and other control options.
 * It uses Material-UI components for styling and layout, and interacts with the Redux store to read and update the application state.
 * The drawer can be opened or closed based on the `open` prop, and provides callback functions for closing the drawer and regenerating the map.
 * @example
 * <ControlsDrawer
 *  open={isDrawerOpen}
 *  onClose={() => setIsDrawerOpen(false)}
 *  onRegenerateMap={handleRegenerateMap}
 * />
 */
export const ControlsDrawer: React.FC<ControlsDrawerProps> = ({ open, onClose, onRegenerateMap }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const connectionStatus = useAppSelector(state => state.connection.status);
    const simMode = useAppSelector(state => state.simulation.simMode);
    const activeSceneId = useAppSelector(selectActiveScene);
    const asvHeading = useAppSelector(state => state.telemetry.asv.heading);
    const asvSpeed = useAppSelector(state => state.telemetry.asv.speed);
    const currentHeading = useAppSelector(state => state.simulation.currentHeading);

    const isConnected = connectionStatus === 'connected';
    const autoSimActive = !isConnected && simMode === 'automatic';
    const currentRad = (currentHeading || 0) * Math.PI / 180;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: { sx: { bgcolor: alpha(theme.palette.scene.skyDark, 0.3) } },
                paper: {
                    sx: {
                        width: { xs: '100%', sm: 360 },
                        bgcolor: theme.palette.scene.skyDark,
                        color: theme.palette.common.white,
                        borderLeft: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                        backgroundImage: 'none',
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                    },
                },
            }}
        >
            <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>System Configuration</Typography>
                <Tooltip title="Close" placement="left">
                    <IconButton onClick={onClose} sx={{ color: theme.palette.common.white }}>
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                <Stack spacing={2}>
                    {!isConnected && (
                        <Paper sx={{ p: 2, bgcolor: theme.palette.gui.primary, borderRadius: 2, border: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.gui.subtle, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                                Simulation Mode
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: autoSimActive ? theme.palette.sim.auto : theme.palette.sim.manual }}>
                                        {autoSimActive ? 'Automatic' : 'Manual'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.gui.subtle }}>
                                        {autoSimActive
                                            ? 'Vessel follows the planned BFS path'
                                            : 'Control speed and heading via sliders'}
                                    </Typography>
                                </Box>
                                <Tooltip title={autoSimActive ? 'Switch to manual control' : 'Switch to automatic'} placement="left">
                                    <Switch
                                        checked={autoSimActive}
                                        onChange={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.sim.auto },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: theme.palette.sim.auto },
                                            '& .MuiSwitch-switchBase': { color: theme.palette.sim.manual },
                                            '& .MuiSwitch-track': { bgcolor: theme.palette.sim.manual },
                                        }}
                                    />
                                </Tooltip>
                            </Box>
                        </Paper>
                    )}

                    {!isConnected && (
                        <Paper sx={{ p: 2, bgcolor: theme.palette.gui.primary, borderRadius: 2, border: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.gui.subtle, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                                Simulation Data
                            </Typography>
                            <Tooltip title="Generate a new obstacle map, noise field, and BFS path" placement="top">
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<AutorenewIcon />}
                                    onClick={onRegenerateMap}
                                    sx={{
                                        color: theme.palette.sim.auto,
                                        borderColor: alpha(theme.palette.sim.auto, 0.4),
                                        '&:hover': { borderColor: theme.palette.sim.auto, bgcolor: alpha(theme.palette.sim.auto, 0.08) },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Regenerate Map
                                </Button>
                            </Tooltip>
                            <Typography variant="caption" sx={{ color: theme.palette.gui.faint, display: 'block', mt: 1 }}>
                                New Gaussian noise field, obstacle islands, and BFS path
                            </Typography>
                        </Paper>
                    )}

                    <Paper sx={{ p: 2, bgcolor: theme.palette.gui.primary, borderRadius: 2, border: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.gui.subtle, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                            Basestation Connection
                        </Typography>
                        <Tooltip
                            title={isConnected ? 'Re-establish the WebSocket connection' : connectionStatus === 'connecting' ? 'Connection in progress…' : 'Connect to the basestation WebSocket'}
                            placement="top"
                        >
                            <span>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled={connectionStatus === 'connecting'}
                                    startIcon={connectionStatus === 'connecting'
                                        ? <CircularProgress size={14} sx={{ color: theme.palette.sim.connecting }} />
                                        : <WifiIcon />}
                                    onClick={() => { dispatch(retryConnection()); onClose(); }}
                                    sx={{
                                        color: isConnected ? theme.palette.status.primary.autonomous : theme.palette.sim.connecting,
                                        borderColor: isConnected ? alpha(theme.palette.status.primary.autonomous, 0.4) : alpha(theme.palette.sim.connecting, 0.4),
                                        '&:hover': {
                                            borderColor: isConnected ? theme.palette.status.primary.autonomous : theme.palette.sim.connecting,
                                            bgcolor: isConnected ? alpha(theme.palette.status.primary.autonomous, 0.08) : alpha(theme.palette.sim.connecting, 0.08),
                                        },
                                        '&.Mui-disabled': { color: theme.palette.sim.connecting, borderColor: alpha(theme.palette.sim.connecting, 0.2) },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        width: '100%',
                                    }}
                                >
                                    {isConnected ? 'Reconnect' : connectionStatus === 'connecting' ? 'Connecting…' : 'Connect to Basestation'}
                                </Button>
                            </span>
                        </Tooltip>
                        <Typography variant="caption" sx={{ color: theme.palette.gui.faint, display: 'block', mt: 1, wordBreak: 'break-all' }}>
                            {TELEMETRY_WS_URL}
                        </Typography>
                    </Paper>

                    {activeSceneId === 'forces' && (
                        <ForceVectorsPanel objectHeading={asvHeading} currentRad={currentRad} currentSpeed={asvSpeed} />
                    )}

                    {activeSceneId === 'forces' && (
                        <Paper sx={{ p: 2, bgcolor: theme.palette.gui.primary, borderRadius: 2, border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.primary.light, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Vessel Heading
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <InteractiveCompass
                                    heading={asvHeading}
                                    onHeadingChange={(h) => dispatch(setASVHeading(h))}
                                    isConnected={isConnected}
                                    size={160}
                                    outerRadius={60}
                                    innerRadius={50}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: theme.palette.gui.faint }}>
                                Drag to set the vessel's heading direction
                            </Typography>
                        </Paper>
                    )}

                    {activeSceneId === 'forces' && (
                        <Paper sx={{ p: 2, bgcolor: theme.palette.gui.primary, borderRadius: 2, border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.info.main, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Flow Control
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <InteractiveCompass
                                    heading={currentHeading}
                                    onHeadingChange={(h) => dispatch(setCurrentHeading(h))}
                                    isConnected={isConnected}
                                    size={160}
                                    outerRadius={60}
                                    innerRadius={50}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: theme.palette.gui.faint }}>
                                Drag to set the simulated water current direction
                            </Typography>
                        </Paper>
                    )}

                    <ControlOverlay
                        title={activeSceneId === 'forces' ? 'Simulation Params' : 'Mapping Params'}
                        showLocalRotation={activeSceneId === 'mapping' && !isConnected && !autoSimActive}
                        showVelocity={!isConnected && !autoSimActive}
                        showObjectHeading={activeSceneId === 'forces' && !isConnected}
                        showGlobalGrid
                        showGlobalAxes
                        showLocalAxes
                        showLocalGrid={activeSceneId === 'mapping'}
                        showLegend
                        showCourseTrail={activeSceneId === 'mapping'}
                        showFogOfWar={activeSceneId === 'mapping'}
                        showCurrentHeading={activeSceneId === 'forces'}
                        showCurrentSpeed={activeSceneId === 'forces'}
                        isLocked={isConnected}
                    />
                </Stack>
            </Box>
        </Drawer>
    );
};
