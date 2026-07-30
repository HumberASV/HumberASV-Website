import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeProvider from "./providers/ThemeProvider";
import TelemetryProvider from "./providers/TelemetryProvider";
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
