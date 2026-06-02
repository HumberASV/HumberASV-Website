/*

This is the Connect page of the HumberASV website.
It allows connection to the basestation with a token.


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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../utils/store/telemetrySlice";

declare global {
  interface ScreenOrientation {
    lock(orientation: string): Promise<void>;
    unlock(): void;
  }
}


const Connect: React.FC = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [isTokenReady, setIsTokenReady] = useState(false);

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
      setIsTokenReady(true);
    } else {
      setIsTokenReady(false);
    }
  }, [dispatch, token]);


  if (token) {
    return isTokenReady ? (
      <TelemetryThemeProvider>
        <TelemetryGUI />
      </TelemetryThemeProvider>
    ) : (
      <div>Preparing telemetry...</div>
    );
  } else {
    return <TelemetryForm />;
  }
};

export default Connect;