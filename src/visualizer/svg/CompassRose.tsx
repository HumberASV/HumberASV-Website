/**
 * @file CompassRose.tsx
 * @description Renders a compass rose and directional grid for the map visualizer. 
 * 
 * @remarks
 * The {@link CompassRose} component displays a circular compass with a needle that smoothly animates to indicate the current heading. 
 * The {@link DirectionalGrid} component renders a ring of clickable arc segments for selecting a compass heading in 45° increments.
 * The {@link InteractiveCompass} component combines both the {@link CompassRose} and {@link DirectionalGrid} into a single interactive control.
 * Supports interactive heading selection and smooth needle animation.
 * 
 * @author Carson Fujita
 * @license MIT
 * 
 * @example
 * <InteractiveCompass
 *  heading={currentHeading}
 *  onHeadingChange={(newHeading) => setCurrentHeading(newHeading)}
 * size={160}
 * outerRadius={60}
 * innerRadius={45}
 * hideCardinalLabels={false}
 * />
 * 
 */
import React from 'react';
import { useTheme, alpha, Box } from '@mui/material';
import { useSpring, useMotionValueEvent, interpolate } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

const COMPASS_ROSE_SPRING = { stiffness: 200, damping: 25 };

// ─── CompassRose ─────────────────────────────────────────────────────────────

/**
 * @interface CompassRoseProps
 * @description Properties for the {@link CompassRose} component.
 * @see {@link CompassRose}
 * @property {number} cx - X-coordinate of the center of the compass rose.
 * @property {number} cy - Y-coordinate of the center of the compass rose.
 * @property {number} radius - Radius of the compass rose circle.
 * @property {number} heading - Current heading in degrees (0° = North, 90° = East).
 * @property {string} [color] - Optional color for the compass needle. Defaults to theme palette info.main.
 * @property {boolean} [hideCardinalLabels] - Whether to hide cardinal direction labels (N, E, S, W). Defaults to true.
 */
export interface CompassRoseProps {
    cx: number;
    cy: number;
    radius: number;
    heading: number;
    color?: string;
    hideCardinalLabels?: boolean;
}

/** 
 * @function CompassRose
 * @description Renders an animated compass needle that smoothly tracks heading changes using a spring. 
 * @param {CompassRoseProps} props - Properties for the compass rose.
 * @returns {JSX.Element} The rendered compass rose SVG group.
 * @remarks
 * The needle color can be specified via the `color` prop or will default to the theme palette info.main. 
 * The needle smoothly animates to the new heading using a spring animation, and the color interpolates based on cardinal directions 
 * if no color is provided.
 */
