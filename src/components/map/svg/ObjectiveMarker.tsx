/**
 * @file ObjectiveMarker.tsx
 * @description Animated video-game-style icon for the navigation objective cell.
 * Bounces and waves using SVG native animations — no JS animation loop needed.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import type { Cell } from '../../../utils/types';
import { GLOBAL_CELL_SIZE } from '../../../utils/types';

// Two path states for the waving fabric. 
// They maintain the exact same number of nodes/commands to ensure perfect morphing.
const FLAG_PATH_1 = "M 0,-12 Q 3.5,-16 7,-12 Q 10.5,-8 14,-12 L 14,-2 Q 10.5,2 7,-2 Q 3.5,-6 0,-2 Z";
const FLAG_PATH_2 = "M 0,-12 Q 3.5,-8 7,-12 Q 10.5,-16 14,-12 L 14,-2 Q 10.5,-6 7,-2 Q 3.5,2 0,-2 Z";

const DUR_BOUNCE = '1s';
const DUR_WAVE   = '0.7s';
const EASE       = '0.4 0 0.6 1; 0.4 0 0.6 1';

interface ObjectiveMarkerProps {
    cx: number;
    cy: number;
    toScreen: (x: number, y: number, z: number) => Cell;
}

export const ObjectiveMarker: React.FC<ObjectiveMarkerProps> = ({ cx, cy, toScreen }) => {
    const theme = useTheme();
    const c    = toScreen(cx + GLOBAL_CELL_SIZE / 2, cy + GLOBAL_CELL_SIZE / 2, 0);
    const gold = theme.palette.warning.main;
    const lite = theme.palette.warning.light;
    const poleColor = alpha(theme.palette.text.primary, 0.7);

    // Bounce: screen-space translate from floor position up 10px and back
    const bVals = `${c.x} ${c.y}; ${c.x} ${c.y - 10}; ${c.x} ${c.y}`;

    return (
        <g>
            {/* Floor shadow — shrinks and fades as flag rises */}
            <ellipse cx={c.x} cy={c.y + 5} rx={7} ry={2.5} fill={alpha(theme.palette.common.black, 0.4)}>
                <animate attributeName="rx"      values="7;3.5;7"    dur={DUR_BOUNCE} repeatCount="indefinite" calcMode="spline" keySplines={EASE} />
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur={DUR_BOUNCE} repeatCount="indefinite" calcMode="spline" keySplines={EASE} />
            </ellipse>

            {/* Bouncing group — translates from (cx,cy) to (cx, cy−10) and back */}
            <g>
                <animateTransform attributeName="transform" type="translate"
                    values={bVals} dur={DUR_BOUNCE}
                    repeatCount="indefinite" calcMode="spline" keySplines={EASE} />

                {/* Flag pole */}
                <rect x={-1} y={-12} width={2} height={16} rx={1} fill={poleColor} />

                {/* Waving flag fabric */}
                <path
                    fill={gold}
                    stroke={lite}
                    strokeWidth={1.2}
                    filter="url(#glow)"
                >
                    <animate 
                        attributeName="d" 
                        values={`${FLAG_PATH_1}; ${FLAG_PATH_2}; ${FLAG_PATH_1}`} 
                        dur={DUR_WAVE} 
                        repeatCount="indefinite" 
                        calcMode="spline" 
                        keySplines={EASE} 
                    />
                </path>
            </g>
        </g>
    );
};