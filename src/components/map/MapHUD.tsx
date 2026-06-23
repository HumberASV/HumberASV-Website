import React from 'react';
import {
    Box, Tabs as MuiTabs, Tab, Stack, Chip, Tooltip, Accordion, AccordionSummary,
    AccordionDetails, Typography, IconButton, CircularProgress, useTheme, alpha,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ExploreIcon from '@mui/icons-material/Explore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAppSelector, useAppDispatch } from '../../store';
import { setActiveTab, setCurrentHeading, setShowCompass, setSimMode } from '../../store/slices/visualizerSlice';
import { useMapCanvasContext } from './useMapCanvasContext';
import { useLayoutConfig } from '../../hooks/useLayoutConfig';
import { Legend } from './panels/Legend';
import { InfoPopover } from './panels/InfoPopover';
import { InteractiveCompass } from './svg/CompassRose';
import Joystick, { type JoyState } from '../controls/Joystick';

// Shared HUD button style — call inside a component where useTheme() is available
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
    const activeTab = useAppSelector(state => state.controls.activeTab);
    const { isDesktopMode } = useMapCanvasContext();

    if (!isDesktopMode) return null;

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
            <MuiTabs
                value={activeTab}
                onChange={(_, v) => dispatch(setActiveTab(v))}
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
                <Tab label="Coordinate Mapping" sx={{ color: theme.palette.gui.muted, '&.Mui-selected': { color: theme.palette.water.highlight }, fontSize: '0.75rem' }} />
                <Tab label="Force Simulation" sx={{ color: theme.palette.gui.muted, '&.Mui-selected': { color: theme.palette.water.highlight }, fontSize: '0.75rem' }} />
            </MuiTabs>
        </Box>
    );
}

// ─── Connection + sim mode badges ────────────────────────────────────────────

export function StatusBadges() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const connectionStatus = useAppSelector(state => state.connection.status);
    const simMode = useAppSelector(state => state.controls.simMode);
    const { isDesktopMode } = useMapCanvasContext();

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
                <Tooltip title={autoSimActive ? 'Switch to manual control' : 'Switch to automatic'} placement="right">
                    <Chip
                        size="small"
                        label={autoSimActive ? 'AUTO' : 'MAN'}
                        onClick={() => dispatch(setSimMode(autoSimActive ? 'manual' : 'automatic'))}
                        sx={{
                            cursor: 'pointer',
                            bgcolor: autoSimActive ? alpha(theme.palette.sim.auto, 0.15) : alpha(theme.palette.sim.manual, 0.15),
                            color: autoSimActive ? theme.palette.sim.auto : theme.palette.sim.manual,
                            border: `1px solid ${autoSimActive ? theme.palette.sim.auto : theme.palette.sim.manual}`,
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            height: 20,
                            letterSpacing: '0.06em',
                        }}
                    />
                </Tooltip>
            )}
        </Stack>
    );
}

// ─── Title block (bottom-left) ────────────────────────────────────────────────

export function Title() {
    const theme = useTheme();
    const { isDesktopMode, isMobile, isFullscreen, hasJoystick } = useMapCanvasContext();

    if (isMobile && isFullscreen && hasJoystick) return null;

    return (
        <Box sx={{ position: 'absolute', bottom: { xs: 16, md: 24 }, left: { xs: 16, md: 24 }, zIndex: 10, pointerEvents: 'none' }}>
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
    const { isMobile, isFullscreen } = useMapCanvasContext();
    if (!isMobile || !isFullscreen) return null;
    return (
        <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 20 }}>
            <Joystick joy={joy} lw={lw} rw={rw} onJoyChange={onJoyChange} size={180} />
        </Box>
    );
}

// ─── Toolbar (top-right) ──────────────────────────────────────────────────────

