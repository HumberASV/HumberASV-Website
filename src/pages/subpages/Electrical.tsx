/**
 * @file Electrical.tsx
 * @description This is the page that describes the Electrical system of the LoonE ASV.
 * It provides an overview of the electrical components, wiring, and functionality of the vehicle's electrical system.
 */

import { Box, Container, Typography, Button, useTheme } from "@mui/material";
import ImgCard from "../../components/cards/ImgCard";
import VideoCard from "../../components/cards/VideoCard";
import HeroCard from "../../components/cards/HeroCard";
import ResponsiveImage from "../../components/common/ResponsiveImage";
import { photoSrc, photoSrcSet, cutOutSrc, cutOutSrcSet } from "../../utils/responsiveMedia";
import { CubeIcon, BatteryIcon, ShieldIcon, BoltIcon, ChipIcon, GaugeIcon } from "../../components/icons/Icons";
import { Link } from "react-router-dom";

const cardMediaSx = { width: "100%", height: "100%", objectFit: "cover", display: "block" } as const;

const partOverlay = (base: string, alt: string) => (
  <ResponsiveImage
    src={cutOutSrc(base)}
    srcSet={cutOutSrcSet(base)}
    sizes="255px"
    alt={alt}
    sx={{ width: "100%", display: "block" }}
  />
);

export default function Electrical() {
  const theme = useTheme();
  const primaryGradient = `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`;

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: primaryGradient,
          color: "#fff",
          textAlign: "center",
          px: { xs: 4, md: "220px" },
          pt: 8,
          pb: 12,
        }}
      >
        <Typography
          sx={{
            fontFamily: `'Montserrat', 'Roboto', sans-serif`,
            fontWeight: 700,
            fontSize: { xs: "2.5rem", md: "4rem" },
            mb: 4,
          }}
        >
          Electrical System
        </Typography>
        <Typography sx={{ fontSize: "1rem", lineHeight: 1.5, opacity: 0.95 }}>
          This page provides an overview of the electrical components, wiring, and functionality of the LoonE ASV's electrical system.
        </Typography>
      </Box>

      {/* Section heading */}
      <Container sx={{ textAlign: "center", py: { xs: 6, md: 8 } }}>
        <Typography
          sx={{
            fontFamily: `'Montserrat', 'Roboto', sans-serif`,
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.25rem" },
            color: "text.primary",
            mb: 2,
          }}
        >
          How the Electrical System Works
        </Typography>
        <Typography sx={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.75)" }}>
          A plain-language look at how power, safety, and custom electronics come together on the boat.
        </Typography>

        {/* HeroCard */}
        <Box sx={{ mt: 6 }}>
          <HeroCard
            image={photoSrc("f0110464")}
            imageSrcSet={photoSrcSet("f0110464")}
            imageAlt="Team member reviewing the hull model in slicer software"
            imagePosition="right"
            icon={<CubeIcon 
             fill={theme.palette.accent.contrastText}
            />}
            borderRadius={{ xs: 0, md: 25 }}
            title="Planned in 3D First"
            description="Every wiring run, enclosure, and mount is modeled and checked for clearance in CAD before a single part is built, so fit problems get caught on screen, not on the dock."
          />
        </Box>

        {/* ImgCard grid */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, mt: 6 }}>
          <Box sx={{ flex: "1 1 320px", maxWidth: 480 }}>
            <ImgCard
              title="Dual Power System"
              description="Two rugged 20V batteries drive the propellers, while a separate 14.8V battery runs all onboard electronics — keeping power for movement and power for the brain completely independent."
              icon={<BatteryIcon 
               fill={theme.palette.accent.contrastText}
              />}
              showLinkText={false}
              mediaSlot={
                <ResponsiveImage
                  src={photoSrc("IMG_3637")}
                  srcSet={photoSrcSet("IMG_3637")}
                  sizes="(min-width: 600px) 480px, 100vw"
                  alt="The boat's power kit: two 20V drive batteries, a 14.8V electronics battery, and the FlySky remote"
                  sx={cardMediaSx}
                />
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 320px", maxWidth: 480 }}>
            <ImgCard
              title="Built-In Safety Monitoring"
              description="Battery Management Systems and voltage sensors constantly watch battery health and beam live status straight to the operator's remote control, so problems get caught before they become failures."
              icon={<ShieldIcon 
               fill={theme.palette.accent.contrastText} />}
              showLinkText={false}
              mediaSlot={
                <ResponsiveImage
                  src={photoSrc("f0024896")}
                  srcSet={photoSrcSet("f0024896")}
                  sizes="(min-width: 600px) 480px, 100vw"
                  alt="Team member assembling the boat's electronics stack in the workshop"
                  sx={cardMediaSx}
                />
              }
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}