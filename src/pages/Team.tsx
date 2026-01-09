import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
} from "@mui/material";

// Import banner images
import teamLeadsBanner from "../assets/Team Lead HS-1.jpg";
import fullTeamBanner from "../assets/Web-Team Photo.jpg";

// Import all team member images
import ianCameronHeadshot from "../assets/Ian Cameron - Team Principal.jpg";
import dylanTurksonHeadshot from "../assets/Dylan Turkson - Media Lead.jpg";
import emilianoRoriguezHeadshot from "../assets/Emiliano Roriguez Flores - Electrical Lead.jpg";
import ameliaSoonHeadshot from "../assets/Amelia Soon - Software Lead.jpg";
import hariharaRaakulanHeadshot from "../assets/Harihara Raakulan - Mechanical Lead.jpg";
import andrewPaleyHeadshot from "../assets/Electrical - Andrew Paley.jpg";
import evanSiglHeadshot from "../assets/Mechanical - Evan Sigl.jpg";
import jabariLiraHeadshot from "../assets/Mechanical - Jabari Lira Leon.jpg";
import jordanEstradaHeadshot from "../assets/Mechanical - Jordan Estrada.jpg";
import muhammadDesaiHeadshot from "../assets/Media - Muhammad Desai.jpg";
import vinhLeHeadshot from "../assets/Media - Vinh Le.jpg";
import carsonFujitaHeadshot from "../assets/Software - Carson Fujita.jpg";
import kunalReddyHeadshot from "../assets/Software - Kunal Reddy.jpg";
import udayChahalHeadshot from "../assets/Software - Uday Chahal.jpg";

// Lazy load modal
const TeamModal = lazy(() => import("../components/team/TeamModal"));

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  links: {
    linkedin: string;
    github: string;
    email: string;
  };
  skills: string[];
}

