import { createTheme } from "@mui/material/styles";
import type { TaskStatus } from "./utils/types/taskTypes";

// Opacity value for status colors, 
// used to create lighter versions of the colors 
// for backgrounds or accents in the UI
const OPACITY = 0.2;

export const statusColors: Record<TaskStatus, string> = {
    "autonomous":      "#10b981",
    "remote":          "#3b82f6",
    "standby":         "#eab308",
    "out of control":  "#ef4444",
    "lost connection": "#9ca3af",
}

/**
 * Sets the secondary status colors by 
 * converting the hex color codes to RGBA
 *  format with the specified opacity.
 * This function iterates through the 
 * defined status colors, converts each hex 
 * color to its RGB components, and then constructs
 *  an RGBA color string using the OPACITY constant
 *  for the alpha channel.
 * The resulting RGBA colors are stored in a
 *  new object that is returned at the end of 
 * the function.
 * @returns the secondary status colors in RGBA format, which can be used for styling UI elements such as backgrounds or accents while maintaining visual consistency with the primary status colors.
 */
export const setColors = (): Record<TaskStatus, string> => {
  const colors = {} as Record<TaskStatus, string>;
  for (const status in statusColors) {
    const key = status as TaskStatus;
    const color = statusColors[key];
    const num = parseInt(color.slice(1), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    colors[key] = `rgba(${r}, ${g}, ${b}, ${OPACITY})`;
  }
  return colors;
}

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
    status: {
      primary: Record<TaskStatus, string>;
      secondary: Record<TaskStatus, string>;
    };
    compass: {
      intercardinal: string;
      north:     string;
      northEast: string;
      east:      string;
      southEast: string;
      south:     string;
      southWest: string;
      west:      string;
      northWest: string;
    };
    water: {
      surface: string;
      mid: string;
      deep: string;
      deeper: string;
      abyss: string;
      highlight: string;
    };
    scene: {
      skyLight: string;
      skyDark: string;
    };
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
    status?: {
      primary?: Record<TaskStatus, string>;
      secondary?: Record<TaskStatus, string>;
    };
    compass?: {
      intercardinal?: string;
      north?:     string;
      northEast?: string;
      east?:      string;
      southEast?: string;
      south?:     string;
      southWest?: string;
      west?:      string;
      northWest?: string;
    };
    water?: {
      surface?: string;
      mid?: string;
      deep?: string;
      deeper?: string;
      abyss?: string;
      highlight?: string;
    };
    scene?: {
      skyLight?: string;
      skyDark?: string;
    };
  }
}

// Extend the Button color options to include accent
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

export const theme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#002e2e",
    },
    background: {
      default: "#f5f5f5",
    },
    primary: {
      main: "#00435c",
    },
    secondary: {
      main: "#b8b5c0",
    },
    accent: {
      main: "#D8FA07",
      light: "#E6FB4C",
      dark: "#C2E006",
      contrastText: "#002e2e",
    },
    status: {
      primary: statusColors,
      secondary: setColors(),
    },
    compass: {
      intercardinal: "rgba(255,255,255,0.55)",
      north:     "#ff9999",
      northEast: "#ffb380",
      east:      "#ffe066",
      southEast: "#99ddaa",
      south:     "#77cc88",
      southWest: "#88ccee",
      west:      "#8899ee",
      northWest: "#cc99dd",
    },
    water: {
      surface:   "#0ea5e9",
      mid:       "#0284c7",
      deep:      "#0369a1",
      deeper:    "#075985",
      abyss:     "#0c4a6e",
      highlight: "#38bdf8",
    },
    scene: {
      skyLight: "#1e3a5f",
      skyDark:  "#0f172a",
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
    h1: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
    },
    h2: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
    },
    h3: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
    },
    h4: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
    },
    h5: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
    },
    h6: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
    },
    button: {
      fontFamily: `'Montserrat', 'Roboto', sans-serif`,
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
