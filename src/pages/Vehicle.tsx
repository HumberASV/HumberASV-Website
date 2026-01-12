import { useState } from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";

// Import components
import HeroSection from "../components/layout/vehicle/HeroSection";
import MissionStatement from "../components/layout/vehicle/MissionStatement";
import VideoSection from "../components/layout/vehicle/VideoSection";
import TechnicalSpecifications from "../components/layout/vehicle/TechnicalSpecifications";
import HighlightsSection from "../components/layout/vehicle/HighlightsSection";
import DocumentationCTA from "../components/layout/vehicle/DocumentationCTA";

// Import modal
import HighlightModal from "../components/layout/vehicle/HighlightModal";

const Vehicle = () => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLearnMore = (title: string, content: string) => {
    setSelectedHighlight({ title, content });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedHighlight(null);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          overflowX: "hidden",
        }}
      >
        <HeroSection isMobile={isMobile} />

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <MissionStatement />
        </Container>

        {/* Video Section - FULL WIDTH, NO CONTAINER CONSTRAINTS */}
        <Box sx={{ width: "100%" }}>
          <VideoSection />
        </Box>

        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <TechnicalSpecifications />

          <HighlightsSection onLearnMore={handleLearnMore} />

          <DocumentationCTA />
        </Container>
      </Box>

      {/* MODAL */}
      {selectedHighlight && (
        <HighlightModal
          open={modalOpen}
          title={selectedHighlight.title}
          content={selectedHighlight.content}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Vehicle;
