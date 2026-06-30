/**
 * @file GlobalGridOverlay.tsx
 * @description Unified global grid overlay combining obstacle rendering, navigation path
 * rendering, and fog-of-war at GLOBAL_CELL_SIZE (20×20) precision. Replaces the separate
 * OccupancyGridOverlay (occupancy + navigation modes) and FogOfWarOverlay components.
 *
 * Discovery states per global cell:
 *   0 UNKNOWN  — full fog; everything hidden even if occupancyGrid/navigationGrid knows about it
 *   1 VISIBLE  — vessel nearby; shown at full brightness, no fog
 *   2 VISITED  — vessel was here; shown dimly, fog haze applied on top
 *
 * Render layer order (painter's algorithm):
 *   visited obstacles  → visited nav cells → fog haze → visible obstacles → visible nav cells → full fog
 *
 * Obstacle geometry is merged into SVG <path> strings. Navigation cells use GridCellIcon
 * (individual polygons) since each cell type has a distinct color.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { useAppSelector } from '../../store';
import type { RootState } from '../../store';
import {
    selectDiscoveredCells,
    selectObstacleOverrides,
    type DiscoveryCellState,
} from '../../store/slices/discoveredGridSlice';
import {
    CellTypes,
    GLOBAL_GRID_SIZE,
    GLOBAL_CELL_SIZE,
    type Cell,
} from '../../utils/types';
import { GridCellIcon } from './GridCellIcon';
import { ObjectiveMarker } from '../entity/ObjectiveMarker';

export interface GlobalGridOverlayProps {
    toScreen: (x: number, y: number, z: number) => Cell;
}

// World-space offset to center the 20×20 grid at origin.
const HALF_SPAN = (GLOBAL_GRID_SIZE / 2) * GLOBAL_CELL_SIZE; // 400 px

interface NavCellEntry {
    cx: number;
    cy: number;
    type: number;
    key: string;
    discoveryState: DiscoveryCellState;
}

export const GlobalGridOverlay: React.FC<GlobalGridOverlayProps> = React.memo(({ toScreen }) => {
    const theme = useTheme();

    const occupancyGrid   = useAppSelector((state: RootState) => state.telemetry.map.occupancyGrid);
    const navigationGrid  = useAppSelector((state: RootState) => state.telemetry.map.navigationGrid);
    const discoveredCells = useAppSelector(selectDiscoveredCells);
    const obstacleOverrides = useAppSelector(selectObstacleOverrides);
    const showFogOfWar    = useAppSelector((state: RootState) => state.visualization.showFogOfWar);

    // Build four SVG path strings (obstacles + fog) in a single 400-cell pass.
    const { visibleObstacleD, visitedObstacleD, visitedD, unrevealedD } = React.useMemo(() => {
        let visibleObs  = '';
        let visitedObs  = '';
        let visited     = '';
        let unrevealed  = '';

        for (let row = 0; row < GLOBAL_GRID_SIZE; row++) {
            for (let col = 0; col < GLOBAL_GRID_SIZE; col++) {
                const idx = row * GLOBAL_GRID_SIZE + col;
                const discoveryState = (discoveredCells[idx] ?? 0) as 0 | 1 | 2;
                const hasObstacle =
                    occupancyGrid[row]?.[col]?.type === CellTypes.occupied ||
                    obstacleOverrides[idx] === true;

                const wx = col * GLOBAL_CELL_SIZE - HALF_SPAN;
                const wy = row * GLOBAL_CELL_SIZE - HALF_SPAN;

                const tl = toScreen(wx,                    wy,                    0);
                const tr = toScreen(wx + GLOBAL_CELL_SIZE, wy,                    0);
                const br = toScreen(wx + GLOBAL_CELL_SIZE, wy + GLOBAL_CELL_SIZE, 0);
                const bl = toScreen(wx,                    wy + GLOBAL_CELL_SIZE, 0);
                const seg = `M${tl.x},${tl.y}L${tr.x},${tr.y}L${br.x},${br.y}L${bl.x},${bl.y}Z`;

                if (showFogOfWar) {
                    if (discoveryState === 0) {
                        unrevealed += seg;
                    } else if (discoveryState === 2) {
                        visited += seg;
                        if (hasObstacle) visitedObs += seg;
                    } else {
                        // VISIBLE (state === 1)
                        if (hasObstacle) visibleObs += seg;
                    }
                } else {
                    // Fog disabled — show all obstacles immediately regardless of discovery
                    if (hasObstacle) visibleObs += seg;
                }
            }
        }

        return {
            visibleObstacleD: visibleObs,
            visitedObstacleD: visitedObs,
            visitedD: visited,
            unrevealedD: unrevealed,
        };
    }, [occupancyGrid, discoveredCells, obstacleOverrides, showFogOfWar, toScreen]);

    // Collect navigation cells split by discovery state so they render in the correct fog layer.
    const { visitedNavCells, visibleNavCells } = React.useMemo(() => {
        const navRows = navigationGrid.length;
        const navCols = navigationGrid[0]?.length ?? 0;
        const offsetX = (navCols / 2) * GLOBAL_CELL_SIZE;
        const offsetY = (navRows / 2) * GLOBAL_CELL_SIZE;

        const visited: NavCellEntry[] = [];
        const visible: NavCellEntry[] = [];

        for (let ri = 0; ri < navRows; ri++) {
            for (let ci = 0; ci < navCols; ci++) {
                const cell = navigationGrid[ri][ci];
                if (!cell || cell.type === undefined || cell.type === CellTypes.empty) continue;

                const idx = ri * GLOBAL_GRID_SIZE + ci;
                const discoveryState = (discoveredCells[idx] ?? 0) as DiscoveryCellState;

                // When fog is disabled show everything; otherwise hide unknown cells.
                if (showFogOfWar && discoveryState === 0) continue;

                const entry: NavCellEntry = {
                    cx: cell.x * GLOBAL_CELL_SIZE - offsetX,
                    cy: cell.y * GLOBAL_CELL_SIZE - offsetY,
                    type: cell.type,
                    key: `${cell.x}-${cell.y}`,
                    discoveryState,
                };

                if (!showFogOfWar || discoveryState === 1) {
                    visible.push(entry);
                } else {
                    // discoveryState === 2 (VISITED) — render under fog haze
                    visited.push(entry);
                }
            }
        }

        return { visitedNavCells: visited, visibleNavCells: visible };
    }, [navigationGrid, discoveredCells, showFogOfWar]);

    return (
        <g data-layer="global-grid-overlay">
            {/* Obstacles in visited cells — dim; fog haze will overlay these */}
            {visitedObstacleD && (
                <path
                    d={visitedObstacleD}
                    fill={alpha(theme.palette.error.main, 0.25)}
                    stroke={alpha(theme.palette.error.light, 0.2)}
                    strokeWidth={0.5}
                />
            )}

            {/* Navigation cells in visited state — rendered under fog haze */}
            {visitedNavCells.map((cell) => (
                <GridCellIcon
                    key={cell.key}
                    cx={cell.cx}
                    cy={cell.cy}
                    toScreen={toScreen}
                    cellType={cell.type as Parameters<typeof GridCellIcon>[0]['cellType']}
                    opacity={0.35}
                />
            ))}

            {/* Visited fog haze — sits on top of dim obstacles and visited nav cells */}
            {showFogOfWar && visitedD && (
                <path d={visitedD} fill={alpha(theme.palette.scene.skyDark, 0.55)} />
            )}

            {/* Obstacles in visible cells — full brightness, above fog haze */}
            {visibleObstacleD && (
                <path
                    d={visibleObstacleD}
                    fill={alpha(theme.palette.error.main, 0.6)}
                    stroke={theme.palette.error.light}
                    strokeWidth={0.5}
                />
            )}

            {/* Navigation cells in visible state (and fog-off cells) — above fog haze */}
            {visibleNavCells.map((cell) => (
                <React.Fragment key={cell.key}>
                    <GridCellIcon
                        cx={cell.cx}
                        cy={cell.cy}
                        toScreen={toScreen}
                        cellType={cell.type as Parameters<typeof GridCellIcon>[0]['cellType']}
                    />
                    {cell.type === CellTypes.objective && (
                        <ObjectiveMarker cx={cell.cx} cy={cell.cy} toScreen={toScreen} />
                    )}
                </React.Fragment>
            ))}

            {/* Full fog — unrevealed cells; covers everything unknown */}
            {showFogOfWar && unrevealedD && (
                <path d={unrevealedD} fill={alpha(theme.palette.scene.skyDark, 0.92)} />
            )}
        </g>
    );
});
