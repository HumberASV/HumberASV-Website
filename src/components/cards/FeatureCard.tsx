import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FeatureCardProps {
  className?: string;
  children?: ReactNode;
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
}

const FeatureCard = ({
  className,
  children,
  title = "Electrical System",
  description = "keeping power for movement and power for the brain completely independent.",
  showButton = true,
  buttonText = "Learn More",
}: FeatureCardProps) => {
  return (
    <Box
      className={className}
      sx={{
        width: "100%",
        maxWidth: 297,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        pb: "10px",
        overflow: "hidden",
        borderRadius: "20px",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", aspectRatio: "297 / 377" }}>{children}</Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          px: 2.5,
          pb: "5px",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: `'Montserrat', 'Roboto', sans-serif`,
            fontWeight: 600,
            fontSize: "19.2px",
            color: "accent.contrastText",
            width: "100%",
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: "14.4px", lineHeight: 1.5, color: "text.secondary", width: "100%" }}>
          {description}
        </Typography>
      </Box>

      {showButton && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 38,
            px: 2.5,
            borderRadius: "20px",
            bgcolor: "accent.main",
          }}
        >
          <Typography
            sx={{ fontWeight: 600, fontSize: "16px", color: "accent.contrastText", whiteSpace: "nowrap" }}
          >
            {buttonText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export type { FeatureCardProps };
export default FeatureCard;
