/**
 * @file SceneHUD.tsx
 * @description Heads-up display (HUD) for the map visualizer.
 * Renamed from MapHUD.tsx. Tab switching now uses sceneSlice instead of activeTab integer.
 *
 * @author Carson Fujita
 * @license MIT
 */
import React from 'react';
import {
    Box, Tabs as MuiTabs, Tab, Stack, Chip, Button, Tooltip, Accordion, AccordionSummary,
    AccordionDetails, Typography, IconButton, CircularProgress, useTheme, alpha,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSimMode } from '../../store/slices/simulationSlice';
import { setActiveScene, selectActiveTabIndex, selectActiveScene, selectRegisteredScenes } from '../../store/slices/sceneSlice';
import { useSceneContext } from '../../hooks/useSceneContext';
import { Legend } from '../controls/Legend';
import { InfoPopover } from '../controls/InfoPopover';
import { InteractiveCompass } from '../svg/CompassRose';
import Joystick, { type JoyState } from '../../components/controls/Joystick';

function useHudBtnSx() {
    const theme = useTheme();
    return {
        width: 40,
        height: 40,
        bgcolor: alpha(theme.palette.scene.skyDark, 0.9),
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(4px)',
        '&:hover': { bgcolor: theme.palette.scene.skyMid },
    };
}

// ─── Tabs (desktop only) ──────────────────────────────────────────────────────

export function Tabs() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const activeTabIndex = useAppSelector(selectActiveTabIndex);
    const scenes = useAppSelector(selectRegisteredScenes);
    const { isDesktopMode } = useSceneContext();

    if (!isDesktopMode) return null;

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
            <MuiTabs
                value={activeTabIndex}
                onChange={(_, i) => dispatch(setActiveScene(scenes[i]?.id ?? 'mapping'))}
                sx={{
                    bgcolor: alpha(theme.palette.scene.skyDark, 0.85),
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0 0 8px 0',
                    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    boxShadow: theme.shadows[10],
                    minHeight: 0,
                    '& .MuiTabs-indicator': { backgroundColor: theme.palette.water.highlight },
                    '& .MuiTab-root': { minHeight: 40, py: 1 },
                }}
            >
                {scenes.map(s => (
                    <Tab
                        key={s.id}
                        label={s.displayName}
                        sx={{ color: theme.palette.gui.muted, '&.Mui-selected': { color: theme.palette.water.highlight }, fontSize: '0.75rem' }}
                    />
                ))}
            </MuiTabs>
        </Box>
    );
}

// ─── Connection + sim mode badges ────────────────────────────────────────────

export function StatusBadges() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const connectionStatus = useAppSelector(state => state.connection.status);
    const simMode = useAppSelector(state => state.simulation.simMode);
    const { isDesktopMode } = useSceneContext();

    const isConnected = connectionStatus === 'connected';
    const autoSimActive = !isConnected && simMode === 'automatic';

    return (
        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: isDesktopMode ? 48 : 8, left: 8, zIndex: 10 }}>
            <Chip
                size="small"
                label={isConnected ? 'LIVE' : connectionStatus === 'connecting' ? 'CONNECTING' : 'SIM'}
                sx={{
                    pointerEvents: 'none',
                    bgcolor: isConnected
                        ? alpha(theme.palette.status.primary.autonomous, 0.15)
                        : connectionStatus === 'connecting'
                            ? alpha(theme.palette.sim.connecting, 0.15)
                            : alpha(theme.palette.map.drag, 0.15),
                    color: isConnected
                        ? theme.palette.status.primary.autonomous
                        : connectionStatus === 'connecting'
                            ? theme.palette.sim.connecting
                            : theme.palette.map.drag,
                    border: `1px solid ${isConnected
                        ? theme.palette.status.primary.autonomous
                        : connectionStatus === 'connecting'
                            ? theme.palette.sim.connecting
                            : theme.palette.map.drag}`,
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    height: 20,
                    letterSpacing: '0.06em',
                }}
            />
            {!isConnected && (
                <Tooltip title={autoSimActive ? 'Switch to manual control' : 'Switch to automatic path'} placement="right">
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
                        sx={{
                            height: 20,
                            minWidth: 0,
                            px: 1,
                            py: 0,
                            lineHeight: 1,
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            borderRadius: '10px',
                            borderColor: autoSimActive ? theme.palette.sim.auto : theme.palette.sim.manual,
                            color: autoSimActive ? theme.palette.sim.auto : theme.palette.sim.manual,
                            bgcolor: autoSimActive ? alpha(theme.palette.sim.auto, 0.15) : alpha(theme.palette.sim.manual, 0.15),
                            '&:hover': {
                                bgcolor: autoSimActive ? alpha(theme.palette.sim.auto, 0.28) : alpha(theme.palette.sim.manual, 0.28),
                                borderColor: autoSimActive ? theme.palette.sim.auto : theme.palette.sim.manual,
                            },
                        }}
                    >
                        {autoSimActive ? 'AUTO' : 'MAN'}
                    </Button>
                </Tooltip>
            )}
        </Stack>
    );
}

// ─── Title + Legend block (bottom-left) ──────────────────────────────────────

