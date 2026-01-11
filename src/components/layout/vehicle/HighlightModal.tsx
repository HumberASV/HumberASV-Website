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
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: "1.1rem",
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
              maxHeight: "60vh",
              overflowY: "auto",
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.8,
                color: "text.primary",
                letterSpacing: "-0.2px",
              }}
            >
              {content}
            </Typography>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              textAlign: "right",
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
