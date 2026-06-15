/**
 * @file CompassRose.tsx
 * @description A visual compass indicator showing cardinal directions and a heading needle.
 */
import React from 'react';
import { useTheme, alpha } from '@mui/material';

/**
 * Props for the CompassRose component.
 */
export interface CompassRoseProps {
    /** Center X coordinate on the SVG canvas. */
    cx: number;
    /** Center Y coordinate on the SVG canvas. */
    cy: number;
    /** Radius of the compass circle. */
    radius: number;
    /** The heading in degrees (0-360) where 0 is North. */
    heading: number;
    /** Optional color for the heading needle. */
    color?: string;
}

/**
 * Renders a compass rose with cardinal ticks and a needle indicating the current heading.
 * 
 * @param props - The properties for the CompassRose component.
 * @returns An SVG group containing the compass rose.
 */
export const CompassRose: React.FC<CompassRoseProps> = ({ cx, cy, radius, heading, color }) => {
    const theme = useTheme();
    const headingRad = (-heading + 90) * Math.PI / 180;
    const resolvedColor = color || theme.palette.info.main;
    
    return (
        <g transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r={radius} fill={alpha(theme.palette.common.black, 0.4)} stroke={theme.palette.divider} strokeWidth="2" />
            
            {[0, 90, 180, 270].map((deg) => {
                const rad = (-deg + 90) * Math.PI / 180;
                const x1 = Math.cos(rad) * (radius - 8);
                const y1 = -Math.sin(rad) * (radius - 8);
                const x2 = Math.cos(rad) * radius;
                const y2 = -Math.sin(rad) * radius;
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.palette.text.secondary} strokeWidth="2" />;
            })}
            
            {[45, 135, 225, 315].map((deg) => {
                const rad = (-deg + 90) * Math.PI / 180;
                const x1 = Math.cos(rad) * (radius - 5);
                const y1 = -Math.sin(rad) * (radius - 5);
                const x2 = Math.cos(rad) * radius;
                const y2 = -Math.sin(rad) * radius;
                return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.palette.text.disabled} strokeWidth="1" />;
            })}
            
            <line x1="0" y1="0" x2={Math.cos(headingRad) * (radius - 12)} y2={-Math.sin(headingRad) * (radius - 12)} stroke={resolvedColor} strokeWidth="4" strokeLinecap="round" />
            <circle cx={Math.cos(headingRad) * (radius - 12)} cy={-Math.sin(headingRad) * (radius - 12)} r="4" fill={resolvedColor} />
            <circle cx="0" cy="0" r="3" fill={theme.palette.primary.dark} />
        </g>
    );
};