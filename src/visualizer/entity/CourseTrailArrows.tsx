/**
 * @file CourseTrailArrows.tsx
 * @description Renders the vessel's course trail as a continuous polyline in isometric projection,
 * with an arrowhead at the leading tip showing current direction of travel.
 * @remarks
 * This component reads the course trail from the Redux store and renders it in isometric projection.
 * The arrowhead is oriented based on the direction of travel between the last two points in the trail.
 * If the course trail is not visible or contains fewer than two points, the component returns null.
 */
import React from 'react';
import { useTheme } from '@mui/material';
import { useAppSelector } from '../../store';
import type { RootState } from '../../store';
import { GLOBAL_CELL_SIZE } from '../../utils/types';
import type { Cell } from '../../utils/types';

/**
 * @interface CourseTrailArrowsProps
 * @description Properties for the {@link CourseTrailArrows} component.
 * @see {@link CourseTrailArrows}
 * @property {(x: number, y: number, z: number) => Cell} toScreen - Projection function to convert 3D coordinates to 2D screen coordinates.
 *  defaults to a simple orthographic projection if not provided.
 */
interface CourseTrailArrowsProps {
    toScreen?: (x: number, y: number, z: number) => Cell;
}

/**
 * Renders the vessel's recorded course trail as a coloured polyline with a directional arrowhead at the leading tip.
 * @component
 * @param {CourseTrailArrowsProps} props - Properties for the component.
 * @returns {JSX.Element | null} A React element representing the course trail arrows, or null if not visible or insufficient points.
 * @remarks
 * The component reads the course trail from the Redux store and renders it in isometric projection.
 * The arrowhead is oriented based on the direction of travel between the last two points in the trail.
 * If the course trail is not visible or contains fewer than two points, the component returns null.
 * @example
 * <CourseTrailArrows 
 *  toScreen={(x, y, z) => ({ x: x / 2, y: y / 2 })}
 * />
 */
export const CourseTrailArrows: React.FC<CourseTrailArrowsProps> = ({ toScreen= (x, y) => ({ x, y }) }) => {
    const theme = useTheme();
    const trailColor = theme.palette.map.courseTrail;
    const courseTrail = useAppSelector((state: RootState) => state.telemetry.map.courseTrail ?? []);
    const visible = useAppSelector((state: RootState) => state.visualization.showCourseTrail);

    if (!visible || courseTrail.length < 2) return null;

    const pts = courseTrail.map(({ x, y }) => toScreen(x * GLOBAL_CELL_SIZE, y * GLOBAL_CELL_SIZE, 0));
    const polylinePoints = pts.map(p => `${p.x},${p.y}`).join(' ');

    // Arrowhead at the last point, oriented by screen-space direction from previous point
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];

    // Calculate direction vector from previous point to last point
    const dx = last.x - prev.x;
    const dy = last.y - prev.y;

    // Normalize the direction vector to get unit vector
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / len;
    const ny = dy / len;
    const as = 8;

    // Arrowhead points: left and right of the tip, offset by normal vector
    const lx = last.x - nx * as + (-ny) * as * 0.5;
    const ly = last.y - ny * as + nx * as * 0.5;
    const rx = last.x - nx * as - (-ny) * as * 0.5;
    const ry = last.y - ny * as - nx * as * 0.5;

    return (
        <g>
            <polyline
                points={polylinePoints}
                fill="none"
                stroke={trailColor}
                strokeWidth={3}
                opacity={0.75}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <path
                d={`M ${last.x},${last.y} L ${lx},${ly} L ${rx},${ry} Z`}
                fill={trailColor}
                opacity={0.95}
            />
        </g>
    );
};
