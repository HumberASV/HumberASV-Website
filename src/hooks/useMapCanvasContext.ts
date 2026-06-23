import React from 'react';

export interface MapCanvasContextValue {
    isDesktopMode: boolean;
    isFullscreen: boolean;
    isMobile: boolean;
    hasJoystick: boolean;
    onToggleFullscreen: () => void;
    onOpenControlsDrawer: () => void;
    viewOffset: { x: number; y: number };
    userScale: number;
    resetView: () => void;
}

export const MapCanvasContext = React.createContext<MapCanvasContextValue | null>(null);

export function useMapCanvasContext(): MapCanvasContextValue {
    const ctx = React.useContext(MapCanvasContext);
    if (!ctx) throw new Error('useMapCanvasContext must be used inside MapCanvasProvider');
    return ctx;
}
