/**
 * Represents a point in 3D coordinate space.
 */
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

/**
 * Represents a point in 2D coordinate space (screen space).
 */
export interface Point2D {
    x: number;
    y: number;
}

/**
 * Isometric projection constants
 */
const ISO_ANGLE = Math.PI / 6;
const COS_30 = Math.cos(ISO_ANGLE);
const SIN_30 = Math.sin(ISO_ANGLE);

/**
 * Standard isometric projection (X right-down, Y left-down, Z up)
 */
export const isoTransform = (x: number, y: number, z = 0) => {
    return {
        x: (x - y) * COS_30,
        y: (x + y) * SIN_30 - z
    };
};

/**
 * Creates a projection function for a specific canvas origin and scale
 */
export const getToScreen = (centerX: number, centerY: number, scale: number = 1) => {
    return (x: number, y: number, z: number): Point2D => {
        const iso = isoTransform(x * scale, y * scale, z * scale);
        return { 
            x: centerX + iso.x, 
            y: centerY + iso.y 
        };
    };
};

/**
 * Returns a string representation of a cardinal direction based on a heading.
 * @param heading - Heading in degrees (0-360).
 */
export const getCardinalLabel = (heading: number): string => {
    const directions = [
        { min: 337.5, max: 360, label: 'N' },
        { min: 0, max: 22.5, label: 'N' },
        { min: 22.5, max: 67.5, label: 'NE' },
        { min: 67.5, max: 112.5, label: 'E' },
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

// Configuration Constants

/** Number of cells in the global grid. */
export const GLOBAL_GRID_SIZE = 10;
/** Size of each global grid cell in pixels. */
export const GLOBAL_CELL_SIZE = 40;
/** Number of cells in the local high-res grid. */
export const LOCAL_GRID_SIZE = 10;
/** Size of each local grid cell in pixels. */
export const LOCAL_CELL_SIZE = 8;
/** Height (Z-axis) of the local coordinate frame. */
export const LOCAL_HEIGHT = 3;

/** Horizontal offset to center the SVG origin. */
export const CENTER_X = 500;
/** Vertical offset to center the SVG origin. */
export const CENTER_Y = 500;

/** Default movement velocity for the local frame in units per second. */
export const DEFAULT_VELOCITY = 0.5;