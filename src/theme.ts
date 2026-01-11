import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
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
      main: "#00435c", // Deep blue
    },
    secondary: {
      main: "#b8b5c0", // Muted lavender
    },
    accent: {
      main: "#D8FA07",
      light: "#E6FB4C",
      dark: "#C2E006",
      contrastText: "#002e2e",
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
