import React from 'react';
import { MapCanvasContext, type MapCanvasContextValue } from './useMapCanvasContext';

interface MapCanvasProviderProps {
    value: MapCanvasContextValue;
    children: React.ReactNode;
}

export function MapCanvasProvider({ value, children }: MapCanvasProviderProps) {
    return <MapCanvasContext.Provider value={value}>{children}</MapCanvasContext.Provider>;
}
