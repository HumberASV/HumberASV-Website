import { useState, useMemo, lazy, Suspense } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";

// Import banner images
import teamLeadsBanner from "../assets/Team Lead HS-1.jpg";
import fullTeamBanner from "../assets/Team Photo.jpg";

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
        id: -1,
        name: "Dylan Turkson",
        role: "Media Lead",
        image: dylanTurksonHeadshot,
        bio: "Handles social media, sponsorships and public relations for the team.",
        links: { linkedin: "#", github: "#", email: "dylan.turkson@humber.ca" },
        skills: ["Leadership", "Competition Strategy", "Team Management"],
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
        skills: ["Python", "ROS", "Computer Vision"],
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

  // Optimize image loading by preloading only visible images
  useMemo(() => {
    // Preload banner images
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    preloadImage(teamLeadsBanner);
    preloadImage(fullTeamBanner);

    // Preload team lead images (they're visible first)
    teamLeads.forEach((member) => {
      preloadImage(member.image);
    });
  }, [teamLeads]);

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const renderTeamCard = (member: TeamMember) => (
    <Box
      key={member.id}
      sx={{
        display: "flex",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
      }}
      onClick={() => handleCardClick(member)}
    >
      <Card
        sx={{
          width: "100%",
          height: 320,
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: "all 0.3s ease",
          overflow: "hidden",
          position: "relative",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.3),
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
          <Avatar
            src={member.image}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: `4px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}
            >
              {member.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "accent.main", fontWeight: 600 }}
            >
              {member.role}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              mt: 1,
              opacity: 0.7,
            }}
          >
            Click to learn more
          </Typography>
        </CardContent>
      </Card>
    </Box>
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
      {/* 1. Team Leads Banner - No blue overlay */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
          mb: { xs: 6, md: 8 },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: "50vh", sm: "60vh", md: "70vh", lg: "80vh" },
            backgroundImage: `url(${teamLeadsBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            background: alpha("#000", 0.6),
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            py: 2,
            px: 4,
            width: { xs: "90%", sm: "auto" },
            maxWidth: "90%",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              textShadow: "0 4px 20px rgba(0,0,0,0.7)",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Our Leadership
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.6rem" },
              maxWidth: "600px",
              mx: "auto",
              wordWrap: "break-word",
              overflowWrap: "break-word",
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
              fontWeight: 700,
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
            We're a multidisciplinary team of passionate Humber College students
            and professionals dedicated to advancing autonomous maritime
            technology. From mechanical design to AI algorithms, our diverse
            expertise comes together to build innovative solutions for the
            future of autonomous surface vehicles.
          </Typography>
        </Box>

        {/* 3. Full Team Banner - No blue overlay */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            mb: 8,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: "40vh", sm: "50vh", md: "60vh" },
              backgroundImage: `url(${fullTeamBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              color: "white",
              background: alpha("#000", 0.6),
              backdropFilter: "blur(4px)",
              borderRadius: 2,
              py: 1.5,
              px: 3,
              width: { xs: "90%", sm: "auto" },
              maxWidth: "90%",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                wordWrap: "break-word",
              }}
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                textShadow: "0 1px 5px rgba(0,0,0,0.5)",
                fontSize: { xs: "1rem", md: "1.3rem" },
                wordWrap: "break-word",
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
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "2rem", md: "2.8rem" },
              wordWrap: "break-word",
            }}
          >
            Leadership Team
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 3,
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {teamLeads.map(renderTeamCard)}
          </Box>
        </Box>

        {/* 5. REST OF TEAM SECTION */}
        <Box
          sx={{
            mb: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "2rem", md: "2.8rem" },
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
