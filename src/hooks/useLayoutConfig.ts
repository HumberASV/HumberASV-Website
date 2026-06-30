/**
 * @file useLayoutConfig.ts
 * @description Custom React hook that provides layout configuration values based on the device mode (desktop or mobile).
 * @remarks
 * This hook calculates and returns layout configuration values such as map dimensions, scale, and flow control sizes based on whether the application is in desktop mode or mobile mode. It helps maintain consistent layout and scaling across different device types.
 * @param {boolean} isDesktopMode - A boolean indicating whether the application is in desktop mode.
 * @returns {{
 *   mapWidth: number,
 *   mapHeight: number,
 *   mapScale: number,
 *   flowControlSize: number,
 *   flowCenter: number,
 *   flowOuterRadius: number,
 *   flowInnerRadius: number
 * }} An object containing layout configuration values for the visualizer.
 * @example
 * const { mapWidth, mapHeight, mapScale } = useLayoutConfig(true);
 * // mapWidth, mapHeight, and mapScale can be used to set the dimensions and scale of the visualizer.  
 */
export function useLayoutConfig(isDesktopMode: boolean) {
    const mapWidth = isDesktopMode ? 1600 : 800;
    const mapHeight = isDesktopMode ? 900 : 600;
    const mapScale = isDesktopMode ? 1.25 : 0.9;
    const flowControlSize = isDesktopMode ? 140 : 180;
    const flowCenter = flowControlSize / 2;
    const flowOuterRadius = flowCenter - (isDesktopMode ? 10 : 12);
    const flowInnerRadius = flowOuterRadius * 0.75;
    return { mapWidth, mapHeight, mapScale, flowControlSize, flowCenter, flowOuterRadius, flowInnerRadius };
}
