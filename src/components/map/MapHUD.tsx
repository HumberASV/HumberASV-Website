/**
 * @file MapHUD.tsx
 * @description Heads-up display (HUD) for the map visualizer. Contains controls, status indicators, and other UI elements that overlay the map.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import React from 'react';
import {
    Box, Tabs as MuiTabs, Tab, Stack, Chip, Tooltip, Accordion, AccordionSummary,
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
import { setActiveTab, setCurrentHeading, setSimMode } from '../../store/slices/visualizerSlice';
import { useMapCanvasContext } from '../../hooks/useMapCanvasContext';
import { useLayoutConfig } from '../../hooks/useLayoutConfig';
import { Legend } from './panels/Legend';
import { InfoPopover } from './panels/InfoPopover';
import { InteractiveCompass } from './svg/CompassRose';
import Joystick, { type JoyState } from '../controls/Joystick';

/**
 * Returns a shared MUI `sx` object for square, frosted-glass icon buttons used
 * throughout the HUD. Must be called inside a component where `useTheme` is valid.
 */
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

/**
 * Tab bar anchored to the top-left corner of the map canvas.
 *
 * Renders two tabs — "Coordinate Mapping" and "Force Simulation" — and syncs
 * the active selection to the Redux `controls.activeTab` slice. Returns `null`
 * on non-desktop viewports so it is never shown on mobile.
 */
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

/**
 * Small chip badges anchored to the top-left corner (below the tab bar on
 * desktop, flush with the top edge on mobile).
 *
 * Always renders a connection chip: **LIVE** when the WebSocket is connected,
 * **CONNECTING** while negotiating, or **SIM** when running offline. When not
 * connected, an additional **AUTO / MAN** chip lets the user toggle between
 * automatic and manual simulation modes via `controls.simMode`.
 */
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

/**
 * Branding / version label rendered in the bottom-left corner of the map.
 *
 * Displays the app name ("System Visualizer v2") and a subtitle describing the
 * active mode. The element has `pointerEvents: none` so it never intercepts map
 * interactions. Hidden when the user is in mobile fullscreen with a joystick
 * visible, where screen real-estate is too limited.
 */
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

/**
 * Props for {@link JoystickHUD}.
 */
export interface JoystickHUDProps {
    /** Current joystick axis/button state passed down from the parent. */
    joy: JoyState;
    /** Left-wheel speed derived from the joystick position (−1 … 1 range). */
    lw: number;
    /** Right-wheel speed derived from the joystick position (−1 … 1 range). */
    rw: number;
    /** Callback fired whenever the joystick position changes. */
    onJoyChange: (j: JoyState) => void;
}

/**
 * On-screen joystick overlay fixed to the bottom-left of the map.
 *
 * Only rendered on mobile devices while the map is in fullscreen mode, where a
 * physical controller may not be available. The joystick drives the vessel in
 * manual simulation mode.
 */
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

/**
 * Icon button row anchored to the top-right corner of the map.
 *
 * Contains up to three actions:
 * - **Reset view** — shown only when the user has panned or zoomed away from
 *   the default position; resets `viewOffset` and `userScale` to their defaults.
 * - **Controls drawer** — opens the settings/tuning drawer; hidden when the
 *   `controls.showControls` flag is disabled.
 * - **Info popover** — toggles an {@link InfoPopover} with visualizer metadata.
 */
export function Toolbar() {
    const theme = useTheme();
    const showControls = useAppSelector(state => state.controls.showControls);
    const activeTab = useAppSelector(state => state.controls.activeTab);
    const { viewOffset, userScale, resetView, onOpenControlsDrawer, followLocalGrid, onToggleFollowLocalGrid } = useMapCanvasContext();
    const hudBtnSx = useHudBtnSx();

    const [infoAnchor, setInfoAnchor] = React.useState<HTMLElement | null>(null);
    const hasViewMoved = viewOffset.x !== 0 || viewOffset.y !== 0 || userScale !== 1;

    return (
        <>
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
                {hasViewMoved && !followLocalGrid && (
                    <Tooltip title="Reset view" placement="bottom">
                        <IconButton onClick={resetView} sx={{ ...hudBtnSx, color: theme.palette.sim.manual }}>
                            <RestartAltIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                {activeTab === 0 && (
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

// ─── Legend + compass + fullscreen button (bottom-right) ──────────────────────

/**
 * Composite panel anchored to the bottom-right corner of the map.
 *
 * Conditionally renders the following elements based on active tab, viewport
 * size, and feature flags from the Redux `controls` slice:
 * - **System Legend** — collapsible accordion showing color/icon keys. Visible
 *   on desktop when `controls.showLegend` is true.
 * - **Flow Control compass** — interactive {@link InteractiveCompass} for
 *   setting the vessel heading; visible on desktop (tab 1, `showCompass`) or in
 *   mobile fullscreen (tab 1, `showCompass`).
 * - **Fullscreen toggle button** — mobile-only; enters or exits the fullscreen
 *   landscape mode.
 */
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

/**
 * Full-canvas overlay displayed while the WebSocket connection is being
 * established (`connection.status === 'connecting'`).
 *
 * Renders a centered {@link CircularProgress} spinner over a frosted-glass
 * backdrop that dims the map without completely hiding it. Returns `null` in
 * all other connection states so it adds zero cost to the render tree.
 */
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
