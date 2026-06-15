/**
 * @file IsometricGrid.tsx
 * @description A reusable isometric grid component.
 */
import React from 'react';
import { type Cell } from '../../../utils/types';

interface IsometricGridProps {
    size: number;
    step: number;
    toScreen: (x: number, y: number, z: number) => Cell;
    color?: string;
    opacity?: number;
    center?: { x: number, y: number, z: number };
    rotation?: number; // degrees
}

export const IsometricGrid: React.FC<IsometricGridProps> = ({
    size,
    step,
    toScreen,
    color = "rgba(255,255,255,0.2)",
    opacity = 1,
    center = { x: 0, y: 0, z: 0 },
    rotation = 0
}) => {
    const lines: React.ReactNode[] = [];
    // Negate rotation to match clockwise compass heading used in simulation and axes
    const rad = (-rotation * Math.PI) / 180;

    const getRotatedPoint = (lx: number, ly: number) => {
        const rx = lx * Math.cos(rad) - ly * Math.sin(rad);
        const ry = lx * Math.sin(rad) + ly * Math.cos(rad);
        return { x: center.x + rx, y: center.y + ry };
    };

    // X-axis lines
    for (let y = -size; y <= size; y += step) {
        const p1 = getRotatedPoint(-size, y);
        const p2 = getRotatedPoint(size, y);
        const start = toScreen(p1.x, p1.y, center.z);
        const end = toScreen(p2.x, p2.y, center.z);
        lines.push(<line key={`gx-${y}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} opacity={opacity} strokeWidth="1" />);
    }

    // Y-axis lines
    for (let x = -size; x <= size; x += step) {
        const p1 = getRotatedPoint(x, -size);
        const p2 = getRotatedPoint(x, size);
        const start = toScreen(p1.x, p1.y, center.z);
        const end = toScreen(p2.x, p2.y, center.z);
        lines.push(<line key={`gy-${x}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} opacity={opacity} strokeWidth="1" />);
    }

    return <g>{lines}</g>;
};