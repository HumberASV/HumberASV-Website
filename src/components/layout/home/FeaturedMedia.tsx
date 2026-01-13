import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { PlayArrow, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const FeaturedMedia = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ position: "relative" }}>
      <Card
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: theme.shadows[4],
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
            "& .play-button": {
              opacity: 1,
              transform: "scale(1.1)",
            },
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="400"
            image="https://placehold.co/800x450/00435c/white/png?text=Our+ASV+In+Action"
            alt="Our Autonomous Surface Vehicle in testing"
            sx={{ objectFit: "cover" }}
          />
          <IconButton
            className="play-button"
            onClick={handleOpen}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              opacity: 0.9,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.accent.main,
                color: theme.palette.getContrastText(theme.palette.accent.main),
              },
              width: 64,
              height: 64,
            }}
          >
            <PlayArrow sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "80%", md: "70%" },
            height: { xs: "auto", sm: "80%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <Close />
          </IconButton>
          <Box
            component="iframe"
            width="100%"
            height="100%"
            minHeight="400px"
            src="https://www.youtube.com/watch?v=d_82qFZTz_M"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{ display: "block" }}
          />
        </Box>
      </Modal>

      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", opacity: 0.7 }}
      >
        Click to watch our ASV in action during testing
      </Typography>
    </Box>
  );
};

export default FeaturedMedia;
