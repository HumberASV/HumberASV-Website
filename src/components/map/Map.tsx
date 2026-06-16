/**
 * @file Map.tsx
 * @description Unified isometric SVG engine for mapping and force visualizations.
 */
import React from 'react';
import { getToScreen, GLOBAL_CELL_SIZE, GLOBAL_GRID_SIZE, CellTypes } from '../../utils/types';

// Redux Store
import { useAppSelector } from '../../store';
import type { RootState } from '../../store';

// SVG Components
import { IsometricGrid } from './svg/IsometricGrid';
import { IsometricAxes } from './svg/IsometricAxes';
import { WaterBlock } from './svg/WaterBlock';
import { SceneEnvironment } from './svg/SceneEnvironment';
import { LocalGrid } from './svg/LocalGrid';
import { OccupancyGridOverlay } from './svg/OccupancyGridOverlay';
import { GridCellIcon } from './svg/GridCellIcon';
import { CourseTrailArrows } from './svg/CourseTrailArrows';
import { FlowParticles } from './svg/FlowParticles';
import { FloatingObject } from './svg/FloatingObject';

export interface MapProps {
    /** Width of the SVG canvas. Defaults to 750. */
    width?: number;
    /** Height of the SVG canvas. Defaults to 550. */
    height?: number;
    /** Scale factor for the isometric projection. Defaults to 1.0. */
    scale?: number;
    /** Center offset in pixels for panning. */
    offset?: { x: number, y: number };
    /** Interaction handlers for SVG. */
    interactionProps?: React.SVGProps<SVGSVGElement>;
    /** SVG preserveAspectRatio attribute. Defaults to browser default (xMidYMid meet). */
    preserveAspectRatio?: string;

    /** Data for the Mapping Visualizer variant. */
    mappingData?: {
        globalX: number;
        globalY: number;
        setGlobalX?: (val: number) => void;
        setGlobalY?: (val: number) => void;
        /** Override the vessel's local rotation (degrees). Used in auto mode to face the travel direction. */
        localRotationOverride?: number;
    };

    /** Data for the Force Visualizer variant. */
    forcesData?: {
        time: number;
    };
}