export const CompassRose: React.FC<CompassRoseProps> = ({ cx, cy, radius, heading, color, hideCardinalLabels = true }) => {
    const theme = useTheme();
    const resolvedColor = color || theme.palette.info.main;
    const compassColors = theme.palette.compass;

    // Track accumulated rotation so the spring always takes the shortest arc
    // (e.g. 350°→10° animates +20°, not −340°).
    const prevHeadingRef = React.useRef(heading);
    const accumulatedRef = React.useRef(heading);
    const springRotation = useSpring(heading, COMPASS_ROSE_SPRING);
    const needleRef = React.useRef<SVGGElement>(null);

    /**
     * @function colorInterpolator
     * @description Creates a color interpolator function that maps heading angles to compass colors.
     * @returns {(v: number) => string} A function that takes a heading angle (0-360°) and returns the corresponding color.
     * @remarks
     * The interpolator uses the compassColors from the theme palette to determine the color for each cardinal and intercardinal direction.
     * If no compassColors are defined in the theme, the interpolator will return null and the default resolvedColor will be used.
     * The interpolation is linear between defined angles, allowing for smooth color transitions as the needle rotates.
     */
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

    /**
     * @function getActiveColor
     * @description Returns the interpolated compass color for the given accumulated rotation value.
     * @param {number} v - The accumulated rotation value in degrees.
     * @returns {string} The corresponding color for the current heading.
     * @remarks
     * If a color prop is provided, it will be used directly. 
     * If no color prop is provided and a colorInterpolator exists, the interpolated color based on the current heading will be returned.
     * If neither is available, the default resolvedColor will be used.
     */ 
    const getActiveColor = (v: number) => {
        if (color) return color;
        if (!colorInterpolator) return resolvedColor;
        const normalized = ((v % 360) + 360) % 360;
        return colorInterpolator(normalized);
    };

    /**
     * @description Updates the accumulated rotation and spring value whenever the heading prop changes.
     * @remarks
     * This effect calculates the shortest rotation delta between the previous heading and the new heading,
     * updates the accumulated rotation, and sets the spring value to animate the needle smoothly.
     * The accumulated rotation is stored in a ref to maintain continuity across renders.
     */
    React.useEffect(() => {
        const delta = ((heading - prevHeadingRef.current + 540) % 360) - 180;
        accumulatedRef.current += delta;
        prevHeadingRef.current = heading;
        springRotation.set(accumulatedRef.current);
    }, [heading, springRotation]);

    /**
     * @description Writes the SVG transform directly on every spring frame — no re-renders,
     * no CSS/SVG coordinate mismatch. Also updates colors to match cardinal points.
     */
    useMotionValueEvent(springRotation, 'change', (v) => {
        if (!needleRef.current) return;
        needleRef.current.setAttribute('transform', `rotate(${v})`);
        const c = getActiveColor(v);
        const line = needleRef.current.querySelector('line');
        const circle = needleRef.current.querySelector('circle');
        if (line) line.setAttribute('stroke', c);
        if (circle) circle.setAttribute('fill', c);
    });

    // Initial color for the needle based on the current heading
    const initialColor = getActiveColor(accumulatedRef.current);

    return (
        <g transform={`translate(${cx}, ${cy})`}>
            <circle cx="0" cy="0" r={radius} fill={alpha(theme.palette.common.black, 0.4)} stroke={theme.palette.divider} strokeWidth="2" />

            
            {hideCardinalLabels && [
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
                        {hideCardinalLabels && (
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

            {/* Intercardinal tick marks just inside the separator ring */}
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

/**
 * @interface DirectionalGridProps
 * @description Properties for the {@link DirectionalGrid} component.
 * @see {@link DirectionalGrid}
 * @property {number} cx - X-coordinate of the center of the directional grid.
 * @property {number} cy - Y-coordinate of the center of the directional grid.
 * @property {number} radius - Radius of the directional grid ring.
 * @property {number} currentHeading - Current heading in degrees (0° = North, 90° = East).
 * @property {(heading: number) => void} [onSelect] - Optional callback fired when a direction segment is clicked.
 * @property {boolean} [hideCardinalLabels] - Whether to hide cardinal direction labels (N, E, S, W). Defaults to false.
 */
export interface DirectionalGridProps {
    cx: number;
    cy: number;
    radius: number;
    currentHeading: number;
    onSelect?: (heading: number) => void;
    hideCardinalLabels?: boolean;
}

/**
 * @type DirectionButtonsProps
 * @description Alias for {@link DirectionalGridProps} to maintain backward compatibility with the `DirectionButtons` component.
 * @see {@link DirectionalGridProps}
 * @remarks
 * The `DirectionButtons` component is now an alias for `DirectionalGrid`, and both share the same props interface.
 * This allows for consistent usage and easier migration from the older `DirectionButtons` component to the newer `DirectionalGrid`.
 */
export type DirectionButtonsProps = DirectionalGridProps;

/** 
 * @function DirectionalGrid
 * @description Renders a ring of clickable arc segments for selecting a compass heading in 45° increments. 
 * @param {DirectionalGridProps} props - Properties for the directional grid.
 * @returns {JSX.Element} The rendered directional grid SVG group.
 * @remarks
 * Each segment represents a cardinal or intercardinal direction and can be clicked to select a heading. 
 * The currently selected heading is highlighted with a glow effect, and the segment color can be customized via the theme palette.
 * The `hideCardinalLabels` prop allows for hiding the N, E, S, W labels if desired.
 */
export const DirectionalGrid: React.FC<DirectionalGridProps> = ({ cx, cy, radius, currentHeading, onSelect, hideCardinalLabels = false }) => {
    const theme = useTheme();
    const compass = theme.palette.compass;
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

    /** Returns an SVG arc path for a single direction segment between inner and outer radii. */
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
                        {!hideCardinalLabels && (
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
                        )}
                    </g>
                );
            })}
        </g>
    );
};

export const DirectionButtons = DirectionalGrid;

// ─── InteractiveCompass ──────────────────────────────────────────────────────

/**
 * @interface InteractiveCompassProps
 * @description Properties for the {@link InteractiveCompass} component.
 * @see {@link InteractiveCompass}
 * @property {number} heading - Current heading in degrees (0° = North, 90° = East).
 * @property {(heading: number) => void} [onHeadingChange] - Optional callback fired when the heading is changed via dragging or clicking.
 * @property {number} [size] - Size of the SVG canvas. Defaults to 160.
 * @property {number} [outerRadius] - Outer radius of the directional grid. Defaults to 60.
 * @property {number} [innerRadius] - Inner radius of the compass rose. Defaults to 45.
 * @property {boolean} [isConnected] - Whether the compass is connected (disables interaction). Defaults to false.
 * @property {boolean} [hideCardinalLabels] - Whether to hide cardinal direction labels (N, E, S, W). Defaults to false.    
 */
export interface InteractiveCompassProps {
    heading: number;
    onHeadingChange?: (heading: number) => void;
    size?: number;
    outerRadius?: number;
    innerRadius?: number;
    isConnected?: boolean;
    hideCardinalLabels?: boolean;
}

/**
 * @function InteractiveCompass
 * @description Composites a {@link DirectionalGrid} and a {@link CompassRose} into a drag-to-set heading control.
 * @param {InteractiveCompassProps} props - Properties for the interactive compass.
 * @returns {JSX.Element} The rendered interactive compass SVG.
 * @remarks
 * The {@link InteractiveCompass} component allows users to set a heading by dragging or clicking on the directional grid. 
 * It combines the visual representation of the {@link CompassRose} with the interactive functionality of the {@link DirectionalGrid}.
 * The `onHeadingChange` callback is fired whenever the heading is updated, allowing parent components to respond to changes.
 * The component supports customization of size, radii, and visibility of cardinal labels.
 */
export const InteractiveCompass: React.FC<InteractiveCompassProps> = ({
    heading,
    onHeadingChange,
    size = 160,
    outerRadius = 60,
    innerRadius = 45,
    isConnected = false,
    hideCardinalLabels = false,
}) => {
    // The SVG reference is used to calculate the center of the compass for drag interactions.
    const svgRef = React.useRef<SVGSVGElement>(null);
    const center = size / 2;

    /** 
     * @function handleUpdate
     * @description Converts a screen-space pointer position to a compass heading and fires `onHeadingChange`.
     * @param {number} x - The x-coordinate of the pointer in screen space.
     * @param {number} y - The y-coordinate of the pointer in screen space.
     * @remarks
     * This function calculates the angle between the center of the compass and the pointer position using `Math.atan2`.
     * The resulting angle is converted to degrees and adjusted so that 0° corresponds to North. 
     * The heading is normalized to a value between 0° and 360° before invoking the `onHeadingChange` callback.
     * If the SVG reference is not available or the compass is connected (disabling interaction), the function will return early without firing the callback.
     */
    const handleUpdate = (x: number, y: number) => {
        if (!svgRef.current || isConnected || !onHeadingChange) return;
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const h = (Math.atan2(y - centerY, x - centerX) * 180 / Math.PI) + 90;
        onHeadingChange((Math.round(h) + 360) % 360);
    };

    /**
     * @description Sets up a drag gesture on the SVG element to allow users to change the heading by dragging.
     * @remarks
     * The `useDrag` hook from `@use-gesture/react` is used to handle pointer events.
     * The `handleUpdate` function is called with the pointer's screen coordinates whenever a drag event occurs.
     * The `event.stopPropagation()` call prevents the drag event from bubbling up to parent elements, 
     * ensuring that only the compass responds to the interaction.
     * The `threshold` option is set to 0 to allow immediate response to pointer movement, 
     * and `passive: false` is specified to allow calling `preventDefault()` if needed.
     * If the compass is connected (disabling interaction), dragging will have no effect.
     */
    useDrag(({ xy: [x, y], event }) => {
        if (event) event.stopPropagation();
        handleUpdate(x, y);
    }, {
        target: svgRef,
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
        >
            {!hideCardinalLabels && (
                <DirectionButtons cx={center} cy={center} radius={outerRadius} currentHeading={heading} onSelect={onHeadingChange} />
            )}
            <CompassRose cx={center} cy={center} radius={hideCardinalLabels ? outerRadius : innerRadius} heading={heading} hideCardinalLabels={hideCardinalLabels} />
        </Box>
    );
};
