/**
 * @file Mechanical.tsx
 * @description This is the page that describes the Mechanical system of the LoonE ASV.
 * It provides an overview of the mechanical components, assembly, and functionality of the vehicle's mechanical system.
 */

import { Box, Container, Typography, alpha, useTheme } from "@mui/material";
import ImgCard from "../../components/cards/ImgCard";
import HeroCard from "../../components/cards/HeroCard";
import FeatureCard from "../../components/cards/FeatureCard";
import ResponsiveImage from "../../components/common/ResponsiveImage";
import { photoSrc, photoSrcSet, cutOutSrc, cutOutSrcSet } from "../../utils/responsiveMedia";
import { CubeIcon, HatchIcon, WrenchIcon, LockIcon, PlatesIcon } from "../../components/icons/Icons";
const cardMediaSx = { width: "100%", height: "100%", objectFit: "cover", display: "block" } as const;

// `priority` marks the page's LCP tile (orin): render it eagerly at high fetch
// priority so it matches the preload declared in index.html.
const FeatureTile = ({ base, alt, priority = false }: { base: string; alt: string; priority?: boolean }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
        borderRadius: "20px",
        p: 2.5,
      }}
    >
      <ResponsiveImage
        src={cutOutSrc(base)}
        srcSet={cutOutSrcSet(base)}
        sizes="297px"
        alt={alt}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : undefined}
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          filter: `drop-shadow(0px 12px 24px ${alpha("#000", 0.35)})`,
        }}
      />
    </Box>
  );
};



export default function Mechanical() {
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
          Mechanical System
        </Typography>
        <Typography sx={{ fontSize: "1rem", lineHeight: 1.5, opacity: 0.95 }}>
          This page provides an overview of the mechanical components, assembly, and functionality of the LoonE ASV's mechanical system.
        </Typography>
      </Box>

      {/* Systems Feature Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, pt: 3, pb: 7.5, px: 3 }}>
        <FeatureCard title="Secure Mounting" description="Every component bolts to a machined bracket, so nothing shifts once the boat is underway." showButton={false}>
          <FeatureTile base="chunk-of-boat" alt="A printed section of the boat's hull" />
        </FeatureCard>
        <FeatureCard title="Thermal Management" description="Aluminum mounting plates double as heat sinks, pulling heat away from the power electronics." showButton={false}>
          <FeatureTile base="orin" alt="The Jetson Orin compute module with its heat sink and fan" priority />
        </FeatureCard>
        <FeatureCard title="Vibration Isolation" description="Mounts are shaped to absorb vibration and shock, keeping connections solid out on the water." showButton={false}>
          <FeatureTile base="3dprint" alt="A 3D-printed scale model of the hull" />
        </FeatureCard>
      </Box>

      {/* HeroCard: Printed Hull */}
      <HeroCard
        image={photoSrc("f6049664")}
        imageSrcSet={photoSrcSet("f6049664")}
        imageAlt="The finished lime-green hull on its transport cart outdoors"
        imagePosition="right"
        icon={<CubeIcon />}
        title="Printed Hull"
        description="The hull is sized to print as a single ABS piece on our 24×36×36 ft printer, sliced to come off the bed strong and watertight. Leftover support material gets ground down and mixed with acetone into the binder that joins sectioned prints for faster prototypes."
      />

      {/* How the Mechanical System Works */}
      <Container sx={{ textAlign: "center", py: { xs: 6, md: 8 } }}>
        <Typography sx={{ fontSize: "14px", letterSpacing: "1.68px", color: "primary.dark", mb: 1.5 }}>
          MECHANICAL HIGHLIGHTS
        </Typography>
        <Typography
          sx={{
            fontFamily: `'Montserrat', 'Roboto', sans-serif`,
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.25rem" },
            color: "text.primary",
            mb: 2,
          }}
        >
          How the Mechanical System Works
        </Typography>
        <Typography sx={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.75)" }}>
          A look at how the hull is printed, sealed, and machined to handle the water.
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, mt: 6 }}>
          <Box sx={{ flex: "1 1 320px", maxWidth: 480 }}>
            <ImgCard
              title="Printed Hull"
              description="Printed as a single ABS piece on a 24×36×36 ft printer and sliced for a strong, watertight shell straight off the bed. Leftover support material becomes the binder that joins sectioned prints."
              icon={<CubeIcon />}
              mediaSlot={
                <ResponsiveImage
                  src={photoSrc("f0110464")}
                  srcSet={photoSrcSet("f0110464")}
                  sizes="(min-width: 600px) 480px, 100vw"
                  alt="Team member preparing the hull print in slicer software"
                  sx={cardMediaSx}
                />
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 320px", maxWidth: 480 }}>
            <ImgCard
              title="Watertight Hatch"
              description="Latches and a compressed rubber seal keep the hatch watertight. Mounting plates inside carry the electronics — aluminum for heat sinking, or acrylic for fast prototyping."
              icon={<HatchIcon />}
              mediaSlot={
                <ResponsiveImage
                  src={photoSrc("zedx-and-orin")}
                  srcSet={photoSrcSet("zedx-and-orin")}
                  sizes="(min-width: 600px) 480px, 100vw"
                  alt="The ZED stereo camera resting on the Jetson Orin carrier board"
                  sx={cardMediaSx}
                />
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 320px", maxWidth: 480 }}>
            <ImgCard
              title="Hand-Machined Parts"
              description="Brackets, fittings, and mounting hardware that do not fit an off-the-shelf part are cut and finished by hand, so every component matches the hull's exact geometry."
              icon={<WrenchIcon />}
              mediaSlot={
                <ResponsiveImage
                  src={photoSrc("custom-led")}
                  srcSet={photoSrcSet("custom-led")}
                  sizes="(min-width: 600px) 480px, 100vw"
                  alt="The indicator LED module mounted on a hand-machined aluminum plate"
                  sx={cardMediaSx}
                />
              }
            />
          </Box>
        </Box>
      </Container>

      {/* HeroCard: Watertight by Design */}
      <HeroCard
        image={photoSrc("f0192576")}
        imageSrcSet={photoSrcSet("f0192576")}
        imageAlt="Close-up of the electronics stack and the hatch panel's sealed cable glands"
        imagePosition="left"
        title="Watertight by Design"
        features={[
          {
            icon: <LockIcon />,
            title: "Sealed by design",
            description: "Latches clamp down on a compressed rubber gasket, keeping the electronics hatch watertight in any conditions.",
          },
          {
            icon: <PlatesIcon />,
            title: "Modular mounting plates",
            description: "Two plates carry the electronics — aluminum for extra heat sinking, or acrylic when we need to prototype hole layouts fast.",
          },
        ]}
      />
    </Box>
  );
}
