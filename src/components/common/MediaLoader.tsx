import { Box, type SxProps, type Theme } from "@mui/material";
import loadingSvg from "../../assets/loading.svg";

interface MediaLoaderProps {
  /** When false the overlay fades out and stops catching pointer events. */
  visible: boolean;
  /** Diameter of the animated porthole, in px. Defaults to 100. */
  size?: number;
  sx?: SxProps<Theme>;
}

/**
 * Absolutely-positioned loading overlay for the large photo/video assets.
 * Renders the self-animating boat porthole (`loading.svg`) centred on a water
 * backdrop that matches the SVG, so the square edges blend into the scene while
 * the underlying asset streams in. The parent must be `position: relative`.
 */
const MediaLoader = ({ visible, size = 100, sx }: MediaLoaderProps) => (
  <Box
    aria-hidden={!visible}
    sx={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // Matches --color-water in loading.svg so the porthole blends edge-to-edge.
      bgcolor: "#00435c",
      opacity: visible ? 1 : 0,
      visibility: visible ? "visible" : "hidden",
      transition: "opacity 0.4s ease, visibility 0.4s ease",
      pointerEvents: "none",
      zIndex: 3,
      ...sx,
    }}
  >
    <Box
      component="img"
      src={loadingSvg}
      alt="Loading"
      sx={{ width: size, height: size, maxWidth: "70%", maxHeight: "70%" }}
    />
  </Box>
);

export type { MediaLoaderProps };
export default MediaLoader;
