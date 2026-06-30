/**
 * @file useSceneContext.ts
 * @description React context for the scene viewport: pan offset, zoom scale, follow mode,
 * layout mode flags, and UI callbacks. Renamed from useMapCanvasContext.ts.
 */
import React from 'react';

/**
 * @interface SceneContextValue
 * @description The value provided by the {@link SceneContext} React context.
 * @see {@link SceneContext}
 * @property {boolean} isDesktopMode - True if the application is in desktop mode, false if in mobile mode.
 * @property {boolean} isFullscreen - True if the visualizer is in fullscreen mode, false otherwise.
 * @property {boolean} isMobile - True if the application is in mobile mode, false otherwise.
 * @property {boolean} hasJoystick - True if a joystick is available for manual control, false otherwise.
 * @property {() => void} onToggleFullscreen - Callback function to toggle fullscreen mode.
 * @property {() => void} onOpenControlsDrawer - Callback function to open the controls drawer.
 * @property {{ x: number; y: number }} viewOffset - The current pan offset of the scene viewport.
 * @property {number} userScale - The current zoom scale of the scene viewport.
 * @property {() => void} resetView - Callback function to reset the view to the default position and scale.
 * @property {boolean} followLocalGrid - True if the view is following the local grid, false otherwise.
 * @property {() => void} onToggleFollowLocalGrid - Callback function to toggle the follow local grid mode.
 */
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

/**
 * @constant SceneContext
 * @description React context for the scene viewport, providing pan offset, zoom scale, follow mode,
 * layout mode flags, and UI callbacks.
 * @see {@link SceneContextValue} for the shape of the context value.
 * @remarks
 * This context is used to share state and callbacks related to the scene viewport across components in the visualizer. It includes information about the current layout mode (desktop or mobile), fullscreen status, joystick availability, view offset, zoom scale, and functions to toggle fullscreen mode, open the controls drawer, reset the view, and toggle follow local grid mode.
 * Components that need access to these values should use the {@link useSceneContext} hook.
 * @example
 * const { isDesktopMode, onToggleFullscreen } = useSceneContext();
 * // Use isDesktopMode to conditionally render components based on layout mode.
 * // Call onToggleFullscreen to toggle fullscreen mode when a button is clicked.
 */
export const SceneContext = React.createContext<SceneContextValue | null>(null);

/**
 * @function useSceneContext
 * @description Custom React hook to access the {@link SceneContext} values.
 * @see {@link SceneContext} for the context definition.
 * @remarks
 * This hook provides a convenient way for components to access the values and callbacks provided by the {@link SceneContext}. It ensures that the context is used within a provider and throws an error if accessed outside of a provider.
 * @example
 * const { viewOffset, userScale } = useSceneContext();
 * // Use viewOffset and userScale to position and scale elements in the scene viewport.
 */
export function useSceneContext(): SceneContextValue {
    const ctx = React.useContext(SceneContext);
    if (!ctx) throw new Error('useSceneContext must be used inside SceneProvider');
    return ctx;
}
