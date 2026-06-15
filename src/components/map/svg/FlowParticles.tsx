/**
 * @file FlowParticles.tsx
 * @description Animated particles that visualize fluid flow direction and speed.
 */
import React from 'react';
import { type Point2D, type Point3D } from '../../../utils/mapUtils';

/**
 * Props for the FlowParticles component.
 */
export interface FlowParticlesProps {
    /** The velocity vector representing flow direction and speed. */
    velocity: Point3D;
    /** Current animation time. */
    time: number;
    /** Projection function to convert 3D coordinates to 2D screen coordinates. */
    toScreen: (x: number, y: number, z: number) => Point2D;
    /** Number of particles to render. Defaults to 16. */
    numParticles?: number;
    /** Color of the particles. Defaults to translucent blue. */
    color?: string;
    /** The boundary size (square radius) for particle visibility. Defaults to 130. */
    bounds?: number;
}

/**
 * Renders animated particles that flow in a specific direction based on a velocity vector.
 * 
 * @param props - The properties for the FlowParticles component.
 */
export const FlowParticles: React.FC<FlowParticlesProps> = ({
    velocity,
    time,
    toScreen,
    numParticles = 16,
    color = "rgba(147, 197, 253, 0.5)",
    bounds = 130
}) => {
    // Calculate speed magnitude in the XY plane
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (speed < 0.1) return null;

    // Normalize direction
    const dirX = velocity.x / speed;
    const dirY = velocity.y / speed;

    // Scale animation speed to match original visualizer logic
    // (currentMag = currentSpeed * 14, original animation used currentSpeed * 0.4)
    const animFactor = speed * (0.4 / 14);

    const particles: React.ReactNode[] = [];

    for (let i = 0; i < numParticles; i++) {
        const baseX = ((i % 4) - 1.5) * 60;
        const baseY = (Math.floor(i / 4) - 1.5) * 60;
        
        const animOffset = ((time * animFactor + i * 0.4) % 4) - 2;
        
        const x = baseX + animOffset * 30 * dirX;
        const y = baseY + animOffset * 30 * dirY;
        
        if (Math.abs(x) < bounds && Math.abs(y) < bounds) {
            const pos = toScreen(x, y, -3);
            particles.push(<circle key={i} cx={pos.x} cy={pos.y} r={3} fill={color} />);
        }
    }
    
    return <g>{particles}</g>;
};