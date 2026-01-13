// src\pages\Team.tsx
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
  Button,
  Stack,
} from "@mui/material";

// Import banner images
import teamLeadsBanner from "../assets/Team Lead HS-1.jpg";
import fullTeamBanner from "../assets/Web-Team Photo.jpg";

// Import all team member images
import ianCameronHeadshot from "../assets/Ian Cameron - Team Principal.jpg";
import dylanTurksonHeadshot from "../assets/Web-Dylan Turkson - Media Lead.jpg";
import emilianoRoriguezHeadshot from "../assets/Web-Emiliano Roriguez Flores - Electrical Lead.jpg";
import ameliaSoonHeadshot from "../assets/Web-Amelia Soon - Software Lead.jpg";
import hariharaRaakulanHeadshot from "../assets/Web-Harihara Raakulan - Mechanical Lead.jpg";
import andrewPaleyHeadshot from "../assets/Web-Electrical - Andrew Paley.jpg";
import evanSiglHeadshot from "../assets/Web-Mechanical - Evan Sigl.jpg";
import jabariLiraHeadshot from "../assets/Web-Mechanical - Jabari Lira Leon.jpg";
import jordanEstradaHeadshot from "../assets/Web-Mechanical - Jordan Estrada.jpg";
import muhammadDesaiHeadshot from "../assets/Web-Media - Muhammad Desai.jpg";
import vinhLeHeadshot from "../assets/Web-Media - Vinh Le.jpg";
import carsonFujitaHeadshot from "../assets/Web-Software - Carson Fujita.jpg";
import kunalReddyHeadshot from "../assets/Web-Software - Kunal Reddy.jpg";
import udayChahalHeadshot from "../assets/Web-Software - Uday Chahal.jpg";

