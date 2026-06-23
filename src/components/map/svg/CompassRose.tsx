/**
 * @file CompassRose.tsx
 * @description Renders a compass rose and directional grid for the map visualizer. Supports interactive heading selection and smooth needle animation.
 * 
 * @author Carson Fujita
 * @license MIT
 */
import React from 'react';
import { useTheme, alpha, Box } from '@mui/material';
import { useSpring, useMotionValueEvent, interpolate } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

// ─── CompassRose ─────────────────────────────────────────────────────────────

export interface CompassRoseProps {
    cx: number;
    cy: number;
    radius: number;
    heading: number;
    color?: string;
    hideCardinalLabels?: boolean;
}

export const CompassRose: React.FC<CompassRoseProps> = ({ cx, cy, radius, heading, color, hideCardinalLabels = false }) => {
    const theme = useTheme();
    const resolvedColor = color || theme.palette.info.main;
    const compassColors = (theme.palette as any).compass;

    // Track accumulated rotation so the spring always takes the shortest arc
    // (e.g. 350°→10° animates +20°, not −340°).
    const prevHeadingRef = React.useRef(heading);
    const accumulatedRef = React.useRef(heading);
    const springRotation = useSpring(heading, { stiffness: 200, damping: 25 });
    const needleRef = React.useRef<SVGGElement>(null);

    const colorInterpolator = React.useMemo(() => {
        if (!compassColors) return null;
        return interpolate(
            [0, 45, 90, 135, 180, 225, 270, 315, 360],
            [
                compassColors.north, compassColors.northEast, compassColors.east, compassColors.southEast,
                compassColors.south, compassColors.southWest, compassColors.west, compassColors.northWest,
                compassColors.north
            ]
        );
    }, [compassColors]);

    const getActiveColor = (v: number) => {
        if (color) return color;
        if (!colorInterpolator) return resolvedColor;
        const normalized = ((v % 360) + 360) % 360;
        return colorInterpolator(normalized);
    };

    React.useEffect(() => {
        const delta = ((heading - prevHeadingRef.current + 540) % 360) - 180;
        accumulatedRef.current += delta;
        prevHeadingRef.current = heading;
        springRotation.set(accumulatedRef.current);
    }, [heading, springRotation]);

    // Write the SVG transform directly on every spring frame — no re-renders,
    // no CSS/SVG coordinate mismatch. Also updates colors to match cardinal points.
    useMotionValueEvent(springRotation, 'change', (v) => {
        if (!needleRef.current) return;
        needleRef.current.setAttribute('transform', `rotate(${v})`);
        const c = getActiveColor(v);
        const line = needleRef.current.querySelector('line');
        const circle = needleRef.current.querySelector('circle');
        if (line) line.setAttribute('stroke', c);
        if (circle) circle.setAttribute('fill', c);
    });

    const initialColor = getActiveColor(accumulatedRef.current);

    return (
        <g transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r={radius} fill={alpha(theme.palette.common.black, 0.4)} stroke={theme.palette.divider} strokeWidth="2" />

            {[
                { deg: 0,   label: 'N', cardinalColor: compassColors?.north },
                { deg: 90,  label: 'E', cardinalColor: compassColors?.east },
                { deg: 180, label: 'S', cardinalColor: compassColors?.south },
                { deg: 270, label: 'W', cardinalColor: compassColors?.west },
            ].map(({ deg, label, cardinalColor }) => {
                const rad = (-deg + 90) * Math.PI / 180;
                const cx = Math.cos(rad);
                const cy = -Math.sin(rad);
                return (
                    <g key={deg}>
                        <line
                            x1={cx * (radius - 8)} y1={cy * (radius - 8)}
                            x2={cx * radius}       y2={cy * radius}
                            stroke={theme.palette.text.secondary} strokeWidth="2"
                        />
                        {!hideCardinalLabels && (
                            <text
                                x={cx * (radius - 14)} y={cy * (radius - 14) + 4}
                                fill={cardinalColor || resolvedColor}
                                fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none"
                            >
                                {label}
                            </text>
                        )}
                    </g>
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
                <line x1="0" y1="0" x2="0" y2={-(radius - 12)} stroke={initialColor} strokeWidth="4" strokeLinecap="round" />
                <circle cx="0" cy="0" r="4" fill={initialColor} />
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
    onSelect?: (heading: number) => void;
}

export type DirectionButtonsProps = DirectionalGridProps;

export const DirectionalGrid: React.FC<DirectionalGridProps> = ({ cx, cy, radius, currentHeading, onSelect }) => {
    const theme = useTheme();
    const compass = (theme.palette as any).compass || {};
    const directions = [
        { label: 'N',  heading: 0,   angle: 90,   color: compass.north     || theme.palette.info.main, cardinal: true  },
        { label: 'NE', heading: 45,  angle: 45,   color: compass.northEast || theme.palette.info.main, cardinal: false },
        { label: 'E',  heading: 90,  angle: 0,    color: compass.east      || theme.palette.info.main, cardinal: true  },
        { label: 'SE', heading: 135, angle: -45,  color: compass.southEast || theme.palette.info.main, cardinal: false },
        { label: 'S',  heading: 180, angle: -90,  color: compass.south     || theme.palette.info.main, cardinal: true  },
        { label: 'SW', heading: 225, angle: -135, color: compass.southWest || theme.palette.info.main, cardinal: false },
        { label: 'W',  heading: 270, angle: 180,  color: compass.west      || theme.palette.info.main, cardinal: true  },
        { label: 'NW', heading: 315, angle: 135,  color: compass.northWest || theme.palette.info.main, cardinal: false },
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

                // All labels sit on the arc midpoint
                const labelR = radius;
                const lx = Math.cos(midRad) * labelR;
                const ly = -Math.sin(midRad) * labelR + 4;

                return (
                    <g
                        key={label}
                        cursor="pointer"
                        filter={isSelected ? `drop-shadow(0 0 6px ${color})` : undefined}
                        onClick={() => onSelect?.(heading)}
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

// ─── InteractiveCompass ──────────────────────────────────────────────────────

export interface InteractiveCompassProps {
    heading: number;
    onHeadingChange?: (heading: number) => void;
    size?: number;
    outerRadius?: number;
    innerRadius?: number;
    isConnected?: boolean;
    hideCardinalLabels?: boolean;
}

export const InteractiveCompass: React.FC<InteractiveCompassProps> = ({
    heading,
    onHeadingChange,
    size = 160,
    outerRadius = 60,
    innerRadius = 45,
    isConnected = false,
    hideCardinalLabels = false,
}) => {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const center = size / 2;

    const handleUpdate = (x: number, y: number) => {
        if (!svgRef.current || isConnected || !onHeadingChange) return;
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const h = (Math.atan2(y - centerY, x - centerX) * 180 / Math.PI) + 90;
        onHeadingChange((Math.round(h) + 360) % 360);
    };

    const bind = useDrag(({ xy: [x, y], event }) => {
        if (event) event.stopPropagation();
        handleUpdate(x, y);
    }, {
        threshold: 0,
        eventOptions: { passive: false }
    });

    return (
        <Box
            ref={svgRef}
            component="svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            sx={{
                cursor: isConnected ? 'default' : 'crosshair',
                touchAction: 'none',
                display: 'block',
                overflow: 'visible',
                userSelect: 'none'
            }}
            {...bind()}
        >
            <DirectionButtons cx={center} cy={center} radius={outerRadius} currentHeading={heading} onSelect={onHeadingChange} />
            <CompassRose cx={center} cy={center} radius={innerRadius} heading={heading} hideCardinalLabels={hideCardinalLabels} />
        </Box>
    );
};