export function Toolbar() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const activeTab = useAppSelector(state => state.controls.activeTab);
    const showControls = useAppSelector(state => state.controls.showControls);
    const showCompass = useAppSelector(state => state.controls.showCompass);
    const { viewOffset, userScale, resetView, onOpenControlsDrawer } = useMapCanvasContext();
    const hudBtnSx = useHudBtnSx();

    const [infoAnchor, setInfoAnchor] = React.useState<HTMLElement | null>(null);
    const hasViewMoved = viewOffset.x !== 0 || viewOffset.y !== 0 || userScale !== 1;

    return (
        <>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
                {hasViewMoved && (
                    <IconButton onClick={resetView} sx={{ ...hudBtnSx, color: theme.palette.sim.manual }} title="Reset View">
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                )}
                {activeTab === 1 && (
                    <IconButton
                        onClick={() => dispatch(setShowCompass(!showCompass))}
                        sx={{ ...hudBtnSx, color: showCompass ? theme.palette.water.highlight : theme.palette.gui.muted }}
                        title="Toggle Flow Control"
                    >
                        <ExploreIcon fontSize="small" />
                    </IconButton>
                )}
                {showControls && (
                    <IconButton onClick={onOpenControlsDrawer} sx={{ ...hudBtnSx, color: theme.palette.water.highlight }}>
                        <TuneIcon fontSize="small" />
                    </IconButton>
                )}
                <IconButton
                    onClick={(e) => setInfoAnchor(infoAnchor ? null : e.currentTarget)}
                    sx={{ ...hudBtnSx, color: infoAnchor ? theme.palette.water.highlight : theme.palette.gui.muted }}
                    title="About this visualizer"
                >
                    <InfoOutlinedIcon fontSize="small" />
                </IconButton>
            </Stack>
            <InfoPopover anchor={infoAnchor} onClose={() => setInfoAnchor(null)} />
        </>
    );
}

// ─── Legend + compass + fullscreen button (bottom-right) ──────────────────────

export function LegendPanel() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const activeTab = useAppSelector(state => state.controls.activeTab);
    const showLegend = useAppSelector(state => state.controls.showLegend);
    const showCompass = useAppSelector(state => state.controls.showCompass);
    const currentHeading = useAppSelector(state => state.controls.currentHeading);
    const connectionStatus = useAppSelector(state => state.connection.status);
    const { isDesktopMode, isFullscreen, isMobile, onToggleFullscreen } = useMapCanvasContext();
    const hudBtnSx = useHudBtnSx();
    const layout = useLayoutConfig(isDesktopMode);
    const isConnected = connectionStatus === 'connected';

    return (
        <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            {isDesktopMode && (showLegend || (activeTab === 1 && showCompass)) && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    {showLegend && (
                        <Box sx={{ width: 240 }}>
                            <Accordion sx={{ display: 'flex', flexDirection: 'column-reverse', bgcolor: alpha(theme.palette.scene.skyDark, 0.85), color: theme.palette.common.white, backdropFilter: 'blur(12px)', backgroundImage: 'none', border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, borderRadius: '8px !important', boxShadow: theme.shadows[10], '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandLessIcon sx={{ color: theme.palette.common.white }} />} sx={{ '& .MuiAccordionSummary-content': { my: 1 } }}>
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
                            <Accordion sx={{ display: 'flex', flexDirection: 'column-reverse', bgcolor: alpha(theme.palette.scene.skyDark, 0.85), color: theme.palette.common.white, backdropFilter: 'blur(12px)', backgroundImage: 'none', border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, borderRadius: '8px !important', boxShadow: theme.shadows[10], '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandLessIcon sx={{ color: theme.palette.common.white }} />} sx={{ '& .MuiAccordionSummary-content': { my: 1 } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.info.main }}>
                                        Flow Control
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'center' }}>
                                    <InteractiveCompass
                                        heading={currentHeading}
                                        onHeadingChange={(h) => dispatch(setCurrentHeading(h))}
                                        isConnected={isConnected}
                                        size={layout.flowControlSize}
                                        outerRadius={layout.flowOuterRadius}
                                        innerRadius={layout.flowInnerRadius}
                                        hideCardinalLabels
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    )}
                </Box>
            )}

            {isFullscreen && !isDesktopMode && activeTab === 1 && showCompass && (
                <Box sx={{ bgcolor: alpha(theme.palette.scene.skyDark, 0.85), backdropFilter: 'blur(12px)', border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, borderRadius: 2, p: 1.5, boxShadow: theme.shadows[10] }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.info.main, display: 'block', textAlign: 'center', mb: 1 }}>
                        Flow Control
                    </Typography>
                    <InteractiveCompass
                        heading={currentHeading}
                        onHeadingChange={(h) => dispatch(setCurrentHeading(h))}
                        isConnected={isConnected}
                        size={160}
                        outerRadius={60}
                        innerRadius={45}
                        hideCardinalLabels
                    />
                </Box>
            )}

            {isMobile && (
                <IconButton
                    onClick={onToggleFullscreen}
                    sx={{ ...hudBtnSx, color: isFullscreen ? theme.palette.water.highlight : theme.palette.gui.muted }}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (landscape)'}
                >
                    {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                </IconButton>
            )}
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
