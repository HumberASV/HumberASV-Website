import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { useLoadingStore } from "../../store/useLoadingStore";
import { LoadingScene3D } from "../three/LoadingScene3D";

export const LoadingPage: React.FC = () => {
  const { loading } = useLoadingStore();
  const theme = useTheme();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #00435c 0%, #006687 50%, #0088a7 100%)"
            : "linear-gradient(180deg, #0a2e42 0%, #0d3a54 50%, #104a68 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >
      {/* Three.js Loading Animation - Full screen underwater */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.9,
        }}
      >
        <LoadingScene3D />
      </Box>

      {/* Loading Content - Positioned with depth */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: theme.palette.common.white,
          width: "100%",
          maxWidth: "500px",
          px: 3,
          mb: 8,
        }}
      >
        {/* Humber College Header with depth effect */}
        <Box
          sx={{
            mb: 4,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -10,
              left: -20,
              right: -20,
              bottom: -10,
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2,
              filter: "blur(10px)",
              zIndex: -1,
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontFamily: "'Montserrat', sans-serif",
              color: theme.palette.common.white,
              mb: 1,
              textShadow: `0 2px 8px ${alpha("#000", 0.5)}`,
              letterSpacing: "0.05em",
            }}
          >
            HUMBER COLLEGE
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontFamily: "'Montserrat', sans-serif",
              color: theme.palette.accent.main,
              fontSize: "1.4rem",
              textShadow: `0 2px 6px ${alpha("#000", 0.4)}`,
              letterSpacing: "0.03em",
              opacity: 0.9,
            }}
          >
            SeaForge Roboboat
          </Typography>
        </Box>

        {/* Loading Progress - Subtle and smooth */}
        <Box sx={{ width: "100%", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: "0.8rem",
                color: alpha(theme.palette.common.white, 0.8),
                fontFamily: "'Roboto', sans-serif",
                letterSpacing: "0.03em",
              }}
            >
              Initializing marine systems
            </Typography>
          </Box>

          <LinearProgress
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.accent.main,
                borderRadius: 2,
                transition: "transform 0.4s ease",
              },
            }}
          />
        </Box>

        {/* Subtle Status Message */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 400,
            fontSize: "0.75rem",
            color: alpha(theme.palette.common.white, 0.6),
            fontFamily: "'Roboto', sans-serif",
            fontStyle: "italic",
            letterSpacing: "0.02em",
          }}
        >
          Preparing autonomous navigation...
        </Typography>
      </Box>

      {/* Subtle water surface at the very top */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          opacity: 0.3,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: 30,
            display: "block",
            transform: "rotate(180deg)",
          }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill={alpha(theme.palette.common.white, 0.1)}
          />
        </svg>
      </Box>
    </Box>
  );
};
