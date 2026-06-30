/**
 * @file FogOfWarOverlay.tsx
 * @description Isometric fog-of-war overlay. Merges all fog tiles into two SVG <path>
 * elements (one per state bucket) instead of 10,000 individual polygons.
 *
 * Cell states:
 *   0 UNREVEALED — opaque fog tile (vessel has never been near this cell)
 *   1 VISIBLE    — no tile rendered (full color visible beneath)
 *   2 VISITED    — translucent dim tile (seen before, not currently in range)
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { useAppSelector } from '../../store';
import { selectFogLookup } from '../../store/slices/fogOfWarSlice';
import { GLOBAL_GRID_SIZE, GLOBAL_CELL_SIZE, LOCAL_CELL_SIZE } from '../../utils/types';
import type { Cell } from '../../utils/types';

export interface FogOfWarOverlayProps {
    toScreen: (x: number, y: number, z: number) => Cell;
}

// Fog grid: 100×100 at LOCAL_CELL_SIZE resolution over the global world.
const FOG_GRID = (GLOBAL_GRID_SIZE * GLOBAL_CELL_SIZE) / LOCAL_CELL_SIZE; // 100
const HALF_SPAN = (GLOBAL_GRID_SIZE * GLOBAL_CELL_SIZE) / 2;              // 400

export const FogOfWarOverlay: React.FC<FogOfWarOverlayProps> = React.memo(({ toScreen }) => {
    const theme = useTheme();
    const fogLookup = useAppSelector(selectFogLookup);

    const { unrevealedD, visitedD } = React.useMemo(() => {
        let unrevealed = '';
        let visited = '';

        for (let row = 0; row < FOG_GRID; row++) {
            for (let col = 0; col < FOG_GRID; col++) {
                const s = fogLookup(col, row);
                if (s === 1) continue;

                const wx = col * LOCAL_CELL_SIZE - HALF_SPAN;
                const wy = row * LOCAL_CELL_SIZE - HALF_SPAN;

                const tl = toScreen(wx,                  wy,                  0);
                const tr = toScreen(wx + LOCAL_CELL_SIZE, wy,                  0);
                const br = toScreen(wx + LOCAL_CELL_SIZE, wy + LOCAL_CELL_SIZE, 0);
                const bl = toScreen(wx,                  wy + LOCAL_CELL_SIZE, 0);

                const seg = `M${tl.x},${tl.y}L${tr.x},${tr.y}L${br.x},${br.y}L${bl.x},${bl.y}Z`;
                if (s === 0) unrevealed += seg;
                else visited += seg;
            }
        }

        return { unrevealedD: unrevealed, visitedD: visited };
    }, [fogLookup, toScreen]);

    return (
        <g data-layer="fog-of-war">
            {unrevealedD && (
                <path d={unrevealedD} fill={alpha(theme.palette.scene.skyDark, 0.92)} />
            )}
            {visitedD && (
                <path d={visitedD} fill={alpha(theme.palette.scene.skyDark, 0.55)} />
            )}
        </g>
    );
});
