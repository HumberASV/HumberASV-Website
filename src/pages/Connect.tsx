/**
 * @file Connect.tsx
 *
 * @description
 * Connect page — gate component that reads connection status from Redux and
 * shows a loading spinner, failure interstitial, or the live telemetry GUI.
 * Locks screen orientation to landscape on mobile for optimal viewing.
 *
 * @license MIT
 * @author Carson Fujita
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
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Typography, useTheme } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TelemetryGUI from "./Telemetry";
import { TelemetryThemeProvider } from "visualizer-components";
import type { RootState, AppDispatch } from "visualizer-components/store";
import { reconnect, startSimulation } from "visualizer-components/store";
import connectingSvg from "../assets/connecting.svg";

declare global {
    interface ScreenOrientation {
        lock(orientation: string): Promise<void>;
        unlock(): void;
    }
}

const ConnectInner: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const connectionStatus = useSelector((state: RootState) => state.connection.status);

    if (connectionStatus === "idle" || connectionStatus === "connecting") {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    backgroundColor: theme.palette.background.default,
                }}
            >
                {/* Self-animating porthole (carries its own "Connecting…" caption). */}
                <Box
                    component="img"
                    src={connectingSvg}
                    alt="Connecting to ASV"
                    sx={{ width: 160, height: 160 }}
                />
            </Box>
        );
    }

    if (connectionStatus === "failed") {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    gap: 3,
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <WarningAmberIcon
                    sx={{ fontSize: 48, color: theme.palette.telemetry.status.error }}
                />
                <Typography variant="h6">
                    Failed to connect to basestation
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => dispatch(reconnect())}
                    >
                        Reconnect
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ borderColor: theme.palette.telemetry.status.error, color: theme.palette.telemetry.status.error }}
                        onClick={() => dispatch(startSimulation())}
                    >
                        Use Simulation Data
                    </Button>
                </Box>
            </Box>
        );
    }

    return <TelemetryGUI />;
};

const Connect: React.FC = () => {
    useEffect(() => {
        const lockOrientation = async () => {
            if (window.innerWidth <= 768 && "orientation" in screen) {
                try {
                    if (typeof screen.orientation.lock === "function") {
                        await screen.orientation.lock("landscape");
                    }
                } catch {
                    console.warn("Could not lock orientation");
                }
            }
        };
        lockOrientation();
        return () => {
            try {
                if ("orientation" in screen && typeof screen.orientation.unlock === "function") {
                    screen.orientation.unlock();
                }
            } catch { /* ignore */ }
        };
    }, []);

    return (
        <TelemetryThemeProvider>
            <ConnectInner />
        </TelemetryThemeProvider>
    );
};

export default Connect;
