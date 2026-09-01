/**
 * @file ThemeProvider.tsx
 * 
 * @description
 * This file defines the ThemeProvider component, which is responsible for providing a custom Material-UI theme to the entire application. 
 * It uses the ThemeProvider component from Material-UI to wrap its children with the custom theme defined in the theme file.
 *
 * @license MIT
 */
import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "visualizer-components/theme";

/**
 * Provider component that wraps its children with the Material-UI ThemeProvider to give them access to the custom theme.
 * @param children the child components that will have access to the custom theme.
 * @returns the ThemeProvider component that wraps its children with the Material-UI ThemeProvider, 
 *  allowing them to access the custom theme and apply consistent styling across the application.
 */
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
