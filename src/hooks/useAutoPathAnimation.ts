/**
 * @file useAutoPathAnimation.ts
 * @description Animates the vessel along the planned path (planning.plan) in automatic simulation mode.
 * Loops from the current cell to the objective cell. If an error cell exists in the navigation grid
 * (unreachable objective), the vessel stays at the current position and does not move.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppSelector } from '../store';
import type { RootState } from '../store';
import { CellTypes, GLOBAL_GRID_SIZE } from '../utils/types';

interface AutoAnimState {
    x: number;
    y: number;
    heading: number;
}

/**
 * Converts a grid cell index to the globalX/Y coordinate used by useMapAnimation.
 * globalX/Y are in cell units, centered at 0 (range –GLOBAL_GRID_SIZE/2 to +GLOBAL_GRID_SIZE/2).
 * Adding 0.5 positions the vessel at the center of the cell rather than the top-left corner.
 */
function cellToWorld(idx: number): number {
    return idx - GLOBAL_GRID_SIZE / 2 + 0.5;
}

export function useAutoPathAnimation(enabled: boolean, speed: number = 2.0) {
    const plan = useAppSelector((state: RootState) => state.telemetry.planning.plan);
    const navigationGrid = useAppSelector((state: RootState) => state.telemetry.map.navigationGrid);

    // Stop animation when the objective is unreachable (error cell present in nav grid).
    const hasError = useMemo(
        () => navigationGrid.some(row => row.some(cell => cell.type === CellTypes.error)),
        [navigationGrid]
    );

    // Convert plan grid cells (col, row indices) to continuous world coordinates.
    const waypoints = useMemo(
        () => plan.map(cell => ({ x: cellToWorld(cell.x), y: cellToWorld(cell.y) })),
        [plan]
    );

    const startPos: AutoAnimState = {
        x: waypoints[0]?.x ?? 0,
        y: waypoints[0]?.y ?? 0,
        heading: 0,
    };

    const [animState, setAnimState] = useState<AutoAnimState>(startPos);
    const progressRef = useRef(0);
    const frameRef = useRef<number>(0);
    const lastTimeRef = useRef<number | null>(null);

    // Reset to start of path when plan changes (new telemetry data).
    useEffect(() => {
        progressRef.current = 0;
        setAnimState({ x: waypoints[0]?.x ?? 0, y: waypoints[0]?.y ?? 0, heading: 0 });
    }, [waypoints]);

    useEffect(() => {
        if (!enabled || hasError || waypoints.length < 2) return;

        const totalSteps = waypoints.length - 1;

        const animate = (now: number) => {
            if (lastTimeRef.current === null) lastTimeRef.current = now;
            const dt = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            progressRef.current = (progressRef.current + speed * dt) % totalSteps;

            const idx = Math.floor(progressRef.current);
            const t = progressRef.current - idx;
            const from = waypoints[idx];
            const to = waypoints[Math.min(idx + 1, totalSteps)];

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            // Heading: 0 = north (–Y), 90 = east (+X), matches app convention.
            const heading = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;

            setAnimState({
                x: from.x + dx * t,
                y: from.y + dy * t,
                heading,
            });

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            lastTimeRef.current = null;
        };
    }, [enabled, hasError, waypoints, speed]);

    return { autoX: animState.x, autoY: animState.y, autoHeading: animState.heading };
}
