/**
 * @file SceneCanvas.tsx
 * @description Viewport container for the visualizer engine. Owns gesture handling,
 * viewport state, and the SceneContext that HUD children consume.
 * Renamed from MapCanvas.tsx; uses SceneProvider instead of MapCanvasProvider.
 * @remarks
 * This component serves as the main container for the 3D scene visualizer. It manages user interactions such as dragging, pinching, and zooming to manipulate the view of the scene.
 * The component provides a context for child components to access viewport state and control functions.
 * It also includes a controls drawer for additional user interactions and settings.
 */

import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { useGesture } from '@use-gesture/react';
import { SceneRenderer } from './SceneRenderer';
import { ControlsDrawer } from '../controls/ControlsDrawer';
import { SceneProvider } from '../../contexts/SceneContext';
import { useLayoutConfig } from '../../hooks/useLayoutConfig';
import type { JoyState } from '../../components/controls/Joystick';
import { GLOBAL_CELL_SIZE } from '../../utils/types';

const ISO_COS30 = Math.cos(Math.PI / 6);
const ISO_SIN30 = Math.sin(Math.PI / 6);

/**
 * @interface SceneCanvasProps
 * @description Properties for the {@link SceneCanvas} component.
 * @see {@link SceneCanvas}
 * @property {number} globalX - The global X coordinate of the scene's origin.
 * @property {number} globalY - The global Y coordinate of the scene's origin.
 * @property {(x: number) => void} setGlobalX - Function to update the global X coordinate.
 * @property {(y: number) => void} setGlobalY - Function to update the global Y coordinate.
 * @property {number} [autoHeading] - Optional automatic heading angle for the scene view.
 * @property {boolean} isDesktopMode - Indicates if the application is in desktop mode.
 * @property {boolean} isFullscreen - Indicates if the scene is currently in fullscreen mode.
 * @property {boolean} isMobile - Indicates if the application is running on a mobile device.
 * @property {() => void} onToggleFullscreen - Callback function to toggle fullscreen mode.
 * @property {() => void} onRegenerateMap - Callback function to regenerate the map.
 * @property {object} [joystickProps] - Optional properties for the joystick control.
 * @property {JoyState} joystickProps.joy - The current state of the joystick.
 * @property {number} joystickProps.lw - The left wheel speed.
 * @property {number} joystickProps.rw - The right wheel speed.
 * @property {(j: JoyState) => void} joystickProps.onJoyChange - Callback function to handle joystick state changes.
 * @property {React.ReactNode} children - Child components to be rendered within the SceneCanvas.
 * @remarks
 * The SceneCanvas component is responsible for rendering the 3D scene and handling user interactions. It provides a context for child components to access viewport state and control functions.
 * The component supports gesture handling for dragging, pinching, and zooming, allowing users to manipulate the view of the scene.
 * The controls drawer provides additional user interactions and settings for the scene.
 * @see {@link SceneRenderer} for rendering the 3D scene.
 * @see {@link ControlsDrawer} for additional user controls and settings.
 * @see {@link SceneProvider} for context management of the scene state.
 * @see {@link useLayoutConfig} for responsive layout configuration based on device type.
 */
export interface SceneCanvasProps {
    globalX: number;
    globalY: number;
    setGlobalX: (x: number) => void;
    setGlobalY: (y: number) => void;
    autoHeading?: number;

    isDesktopMode: boolean;
    isFullscreen: boolean;
    isMobile: boolean;
    onToggleFullscreen: () => void;

    onRegenerateMap: () => void;

    joystickProps?: {
        joy: JoyState;
        lw: number;
        rw: number;
        onJoyChange: (j: JoyState) => void;
    };

    children: React.ReactNode;
}

/**
 * @component SceneCanvas
 * @description Viewport container for the visualizer engine. Owns gesture handling, viewport state, and the SceneContext that HUD children consume.
 * @param {SceneCanvasProps} props - Properties for the component.
 * @returns {JSX.Element} A React element representing the scene canvas.
 * @remarks
 * The SceneCanvas component serves as the main container for the 3D scene visualizer. It manages user interactions such as dragging, pinching, and zooming to manipulate the view of the scene.
 * The component provides a context for child components to access viewport state and control functions.
 * It also includes a controls drawer for additional user interactions and settings.
 * @see {@link SceneRenderer} for rendering the 3D scene.
 * @see {@link ControlsDrawer} for additional user controls and settings.
 * @see {@link SceneProvider} for context management of the scene state.
 * @see {@link useLayoutConfig} for responsive layout configuration based on device type.
 * @example
 * <SceneCanvas
 *  globalX={0}
 *  globalY={0}
 *  setGlobalX={(x) => console.log('Set Global X:', x)}
 *  setGlobalY={(y) => console.log('Set Global Y:', y)}
 * isDesktopMode={true}
 * isFullscreen={false}
 * isMobile={false}
 * onToggleFullscreen={() => console.log('Toggle Fullscreen')}
 * onRegenerateMap={() => console.log('Regenerate Map')}
 * joystickProps={{
 *  joy: { x: 0, y: 0 },
 *  lw: 0,
 *  rw: 0,
 * onJoyChange: (j) => console.log('Joystick Changed:', j),
 * }}
 * >
 *  <SomeChildComponent />
 * </SceneCanvas>
 */
export const SceneCanvas: React.FC<SceneCanvasProps> = ({
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

    // Update view offset when following local grid and global coordinates change
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
     * @function useGesture
     * @description Hook to handle user gestures for dragging, pinching, and zooming.
     * @remarks
     * This hook sets up event listeners for drag, pinch, and wheel events on the container element.
     * It updates the view offset and user scale based on user interactions.
     * The drag event updates the view offset unless the user is pinching.
     * The pinch event adjusts the user scale within a defined range (0.1 to 10).
     * The wheel event also adjusts the user scale based on the scroll direction.
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

    const resetView = React.useCallback(() => {
        setFollowLocalGrid(false);
        setViewOffset({ x: 0, y: 0 });
        setUserScale(1);
    }, []);

    const onToggleFollowLocalGrid = React.useCallback(() => {
        setFollowLocalGrid(prev => !prev);
    }, []);

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
        <SceneProvider value={ctxValue}>
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
                <SceneRenderer
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
        </SceneProvider>
    );
};
