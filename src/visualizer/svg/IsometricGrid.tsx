/**
 * @file IsometricGrid.tsx
 * @description A reusable isometric grid component.
 * 
 * @author Carson Fujita
 * 
 * @remarks
 * This component renders a flat isometric grid of horizontal and vertical lines at a specified center point and rotation angle.
 * The grid can be customized in terms of size, step spacing, color, and opacity.
 * The grid is projected onto a 2D SVG canvas using a provided projection function.
 */
import React from 'react';
import { useTheme } from '@mui/material';
import { type Cell } from '../../utils/types';

/**
 * @interface IsometricGridProps
 * @description Properties for the {@link IsometricGrid} component.
 * @see {@link IsometricGrid}
 * @property {number} size - The half-size of the grid in world units. The grid will extend from -size to +size in both X and Y directions.
 * @property {number} step - The spacing between grid lines in world units.
 * @property {(x: number, y: number, z: number) => Cell} toScreen - Projection function to convert 3D coordinates to 2D screen coordinates.
 * @property {string} [color] - Optional color for the grid lines. If not provided, defaults to the theme's grid color.
 * @property {number} [opacity] - Optional opacity for the grid lines. Defaults to 1 (fully opaque).
 * @property {{ x: number, y: number, z: number }} [center] - Optional center point of the grid in world coordinates. Defaults to { x: 0, y: 0, z: 0 }.
 * @property {number} [rotation] - Optional rotation angle in degrees for the grid in the XY plane. Defaults to 0 (no rotation).
 */
interface IsometricGridProps {
    size: number;
    step: number;
    toScreen: (x: number, y: number, z: number) => Cell;
    color?: string;
    opacity?: number;
    center?: { x: number, y: number, z: number };
    rotation?: number; // degrees
}

/**
 * Renders a flat isometric grid of horizontal and vertical lines at the given center and rotation.
 */
export const IsometricGrid: React.FC<IsometricGridProps> = ({
    size,
    step,
    toScreen = (x, y) => ({ x: x / 2, y: y / 2 }),
    color,
    opacity = 1,
    center = { x: 0, y: 0, z: 0 },
    rotation = 0
}) => {
    const theme = useTheme();
    const gridColor = color ?? theme.palette.map.grid;
    const lines: React.ReactNode[] = [];
    // Negate rotation to match clockwise compass heading used in simulation and axes
    const rad = (-rotation * Math.PI) / 180;

    /** Rotates a local-frame point by the grid rotation and translates it to world space. */
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
        lines.push(<line key={`gx-${y}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={gridColor} opacity={opacity} strokeWidth="1" />);
    }

    // Y-axis lines
    for (let x = -size; x <= size; x += step) {
        const p1 = getRotatedPoint(x, -size);
        const p2 = getRotatedPoint(x, size);
        const start = toScreen(p1.x, p1.y, center.z);
        const end = toScreen(p2.x, p2.y, center.z);
        lines.push(<line key={`gy-${x}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={gridColor} opacity={opacity} strokeWidth="1" />);
    }

    return <g>{lines}</g>;
};