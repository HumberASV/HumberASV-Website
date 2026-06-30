/**
 * @file SceneCanvas.tsx
 * @description Viewport container for the visualizer engine. Owns gesture handling,
 * viewport state, and the SceneContext that HUD children consume.
 * Renamed from MapCanvas.tsx; uses SceneProvider instead of MapCanvasProvider.
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

    React.useEffect(() => {
        if (!followLocalGrid) return;
        const scale = layout.mapScale * userScale;
        const wx = globalX * GLOBAL_CELL_SIZE * scale;
        const wy = globalY * GLOBAL_CELL_SIZE * scale;
        setViewOffset({ x: -(wx - wy) * ISO_COS30, y: -(wx + wy) * ISO_SIN30 });
    }, [followLocalGrid, globalX, globalY, layout.mapScale, userScale]);

    const [controlsDrawerOpen, setControlsDrawerOpen] = React.useState(false);

    const containerRef = React.useRef<HTMLDivElement>(null);

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
