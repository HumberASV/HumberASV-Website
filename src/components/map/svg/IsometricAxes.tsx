/**
 * @file IsometricAxes.tsx
 * @description A reusable 3D coordinate axes indicator.
 */
import React from 'react';
import { Arrow3D } from './Arrow3D';
import { type Cell } from '../../../utils/types';

interface IsometricAxesProps {
    origin: Cell;
    length: number;
    toScreen: (x: number, y: number, z: number) => Cell;
    showOrigin?: boolean;
    rotation?: number; // Rotation in degrees for the XY plane
}

export const IsometricAxes: React.FC<IsometricAxesProps> = ({ origin, length, toScreen, showOrigin = true, rotation = 0 }) => {
    const originScreen = toScreen(origin.x, origin.y, (origin.z || 0));
    // Compass heading → radians. X = right (east at heading 0), Y = forward (–Y world at heading 0).
    const h = (rotation * Math.PI) / 180;
    const xAxisDir = { x: length * Math.cos(h), y:  length * Math.sin(h), z: 0 };
    const yAxisDir = { x: length * Math.sin(h), y: -length * Math.cos(h), z: 0 };
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