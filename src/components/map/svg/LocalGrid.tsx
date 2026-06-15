/**
 * @file LocalGrid.tsx
 * @description Renders the local coordinate frame and markers on the isometric map.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { GLOBAL_CELL_SIZE, type Point2D } from '../../../utils/telemetry/mapUtils';
import { IsometricGrid } from './IsometricGrid';
import { IsometricAxes } from './IsometricAxes';

/**
 * Props for the LocalGrid component.
 */
export interface LocalGridProps {
    globalX: number;
    globalY: number;
    localRotation: number;
    showLocalAxes: boolean;
    toScreen: (x: number, y: number, z: number) => Point2D;
    pointScreen: Point2D;
    globalOriginScreen: Point2D;
}

/**
 * Renders the local coordinate frame and markers on the isometric map.
 */
export const LocalGrid: React.FC<LocalGridProps> = ({
    globalX,
    globalY,
    localRotation,
    showLocalAxes,
    toScreen,
    pointScreen,
    globalOriginScreen,
}) => {
    const theme = useTheme();

    return (
        <g>
            {/* Local Grid Frame */}
            <IsometricGrid 
                size={40} step={8} 
                center={{x: globalX * GLOBAL_CELL_SIZE, y: globalY * GLOBAL_CELL_SIZE, z: 0}} 
                rotation={localRotation} 
                toScreen={toScreen} 
                color={theme.palette.info.light} 
                opacity={0.8} 
            />

            {/* Local Axes */}
            {showLocalAxes && (
              <IsometricAxes 
                origin={{x: globalX * GLOBAL_CELL_SIZE, y: globalY * GLOBAL_CELL_SIZE, z: 0}} 
                length={50} 
                toScreen={toScreen} 
                rotation={localRotation}
              />
            )}

            {/* Points */}
            <ellipse cx={pointScreen.x} cy={pointScreen.y + 5} rx="12" ry="6" fill={theme.palette.common.black} opacity="0.3" />
            <circle 
                cx={globalOriginScreen.x} 
                cy={globalOriginScreen.y} 
                r="6" 
                fill={theme.palette.common.white} 
                stroke={theme.palette.info.light} 
                strokeWidth="2" 
                filter="url(#glow)" 
            />
            <circle 
                cx={pointScreen.x} 
                cy={pointScreen.y} 
                r="8" 
                fill={theme.palette.warning.light} 
                stroke={alpha(theme.palette.warning.light, 0.4)} 
                strokeWidth="2" 
                filter="url(#glow)" 
            />
        </g>
    );
};