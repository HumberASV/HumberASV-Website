// src\components\layout\vehicle\ScrollAnimation.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useInView } from "react-intersection-observer";

interface ScrollAnimationProps {
  frameCount: number;
  framePath: string;
  fps?: number;
}

const ScrollAnimation = ({
  frameCount = 120,
  framePath,
  fps = 30,
}: ScrollAnimationProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafId = useRef<number>(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);
  const lastFrameIndex = useRef<number>(0);

  // State
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set());

  // Intersection Observer to detect when section is in view
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1, // Trigger when 10% visible
    triggerOnce: false,
  });

  // Set both refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  // Preload frames around current position
  const preloadFrames = useCallback(
    (centerFrame: number) => {
      const preloadRange = 5; // Load ±5 frames around current
      const framesToLoad: number[] = [];

      for (let i = -preloadRange; i <= preloadRange; i++) {
        const frame = centerFrame + i;
        if (frame >= 1 && frame <= frameCount && !loadedFrames.has(frame)) {
          framesToLoad.push(frame);
        }
      }

      framesToLoad.forEach((frame) => {
        const img = new Image();
        img.src = `${framePath}/${String(frame).padStart(4, "0")}.jpg`;
        img.onload = () => {
          setLoadedFrames((prev) => new Set([...prev, frame]));
        };
      });
    },
    [framePath, frameCount, loadedFrames]
  );

  // Calculate frame number from scroll position
  const calculateFrameFromScroll = useCallback(() => {
    if (!containerRef.current) return 0;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how much of container is visible (0 to 1)
    const containerTop = rect.top;
    const containerBottom = rect.bottom;
    const containerHeight = rect.height;

    // Visible portion
    const visibleTop = Math.max(0, windowHeight - containerTop);
    const visibleBottom = Math.max(0, windowHeight - containerBottom);
    const visibleHeight =
      Math.min(containerHeight, visibleTop) - Math.max(0, -visibleBottom);

    // If not visible at all
    if (visibleHeight <= 0) return 0;

    // Calculate scroll progress within container (0 to 1)
    let progress = 0;
    if (containerTop >= 0 && containerBottom <= windowHeight) {
      // Container fully visible
      progress = 1;
    } else if (containerTop < 0) {
      // Scrolling through container
      progress = Math.abs(containerTop) / (containerHeight - windowHeight);
      progress = Math.min(1, Math.max(0, progress));
    }

    // Map progress to frame number (1 to frameCount)
    const rawFrame = Math.floor(progress * (frameCount - 1)) + 1;

    // Apply smoothing based on scroll velocity
    const now = Date.now();
    const deltaTime = now - lastScrollTime.current;
    lastScrollTime.current = now;

    if (deltaTime > 0 && deltaTime < 100) {
      const velocity = 1000 / deltaTime; // pixels per second
      scrollVelocity.current = velocity;

      // Smooth transition: blend between frames based on velocity
      const smoothFactor = Math.min(1, velocity / 1000); // 0 to 1
      const targetFrame = rawFrame;
      const current = lastFrameIndex.current;

      // Fast scroll = snap to target, slow scroll = smooth transition
      const smoothedFrame =
        current + (targetFrame - current) * smoothFactor * 0.3;
      return Math.round(smoothedFrame);
    }

    return rawFrame;
  }, [frameCount]);

  // Main animation loop
  const updateAnimation = useCallback(() => {
    if (!inView || !containerRef.current) {
      rafId.current = requestAnimationFrame(updateAnimation);
      return;
    }

    const frameIndex = calculateFrameFromScroll();

    if (
      frameIndex >= 1 &&
      frameIndex <= frameCount &&
      frameIndex !== lastFrameIndex.current
    ) {
      setCurrentFrame(frameIndex);
      lastFrameIndex.current = frameIndex;

      // Preload nearby frames
      preloadFrames(frameIndex);
    }

    rafId.current = requestAnimationFrame(updateAnimation);
  }, [inView, calculateFrameFromScroll, frameCount, preloadFrames]);

  // Handle scroll events for momentum
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isScrolling.current = true;

      // Clear any existing timeout
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Set timeout to detect when scrolling stops
      scrollTimeout = setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Start/stop animation loop
  useEffect(() => {
    if (inView) {
      rafId.current = requestAnimationFrame(updateAnimation);
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [inView, updateAnimation]);

  // Preload first few frames immediately
  useEffect(() => {
    preloadFrames(1);

    // Check if first frame is loaded
    const checkFirstFrame = () => {
      const img = new Image();
      img.src = `${framePath}/0001.jpg`;
      img.onload = () => {
        setIsLoading(false);
        setLoadedFrames((prev) => new Set([...prev, 1]));
      };
      img.onerror = () => {
        console.error("Failed to load first frame");
        setIsLoading(false);
      };
    };

    checkFirstFrame();
  }, [framePath, preloadFrames]);

  // Construct image path
  const getImagePath = (frame: number): string => {
    return `${framePath}/${String(frame).padStart(4, "0")}.jpg`;
  };

  return (
    <Box
      ref={setRefs}
      sx={{
        width: "100%",
        height: { xs: "350px", sm: "500px", md: "600px" },
        backgroundColor: "#000",
        overflow: "hidden",
        position: "relative",
        mb: { xs: 8, md: 10 },
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: isLoading ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Current Frame */}
      <Box
        component="img"
        ref={imgRef}
        src={getImagePath(currentFrame)}
        alt={`Animation frame ${currentFrame}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            color: "#fff",
            fontSize: "1.2rem",
          }}
        >
          Loading animation...
        </Box>
      )}

      {/* Scroll Hint */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "8px 12px",
          borderRadius: 1,
          fontSize: "0.75rem",
          opacity: 0.8,
          display: { xs: "none", sm: "block" },
        }}
      >
        ↑↓ Scroll to animate
      </Box>

      {/* Frame Counter (for debugging) */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "4px 8px",
          borderRadius: 1,
          fontSize: "0.75rem",
          opacity: 0.6,
        }}
      >
        {currentFrame}/{frameCount}
      </Box>
    </Box>
  );
};

export default ScrollAnimation;
