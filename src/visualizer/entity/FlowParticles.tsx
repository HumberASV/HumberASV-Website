/**
 * @file FlowParticles.tsx
 * @description Animated particles that visualize fluid flow direction and speed.
 * @remarks
 * This component renders a grid of animated particles that drift in the direction and speed of a given velocity vector.
 * The particles are projected onto a 2D SVG canvas using a provided projection function.
 * The animation is based on the current time and the velocity vector, creating a dynamic visualization of fluid flow.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { type Cell } from '../../utils/types';

/**
 * @interface FlowParticlesProps
 * @description Properties for the {@link FlowParticles} component.
 * @see {@link FlowParticles}
 * @property {Cell} velocity - The velocity vector representing the direction and speed of the flow.
 * @property {number} time - The current time value used for animating the particles.
 * @property {(x: number, y: number, z: number) => Cell} toScreen - Projection function to convert 3D coordinates to 2D screen coordinates.
 *  defaults to a simple orthographic projection if not provided.
 * @property {number} [numParticles] - Optional number of particles to render. Defaults to 36.
 * @property {string} [color] - Optional color for the particles. If not provided, defaults to a semi-transparent theme color.
 * @property {number} [bounds] - Optional bounds for particle rendering. Particles outside this range will not be rendered. Defaults to 320.
 */
export interface FlowParticlesProps {
    velocity: Cell;
    time: number;
    toScreen?: (x: number, y: number, z: number) => Cell;
    numParticles?: number;
    color?: string;
    bounds?: number;
}

/**
 * @component FlowParticles
 * @description Renders a grid of animated particles that drift in the direction and speed of the given velocity vector.
 * @param {FlowParticlesProps} props - Properties for the component.
 * @returns {JSX.Element | null} A React element representing the flow particles, or null if the speed is below a threshold.
 * @remarks
 * The component calculates the direction and speed of the flow based on the provided velocity vector.
 * It generates a grid of particles that animate over time, creating a visual representation of fluid flow.
 * The particles are projected onto a 2D SVG canvas using the provided projection function.
 * If the speed of the flow is below a certain threshold, the component returns null to avoid rendering unnecessary particles.
 * @example
 * <FlowParticles 
 *  velocity={{ x: 1, y: 0 }} 
 *  time={performance.now() / 1000} 
 *  toScreen={(x, y, z) => ({ x: x / 2, y: y / 2 })} 
 *  numParticles={36} 
 *  color="rgba(0, 0, 255, 0.5)" 
 *  bounds={320} 
 * />
 */ 
export const FlowParticles: React.FC<FlowParticlesProps> = ({
    velocity,
    time,
    toScreen = (x, y) => ({ x, y }),
    numParticles = 36,
    color,
    bounds = 320
}) => {
    const theme = useTheme();
    const particleColor = color ?? alpha(theme.palette.map.current, 0.5);
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (speed < 0.1) return null;

    const dirX = velocity.x / speed;
    const dirY = velocity.y / speed;

    // Animation factor controls the speed of particle movement relative to the flow speed
    const animFactor = speed * 0.6;

    const cols = 6;
    const spacing = 100;

    const particles: React.ReactNode[] = [];

    // Generate particles in a grid pattern, offset by time to create a flowing effect
    for (let i = 0; i < numParticles; i++) {
        const baseX = ((i % cols) - (cols - 1) / 2) * spacing;
        const baseY = (Math.floor(i / cols) - (cols - 1) / 2) * spacing;

        const animOffset = ((time * animFactor + i * 0.4) % 4) - 2;

        const x = baseX + animOffset * 50 * dirX;
        const y = baseY + animOffset * 50 * dirY;

        if (Math.abs(x) > bounds || Math.abs(y) > bounds) continue;

        const fadeT = (animOffset + 2) / 4;
        const opacity = Math.sin(Math.PI * fadeT) * 0.9;

        const pos = toScreen(x, y, -3);
        particles.push(
            <circle key={i} cx={pos.x} cy={pos.y} r={3} fill={particleColor} opacity={opacity} />
        );
    }

    return <g>{particles}</g>;
};
