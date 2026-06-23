/**
 * @file MapCanvas.tsx
 * @description Viewport container for the map visualizer. Owns gesture handling, viewport state,
 * and the MapCanvasContext that HUD children consume. Renders HUD children on top of the Map SVG.
 */

import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { useGesture } from '@use-gesture/react';
import { Map as MapView } from './Map';
import { ControlsDrawer } from './panels/ControlsDrawer';
import { MapCanvasProvider } from '../../contexts/MapCanvasContext';
import { useLayoutConfig } from '../../hooks/useLayoutConfig';
import type { JoyState } from '../controls/Joystick';
import { GLOBAL_CELL_SIZE } from '../../utils/types';

const ISO_COS30 = Math.cos(Math.PI / 6);
const ISO_SIN30 = Math.sin(Math.PI / 6);

/**
 * @interface MapCanvasProps
 * 
 * @description Props for the MapCanvas component, which serves as the main viewport for the ASV visualizer.
 * It manages gesture handling, viewport state, and provides context to its children.
 * 
 * @property {number} globalX - The global X coordinate of the map's center.
 * @property {number} globalY - The global Y coordinate of the map's center.
 * @property {(x: number) => void} setGlobalX - Function to update the global X coordinate.
 * @property {(y: number) => void} setGlobalY - Function to update the global Y coordinate.
 * @property {number} [autoHeading] - Optional automatic heading for the ASV, if applicable.
 * @property {boolean} isDesktopMode - Indicates if the application is in desktop mode.
 * @property {boolean} isFullscreen - Indicates if the map is in fullscreen mode.
 * @property {boolean} isMobile - Indicates if the application is in mobile mode.
 * @property {() => void} onToggleFullscreen - Callback to toggle fullscreen mode.
 * @property {() => void} onRegenerateMap - Callback to regenerate the map, typically used for resetting or refreshing the map view.
 * @property {object} [joystickProps] - Optional properties for joystick control, including state and event handlers.
 * @property {React.ReactNode} children - Child components to be rendered within the MapCanvas, such as HUD elements.
 */
export interface MapCanvasProps {
    // Map animation state (60fps — not in store/context)
    globalX: number;
    globalY: number;
    setGlobalX: (x: number) => void;
    setGlobalY: (y: number) => void;
    autoHeading?: number;

    // Layout (derived from media queries in MappingVisualizer)
    isDesktopMode: boolean;
    isFullscreen: boolean;
    isMobile: boolean;
    onToggleFullscreen: () => void;

    // Ref-cleanup callback that must live in MappingVisualizer
    onRegenerateMap: () => void;

    // Joystick (60fps animation state)
    joystickProps?: {
        joy: JoyState;
        lw: number;
        rw: number;
        onJoyChange: (j: JoyState) => void;
    };

    children: React.ReactNode;
}

/**
 * Map canvas component that serves as the main viewport for the ASV visualizer.
 *  It manages gesture handling, viewport state, and provides context to its children.
 * @param children - Child components to be rendered within the MapCanvas, such as HUD elements.
 * @param globalX - The global X coordinate of the map's center.
 * @param globalY - The global Y coordinate of the map's center.
 * @param setGlobalX - Function to update the global X coordinate.
 * @param setGlobalY - Function to update the global Y coordinate.
 * @param autoHeading - Optional automatic heading for the ASV, if applicable.
 * @param isDesktopMode - Indicates if the application is in desktop mode.
 * @param isFullscreen - Indicates if the map is in fullscreen mode.
 * @param isMobile - Indicates if the application is in mobile mode.
 * @param onToggleFullscreen - Callback to toggle fullscreen mode.
 * @param onRegenerateMap - Callback to regenerate the map, typically used for resetting or refreshing the map view.
 * @param joystickProps - Optional properties for joystick control, including state and event handlers.
 * @returns A React functional component that renders the map canvas and its children.
 * 
 * @author Carson Fujita
 * @license MIT
 */
