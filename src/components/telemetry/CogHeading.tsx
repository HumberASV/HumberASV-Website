/*

MIT License

Copyright (c) 2026 HumberASV
Copyright (c) 2026 Carson Fujita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import type { RootState } from "../../utils/store";
import { useTheme } from "@mui/material/styles";

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

export default function CogHeading() {
	const theme = useTheme();
	const heading = useSelector((state: RootState) => state.telemetry.heading);
	const [displayHeading, setDisplayHeading] = useState(heading);

	useEffect(() => {
		setDisplayHeading(heading);
	}, [heading]);

	const normalizedHeading = wrapHeading(displayHeading);
	const nearestTick = Math.round(normalizedHeading / 15) * 15;
	const offsetDegrees = normalizedHeading - nearestTick;
	const stepShift = offsetDegrees / 15;

	const tickValues = useMemo(
		() => Array.from({ length: 13 }, (_, index) => nearestTick - 90 + index * 15),
		[nearestTick],
	);

	const stepWidth = "clamp(40px, 6vw, 60px)";
	const stepGap = "clamp(6px, 0.9vw, 12px)";
	const trackShift = `calc(${stepShift} * -1 * (${stepWidth} + ${stepGap}))`;
	const taskData = useSelector((state: RootState) => state.telemetry.taskData);
	
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

			{/* Main Content */}
			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
					gap: { xs: 1, sm: 1.25 },
					px: { xs: 0, sm: 0.5 },
				}}>
				{/* Rotating Tick Marks */}
				<Box
					sx={{
						position: "relative",
						height: { xs: 42, sm: 48 },
						overflow: "hidden",
						"--step-width": stepWidth,
						"--step-gap": stepGap,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "center",
							gap: "var(--step-gap)",
							width: "max-content",
							minWidth: "100%",
							paddingInline: "calc(var(--step-width) / 2)",
							transform: `translateX(${trackShift})`,
							transition: "transform 220ms ease-out",
						}}
					>
						{tickValues.map((value) => {
							const label = formatHeadingLabel(value);
							const isCardinal = label === "N" || label === "E" || label === "S" || label === "W";

							return (
								<Box
									key={value}
									sx={{
										width: "var(--step-width)",
										minWidth: 0,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 0.15,
									}}
								>
									<Box
										sx={{
											width: { xs: 2, sm: 3 },
											height: isCardinal ? { xs: 16, sm: 18 } : { xs: 10, sm: 12 },
											borderRadius: 999,
											backgroundColor: isCardinal ? "#f8fafc" : "rgba(255,255,255,0.5)",
											boxShadow: isCardinal ? "0 0 0 1px rgba(0,0,0,0.22)" : "none",
										}}
									/>
									<Typography
										variant="caption"
										sx={{
											color: isCardinal ? "#ffffff" : "rgba(255,255,255,0.78)",
											fontSize: isCardinal ? "clamp(16px, 2.1vw, 20px)" : "clamp(10px, 1.2vw, 12px)",
											fontWeight: isCardinal ? 800 : 600,
											lineHeight: 1,
											whiteSpace: "nowrap",
											textShadow: "0 1px 2px rgba(0,0,0,0.45)",
										}}
									>
										{label}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Box>
				{/* Heading Display  at center*/}	
				<Box sx={{ 
					position: "absolute", 
					top: "50%",
					right: "50%",
					transform: "translate(50%, -40%)",

					display: "flex", 
					flexDirection: "column", 
					alignItems: "center", 
				}}>
					

					{/* Decorative Cog */}
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
						{/* line up */}
						<Box
							sx={{
								zIndex: -100,
								width: "2px",
								height: "40px",
								backgroundColor: "rgba(222, 20, 20, 0.55)",
								transform: "translate(-1px,-100%)",
							}} />
						
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
							sx={{ color: theme.palette.primary.main, fontWeight: 800, fontSize: { xs: "30px", sm: "43px" }, lineHeight: 1 }}
						>
							{Math.round(normalizedHeading)}
						</Typography>

						
					</Box>
					
				</Box>
				{/* Coordinates */}
				<Box sx={{paddingRight: "30%", paddingLeft: "30%", display: "flex",  flexDirection: "row", justifyContent: "space-between", gap: "4px"}}>
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
