/**
 * @file Arrow3D.tsx
 * @description A 3D vector arrow component projected onto a 2D SVG canvas.
 * @author Carson Fujita
 * 
 * @remarks
 * This component renders a 3D arrow with a head and an optional label. 
 * The arrow is defined by a starting point and a direction vector in 3D space. 
 * The arrow is projected onto a 2D SVG canvas using a provided projection function.
 * 
 * The color of the arrow can be specified using MUI theme palette keys or custom color strings. 
 * If the specified color is not found in the theme palette, it will fall back to predefined colors.
 * 
 * @example
 * <Arrow3D 
 *  start={{ x: 0, y: 0, z: 0 }}
 *  direction={{ x: 10, y: 5, z: 2 }}
 *  color="primary"
 *  label="Velocity"
 *  labelOffset={{ x: 0, y: 0, z: 5 }}
 *  toScreen={(x, y, z) => ({ x: x * 10, y: y * 10 })}
 *  />
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { type Cell  } from '../../utils/types';

/**
 * @interface Arrow3DProps
 * @description Properties for the {@link Arrow3D} component.
 * @see {@link Arrow3D}
 * @property {Cell} start - Starting point of the arrow in 3D space. 
 *  defaults to { x: 0, y: 0, z: 0 } if not provided.
 * @property {Cell} direction - The vector representing the direction and magnitude of the arrow. 
 *  defaults to { x: 0, y: 0, z: 0 } if not provided.
 * @property {string} color - Stroke and fill color of the arrow. Can be a theme palette key or a custom color string. 
 *  defaults to 'primary' if not provided.
 * @property {string} label - Text label to display at the tip of the arrow.
 *  defaults to an empty string if not provided.
 * @property {Cell} [labelOffset] - Optional offset for the label relative to the arrow tip in 3D space.
 *  defaults to { x: 0, y: 0, z: 0 } if not provided.
 * @property {(x: number, y: number, z: number) => Cell} toScreen - Projection function to convert 3D coordinates to 2D screen coordinates.
 *  defaults to a simple orthographic projection if not provided.
 */
export interface Arrow3DProps {
    /** Starting point of the arrow in 3D space. */
    start: Cell;
    /** The vector representing the direction and magnitude of the arrow. */
    direction: Cell;
    /** Stroke and fill color of the arrow. */
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning' | string;
    /** Text label to display at the tip of the arrow. */
    label?: string;
    /** Optional offset for the label relative to the arrow tip in 3D space. */
    labelOffset?: Cell;
    /** Projection function to convert 3D coordinates to 2D screen coordinates. */
    toScreen?: (x: number, y: number, z: number) => Cell;
}

/**
 * @constant COLOR_FALLBACKS
 * @description Default color presets to preserve original hardcoded colors if theme palette is missing them.
 * @property {string} error - Fallback color for error states.
 * @property {string} success - Fallback color for success states.
 * @property {string} info - Fallback color for informational states.
 * @property {string} secondary - Fallback color for secondary actions.
 * @property {string} primary - Fallback color for primary actions.
 * @property {string} warning - Fallback color for warning states.
 * @remarks
 * These colors are chosen to match the default MUI theme palette.
 * If the theme palette is missing a color, these fallbacks will be used.
 */
const COLOR_FALLBACKS: Record<string, string> = {
    /**
     * @description Error color used for indicating errors or critical states.
     */
    error: '#ef4444',

    /**
     * @description Success color used for indicating successful operations or positive states.
     */
    success: '#22c55e',

    /**
     * @description Info color used for informational messages or neutral states.
     */
    info: '#3b82f6',

    /**
     * @description Secondary color used for secondary actions or less prominent elements.
     */
    secondary: '#a855f7',

    /**
     * @description Primary color used for primary actions or prominent elements.
     */
    primary: '#3b82f6',

    /**
     * @description Warning color used for warnings or cautionary states.
     */
    warning: '#f59e0b',
};

/**
 * @function Arrow3D
 * @description Renders a 3D arrow with a head and a label in an SVG group.
 * @param props - The {@link Arrow3DProps} for the Arrow3D component.
 * @returns {JSX.Element | null} The rendered SVG elements representing the arrow, or null if the arrow is too short.
 * @remarks
 * The arrow is projected from 3D space to 2D screen coordinates using the provided `toScreen` function.
 * The arrow's color is resolved from the MUI theme palette or falls back to predefined colors if not found.
 * The label is positioned at the tip of the arrow with an optional offset.
 */
export const Arrow3D: React.FC<Arrow3DProps> = ({ 
    start = { x: 0, y: 0, z: 0 },
    direction = { x: 0, y: 0, z: 0 },
    color = 'primary', 
    label = '', 
    labelOffset = { x: 0, y: 0, z: 0 },
    toScreen = (x, y) => ({ x, y }) 
    //TypeScript allows functions with fewer parameters to be assigned to types expecting more.
}) => {
    const theme = useTheme();

    // Define default values for z-coordinates if they are not provided
    const dirZ = direction.z ?? 0;
    const startZ = start.z ?? 0;
    const labelOffsetZ = labelOffset.z ?? 0;

    // Resolve color: 
    // 1. Check MUI theme palette
    // 2. Check local COLOR_FALLBACKS
    // 3. Fallback to provided string (hex, rgb, etc.)
    const palette = theme.palette as unknown as Record<string, { main?: string }>;
    const resolvedColor = palette[color]?.main || COLOR_FALLBACKS[color] || color;
    const length = Math.sqrt(direction.x ** 2 + direction.y ** 2 + dirZ ** 2);
    if (length < 5) return null;

    // Calculate the end point of the arrow in 3D space
    const end = {
        x: start.x + direction.x,
        y: start.y + direction.y,
        z: startZ + dirZ
    };

    // Project the start and end points to 2D screen coordinates
    const startScreen = toScreen(start.x, start.y, startZ);
    const endScreen = toScreen(end.x, end.y, end.z);

    // Calculate the angle of the arrow in 2D space for the arrowhead orientation
    const dx = endScreen.x - startScreen.x;
    const dy = endScreen.y - startScreen.y;
    const angle = Math.atan2(dy, dx);
    const headLength = Math.max(8, Math.min(length * 0.18, 18));
    const headAngle = Math.PI / 6;

    // Calculate the points for the arrowhead
    const head1X = endScreen.x - headLength * Math.cos(angle - headAngle);
    const head1Y = endScreen.y - headLength * Math.sin(angle - headAngle);
    const head2X = endScreen.x - headLength * Math.cos(angle + headAngle);
    const head2Y = endScreen.y - headLength * Math.sin(angle + headAngle);

    // Calculate the midpoint of the arrowhead base for the line end
    const lineEndX = (head1X + head2X) / 2;
    const lineEndY = (head1Y + head2Y) / 2;

    // Calculate the position for the label, applying the optional offset in 3D space
    const labelPos = toScreen(
        end.x + labelOffset.x,
        end.y + labelOffset.y,
        end.z + labelOffsetZ
    );

    return (
        <g style={{ filter: `drop-shadow(2px 2px 2px ${alpha(theme.palette.common.black, 0.5)})` }}>
            <line x1={startScreen.x} y1={startScreen.y} x2={lineEndX} y2={lineEndY} stroke={resolvedColor} strokeWidth="3" />
            <polygon points={`${endScreen.x},${endScreen.y} ${head1X},${head1Y} ${head2X},${head2Y}`} fill={resolvedColor} />
            <text x={labelPos.x} y={labelPos.y} fill={resolvedColor} fontSize="13" fontWeight="bold" textAnchor="middle">{label}</text>
        </g>
    );
};