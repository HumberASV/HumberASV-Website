/**
 * @file IsometricAxes.tsx
 * @description A reusable 3D coordinate axes indicator.
 */
import React from 'react';
import { type Point3D, type Point2D } from '../../../utils/telemetry/mapUtils';
import { Arrow3D } from './Arrow3D';

interface IsometricAxesProps {
    origin: Point3D;
    length: number;
    toScreen: (x: number, y: number, z: number) => Point2D;
    showOrigin?: boolean;
    rotation?: number; // Rotation in degrees for the XY plane
}

export const IsometricAxes: React.FC<IsometricAxesProps> = ({ origin, length, toScreen, showOrigin = true, rotation = 0 }) => {
    const originScreen = toScreen(origin.x, origin.y, origin.z);
    const rad = (-rotation * Math.PI) / 180;

    // Calculate rotated direction vectors for X and Y axes
    const xAxisDir = { x: length * Math.cos(rad), y: length * Math.sin(rad), z: 0 };
    const yAxisDir = { x: -length * Math.sin(rad), y: length * Math.cos(rad), z: 0 };
    const zAxisDir = { x: 0, y: 0, z: length };

    return (
        <g>
            <Arrow3D start={origin} direction={xAxisDir} color="error" label="X" labelOffset={{ x: xAxisDir.x * 0.3, y: xAxisDir.y * 0.3, z: 0 }} toScreen={toScreen} />
            <Arrow3D start={origin} direction={yAxisDir} color="success" label="Y" labelOffset={{ x: yAxisDir.x * 0.3, y: yAxisDir.y * 0.3, z: 0 }} toScreen={toScreen} />
            <Arrow3D start={origin} direction={zAxisDir} color="info" label="Z" labelOffset={{ x: 0, y: 0, z: 12 }} toScreen={toScreen} />
            
            {showOrigin && (
                <circle cx={originScreen.x} cy={originScreen.y} r="5" fill="#fff" stroke="#000" strokeWidth="2" />
            )}
        </g>
    );
};