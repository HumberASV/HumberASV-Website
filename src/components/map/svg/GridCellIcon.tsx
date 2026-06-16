/**
 * @file GridCellIcon.tsx
 * @description Isometric cell tile with a theme-based fill and an optional icon centered inside it.
 * The cell face is sized to GLOBAL_CELL_SIZE and colored using MUI error/warning/info/success palettes.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { GLOBAL_CELL_SIZE, type Cell, type CellType, CellTypes } from '../../../utils/types';

export type CellTheme = 'error' | 'warning' | 'info' | 'success';

export interface GridCellIconProps {
    /** World-space X origin of the cell in pixels (col * GLOBAL_CELL_SIZE). */
    cx: number;
    /** World-space Y origin of the cell in pixels (row * GLOBAL_CELL_SIZE). */
    cy: number;
    /** Isometric projection function from the parent Map. */
    toScreen: (x: number, y: number, z: number) => Cell;
    /** Explicit color theme. If omitted, derived from cellType. */
    cellTheme?: CellTheme;
    /** Cell type from the occupancy/navigation grid. Drives the color theme when cellTheme is absent. */
    cellType?: CellType;
    /** Optional icon rendered centered inside the cell (e.g. an MUI SvgIcon element). */
    icon?: React.ReactNode;
    /** Overall opacity of the cell. Defaults to 0.85. */
    opacity?: number;
    /** Cell size in world pixels. Defaults to GLOBAL_CELL_SIZE. */
    cellSize?: number;
}

function cellTypeToTheme(type: CellType): CellTheme {
    switch (type) {
        case CellTypes.occupied:  return 'error';
        case CellTypes.error:     return 'error';
        case CellTypes.objective: return 'warning';
        case CellTypes.current:   return 'success';
        case CellTypes.path:      return 'info';
        case CellTypes.empty:
        default:                  return 'info';
    }
}

const ICON_SIZE = 16;

export const GridCellIcon: React.FC<GridCellIconProps> = ({
    cx,
    cy,
    toScreen,
    cellTheme,
    cellType,
    icon,
    opacity = 0.85,
    cellSize = GLOBAL_CELL_SIZE,
}) => {
    const theme = useTheme();

    const resolvedTheme: CellTheme =
        cellTheme ?? (cellType !== undefined ? cellTypeToTheme(cellType) : 'info');
    const palette = theme.palette[resolvedTheme];

    // Isometric corners of the top face of this cell
    const tl = toScreen(cx,           cy,           0);
    const tr = toScreen(cx + cellSize, cy,           0);
    const br = toScreen(cx + cellSize, cy + cellSize, 0);
    const bl = toScreen(cx,           cy + cellSize, 0);

    // Screen-space center for the icon
    const center = toScreen(cx + cellSize / 2, cy + cellSize / 2, 0);

    const points = `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`;

    return (
        <g opacity={opacity}>
            <polygon
                points={points}
                fill={alpha(palette.main, 0.6)}
                stroke={palette.light}
                strokeWidth={0.5}
            />
            {icon && (
                <foreignObject
                    x={center.x - ICON_SIZE / 2}
                    y={center.y - ICON_SIZE / 2}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    style={{ overflow: 'visible', pointerEvents: 'none' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: `${ICON_SIZE}px`,
                            height: `${ICON_SIZE}px`,
                            color: palette.light,
                            fontSize: `${ICON_SIZE}px`,
                        }}
                    >
                        {icon}
                    </div>
                </foreignObject>
            )}
        </g>
    );
};
