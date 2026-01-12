// src/components/layout/vehicle/VideoSection.tsx
import { Box } from "@mui/material";
import animationVideo from "../../../assets/Website Animation.mp4";
import { useRef, useEffect, useState } from "react";

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the container is visible (0 to 1)
      const visibleTop = Math.max(0, windowHeight - rect.top);
      const visibleBottom = Math.max(0, windowHeight - rect.bottom);
      const visibleHeight =
        Math.min(rect.height, visibleTop) - Math.max(0, -visibleBottom);
      const visibleRatio = Math.max(
        0,
        Math.min(1, visibleHeight / rect.height)
      );

      // Calculate scroll progress through the container
      const scrollProgress = 1 - rect.bottom / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      // Update video playback based on scroll
      if (video.duration) {
        video.currentTime = clampedProgress * video.duration;
      }

      // Play/pause based on visibility
      if (visibleRatio > 0.1 && !isPlaying) {
        video.play().catch(console.error);
        setIsPlaying(true);
      } else if (visibleRatio <= 0.1 && isPlaying) {
        video.pause();
        setIsPlaying(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPlaying]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: { xs: "350px", sm: "500px", md: "600px" },
        backgroundColor: "#000",
        overflow: "hidden",
        position: "relative",
        mb: { xs: 8, md: 10 },
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={animationVideo}
        preload="auto"
        muted
        playsInline
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#000",
        }}
      />
    </Box>
  );
};

export default VideoSection;
