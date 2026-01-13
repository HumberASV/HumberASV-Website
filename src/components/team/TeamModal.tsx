// src/components/team/TeamModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Stack,
  CircularProgress,
  Fade,
  Button,
} from "@mui/material";
import { LinkedIn, GitHub, Email, Language } from "@mui/icons-material";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  program: string;
  links: {
    linkedin: string;
    github: string;
    email: string;
    portfolio?: string;
    blog?: string;
    // Add other possible links as needed
  };
  skills: string[];
}

interface TeamModalProps {
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ open, member, onClose }) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!open) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [open]);

  if (!member) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const openLink = (url: string) => {
    if (url && url !== "#" && url !== "NA.NA@humber.ca") {
      if (url.includes("@")) {
        window.location.href = `mailto:${url}`;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };

  // Check which links are available
  const hasValidLinks = () => {
    const { linkedin, github, email, portfolio, blog } = member.links;
    return (
      (linkedin && linkedin !== "#") ||
      (github && github !== "#") ||
      (email && email !== "#" && email !== "NA.NA@humber.ca") ||
      (portfolio && portfolio !== "#") ||
      (blog && blog !== "#")
    );
  };

  const validLinks = [
    {
      key: "linkedin",
      icon: <LinkedIn />,
      url: member.links.linkedin,
      color: "#0077B5",
      label: "LinkedIn",
      visible: member.links.linkedin && member.links.linkedin !== "#",
    },
    {
      key: "github",
      icon: <GitHub />,
      url: member.links.github,
      color: "#333",
      label: "GitHub",
      visible: member.links.github && member.links.github !== "#",
    },
    {
      key: "email",
      icon: <Email />,
      url: member.links.email,
      color: "#EA4335",
      label: "Email",
      visible:
        member.links.email &&
        member.links.email !== "#" &&
        member.links.email !== "NA.NA@humber.ca",
    },
    {
      key: "portfolio",
      icon: <Language />,
      url: member.links.portfolio,
      color: theme.palette.primary.main,
      label: "Portfolio",
      visible: member.links.portfolio && member.links.portfolio !== "#",
    },
    {
      key: "blog",
      icon: <Language />,
      url: member.links.blog,
      color: "#6E5494",
      label: "Blog",
      visible: member.links.blog && member.links.blog !== "#",
    },
  ].filter((link) => link.visible);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="team-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        backdropFilter: "blur(8px)",
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            width: {
              xs: "95%",
              sm: "85%",
              md: "75%",
              lg: "65%",
              xl: "55%",
            },
            maxWidth: "800px",
            maxHeight: "85vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: `0 24px 64px ${alpha("#000", 0.25)}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* Header Section with Small Image */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-start" },
                gap: 3,
              }}
            >
              {/* Small Profile Image - 3x smaller than before */}
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  flexShrink: 0,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 16px ${alpha("#000", 0.1)}`,
                  backgroundColor: alpha(theme.palette.grey[100], 0.5),
                }}
              >
                {!imageLoaded && !imageError && (
                  <CircularProgress
                    size={40}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1,
                    }}
                  />
                )}

                {imageError ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontSize: "2.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {member.name.charAt(0)}
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={member.image}
                    alt={member.name}
                    loading="eager"
                    decoding="async"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center center",
                      display: "block",
                      opacity: imageLoaded ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                )}
              </Box>

              {/* Name & Basic Info */}
              <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                <Typography
                  id="team-modal-title"
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#006687",
                    fontWeight: 700,
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                    mb: 0.5,
                  }}
                >
                  {member.role}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    fontStyle: "italic",
                    mb: 2,
                  }}
                >
                  {member.program}
                </Typography>
              </Box>
            </Box>

            {/* Skills Section */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "text.primary",
                  fontSize: "1.1rem",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Skills & Expertise
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
                {member.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      height: 28,
                      borderRadius: 16,
                      px: 1.5,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}`,
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Links Section - Commented out for now */}
            {hasValidLinks() && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "text.primary",
                    fontSize: "1.1rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Connect
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {validLinks.map((link) => (
                    <IconButton
                      key={link.key}
                      onClick={() => openLink(link.url || "#")}
                      size="small"
                      sx={{
                        backgroundColor: alpha(link.color, 0.1),
                        color: link.color,
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: alpha(link.color, 0.2),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      aria-label={link.label}
                      title={link.label}
                    >
                      {link.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Close Button at Bottom */}
            <Box sx={{ pt: 2 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderWidth: 1.5,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: "primary.main",
                  "&:hover": {
                    borderWidth: 1.5,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TeamModal;
