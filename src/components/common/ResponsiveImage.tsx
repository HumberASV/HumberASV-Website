import { Box, type SxProps, type Theme } from "@mui/material";

interface ResponsiveImageProps {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  fetchPriority?: "high" | "low" | "auto";
  sx?: SxProps<Theme>;
}

const ResponsiveImage = ({ src, srcSet, sizes, alt, fetchPriority, sx }: ResponsiveImageProps) => (
  <Box component="img" src={src} srcSet={srcSet} sizes={sizes} alt={alt} fetchPriority={fetchPriority} sx={sx} />
);

export type { ResponsiveImageProps };
export default ResponsiveImage;
