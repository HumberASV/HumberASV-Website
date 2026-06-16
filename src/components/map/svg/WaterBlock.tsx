/**
 * @file WaterBlock.tsx
 * @description A 3D water block component projected onto a 2D SVG canvas.
 */
import React from 'react';
import { useTheme } from '@mui/material';
import { type Cell } from '../../../utils/types';

export interface WaterBlockProps {
    /** Size of the water block surface. Defaults to 140. */
    size?: number;
    /** Depth of the water block. Defaults to 60. */
    depth?: number;
    /** Center position in 3D space. Defaults to origin. */
    center?: Cell;
    /** Projection function to convert 3D coordinates to 2D screen coordinates. */
    toScreen: (x: number, y: number, z: number) => Cell;
}

/**
 * Renders an isometric water block with top and side faces.
 * 
 * @param props - The properties for the WaterBlock component.
 */
export const WaterBlock: React.FC<WaterBlockProps> = ({
    size = 140,
    depth = 60,
    center = { x: 0, y: 0, z: 0 },
    toScreen
}) => {
    const theme = useTheme();
    const topCorners = [
        toScreen(center.x - size, center.y - size, (center.z || 0)),
        toScreen(center.x + size, center.y - size, (center.z || 0)),
        toScreen(center.x + size, center.y + size, (center.z || 0)),
        toScreen(center.x - size, center.y + size, (center.z || 0))
    ];

    const bottomCorners = [
        toScreen(center.x - size, center.y - size, (center.z || 0) - depth),
        toScreen(center.x + size, center.y - size, (center.z || 0) - depth),
        toScreen(center.x + size, center.y + size, (center.z || 0) - depth),
        toScreen(center.x - size, center.y + size, (center.z || 0) - depth)
    ];

    const { water } = theme.palette;
    const faces = [
        { id: 'bottom',     points: bottomCorners,                                                       fill: water.abyss,           opacity: 0.9  },
        { id: 'side-right', points: [topCorners[1], topCorners[2], bottomCorners[2], bottomCorners[1]], fill: water.deep,            opacity: 0.85 },
        { id: 'side-left',  points: [topCorners[2], topCorners[3], bottomCorners[3], bottomCorners[2]], fill: water.deeper,          opacity: 0.85 },
        { id: 'top',        points: topCorners,                                                          fill: "url(#waterGradient3d)", opacity: 0.9  },
    ];

    return (
        <g>
            {faces.map(face => (
                <polygon 
                    key={face.id} 
                    points={face.points.map(c => `${c.x},${c.y}`).join(' ')} 
                    fill={face.fill} 
                    opacity={face.opacity} 
                />
            ))}

            <line x1={topCorners[1].x} y1={topCorners[1].y} x2={topCorners[2].x} y2={topCorners[2].y} stroke={water.highlight} strokeWidth="2" />
            <line x1={topCorners[2].x} y1={topCorners[2].y} x2={topCorners[3].x} y2={topCorners[3].y} stroke={water.highlight} strokeWidth="2" />
        </g>
    );
};