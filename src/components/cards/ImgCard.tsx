import { Box, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";

interface ImgCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  linkText?: string;
  mediaSlot?: ReactNode;
  showAccent?: boolean;
  showIcon?: boolean;
  showLinkText?: boolean;
  className?: string;
}

const ImgCard = ({
  title = "Built-In Safety Monitoring",
  description = "Battery Management Systems and voltage sensors constantly watch battery health and beam live status straight to the operator's remote control, so problems get caught before they become failures.",
  icon,
  linkText,
  mediaSlot,
  showAccent = true,
  showIcon = true,
  showLinkText = true,
  className,
}: ImgCardProps) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "200px",
          background: `linear-gradient(27deg, ${theme.palette.primary.dark} 15%, ${theme.palette.primary.light} 85%)`,
          overflow: "hidden",
        }}
      >
        {mediaSlot}
        {showAccent && (
          <Box
            sx={{
              position: "absolute",
              left: "-8%",
              bottom: 0,
              width: "116%",
              height: "28%",
              bgcolor: "accent.main",
              clipPath: "polygon(0 100%, 100% 40%, 100% 100%)",
            }}
          />
        )}
      </Box>

      {showIcon && <Box sx={{ width: 40, height: 40 }}>{icon}</Box>}

      <Typography
        sx={{
          fontFamily: `'Montserrat', 'Roboto', sans-serif`,
          fontWeight: 600,
          fontSize: "19.2px",
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          textAlign: "center",
          color: "text.primary",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "14.4px",
          lineHeight: 1.5,
          textAlign: "center",
          color: "text.primary",
        }}
      >
        {description}
      </Typography>

      {(showLinkText && linkText) && (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "14.4px",
            textAlign: "center",
            color: "primary.light",
            whiteSpace: "pre-wrap",
          }}
        >
          {linkText}
        </Typography>
      )}
    </Box>
  );
};

export type { ImgCardProps };
export default ImgCard;
