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
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { startMockTelemetryUpdates, stopMockTelemetryUpdates } from "../../utils/store/actions/fetchTelemetry";
import { getStatusBorderColor } from "../../utils/statusColors";

const Telemetry: React.FC = () => {
	const token = useSelector((state: RootState) => state.telemetry.token);
	const imageStream = useSelector((state: RootState) => state.telemetry.imageStream);
	const occupancyGrid = useSelector((state: RootState) => state.telemetry.occupancyGrid);
	const navigationGrid = useSelector((state: RootState) => state.telemetry.navigationGrid);
	const status = useSelector((state: RootState) => state.telemetry.status);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const hasStartedMockTelemetry = useRef(false);

	useEffect(() => {
		if (!token) {
			// If no token is set, redirect to the token form
			console.log("No token found, redirecting to token form...");
			navigate("/connect");
			return;
		}
		if (!hasStartedMockTelemetry.current) {
			//TODO(Carson): Validate token with basestation
			// If token is valid, start telemetry provider
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
		} else {
			return <div>Loading telemetry...</div>;
		}
	};

	const borderColor = getStatusBorderColor(status);

	return (
		<Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#000" }}>
			{/* Background Image Stream */}
			<Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: imageStream, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />

			{/* Main Dashboard Container with Status Border */}
			<Box sx={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", border: `4px solid ${borderColor}`, boxSizing: "border-box", backgroundColor: "rgba(0, 0, 0, 0.3)", transition: "border-color 0.3s ease-out" }}>

				{/* Top Row: Speedometer | Heading (expands) | Batteries */}
				<Box sx={{ display: "flex", gap: 2, padding: 2, alignItems: "stretch", backgroundColor: "rgba(0,0,0,0.5)" }}>
					<Box sx={{ width: 200 }}>
						<Speedometer />
					</Box>

					<Box sx={{ flex: 1, minWidth: 220 }}>
						<CogHeading />
					</Box>

					<Box sx={{ width: 280 }}>
						<Batteries />
					</Box>
				</Box>

				{/* Second Row: Task (heading size) | Task Data */}
				<Box sx={{ display: "flex", gap: 2, paddingX: 2, paddingBottom: 1, alignItems: "center" }}>
					<Box sx={{ flex: 1 }}>
						<Box sx={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
							<Task />
						</Box>
					</Box>
					<Box sx={{ width: 260 }}>
						<TaskData />
					</Box>
				</Box>

				{/* Large Center Space */}
				<Box sx={{ flex: 1, padding: 2, display: "flex", flexDirection: "column", gap: 2, overflow: "hidden" }}>
					<Box sx={{ flex: 1, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
						{/* Placeholder for large visual (e.g. live camera / route plot) */}
					</Box>

					{/* Bottom Row: PowerRudder | Log+Signal | Map */}
					<Box sx={{ display: "flex", gap: 2 }}>
						<Box sx={{ width: 260 }}>
							<PowerRudderPanel />
						</Box>

						<Box sx={{ flex: 1 }}>
							<Box sx={{ height: 300 }}>
								<SignalLog />
							</Box>
						</Box>

						<Box sx={{ width: 340 }}>
							{renderMap()}
						</Box>
					</Box>
				</Box>

				{/* Bottom Panel - Optional Status Bar */}
				<Box
					sx={{
						flex: "0 0 auto",
						padding: "8px",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						textAlign: "center",
						fontSize: "12px",
						color: borderColor,
					}}
				>
					Status: {status || "Unknown"}
				</Box>
			</Box>
		</Box>
	);
};

export default Telemetry;