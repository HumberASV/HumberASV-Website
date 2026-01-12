// src/components/layout/vehicle/HeroSection.tsx
import { Box, Typography, alpha } from "@mui/material";
import vehicleBanner from "../../../assets/LoonE_Web_3_Hero.webp";

interface HeroSectionProps {
  isMobile: boolean;
}

const HeroSection = ({ isMobile }: HeroSectionProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#000",
        position: "relative",
        mb: { xs: 4, md: 6 },
      }}
    >
      <Box
        component="img"
        src={vehicleBanner}
        alt="Humber ASV Vehicle"
        loading="eager"
        decoding="async"
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />

      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            background: alpha("#000", 0.8),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            py: 2,
            px: 4,
            width: "auto",
            maxWidth: "800px",
            boxSizing: "border-box",
            zIndex: 10,
            border: `1px solid ${alpha("#fff", 0.2)}`,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
              fontSize: {
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4rem",
              },
              wordWrap: "break-word",
              lineHeight: 1.1,
              letterSpacing: { sm: "-0.5px", md: "-1px" },
              color: "white",
            }}
          >
            HumberASV
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              fontSize: {
                sm: "1.1rem",
                md: "1.4rem",
              },
              maxWidth: "600px",
              mx: "auto",
              wordWrap: "break-word",
              lineHeight: 1.3,
              color: "white",
              fontWeight: 500,
            }}
          >
            Autonomous Surface Vehicle
          </Typography>
        </Box>
      )}

      {isMobile && (
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            zIndex: 10,
            width: "90%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
              fontSize: "1.5rem",
              color: "white",
            }}
          >
            HumberASV
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HeroSection;
