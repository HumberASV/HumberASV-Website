/**
 * @file FloatingObject.tsx
 * @description A 3D floating object component with force vectors projected onto a 2D SVG canvas.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { Arrow3D } from './Arrow3D';
import { type Cell } from '../../../utils/types';

export interface FloatingObjectProps {
    /** Current animation time. */
    time: number;
    /** The heading of the object in degrees. */
    objectHeading: number;
    /** Current speed of the water. */
    currentSpeed: number;
    /** Current heading of the water in radians. */
    currentRad: number;
    /** Map of force vectors acting on the object. */
    forces: {
        gravity: Cell;
        buoyancy: Cell;
        current: Cell;
        drag: Cell;
    };
    /** Projection function to convert 3D coordinates to 2D screen coordinates. */
    toScreen: (x: number, y: number, z: number) => Cell;
}

/**
 * Renders a 3D ellipsoid representing a floating object with buoyancy and flow forces.
 */
export const FloatingObject: React.FC<FloatingObjectProps> = ({
    time,
    objectHeading,
    currentRad,
    forces,
    toScreen
}) => {
    const theme = useTheme();
    const bobZ = Math.sin(time * 2) * 3;
    const driftX = forces.current.x * 0.02;
    const driftY = forces.current.y * 0.02;

    const objectCenter: Cell = { x: driftX, y: driftY, z: 20 + bobZ };
    const radiusLong = 55;
    const radiusShort = 35;
    const radiusZ = 25;

    // Negate rotation to match clockwise compass heading
    const rad = (-objectHeading * Math.PI) / 180;
    const cosH = Math.cos(rad);
    const sinH = Math.sin(rad);

    const getEllipsePoint = (angle: number, radiusL: number, radiusS: number): Cell => {
        const localX = radiusS * Math.cos(angle);
        const localY = radiusL * Math.sin(angle);
        const rotX = localX * cosH - localY * sinH;
        const rotY = localX * sinH + localY * cosH;
        return { x: rotX, y: rotY };
    };

    const slices: React.ReactNode[] = [];
    const numPoints = 32;
    
    for (let zOffset = -radiusZ; zOffset <= radiusZ; zOffset += 6) {
        const zFactor = Math.sqrt(1 - (zOffset / radiusZ) ** 2);
        const rL = radiusLong * zFactor;
        const rS = radiusShort * zFactor;
        const isUnderwater = (objectCenter.z || 0) + zOffset < 0;
        
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const localPt = getEllipsePoint(angle, rL, rS);
            const screenPt = toScreen(objectCenter.x + localPt.x, objectCenter.y + localPt.y, (objectCenter.z || 0) + zOffset);
            points.push(`${i === 0 ? 'M' : 'L'} ${screenPt.x} ${screenPt.y}`);
        }
        
        slices.push(
            <path key={`slice-${zOffset}`} d={points.join(' ') + ' Z'} fill="none" stroke={isUnderwater ? theme.palette.warning.dark : theme.palette.warning.main} strokeWidth="2" strokeDasharray={isUnderwater ? "4,4" : "none"} opacity={isUnderwater ? 0.6 : 1} />
        );
    }

    const waterlinePoints: string[] = [];
    for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const zFactor = Math.sqrt(1 - (0 / radiusZ) ** 2);
        const localPt = getEllipsePoint(angle, radiusLong * zFactor, radiusShort * zFactor);
        const screenPt = toScreen(objectCenter.x + localPt.x, objectCenter.y + localPt.y, (objectCenter.z || 0));
        waterlinePoints.push(`${i === 0 ? 'M' : 'L'} ${screenPt.x} ${screenPt.y}`);
    }

    const waterlinePos = toScreen(objectCenter.x, objectCenter.y, (objectCenter.z || 0));
    
    const headingLength = 70;
    // Align vector with corrected rotation: X = sin(H), Y = cos(H)
    const headingDirX = -Math.sin(rad) * headingLength;
    const headingDirY = Math.cos(rad) * headingLength;
    const objectHeadingDir: Cell = { x: headingDirX, y: headingDirY, z: 0 };

    // Refs to track previous time and current display vectors for animation
    const lastTimeRef = React.useRef(time);
    const displayCurrentRef = React.useRef<Cell>({ x: 0, y: 0, z: 0 });
    const displayDragRef = React.useRef<Cell>({ x: 0, y: 0, z: 0 });

    // Clamp current and drag force arrows for better visibility
    const clampedCurrent = React.useMemo(() => {
        const len = Math.sqrt(forces.current.x ** 2 + forces.current.y ** 2 + (forces.current.z || 0) ** 2);
        if (len === 0) return forces.current;
        const scale = Math.max(40, Math.min(len, 90)) / len;
        return { x: forces.current.x * scale, y: forces.current.y * scale, z: (forces.current.z || 0) * scale };
    }, [forces]);

    const clampedDrag = React.useMemo(() => {
        const len = Math.sqrt(forces.drag.x ** 2 + forces.drag.y ** 2 + (forces.drag.z || 0) ** 2);
        if (len === 0) return forces.drag;
        const scale = Math.max(30, Math.min(len, 80)) / len;
        return { x: forces.drag.x * scale, y: forces.drag.y * scale, z: (forces.drag.z || 0) * scale };
    }, [forces.drag]);

    // Smoothly interpolate display vectors toward clamped targets
    const dt = Math.max(0, time - lastTimeRef.current);
    lastTimeRef.current = time;
    
    // 1 - exp(-dt * speed) creates a frame-rate independent smooth transition
    const lerpFactor = dt > 0 ? 1 - Math.exp(-dt * 8) : 1;

    const animatedCurrent = {
        x: displayCurrentRef.current.x + (clampedCurrent.x - displayCurrentRef.current.x) * lerpFactor,
        y: displayCurrentRef.current.y + (clampedCurrent.y - displayCurrentRef.current.y) * lerpFactor,
        z: (displayCurrentRef.current.z || 0) + ((clampedCurrent.z || 0) - (displayCurrentRef.current.z || 0)) * lerpFactor,
    };
    displayCurrentRef.current = animatedCurrent;

    const animatedDrag = {
        x: displayDragRef.current.x + (clampedDrag.x - displayDragRef.current.x) * lerpFactor,
        y: displayDragRef.current.y + (clampedDrag.y - displayDragRef.current.y) * lerpFactor,
        z: (displayDragRef.current.z || 0) + ((clampedDrag.z || 0) - (displayDragRef.current.z || 0)) * lerpFactor,
    };
    displayDragRef.current = animatedDrag;

    return (
        <g>
            {/* Shadow */}
            <path
                d={(() => {
                    const shadowPoints: string[] = [];
                    for (let i = 0; i <= numPoints; i++) {
                        const angle = (i / numPoints) * Math.PI * 2;
                        const localPt = getEllipsePoint(angle, radiusLong * 0.8, radiusShort * 0.8);
                        const screenPt = toScreen(objectCenter.x + localPt.x, objectCenter.y + localPt.y, 0);
                        shadowPoints.push(`${i === 0 ? 'M' : 'L'} ${screenPt.x} ${screenPt.y}`);
                    }
                    return shadowPoints.join(' ') + ' Z';
                })()}
                fill={alpha(theme.palette.common.black, 0.2)}
            />
            
            {slices}
            
            {/* Waterline fill */}
            <path d={waterlinePoints.join(' ') + ' Z'} fill={theme.palette.warning.main} fillOpacity="0.8" stroke={theme.palette.warning.dark} strokeWidth="2" />

            {/* Force arrows */}
            <Arrow3D start={objectCenter} direction={objectHeadingDir} color={theme.palette.text.primary} label="Heading" labelOffset={{ x: headingDirX * 0.3, y: headingDirY * 0.3, z: 5 }} toScreen={toScreen} />
            <Arrow3D start={objectCenter} direction={forces.gravity} color="error" label="Weight" labelOffset={{ x: 18, y: 0, z: -10 }} toScreen={toScreen} />
            <Arrow3D start={objectCenter} direction={forces.buoyancy} color="success" label="Buoyancy" labelOffset={{ x: 18, y: 0, z: 10 }} toScreen={toScreen} />
            <Arrow3D start={objectCenter} direction={animatedCurrent} color="info" label="Current" labelOffset={{ x: -Math.sin(currentRad) * 22, y: Math.cos(currentRad) * 22, z: 5 }} toScreen={toScreen} />
            <Arrow3D start={objectCenter} direction={animatedDrag} color="secondary" label="Drag" labelOffset={{ x: Math.sin(currentRad) * 22, y: -Math.cos(currentRad) * 22, z: 5 }} toScreen={toScreen} />

            {/* Center dot */}
            <circle cx={waterlinePos.x} cy={waterlinePos.y} r="5" fill={theme.palette.common.white} />
        </g>
    );
};