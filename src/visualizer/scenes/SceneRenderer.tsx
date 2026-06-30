/**
 * @file SceneRenderer.tsx
 * @description Unified isometric SVG engine for mapping and force visualization scenes.
 * Renamed from Map.tsx; tab switching now uses sceneSlice.activeSceneId.
 */
import React from 'react';
import { getToScreen, GLOBAL_CELL_SIZE, GLOBAL_GRID_SIZE, CellTypes } from '../../utils/types';

import { useAppSelector } from '../../store';
import type { RootState } from '../../store';
import { selectActiveScene } from '../../store/slices/sceneSlice';

import { IsometricGrid } from '../svg/IsometricGrid';
import { IsometricAxes } from '../svg/IsometricAxes';
import { WaterBlock } from '../svg/WaterBlock';
import { SceneEnvironment } from '../svg/SceneEnvironment';
import { LocalGrid } from '../svg/LocalGrid';
import { GlobalGridOverlay } from '../svg/GlobalGridOverlay';
import { GridCellIcon } from '../svg/GridCellIcon';
import { CourseTrailArrows } from '../entity/CourseTrailArrows';
import { FlowParticles } from '../entity/FlowParticles';
import { FloatingObject } from '../entity/FloatingObject';

export interface SceneRendererProps {
    width?: number;
    height?: number;
    scale?: number;
    offset?: { x: number, y: number };
    interactionProps?: React.SVGProps<SVGSVGElement>;
    preserveAspectRatio?: string;

    mappingData?: {
        globalX: number;
        globalY: number;
        setGlobalX?: (val: number) => void;
        setGlobalY?: (val: number) => void;
        localRotationOverride?: number;
    };

