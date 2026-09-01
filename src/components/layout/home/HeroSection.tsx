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
import ResponsiveImage from "../../common/ResponsiveImage";
import Wave from "./wave";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const gradientOverlay = `linear-gradient(to top, ${alpha(
    theme.palette.primary.main,
    0.85
  )} 0%, ${alpha(theme.palette.primary.main, 0.4)} 50%, ${alpha(
    theme.palette.primary.light,
    0
  )} 100%)`;

  // Water wave SVG
  const WaterWaveDivider = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: -1, // Slightly overlap the bottom edge to hide any gaps
        left: 0,
        width: "100%",
        height: {md: 100, xs: 30},
        overflow: "none",
        lineHeight: 0,
        transform: "rotate(180deg)",
        zIndex: 2,
      }}
    >
      <Wave />
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
      {/* Hero Image */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <ResponsiveImage
          src="/heros/two/LoonE_Web_Hero_SmallPhone.webp"
          srcSet="/heros/two/LoonE_Web_Hero_SmallPhone.webp 320w, /heros/two/LoonE_Web_Hero_Phone.webp 600w, /heros/two/LoonE_Web_Hero_Tablet.webp 900w, /heros/two/LoonE_Web_Hero_Desktop.webp 1200w"
          sizes="100vw"
          fetchPriority="high"
          alt="Loon-E Autonomous Surface Vehicle"
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
          pb: 1, // Adjust padding prevent extra space

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
        {/* Main Title */}
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

        {/* Subtitle */}
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

        {/* Buttons */}
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
                  backgroundColor: theme.palette.accent.main,
                  color: "#000",
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 40px ${alpha(theme.palette.accent.main, 0.6)}`,
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
                  backgroundColor: theme.palette.accent.main,
                  color: "#000",
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 40px ${alpha(theme.palette.accent.main, 0.6)}`,
                },
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Meet The Crew
            </Button>
          </Box>
        )}

        {/* MOBILE-ONLY */}
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
