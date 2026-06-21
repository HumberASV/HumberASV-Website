/**
 * @file Connect.tsx
 *
 * @description
 * Connect page — renders the live telemetry GUI. Locks screen orientation to
 * landscape on mobile for optimal viewing.
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
import TelemetryGUI from "../components/telemetry/Telemetry";
import TelemetryThemeProvider from "../providers/TelemetryThemeProvider";

declare global {
    interface ScreenOrientation {
        lock(orientation: string): Promise<void>;
        unlock(): void;
    }
}

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
            <TelemetryGUI />
        </TelemetryThemeProvider>
    );
};

export default Connect;