    forcesData?: {
        time: number;
    };
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
    width = 750,
    height = 550,
    scale = 1.0,
    offset = { x: 0, y: 0 },
    interactionProps = {},
    mappingData,
    forcesData,
    preserveAspectRatio,
}) => {
    const {
        showGlobalGrid,
        showGlobalAxes,
        showLocalAxes,
        showLocalGrid,
    } = useAppSelector((state: RootState) => state.visualization);

    const {
        currentHeading,
        currentSpeed: envCurrentSpeed,
    } = useAppSelector((state: RootState) => state.simulation);

    const { speed: effectiveSpeed, heading: effectiveHeading } = useAppSelector(
        (state: RootState) => state.telemetry.asv
    );

    const activeSceneId = useAppSelector(selectActiveScene);

    const [internalTime, setInternalTime] = React.useState(0);

    React.useEffect(() => {
        let frameId: number;
        const start = performance.now();
        const animate = (now: number) => {
            setInternalTime((now - start) / 1000);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const toScreen = React.useMemo(
        () => getToScreen(width / 2 + offset.x, height / 2 + offset.y, scale),
        [width, height, offset.x, offset.y, scale],
    );

    const gridLimit = GLOBAL_GRID_SIZE / 2;
    const worldSize = gridLimit * GLOBAL_CELL_SIZE;
    const fadeThreshold = 0.4;

    const wrap = (val: number, limit: number) => {
        const size = limit * 2;
        return ((((val + limit) % size) + size) % size) - limit;
    };
    const constrainedX = wrap(mappingData?.globalX ?? 0, gridLimit);
    const constrainedY = wrap(mappingData?.globalY ?? 0, gridLimit);

    const worldInstances = React.useMemo(() => {
        if (!mappingData) return [];

        const span = gridLimit * 2;
        const results = [];
        const searchRange = Math.max(1, Math.ceil(worldSize / (span * GLOBAL_CELL_SIZE)));

        for (let dx = -span * searchRange; dx <= span * searchRange; dx += span) {
            for (let dy = -span * searchRange; dy <= span * searchRange; dy += span) {
                const instX = constrainedX + dx;
                const instY = constrainedY + dy;
                const distToCenterX = Math.abs(instX);
                const distToCenterY = Math.abs(instY);
                const opacityX = Math.max(0, Math.min(1, (gridLimit + fadeThreshold / 2 - distToCenterX) / fadeThreshold));
                const opacityY = Math.max(0, Math.min(1, (gridLimit + fadeThreshold / 2 - distToCenterY) / fadeThreshold));
                const opacity = Math.pow(opacityX * opacityY, 1.5);

                if (opacity > 0.005) {
                    results.push({
                        x: instX,
                        y: instY,
                        opacity,
                        pointScreen: toScreen(instX * GLOBAL_CELL_SIZE, instY * GLOBAL_CELL_SIZE, 0),
                        globalOriginScreen: toScreen(0, 0, 0)
                    });
                }
            }
        }
        return results;
    }, [mappingData, constrainedX, constrainedY, gridLimit, fadeThreshold, toScreen, worldSize]);

    const currentRad = React.useMemo(() => currentHeading * Math.PI / 180, [currentHeading]);

    const forceVectors = React.useMemo(() => {
        const currentMag = envCurrentSpeed * 14;
        const dragMag = envCurrentSpeed * 7;
        return {
            gravity:  { x: 0, y: 0, z: -70 },
            buoyancy: { x: 0, y: 0, z: 70 },
            current:  { x: Math.sin(currentRad) * currentMag, y: Math.cos(currentRad) * currentMag, z: 0 },
            drag:     { x: -Math.sin(currentRad) * dragMag,   y: -Math.cos(currentRad) * dragMag,   z: 0 },
        };
    }, [currentRad, effectiveSpeed]);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio={preserveAspectRatio}
            className="w-full h-auto bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl"
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
            {...interactionProps}
        >
            <SceneEnvironment width={width} height={height} />
            <WaterBlock size={worldSize} toScreen={toScreen} />

            {showGlobalGrid && <IsometricGrid size={worldSize} step={GLOBAL_CELL_SIZE} toScreen={toScreen} />}

            {activeSceneId === 'mapping' && <CourseTrailArrows toScreen={toScreen} />}

            {activeSceneId === 'mapping' && (
                <GlobalGridOverlay toScreen={toScreen} />
            )}

            {activeSceneId === 'mapping' && mappingData && (
                <GridCellIcon
                    cx={Math.floor(constrainedX + gridLimit) * GLOBAL_CELL_SIZE - worldSize}
                    cy={Math.floor(constrainedY + gridLimit) * GLOBAL_CELL_SIZE - worldSize}
                    toScreen={toScreen}
                    cellType={CellTypes.current}
                    opacity={0.85}
                />
            )}

            {activeSceneId === 'mapping' && mappingData && worldInstances.map((inst, idx) => (
                <g key={`${idx}-${inst.x}-${inst.y}`} opacity={inst.opacity}>
                    <LocalGrid
                        globalX={inst.x}
                        globalY={inst.y}
                        localRotation={mappingData.localRotationOverride ?? effectiveHeading}
                        showLocalAxes={showLocalAxes}
                        showLocalGrid={showLocalGrid}
                        toScreen={toScreen}
                        pointScreen={inst.pointScreen}
                        globalOriginScreen={inst.globalOriginScreen}
                    />
                </g>
            ))}

            {showGlobalAxes && (
                <IsometricAxes
                    origin={{ x: worldSize, y: worldSize, z: 0 }}
                    length={3 * GLOBAL_CELL_SIZE}
                    lengthZ={3 * GLOBAL_CELL_SIZE}
                    toScreen={toScreen}
                    worldAxes
                />
            )}

            {activeSceneId === 'forces' && (
                <>
                    <FlowParticles
                        velocity={forceVectors.current}
                        time={forcesData?.time ?? internalTime}
                        toScreen={toScreen}
                    />
                    <FloatingObject
                        time={forcesData?.time ?? internalTime}
                        objectHeading={effectiveHeading}
                        currentSpeed={envCurrentSpeed}
                        currentRad={currentRad}
                        forces={forceVectors}
                        toScreen={toScreen}
                    />
                </>
            )}
        </svg>
    );
};
