/**
 * @file SceneRenderer.tsx
 * @description Thin connected wrapper around `react-isometric-engine`'s `SceneRenderer`.
 * Reads Redux state and the MUI theme, then hands both to the portable, prop-driven engine
 * component as `sceneState` / `colors`. Keeps the same external prop contract as before so
 * `SceneCanvas.tsx` needs no changes.
 */
import React from 'react';
import { useTheme } from '@mui/material';
import {
    SceneRenderer as IsometricSceneRenderer,
    type SceneRendererProps as IsometricSceneRendererProps,
} from 'react-isometric-engine';

import { useAppSelector } from '../../store';
import type { RootState } from '../../store';
import { selectActiveScene } from '../../store/slices/sceneSlice';
import { selectDiscoveredCells, selectObstacleOverrides } from '../../store/slices/discoveredGridSlice';

export type SceneRendererProps = Pick<
    IsometricSceneRendererProps,
    'width' | 'height' | 'scale' | 'offset' | 'interactionProps' | 'preserveAspectRatio' | 'mappingData' | 'forcesData'
>;

/**
 * Unified isometric SVG engine for mapping and force visualization scenes, connected to Redux
 * and the MUI theme.
 */
export const SceneRenderer: React.FC<SceneRendererProps> = (props) => {
    const theme = useTheme();

    const {
        showGlobalGrid,
        showGlobalAxes,
        showLocalAxes,
        showLocalGrid,
        showCourseTrail,
        showFogOfWar,
    } = useAppSelector((state: RootState) => state.visualization);

    const {
        currentHeading,
        currentSpeed,
        fineGrid,
    } = useAppSelector((state: RootState) => state.simulation);

    const { speed: effectiveSpeed, heading: effectiveHeading } = useAppSelector(
        (state: RootState) => state.telemetry.asv
    );
    const occupancyGrid = useAppSelector((state: RootState) => state.telemetry.map.occupancyGrid);
    const navigationGrid = useAppSelector((state: RootState) => state.telemetry.map.navigationGrid);
    const courseTrail = useAppSelector((state: RootState) => state.telemetry.map.courseTrail ?? []);

    const discoveredCells = useAppSelector(selectDiscoveredCells);
    const obstacleOverrides = useAppSelector(selectObstacleOverrides);

    const activeSceneId = useAppSelector(selectActiveScene);

    return (
        <IsometricSceneRenderer
            {...props}
            sceneState={{
                activeSceneId,
                showGlobalGrid,
                showGlobalAxes,
                showLocalAxes,
                showLocalGrid,
                currentHeading,
                currentSpeed,
                effectiveSpeed,
                effectiveHeading,
                fineGrid,
                courseTrail,
                showCourseTrail,
                occupancyGrid,
                navigationGrid,
                discoveredCells,
                obstacleOverrides,
                showFogOfWar,
            }}
            colors={{
                map: theme.palette.map,
                water: theme.palette.water,
                scene: theme.palette.scene,
                error: theme.palette.error,
                warning: theme.palette.warning,
                success: theme.palette.success,
                info: theme.palette.info,
                common: theme.palette.common,
                textPrimary: theme.palette.text.primary,
            }}
        />
    );
};
