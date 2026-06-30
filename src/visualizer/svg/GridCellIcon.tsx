/**
 * @file GridCellIcon.tsx
 * @description Isometric cell tile with a theme-based fill and an optional icon centered inside it.
 * The cell face is sized to `GLOBAL_CELL_SIZE` and colored using MUI error/warning/info/success palettes.
 * 
 * @author Carson Fujita
 * 
 * @remarks
 * This component is used to render individual cells in the occupancy/navigation grid.
 * The cell's color theme can be explicitly specified via the `cellTheme` prop, or derived from the `cellType` prop.
 * An optional icon can be rendered centered inside the cell, such as an MUI SvgIcon element.
 * The cell is projected onto a 2D SVG canvas using a provided projection function.
 * 
 * @example
 * <GridCellIcon
 *  cx={100}
 *  cy={200}
 *  toScreen={(x, y, z) => ({ x: x / 2, y: y / 2 })}
 *  cellTheme="error"
 *  icon={<MyCustomIcon />}
 *  opacity={0.9}
 *  cellSize={32}
 * />
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { GLOBAL_CELL_SIZE, type Cell, type CellType, CellTypes } from '../../utils/types';

/**
 * @typedef {('error' | 'warning' | 'info' | 'success')} CellTheme
 * @description The MUI color theme key used to determine the fill color of the cell.
 * @remarks
 * - 'error' corresponds to red-themed cells (e.g., occupied or error states).
 * - 'warning' corresponds to yellow-themed cells (e.g., objectives).
 * - 'info' corresponds to blue-themed cells (e.g., empty or path states).
 * - 'success' corresponds to green-themed cells (e.g., current position).
 */
export type CellTheme = 'error' | 'warning' | 'info' | 'success';

/**
 * @interface GridCellIconProps
 * @description Properties for the {@link GridCellIcon} component.
 * @see {@link GridCellIcon}
 * @property {number} cx - World-space X origin of the cell in pixels (col * GLOBAL_CELL_SIZE).
 *  defaults to 0 if not provided.
 * @property {number} cy - World-space Y origin of the cell in pixels (row * GLOBAL_CELL_SIZE).
 *  defaults to 0 if not provided.
 * @property {(x: number, y: number, z: number) => Cell} toScreen - Isometric projection function from the parent Map.
 *  defaults to a simple orthographic projection if not provided.
 * @property {CellTheme} [cellTheme] - Explicit color theme. If omitted, derived from cellType.
 *  defaults to undefined if not provided.
 * @property {CellType} [cellType] - Cell type from the occupancy/navigation grid. Drives the color theme when cellTheme is absent.
 *  defaults to CellTypes.empty if not provided.
 * @property {React.ReactNode} [icon] - Optional icon rendered centered inside the cell (e.g. an MUI SvgIcon element).
 *  defaults to null if not provided.
 * @property {number} [opacity] - Overall opacity of the cell. Defaults to 0.85.
 * @property {number} [cellSize] - Cell size in world pixels. Defaults to GLOBAL_CELL_SIZE.
 */
export interface GridCellIconProps {
    /** World-space X origin of the cell in pixels (col * GLOBAL_CELL_SIZE). */
    cx: number;
    /** World-space Y origin of the cell in pixels (row * GLOBAL_CELL_SIZE). */
    cy: number;
    /** Isometric projection function from the parent Map. */
    toScreen?: (x: number, y: number, z: number) => Cell;
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

/** 
 * @function cellTypeToTheme
 * @description Maps a grid `CellType` to the corresponding MUI color theme key. 
 * @param {CellType} type - The cell type to map.
 * @returns {CellTheme} The corresponding MUI color theme key.
 * @remarks
 * - CellTypes.occupied and CellTypes.error map to 'error' (red).
 * - CellTypes.objective maps to 'warning' (yellow).
 * - CellTypes.current maps to 'success' (green).
 * - CellTypes.path and CellTypes.empty map to 'info' (blue).
 * - Any unrecognized type defaults to 'info'.
 */
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

/**
 * @constant ICON_SIZE
 * @description The fixed size of the icon rendered inside the cell, in pixels.
 * @remarks
 * The icon is centered within the cell and does not scale with the cell size.
 * This ensures consistent visual appearance regardless of cell dimensions.
 * The icon size is set to 16 pixels, which is a common size for SVG icons.
 */
const ICON_SIZE = 16;

/**
 * @component GridCellIcon
 * @description Renders a single isometric cell tile with a theme-driven fill color and an optional icon.
 * @param {GridCellIconProps} props - Properties for the component.
 * @returns {JSX.Element} The rendered SVG group containing the cell polygon and optional icon.
 * @remarks
 * The cell's top face is drawn as a polygon with four corners projected to screen space using the provided `toScreen` function.
 * The fill color is determined by either the explicit `cellTheme` prop or derived from the `cellType` prop.
 * An optional icon can be rendered centered inside the cell, which is useful for indicating special states or objects.
 * The overall opacity of the cell can be adjusted via the `opacity` prop, allowing for visual layering effects.
 * The size of the cell can be customized via the `cellSize` prop, but defaults to `GLOBAL_CELL_SIZE`.
 * @example
 * <GridCellIcon
 *  cx={100}
 *  cy={200}
 *  toScreen={(x, y, z) => ({ x: x / 2, y: y / 2 })}
 *  cellTheme="error"
 *  icon={<MyCustomIcon />}
 *  opacity={0.9}
 *  cellSize={32}
 * /> 
 */
export const GridCellIcon = React.memo<GridCellIconProps>(({
    cx = 0,
    cy = 0,
    toScreen = (x: number, y: number) => ({ x: x / 2, y: y / 2 }),
    cellTheme = undefined,
    cellType = CellTypes.empty,
    icon = null,
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
});
