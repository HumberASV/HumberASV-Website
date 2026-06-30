/**
 * @file fogOfWarSlice.ts
 * @description Redux slice managing fog-of-war reveal state for the isometric global grid.
 *
 * Three cell states:
 *   0 UNREVEALED — never visited; rendered as opaque fog tile
 *   1 VISIBLE    — within the vessel's reveal radius; rendered at full color (no fog tile)
 *   2 VISITED    — previously visible, now outside radius; rendered as dim/translucent tile
 *
 * In proximity mode (default / sim): the vessel's integer cell position drives reveals.
 * In sensor mode (basestation connected): occupancy grid updates drive reveals.
 *
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { GLOBAL_GRID_SIZE, GLOBAL_CELL_SIZE, LOCAL_CELL_SIZE } from '../../utils/types';

export type FogCellState = 0 | 1 | 2;

export interface FogOfWarState {
    /** Flat row-major array: index = row * gridWidth + col. Length = gridWidth * gridHeight. */
    cells: FogCellState[];
    /** Flat indices of cells currently in state 1 (VISIBLE). Used to make demote O(225) not O(10,000). */
    visibleIndices: number[];
    gridWidth: number;
    gridHeight: number;
    /** Reveal radius in local-cell units (Chebyshev / square metric). */
    revealRadius: number;
    /** When true, proximity reveal is skipped; occupancy grid sensor data drives reveals. */
    sensorDriven: boolean;
}

// Fog grid matches LOCAL_CELL_SIZE resolution across the entire global world.
// GLOBAL_GRID_SIZE * GLOBAL_CELL_SIZE / LOCAL_CELL_SIZE = 20 * 40 / 8 = 100
const GRID_W = (GLOBAL_GRID_SIZE * GLOBAL_CELL_SIZE) / LOCAL_CELL_SIZE;
const GRID_H = (GLOBAL_GRID_SIZE * GLOBAL_CELL_SIZE) / LOCAL_CELL_SIZE;

const initialState: FogOfWarState = {
    cells: Array<FogCellState>(GRID_W * GRID_H).fill(0),
    visibleIndices: [],
    gridWidth: GRID_W,
    gridHeight: GRID_H,
    // Chebyshev radius = LOCAL_GRID_WORLD_SIZE / (2 * LOCAL_CELL_SIZE) = 120 / 16 = 7.5 → 7
    // A 15×15 patch = exactly the LocalGrid's visible footprint.
    revealRadius: 7,
    sensorDriven: false,
};

export const fogOfWarSlice = createSlice({
    name: 'fogOfWar',
    initialState,
    reducers: {
        /**
         * Reveal cells within `revealRadius` of the given grid position.
         * Previously VISIBLE cells outside the new radius are demoted to VISITED.
         * No-op when sensorDriven is true.
         */
        revealAroundPosition(state, action: PayloadAction<{ col: number; row: number }>) {
            if (state.sensorDriven) return;
            const { col, row } = action.payload;
            const r  = state.revealRadius;
            const W  = state.gridWidth;
            const H  = state.gridHeight;

            // Demote only the tracked VISIBLE cells — O(225) not O(10,000).
            for (const idx of state.visibleIndices) {
                if (state.cells[idx] === 1) state.cells[idx] = 2;
            }

            // Paint the new VISIBLE square and record indices for next demote.
            const newVisible: number[] = [];
            for (let dr = -r; dr <= r; dr++) {
                for (let dc = -r; dc <= r; dc++) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr < 0 || nr >= H || nc < 0 || nc >= W) continue;
                    const idx = nr * W + nc;
                    state.cells[idx] = 1;
                    newVisible.push(idx);
                }
            }
            state.visibleIndices = newVisible;
        },

        /**
         * Reveal cells listed by sensor data (occupancy grid non-empty cells).
         * UNREVEALED cells are upgraded to VISIBLE; VISITED cells are left as-is.
         */
        revealFromOccupancyGrid(
            state,
            action: PayloadAction<{ cols: number[]; rows: number[] }>,
        ) {
            const { cols, rows } = action.payload;
            const W = state.gridWidth;
            for (let i = 0; i < cols.length; i++) {
                const idx = rows[i] * W + cols[i];
                if (idx >= 0 && idx < state.cells.length && state.cells[idx] === 0) {
                    state.cells[idx] = 1;
                }
            }
        },

        /** Reset all cells to UNREVEALED (0). Call on map regeneration. */
        resetFog(state) {
            state.cells = Array<FogCellState>(state.gridWidth * state.gridHeight).fill(0);
            state.visibleIndices = [];
        },

        setRevealRadius(state, action: PayloadAction<number>) {
            state.revealRadius = Math.max(1, Math.min(action.payload, 10));
        },

        setSensorDriven(state, action: PayloadAction<boolean>) {
            state.sensorDriven = action.payload;
        },
    },
});

export const {
    revealAroundPosition,
    revealFromOccupancyGrid,
    resetFog,
    setRevealRadius,
    setSensorDriven,
} = fogOfWarSlice.actions;

// Selectors — use a structural type to avoid circular import with store.ts
type WithFogOfWar = { fogOfWar: FogOfWarState };
export const selectFogCells       = (state: WithFogOfWar) => state.fogOfWar.cells;
export const selectFogGridWidth   = (state: WithFogOfWar) => state.fogOfWar.gridWidth;
export const selectRevealRadius   = (state: WithFogOfWar) => state.fogOfWar.revealRadius;
export const selectIsSensorDriven = (state: WithFogOfWar) => state.fogOfWar.sensorDriven;

/**
 * Returns a stable lookup function `(col, row) => FogCellState` for use in
 * components that iterate the grid. Recomputes only when cells or gridWidth change.
 */
export const selectFogLookup = createSelector(
    [selectFogCells, selectFogGridWidth],
    (cells, W) =>
        (col: number, row: number): FogCellState =>
            (cells[row * W + col] ?? 0) as FogCellState,
);

export default fogOfWarSlice.reducer;
