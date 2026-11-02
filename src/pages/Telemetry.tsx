/**
 * @file Telemetry.tsx
 * 
 * @description
 * This component serves as the main telemetry dashboard for the ASV. 
 * It aggregates various telemetry components such as the map, speedometer, compass, task information, battery levels, signal strength, and a live log of telemetry events. 
 * The dashboard is designed to provide a comprehensive overview of the ASV's status and performance in real-time.
 * 
 * @author Carson Fujita
 * @license MIT
 * 
 * @remarks
 * - The component uses React and Material-UI for the user interface, and Redux for state management.
 * - It includes a background image stream from the ASV, overlaid with telemetry data and a collapsible log drawer at the bottom.
 * - The dashboard is responsive, with adjustments for mobile and desktop views.
 * - The border color of the dashboard changes based on the ASV's status to provide a quick visual indicator of its condition.
 * - Really just is a webpage
 * @example
 * ```tsx
 * <Telemetry />
 * ```
 */
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

import { Speedometer, Compass, Task, Batteries, TaskData, SignalStrength, SignalLog, ShipRudderVisualizerPanel, RadiusVisualizerPanel, TacticalMapPanel, StatusIndicator } from "visualizer-components";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "visualizer-components/store";
import { useEffect, useState } from "react";
import { Box, Collapse, useTheme, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { retryConnection, selectIndicatorStatus, selectLedColor } from "visualizer-components/store";
import MapPlaceholder from "../assets/Technical-Diff.png";

const Telemetry: React.FC = () => {
	const theme = useTheme();
	const connectionStatus = useSelector((state: RootState) => state.connection.status);
	const dispatch = useDispatch<AppDispatch>();
	const [drawerCollapsed, setDrawerCollapsed] = useState(false);
	const [taskDataExpanded, setTaskDataExpanded] = useState(true);
	const [tacticalMapOpen, setTacticalMapOpen] = useState(false);

	// Retry the real connection whenever it falls back to mock mode.
	useEffect(() => {
		if (connectionStatus !== "mock") return;

		const timer = setTimeout(() => {
			dispatch(retryConnection());
		}, 5000);

		return () => clearTimeout(timer);
	}, [connectionStatus, dispatch]);


	const imageStream = useSelector((state: RootState) => state.video.streamUrl || "");
	//const occupancyGrid = useSelector((state: RootState) => state.telemetry.map.occupancyGrid);
	//const navigationGrid = useSelector((state: RootState) => state.telemetry.map.navigationGrid);
	// The mast light drives the dashboard's border, not `planning.status`: the lamp is
	// wired straight to the e-stop and autonomy lines, so it reports what the boat is
	// actually doing even when the planner still claims to be autonomous. Drawn in the
	// lamp's own measured colour so the border and the mast agree, blink included.
	const status = useSelector(selectIndicatorStatus);
	const ledColor = useSelector(selectLedColor);

	// Palette covers mock/simulation, where no lamp is reporting; the generic accent
	// covers a theme without the telemetry status palette.
	const borderColor = ledColor
		?? theme.palette.status?.primary?.[status]
		?? theme.palette.primary.main;
	
	return (
		<Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "auto", backgroundColor: theme.palette.background.default }}>
			{/* Background image stream from the ASV */}
            <Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					overflow: "hidden",
					zIndex: 0,
				}}
			>
				<Box
					component="img"
					src={imageStream || MapPlaceholder}
					alt=""
					sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
				/>
			</Box>
            {/* Semi-transparent overlay to darken the background for better contrast
             Also primary wrapper for all telemetry elements, with a border color that reflects the ASV's status */}
			<Box
				sx={{
					position: "relative",
					zIndex: 1,
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					border: `4px solid ${borderColor}`,
					boxSizing: "border-box",
					backgroundColor: theme.palette.telemetry?.background.overlay,
					transition: "border-color 0.3s ease-out",
				}}
			>
				<Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, p: 0.75, alignItems: "stretch" }}>
					<Box sx={{ display: "flex", flexDirection: "column", order: { xs: 1, md: 1 }, gap: 0.5 }}>
						<Box sx={{
							padding: 1,
							background: theme.palette.telemetry?.background.primary, 
							borderRadius: 2,
							}}
						>
							<StatusIndicator />
						</Box>
						<Speedometer />
					</Box>
                    <Box sx={{ flex: 0, order: { xs: 1, md: 2 }, minWidth: "10%" }}>
                        <Task />
                    </Box>
					<Box sx={{ flex: 1, minWidth: 0, order: { xs: 1, md: 2 }, flexGrow: 1 }}>
						<Compass />
					</Box>
					<Box sx={{ 
                        order: { xs: 1, md: 3 }, 
                        backgroundColor: theme.palette.telemetry?.background.primary,
                        border: `1px solid ${theme.palette.telemetry?.border.light}`,
                        borderRadius: 2,
                        padding: 1,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                }}>
                        <SignalStrength size={15} />
						<Batteries />
					</Box>
				</Box>

                {/* Mobile view - stack the speedometer and cog heading vertically, and hide the batteries */}
				<Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.5, px: 0.5, pt: 0.5, pb: 0.25, alignItems: "stretch" }}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Compass />
					</Box>
				</Box>

				<Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.5, px: 1, pb: 0.25, alignItems: "stretch"}}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Speedometer />
					</Box>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Batteries />
					</Box>
				</Box>

				{/* Center spacer pushes the drawer to the bottom */}
                <Box sx={{ flex: '0 0 auto', minWidth: 0, px: { xs: 0.5, md: 0.5 }, pt: 0.25, pb: 0.25, overflow: "hidden" }}>
				</Box>

				<Box sx={{ display: "flex", flexDirection: "row", alignItems: "end", flex: 1, minHeight: 0, overflow: 'hidden' }}>
					
					<Box sx={{flexShrink: 0,}}>
						<ShipRudderVisualizerPanel maxRudderDeg={90} />
					</Box>

					{/* Task data panel. The card, its title and the fold live here rather than
					    inside <TaskData /> so the page decides how much room the readout gets —
					    collapsed it shrinks to the header strip and gives the row back to the
					    rudder and radius panels beside it. */}
					<Box
						sx={{
							flex: 1,
							minWidth: 0,
							minHeight: 0,
							height: taskDataExpanded ? "100%" : "3rem",
							backgroundColor: theme.palette.telemetry?.background.primary,
							border: `2px solid ${theme.palette.telemetry?.border.light}`,
							borderRadius: "8px",
							padding: "12px",
							display: "flex",
							flexDirection: "column",
							gap: "6px",
							overflow: "hidden",
						}}
					>
						{/* Header stays put when collapsed — it carries the panel's title, so folding
						    it away with the body would leave an anonymous strip. Rendered as a button
						    so the drawer is reachable by keyboard, which a click-handler on a Box is not. */}
						<Box
							component="button"
							type="button"
							onClick={() => setTaskDataExpanded((value) => !value)}
							aria-expanded={taskDataExpanded}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								flexShrink: 0,
								width: "100%",
								padding: 0,
								background: "none",
								border: "none",
								font: "inherit",
								textAlign: "left",
								cursor: "pointer",
								color: theme.palette.telemetry?.text.primary,
							}}
						>
							<Typography
								variant="caption"
								sx={{ flex: 1, fontWeight: "bold", color: "inherit", fontSize: "14px", textTransform: "uppercase" }}
							>
								Task Data
							</Typography>
							{/* Chevron points the way the body will move: down to reveal, up to fold away. */}
							{taskDataExpanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
						</Box>

						{/* `unmountOnExit` keeps the collapsed panel from paying for rows nobody can see —
						    that list re-renders off a ~7 Hz telemetry feed. Both the Collapse and its inner
						    wrapper need the flex/min-height treatment, otherwise the scroll area resolves
						    against its content height and the panel grows past its container instead of
						    scrolling inside it. */}
						<Collapse
							in={taskDataExpanded}
							timeout="auto"
							unmountOnExit
							sx={{ flex: 1, minHeight: 0, "& .MuiCollapse-wrapperInner": { display: "flex", flexDirection: "column" } }}
						>
							<TaskData />
						</Collapse>
					</Box>

					<Box sx={{flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
						<RadiusVisualizerPanel onClick={() => setTacticalMapOpen(true)} />
					</Box>
				</Box>



				{/* Bottom drawer pinned to the bottom of the dashboard */}
				<Box sx={{ flex: "0 0 auto", backgroundColor: theme.palette.telemetry?.background.primary, textAlign: "center", fontSize: "12px", color: borderColor }}>
					<Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden", alignItems: "stretch" }}>
						<Box
							sx={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								px: 1,
								py: 0.5,
								cursor: "pointer",
								userSelect: "none",
								backgroundColor: theme.palette.telemetry?.background.header,
								borderBottom: drawerCollapsed ? "none" : `1px solid ${theme.palette.telemetry?.border.lighter}`,
								flexShrink: 0,
							}}
							onClick={() => setDrawerCollapsed((value) => !value)}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Box sx={{ width: 10, height: 10, borderRadius: "999px", backgroundColor: borderColor }} />
								<Typography sx={{ fontSize: 12, fontWeight: 700, color: theme.palette.text.primary }}>
									Live Log Laugh
								</Typography>
							</Box>
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: theme.palette.telemetry?.text.secondary }}>
								<Box sx={{ fontSize: 11, fontWeight: 700 }}>{drawerCollapsed ? "Expand" : "Collapse"}</Box>
								{drawerCollapsed ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
							</Box>
						</Box>
						{!drawerCollapsed && <SignalLog width="100%" height="100%" />}
					</Box>
				</Box>
				<TacticalMapPanel open={tacticalMapOpen} onClose={() => setTacticalMapOpen(false)} />
			</Box>
		</Box>
	);
};

export default Telemetry;
