/**
 * @file discoveredGridSlice.ts
 * @description Redux slice managing AoE-style discovery state for the global grid.
 *
 * Three cell states at GLOBAL_CELL_SIZE (20×20) precision:
 *   0 UNKNOWN  — never seen; global grid cell hidden behind full fog
 *   1 VISIBLE  — vessel currently nearby; obstacle shown at full brightness, no fog
 *   2 VISITED  — vessel was here; obstacle shown dimly, fog haze applied
 *
 * Also tracks obstacleOverrides: cells the fineGrid (local sensor scan) has confirmed
 * as occupied, independent of what the basestation occupancyGrid knows.
 *
 * @author Carson Fujita
 * @license MIT
 */
import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import { GLOBAL_GRID_SIZE } from '../../utils/types';

export type DiscoveryCellState = 0 | 1 | 2;

export interface DiscoveredGridState {
    /** Flat row-major array: index = row * gridWidth + col. Length = gridWidth * gridHeight = 400. */
    cells: DiscoveryCellState[];
    /** Flat indices of cells currently in state 1 (VISIBLE). Used to keep demote O(N_visible) not O(400). */
    visibleIndices: number[];
    /** Flat row-major array: cells the local sensor scan has confirmed as occupied obstacles. Permanent. */
    obstacleOverrides: boolean[];
    gridWidth: number;
    gridHeight: number;
    /** Reveal radius in global cell units (Chebyshev / square metric). Default 2. */
    revealRadius: number;
}

const W = GLOBAL_GRID_SIZE;
const H = GLOBAL_GRID_SIZE;

const initialState: DiscoveredGridState = {
    cells: Array<DiscoveryCellState>(W * H).fill(0),
    visibleIndices: [],
    obstacleOverrides: Array<boolean>(W * H).fill(false),
    gridWidth: W,
    gridHeight: H,
    revealRadius: 1,
};

export const discoveredGridSlice = createSlice({
    name: 'discoveredGrid',
    initialState,
    reducers: {
        /**
         * Reveal global cells within `revealRadius` of the given global cell position.
         * Previously VISIBLE cells outside the new radius are demoted to VISITED.
         */
        revealGlobalAroundPosition(state, action: PayloadAction<{ col: number; row: number }>) {
            const { col, row } = action.payload;
            const r = state.revealRadius;
            const W = state.gridWidth;
            const H = state.gridHeight;

            // Demote only tracked VISIBLE cells — O(N_visible) not O(400).
            for (const idx of state.visibleIndices) {
                if (state.cells[idx] === 1) state.cells[idx] = 2;
            }

            // Promote cells in reveal square to VISIBLE and track for next demote.
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
         * Mark global cells as having a confirmed obstacle from the fineGrid sensor scan.
         * Permanent — survives until resetDiscovery is called.
         */
        bulkPromoteObstacles(state, action: PayloadAction<{ cols: number[]; rows: number[] }>) {
            const { cols, rows } = action.payload;
            const W = state.gridWidth;
            for (let i = 0; i < cols.length; i++) {
                const idx = rows[i] * W + cols[i];
                if (idx >= 0 && idx < state.obstacleOverrides.length) {
                    state.obstacleOverrides[idx] = true;
                }
            }
        },

        /**
         * Reveal all cells listed by basestation occupancy data (live mode).
         * UNKNOWN cells are upgraded to VISIBLE; VISITED cells are left as-is.
         */
        revealAllKnownCells(state, action: PayloadAction<{ cols: number[]; rows: number[] }>) {
            const { cols, rows } = action.payload;
            const W = state.gridWidth;
            for (let i = 0; i < cols.length; i++) {
                const idx = rows[i] * W + cols[i];
                if (idx >= 0 && idx < state.cells.length && state.cells[idx] === 0) {
                    state.cells[idx] = 1;
                }
            }
        },

        /** Reset all discovery state. Call on map regeneration. */
        resetDiscovery(state) {
            state.cells = Array<DiscoveryCellState>(state.gridWidth * state.gridHeight).fill(0);
            state.visibleIndices = [];
            state.obstacleOverrides = Array<boolean>(state.gridWidth * state.gridHeight).fill(false);
        },

        setRevealRadius(state, action: PayloadAction<number>) {
            state.revealRadius = Math.max(1, Math.min(action.payload, 5));
        },
    },
});

export const {
    revealGlobalAroundPosition,
    bulkPromoteObstacles,
    revealAllKnownCells,
    resetDiscovery,
    setRevealRadius,
} = discoveredGridSlice.actions;

// Selectors — use a structural type to avoid circular import with store.ts
type WithDiscoveredGrid = { discoveredGrid: DiscoveredGridState };
export const selectDiscoveredCells       = (state: WithDiscoveredGrid) => state.discoveredGrid.cells;
export const selectDiscoveredGridWidth   = (state: WithDiscoveredGrid) => state.discoveredGrid.gridWidth;
export const selectObstacleOverrides     = (state: WithDiscoveredGrid) => state.discoveredGrid.obstacleOverrides;
export const selectDiscoveryRevealRadius = (state: WithDiscoveredGrid) => state.discoveredGrid.revealRadius;

/**
 * Returns a stable lookup function `(col, row) => DiscoveryCellState`.
 * Recomputes only when cells or gridWidth change.
 */
export const selectDiscoveryLookup = createSelector(
    [selectDiscoveredCells, selectDiscoveredGridWidth],
    (cells, W) =>
        (col: number, row: number): DiscoveryCellState =>
            (cells[row * W + col] ?? 0) as DiscoveryCellState,
);

export default discoveredGridSlice.reducer;
