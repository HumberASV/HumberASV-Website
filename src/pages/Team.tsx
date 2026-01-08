import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Chip,
  Button,
} from "@mui/material";
import {
  LinkedIn,
  GitHub,
  Email,
  Engineering,
  Code,
  Settings,
  School,
  Business,
} from "@mui/icons-material";

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
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Team Leads Section
  const teamLeads = [
    {
      id: 0,
      name: "Johnathan Rivera",
      role: "Technical Director",
      image: "https://placehold.co/200x200/00435c/white/png?text=JR",
      bio: "Oversees all technical aspects of the ASV project. Coordinates between engineering disciplines and ensures technical excellence.",
      links: {
        linkedin: "#",
        github: "#",
        email: "johnathan.rivera@humber.ca",
      },
      skills: ["Project Leadership", "Systems Engineering", "Robotics"],
    },
    {
      id: -1,
      name: "Timothy Noir",
      role: "Team Captain",
      image: "https://placehold.co/200x200/00435c/white/png?text=AP",
      bio: "Leads the overall team strategy, competition preparation, and represents Humber ASV in all official capacities.",
      links: {
        linkedin: "#",
        github: "#",
        email: "timothy.noir@humber.ca",
      },
      skills: ["Leadership", "Competition Strategy", "Team Management"],
    },
    {
      id: -2,
      name: "Shawn Minerva",
      role: "Operations Lead",
      image: "https://placehold.co/200x200/00435c/white/png?text=MC",
      bio: "Manages logistics, procurement, testing operations, and field deployments for the autonomous surface vehicle.",
      links: {
        linkedin: "#",
        github: "#",
        email: "shawn.minerva@humber.ca",
      },
      skills: ["Operations", "Logistics", "Field Testing"],
    },
  ];

  // Team members by discipline
  const teamSections = [
    {
      title: "Mechatronics Engineering",
      icon: <Engineering sx={{ fontSize: 32, color: "primary.main" }} />,
      members: [
        {
          id: 1,
          name: "Jone Doe",
          role: "Mechanical Lead",
          image: "https://placehold.co/200x200/00435c/white/png?text=SC",
          bio: "Specialized in hull design and propulsion systems. Passionate about marine robotics.",
          links: {
            linkedin: "#",
            github: "#",
            email: "sarah.chen@humber.ca",
          },
          skills: ["CAD", "Fluid Dynamics", "3D Printing"],
        },
        {
          id: 2,
          name: "Jane Smith",
          role: "Structural Design",
          image: "https://placehold.co/200x200/00435c/white/png?text=MR",
          bio: "Focuses on vehicle stability and material selection for optimal performance.",
          links: {
            linkedin: "#",
            github: "#",
            email: "mike.rodriguez@humber.ca",
          },
          skills: ["SolidWorks", "FEA", "Prototyping"],
        },
      ],
    },
    {
      title: "Electronics & Electrical",
      icon: <Settings sx={{ fontSize: 32, color: "primary.main" }} />,
      members: [
        {
          id: 3,
          name: "Lyman Combs",
          role: "Electrical Lead",
          image: "https://placehold.co/200x200/00435c/white/png?text=DK",
          bio: "Expert in power systems and circuit design for autonomous vehicles.",
          links: {
            linkedin: "#",
            github: "#",
            email: "david.kim@humber.ca",
          },
          skills: ["PCB Design", "Power Management", "Sensors"],
        },
        {
          id: 4,
          name: "Marcelino Gill",
          role: "Embedded Systems",
          image: "https://placehold.co/200x200/00435c/white/png?text=EW",
          bio: "Specializes in microcontroller programming and hardware integration.",
          links: {
            linkedin: "#",
            github: "#",
            email: "emily.watson@humber.ca",
          },
          skills: ["Arduino", "Raspberry Pi", "C++"],
        },
      ],
    },
    {
      title: "Computer Engineering",
      icon: <Code sx={{ fontSize: 32, color: "primary.main" }} />,
      members: [
        {
          id: 5,
          name: "Anastasia Lam",
          role: "Software Lead",
          image: "https://placehold.co/200x200/00435c/white/png?text=AT",
          bio: "Leads the development of autonomy algorithms and navigation systems.",
          links: {
            linkedin: "#",
            github: "#",
            email: "alex.thompson@humber.ca",
          },
          skills: ["Python", "ROS", "Computer Vision"],
        },
        {
          id: 6,
          name: "Felton Reed",
          role: "AI & Machine Learning",
          image: "https://placehold.co/200x200/00435c/white/png?text=PS",
          bio: "Develops machine learning models for object detection and path planning.",
          links: {
            linkedin: "#",
            github: "#",
            email: "priya.sharma@humber.ca",
          },
          skills: ["TensorFlow", "OpenCV", "Neural Networks"],
        },
      ],
    },
    {
      title: "Business & Media",
      icon: <Business sx={{ fontSize: 32, color: "primary.main" }} />,
      members: [
        {
          id: 7,
          name: "Tyron Bright",
          role: "Project Manager",
          image: "https://placehold.co/200x200/00435c/white/png?text=JM",
          bio: "Coordinates team efforts and manages project timelines and deliverables.",
          links: {
            linkedin: "#",
            github: "#",
            email: "jessica.miller@humber.ca",
          },
          skills: ["Project Management", "Communication", "Documentation"],
        },
        {
          id: 8,
          name: "Numbers Ball",
          role: "Media & Outreach",
          image: "https://placehold.co/200x200/00435c/white/png?text=MB",
          bio: "Handles social media, sponsorships and public relations for the team.",
          links: {
            linkedin: "#",
            github: "#",
            email: "marcus.brown@humber.ca",
          },
          skills: ["Marketing", "Graphic Design", "Networking"],
        },
      ],
    },
  ];

  const handleCardHover = (memberId: number) => {
    setActiveCard(memberId);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  // Render team members grid (generic function for both leads and sections)
  const renderTeamGrid = (
    members: TeamMember[],
    title?: string,
    icon?: React.ReactNode
  ) => (
    <Box sx={{ mb: { xs: 6, md: 8 } }}>
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          justifyContent: "center",
        }}
      >
        {icon}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          {title || "Team"}
        </Typography>
      </Box>

      {/* Team Members Grid */}
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
        }}
      >
        {members.map((member) => (
          <Box
            key={member.id}
            sx={{
              display: "flex",
              transition: "transform 0.3s ease",
              transform:
                activeCard && activeCard !== member.id
                  ? "scale(0.95)"
                  : "scale(1)",
              opacity: activeCard && activeCard !== member.id ? 0.8 : 1,
            }}
          >
            <Card
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "background.paper",
                borderRadius: 3,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                transform:
                  activeCard === member.id ? "scale(1.05)" : "scale(1)",
                zIndex: activeCard === member.id ? 10 : 1,
                "&:hover": {
                  boxShadow: `0 12px 48px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                },
              }}
              onMouseEnter={() => handleCardHover(member.id)}
              onMouseLeave={handleCardLeave}
            >
              <CardContent
                sx={{
                  p: 3,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Avatar */}
                <Avatar
                  src={member.image}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    border: `3px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  }}
                />

                {/* Name and Role */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 0.5,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "accent.main",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {member.role}
                </Typography>

                {/* Bio (shown on hover) */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    height: activeCard === member.id ? "auto" : 0,
                    opacity: activeCard === member.id ? 1 : 0,
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  {member.bio}
                </Typography>

                {/* Skills Chips */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    justifyContent: "center",
                    mb: 2,
                    height: activeCard === member.id ? "auto" : 0,
                    opacity: activeCard === member.id ? 1 : 0,
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  {member.skills.map((skill: string, index: number) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontSize: "0.7rem",
                      }}
                    />
                  ))}
                </Box>

                {/* Social Links */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    height: activeCard === member.id ? "auto" : 0,
                    opacity: activeCard === member.id ? 1 : 0,
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: alpha("#0077b5", 0.1),
                      color: "#0077b5",
                      "&:hover": {
                        backgroundColor: "#0077b5",
                        color: "white",
                      },
                    }}
                  >
                    <LinkedIn fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: alpha("#333", 0.1),
                      color: "#333",
                      "&:hover": {
                        backgroundColor: "#333",
                        color: "white",
                      },
                    }}
                  >
                    <GitHub fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.accent.main, 0.1),
                      color: theme.palette.accent.main,
                      "&:hover": {
                        backgroundColor: theme.palette.accent.main,
                        color: theme.palette.accent.contrastText,
                      },
                    }}
                  >
                    <Email fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              mb: 2,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #00435c 0%, #006687 100%)"
                  : "linear-gradient(135deg, #a3e7ff 0%, #80d4ff 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
            A multidisciplinary team of passionate students and professionals
            dedicated to advancing autonomous maritime technology.
          </Typography>
        </Box>

        {/* Team Leads Section - NEW */}
        {renderTeamGrid(
          teamLeads,
          "Team Leads",
          <Box
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              p: 1.5,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Engineering sx={{ fontSize: 28, color: "primary.main" }} />
          </Box>
        )}

        {/* Discipline Sections */}
        {teamSections.map((section) =>
          renderTeamGrid(section.members, section.title, section.icon)
        )}

        {/* Join Team CTA */}
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            p: { xs: 3, md: 4 },
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <School sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
          >
            Interested in Joining?
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            We're always looking for passionate students from all disciplines to
            join our team.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              fontWeight: 600,
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Apply to Join Team
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Team;
