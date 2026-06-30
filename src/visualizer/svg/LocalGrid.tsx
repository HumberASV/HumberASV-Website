/**
 * @file LocalGrid.tsx
 * @description Renders the local coordinate frame on the isometric map.
 *
 * Layout (all dimensions derived from GLOBAL_CELL_SIZE):
 *   • Floor  (XY plane) — wireframe grid 3 global cells across, with obstacle cells
 *     highlighted in error-red when the local cell overlaps a global occupied cell.
 *   • Front wall (XZ plane) — vertical grid along the −Y edge of the local frame.
 *   • Side wall  (YZ plane) — vertical grid along the −X edge of the local frame.
 *
 * Coordinate convention: x = column (left→right), y = row (top→down), z = up.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { useAppSelector } from '../../store';
import type { RootState } from '../../store';
import { IsometricAxes } from './IsometricAxes';
import {
    type Cell,
    GLOBAL_CELL_SIZE,
    GLOBAL_GRID_SIZE,
    LOCAL_GRID_WORLD_SIZE,
    LOCAL_CELL_SIZE,
    LOCAL_WALL_HEIGHT,
    LOCAL_OBSTACLE_HEIGHT,
    CellTypes,
} from '../../utils/types';

export interface LocalGridProps {
    globalX: number;
    globalY: number;
    localRotation: number;
    showLocalAxes: boolean;
    showLocalGrid: boolean;
    toScreen: (x: number, y: number, z: number) => Cell;
    pointScreen: Cell;
    globalOriginScreen: Cell;
}

/**
 * Renders the local coordinate frame (floor grid, Z-axis walls, terrain blocks,
 * vessel shadow, local origin marker, and global origin pole) centred on the vessel.
 */
