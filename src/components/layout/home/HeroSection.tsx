// src/components/layout/home/HeroSection.tsx
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import heroImage from "../../../assets/LoonE_Web_Hero.webp";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fixed gradient overlay
  const gradientOverlay =
    "linear-gradient(135deg, rgba(0, 67, 92, 0.75) 0%, rgba(0, 102, 135, 0.65) 50%, rgba(0, 136, 167, 0.45) 100%)";

  // Water wave SVG
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

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        color: "white",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* Hero Image - responsive */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <Box
          component="img"
          src={heroImage}
          alt="Roboboat Team"
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      </Box>

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

      {/* Water wave divider at bottom */}
      <WaterWaveDivider />

      <Container
        maxWidth="lg"
        sx={{
          position: "absolute",
          zIndex: 3,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          pb: { xs: 4, sm: 6, md: 8 },
        }}
      >
        {/* Main Title - HIDDEN ON MOBILE */}
        {!isMobile && (
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "1.8rem",
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4rem",
              },
              mb: { xs: 2, sm: 3 },
              textShadow: `0 4px 20px ${alpha("#000", 0.7)}`,
              color: theme.palette.common.white,
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Humber ASV
          </Typography>
        )}

        {/* Subtitle - HIDDEN ON MOBILE */}
        {!isMobile && (
          <Typography
            variant="h4"
            component="p"
            gutterBottom
            sx={{
              mb: { xs: 3, sm: 4, md: 5 },
              opacity: 0.97,
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
              },
              fontWeight: 400,
              maxWidth: "800px",
              mx: "auto",
              textShadow: `0 3px 12px ${alpha("#000", 0.6)}`,
              color: theme.palette.common.white,
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            Navigating the future of autonomous maritime innovation
          </Typography>
        )}

        {/* Buttons - IDENTICAL STYLING FOR BOTH */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 3 },
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              mt: { xs: 2, sm: 3, md: 4 },
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/vehicle"
              sx={{
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1.25, sm: 1.5, md: 1.75 },
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                borderRadius: 3,
                fontWeight: 700,
                borderWidth: 2,
                backdropFilter: "blur(10px)",
                borderColor: "white",
                color: "white",
                backgroundColor: alpha("#fff", 0.1),
                "&:hover": {
                  borderWidth: 2,
                  borderColor: "transparent",
                  backgroundColor: "#D8FA07",
                  color: "#000",
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 40px ${alpha("#5aff1e", 0.6)}`,
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
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1.25, sm: 1.5, md: 1.75 },
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                borderRadius: 3,
                fontWeight: 700,
                borderWidth: 2,
                backdropFilter: "blur(10px)",
                borderColor: "white",
                color: "white",
                backgroundColor: alpha("#fff", 0.1),
                "&:hover": {
                  borderWidth: 2,
                  borderColor: "transparent",
                  backgroundColor: "#D8FA07",
                  color: "#000",
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 40px ${alpha("#5aff1e", 0.6)}`,
                },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Meet The Crew
            </Button>
          </Box>
        )}

        {/* MOBILE-ONLY: Small text */}
        {isMobile && (
          <Typography
            variant="h5"
            sx={{
              color: "white",
              textShadow: `0 2px 8px ${alpha("#000", 0.8)}`,
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Humber ASV
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default HeroSection;