// Lazy load modal
const TeamModal = lazy(() => import("../components/team/TeamModal"));

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  program: string;
  graduationYear?: number;
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
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/ian-cameron-2a21924a",
          github: "#",
          email: "#",
        },
        skills: ["CAD", "Project Management", "Simulation", "Prototyping"],
      },
      {
        id: -2,
        name: "Emiliano Roriguez Flores",
        role: "Electrical Lead",
        image: emilianoRoriguezHeadshot,
        bio: "Leads electrical team.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/emiliano-rodriguez-flores",
          github: "#",
          email: "#",
        },
        skills: [
          "Mechanical Engineering",
          "Design",
          "Electrical Engineering",
          "CAD",
        ],
      },
      {
        id: -3,
        name: "Amelia Soon",
        role: "Software Lead",
        image: ameliaSoonHeadshot,
        bio: "Leads software team.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/iamsoon/",
          github: "#",
          email: "#",
        },
        skills: [
          "Computer Engineering",
          "Mechanical Engineering",
          "Embedded Systems",
        ],
      },
      {
        id: -4,
        name: "Harihara Raakulan",
        role: "Mechanical Lead",
        image: hariharaRaakulanHeadshot,
        bio: "Leads mechanical team.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/harihara-raakulan-144737294/",
          github: "#",
          email: "#",
        },
        skills: ["Mechanical Engineering", "Design", "CAD"],
      },
      {
        id: -1,
        name: "Dylan Turkson",
        role: "Media Lead",
        image: dylanTurksonHeadshot,
        bio: "Handles social media, sponsorships and public relations for the team.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/dylan-turkson/",
          github: "#",
          email: "#",
        },
        skills: ["Design", "CAD", "Mechanical Engineering"],
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
        program: "Electrical Engineering Technology",
        links: {
          linkedin: "https://www.linkedin.com/in/andrew-paley-ab9b95211/",
          github: "#",
          email: "#",
        },
        skills: ["PCB Design", "Electrical Engineering"],
      },
      {
        id: 2,
        name: "Evan Sigl",
        role: "Mechanical",
        image: evanSiglHeadshot,
        bio: "Mechanical Guy.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2028,
        links: { linkedin: "#", github: "#", email: "#" },
        skills: ["Mechanical Engineering", "CAD", "Design"],
      },
      {
        id: 3,
        name: "Jabari Lira Leon",
        role: "Mechanical",
        image: jabariLiraHeadshot,
        bio: "Mechanical guy.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/jabariliraleon",
          github: "#",
          email: "#",
        },
        skills: ["CAD", "Mechanical Engineering"],
      },
      {
        id: 4,
        name: "Jordan Estrada",
        role: "Mechanical",
        image: jordanEstradaHeadshot,
        bio: "Mechanical guy.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2027,
        links: { linkedin: "#", github: "#", email: "NA.NA@humber.ca" },
        skills: ["Arduino", "Raspberry Pi", "C++"],
      },
      {
        id: 5,
        name: "Muhammad Desai",
        role: "Media",
        image: muhammadDesaiHeadshot,
        bio: "Website guy.",
        program: "Computer Engineering Technology",
        graduationYear: 2025,
        links: {
          linkedin: "https://www.linkedin.com/in/muhammad-desai-72552829a/",
          github: "https://github.com/momorocks111",
          email: "#",
        },
        skills: ["Typescript", "Node", "React"],
      },
      {
        id: 6,
        name: "Vinh Le",
        role: "Media",
        image: vinhLeHeadshot,
        bio: "Website guy.",
        program: "Computer Engineering Technology",
        graduationYear: 2028,
        links: {
          linkedin: "#",
          github: "https://github.com/DecadeVinhLe",
          email: "#",
        },
        skills: ["Java", "SQL", "Python"],
      },
      {
        id: 7,
        name: "Carson Fujita",
        role: "Software",
        image: carsonFujitaHeadshot,
        bio: "Software guy.",
        program: "Computer Programming And Analysis",
        graduationYear: 2027,
        links: {
          linkedin: "https://www.linkedin.com/in/carson-fujita/",
          github: "https://github.com/TheFujirose",
          email: "#",
        },
        skills: ["Project Management", "Communication", "Documentation"],
      },
      {
        id: 8,
        name: "Kunal Reddy",
        role: "Software",
        image: kunalReddyHeadshot,
        bio: "Software guy.",
        program: "Bachelor's of Engineering - Mechatronics",
        graduationYear: 2026,
        links: {
          linkedin: "https://www.linkedin.com/in/kunal-reddy-a43484272",
          github: "#",
          email: "#",
        },
        skills: ["CAD", "Robotics", "Mechanical Design"],
      },
      {
        id: 9,
        name: "Uday Chahal",
        role: "Software",
        image: udayChahalHeadshot,
        bio: "Software guy.",
        program: "Computer Engineering Technology",
        graduationYear: 2026,
        links: {
          linkedin: "#",
          github: "https://github.com/S7VN-DEV",
          email: "#",
        },
        skills: ["Sys Admin", "Networking", "IT Technician"],
      },
      {
        id: 10,
        name: "Brett Jacobs",
        role: "Software",
        image: "#",
        bio: "Software guy.",
        program: "Mechanical Engineering Technology",
        graduationYear: 2026,
        links: { linkedin: "#", github: "#", email: "#" },
        skills: ["Mechanical Design", "Maching", "Project Management"],
      },
      {
        id: 11,
        name: "Alex Mahesvaran",
        role: "Business",
        image: "#",
        bio: "Business guy.",
        program: "Business",
        graduationYear: 2026,
        links: { linkedin: "#", github: "#", email: "#" },
        skills: ["Advertising", "Media Creation", "Graphic Design"],
      },
      {
        id: 12,
        name: "Hartej Tapia",
        role: "Media",
        image: "#",
        bio: "Media guy.",
        program: "Bachelor's of Engineering - Mechatronics ",
        graduationYear: 2026,
        links: { linkedin: "#", github: "#", email: "#" },
        skills: [
          "Meachtronics Engineering",
          "Photography",
          "Project Management",
        ],
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
        setLoadedImages((prev) => new Set([...prev, id]));
      };
    };

    // Preload banner images
    preloadImage(teamLeadsBanner, -999);
    preloadImage(fullTeamBanner, -998);

    // Preload team lead images
    teamLeads.forEach((member) => {
      preloadImage(member.image, member.id);
    });

    // Preload team member images
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

  // HQ Avatar Component
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
        }}
      >
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
            transition: "opacity 0.3s ease",
            "&:hover": {
              transform: "scale(1.08)",
            },
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
            height: 360,
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
          }}
        >
          <CardContent
            sx={{
              p: 3,
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
                  mb: 0.5,
                  fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.35rem" },
                  lineHeight: 1.3,
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
                  mb: 1,
                }}
              >
                {member.role}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  opacity: 0.8,
                  fontStyle: "italic",
                }}
              >
                {member.program}
              </Typography>

              {member.graduationYear && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    opacity: 0.75,
                    mt: 0.5,
                  }}
                >
                  Class of {member.graduationYear}
                </Typography>
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                mt: 1,
                opacity: 0.7,
              }}
            >
              Click for details
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
      }}
    >
      {/* Team Leads Banner */}
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
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 15, sm: 30, md: 40 },
            left: "50%",
            transform: "translateX(-50%)",
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
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: { xs: 0.5, sm: 2 },
              textShadow: "0 4px 20px rgba(0,0,0,0.7)",
              fontSize: {
                xs: "1.4rem",
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4rem",
              },
              wordWrap: "break-word",
              lineHeight: 1.1,
            }}
          >
            Our Team
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              fontSize: {
                xs: "0.85rem",
                sm: "1.2rem",
                md: "1.5rem",
                lg: "1.6rem",
              },
              maxWidth: "600px",
              mx: "auto",
              wordWrap: "break-word",
              lineHeight: 1.2,
              display: { xs: "none", sm: "block" },
            }}
          >
            Meet the team members steering our mission towards success
          </Typography>
        </Box>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          overflowX: "hidden",
        }}
      >
        {/* Who We Are Section */}
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
            We're a multidisciplinary team of passionate Humber Polytechnic
            students and professionals dedicated to advancing autonomous
            maritime technology. From mechanical design to AI algorithms, our
            diverse expertise comes together to build innovative solutions for
            the future of autonomous surface vehicles.
          </Typography>
        </Box>

        {/* Full Team Banner */}
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
              height: "auto",
              maxHeight: {
                // optional safety cap
                xs: "70vh",
                sm: "75vh",
                md: "80vh",
              },
              objectFit: "contain",
              objectPosition: "center center",
              display: "block",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 15, sm: 25, md: 32 },
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              color: "white",
              background: alpha("#000", 0.7),
              backdropFilter: "blur(4px)",
              borderRadius: 2,
              py: { xs: 0.8, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              width: { xs: "90%", sm: "auto" },
              maxWidth: { xs: "90%", sm: "90%", md: "700px" },
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: { xs: 0.3, sm: 1 },
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                fontSize: {
                  xs: "1.2rem",
                  sm: "2rem",
                  md: "2.5rem",
                },
                wordWrap: "break-word",
                lineHeight: 1.1,
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
                  xs: "0.75rem",
                  sm: "1.1rem",
                  md: "1.3rem",
                },
                wordWrap: "break-word",
                lineHeight: 1.2,
                display: { xs: "none", sm: "block" },
              }}
            >
              Every member contributes to our success
            </Typography>
          </Box>
        </Box>

        {/* TEAM LEADS SECTION */}
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
            }}
          >
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

        {/* REST OF TEAM SECTION */}
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
              width: "100%",
            }}
          >
            {restTeamMembers.map(renderTeamCard)}
          </Box>
        </Box>

        {/* Join Section */}
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 8, md: 12 },
            px: { xs: 2, sm: 3 },
            mb: { xs: 4, md: 6 },
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "primary.main",
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" },
              wordWrap: "break-word",
            }}
          >
            Join Our Team
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              mb: 5,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
              wordWrap: "break-word",
            }}
          >
            Passionate about autonomous vehicles, robotics, or marine
            technology? We're always looking for talented students to join our
            multidisciplinary team.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                window.location.href = "mailto:mechatronicsclub@humber.ca";
              }}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 12px 48px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
                transition: "all 0.3s ease",
              }}
            >
              Apply Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => console.log("Learn more clicked")}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Learn More
            </Button>
          </Stack>
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
