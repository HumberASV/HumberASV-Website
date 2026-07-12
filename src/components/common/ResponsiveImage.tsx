import { Box, type SxProps, type Theme } from "@mui/material";
import { useState } from "react";
import MediaLoader from "./MediaLoader";

interface ResponsiveImageProps {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  fetchPriority?: "high" | "low" | "auto";
  /** Defaults to browser-eager. Never pass "lazy" for an LCP image. */
  loading?: "eager" | "lazy";
  sx?: SxProps<Theme>;
}

const ResponsiveImage = ({ src, srcSet, sizes, alt, fetchPriority, loading, sx }: ResponsiveImageProps) => {
  const [loaded, setLoaded] = useState(false);
  // High-priority images are the LCP / above-the-fold hero assets — they are
  // preloaded to appear instantly, so a loader overlay would only flash over
  // the very content we want painted first. Render them bare (sizing sx applied
  // straight to the <img>) so nothing competes with or delays that first paint.
  if (fetchPriority === "high") {
    return (
      <Box
        component="img"
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        fetchPriority={fetchPriority}
        loading={loading}
        sx={sx}
      />
    );
  }

  return (
    <Box sx={{ position: "relative", display: "block", lineHeight: 0, ...sx }}>
      <Box
        component="img"
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        fetchPriority={fetchPriority}
        loading={loading}
        // Cached images can be complete before onLoad attaches, so seed from the node.
        ref={(node: HTMLImageElement | null) => {
          if (node?.complete) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        sx={{ width: "100%", height: "100%", objectFit: "inherit", display: "block" }}
      />
      <MediaLoader visible={!loaded} />
    </Box>
  );
};

export type { ResponsiveImageProps };
export default ResponsiveImage;
