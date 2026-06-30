/**
 * @file SceneContext.tsx
 * @description Provider for the scene viewport context. Renamed from MapCanvasContext.tsx.
 */
import React from 'react';
import { SceneContext, type SceneContextValue } from '../hooks/useSceneContext';

interface SceneProviderProps {
    value: SceneContextValue;
    children: React.ReactNode;
}

export function SceneProvider({ value, children }: SceneProviderProps) {
    return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}
