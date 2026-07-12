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
            icon={<CubeIcon />}
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
              icon={<BatteryIcon />}
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
              icon={<ShieldIcon />}
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

      {/* Parts in Play divider */}
      <Box
        sx={{
          background: `linear-gradient(to top, ${theme.palette.accent.main} 0%, ${theme.palette.background.default} 71.6%)`,
          textAlign: "center",
          py: 6,
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: `'Montserrat', 'Roboto', sans-serif`,
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "3rem" },
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            color: "text.primary",
          }}
        >
          Parts in Play
        </Typography>
        <Typography sx={{ fontSize: "14px", letterSpacing: "1.68px", color: "tertiary.dark" }}>
          ENGINEERING HIGHLIGHTS
        </Typography>
      </Box>

      {/* VideoCard gallery */}
      <Box sx={{ position: "relative", py: 6, overflow: "hidden" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          {/* rectangle background */}
          <rect width="100%" height="100%" fill={theme.palette.accent.main} />
          {/* Triangle shape */}
          <defs>
            <linearGradient id="primaryGradient" x1="15%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor={theme.palette.primary.dark} />
              <stop offset="50%" stopColor={theme.palette.primary.main} />
              <stop offset="100%" stopColor={theme.palette.primary.light} />
            </linearGradient>
          </defs>
          <polygon points="0,100 100,0 100,100" fill="url(#primaryGradient)" />
        </svg>
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "center", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <VideoCard
                title="Battery Backup & Failsafe"
                body="If the main batteries ever run low mid-test, the operator can flip a switch to reroute power from the backup battery straight to the propellers — buying enough time to safely bring the boat home."
                icon={<BoltIcon />}
                partImageOverlay={partOverlay("batteries", "The boat's drive and electronics batteries")}
              />
            </Box>
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <VideoCard
                title="Custom-Built Circuit Boards"
                body="Our team designs and builds its own circuit boards in-house — from simulation to breadboard prototype to the final board — handling tasks like switching between manual and autonomous control and lighting up the boat's exterior indicator."
                icon={<ChipIcon />}
                partImageOverlay={partOverlay("custom-board", "A custom circuit board designed by the team")}
              />
            </Box>
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <VideoCard
                title="Live Voltage Readout"
                body="Voltage sensors feed straight into the FlySky remote, so the operator can watch both battery banks in real time without a laptop or a second screen."
                icon={<GaugeIcon />}
                partImageOverlay={partOverlay("flysky", "The FlySky remote control with live voltage display")}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "center", alignItems: "center", gap: 2, mt: 5 }}>
            <Button
              sx={{
                borderRadius: "24px",
                px: 2.5,
                py: 1.5,
                bgcolor: "accent.light",
                color: "accent.contrastText",
                fontWeight: 500,
                textTransform: "none",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": { bgcolor: "accent.light" },
              }}
            >
              View Full Wiring Diagram
            </Button>
            <Button
            component={Link}
              to="/team"
              sx={{
                borderRadius: "24px",
                px: 2.5,
                py: 1.5,
                bgcolor: "accent.light",
                color: "accent.contrastText",
                fontWeight: 500,
                textTransform: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "accent.light" },
              }}
            >
              Meet the Team
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
