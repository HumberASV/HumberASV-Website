/**
 * @file MapCanvas.tsx
 * @description Main canvas component for rendering the map visualization, HUD elements, and handling user interactions.
 * This component is responsible for:
 * - Rendering the MapView with appropriate transformations based on user interactions (pan/zoom).
 * - Displaying HUD elements such as tabs, connection status, simulation mode, title, and toolbar buttons.
 * - Managing the visibility of panels like the legend and compass based on props.
 * - Handling gestures for panning and zooming using @use-gesture/react.
 * - Providing a responsive layout that adapts to desktop and mobile modes, as well as fullscreen.
 * - Coordinating state related to the viewport (offset and scale) and passing necessary data to child components.
 */

import React from 'react';
import {
    Box, Tabs, Tab, Stack, Chip, Tooltip, Accordion, AccordionSummary,
    AccordionDetails, Typography, IconButton, CircularProgress, useTheme, alpha,
} from '@mui/material';
import { useGesture } from '@use-gesture/react';
import TuneIcon from '@mui/icons-material/Tune';
import ExploreIcon from '@mui/icons-material/Explore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Map as MapView } from './Map';
import { Legend } from './panels/Legend';
import { InteractiveCompass } from './svg/CompassRose';
import Joystick, { type JoyState } from '../controls/Joystick';

export interface MapCanvasProps {
    // Layout
    isDesktopMode: boolean;
    isFullscreen: boolean;
    isMobile: boolean;

    // Tabs
    activeTab: number;
    onTabChange: (event: React.SyntheticEvent, value: number) => void;

    // HUD visibility
    showLegend: boolean;
    showControls: boolean;
    showCompass: boolean;

    // Connection / sim
    isConnected: boolean;
    connectionStatus: string;
    autoSimActive: boolean;
    onSimModeToggle: () => void;

    // Compass
    currentHeading: number;
    onHeadingChange: (heading: number) => void;

    // Map data
    globalX: number;
    globalY: number;
    setGlobalX: (x: number) => void;
    setGlobalY: (y: number) => void;
    mapWidth: number;
    mapHeight: number;
    mapScale: number;
    autoHeading: number;

    // Flow control SVG dimensions
    flowControlSize: number;
    flowCenter: number;
    flowOuterRadius: number;
    flowInnerRadius: number;

    // Panel callbacks
    onToggleCompass: () => void;
    onOpenControlsDrawer: () => void;
    onSetInfoAnchor: (el: HTMLElement | null) => void;
    infoAnchor: HTMLElement | null;
    onToggleFullscreen: () => void;

