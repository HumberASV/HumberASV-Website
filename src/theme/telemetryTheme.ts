import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    telemetry: {
      status: {
        online: string;
        warning: string;
        error: string;
        offline: string;
      };
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
        header: string;
        overlay: string;
        headerAlt: string;
        empty: string;
      };
      border: {
        light: string;
        lighter: string;
        lightest: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
      accent: string;
    };
    map: {
      empty: string;
      occupied: string;
      path: string;
      current: string;
      objective: string;
      error: string;
      currentIcon: string;
      objectiveIcon: string;
      errorIcon: string;
      courseIcon: string;
      course: string;
      plan: string;
    };
  }
  interface PaletteOptions {
    telemetry?: {
      status?: {
        online?: string;
        warning?: string;
        error?: string;
        offline?: string;
      };
      background?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
        header?: string;
        overlay?: string;
        headerAlt?: string;
        empty?: string;
      };
      border?: {
        light?: string;
        lighter?: string;
        lightest?: string;
      };
      text?: {
        primary?: string;
        secondary?: string;
      };
      accent?: string;
    };
    map?: {
      empty?: string;
      occupied?: string;
      path?: string;
      current?: string;
      objective?: string;
      error?: string;
      currentIcon?: string;
      objectiveIcon?: string;
      errorIcon?: string;
      courseIcon?: string;
      course?: string;
      plan?: string;
    };
  }
}

export const telemetryTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "rgba(0, 0, 0, 0.35)",
    },
    primary: {
      main: "#00c9ff",
      light: "#33d9ff",
      dark: "#0099cc",
      contrastText: "#000000",
    },
    secondary: {
      main: "#00ff88",
      light: "#33ffaa",
      dark: "#00cc6b",
      contrastText: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e5e7eb",
      disabled: "#9ca3af",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    telemetry: {
      status: {
        online: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        offline: "#6b7280",
      },
      background: {
        primary: "rgba(0, 0, 0, 0.5)",
        secondary: "rgba(0, 0, 0, 0.35)",
        tertiary: "rgba(255, 255, 255, 0.02)",
        header: "rgba(255, 255, 255, 0.04)",
        overlay: "rgba(0, 0, 0, 0.3)",
        headerAlt: "rgba(0, 0, 0, 0.5)",
        empty: "rgba(255, 255, 255, 0)",
      },
      border: {
        light: "rgba(255, 255, 255, 0.08)",
        lighter: "rgba(255, 255, 255, 0.05)",
        lightest: "rgba(255, 255, 255, 0)",
      },
      text: {
        primary: "#ffffff",
        secondary: "#e5e7eb",
      },
      accent: "#fbbf24",
    },
    map: {
      empty: "#1d4ed8",
      occupied: "#ef4444",
      path: "#1e3a8a",
      current: "#10b981",
      objective: "#fbbf24",
      error: "#ef4444",
      currentIcon: "#6ee7b7",
      objectiveIcon: "#fcd34d",
      errorIcon: "#f87171",
      courseIcon: "#fbbf24",
      course: "#1e3a8a",
      plan: "#8b5cf6",
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
    h1: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 700,
      color: "#ffffff",
    },
    h2: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 700,
      color: "#ffffff",
    },
    h3: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
      color: "#ffffff",
    },
    h4: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
      color: "#ffffff",
    },
    h5: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
      color: "#e5e7eb",
    },
    h6: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
      color: "#e5e7eb",
    },
    body1: {
      color: "#ffffff",
    },
    body2: {
      color: "#e5e7eb",
    },
    button: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      color: "#9ca3af",
      fontSize: "0.75rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "0 4px 12px rgba(0, 201, 255, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
});
