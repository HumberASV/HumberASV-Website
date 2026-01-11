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
} from "@mui/material";
import { Close } from "@mui/icons-material";

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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="team-modal-title"
      sx={{
        display: "flex",
        alignItems: { xs: "flex-end", sm: "center" },
        justifyContent: "center",
        p: { xs: 0, sm: 2 },
        backdropFilter: "blur(4px)",
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
              xl: "1200px",
            },
            height: { xs: "95vh", sm: "90vh", md: "85vh" },
            maxHeight: { xs: "95vh", sm: "90vh", md: "800px" },
            bgcolor: "background.paper",
            borderRadius: { xs: "24px 24px 0 0", sm: 4 },
            boxShadow: `0 48px 120px ${alpha("#000", 0.3)}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            mx: "auto",
            my: { xs: 0, sm: "auto" },
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
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
              "&:hover": {
                bgcolor: "background.paper",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
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
            }}
          >
            {/* Image Section */}
            <Box
              sx={{
                width: { xs: "100%", md: "40%" },
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
                    transition: "opacity 0.5s ease",
                  }}
                />
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
              }}
            >
              {/* Name & Role */}
              <Stack spacing={1.5}>
                <Typography
                  id="team-modal-title"
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "primary.main",
                    fontSize: { xs: "1.75rem", sm: "2.5rem", lg: "3rem" },
                    lineHeight: 1.1,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#006687",
                    fontWeight: 800,
                    fontSize: { xs: "1.1rem", sm: "1.5rem", lg: "1.75rem" },
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
                  }}
                >
                  {member.program}
                </Typography>
              </Stack>

              {/* Bio Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    color: "text.primary",
                    fontSize: "1.1rem",
                  }}
                >
                  About
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.7,
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                  }}
                >
                  {member.bio}
                </Typography>
              </Box>

              {/* Skills Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    color: "text.primary",
                    fontSize: "1.1rem",
                  }}
                >
                  Skills
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
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
                        height: 32,
                        borderRadius: 20,
                        px: 1.5,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TeamModal;