    // Joystick (landscape fullscreen manual mode only)
    joystickProps?: {
        joy: JoyState;
        lw: number;
        rw: number;
        onJoyChange: (j: JoyState) => void;
    };
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
    isDesktopMode,
    isFullscreen,
    isMobile,
    activeTab,
    onTabChange,
    showLegend,
    showControls,
    showCompass,
    isConnected,
    connectionStatus,
    autoSimActive,
    onSimModeToggle,
    currentHeading,
    onHeadingChange,
    globalX,
    globalY,
    setGlobalX,
    setGlobalY,
    mapWidth,
    mapHeight,
    mapScale,
    autoHeading,
    flowControlSize,
    flowOuterRadius,
    flowInnerRadius,
    onToggleCompass,
    onOpenControlsDrawer,
    onSetInfoAnchor,
    infoAnchor,
    onToggleFullscreen,
    joystickProps,
}) => {
    const theme = useTheme();

    // Viewport state — lives here because it's only consumed by this canvas
    const [viewOffset, setViewOffset] = React.useState({ x: 0, y: 0 });
    const [userScale, setUserScale] = React.useState(1);
    const userScaleRef = React.useRef(userScale);
    React.useEffect(() => { userScaleRef.current = userScale; }, [userScale]);

    const containerRef = React.useRef<HTMLDivElement>(null);

    // target-based binding: @use-gesture attaches its own native { passive: false }
    // listeners to the container, so trackpad pinch (wheel+ctrlKey) is intercepted
    // before the browser can scroll the page.
    useGesture(
        {
            onDrag: ({ delta: [dx, dy], pinching }) => {
                if (pinching) return;
                setViewOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            },
            onPinch: ({ offset: [scale] }) => {
                setUserScale(Math.max(0.1, Math.min(scale, 10)));
            },
            onWheel: ({ delta: [, dy] }) => {
                setUserScale(prev => Math.max(0.1, Math.min(prev * (dy > 0 ? 0.9 : 1.1), 10)));
            },
        },
        {
            target: containerRef,
            drag: { filterTaps: true },
            pinch: { from: () => [userScaleRef.current, 0] },
            wheel: { preventDefault: true },
            eventOptions: { passive: false },
        }
    );

    const hudBtnSx = {
        width: 40,
        height: 40,
        bgcolor: alpha(theme.palette.scene.skyDark, 0.9),
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(4px)',
        '&:hover': { bgcolor: theme.palette.scene.skyMid },
    };

    const resetView = () => { setViewOffset({ x: 0, y: 0 }); setUserScale(1); };
    const hasViewMoved = viewOffset.x !== 0 || viewOffset.y !== 0 || userScale !== 1;

    return (
        <Box
            ref={containerRef}
            onDoubleClick={resetView}
            sx={{
                touchAction: 'none',
                position: 'relative',
                bgcolor: theme.palette.scene.skyMid,
                borderRadius: { xs: 0, sm: 3 },
                overflow: 'hidden',
                boxShadow: `0 25px 50px -12px ${alpha(theme.palette.common.black, 0.5)}`,
                border: isDesktopMode ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none',
                ...(isFullscreen ? {
                    flex: 1,
                    minHeight: 0,
                    maxHeight: 'none',
                    '& svg': { height: '100% !important' },
                } : {
                    aspectRatio: { xs: '4/3', md: '16/9' },
                    maxHeight: '70vh',
                }),
            }}
        >
            {/* Tabs — top-left (desktop only) */}
            {isDesktopMode && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                    <Tabs
                        value={activeTab}
                        onChange={onTabChange}
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
                    </Tabs>
                </Box>
            )}

            {/* Connection + sim mode badges — top-left below tabs */}
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
                            onClick={onSimModeToggle}
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

            {/* Title — bottom-left (hidden when joystick occupies that corner) */}
            {!(isMobile && isFullscreen && joystickProps) && (
                <Box sx={{ position: 'absolute', bottom: { xs: 16, md: 24 }, left: { xs: 16, md: 24 }, zIndex: 10, pointerEvents: 'none' }}>
                    <Typography variant={isDesktopMode ? 'h6' : 'subtitle1'} sx={{ fontWeight: 800, color: theme.palette.common.white, textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.5)}`, lineHeight: 1.2 }}>
                        System Visualizer v2
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.gui.muted, textShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.5)}`, display: 'block' }}>
                        Global-Local Coordinate Mapping
                    </Typography>
                </Box>
            )}

            {/* Joystick — bottom-left HUD in landscape fullscreen manual mode */}
            {isMobile && isFullscreen && joystickProps && (
                <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 20 }}>
                    <Joystick
                        joy={joystickProps.joy}
                        lw={joystickProps.lw}
                        rw={joystickProps.rw}
                        onJoyChange={joystickProps.onJoyChange}
                        size={180}
                    />
                </Box>
            )}

            {/* Toolbar — top-right */}
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
                {hasViewMoved && (
                    <IconButton onClick={resetView} sx={{ ...hudBtnSx, color: theme.palette.sim.manual }} title="Reset View">
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                )}
                {activeTab === 1 && (
                    <IconButton onClick={onToggleCompass} sx={{ ...hudBtnSx, color: showCompass ? theme.palette.water.highlight : theme.palette.gui.muted }} title="Toggle Flow Control">
                        <ExploreIcon fontSize="small" />
                    </IconButton>
                )}
                {showControls && (
                    <IconButton onClick={onOpenControlsDrawer} sx={{ ...hudBtnSx, color: theme.palette.water.highlight }}>
                        <TuneIcon fontSize="small" />
                    </IconButton>
                )}
                <IconButton
                    onClick={(e) => onSetInfoAnchor(infoAnchor ? null : e.currentTarget)}
                    sx={{ ...hudBtnSx, color: infoAnchor ? theme.palette.water.highlight : theme.palette.gui.muted }}
                    title="About this visualizer"
                >
                    <InfoOutlinedIcon fontSize="small" />
                </IconButton>
            </Stack>

            {/* Bottom-right HUD: legend + compass panels */}
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
                                            onHeadingChange={onHeadingChange}
                                            isConnected={isConnected}
                                            size={flowControlSize}
                                            outerRadius={flowOuterRadius}
                                            innerRadius={flowInnerRadius}
                                            hideCardinalLabels
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Portrait fullscreen: inline compass without accordion chrome */}
                {isFullscreen && !isDesktopMode && activeTab === 1 && showCompass && (
                    <Box sx={{ bgcolor: alpha(theme.palette.scene.skyDark, 0.85), backdropFilter: 'blur(12px)', border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`, borderRadius: 2, p: 1.5, boxShadow: theme.shadows[10] }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.info.main, display: 'block', textAlign: 'center', mb: 1 }}>
                            Flow Control
                        </Typography>
                        <InteractiveCompass
                            heading={currentHeading}
                            onHeadingChange={onHeadingChange}
                            isConnected={isConnected}
                            size={160}
                            outerRadius={60}
                            innerRadius={45}
                            hideCardinalLabels
                        />
                    </Box>
                )}

                {isMobile && (
                    <IconButton onClick={onToggleFullscreen} sx={{ ...hudBtnSx, color: isFullscreen ? theme.palette.water.highlight : theme.palette.gui.muted }} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (landscape)'}>
                        {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                    </IconButton>
                )}
            </Box>

            {/* Connecting spinner overlay */}
            {connectionStatus === 'connecting' && (
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 19, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.scene.skyDark, 0.55), backdropFilter: 'blur(4px)' }}>
                    <CircularProgress aria-label="Loading…" sx={{ color: theme.palette.sim.connecting }} />
                </Box>
            )}

            <MapView
                width={mapWidth}
                height={mapHeight}
                scale={mapScale * userScale}
                offset={viewOffset}
                preserveAspectRatio={isFullscreen ? 'xMidYMid slice' : undefined}
                interactionProps={{}}
                mappingData={{ globalX, globalY, setGlobalX, setGlobalY, localRotationOverride: autoSimActive ? autoHeading : undefined }}
            />
        </Box>
    );
};
