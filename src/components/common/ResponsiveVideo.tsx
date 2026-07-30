import { Box, useTheme, useMediaQuery, type SxProps, type Theme } from "@mui/material";
import { Suspense, lazy, useState } from "react";
import MediaLoader from "./MediaLoader";

const ReactPlayer = lazy(() => import("react-player"));

interface ResponsiveVideoSources {
  /** 320w MP4 */
  xs: string;
  /** 600w MP4 */
  sm: string;
  /** 900w MP4 */
  md: string;
  /** 1200w MP4 */
  lg: string;
}

interface ResponsiveVideoProps {
  sources: ResponsiveVideoSources;
  /** react-player v3 does not forward `poster` to the <video>; rendered here as an underlay. */
  poster?: string;
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  objectFit?: "cover" | "contain";
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

const ResponsiveVideo = ({
  sources,
  poster,
  playing = true,
  onPlayingChange,
  muted = true,
  loop = true,
  controls = false,
  objectFit = "cover",
  ariaLabel,
  sx,
}: ResponsiveVideoProps) => {
  const theme = useTheme();
  const [ready, setReady] = useState(false);
  // noSsr: resolve the real match on first render so the <video> doesn't mount
  // with the wrong src and interrupt its own play() with a new load request.
  const upLg = useMediaQuery(theme.breakpoints.up("lg"), { noSsr: true });
  const upMd = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const upSm = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  // Crossing a breakpoint swaps src and restarts the loop — acceptable for decorative b-roll.
  const src = upLg ? sources.lg : upMd ? sources.md : upSm ? sources.sm : sources.xs;

  return (
    <Box sx={{ position: "relative", overflow: "hidden", ...sx }}>
      {poster && (
        <Box
          component="img"
          src={poster}
          alt=""
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit }}
        />
      )}
      <Suspense fallback={null}>
        <ReactPlayer
          src={src}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, objectFit }}
          playing={playing}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          preload="metadata"
          aria-label={ariaLabel}
          onReady={() => setReady(true)}
          onPlay={() => onPlayingChange?.(true)}
          onPause={() => onPlayingChange?.(false)}
        />
      </Suspense>
      <MediaLoader visible={!ready} />
    </Box>
  );
};

export type { ResponsiveVideoProps, ResponsiveVideoSources };
export default ResponsiveVideo;
