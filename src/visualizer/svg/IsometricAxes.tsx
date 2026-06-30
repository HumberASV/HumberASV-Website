/**
 * @file IsometricAxes.tsx
 * @description A reusable 3D coordinate axes indicator.
 * @author Carson Fujita
 * 
 * @remarks
 * This component renders three labelled coordinate-axis arrows (X, Y, Z) in isometric projection at a specified origin.
 * The axes can be rotated in the XY plane by a specified angle, allowing for flexible orientation.
 * The length of the axes can be customized, and an optional origin marker can be displayed.
 */
import React from 'react';
import { useTheme } from '@mui/material';
import { Arrow3D } from './Arrow3D';
import { type Cell } from '../../utils/types';

/**
 * @interface IsometricAxesProps
 * @description Properties for the {@link IsometricAxes} component.
 * @see {@link IsometricAxes}
 * @property {Cell} origin - The 3D coordinates of the origin point where the axes intersect.
 * 
 * @property {number} length - The length of the X and Y axes in world units.
 *  defaults to 100 if not provided.
 * @property {number} [lengthZ] - The length of the Z axis in world units. Defaults to the same value as `length`.
 *   defaults to `length` if not provided.
 * @property {(x: number, y: number, z: number) => Cell} toScreen - Projection function to convert 3D coordinates to 2D screen coordinates.
 *  defaults to a simple orthographic projection if not provided.
 * @property {boolean} [showOrigin] - Whether to display a marker at the origin point. Defaults to true.
 * @property {number} [rotation] - Rotation angle in degrees for the XY plane. Defaults to 0 (no rotation).
 */
interface IsometricAxesProps {
    origin?: Cell;
    length?: number;
    lengthZ?: number;
    toScreen?: (x: number, y: number, z: number) => Cell;
    showOrigin?: boolean;
    rotation?: number; // Rotation in degrees for the XY plane
}

/**
 * @component IsometricAxes
 * @description Renders three labelled coordinate-axis arrows (X, Y, Z) in isometric projection at the given origin.
 * @param {IsometricAxesProps} props - Properties for the component.
 * @returns {JSX.Element} A React element representing the isometric axes.
 * @remarks
 * The axes can be rotated in the XY plane by a specified angle, allowing for flexible orientation.
 * The length of the axes can be customized, and an optional origin marker can be displayed.
 * @example
 * <IsometricAxes
 *  origin={{ x: 0, y: 0, z: 0 }}
 *  length={100}
 *  lengthZ={50}
 * toScreen={(x, y, z) => ({ x: x / 2, y: y / 2 })}
 * showOrigin={true}
 * rotation={45}
 * />
 */
export const IsometricAxes: React.FC<IsometricAxesProps> = ({ 
    origin = { x: 0, y: 0, z: 0 }, 
    length = 100, 
    lengthZ = length, 
    toScreen = (x, y) => ({ x: x / 2, y: y / 2 }), 
    showOrigin = true, 
    rotation = 0 
}) => {
    const theme = useTheme();
    const originScreen = toScreen(origin.x, origin.y, (origin.z || 0));
    const h = (rotation * Math.PI) / 180;
    const ux =  Math.cos(h);
    const uy =  Math.sin(h);
    const xAxisDir = { x: -length * ux, y:  -length * uy, z: 0 };
    
    // The Y axis is rotated 90 degrees counter-clockwise from the X axis in the XY plane
    const yAxisDir = { x: length * uy, y:  -length * ux, z: 0 };
    const zAxisDir = { x: 0, y: 0, z: lengthZ };

    // Calculate label offsets to position the labels slightly away from the arrow tips
    const LABEL_DIST = 20;
    const xLabel = { x: -ux * LABEL_DIST, y: uy * LABEL_DIST, z: 0 };
    const yLabel = { x: uy * LABEL_DIST, y:  -ux * LABEL_DIST, z: 0 };

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