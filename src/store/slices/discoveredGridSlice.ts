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

/**
 * @interface DiscoveredGridState
 * @description Represents the state of the discovered grid in the Redux store.
 * @property {DiscoveryCellState[]} cells - Flat row-major array of cell states. Index = row * gridWidth + col. Length = gridWidth * gridHeight = 400.
 * @property {number[]} visibleIndices - Flat indices of cells currently in state 1 (VISIBLE). Used to keep demote O(N_visible) not O(400).
 * @property {boolean[]} obstacleOverrides - Flat row-major array of cells the local sensor scan has confirmed as occupied obstacles. Permanent.
 * @property {number} gridWidth - Width of the global grid in cells.
 * @property {number} gridHeight - Height of the global grid in cells.
 * @property {number} revealRadius - Reveal radius in global cell units (Chebyshev / square metric). Default 2.
 * @remarks
 * The discovered grid state is used to manage the visibility and discovery of cells in the global grid. It tracks which cells have been seen by the vessel, which are currently visible, and which have been confirmed as obstacles. The reveal radius determines how many cells around the vessel's position are revealed when it moves.
 */
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

/**
 * @constant W
 * @description Width of the global grid in cells. Equal to GLOBAL_GRID_SIZE.
 */
const W = GLOBAL_GRID_SIZE;

/**
 * @constant H
 * @description Height of the global grid in cells. Equal to GLOBAL_GRID_SIZE.
 */
const H = GLOBAL_GRID_SIZE;

/**
 * @constant initialState
 * @description Initial state of the discovered grid slice.
 * @type {DiscoveredGridState}
 * @remarks
 * The initial state sets all cells to UNKNOWN (0), with no visible indices and no obstacle overrides. The grid width and height are set to the global grid size, and the reveal radius is initialized to 1.
 * This state is used when the application first loads or when the discovery state is reset.
 * @see {@link DiscoveredGridState} for the structure of the state.
 */
const initialState: DiscoveredGridState = {
    cells: Array<DiscoveryCellState>(W * H).fill(0),
    visibleIndices: [],
    obstacleOverrides: Array<boolean>(W * H).fill(false),
    gridWidth: W,
    gridHeight: H,
    revealRadius: 1,
};

/**
 * @constant discoveredGridSlice
 * @description Redux slice for managing the discovered grid state.
 * @see {@link DiscoveredGridState} for the structure of the state.
 * @remarks
 * This slice provides actions and reducers to manage the discovery state of the global grid. 
 * It includes actions to reveal cells around a position, promote obstacles, reveal all known cells, reset discovery state, 
 * and set the reveal radius. The slice also includes selectors to access the discovered cells, grid width, obstacle overrides,
 * and reveal radius from the Redux store.
 */
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
 * @function selectDiscoveryLookup
 * @description Creates a stable lookup function to access the discovery state of individual cells.
 * @param {DiscoveryCellState[]} cells - Flat row-major array of cell states from the Redux store.
 * @param {number} W - Width of the global grid in cells.
 * @returns {(col: number, row: number) => DiscoveryCellState} A function that takes column and row indices and returns the corresponding cell state.
 * @remarks
 * This selector uses `createSelector` to memoize the lookup function, ensuring that it only recomputes when the `cells` or `gridWidth` change. The returned function allows components to easily query the discovery state of specific cells in the global grid.
 * @example
 * const lookup = selectDiscoveryLookup(state.discoveredGrid.cells, state.discoveredGrid.gridWidth);
 * const cellState = lookup(5, 10); // Get the discovery state of the cell at column 5, row 10.
 */
export const selectDiscoveryLookup = createSelector(
    [selectDiscoveredCells, selectDiscoveredGridWidth],
    (cells, W) =>
        (col: number, row: number): DiscoveryCellState =>
            (cells[row * W + col] ?? 0) as DiscoveryCellState,
);

export default discoveredGridSlice.reducer;
