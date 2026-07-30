/**
 * @file SceneContext.tsx
 * @description Provider for the scene viewport context. Renamed from MapCanvasContext.tsx.
 */
import React from 'react';
import { SceneContext, type SceneContextValue } from '../hooks/useSceneContext';

/**
 * @interface SceneProviderProps
 * @description Properties for the {@link SceneProvider} component.
 * @see {@link SceneProvider}
 * @property {SceneContextValue} value - The value to be provided to the {@link SceneContext}.
 * @property {React.ReactNode} children - The child components that will have access to the {@link SceneContext}.
 * @remarks
 * This component wraps its children with a {@link SceneContext.Provider}, allowing them to access the scene viewport context values and callbacks. It is typically used at a high level in the component tree to provide context to all components that need it.
 */
interface SceneProviderProps {
    value: SceneContextValue;
    children: React.ReactNode;
}

/**
 * @component SceneProvider
 * @description Provides the {@link SceneContext} to its child components.
 * @param {SceneProviderProps} props - Properties for the component.
 * @returns {JSX.Element} A React element that provides the {@link SceneContext} to its children.
 * @remarks
 * This component should be used at a high level in the component tree to ensure that all child components that need access to the scene viewport context can do so. It takes a {@link SceneContextValue} and makes it available to all descendants via the {@link SceneContext}.
 * @example
 * <SceneProvider value={sceneContextValue}>
 *   <ChildComponent />
 * </SceneProvider>
 * @see {@link SceneContext} for the context definition.
 */
export function SceneProvider({ value, children }: SceneProviderProps) {
    return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}
