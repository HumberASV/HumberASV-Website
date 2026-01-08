import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeroSection from "../components/layout/home/HeroSection";
import AboutSection from "../components/layout/home/AboutSection";
import SponsorHighlights from "../components/layout/home/SponsorHighlights";
// import LatestUpdates from "../components/layout/home/LatestUpdates";
import CallToAction from "../components/layout/home/CallToAction";

const Home = () => {
  const theme = useTheme();

  return (
    <Box>
      <HeroSection />

      {/* Updated About Section */}
      <AboutSection />

      {/* Sponsors Section */}
      <Box
        sx={{
          bgcolor: "grey.100",
          py: { xs: 8, md: 12 },
          backgroundImage:
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #f5f8fa 0%, #e8f2f8 100%)"
              : "linear-gradient(135deg, #0d1a26 0%, #142434 100%)",
        }}
      >
        <Container>
          <Typography
            variant="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
              mb: 3,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #00435c 0%, #006687 100%)"
                  : "linear-gradient(135deg, #a3e7ff 0%, #80d4ff 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Sponsors
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 6,
              color: "text.secondary",
              fontWeight: 400,
            }}
          >
            We gratefully acknowledge the support of our sponsors who make our
            project possible through their generous contributions and
            partnership.
          </Typography>
          <SponsorHighlights />
          <Box textAlign="center" mt={6}>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/sponsors"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              View All Sponsors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Enhanced Call to Action Section */}
      <CallToAction />
    </Box>
  );
};

export default Home;
