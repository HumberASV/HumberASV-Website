/**
 * @file DirectionalGrid.tsx
 * @description Interactive circular grid for orientation and navigation.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';

/**
 * Props for the DirectionalGrid component.
 */
export interface DirectionalGridProps {
    /** Center X coordinate of the grid. */
    cx: number;
    /** Center Y coordinate of the grid. */
    cy: number;
    /** Radius at which the segments are placed. */
    radius: number;
    /** The currently selected heading. */
    currentHeading: number;
    /** Callback fired when a new heading segment is selected. */
    onSelect: (heading: number) => void;
}

/**
 * Renders a ring of interactive arc segments representing cardinal and intercardinal directions.
 */
export const DirectionalGrid: React.FC<DirectionalGridProps> = ({ cx, cy, radius, currentHeading, onSelect }) => {
    const theme = useTheme();

    const directions = [
        { label: 'N', heading: 0, angle: 90, btnColor: theme.palette.success.main },
        { label: 'NE', heading: 45, angle: 45, btnColor: theme.palette.text.disabled },
        { label: 'E', heading: 90, angle: 0, btnColor: theme.palette.error.main },
        { label: 'SE', heading: 135, angle: -45, btnColor: theme.palette.text.disabled },
        { label: 'S', heading: 180, angle: -90, btnColor: theme.palette.warning.main },
        { label: 'SW', heading: 225, angle: -135, btnColor: theme.palette.text.disabled },
        { label: 'W', heading: 270, angle: 180, btnColor: theme.palette.info.main },
        { label: 'NW', heading: 315, angle: 135, btnColor: theme.palette.text.disabled },
    ];

    const arcWidth = 10;
    const innerRadius = radius - arcWidth / 2;
    const outerRadius = radius + arcWidth / 2;
    const gapAngle = 4;
    const segmentAngle = 45;

    const createArcPath = (centerAngle: number, inner: number, outer: number) => {
        const halfSpan = segmentAngle / 2 - gapAngle / 2;
        const startAngle = centerAngle + halfSpan;
        const endAngle = centerAngle - halfSpan;
        
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        
        const outerStart = { x: Math.cos(startRad) * outer, y: -Math.sin(startRad) * outer };
        const outerEnd = { x: Math.cos(endRad) * outer, y: -Math.sin(endRad) * outer };
        const innerStart = { x: Math.cos(startRad) * inner, y: -Math.sin(startRad) * inner };
        const innerEnd = { x: Math.cos(endRad) * inner, y: -Math.sin(endRad) * inner };
        
        return `M ${outerStart.x} ${outerStart.y} A ${outer} ${outer} 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${inner} ${inner} 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
    };

    return (
        <g transform={`translate(${cx}, ${cy})`}>
            {directions.map(({ label, heading, angle, btnColor }) => {
                const isCardinal = ['N', 'E', 'S', 'W'].includes(label);
                const isSelected = currentHeading === heading;
                
                const midRad = (angle * Math.PI) / 180;
                const textX = Math.cos(midRad) * radius;
                const textY = -Math.sin(midRad) * radius;
                
                return (
                    <g key={label}>
                        <path
                            d={createArcPath(angle, innerRadius, outerRadius)}
                            fill={isSelected ? btnColor : alpha(theme.palette.background.paper, 0.1)}
                            stroke={isSelected ? theme.palette.common.white : alpha(theme.palette.divider, 0.5)}
                            strokeWidth={isSelected ? 3 : 2}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                            onClick={() => onSelect(heading)}
                        />
                        <text x={textX} y={textY + 3} fill={isSelected ? theme.palette.common.white : btnColor} fontSize={isCardinal ? "9" : "7"} fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>{label}</text>
                    </g>
                );
            })}
        </g>
    );
};