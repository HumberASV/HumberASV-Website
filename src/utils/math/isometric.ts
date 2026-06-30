/**
 * @file utils/math/isometric.ts
 * @description Isometric projection math: standard 2:1 dimetric projection (X right-down, Y left-down, Z up).
 */
import type { Cell } from '../types/mapTypes';

const ISO_ANGLE = Math.PI / 6;
const COS_30 = Math.cos(ISO_ANGLE);
const SIN_30 = Math.sin(ISO_ANGLE);

/**
 * Standard isometric projection (X right-down, Y left-down, Z up).
 */
export const isoTransform = (x: number, y: number, z = 0) => ({
    x: (x - y) * COS_30,
    y: (x + y) * SIN_30 - z,
});

/**
 * Creates a projection function bound to a specific canvas origin and scale.
 */
export const getToScreen = (centerX: number, centerY: number, scale = 1) =>
    (x: number, y: number, z: number): Cell => {
        const iso = isoTransform(x * scale, y * scale, z * scale);
        return { x: centerX + iso.x, y: centerY + iso.y };
    };

/**
 * Returns a cardinal direction label for a heading in degrees (0–360).
 */
export const getCardinalLabel = (heading: number): string => {
    const directions = [
        { min: 337.5, max: 360, label: 'N' },
        { min: 0,     max: 22.5,  label: 'N' },
        { min: 22.5,  max: 67.5,  label: 'NE' },
        { min: 67.5,  max: 112.5, label: 'E' },
        { min: 112.5, max: 157.5, label: 'SE' },
        { min: 157.5, max: 202.5, label: 'S' },
        { min: 202.5, max: 247.5, label: 'SW' },
        { min: 247.5, max: 292.5, label: 'W' },
        { min: 292.5, max: 337.5, label: 'NW' },
    ];
    for (const dir of directions) {
        if (heading >= dir.min && heading < dir.max) return dir.label;
    }
    return 'N';
};
