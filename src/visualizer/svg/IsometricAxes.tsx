/**
 * @file IsometricAxes.tsx
 * @description A reusable 3D coordinate axes indicator.
 */
import React from 'react';
import { useTheme } from '@mui/material';
import { Arrow3D } from './Arrow3D';
import { type Cell } from '../../utils/types';

interface IsometricAxesProps {
    origin: Cell;
    length: number;
    lengthZ?: number;
    toScreen: (x: number, y: number, z: number) => Cell;
    showOrigin?: boolean;
    rotation?: number; // Rotation in degrees for the XY plane
    /** When true, Y points in the +Y world direction (south, used for global axes).
     *  When false (default), Y points in the local-forward direction (north at heading 0). */
    worldAxes?: boolean;
}

/**
 * Renders three labelled coordinate-axis arrows (X, Y, Z) in isometric projection at the given origin.
 */
export const IsometricAxes: React.FC<IsometricAxesProps> = ({ origin, length, lengthZ = length, toScreen, showOrigin = true, rotation = 0, worldAxes = false }) => {
    const theme = useTheme();
    const originScreen = toScreen(origin.x, origin.y, (origin.z || 0));
    const h = (rotation * Math.PI) / 180;
    const ux =  Math.cos(h);
    const uy =  Math.sin(h);
    const xAxisDir = { x: length * ux, y:  length * uy, z: 0 };
    // Navigation convention (default): Y = local forward = −Y world at heading 0
    // World convention (worldAxes): Y = +Y world = south, consistent with grid row direction
    const yAxisDir = worldAxes
        ? { x: -length * uy, y:  length * ux, z: 0 }
        : { x:  length * uy, y: -length * ux, z: 0 };
    const zAxisDir = { x: 0, y: 0, z: lengthZ };

    // Fixed-distance label offsets so labels stay near the tip regardless of axis length
    const LABEL_DIST = 20;
    const xLabel = { x: ux * LABEL_DIST, y: uy * LABEL_DIST, z: 0 };
    const yLabel = worldAxes
        ? { x: -uy * LABEL_DIST, y:  ux * LABEL_DIST, z: 0 }
        : { x:  uy * LABEL_DIST, y: -ux * LABEL_DIST, z: 0 };

    return (
        <g>
            <Arrow3D start={origin} direction={xAxisDir} color="error" label="X" labelOffset={xLabel} toScreen={toScreen} />
            <Arrow3D start={origin} direction={yAxisDir} color="success" label="Y" labelOffset={yLabel} toScreen={toScreen} />
            <Arrow3D start={origin} direction={zAxisDir} color="info" label="Z" labelOffset={{ x: 0, y: 0, z: 12 }} toScreen={toScreen} />
            
            {showOrigin && (
                <circle cx={originScreen.x} cy={originScreen.y} r="5" fill={theme.palette.common.white} stroke={theme.palette.common.black} strokeWidth="2" />
            )}
        </g>
    );
};