const Team = () => {
  const theme = useTheme();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Team Leads
  const teamLeads = useMemo(
    () => [
      {
        id: 0,
        name: "Ian Cameron",
        role: "Team Principal",
        image: ianCameronHeadshot,
        bio: "Oversees all technical aspects of the ASV project. Coordinates between engineering disciplines and ensures technical excellence.",
        links: {
          linkedin: "#",
          github: "#",
          email: "ian.cameron@humber.ca",
        },
        skills: ["Project Leadership", "Systems Engineering", "Robotics"],
      },
      {
        id: -2,
        name: "Emiliano Roriguez Flores",
        role: "Electrical Lead",
        image: emilianoRoriguezHeadshot,
        bio: "Leads electrical team.",
        links: {
          linkedin: "#",
          github: "#",
          email: "emiliano.roriguez@humber.ca",
        },
        skills: ["PCB Design", "Power Management", "Sensors"],
      },
      {
        id: -3,
        name: "Amelia Soon",
        role: "Software Lead",
        image: ameliaSoonHeadshot,
        bio: "Leads software team.",
        links: { linkedin: "#", github: "#", email: "amelia.soon@humber.ca" },
        skills: ["Python", "ROS", "Computer Vision"],
      },
      {
        id: -4,
        name: "Harihara Raakulan",
        role: "Mechanical Lead",
        image: hariharaRaakulanHeadshot,
        bio: "Leads mechanical team.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["CAD Design", "Mechanical Systems", "Prototyping"],
      },
      {
        id: -1,
        name: "Dylan Turkson",
        role: "Media Lead",
        image: dylanTurksonHeadshot,
        bio: "Handles social media, sponsorships and public relations for the team.",
        links: { linkedin: "#", github: "#", email: "dylan.turkson@humber.ca" },
        skills: ["Leadership", "Competition Strategy", "Team Management"],
      },
    ],
    []
  );

  // Rest of Team Members (excluding leads)
  const restTeamMembers = useMemo(
    () => [
      {
        id: 1,
        name: "Andrew Paley",
        role: "Electrical",
        image: andrewPaleyHeadshot,
        bio: "Electrical guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["CAD", "Fluid Dynamics", "3D Printing"],
      },
      {
        id: 2,
        name: "Evan Sigl",
        role: "Mechanical",
        image: evanSiglHeadshot,
        bio: "Mechanical Guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["SolidWorks", "FEA", "Prototyping"],
      },
      {
        id: 3,
        name: "Jabari Lira Leon",
        role: "Mechanical",
        image: jabariLiraHeadshot,
        bio: "Mechanical guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["PCB Design", "Power Management", "Sensors"],
      },
      {
        id: 4,
        name: "Jordan Estrada",
        role: "Mechanical",
        image: jordanEstradaHeadshot,
        bio: "Mechanical guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["Arduino", "Raspberry Pi", "C++"],
      },
      {
        id: 5,
        name: "Muhammad Desai",
        role: "Media",
        image: muhammadDesaiHeadshot,
        bio: "Website guy.",
        links: { linkedin: "#", github: "#", email: "n01323570@humber.ca" },
        skills: ["Typescript", "Node", "React"],
      },
      {
        id: 6,
        name: "Vinh Le",
        role: "Media",
        image: vinhLeHeadshot,
        bio: "Website guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["Design", "Typescript", "Python"],
      },
      {
        id: 7,
        name: "Carson Fujita",
        role: "Software",
        image: carsonFujitaHeadshot,
        bio: "Software guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["Project Management", "Communication", "Documentation"],
      },
      {
        id: 8,
        name: "Kunal Reddy",
        role: "Software",
        image: kunalReddyHeadshot,
        bio: "Software guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["Marketing", "Graphic Design", "Networking"],
      },
      {
        id: 9,
        name: "Uday Chahal",
        role: "Software",
        image: udayChahalHeadshot,
        bio: "Software guy.",
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["Marketing", "Graphic Design", "Networking"],
      },
    ],
    []
  );

  // Preload all images in high quality
  useEffect(() => {
    const preloadImage = (src: string, id: number) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, id]));
      };
      img.onerror = () => {
        console.warn(`Failed to load image for ID ${id}: ${src}`);
        setLoadedImages((prev) => new Set([...prev, id])); // Mark as loaded even if error
      };
    };

    // Preload banner images
    preloadImage(teamLeadsBanner, -999);
    preloadImage(fullTeamBanner, -998);

    // Preload team lead images
    teamLeads.forEach((member) => {
      preloadImage(member.image, member.id);
    });

    // Preload team member images (lazy load these as needed)
    restTeamMembers.forEach((member) => {
      preloadImage(member.image, member.id);
    });
  }, [teamLeads, restTeamMembers]);

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  // Industry-standard HQ Avatar Component
  const HQAvatar = ({ member }: { member: TeamMember }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
      <Box
        sx={{
          width: 140,
          height: 140,
          mb: 2,
          borderRadius: "50%",
          overflow: "hidden",
          border: `4px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          boxShadow: `
            0 0 0 1px ${alpha("#fff", 0.1)},
            0 8px 32px ${alpha(theme.palette.primary.main, 0.2)},
            inset 0 0 20px ${alpha(theme.palette.primary.main, 0.05)}
          `,
          position: "relative",
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {/* Loading skeleton */}
        {!isLoaded && !hasError && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Error fallback */}
        {hasError && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: "2rem",
            }}
          >
            {member.name.charAt(0)}
          </Box>
        )}

        {/* HQ Image with perfect rendering */}
        <Box
          component="img"
          src={member.image}
          alt={member.name}
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
            opacity: isLoaded && !hasError ? 1 : 0,
            transition: "opacity 0.3s ease, transform 0.5s ease",
            imageRendering: "auto",
            WebkitTransform: "translateZ(0)",
            MozTransform: "translateZ(0)",
            msTransform: "translateZ(0)",
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformOrigin: "center center",
            "&:hover": {
              transform: "scale(1.08)",
            },
          }}
        />

        {/* Subtle gradient overlay for depth */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, transparent 60%, ${alpha(
              "#000",
              0.1
            )} 100%)`,
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
      </Box>
    );
  };

  const renderTeamCard = (member: TeamMember) => (
    <Fade in={loadedImages.has(member.id)} timeout={500}>
      <Box
        sx={{
          display: "flex",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: loadedImages.has(member.id) ? 1 : 0,
          transform: loadedImages.has(member.id)
            ? "translateY(0)"
            : "translateY(20px)",
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: `0 24px 64px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
        }}
        onClick={() => handleCardClick(member)}
      >
        <Card
          sx={{
            width: "100%",
            height: 340,
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: `
              0 0 0 1px ${alpha(theme.palette.primary.main, 0.05)},
              0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}
            `,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            position: "relative",
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.4),
              boxShadow: `
                0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)},
                0 24px 72px ${alpha(theme.palette.primary.main, 0.2)}
              `,
            },
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: 3.5,
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* HQ Avatar */}
            <HQAvatar member={member} />

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: 1,
                  fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.35rem" },
                  lineHeight: 1.3,
                  letterSpacing: "-0.2px",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {member.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#006687",
                  fontWeight: 700,
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  lineHeight: 1.4,
                  opacity: 0.9,
                }}
              >
                {member.role}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                mt: 2,
                opacity: 0.7,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Click to learn more
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100vw",
        transform: "translateZ(0)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* 1. Team Leads Banner - TEXT REDUCED BY HALF ON MOBILE */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
          mb: { xs: 6, md: 8 },
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          transform: "translateZ(0)",
        }}
      >
        <Box
          component="img"
          src={teamLeadsBanner}
          alt="Team Leads"
          loading="eager"
          decoding="async"
          sx={{
            width: "100%",
            height: { xs: "auto", sm: "auto", md: "80vh" },
            maxHeight: { xs: "60vh", sm: "70vh", md: "80vh" },
            objectFit: { xs: "contain", sm: "contain", md: "cover" },
            objectPosition: "center center",
            display: "block",
            imageRendering: "auto",
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 15, sm: 30, md: 40 },
            left: "50%",
            transform: "translateX(-50%) translateZ(0)",
            textAlign: "center",
            color: "white",
            background: alpha("#000", 0.7),
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            py: { xs: 1, sm: 2 },
            px: { xs: 2, sm: 4 },
            width: { xs: "90%", sm: "auto" },
            maxWidth: { xs: "90%", sm: "90%", md: "800px" },
            boxSizing: "border-box",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: { xs: 0.5, sm: 2 }, // Reduced margin on mobile
              textShadow: "0 4px 20px rgba(0,0,0,0.7)",
              fontSize: {
                xs: "1.4rem", // HALF SIZE: was 1.8rem
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4rem",
              },
              wordWrap: "break-word",
              overflowWrap: "break-word",
              lineHeight: 1.1, // Tighter line height on mobile
              letterSpacing: { xs: "-0.2px", md: "-0.5px" },
            }}
          >
            Our Leadership
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              fontSize: {
                xs: "0.85rem", // HALF SIZE: was 1rem
                sm: "1.2rem",
                md: "1.5rem",
                lg: "1.6rem",
              },
              maxWidth: "600px",
              mx: "auto",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              lineHeight: 1.2, // Tighter line height on mobile
              display: { xs: "none", sm: "block" }, // Hide on very small mobile if needed
            }}
          >
            Meet the team leads driving our mission forward
          </Typography>
        </Box>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          overflowX: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {/* 2. Who We Are Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              wordWrap: "break-word",
              letterSpacing: "-0.5px",
            }}
          >
            Who We Are
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 800,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.7,
              px: { xs: 1, sm: 0 },
              wordWrap: "break-word",
            }}
          >
            We're a multidisciplinary team of passionate Humber College students
            and professionals dedicated to advancing autonomous maritime
            technology. From mechanical design to AI algorithms, our diverse
            expertise comes together to build innovative solutions for the
            future of autonomous surface vehicles.
          </Typography>
        </Box>

        {/* 3. Full Team Banner - TEXT REDUCED BY HALF ON MOBILE */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            mb: 8,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            transform: "translateZ(0)",
          }}
        >
          <Box
            component="img"
            src={fullTeamBanner}
            alt="Full Team"
            loading="lazy"
            decoding="async"
            sx={{
              width: "100%",
              height: { xs: "auto", sm: "auto", md: "60vh" },
              maxHeight: { xs: "50vh", sm: "55vh", md: "60vh" },
              objectFit: { xs: "contain", sm: "contain", md: "cover" },
              objectPosition: "center center",
              display: "block",
              imageRendering: "auto",
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 15, sm: 25, md: 32 }, // Reduced bottom position on mobile
              left: "50%",
              transform: "translateX(-50%) translateZ(0)",
              textAlign: "center",
              color: "white",
              background: alpha("#000", 0.7),
              backdropFilter: "blur(4px)",
              borderRadius: 2,
              py: { xs: 0.8, sm: 1.5 }, // Reduced padding on mobile
              px: { xs: 2, sm: 3 }, // Reduced padding on mobile
              width: { xs: "90%", sm: "auto" }, // Smaller width on mobile
              maxWidth: { xs: "90%", sm: "90%", md: "700px" },
              boxSizing: "border-box",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: { xs: 0.3, sm: 1 }, // Reduced margin on mobile
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "1.2rem", // HALF SIZE: was 1.6rem
                  sm: "2rem",
                  md: "2.5rem",
                },
                wordWrap: "break-word",
                lineHeight: 1.1, // Tighter line height on mobile
                letterSpacing: { xs: "-0.2px", md: "-0.3px" },
              }}
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                textShadow: "0 1px 5px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "0.75rem", // HALF SIZE: was 0.95rem
                  sm: "1.1rem",
                  md: "1.3rem",
                },
                wordWrap: "break-word",
                lineHeight: 1.2, // Tighter line height on mobile
                display: { xs: "none", sm: "block" }, // Hide on very small mobile
              }}
            >
              Every member contributes to our success
            </Typography>
          </Box>
        </Box>

        {/* 4. TEAM LEADS SECTION */}
        <Box
          sx={{
            mb: { xs: 8, md: 12 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
              wordWrap: "break-word",
              letterSpacing: "-0.5px",
            }}
          >
            Leadership Team
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Top row: 3 cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                width: "100%",
                maxWidth: {
                  xs: "100%",
                  sm: "100%",
                  md: "900px",
                  lg: "100%",
                },
              }}
            >
              {teamLeads.slice(0, 3).map(renderTeamCard)}
            </Box>

            {/* Bottom row: 2 cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
                width: "100%",
                maxWidth: {
                  xs: "100%",
                  sm: "100%",
                  md: "600px",
                  lg: "700px",
                },
              }}
            >
              {teamLeads.slice(3, 5).map(renderTeamCard)}
            </Box>
          </Box>
        </Box>

        {/* 5. REST OF TEAM SECTION */}
        <Box
          sx={{
            mb: { xs: 6, md: 8 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
              wordWrap: "break-word",
              letterSpacing: "-0.5px",
            }}
          >
            Our Team
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {restTeamMembers.map(renderTeamCard)}
          </Box>
        </Box>

        {/* Team Modal */}
        <Suspense fallback={<CircularProgress />}>
          {selectedMember && (
            <TeamModal
              open={!!selectedMember}
              member={selectedMember}
              onClose={handleCloseModal}
            />
          )}
        </Suspense>
      </Container>
    </Box>
  );
};

export default Team;
