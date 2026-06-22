/**
 * @file ExplodeVideo.tsx
 * @description
 * This component renders a video that shows our ASV exploding and reassembling.
 * The video in view will lock scrolling and drag to pan the video.
 * scrolling is returned upon video end
 */
import explodeVideo from '../../../assets/explode.mp4';
import { useDrag } from '@use-gesture/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CircularProgress from '@mui/material/CircularProgress';

gsap.registerPlugin(ScrollTrigger);

const ExplodeVideo: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const baseTimeRef = useRef(0);
    const targetTimeRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const backwardActiveRef = useRef(false);

    // Chains seeks via the 'seeked' event so the next seek fires the instant the
    // decoder finishes, eliminating the rAF dead-time between seeks.
    const stepBackward = useCallback(() => {
        const video = videoRef.current;
        if (!video || !backwardActiveRef.current) return;

        const diff = targetTimeRef.current - video.currentTime;
        if (diff >= -0.05) {
            backwardActiveRef.current = false;
            return;
        }

        const speed = Math.min(16, Math.abs(diff) * 6);
        const step = speed / 15; // targets ~15fps backward; scales with distance to target
        const newTime = Math.max(targetTimeRef.current, Math.max(0, video.currentTime - step));
        video.addEventListener('seeked', stepBackward, { once: true });
        video.currentTime = newTime;
    }, []);

    const seekToTarget = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const diff = targetTimeRef.current - video.currentTime;

        if (Math.abs(diff) < 0.05) {
            video.playbackRate = 1;
            if (!video.paused) video.pause();
            rafRef.current = null;
            return;
        }

        if (diff > 0) {
            video.playbackRate = Math.min(16, diff * 6);
            if (video.paused) video.play().catch(() => {});
            rafRef.current = requestAnimationFrame(seekToTarget);
        } else {
            // Target moved behind us while rAF was running — hand off to backward chain
            video.playbackRate = 1;
            if (!video.paused) video.pause();
            rafRef.current = null;
            if (!backwardActiveRef.current) {
                backwardActiveRef.current = true;
                stepBackward();
            }
        }
    }, [stepBackward]);

    const updateTarget = useCallback((newTime: number) => {
        const video = videoRef.current;
        if (!video) return;
        targetTimeRef.current = Math.max(0, Math.min(video.duration || 0, newTime));

        const diff = targetTimeRef.current - video.currentTime;

        if (diff > 0.05) {
            backwardActiveRef.current = false; // cancel backward chain on direction switch
            if (rafRef.current === null) {
                rafRef.current = requestAnimationFrame(seekToTarget);
            }
        } else if (diff < -0.05) {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
                video.playbackRate = 1;
                if (!video.paused) video.pause();
            }
            if (!backwardActiveRef.current) {
                backwardActiveRef.current = true;
                stepBackward();
            }
        }
    }, [seekToTarget, stepBackward]);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        let killTrigger: (() => void) | undefined;

        const setup = () => {
            video.pause();
            const st = ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: '+=200%',
                pin: true,
                scrub: 1,
                onUpdate: (self) => {
                    if (video.duration) {
                        updateTarget(self.progress * video.duration);
                    }
                },
            });
            killTrigger = () => st.kill();
        };

        if (video.readyState >= 1) {
            setup();
        } else {
            video.addEventListener('loadedmetadata', setup, { once: true });
        }

        return () => {
            video.removeEventListener('loadedmetadata', setup);
            killTrigger?.();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [updateTarget]);

    const bind = useDrag(({ movement: [, my], first }) => {
        const video = videoRef.current;
        if (!video) return;
        if (first) baseTimeRef.current = video.currentTime;
        updateTarget(baseTimeRef.current + my * 0.015);
    });

    return (
        <Box
            ref={containerRef}
            {...bind()}
            sx={{
                position: 'relative',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                touchAction: 'none',
            }}
        >
            {!isLoaded && (<CircularProgress aria-label="Loading…" />)}
            <Box
                component="video"
                ref={videoRef}
                src={explodeVideo}
                preload="auto"
                muted
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />

        </Box>
    );
};

export default ExplodeVideo;