export const MapCanvas: React.FC<MapCanvasProps> = ({
    globalX,
    globalY,
    setGlobalX,
    setGlobalY,
    autoHeading,
    isDesktopMode,
    isFullscreen,
    isMobile,
    onToggleFullscreen,
    onRegenerateMap,
    joystickProps,
    children,
}) => {
    const theme = useTheme();
    const layout = useLayoutConfig(isDesktopMode);

    const [viewOffset, setViewOffset] = React.useState({ x: 0, y: 0 });
    const [userScale, setUserScale] = React.useState(1);
    const userScaleRef = React.useRef(userScale);
    React.useEffect(() => { userScaleRef.current = userScale; }, [userScale]);

    const [followLocalGrid, setFollowLocalGrid] = React.useState(false);

    React.useEffect(() => {
        if (!followLocalGrid) return;
        const scale = layout.mapScale * userScale;
        const wx = globalX * GLOBAL_CELL_SIZE * scale;
        const wy = globalY * GLOBAL_CELL_SIZE * scale;
        setViewOffset({ x: -(wx - wy) * ISO_COS30, y: -(wx + wy) * ISO_SIN30 });
    }, [followLocalGrid, globalX, globalY, layout.mapScale, userScale]);

    const [controlsDrawerOpen, setControlsDrawerOpen] = React.useState(false);

    const containerRef = React.useRef<HTMLDivElement>(null);

    /**
     * Sets up gesture handling for the map canvas, including drag, pinch, and wheel events.
     * Dragging moves the view offset, pinching adjusts the user scale, and wheel events also adjust the user scale.
     * The gesture handling is applied to the containerRef element.
     */
    useGesture(
        {
            onDrag: ({ delta: [dx, dy], pinching }) => {
                if (pinching) return;
                setFollowLocalGrid(false);
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

    /**
     * Resets the view offset and user scale to their default values.
     * This function is called when the user double-clicks on the map canvas.
     * It sets the view offset to (0, 0) and the user scale to 1.
     */
    const resetView = React.useCallback(() => {
        setFollowLocalGrid(false);
        setViewOffset({ x: 0, y: 0 });
        setUserScale(1);
    }, []);

    const onToggleFollowLocalGrid = React.useCallback(() => {
        setFollowLocalGrid(prev => !prev);
    }, []);

    /**
     * Memoizes the context value for the MapCanvasContext, which is provided to child components.
     * The context value includes information about the current layout mode, fullscreen state, mobile state,
     * joystick availability, view offset, user scale, and functions to toggle fullscreen and open the controls drawer.
     */
    const ctxValue = React.useMemo(() => ({
        isDesktopMode,
        isFullscreen,
        isMobile,
        hasJoystick: !!joystickProps,
        onToggleFullscreen,
        onOpenControlsDrawer: () => setControlsDrawerOpen(true),
        viewOffset,
        userScale,
        resetView,
        followLocalGrid,
        onToggleFollowLocalGrid,
    }), [isDesktopMode, isFullscreen, isMobile, joystickProps, onToggleFullscreen, viewOffset, userScale, resetView, followLocalGrid, onToggleFollowLocalGrid]);

    return (
        <MapCanvasProvider value={ctxValue}>
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
                <MapView
                    width={layout.mapWidth}
                    height={layout.mapHeight}
                    scale={layout.mapScale * userScale}
                    offset={viewOffset}
                    preserveAspectRatio={isFullscreen ? 'xMidYMid slice' : undefined}
                    interactionProps={{}}
                    mappingData={{
                        globalX,
                        globalY,
                        setGlobalX,
                        setGlobalY,
                        localRotationOverride: autoHeading,
                    }}
                />

                {children}
            </Box>

            <ControlsDrawer
                open={controlsDrawerOpen}
                onClose={() => setControlsDrawerOpen(false)}
                onRegenerateMap={onRegenerateMap}
            />
        </MapCanvasProvider>
    );
};
