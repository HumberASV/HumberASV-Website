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
