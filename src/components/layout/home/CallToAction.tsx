import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { WavingHand, Rocket, Groups } from "@mui/icons-material";

// Water ripple animation
const ripple = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Floating animation
const floating = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Pulse animation for CTA button
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha("#efe51f", 0.4)};
  }
  70% {
    box-shadow: 0 0 0 10px ${alpha("#efe51f", 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha("#efe51f", 0)};
  }
`;

// Gentle upward drift animation
const rise = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120px) scale(1.2);
    opacity: 0;
  }
`;

const CallToAction = () => {
  const theme = useTheme();

  // Water bubbles animation component
  const WaterBubbles = () => (
    <>
      {[...Array(25)].map((_, i) => {
        const size = 6 + Math.random() * 14;
        const left = Math.random() * 100;
        const duration = 6 + Math.random() * 6;
        const delay = Math.random() * 5;
        const verticalShift = Math.random() * 20;
        const useRising = Math.random() > 0.5;

        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              bottom: `${verticalShift}%`,
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: alpha("#a3e7ff", 0.25 + Math.random() * 0.25),
              animation: `${
                useRising ? rise : ripple
              } ${duration}s infinite ease-out`,
              animationDelay: `${delay}s`,
              opacity: 0.7,
              filter: "blur(0.5px)",
              transformOrigin: "center",
              "@media (max-width:600px)": {
                width: size * 0.6,
                height: size * 0.6,
              },
            }}
          />
        );
      })}
    </>
  );

  // Floating elements animation component
  const FloatingElements = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            animation: `${floating} ${6 + i}s infinite ease-in-out`,
            animationDelay: `${i * 0.8}s`,
            opacity: 0.1,
            fontSize: 24,
            color: "white",
            left: `${10 + i * 20}%`,
            top: `${20 + i * 10}%`,
            "&:nth-of-type(odd)": { content: '"⚡"' },
            "&:nth-of-type(even)": { content: '"🌊"' },
          }}
        />
      ))}
    </>
  );

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #00435c 0%, #006687 50%, #0088a7 100%)"
            : "linear-gradient(135deg, #0a2e42 0%, #0d3a54 50%, #104a68 100%)",
        color: "white",
        py: { xs: 10, md: 15 },
        textAlign: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a3e7ff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          opacity: 0.3,
        },
      }}
    >
      {/* Animated water bubbles */}
      <WaterBubbles />

      {/* Floating decorative elements */}
      <FloatingElements />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        {/* Animated welcome icon */}
        <Box
          sx={{
            animation: `${floating} 3s infinite ease-in-out`,
            mb: 2,
          }}
        >
          <WavingHand
            sx={{
              fontSize: 48,
              color: theme.palette.accent.main,
            }}
          />
        </Box>

        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            mb: 3,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            background: `linear-gradient(135deg, ${
              theme.palette.common.white
            } 0%, ${alpha(theme.palette.common.white, 0.8)} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Join Our Maritime Revolution
        </Typography>

        <Typography
          variant="h6"
          paragraph
          sx={{
            mb: 4,
            opacity: 0.9,
            fontWeight: 400,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            textShadow: "0 1px 4px rgba(0,0,0,0.2)",
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Be part of the future of autonomous maritime technology. We're seeking
          passionate sponsors, mentors, and collaborators to help us navigate
          new frontiers in innovation.
        </Typography>

        {/* Benefits highlights */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            gap: { xs: 2, sm: 4 },
            mb: 5,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🚀", text: "Cutting-edge Technology" },
            { icon: "🤝", text: "Strategic Partnerships" },
            { icon: "🎯", text: "Real-world Impact" },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                backgroundColor: alpha("#fff", 0.1),
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#fff", 0.2)}`,
                animation: `${floating} ${3 + index}s infinite ease-in-out`,
              }}
            >
              <Box sx={{ fontSize: "1.5rem" }}>{item.icon}</Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Animated CTA Button */}
        <Button
          variant="contained"
          color="accent"
          size="large"
          component={RouterLink}
          to="/team"
          startIcon={<Rocket />}
          endIcon={<Groups />}
          sx={{
            px: 6,
            py: 2,
            fontSize: "1.2rem",
            fontWeight: 700,
            borderRadius: 3,
            // color: "primary.main",
            background: `linear-gradient(135deg, ${theme.palette.accent.main} 0%, ${theme.palette.accent.light} 100%)`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.accent.main, 0.4)}`,
            animation: `${pulse} 2s infinite`,
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: `0 12px 40px ${alpha(theme.palette.accent.main, 0.6)}`,
              background: `linear-gradient(135deg, ${theme.palette.accent.dark} 0%, ${theme.palette.accent.main} 100%)`,
            },
            transition: "all 0.3s ease",
            textTransform: "none",
            minWidth: { xs: "100%", sm: "auto" },
          }}
        >
          Start Your Partnership Journey
        </Button>

        {/* Secondary action */}
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            opacity: 0.8,
            fontSize: "0.9rem",
          }}
        >
          or{" "}
          <Box
            component={RouterLink}
            to="/support"
            sx={{
              color: theme.palette.accent.main,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            explore other ways to get involved
          </Box>
        </Typography>
      </Container>
    </Box>
  );
};

export default CallToAction;
