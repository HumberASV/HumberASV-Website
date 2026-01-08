// src\components\layout\home\HeroSection.tsx
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useThemeContext } from "../../../hooks/useThemeContext";
import heroImage from "../../../assets/Website Renders.14.jpg";

const HeroSection = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();

  // Water-themed gradient overlay based on current theme
  const gradientOverlay =
    mode === "light"
      ? "linear-gradient(135deg, rgba(0, 67, 92, 0.75) 0%, rgba(0, 102, 135, 0.65) 50%, rgba(0, 136, 167, 0.45) 100%)"
      : "linear-gradient(135deg, rgba(10, 46, 66, 0.85) 0%, rgba(13, 58, 84, 0.75) 50%, rgba(16, 74, 104, 0.55) 100%)";

  // Water wave SVG for the bottom of the hero
  const WaterWaveDivider = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        overflow: "hidden",
        lineHeight: 0,
        transform: "rotate(180deg)",
        zIndex: 1,
      }}
    >
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: 60,
          display: "block",
        }}
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={theme.palette.background.default}
        />
      </svg>
    </Box>
  );

  // Floating bubbles animation
  const FloatingBubbles = () => (
    <>
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            bottom: "-20px",
            backgroundColor: alpha(
              mode === "light" ? "#a3e7ff" : "#d1ffff",
              0.4
            ),
            borderRadius: "50%",
            animation: `floatUp ${15 + (i % 10)}s infinite ease-in-out`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.4 + (i % 3) * 0.2,
            width: 6 + (i % 12),
            height: 6 + (i % 12),
            left: `${8 + (i % 85)}%`,
            zIndex: 1,
            "@keyframes floatUp": {
              "0%": {
                transform: "translateY(0) rotate(0deg)",
                opacity: 0.4 + (i % 3) * 0.2,
              },
              "100%": {
                transform: "translateY(-100vh) rotate(360deg)",
                opacity: 0,
              },
            },
          }}
        />
      ))}
    </>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "80vh", md: "90vh" },
        position: "relative",
        color: "white",
        py: { xs: 10, md: 15 },
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Hero Image Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradientOverlay,
          zIndex: 1,
        }}
      />

      {/* Floating bubbles */}
      <FloatingBubbles />

      {/* Water wave divider at bottom */}
      <WaterWaveDivider />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
        {/* Humber College Badge */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              color: theme.palette.accent?.main || "#00d4ff",
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 0.5,
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            HUMBER COLLEGE
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 3,
              backgroundColor: theme.palette.accent?.main || "#00d4ff",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Main Title */}
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.8rem", sm: "4rem", md: "5rem" },
            mb: 3,
            textShadow: `0 4px 20px ${alpha("#000", 0.7)}`,
            background: `linear-gradient(135deg, ${
              theme.palette.common.white
            } 0%, ${alpha(theme.palette.common.white, 0.95)} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            zIndex: 4,
          }}
        >
          Roboboat Team
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h4"
          component="p"
          gutterBottom
          sx={{
            mb: 5,
            opacity: 0.97,
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
            fontWeight: 400,
            maxWidth: "800px",
            mx: "auto",
            textShadow: `0 3px 12px ${alpha("#000", 0.6)}`,
            zIndex: 4,
          }}
        >
          Navigating the future of autonomous maritime innovation
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            mt: 4,
            mb: 8,
            zIndex: 4,
          }}
        >
          <Button
            variant="contained"
            color="accent"
            size="large"
            component={RouterLink}
            to="/vehicle"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              borderRadius: 3,
              fontWeight: 700,
              boxShadow: `0 8px 32px ${alpha(
                theme.palette.accent?.main || "#00d4ff",
                0.4
              )}`,
              backdropFilter: "blur(10px)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 12px 40px ${alpha(
                  theme.palette.accent?.main || "#00d4ff",
                  0.6
                )}`,
                backgroundColor: theme.palette.accent?.main || "#00d4ff",
              },
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Explore Our Vessel
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={RouterLink}
            to="/team"
            sx={{
              px: 5,
              py: 1.75,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              borderRadius: 3,
              fontWeight: 700,
              borderWidth: 2,
              backdropFilter: "blur(10px)",
              "&:hover": {
                borderWidth: 2,
                backgroundColor: alpha("#fff", 0.2),
                transform: "translateY(-4px)",
                boxShadow: `0 8px 32px ${alpha("#fff", 0.2)}`,
              },
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Meet The Crew
          </Button>
        </Box>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 50,
            left: "50%",
            transform: "translateX(-50%)",
            display: { xs: "none", md: "block" },
            zIndex: 4,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 52,
              border: `2px solid ${alpha("#fff", 0.7)}`,
              borderRadius: 18,
              position: "relative",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 12,
                backgroundColor: "#fff",
                borderRadius: 3,
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                animation: "scroll 2s infinite",
                "@keyframes scroll": {
                  "0%": { opacity: 1, top: 12 },
                  "100%": { opacity: 0, top: 32 },
                },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
