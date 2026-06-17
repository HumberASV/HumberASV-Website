import React from 'react';
import { useTheme, alpha } from '@mui/material';
import { useSpring, useMotionValueEvent } from 'framer-motion';

// ─── CompassRose ─────────────────────────────────────────────────────────────

export interface CompassRoseProps {
    cx: number;
    cy: number;
    radius: number;
    heading: number;
    color?: string;
}

export const CompassRose: React.FC<CompassRoseProps> = ({ cx, cy, radius, heading, color }) => {
    const theme = useTheme();
    const resolvedColor = color || theme.palette.info.main;

    // Track accumulated rotation so the spring always takes the shortest arc
    // (e.g. 350°→10° animates +20°, not −340°).
    const prevHeadingRef = React.useRef(heading);
    const accumulatedRef = React.useRef(heading);
    const springRotation = useSpring(heading, { stiffness: 200, damping: 25 });
    const needleRef = React.useRef<SVGGElement>(null);

    React.useEffect(() => {
        const delta = ((heading - prevHeadingRef.current + 540) % 360) - 180;
        accumulatedRef.current += delta;
        prevHeadingRef.current = heading;
        springRotation.set(accumulatedRef.current);
    }, [heading, springRotation]);

    // Write the SVG transform directly on every spring frame — no re-renders,
    // no CSS/SVG coordinate mismatch.
    useMotionValueEvent(springRotation, 'change', (v) => {
        needleRef.current?.setAttribute('transform', `rotate(${v})`);
    });

    return (
        <g transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r={radius} fill={alpha(theme.palette.common.black, 0.4)} stroke={theme.palette.divider} strokeWidth="2" />

            {[0, 90, 180, 270].map((deg) => {
                const rad = (-deg + 90) * Math.PI / 180;
                return (
                    <line key={deg}
                        x1={Math.cos(rad) * (radius - 8)} y1={-Math.sin(rad) * (radius - 8)}
                        x2={Math.cos(rad) * radius}       y2={-Math.sin(rad) * radius}
                        stroke={theme.palette.text.secondary} strokeWidth="2"
                    />
                );
            })}

            {[45, 135, 225, 315].map((deg) => {
                const rad = (-deg + 90) * Math.PI / 180;
                return (
                    <line key={deg}
                        x1={Math.cos(rad) * (radius - 5)} y1={-Math.sin(rad) * (radius - 5)}
                        x2={Math.cos(rad) * radius}       y2={-Math.sin(rad) * radius}
                        stroke={theme.palette.text.disabled} strokeWidth="1"
                    />
                );
            })}

            <g ref={needleRef} transform={`rotate(${accumulatedRef.current})`}>
                <line x1="0" y1="0" x2="0" y2={-(radius - 12)} stroke={resolvedColor} strokeWidth="4" strokeLinecap="round" />
                <circle cx="0" cy={-(radius - 12)} r="4" fill={resolvedColor} />
            </g>

            <circle cx="0" cy="0" r="3" fill={theme.palette.primary.dark} />
        </g>
    );
};

// ─── DirectionalGrid / DirectionButtons ──────────────────────────────────────

export interface DirectionalGridProps {
    cx: number;
    cy: number;
    radius: number;
    currentHeading: number;
    onSelect: (heading: number) => void;
}

export type DirectionButtonsProps = DirectionalGridProps;

