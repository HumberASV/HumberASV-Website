/*

connect/$token page for the HumberASV website.

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

import { Map, Speedometer, CogHeading, Task, Batteries, TaskData, PowerRudderPanel } from ".";
import SignalLog from "./SignalLog";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../utils/store";
import type { AppDispatch } from "../../utils/store";
import { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { startMockTelemetryUpdates, stopMockTelemetryUpdates } from "../../utils/store/actions/fetchTelemetry";
import { getStatusBorderColor } from "../../utils/statusColors";
import MapPlaceholder from "../../assets/Web-Ian Cameron - Team Principal.jpg";
const Telemetry: React.FC = () => {
	const theme = useTheme();
	const token = useSelector((state: RootState) => state.telemetry.token);
	const imageStream = useSelector((state: RootState) => state.telemetry.imageStream);
	const occupancyGrid = useSelector((state: RootState) => state.telemetry.occupancyGrid);
	const navigationGrid = useSelector((state: RootState) => state.telemetry.navigationGrid);
	const status = useSelector((state: RootState) => state.telemetry.status);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const hasStartedMockTelemetry = useRef(false);
	const [drawerCollapsed, setDrawerCollapsed] = useState(false);

	useEffect(() => {
		if (!token) {
			console.log("No token found, redirecting to token form...");
			navigate("/connect");
			return;
		}

		if (!hasStartedMockTelemetry.current) {
			console.log("Valid token found, starting telemetry provider...");
			hasStartedMockTelemetry.current = true;
			dispatch(startMockTelemetryUpdates());
		}

		return () => {
			dispatch(stopMockTelemetryUpdates());
			hasStartedMockTelemetry.current = false;
		};
	}, [token, navigate, dispatch]);


	const hasGridData = occupancyGrid.length > 0 || navigationGrid.length > 0;

	const renderMap = () => {
		if (hasGridData) {
			return <Map />;
		}

		return <div>Loading telemetry...</div>;
	};

	const borderColor = getStatusBorderColor(status);

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
					backgroundImage: `url(${imageStream || MapPlaceholder})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					zIndex: 0,
				}}
			/>
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
					<Box sx={{ order: { xs: 1, md: 1 } }}>
						<Speedometer />
					</Box>
					<Box sx={{ flex: 1, minWidth: 0, order: { xs: 1, md: 2 } }}>
						<CogHeading />
					</Box>
					<Box sx={{ order: { xs: 1, md: 3 } }}>
						<Batteries />
					</Box>
				</Box>

                {/* Mobile view - stack the speedometer and cog heading vertically, and hide the batteries */}
				<Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.5, px: 0.5, pt: 0.5, pb: 0.25, alignItems: "stretch" }}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<CogHeading />
					</Box>
				</Box>

				<Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.5, px: 0.5, pb: 0.25, alignItems: "stretch"}}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Speedometer />
					</Box>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Batteries />
					</Box>
				</Box>

				<Box sx={{ 
                    minHeight: { xs: 32, md: "auto" },
                    display: "flex", 
                    gap: 1, 
                    px: 1, 
                    pb: 0, 
                    alignItems: "center", 
                                
                    }}>
					{/*spacer*/}
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ flex: 1 }}>
                        <Task />
                    </Box>
                    <Box sx={{ flex: 1 }} >
						<TaskData />
					</Box>
				</Box>

				{/* Center spacer pushes the drawer to the bottom */}
				<Box sx={{ flex: 1, minWidth: 0, px: { xs: 0.5, md: 1.5 }, pt: 0.25, pb: 0.25, overflow: "hidden" }}>
					<Box sx={{ height: { xs: "1vh", md: "6vh" }}} />
				</Box>

                <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box sx={{ width: { xs: "100%", md: 260 }, flexShrink: 0 }}>
                    <PowerRudderPanel />
                </Box>

                <Box sx={{ width: { xs: "100%", md: 250 }, flexShrink: 0 }}>
                    {renderMap()}
                </Box>
                </Box>

				{/* Bottom drawer pinned to the bottom of the dashboard */}
				<Box sx={{ px: { xs: 0.5, md: 1.5 }, pb: { xs: 0.5, md: 1.25 } }}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							minHeight: drawerCollapsed ? { xs: 56, md: 56 } : { xs: "48vh", md: 360 },
							height: drawerCollapsed ? { xs: 56, md: 56 } : { xs: "48vh", md: 360 },
							maxHeight: drawerCollapsed ? { xs: 56, md: 56 } : { xs: "48vh", md: 360 },
							overflow: "hidden",
							alignItems: "stretch",
							borderRadius: 2,
							border: `1px solid ${theme.palette.telemetry?.border.light}`,
							backgroundColor: theme.palette.telemetry?.background.secondary,
						}}
					>
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
								<Box sx={{ color: theme.palette.telemetry?.text.secondary, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
									Telemetry Drawer
								</Box>
							</Box>
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: theme.palette.telemetry?.text.secondary }}>
								<Box sx={{ fontSize: 11, fontWeight: 700 }}>{drawerCollapsed ? "Expand" : "Collapse"}</Box>
								
                                {drawerCollapsed ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
							</Box>
						</Box>

						{!drawerCollapsed ? (
							<Box
								sx={{
									display: "flex",
									flexDirection: { xs: "column", md: "row" },
									gap: 0.5,
									minHeight: { xs: "calc(48vh - 48px)", md: 360 },
									height: { xs: "calc(48vh - 48px)", md: 360 },
									maxHeight: { xs: "calc(48vh - 48px)", md: 360 },
									overflow: "hidden",
									alignItems: "stretch",
									flex: 1,
									minWidth: 0,
								}}
							>
								

								<Box sx={{ width: { xs: "100%", md: "auto" }, flex: { xs: "1 1 auto", md: 1.6 }, minWidth: 0, order: { xs: 3, md: 2 } }}>
									<Box sx={{ height: { xs: 140, md: 360 }, overflow: "auto", pr: 0.5 }}>
										<SignalLog />
									</Box>
								</Box>
							</Box>
						) : null}
					</Box>
				</Box>

				<Box sx={{ flex: "0 0 auto", p: 1, backgroundColor: theme.palette.telemetry?.background.primary, textAlign: "center", fontSize: "12px", color: borderColor }}>
					Status: {status || "Unknown"}
				</Box>
			</Box>
		</Box>
	);
};

export default Telemetry;