export const LocalGrid: React.FC<LocalGridProps> = ({
    globalX,
    globalY,
    localRotation,
    showLocalAxes,
    showLocalGrid,
    toScreen,
    pointScreen,
    globalOriginScreen,
}) => {
    const theme = useTheme();
    const fineGrid = useAppSelector((state: RootState) => state.simulation.fineGrid);

    // Vessel world-space center
    const cx = globalX * GLOBAL_CELL_SIZE;
    const cy = globalY * GLOBAL_CELL_SIZE;

    // Grid geometry (all derived from global constants)
    const half   = LOCAL_GRID_WORLD_SIZE / 2;   // 60 px — half-extent from center
    const step   = LOCAL_CELL_SIZE;              // 8 px  — cell size
    const nCells = LOCAL_GRID_WORLD_SIZE / step; // 15    — cells per axis
    const nZStep = LOCAL_WALL_HEIGHT / step;     // 5     — Z levels

    // Convert compass heading to radians (clockwise from north).
    // Convention: local +X = right (east when heading 0), local +Y = forward (–Y world when heading 0).
    // With this formula: rotate(1,0) = (cos h, sin h) and rotate(0,1) = (sin h, –cos h).
    const h = (localRotation * Math.PI) / 180;

    /** Rotate a local-frame offset to world space and add the vessel center. */
    const rotate = (lx: number, ly: number) => ({
        x: cx + lx * Math.cos(h) + ly * Math.sin(h),
        y: cy + lx * Math.sin(h) - ly * Math.cos(h),
    });

    // Pixel offset that maps world coordinates to fine grid indices
    const fineOffset = (GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE; // = 400px

    /** Fine grid cell at the given world-space point (null if out of bounds). */
    const getFineCell = (wx: number, wy: number) => {
        const col = Math.floor((wx + fineOffset) / LOCAL_CELL_SIZE);
        const row = Math.floor((wy + fineOffset) / LOCAL_CELL_SIZE);
        return fineGrid[row]?.[col] ?? null;
    };

    /** Returns top/left/right face fill colors for a terrain block at normalised height z ∈ [0, 1]. */
    const getTopoColors = (z: number) => {
        const base = z >= 0.75 ? theme.palette.error.main
                   : z >= 0.5  ? theme.palette.warning.main
                   : z >= 0.25 ? theme.palette.success.main
                   :              theme.palette.info.main;
        return {
            top:   alpha(base, 0.65),
            left:  alpha(base, 0.45),
            right: alpha(base, 0.35),
        };
    };

    const TOPO_MAX_H = LOCAL_OBSTACLE_HEIGHT * 4; // 16px — max terrain extrusion

    // ── Floor: wireframe lines ───────────────────────────────────────────────
    const floorLines: React.ReactNode[] = [];
    // Lines running in the X direction (constant local-Y)
    for (let j = 0; j <= nCells; j++) {
        const ly = -half + j * step;
        const p1 = rotate(-half, ly);
        const p2 = rotate( half, ly);
        const s1 = toScreen(p1.x, p1.y, 0);
        const s2 = toScreen(p2.x, p2.y, 0);
        floorLines.push(
            <line key={`fx-${j}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
                stroke={theme.palette.info.light} strokeWidth={1} opacity={0.8} />
        );
    }
    // Lines running in the Y direction (constant local-X)
    for (let i = 0; i <= nCells; i++) {
        const lx = -half + i * step;
        const p1 = rotate(lx, -half);
        const p2 = rotate(lx,  half);
        const s1 = toScreen(p1.x, p1.y, 0);
        const s2 = toScreen(p2.x, p2.y, 0);
        floorLines.push(
            <line key={`fy-${i}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
                stroke={theme.palette.info.light} strokeWidth={1} opacity={0.8} />
        );
    }

    // ── Topographic cell blocks ──────────────────────────────────────────────
    // Every local cell is rendered as a 3-face isometric block whose height
    // is proportional to the normalised Gaussian value stored in fineGrid[z].
    // Color bands: info (low) → success → warning → error (peak/obstacle).
    // Render order per cell: left face → right face → top.
    const topoCells: React.ReactNode[] = [];
    for (let i = 0; i < nCells; i++) {
        for (let j = 0; j < nCells; j++) {
            // Bottom-left corner of this cell in local (vessel-relative) space
            const lx = -half + i * step;
            const ly = -half + j * step;

            // Sample the occupancy map at the cell's centre (rotated into world space)
            // so the correct fineGrid bucket is queried regardless of vessel heading.
            const center = rotate(lx + step / 2, ly + step / 2);
            const cell = getFineCell(center.x, center.y);

            // Skip cells that aren't marked as obstacles — nothing to draw
            if (cell?.type !== CellTypes.occupied) continue;

            const z = cell?.z ?? 0;
            // H is the rendered block height in SVG units. LOCAL_OBSTACLE_HEIGHT is the
            // minimum so even z=0 obstacles are visible; z scales up toward TOPO_MAX_H.
            const H = Math.max(LOCAL_OBSTACLE_HEIGHT, z * TOPO_MAX_H);

            // Rotate the four ground-plane corners of this cell into world space
            // so they align with the vessel's current heading on screen.
            const tl = rotate(lx,        ly       );  // top-left
            const tr = rotate(lx + step, ly       );  // top-right
            const br = rotate(lx + step, ly + step);  // bottom-right
            const bl = rotate(lx,        ly + step);  // bottom-left

            // Project each corner at ground level (z=0) and at full block height (z=H)
            // into 2-D screen coordinates using the isometric projection.
            const [_tl0, tr0, br0, bl0] = [tl, tr, br, bl].map(p => toScreen(p.x, p.y, 0));
            const [tlH, trH, brH, blH] = [tl, tr, br, bl].map(p => toScreen(p.x, p.y, H));

            // Helper: converts an array of {x,y} screen points to an SVG points string
            const pts = (arr: Cell[]) => arr.map(p => `${p.x},${p.y}`).join(' ');

            // Color band driven by normalised height z ∈ [0,1]: info → success → warning → error
            const colors = getTopoColors(z);

            // Draw the three visible isometric faces: left side, right side, then top.
            // Left/right are rendered first (painter's algorithm) so the top face
            // appears to sit above them without z-index trickery.
            topoCells.push(
                <g key={`topo-${i}-${j}`}>
                    {/* Left face: bl–br at height H down to ground */}
                    <polygon points={pts([blH, brH, br0, bl0])} fill={colors.left}  strokeWidth={0} />
                    {/* Right face: tr–br at height H down to ground */}
                    <polygon points={pts([trH, brH, br0, tr0])} fill={colors.right} strokeWidth={0} />
                    {/* Top face: all four corners at full height H */}
                    <polygon points={pts([tlH, trH, brH, blH])} fill={colors.top}
                        stroke={alpha(colors.top, 0.4)} strokeWidth={0.3} />
                </g>
            );
        }
    }

    // ── Center vertical grids (Z-axis indicator cross at local origin) ──────
    // Two planes: XZ at y=0 and YZ at x=0, meeting at the vessel center.
    const centerGrids: React.ReactNode[] = [];
    // XZ plane at y=0 — horizontal lines (constant Z) + vertical lines (constant X)
    for (let zi = 0; zi <= nZStep; zi++) {
        const z  = zi * step;
        const p1 = rotate(-half, 0);
        const p2 = rotate( half, 0);
        const s1 = toScreen(p1.x, p1.y, z);
        const s2 = toScreen(p2.x, p2.y, z);
        centerGrids.push(
            <line key={`czxz-h-${zi}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
                stroke={theme.palette.warning.main} strokeWidth={1} opacity={0.65} />
        );
    }
    for (let i = 0; i <= nCells; i++) {
        const lx = -half + i * step;
        const p  = rotate(lx, 0);
        const sB = toScreen(p.x, p.y, 0);
        const sT = toScreen(p.x, p.y, LOCAL_WALL_HEIGHT);
        centerGrids.push(
            <line key={`czxz-v-${i}`} x1={sB.x} y1={sB.y} x2={sT.x} y2={sT.y}
                stroke={theme.palette.warning.main} strokeWidth={1} opacity={0.65} />
        );
    }
    // YZ plane at x=0 — horizontal lines (constant Z) + vertical lines (constant Y)
    for (let zi = 0; zi <= nZStep; zi++) {
        const z  = zi * step;
        const p1 = rotate(0, -half);
        const p2 = rotate(0,  half);
        const s1 = toScreen(p1.x, p1.y, z);
        const s2 = toScreen(p2.x, p2.y, z);
        centerGrids.push(
            <line key={`czyz-h-${zi}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
                stroke={theme.palette.warning.light} strokeWidth={1} opacity={0.55} />
        );
    }
    for (let j = 0; j <= nCells; j++) {
        const ly = -half + j * step;
        const p  = rotate(0, ly);
        const sB = toScreen(p.x, p.y, 0);
        const sT = toScreen(p.x, p.y, LOCAL_WALL_HEIGHT);
        centerGrids.push(
            <line key={`czyz-v-${j}`} x1={sB.x} y1={sB.y} x2={sT.x} y2={sT.y}
                stroke={theme.palette.warning.light} strokeWidth={1} opacity={0.55} />
        );
    }

    return (
        <g>
            {showLocalGrid && (
                <>
                    {/* Center Z-axis cross (XZ and YZ planes at local origin) */}
                    <g>{centerGrids}</g>

                    {/* Floor wireframe */}
                    <g>{floorLines}</g>

                    {/* Topographic terrain blocks */}
                    <g>{topoCells}</g>
                </>
            )}

            {/* Local axes */}
            {showLocalAxes && (
                <IsometricAxes
                    origin={{ x: cx, y: cy, z: 0 }}
                    length={50}
                    toScreen={toScreen}
                    rotation={localRotation}
                />
            )}

            {/* Vessel markers */}
            <ellipse
                cx={pointScreen.x} cy={pointScreen.y + 5}
                rx="12" ry="6"
                fill={theme.palette.common.black} opacity="0.3"
            />
            {/* Global-origin marker elevated to the top of the Z walls */}
            {(() => {
                const top = toScreen(0, 0, LOCAL_WALL_HEIGHT);
                return (
                    <g>
                        {/* Thin pole from floor to top */}
                        <line
                            x1={globalOriginScreen.x} y1={globalOriginScreen.y}
                            x2={top.x} y2={top.y}
                            stroke={theme.palette.info.light}
                            strokeWidth={1}
                            opacity={0.5}
                            strokeDasharray="2 2"
                        />
                        {/* Marker at the top */}
                        <circle
                            cx={top.x} cy={top.y}
                            r="6"
                            fill={theme.palette.common.white}
                            stroke={theme.palette.info.light}
                            strokeWidth="2"
                            filter="url(#glow)"
                        />
                    </g>
                );
            })()}
            <circle
                cx={pointScreen.x} cy={pointScreen.y}
                r="8"
                fill={theme.palette.map.localOrigin}
                stroke={alpha(theme.palette.map.localOrigin, 0.4)}
                strokeWidth="2"
                filter="url(#glow)"
            />
        </g>
    );
};
