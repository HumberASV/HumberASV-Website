import React from 'react';
import {
    Drawer, Box, Typography, Stack, Paper, Button, Switch,
    Tooltip, IconButton, CircularProgress, useTheme,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WifiIcon from '@mui/icons-material/Wifi';
import { ForceVectorsPanel } from './ForceVectorsPanel';
import { ControlOverlay } from './ControlOverlay';
import { InteractiveCompass } from '../svg/CompassRose';
import { TELEMETRY_WS_URL } from '../../../config/connection';

export interface ControlsDrawerProps {
    open: boolean;
    onClose: () => void;
    isConnected: boolean;
    connectionStatus: string;
    autoSimActive: boolean;
    activeTab: number;
    heading: number;
    speed: number;
    currentRad: number;
    onSimModeToggle: () => void;
    onRegenerateMap: () => void;
    onRetryConnection: () => void;
    onHeadingChange?: (newHeading: number) => void;
}

export const ControlsDrawer: React.FC<ControlsDrawerProps> = ({
    open,
    onClose,
    isConnected,
    connectionStatus,
    autoSimActive,
    activeTab,
    heading,
    speed,
    currentRad,
    onSimModeToggle,
    onRegenerateMap,
    onRetryConnection,
    onHeadingChange,
}) => {
    const theme = useTheme();

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
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
                        flexDirection: 'column',
                    },
                },
            }}
        >
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>System Configuration</Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <TuneIcon />
                </IconButton>
            </Box>

            <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
                <Stack spacing={2}>
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
                                            : 'Control speed and heading via sliders'}
                                    </Typography>
                                </Box>
                                <Tooltip title={autoSimActive ? 'Switch to manual control' : 'Switch to automatic'} placement="left">
                                    <Switch
                                        checked={autoSimActive}
                                        onChange={onSimModeToggle}
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

                    {!isConnected && (
                        <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', mb: 1.5 }}>
                                Simulation Data
                            </Typography>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<AutorenewIcon />}
                                onClick={onRegenerateMap}
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
                            onClick={onRetryConnection}
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
                        <ForceVectorsPanel objectHeading={heading} currentRad={currentRad} currentSpeed={speed} />
                    )}

                    {activeTab === 1 && (
                        <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.primary.light, mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                Vessel Heading
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <InteractiveCompass
                                heading={heading}
                                onHeadingChange={onHeadingChange}
                                isConnected={isConnected}
                                size={160}
                                outerRadius={60}
                                innerRadius={50}
                            />
                            </Box>
                        </Paper>
                    )}

                    <ControlOverlay
                        title={activeTab === 1 ? 'Simulation Params' : 'Mapping Params'}
                        showLocalRotation={activeTab === 0 && !isConnected && !autoSimActive}
                        showVelocity={!isConnected && !autoSimActive}
                        showObjectHeading={activeTab === 1 && !isConnected}
                        showGlobalGrid
                        showGlobalAxes
                        showLocalAxes
                        showLocalGrid={activeTab === 0}
                        showLegend
                        showCourseTrail={activeTab === 0}
                        showCurrentHeading={activeTab === 1}
                        isLocked={isConnected}
                    />
                </Stack>
            </Box>
        </Drawer>
    );
};
