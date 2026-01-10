import { Box } from "@mui/material";
import HeroSection from "../components/layout/home/HeroSection";
import AboutSection from "../components/layout/home/AboutSection";
import CallToAction from "../components/layout/home/CallToAction";

const Home = () => {
  return (
    <Box>
      <HeroSection />

      {/* Updated About Section */}
      <AboutSection />

      {/* Enhanced Call to Action Section */}
      <CallToAction />
    </Box>
  );
};

export default Home;
