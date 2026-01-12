import { useState, useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";

const VideoSection = () => {
  const FRAME_COUNT = 120;
  const FRAME_PATH = "./animation-frames/";

  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(1);

  // Get frame path
  const getFramePath = useCallback((frameNumber: number): string => {
    const paddedNumber = String(frameNumber).padStart(4, "0");
    return `${FRAME_PATH}${paddedNumber}.jpg`;
  }, []);

  // Preload first frame
  useEffect(() => {
    const img = new Image();
    img.src = getFramePath(1);

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [getFramePath]);

  // PERFECT ANIMATION: Complete at center, slower playback
  useEffect(() => {
    const updateAnimation = () => {
      const container = containerRef.current;
      if (!container) {
        animationRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Get container position
      const containerTop = container.offsetTop;
      const containerHeight = rect.height;
      const containerCenter = containerTop + containerHeight / 2;

      // Viewport center in document
      const viewportCenter = scrollY + windowHeight / 2;

      // ANIMATION DISTANCE: Make it LONGER for slower playback
      // Original: animationDistance = windowHeight (fast)
      // Slower: animationDistance = windowHeight * 2 (50% slower)
      // Even slower: animationDistance = windowHeight * 3 (33% of original speed)
      const speedFactor = 2.5; // Adjust this: 1 = original, 2 = 50% slower, 3 = 33% slower
      const animationDistance = windowHeight * speedFactor;

      // Calculate where animation should start and end
      // Animation starts earlier and ends later = slower playback
      const animationStart = containerCenter - animationDistance / 2;
      const animationEnd = containerCenter + animationDistance / 2;

      // Current position
      const currentPos = viewportCenter;

      // Calculate raw progress (0 to 1)
      let rawProgress =
        (currentPos - animationStart) / (animationEnd - animationStart);
      rawProgress = Math.max(0, Math.min(1, rawProgress));

      // Apply easing for smoother feel
      const easedProgress = easeInOutCubic(rawProgress);

      // Map to animation: forward then reverse
      let mappedProgress;
      if (easedProgress <= 0.5) {
        // First half: forward animation (1 → 120)
        mappedProgress = easedProgress * 2; // 0 → 1
      } else {
        // Second half: reverse animation (120 → 1)
        mappedProgress = (1 - easedProgress) * 2; // 1 → 0
      }

      // Convert to frame number
      const targetFrame = Math.floor(mappedProgress * (FRAME_COUNT - 1)) + 1;

      if (targetFrame !== lastFrameRef.current) {
        setCurrentFrame(targetFrame);
        lastFrameRef.current = targetFrame;
      }

      animationRef.current = requestAnimationFrame(updateAnimation);
    };

    animationRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Easing function for smoother animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const handleImageError = useCallback(() => {
    // Error handled silently
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: { xs: "80vh", sm: "90vh", md: "100vh" },
        backgroundColor: "#e9e9e9",
        position: "relative",
        mb: { xs: 4, md: 6 },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Silent loading */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#e9e9e9",
            zIndex: 1,
          }}
        />
      )}

      {/* Frame container */}
      <Box
        sx={{
          width: { xs: "95%", sm: "90%", md: "85%" },
          maxWidth: "1000px",
          height: "auto",
          maxHeight: "90%",
          backgroundColor: "transparent",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* The frame */}
        <Box
          component="img"
          src={getFramePath(currentFrame)}
          alt="Boat assembly animation"
          onError={handleImageError}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease",
            backgroundColor: "transparent",
          }}
        />
      </Box>
    </Box>
  );
};

export default VideoSection;
