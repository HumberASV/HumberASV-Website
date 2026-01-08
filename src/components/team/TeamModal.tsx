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
  Avatar,
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
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
      aria-describedby="team-modal-description"
      sx={{
        display: "flex",
        alignItems: { xs: "flex-end", sm: "center" },
        justifyContent: "center",
        p: { xs: 0, sm: 2 },
        backdropFilter: "blur(4px)",
      }}
    >
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
          boxShadow: theme.shadows[24],
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
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(8px)",
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: theme.shadows[2],
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
              borderRight: { md: `1px solid ${theme.palette.divider}` },
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!imageLoaded && (
              <CircularProgress
                size={60}
                sx={{
                  position: "absolute",
                  zIndex: 1,
                }}
              />
            )}

            {imageError ? (
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 0,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  fontSize: "4rem",
                }}
              >
                {member.name.charAt(0)}
              </Avatar>
            ) : (
              <Box
                component="img"
                src={member.image}
                alt={member.name}
                loading="eager"
                onLoad={handleImageLoad}
                onError={handleImageError}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  opacity: imageLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            )}

            {isMobile && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: alpha(theme.palette.background.paper, 0.85),
                  backdropFilter: "blur(10px)",
                  p: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                    mb: 1,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.accent?.main || "#00d4ff",
                    fontWeight: 700,
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
            }}
          >
            {/* Name & Role - Desktop */}
            {!isMobile && (
              <Stack spacing={1.5}>
                <Typography
                  id="team-modal-title"
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    fontSize: { md: "2.5rem", lg: "3rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.accent?.main || "#00d4ff",
                    fontWeight: 700,
                    fontSize: { md: "1.5rem", lg: "1.75rem" },
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
                  fontWeight: 700,
                  mb: { xs: 2, md: 3 },
                  color: "text.primary",
                  fontSize: "1.1rem",
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
                  fontWeight: 700,
                  mb: { xs: 2, md: 3 },
                  color: "text.primary",
                  fontSize: "1.1rem",
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
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      height: 36,
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

            {/* Contact Section */}
            <Box
              sx={{
                mt: "auto",
                pt: { xs: 2, md: 3 },
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 2, md: 3 },
                  color: "text.primary",
                  fontSize: "1.1rem",
                }}
              >
                Get In Touch
              </Typography>
              <Stack
                direction="row"
                spacing={{ xs: 2, md: 3 }}
                sx={{
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <IconButton
                  href={member.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  size={isSmallMobile ? "medium" : "large"}
                  sx={{
                    bgcolor: alpha("#0077b5", 0.08),
                    color: "#0077b5",
                    width: { xs: 52, sm: 56, md: 60 },
                    height: { xs: 52, sm: 56, md: 60 },
                    borderRadius: "50%",
                    border: `1px solid ${alpha("#0077b5", 0.2)}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#0077b5",
                      color: "white",
                    },
                  }}
                >
                  <LinkedIn fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  href={member.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  size={isSmallMobile ? "medium" : "large"}
                  sx={{
                    bgcolor: alpha("#333", 0.08),
                    color: "#333",
                    width: { xs: 52, sm: 56, md: 60 },
                    height: { xs: 52, sm: 56, md: 60 },
                    borderRadius: "50%",
                    border: `1px solid ${alpha("#333", 0.2)}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#333",
                      color: "white",
                    },
                  }}
                >
                  <GitHub fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  href={`mailto:${member.links.email}`}
                  size={isSmallMobile ? "medium" : "large"}
                  sx={{
                    bgcolor: alpha(
                      theme.palette.accent?.main || "#00d4ff",
                      0.08
                    ),
                    color: theme.palette.accent?.main || "#00d4ff",
                    width: { xs: 52, sm: 56, md: 60 },
                    height: { xs: 52, sm: 56, md: 60 },
                    borderRadius: "50%",
                    border: `1px solid ${alpha(
                      theme.palette.accent?.main || "#00d4ff",
                      0.2
                    )}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: theme.palette.accent?.main || "#00d4ff",
                      color: "white",
                    },
                  }}
                >
                  <Email fontSize={isSmallMobile ? "small" : "medium"} />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TeamModal;
