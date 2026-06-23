/**
 * @file MapCanvasContext.tsx
 * @description Provides a React context for the MapCanvas component.
 * This context allows child components to access and manipulate the state of the MapCanvas, such as view offset, scale, and other properties.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import React from 'react';
import { MapCanvasContext, type MapCanvasContextValue } from '../hooks/useMapCanvasContext';

interface MapCanvasProviderProps {
    value: MapCanvasContextValue;
    children: React.ReactNode;
}

export function MapCanvasProvider({ value, children }: MapCanvasProviderProps) {
    return <MapCanvasContext.Provider value={value}>{children}</MapCanvasContext.Provider>;
}
