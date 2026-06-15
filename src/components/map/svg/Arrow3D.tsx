/**
 * @file Arrow3D.tsx
 * @description A 3D vector arrow component projected onto a 2D SVG canvas.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { type Point3D, type Point2D } from '../../../utils/telemetry/mapUtils';

/**
 * Props for the Arrow3D component.
 */
export interface Arrow3DProps {
    /** Starting point of the arrow in 3D space. */
    start: Point3D;
    /** The vector representing the direction and magnitude of the arrow. */
    direction: Point3D;
    /** Stroke and fill color of the arrow. */
    color: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning' | string;
    /** Text label to display at the tip of the arrow. */
    label: string;
    /** Optional offset for the label relative to the arrow tip in 3D space. */
    labelOffset?: Point3D;
    /** Projection function to convert 3D coordinates to 2D screen coordinates. */
    toScreen: (x: number, y: number, z: number) => Point2D;
}

/**
 * Default color presets to preserve original hardcoded colors if theme palette is missing them.
 */
const COLOR_FALLBACKS: Record<string, string> = {
    error: '#ef4444',
    success: '#22c55e',
    info: '#3b82f6',
    secondary: '#a855f7',
    primary: '#3b82f6',
    warning: '#f59e0b',
};

/**
 * Renders a 3D arrow with a head and a label in an SVG group.
 * 
 * @param props - The properties for the Arrow3D component.
 */
export const Arrow3D: React.FC<Arrow3DProps> = ({ 
    start, 
    direction, 
    color, 
    label, 
    labelOffset = { x: 0, y: 0, z: 0 },
    toScreen
}) => {
    const theme = useTheme();
    
    // Resolve color: 
    // 1. Check MUI theme palette
    // 2. Check local COLOR_FALLBACKS
    // 3. Fallback to provided string (hex, rgb, etc.)
    const palette = theme.palette as unknown as Record<string, { main?: string }>;
    const resolvedColor = palette[color]?.main || COLOR_FALLBACKS[color] || color;

    const length = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
    if (length < 5) return null;

    const end = {
        x: start.x + direction.x,
        y: start.y + direction.y,
        z: start.z + direction.z
    };

    const startScreen = toScreen(start.x, start.y, start.z);
    const endScreen = toScreen(end.x, end.y, end.z);

    const dx = endScreen.x - startScreen.x;
    const dy = endScreen.y - startScreen.y;
    const angle = Math.atan2(dy, dx);
    const headLength = Math.max(8, Math.min(length * 0.18, 18));
    const headAngle = Math.PI / 6;

    const head1X = endScreen.x - headLength * Math.cos(angle - headAngle);
    const head1Y = endScreen.y - headLength * Math.sin(angle - headAngle);
    const head2X = endScreen.x - headLength * Math.cos(angle + headAngle);
    const head2Y = endScreen.y - headLength * Math.sin(angle + headAngle);

    const lineEndX = (head1X + head2X) / 2;
    const lineEndY = (head1Y + head2Y) / 2;

    const labelPos = toScreen(
        end.x + labelOffset.x,
        end.y + labelOffset.y,
        end.z + labelOffset.z
    );

    return (
        <g style={{ filter: `drop-shadow(2px 2px 2px ${alpha(theme.palette.common.black, 0.5)})` }}>
            <line x1={startScreen.x} y1={startScreen.y} x2={lineEndX} y2={lineEndY} stroke={resolvedColor} strokeWidth="3" />
            <polygon points={`${endScreen.x},${endScreen.y} ${head1X},${head1Y} ${head2X},${head2Y}`} fill={resolvedColor} />
            <text x={labelPos.x} y={labelPos.y} fill={resolvedColor} fontSize="13" fontWeight="bold" textAnchor="middle">{label}</text>
        </g>
    );
};