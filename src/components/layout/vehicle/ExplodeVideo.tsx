/**
 * @file ExplodeVideo.tsx
 * @description A component that displays an interactive video sequence of an exploding vehicle using a series of image frames.
 * @author Carson Fujita
 */
import { useDrag } from '@use-gesture/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BoatLoader from './BoatLoader';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 198;

const getFrameSrc = (i: number) =>
    `/frames/frame_${String(i).padStart(4, '0')}.webp`;

const ExplodeVideo: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const baseFrameRef = useRef(0);

    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const frames = framesRef.current;
        const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
        if (!canvas || !frames[clamped]?.complete) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // object-fit: cover
        const img = frames[clamped];
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (imgAspect > canvasAspect) {
            sw = img.naturalHeight * canvasAspect;
            sx = (img.naturalWidth - sw) / 2;
        } else {
            sh = img.naturalWidth / canvasAspect;
            sy = (img.naturalHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        currentFrameRef.current = clamped;
    }, []);

    useEffect(() => {
        const frames: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        let loaded = 0;

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.onload = () => {
                loaded++;
                if (loaded === TOTAL_FRAMES) {
                    framesRef.current = frames;
                    setIsLoaded(true);
                    drawFrame(0);
                }
            };
            img.src = getFrameSrc(i + 1);
            frames[i] = img;
        }

        return () => { frames.forEach(img => { img.src = ''; }); };
    }, [drawFrame]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const observer = new ResizeObserver(() => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            drawFrame(currentFrameRef.current);
        });
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [drawFrame]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !isLoaded) return;

        const st = ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: true,
            fastScrollEnd: true,
            onUpdate: (self) => {
                drawFrame(self.progress * (TOTAL_FRAMES - 1));
            },
        });

        return () => st.kill();
    }, [isLoaded, drawFrame]);

    const bind = useDrag(({ movement: [, my], first }) => {
        if (first) baseFrameRef.current = currentFrameRef.current;
        drawFrame(baseFrameRef.current + my * 0.4);
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
                contain: 'layout size',
            }}
        >
            {!isLoaded && <BoatLoader />}
            <Box
                component="canvas"
                ref={canvasRef}
                sx={{ width: '100%', height: '100%', display: 'block' }}
            />
        </Box>
    );
};

export default ExplodeVideo;