export const Map: React.FC<MapProps> = ({
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
        currentHeading,
        showLocalAxes,
        activeTab,
        velocity,
        objectHeading,
        localRotation,
    } = useAppSelector((state: RootState) => state.controls);

    const { speed: asvSpeed, heading: asvHeading } = useAppSelector(
        (state: RootState) => state.telemetry.asv
    );

    const isConnected = useAppSelector(
        (state: RootState) => state.connection.status === 'connected'
    );

    const effectiveSpeed = isConnected ? asvSpeed : velocity;
    const effectiveHeading = isConnected ? asvHeading : localRotation;
    const effectiveObjectHeading = isConnected ? asvHeading : objectHeading;

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

    // Center the isometric projection horizontally and vertically within the SVG canvas.
    const toScreen = getToScreen(width / 2 + offset.x, height / 2 + offset.y, scale);

    // Synchronize the logical wrap boundary with the visual grid extent.
    // By setting worldSize exactly to the logical limit, we ensure the boat
    // travels to the actual visual edge of the grid before wrapping.
    const gridLimit = GLOBAL_GRID_SIZE / 2;
    const worldSize = gridLimit * GLOBAL_CELL_SIZE;
    
    // Tightened fadeThreshold (0.4 cells) to ensure the boat travels much closer 
    // to the visual edge before ghosting or wrapping occurs.
    const fadeThreshold = 0.4; 

    const wrap = (val: number, limit: number) => {
        const size = limit * 2;
        return ((((val + limit) % size) + size) % size) - limit;
    };
    const constrainedX = wrap(mappingData?.globalX ?? 0, gridLimit);
    const constrainedY = wrap(mappingData?.globalY ?? 0, gridLimit);

    // Generate multiple instances for seamless wrap-around rendering (Ghosting)
    // This logic is shared between mapping and force modes to ensure visual continuity.
    const worldInstances = React.useMemo(() => {
        if (!mappingData) return [];

        const span = gridLimit * 2;

        const results = [];
        
        // Calculate search range based on worldSize to ensure seamless ghost repetitions
        // This ensures the grid fills the entire 16:9 frame regardless of coordinate size
        const searchRange = Math.max(1, Math.ceil(worldSize / (span * GLOBAL_CELL_SIZE)));
        
        for (let dx = -span * searchRange; dx <= span * searchRange; dx += span) {
            for (let dy = -span * searchRange; dy <= span * searchRange; dy += span) {
                const instX = constrainedX + dx;
                const instY = constrainedY + dy;
                
                const distToCenterX = Math.abs(instX);
                const distToCenterY = Math.abs(instY);
                
                // SEAMLESS TRANSITION: Treat primary and ghost instances identically.
                // This ensures that as an object exits one side, its counterpart enters the other with matching opacity.
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

    // Simulation logic (Forces Mode only)
    const currentRad = React.useMemo(() => (currentHeading) * Math.PI / 180, [currentHeading]);
    
    const forceVectors = React.useMemo(() => {
        const currentMag = effectiveSpeed * 14;
        const dragMag = effectiveSpeed * 7;
        return {
            gravity: { x: 0, y: 0, z: -70 },
            buoyancy: { x: 0, y: 0, z: 70 },
            current: {
                x: Math.sin(currentRad) * currentMag,
                y: Math.cos(currentRad) * currentMag,
                z: 0
            },
            drag: {
                x: -Math.sin(currentRad) * dragMag,
                y: -Math.cos(currentRad) * dragMag,
                z: 0
            }
        };
    }, [currentRad, effectiveSpeed]);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio={preserveAspectRatio}
            className="w-full h-auto bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl"
            style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }} // Ensure responsiveness and touch control
            {...interactionProps}
        >
            <SceneEnvironment width={width} height={height} />
            <WaterBlock size={worldSize} toScreen={toScreen} />
            
            {showGlobalGrid && <IsometricGrid size={worldSize} step={GLOBAL_CELL_SIZE} toScreen={toScreen} />}
            {showGlobalAxes && (
                <IsometricAxes
                    origin={{ x: -worldSize, y: -worldSize, z: 0 }}
                    length={60}
                    toScreen={toScreen}
                />
            )}
            
            {activeTab === 0 && <CourseTrailArrows toScreen={toScreen} />}

            {activeTab === 0 && (
                <>
                    <OccupancyGridOverlay toScreen={toScreen} gridType="occupancy" />
                    <OccupancyGridOverlay toScreen={toScreen} gridType="navigation" />
                </>
            )}

            {/* Live vessel-position marker: green current cell follows the vessel on the global grid. */}
            {activeTab === 0 && mappingData && (
                <GridCellIcon
                    cx={Math.floor(constrainedX + gridLimit) * GLOBAL_CELL_SIZE - worldSize}
                    cy={Math.floor(constrainedY + gridLimit) * GLOBAL_CELL_SIZE - worldSize}
                    toScreen={toScreen}
                    cellType={CellTypes.current}
                    opacity={0.85}
                />
            )}

            {activeTab === 0 && mappingData && worldInstances.map((inst, idx) => (
                <g key={`${idx}-${inst.x}-${inst.y}`} opacity={inst.opacity}>
                    <LocalGrid
                        globalX={inst.x}
                        globalY={inst.y}
                        localRotation={mappingData.localRotationOverride ?? effectiveHeading}
                        showLocalAxes={showLocalAxes}
                        toScreen={toScreen}
                        pointScreen={inst.pointScreen}
                        globalOriginScreen={inst.globalOriginScreen}
                    />
                </g>
            ))}

            {activeTab === 1 && (
                <>
                    <FlowParticles 
                        velocity={forceVectors.current} 
                        time={forcesData?.time ?? internalTime} 
                        toScreen={toScreen} 
                    />
                    <FloatingObject
                        time={forcesData?.time ?? internalTime}
                        objectHeading={effectiveObjectHeading}
                        currentSpeed={effectiveSpeed}
                        currentRad={currentRad}
                        forces={forceVectors}
                        toScreen={toScreen}
                    />
                </>
            )}
        </svg>
    );
};