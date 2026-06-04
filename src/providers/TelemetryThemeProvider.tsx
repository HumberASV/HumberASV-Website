/**
 * @file TelemetryThemeProvider.tsx
 * 
 * @description
 * This file defines the TelemetryThemeProvider component, which is responsible for providing a custom Material-UI theme to the telemetry-related components in the application. 
 * It uses the ThemeProvider component from Material-UI to wrap its children with the custom telemetry theme defined in the telemetryTheme file.
 *
 * @author Carson Fujita
 * @license MIT
 * 
 * @remarks
 *  - Specifically for telemetry-related components
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

import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { telemetryTheme } from "../theme/telemetryTheme";

/**
 * the provider component for the telemetry page, 
 * which wraps its children with the Material-UI ThemeProvider to give them access to the custom telemetry theme.
 * @param children the child components that will have access to the custom telemetry theme.
 * @returns the TelemetryThemeProvider component that wraps its children with the Material-UI ThemeProvider,
 */
const TelemetryThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MuiThemeProvider theme={telemetryTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default TelemetryThemeProvider;
