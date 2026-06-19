/**
 * @file Connect.tsx
 *
 * @description
 * This is the Connect page of the HumberASV website. It allows connection to the basestation with a token.
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
import TelemetryForm from "../components/telemetry/TokenForm";
import TelemetryGUI from "../components/telemetry/Telemetry";
import TelemetryThemeProvider from "../providers/TelemetryThemeProvider";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store";
import type { AppDispatch, RootState } from "../store";
import { setToken } from "../store/slices/tokenSlice";
import { initConnection, retryConnection } from "../store/actions/connectionActions";
import { getTokenFromCookie, setTokenCookie } from "../utils/cookie";

/**
 * Declares the global ScreenOrientation interface to include lock and unlock methods for TypeScript type checking.
 * This is necessary because the Screen Orientation API is not yet fully standardized
 * and may not be included in all TypeScript DOM libraries.
 * By declaring this interface, we can use screen.orientation.lock()
 * and screen.orientation.unlock() without TypeScript errors,
 * while still allowing for graceful degradation in browsers that do not support these methods.
 */
declare global {
    interface ScreenOrientation {
        lock(orientation: string): Promise<void>;
        unlock(): void;
    }
}

/**
 * Connect page component that handles the connection to the basestation using a token.
 *
 * @returns the Connect component, which displays either the TelemetryForm for entering a token
 * or the TelemetryGUI if a valid token is present (from the URL param, Redux state, or cookie).
 *
 * @remarks
 * - Token priority: URL param > cookie > Redux state (all end up in Redux).
 * - When a URL token is provided it is persisted to a 30-day cookie so future visits
 *   do not require re-entry.
 * - If a cookie token already exists on load, the component auto-connects without
 *   requiring the user to re-enter their token.
 * - The component locks screen orientation to landscape on mobile devices for optimal
 *   telemetry viewing and attempts to unlock it when the user leaves the page.
 */
const Connect: React.FC = () => {
    const { token: urlToken } = useParams<{ token?: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const reduxToken = useAppSelector((state: RootState) => state.token.token);

    // Lock to landscape orientation on mobile devices.
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

    // When a URL token arrives (direct link or share), persist it and force a reconnect
    // with the new token — overrides any previously stored cookie.
    useEffect(() => {
        if (!urlToken) return;
        setTokenCookie(urlToken);
        dispatch(setToken(urlToken));
        dispatch(retryConnection());
    }, [urlToken, dispatch]);

    // On first mount with no URL token: auto-connect using any cookie token.
    // The Redux initial state is already seeded from the cookie, so we only need
    // to kick off the connection — no need to re-dispatch setToken.
    useEffect(() => {
        if (urlToken) return; // The [urlToken] effect handles this case.
        const cookieToken = getTokenFromCookie();
        if (cookieToken) {
            dispatch(initConnection());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Intentionally runs once on mount.

    if (reduxToken) {
        return (
            <TelemetryThemeProvider>
                <TelemetryGUI />
            </TelemetryThemeProvider>
        );
    }
    return <TelemetryForm />;
};

export default Connect;
