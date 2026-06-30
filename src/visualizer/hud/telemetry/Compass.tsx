/**
 * @file Compass.tsx
 * @description Displays the ASV's current heading in a compass-like format.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { useSpring, useMotionValueEvent } from "framer-motion";
import type { RootState } from "../../../store/store";
import { useTheme } from "@mui/material/styles";

// SVG coordinate space for the tick strip.
// TICK_SPACING is in viewBox units; the spring drives the SVG `transform` attribute
// directly so there is no CSS-pixel / viewBox-unit mismatch.
const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 48;
const TICK_SPACING = 50; // 13 ticks visible across the 600-unit wide strip
const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 };

const wrapHeading = (heading: number) => {
	const wrapped = heading % 360;
	return wrapped < 0 ? wrapped + 360 : wrapped;
};

const formatHeadingLabel = (heading: number) => {
	const normalized = wrapHeading(heading);
	if (normalized === 0) return "N";
	if (normalized === 90) return "E";
	if (normalized === 180) return "S";
	if (normalized === 270) return "W";
	return String(Math.round(normalized));
};

export default function Compass() {
	const theme = useTheme();

	const taskData = useSelector((state: RootState) => state.telemetry.task.data);
	const heading = useSelector((state: RootState) => state.telemetry.asv.heading);
	const normalizedHeading = wrapHeading(heading);

	// Accumulated heading: lets the spring take the shortest arc across the 0°/360° boundary.
	const prevRef = useRef(heading);
	const accRef = useRef(heading);

	// Spring value is in SVG viewBox units (not CSS pixels).
	const springX = useSpring(VIEW_WIDTH / 2 - (heading / 15) * TICK_SPACING, SPRING_CONFIG);

	// Drive the SVG <g> transform attribute imperatively — React never owns this attribute
	// so reconciliation never resets it, and we avoid re-renders on every animation frame.
	const gRef = useRef<SVGGElement>(null);
	useMotionValueEvent(springX, "change", (x) => {
		gRef.current?.setAttribute("transform", `translate(${x}, 0)`);
	});

	// centerIdx drives which 25-tick window is rendered (updates every 15°).
	const [centerIdx, setCenterIdx] = useState(() => Math.round(heading / 15));

	useEffect(() => {
		const delta = ((heading - prevRef.current + 540) % 360) - 180;
		accRef.current += delta;
		prevRef.current = heading;
		springX.set(VIEW_WIDTH / 2 - (accRef.current / 15) * TICK_SPACING);
		const next = Math.round(accRef.current / 15);
		setCenterIdx((prev) => (prev !== next ? next : prev));
	}, [heading, springX]);

	// Sync the initial transform after mount (spring fires change events only on update).
	useEffect(() => {
		gRef.current?.setAttribute("transform", `translate(${springX.get()}, 0)`);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// 25 ticks keyed by stable window index (0-24), not by degree value.
	// When centerIdx shifts the update happens while the tick is off-screen.
	const ticks = useMemo(
		() =>
			Array.from({ length: 25 }, (_, i) => {
				const idx = centerIdx - 12 + i;
				const deg = ((idx * 15) % 360 + 360) % 360;
				const label = formatHeadingLabel(deg);
				const isCardinal = label === "N" || label === "E" || label === "S" || label === "W";
				const x = idx * TICK_SPACING;
				return (
					<g key={i}>
						<rect
							x={x - (isCardinal ? 1.5 : 1)}
							y={2}
							width={isCardinal ? 3 : 2}
							height={isCardinal ? 18 : 12}
							rx={1}
							fill={isCardinal ? "#f8fafc" : "rgba(255,255,255,0.5)"}
						/>
						<text
							x={x}
							y={VIEW_HEIGHT - 4}
							textAnchor="middle"
							fill={isCardinal ? "#ffffff" : "rgba(255,255,255,0.78)"}
							fontSize={isCardinal ? 20 : 12}
							fontWeight={isCardinal ? 800 : 600}
						>
							{label}
						</text>
					</g>
				);
			}),
		[centerIdx],
	);

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				minHeight: 0,
				backgroundColor: theme.palette.telemetry?.background.primary,
				border: theme.palette.telemetry?.border.light,
				borderRadius: 2,
				position: "relative",
				overflow: "hidden",
				padding: { xs: 0.5, sm: 0.5 },
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-start",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					inset: 0,
					background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.12))",
					pointerEvents: "none",
				}}
			/>

			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
					gap: { xs: 1, sm: 1.25 },
					px: { xs: 0, sm: 0.5 },
				}}
			>
				{/* SVG Tick Strip */}
				<Box
					component="svg"
					viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
					width="100%"
					preserveAspectRatio="none"
					sx={{
						display: "block",
						overflow: "hidden",
						height: { xs: 42, sm: VIEW_HEIGHT },
					}}
				>
					<g ref={gRef}>{ticks}</g>
				</Box>

				{/* Heading Display */}
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						right: "50%",
						transform: "translate(50%, -40%)",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Decorative caret + line */}
					<Box
						sx={{
							zIndex: 2,
							width: 0,
							height: 0,
							borderLeft: { xs: "7px solid transparent", sm: "8px solid transparent" },
							borderRight: { xs: "7px solid transparent", sm: "8px solid transparent" },
							borderBottom: { xs: "9px solid #f8fafc", sm: "10px solid #f8fafc" },
							filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
						}}
					>
						<Box
							sx={{
								zIndex: -100,
								width: "2px",
								height: "40px",
								backgroundColor: "rgba(222, 20, 20, 0.55)",
								transform: "translate(-1px,-100%)",
							}}
						/>
					</Box>

					<Box
						sx={{
							px: 1.25,
							py: 0.25,
							borderRadius: 1,
							padding: 0.5,
							backgroundColor: "rgba(17, 24, 39, 0.6)",
							border: "1px solid rgba(255,255,255,0.25)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backdropFilter: "blur(2px)",
							boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
							minWidth: { xs: 52, sm: 58 },
							minHeight: { xs: 24, sm: 28 },
						}}
					>
						<Typography
							variant="caption"
							sx={{
								color: theme.palette.primary.main,
								fontWeight: 800,
								fontSize: { xs: "30px", sm: "43px" },
								lineHeight: 1,
							}}
						>
							{Math.round(normalizedHeading)}
						</Typography>
					</Box>
				</Box>

				{/* Coordinates */}
				<Box
					sx={{
						paddingRight: "30%",
						paddingLeft: "30%",
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						gap: "4px",
					}}
				>
					<Typography variant="caption" sx={{ fontSize: "20px", color: theme.palette.telemetry?.text.primary }}>
						Lat: {taskData?.latitude.toFixed(4)}°
					</Typography>
					<Typography variant="caption" sx={{ fontSize: "20px", color: theme.palette.telemetry?.text.primary }}>
						Lon: {taskData?.longitude.toFixed(4)}°
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
