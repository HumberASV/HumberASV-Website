import { Box, IconButton, Typography, alpha, useTheme } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState, type ReactNode } from "react";
import ResponsiveVideo, { type ResponsiveVideoSources } from "../common/ResponsiveVideo";

const DEFAULT_VIDEO_SOURCES: ResponsiveVideoSources = {
  xs: "/videos/technical-difficulty/technical-difficulty_SmallPhone.mp4",
  sm: "/videos/technical-difficulty/technical-difficulty_Phone.mp4",
  md: "/videos/technical-difficulty/technical-difficulty_Tablet.mp4",
  lg: "/videos/technical-difficulty/technical-difficulty_Desktop.mp4",
};

interface VideoCardProps {
  title?: string;
  body?: ReactNode;
  icon?: ReactNode;
  partImageOverlay?: ReactNode;
  videoSources?: ResponsiveVideoSources;
  poster?: string;
  className?: string;
}

const VideoCard = ({
  title = "Precision Rudder Control",
  body = "A hydrodynamically optimized rudder gives the vessel tight, responsive turns even at low speed.",
  icon,
  partImageOverlay,
  videoSources = DEFAULT_VIDEO_SOURCES,
  poster,
  className,
}: VideoCardProps) => {
  const theme = useTheme();
  const [playing, setPlaying] = useState(true);

  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "439 / 247",
          background: `linear-gradient(29deg, ${theme.palette.primary.dark} 15%, ${theme.palette.primary.light} 85%)`,
          clipPath: "polygon(0 0, 100% 0, 100% 72%, 0 100%)",
        }}
      >
        <ResponsiveVideo
          sources={videoSources}
          poster={poster}
          playing={playing}
          onPlayingChange={setPlaying}
          ariaLabel={typeof title === "string" ? `${title} video` : "Feature video"}
          sx={{ position: "absolute", inset: 0 }}
        />
        <Typography
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            fontSize: "11px",
            letterSpacing: "2.2px",
            color: alpha("#fff", 0.35),
          }}
        >
          VIDEO
        </Typography>
        <IconButton
          size="small"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause video" : "Play video"}
          sx={{
            position: "absolute",
            left: 11,
            bottom: 20,
            width: 36,
            height: 36,
            borderRadius: "8px",
            bgcolor: alpha("#000", 0.55),
            "&:hover": { bgcolor: alpha("#000", 0.7) },
          }}
        >
          {playing ? (
            <PauseIcon sx={{ fontSize: 14, color: "#fff" }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: 14, color: "#fff" }} />
          )}
        </IconButton>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
          pt: "15px",
          px: 3,
          pb: 3,
        }}
      >
        {icon && <Box sx={{ width: 26, height: 26, flexShrink: 0 }}>{icon}</Box>}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: `'Montserrat', 'Roboto', sans-serif`,
              fontWeight: 600,
              fontSize: "22.4px",
              color: "primary.dark",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "14.4px",
              lineHeight: 1.5,
              color: "text.secondary",
              whiteSpace: "pre-line",
            }}
          >
            {body}
          </Typography>
        </Box>
      </Box>

      {partImageOverlay && (
        <Box
          sx={{
            position: "absolute",
            right: "5%",
            top: "6%",
            width: "38%",
            filter: `drop-shadow(0px 12px 24px ${alpha("#000", 0.35)})`,
            pointerEvents: "none",
          }}
        >
          {partImageOverlay}
        </Box>
      )}
    </Box>
  );
};

export type { VideoCardProps };
export default VideoCard;
