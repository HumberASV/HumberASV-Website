// src/components/layout/vehicle/HighlightModal.tsx
import React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Button,
  Fade,
  Backdrop,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface HighlightModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const HighlightModal: React.FC<HighlightModalProps> = ({
  open,
  onClose,
  title,
  content,
}) => {
  const theme = useTheme();

  // Function to parse content with proper paragraph formatting
  const renderContent = () => {
    // Split by double newlines to get paragraphs
    const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");

    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a header (ends with colon or starts with bold marker)
      const isHeader =
        paragraph.includes(":") ||
        paragraph.trim().toUpperCase() === paragraph.trim() ||
        (paragraph.includes("\n") === false && paragraph.length < 100);

      // Split into lines for bullets/sub-paragraphs
      const lines = paragraph.split("\n").filter((line) => line.trim() !== "");

      if (lines.length > 1) {
        return (
          <Box key={index} sx={{ mb: 3 }}>
            {lines.map((line, lineIndex) => {
              const isBulletPoint =
                line.trim().startsWith("•") ||
                line.trim().startsWith("-") ||
                (line.includes(":") && lineIndex === 0);

              if (lineIndex === 0 && isHeader) {
                return (
                  <Typography
                    key={`${index}-${lineIndex}`}
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      mb: 2,
                      fontSize: "1.1rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {line.trim()}
                  </Typography>
                );
              }

              if (isBulletPoint) {
                return (
                  <Box
                    key={`${index}-${lineIndex}`}
                    sx={{
                      display: "flex",
                      mb: 1,
                      ml: 2,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                        mr: 1,
                        fontWeight: 600,
                      }}
                    >
                      •
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.7,
                        color: "text.primary",
                        flex: 1,
                      }}
                    >
                      {line.trim().replace(/^[•-]\s*/, "")}
                    </Typography>
                  </Box>
                );
              }

              return (
                <Typography
                  key={`${index}-${lineIndex}`}
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    lineHeight: 1.7,
                    color: "text.primary",
                    mb: lineIndex === lines.length - 1 ? 0 : 1.5,
                  }}
                >
                  {line.trim()}
                </Typography>
              );
            })}
          </Box>
        );
      }

      // Single line paragraph
      if (isHeader) {
        return (
          <Typography
            key={index}
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
              mt: index > 0 ? 3 : 0,
              fontSize: "1.1rem",
              lineHeight: 1.4,
            }}
          >
            {paragraph.trim()}
          </Typography>
        );
      }

      // Regular paragraph
      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.7,
            color: "text.primary",
            mb: 3,
          }}
        >
          {paragraph.trim()}
        </Typography>
      );
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95vw", sm: "90vw", md: "80vw", lg: "700px" },
            maxWidth: "900px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: `0 24px 64px ${alpha("#000", 0.4)}`,
            outline: "none",
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              pt: { xs: 3, md: 3.5 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              position: "relative",
              borderBottom: `1px solid ${alpha("#fff", 0.2)}`,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                lineHeight: 1.2,
                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Technical Deep Dive
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: { xs: 2, md: 3 },
                top: { xs: 1.5, md: 2 },
                color: "white",
                width: 40,
                height: 40,
                "&:hover": {
                  backgroundColor: alpha("#fff", 0.2),
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              overflowY: "auto",
              flexGrow: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: alpha(theme.palette.primary.main, 0.05),
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: alpha(theme.palette.primary.main, 0.2),
                borderRadius: "4px",
                "&:hover": {
                  background: alpha(theme.palette.primary.main, 0.3),
                },
              },
            }}
          >
            {renderContent()}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                fontWeight: 600,
                px: 3,
                py: 1.25,
                borderRadius: 2,
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.4
                  )}`,
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default HighlightModal;
