import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeProvider from "./providers/ThemeProvider";
import { TelemetryProvider, configureTelemetryConnection } from "visualizer-components";

configureTelemetryConnection({
  httpBase: "http://192.168.137.1:8080",
  wsUrl: "ws://192.168.137.1:8080/telemetry",
  timeoutMs: 5000,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TelemetryProvider>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </TelemetryProvider>
    </ThemeProvider>
  </StrictMode>
);
