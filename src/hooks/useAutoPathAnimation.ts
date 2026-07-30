/**
 * @file useAutoPathAnimation.ts
 * @description Animates the vessel along the planned path (planning.plan) in automatic simulation mode.
 * Loops from the current cell to the objective cell. If an error cell exists in the navigation grid
 * (unreachable objective), the vessel stays at the current position and does not move.
 */
import { useState, useEffect, useRef, useMemo, startTransition } from 'react';
import { useAppSelector } from '../store';
import type { RootState } from '../store';
import { CellTypes, GLOBAL_GRID_SIZE } from '../utils/types';

/**
 * @interface AutoAnimState
 * @description Represents the state of the automatic path animation.
 * @property {number} x - The current X coordinate of the vessel in world units.
 * @property {number} y - The current Y coordinate of the vessel in world units.
 * @property {number} heading - The current heading of the vessel in degrees (0 = north, 90 = east).
 */
interface AutoAnimState {
    x: number;
    y: number;
    heading: number;
}

/**
 * @function cellToWorld
 * @description Converts a grid cell index to the global X/Y coordinate used by useAutoPathAnimation.
 * @param {number} idx - The grid cell index (column or row).
 * @returns {number} The corresponding world coordinate in cell units, centered at 0.
 * @remarks
 * The function maps the grid cell index to a world coordinate in the range of –GLOBAL_GRID_SIZE/2 to +GLOBAL_GRID_SIZE/2.
 * Adding 0.5 positions the vessel at the center of the cell rather than the top-left corner.
 * This ensures that the vessel is visually centered within each grid cell during animation.
 * @example
 * const worldX = cellToWorld(5); // Converts grid column index 5 to world X coordinate.
 * const worldY = cellToWorld(3); // Converts grid row index 3 to world Y coordinate.
 */
function cellToWorld(idx: number): number {
    return idx - GLOBAL_GRID_SIZE / 2 + 0.5;
}

/**
 * @function useAutoPathAnimation
 * @description Custom React hook that animates the vessel along the planned path in automatic simulation mode.
 * @param {boolean} enabled - Whether the automatic path animation is enabled.
 * @param {number} [speed=2.0] - The speed of the animation in cells per second. Defaults to 2.0.
 * @returns {{ autoX: number, autoY: number, autoHeading: number }} The current animated position and heading of the vessel.
 * @remarks
 * The hook reads the planned path from the Redux store and animates the vessel along that path when enabled.
 * If an error cell exists in the navigation grid (indicating an unreachable objective), the vessel remains at its current position.
 * The animation loops continuously from the start of the path to the end, updating the position and heading based on elapsed time and speed.
 * The heading is calculated based on the direction of movement between consecutive waypoints, with 0 degrees representing north (–Y) and 90 degrees representing east (+X).
 * The hook uses requestAnimationFrame for smooth animation and cleans up the animation frame when the component unmounts or when the animation is disabled.
 * @example
 * const { autoX, autoY, autoHeading } = useAutoPathAnimation(true, 2.5);
 * // autoX, autoY, and autoHeading can be used to position and orient the vessel in the visualizer.
 */
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

            // Marked as a transition so this per-frame update doesn't compete on equal
            // priority with more urgent work (e.g. a pending route navigation) — React can
            // interrupt/deprioritize it, and only the latest position matters visually anyway.
            startTransition(() => {
                setAnimState({
                    x: from.x + dx * t,
                    y: from.y + dy * t,
                    heading,
                });
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
