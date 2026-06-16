/**
 * @file CourseTrailArrows.tsx
 * @description Renders the course-over-ground trail as isometric directional arrows
 * projected onto the z=0 floor plane. Each visited grid cell shows a triangular
 * arrowhead pointing in the heading the vessel held when it entered that cell.
 */
import React from 'react';
import { alpha, useTheme } from '@mui/material';
import { useAppSelector } from '../../../store';
import type { RootState } from '../../../store';
import { GLOBAL_CELL_SIZE, GLOBAL_GRID_SIZE, type Cell } from '../../../utils/types';

interface CourseTrailArrowsProps {
    toScreen: (x: number, y: number, z: number) => Cell;
}

export const CourseTrailArrows: React.FC<CourseTrailArrowsProps> = ({ toScreen }) => {
    const theme = useTheme();
    const courseTrail = useAppSelector((state: RootState) => state.telemetry.map.courseTrail ?? []);

    if (courseTrail.length === 0) return null;

    const color = theme.palette.info.light;
    // Half the cell size — controls how large the arrow is relative to the cell.
    const s = GLOBAL_CELL_SIZE * 0.32;

    return (
        <g>
            {courseTrail.map(({ col, row, heading }) => {
                const wx = (col - GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE;
                const wy = (row - GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE;
                const cx = wx + GLOBAL_CELL_SIZE / 2;
                const cy = wy + GLOBAL_CELL_SIZE / 2;

                // Cell background — dim info tile so the arrow reads clearly
                const tl = toScreen(wx,                  wy,                  0);
                const tr = toScreen(wx + GLOBAL_CELL_SIZE, wy,                  0);
                const br = toScreen(wx + GLOBAL_CELL_SIZE, wy + GLOBAL_CELL_SIZE, 0);
                const bl = toScreen(wx,                  wy + GLOBAL_CELL_SIZE, 0);
                const cellPts = `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`;

                // Forward direction in world space matches useMapAnimation:
                //   heading 0 (north) → (0, –1), heading 90 (east) → (1, 0)
                const hr = (heading * Math.PI) / 180;
                const fwdX =  Math.sin(hr);
                const fwdY = -Math.cos(hr);
                const perpX = -fwdY;
                const perpY = fwdX;

                // Isometric arrow triangle in world space, projected to screen
                const tip   = toScreen(cx + fwdX * s,                              cy + fwdY * s,                              0);
                const left  = toScreen(cx - fwdX * s * 0.4 + perpX * s * 0.55,    cy - fwdY * s * 0.4 + perpY * s * 0.55,    0);
                const right = toScreen(cx - fwdX * s * 0.4 - perpX * s * 0.55,    cy - fwdY * s * 0.4 - perpY * s * 0.55,    0);

                const arrowPath = `M ${tip.x},${tip.y} L ${left.x},${left.y} L ${right.x},${right.y} Z`;

                return (
                    <g key={`cog-${col}-${row}`}>
                        <polygon
                            points={cellPts}
                            fill={alpha(color, 0.12)}
                            stroke={alpha(color, 0.3)}
                            strokeWidth={0.5}
                        />
                        <path
                            d={arrowPath}
                            fill={color}
                            opacity={0.7}
                        />
                    </g>
                );
            })}
        </g>
    );
};