export const DirectionalGrid: React.FC<DirectionalGridProps> = ({ cx, cy, radius, currentHeading, onSelect }) => {
    const theme = useTheme();
    const directions = [
        { label: 'N',  heading: 0,   angle: 90,   color: theme.palette.compass.north,     cardinal: true  },
        { label: 'NE', heading: 45,  angle: 45,   color: theme.palette.compass.northEast, cardinal: false },
        { label: 'E',  heading: 90,  angle: 0,    color: theme.palette.compass.east,      cardinal: true  },
        { label: 'SE', heading: 135, angle: -45,  color: theme.palette.compass.southEast, cardinal: false },
        { label: 'S',  heading: 180, angle: -90,  color: theme.palette.compass.south,     cardinal: true  },
        { label: 'SW', heading: 225, angle: -135, color: theme.palette.compass.southWest, cardinal: false },
        { label: 'W',  heading: 270, angle: 180,  color: theme.palette.compass.west,      cardinal: true  },
        { label: 'NW', heading: 315, angle: 135,  color: theme.palette.compass.northWest, cardinal: false },
    ];

    const arcWidth = 16;
    const innerRadius = radius - arcWidth / 2;
    const outerRadius = radius + arcWidth / 2;
    const gapAngle = 4;
    const segmentAngle = 45;

    // Snap to nearest 45° segment so the glow follows the needle even when
    // currentHeading is a non-discrete angle set by dragging.
    const activeHeading = (Math.round(currentHeading / 45) * 45) % 360;

    const createArcPath = (centerAngle: number, inner: number, outer: number) => {
        const halfSpan = segmentAngle / 2 - gapAngle / 2;
        const startRad = ((centerAngle + halfSpan) * Math.PI) / 180;
        const endRad   = ((centerAngle - halfSpan) * Math.PI) / 180;

        const outerStart = { x: Math.cos(startRad) * outer, y: -Math.sin(startRad) * outer };
        const outerEnd   = { x: Math.cos(endRad)   * outer, y: -Math.sin(endRad)   * outer };
        const innerStart = { x: Math.cos(startRad) * inner, y: -Math.sin(startRad) * inner };
        const innerEnd   = { x: Math.cos(endRad)   * inner, y: -Math.sin(endRad)   * inner };

        return `M ${outerStart.x} ${outerStart.y} A ${outer} ${outer} 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${inner} ${inner} 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
    };

    return (
        <g transform={`translate(${cx}, ${cy})`}>
            {/* Separator ring — frames the inner CompassRose area */}
            <circle cx="0" cy="0" r={innerRadius} fill="none" stroke={alpha(theme.palette.divider, 0.4)} strokeWidth="1" />

            {/* Intercardinal tick marks just inside the separator ring */}
            {[45, 135, 225, 315].map((deg) => {
                const rad = ((-deg + 90) * Math.PI) / 180;
                return (
                    <line key={deg}
                        x1={Math.cos(rad) * (innerRadius - 6)} y1={-Math.sin(rad) * (innerRadius - 6)}
                        x2={Math.cos(rad) * (innerRadius - 1)} y2={-Math.sin(rad) * (innerRadius - 1)}
                        stroke={theme.palette.text.disabled} strokeWidth="1"
                    />
                );
            })}

            {/* Arc segments + labels */}
            {directions.map(({ label, heading, angle, color, cardinal }) => {
                const isSelected = activeHeading === heading;
                const midRad = (angle * Math.PI) / 180;

                // Cardinals outside the arc ring; intercardinals centred on the arc
                const labelR = cardinal ? outerRadius + 10 : radius;
                const lx = Math.cos(midRad) * labelR;
                const ly = -Math.sin(midRad) * labelR + 4;

                return (
                    <g
                        key={label}
                        cursor="pointer"
                        filter={isSelected ? `drop-shadow(0 0 6px ${color})` : undefined}
                        onClick={() => onSelect(heading)}
                    >
                        <path
                            d={createArcPath(angle, innerRadius, outerRadius)}
                            fill={isSelected ? color : alpha(theme.palette.background.paper, 0.1)}
                            stroke={isSelected ? theme.palette.common.white : alpha(theme.palette.divider, 0.5)}
                            strokeWidth={isSelected ? 3 : 2}
                        />
                        <text
                            x={lx} y={ly}
                            fill={isSelected ? theme.palette.common.white : color}
                            fontSize={cardinal ? '11' : '7'}
                            fontWeight="bold"
                            textAnchor="middle"
                            pointerEvents="none"
                        >
                            {label}
                        </text>
                    </g>
                );
            })}
        </g>
    );
};

export const DirectionButtons = DirectionalGrid;
