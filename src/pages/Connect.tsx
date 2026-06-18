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
import TelemetryForm from "../components/telemetry/TokenForm";
import TelemetryGUI from "../components/telemetry/Telemetry";
import TelemetryThemeProvider from "../providers/TelemetryThemeProvider";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { setToken } from "../store/slices/tokenSlice";
import { initConnection } from "../store/actions/connectionActions";
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
 * @returns the Connect component, which displays either the TelemetryForm for entering a token or the TelemetryGUI if a valid token is present and ready.
 * 
 * @remarks
 * - The component uses the useParams hook to retrieve the token from the URL parameters, allowing for direct linking to a specific telemetry session.
 * - It uses the useDispatch hook to dispatch the setToken action to the Redux store, storing the token for use in other components that need to access it.
 * - The component also manages a local state variable isTokenReady to track whether the token has been set and is ready for use, which allows for conditional rendering of the TelemetryGUI only when the token is ready.
 * - Additionally, it includes an effect to lock the screen orientation to landscape on mobile devices for an optimal telemetry viewing experience, and attempts to unlock it when leaving the page.
 */
const Connect: React.FC = () => {
  const { token } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  // Lock to landscape orientation on mobile devices
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
      // Attempt to unlock orientation when leaving the page
      try {
        if ("orientation" in screen) {
          if (typeof screen.orientation.unlock === "function") {
            screen.orientation.unlock();
          }
        }
      } catch {
        // Ignore errors on unlock
      }
    };
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      dispatch(initConnection());
    }
  }, [dispatch, token]);

  if (token) {
    return (
      <TelemetryThemeProvider>
        <TelemetryGUI />
      </TelemetryThemeProvider>
    );
  } else {
    return <TelemetryForm />;
  }
};

export default Connect;