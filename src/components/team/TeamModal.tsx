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
  useMediaQuery,
  Stack,
  CircularProgress,
  Fade,
  Button,
} from "@mui/material";
import { LinkedIn, GitHub, Email, Close } from "@mui/icons-material";

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

interface TeamModalProps {
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ open, member, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="team-modal-title"
      aria-describedby="team-modal-description"
      sx={{
        display: "flex",
        alignItems: { xs: "flex-end", sm: "center" },
        justifyContent: "center",
        p: { xs: 0, sm: 2 },
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "90vw",
              md: "85vw",
              lg: "80vw",
              xl: "1400px",
            },
            height: { xs: "95vh", sm: "90vh", md: "85vh" },
            maxHeight: { xs: "95vh", sm: "90vh", md: "800px" },
            bgcolor: "background.paper",
            borderRadius: { xs: "24px 24px 0 0", sm: 4 },
            boxShadow: `
              0 0 0 1px ${alpha(theme.palette.divider, 0.1)},
              0 48px 120px ${alpha("#000", 0.3)}
            `,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            mx: "auto",
            my: { xs: 0, sm: "auto" },
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              zIndex: 10,
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              boxShadow: `0 4px 20px ${alpha("#000", 0.15)}`,
              "&:hover": {
                bgcolor: "background.paper",
                transform: "scale(1.05) translateZ(0)",
                boxShadow: `0 8px 32px ${alpha("#000", 0.2)}`,
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: "translateZ(0)",
            }}
          >
            <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Image Section */}
            <Box
              sx={{
                width: { xs: "100%", md: "45%" },
                height: { xs: "300px", md: "100%" },
                minHeight: { xs: "300px", md: "auto" },
                position: "relative",
                overflow: "hidden",
                bgcolor: alpha(theme.palette.grey[50], 0.5),
                borderRight: {
                  md: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                },
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "translateZ(0)",
              }}
            >
              {!imageLoaded && !imageError && (
                <CircularProgress
                  size={60}
                  sx={{
                    position: "absolute",
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
                    fontSize: "4rem",
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
                    transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    imageRendering: "auto",
                    WebkitTransform: "translateZ(0)",
                    MozTransform: "translateZ(0)",
                    msTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                    transformOrigin: "center center",
                  }}
                />
              )}

              {/* Subtle gradient overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(to bottom, 
                    ${alpha("#000", 0)} 0%,
                    ${alpha("#000", 0.05)} 100%
                  )`,
                  pointerEvents: "none",
                  mixBlendMode: "multiply",
                }}
              />

              {/* Mobile name/role overlay */}
              {isMobile && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: alpha(theme.palette.background.paper, 0.92),
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    p: 3,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: "primary.main",
                      fontSize: { xs: "1.75rem", sm: "2rem" },
                      mb: 1,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#006687",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                    }}
                  >
                    {member.role}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Info Section */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, sm: 4, md: 5 },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, md: 4 },
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Name & Role - Desktop */}
              {!isMobile && (
                <Stack spacing={1.5}>
                  <Typography
                    id="team-modal-title"
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      color: "primary.main",
                      fontSize: { md: "2.5rem", lg: "3rem" },
                      lineHeight: 1.1,
                      letterSpacing: "-1px",
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#006687",
                      fontWeight: 800,
                      fontSize: { md: "1.5rem", lg: "1.75rem" },
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {member.role}
                  </Typography>
                </Stack>
              )}

              {/* Bio Section */}
              <Box sx={{ mb: { xs: 1, md: 2 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: { xs: 2, md: 3 },
                    color: "text.primary",
                    fontSize: "1.1rem",
                    letterSpacing: "-0.2px",
                  }}
                >
                  About
                </Typography>
                <Typography
                  id="team-modal-description"
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                  }}
                >
                  {member.bio}
                </Typography>
              </Box>

              {/* Skills Section */}
              <Box sx={{ mb: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: { xs: 2, md: 3 },
                    color: "text.primary",
                    fontSize: "1.1rem",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Skills & Expertise
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5} useFlexGap>
                  {member.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="medium"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        height: 36,
                        borderRadius: 20,
                        px: 1.5,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.15
                          ),
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Contact Section */}
              <Box
                sx={{
                  mt: "auto",
                  pt: { xs: 2, md: 3 },
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: { xs: 2, md: 3 },
                    color: "text.primary",
                    fontSize: "1.1rem",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Get In Touch
                </Typography>
                <Stack direction="row" spacing={2} mb={3}>
                  {member.links.linkedin !== "#" && (
                    <IconButton
                      onClick={() => openLink(member.links.linkedin)}
                      size="large"
                      sx={{
                        backgroundColor: alpha("#0077B5", 0.1),
                        color: "#0077B5",
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: alpha("#0077B5", 0.2),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      aria-label="LinkedIn"
                    >
                      <LinkedIn />
                    </IconButton>
                  )}
                  {member.links.github !== "#" && (
                    <IconButton
                      onClick={() => openLink(member.links.github)}
                      size="large"
                      sx={{
                        backgroundColor: alpha("#333", 0.1),
                        color: "#333",
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: alpha("#333", 0.2),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      aria-label="GitHub"
                    >
                      <GitHub />
                    </IconButton>
                  )}
                  {member.links.email !== "#" &&
                    member.links.email !== "NA.NA@humber.ca" && (
                      <IconButton
                        onClick={() => openLink(`mailto:${member.links.email}`)}
                        size="large"
                        sx={{
                          backgroundColor: alpha("#EA4335", 0.1),
                          color: "#EA4335",
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: alpha("#EA4335", 0.2),
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        aria-label="Email"
                      >
                        <Email />
                      </IconButton>
                    )}
                </Stack>

                <Button
                  variant="outlined"
                  onClick={onClose}
                  fullWidth
                  sx={{
                    py: 1.75,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderWidth: 2,
                    borderRadius: 2,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: "primary.main",
                    "&:hover": {
                      borderWidth: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TeamModal;
