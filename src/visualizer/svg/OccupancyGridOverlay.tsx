/**
 * @file OccupancyGridOverlay.tsx
 * @description Reads occupancy or navigation grid data from the Redux store and renders
 * each non-empty cell as an isometric GridCellIcon centered on the Map canvas.
 *
 * Centering: cells use 0-based (col, row) indices. We shift by half the grid's
 * pixel span so that the full grid is centered at world origin (0,0).
 */
import React from 'react';
import { useAppSelector } from '../../store';
import type { RootState } from '../../store';
import { CellTypes, GLOBAL_CELL_SIZE, type Cell } from '../../utils/types';
import { GridCellIcon } from './GridCellIcon';
import { ObjectiveMarker } from '../entity/ObjectiveMarker';

export interface OccupancyGridOverlayProps {
    /** Isometric projection function from the parent Map. */
    toScreen: (x: number, y: number, z: number) => Cell;
    /** Which store grid to visualize. Defaults to 'occupancy'. */
    gridType?: 'occupancy' | 'navigation';
}

/** Reads the occupancy or navigation grid from Redux and renders each non-empty cell as an isometric tile. */
export const OccupancyGridOverlay: React.FC<OccupancyGridOverlayProps> = ({
    toScreen,
    gridType = 'occupancy',
}) => {
    const grid = useAppSelector((state: RootState) =>
        gridType === 'navigation'
            ? state.telemetry.map.navigationGrid
            : state.telemetry.map.occupancyGrid
    );

    const gridRows = grid.length;
    const gridCols = grid[0]?.length ?? 0;

    // Half-span offsets to center the grid at world origin.
    const offsetX = (gridCols / 2) * GLOBAL_CELL_SIZE;
    const offsetY = (gridRows / 2) * GLOBAL_CELL_SIZE;

    return (
        <g>
            {grid.map((row) =>
                row
                    .filter((cell) => cell.type !== undefined && cell.type !== CellTypes.empty)
                    .map((cell) => (
                        <GridCellIcon
                            key={`${cell.x}-${cell.y}`}
                            cx={cell.x * GLOBAL_CELL_SIZE - offsetX}
                            cy={cell.y * GLOBAL_CELL_SIZE - offsetY}
                            toScreen={toScreen}
                            cellType={cell.type}
                        />
                    ))
            )}
            {gridType === 'navigation' && grid.flatMap((row) =>
                row
                    .filter((cell) => cell.type === CellTypes.objective)
                    .map((cell) => (
                        <ObjectiveMarker
                            key={`obj-${cell.x}-${cell.y}`}
                            cx={cell.x * GLOBAL_CELL_SIZE - offsetX}
                            cy={cell.y * GLOBAL_CELL_SIZE - offsetY}
                            toScreen={toScreen}
                        />
                    ))
            )}
        </g>
    );
};
