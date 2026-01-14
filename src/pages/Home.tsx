import { Box } from "@mui/material";
import HeroSection from "../components/layout/home/HeroSection";
import AboutSection from "../components/layout/home/AboutSection";
import CallToAction from "../components/layout/home/CallToAction";

const Home = () => {
  return (
    <Box>
      <HeroSection />

      <AboutSection />

      <CallToAction />
    </Box>
  );
};

export default Home;
