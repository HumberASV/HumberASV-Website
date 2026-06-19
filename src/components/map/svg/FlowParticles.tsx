/**
 * @file FlowParticles.tsx
 * @description Animated particles that visualize fluid flow direction and speed.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { type Cell } from '../../../utils/types';

export interface FlowParticlesProps {
    velocity: Cell;
    time: number;
    toScreen: (x: number, y: number, z: number) => Cell;
    numParticles?: number;
    color?: string;
    bounds?: number;
}

export const FlowParticles: React.FC<FlowParticlesProps> = ({
    velocity,
    time,
    toScreen,
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

    const animFactor = speed * 0.4;

    const cols = 6;
    const spacing = 100;

    const particles: React.ReactNode[] = [];

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
