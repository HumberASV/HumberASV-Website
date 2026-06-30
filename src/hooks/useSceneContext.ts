/**
 * @file useSceneContext.ts
 * @description React context for the scene viewport: pan offset, zoom scale, follow mode,
 * layout mode flags, and UI callbacks. Renamed from useMapCanvasContext.ts.
 */
import React from 'react';

export interface SceneContextValue {
    isDesktopMode: boolean;
    isFullscreen: boolean;
    isMobile: boolean;
    hasJoystick: boolean;
    onToggleFullscreen: () => void;
    onOpenControlsDrawer: () => void;
    viewOffset: { x: number; y: number };
    userScale: number;
    resetView: () => void;
    followLocalGrid: boolean;
    onToggleFollowLocalGrid: () => void;
}

export const SceneContext = React.createContext<SceneContextValue | null>(null);

export function useSceneContext(): SceneContextValue {
    const ctx = React.useContext(SceneContext);
    if (!ctx) throw new Error('useSceneContext must be used inside SceneProvider');
    return ctx;
}