export function Title() {
    const theme = useTheme();
    const { isDesktopMode, hasJoystick } = useSceneContext();
    const activeSceneId = useAppSelector(selectActiveScene);
    const showLegend = useAppSelector(state => state.visualization.showLegend);

    if (hasJoystick) return null;

    return (
        <Box sx={{ position: 'absolute', bottom: { xs: 16, md: 24 }, left: { xs: 16, md: 24 }, zIndex: 10, maxWidth: 260 }}>
            {isDesktopMode && showLegend && (
                <Box sx={{ mb: 1.5 }}>
                    <Accordion defaultExpanded sx={{ display: 'flex', flexDirection: 'column-reverse', bgcolor: alpha(theme.palette.scene.skyDark, 0.85), color: theme.palette.common.white, backdropFilter: 'blur(12px)', backgroundImage: 'none', border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, borderRadius: '8px !important', boxShadow: theme.shadows[10], '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandLessIcon sx={{ color: theme.palette.common.white }} />} sx={{ '& .MuiAccordionSummary-content': { my: 1 } }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.primary.light }}>
                                System Legend
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 2 }}>
                            <Legend variant={activeSceneId === 'forces' ? 'forces' : 'mapping'} disablePaper hideTitle />
                        </AccordionDetails>
                    </Accordion>
                </Box>
            )}
            <Box sx={{ pointerEvents: 'none' }}>
                <Typography
                    variant={isDesktopMode ? 'h6' : 'subtitle1'}
                    sx={{ fontWeight: 800, color: theme.palette.common.white, textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.5)}`, lineHeight: 1.2 }}
                >
                    System Visualizer v2
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ color: theme.palette.gui.muted, textShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.5)}`, display: 'block' }}
                >
                    Global-Local Coordinate Mapping
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Joystick (landscape fullscreen manual mode) ──────────────────────────────

export interface JoystickHUDProps {
    joy: JoyState;
    lw: number;
    rw: number;
    onJoyChange: (j: JoyState) => void;
}

export function JoystickHUD({ joy, lw, rw, onJoyChange }: JoystickHUDProps) {
    return (
        <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 20 }}>
            <Joystick joy={joy} lw={lw} rw={rw} onJoyChange={onJoyChange} size={180} />
        </Box>
    );
}

// ─── Toolbar (top-right) ──────────────────────────────────────────────────────

export function Toolbar() {
    const theme = useTheme();
    const showControls = useAppSelector(state => state.visualization.showControls);
    const activeSceneId = useAppSelector(selectActiveScene);
    const { viewOffset, userScale, resetView, onOpenControlsDrawer, followLocalGrid, onToggleFollowLocalGrid } = useSceneContext();
    const hudBtnSx = useHudBtnSx();

    const [infoAnchor, setInfoAnchor] = React.useState<HTMLElement | null>(null);
    const hasViewMoved = viewOffset.x !== 0 || viewOffset.y !== 0 || userScale !== 1;

    return (
        <>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
                <Tooltip title="Reset view" placement="bottom">
                    <IconButton
                        onClick={resetView}
                        sx={{ ...hudBtnSx, color: hasViewMoved && !followLocalGrid ? theme.palette.sim.manual : theme.palette.gui.muted }}
                    >
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                {activeSceneId === 'mapping' && (
                    <Tooltip title={followLocalGrid ? 'Stop following vessel' : 'Follow vessel'} placement="bottom">
                        <IconButton
                            onClick={onToggleFollowLocalGrid}
                            sx={{ ...hudBtnSx, color: followLocalGrid ? theme.palette.status.primary.autonomous : theme.palette.gui.muted }}
                        >
                            {followLocalGrid ? <GpsFixedIcon fontSize="small" /> : <GpsNotFixedIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                )}
                {showControls && (
                    <Tooltip title="Controls" placement="bottom">
                        <IconButton onClick={onOpenControlsDrawer} sx={{ ...hudBtnSx, color: theme.palette.water.highlight }}>
                            <TuneIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="About this visualizer" placement="bottom">
                    <IconButton
                        onClick={(e) => setInfoAnchor(infoAnchor ? null : e.currentTarget)}
                        sx={{ ...hudBtnSx, color: infoAnchor ? theme.palette.water.highlight : theme.palette.gui.muted }}
                    >
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
            <InfoPopover anchor={infoAnchor} onClose={() => setInfoAnchor(null)} />
        </>
    );
}

// ─── Fullscreen button (bottom-right) ────────────────────────────────────────

export function LegendPanel() {
    const theme = useTheme();
    const { isFullscreen, onToggleFullscreen } = useSceneContext();
    const hudBtnSx = useHudBtnSx();

    return (
        <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 20 }}>
            <IconButton
                onClick={onToggleFullscreen}
                sx={{ ...hudBtnSx, color: isFullscreen ? theme.palette.water.highlight : theme.palette.gui.muted }}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (landscape)'}
            >
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
        </Box>
    );
}

// ─── Connecting spinner overlay ───────────────────────────────────────────────

export function ConnectingOverlay() {
    const theme = useTheme();
    const connectionStatus = useAppSelector(state => state.connection.status);

    if (connectionStatus !== 'connecting') return null;

    return (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.scene.skyDark, 0.55), backdropFilter: 'blur(4px)' }}>
            <CircularProgress aria-label="Loading…" sx={{ color: theme.palette.sim.connecting }} />
        </Box>
    );
}

// Re-export InteractiveCompass for any consumers that import it from here
export { InteractiveCompass };
