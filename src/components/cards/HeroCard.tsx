import { Box, IconButton, Typography, alpha } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import type { ReactNode } from "react";
import ResponsiveImage from "../common/ResponsiveImage";

interface HeroCardFeature {
  icon?: ReactNode;
  title: string;
  description: string;
}

interface HeroCardProps {
  image: string;
  imageSrcSet?: string;
  imageSizes?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  isVideo?: boolean;
  icon?: ReactNode;
  title: string;
  description?: string;
  linkText?: string;
  features?: HeroCardFeature[];
  className?: string;
}

const HeroCard = ({
  image,
  imageSrcSet,
  imageSizes,
  imageAlt,
  imagePosition = "right",
  isVideo = false,
  icon,
  title,
  description,
  linkText,
  features,
  className,
}: HeroCardProps) => {
  const isMediaLeft = imagePosition === "left";

  const textPanel = (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        width: { xs: "100%", md: 430 },
        flexShrink: 0,
        bgcolor: "#eff2f4",
        px: { xs: 4, md: 6 },
        py: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: features ? "20px" : "16px",
        borderTopLeftRadius: isMediaLeft ? 0 : "20px",
        borderBottomLeftRadius: isMediaLeft ? 0 : "20px",
        borderTopRightRadius: isMediaLeft ? "20px" : 0,
        borderBottomRightRadius: isMediaLeft ? "20px" : 0,
      }}
    >
      {features ? (
        <>
          <Typography
            sx={{
              fontFamily: `'Montserrat', 'Roboto', sans-serif`,
              fontWeight: 800,
              fontSize: "26px",
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          {features.map((feature, i) => (
            <Box key={i} sx={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              {feature.icon && (
                <Box sx={{ width: 28, height: 28, flexShrink: 0 }}>{feature.icon}</Box>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: `'Montserrat', 'Roboto', sans-serif`,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "accent.contrastText",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: alpha("#000", 0.75) }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </>
      ) : (
        <>
          {icon && <Box sx={{ width: 40, height: 40 }}>{icon}</Box>}
          <Typography
            sx={{
              fontFamily: `'Montserrat', 'Roboto', sans-serif`,
              fontWeight: 800,
              fontSize: "28px",
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography sx={{ fontSize: "15px", lineHeight: 1.5, color: alpha("#000", 0.75) }}>
              {description}
            </Typography>
          )}
          {linkText && (
            <Typography
              sx={{ fontWeight: 500, fontSize: "14.4px", color: "primary.dark", whiteSpace: "pre-wrap" }}
            >
              {linkText}
            </Typography>
          )}
        </>
      )}
    </Box>
  );

  const mediaPanel = (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        borderTopLeftRadius: isMediaLeft ? "20px" : 0,
        borderBottomLeftRadius: isMediaLeft ? "20px" : 0,
        borderTopRightRadius: isMediaLeft ? 0 : "20px",
        borderBottomRightRadius: isMediaLeft ? 0 : "20px",
      }}
    >
      {imageSrcSet ? (
        <ResponsiveImage
          src={image}
          srcSet={imageSrcSet}
          sizes={imageSizes ?? "(min-width: 900px) 60vw, 100vw"}
          alt={imageAlt ?? ""}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Box
          component="img"
          src={image}
          alt={imageAlt ?? ""}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
      {isVideo && (
        <>
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
            sx={{
              position: "absolute",
              left: 11,
              bottom: 16,
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: alpha("#000", 0.55),
              "&:hover": { bgcolor: alpha("#000", 0.7) },
            }}
          >
            <PauseIcon sx={{ fontSize: 14, color: "#fff" }} />
          </IconButton>
        </>
      )}
    </Box>
  );

  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        overflow: "hidden",
        borderRadius: "20px",
      }}
    >
      {isMediaLeft ? (
        <>
          {mediaPanel}
          {textPanel}
        </>
      ) : (
        <>
          {textPanel}
          {mediaPanel}
        </>
      )}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: isMediaLeft ? { md: "calc(430px - 60px)" } : undefined,
          right: isMediaLeft ? undefined : { md: "calc(430px - 60px)" },
          width: "160px",
          bgcolor: "accent.main",
          clipPath: "polygon(45% 0, 100% 0, 55% 100%, 0 100%)",
          zIndex: 2,
          pointerEvents: "none",
          display: { xs: "none", md: "block" },
        }}
      />
    </Box>
  );
};

export type { HeroCardProps, HeroCardFeature };
export default HeroCard;
