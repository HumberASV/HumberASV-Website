/**
 * @file Joystick.tsx
 * @description On-screen virtual joystick with left/right wheel speed bar indicators.
 */

import { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useMotionValue } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

// Define the hybrid component safely
const MotionBox = motion.create(Box);

export interface JoyState {
  x: number;
  y: number;
}

/** Props for the {@link Joystick} component. */
interface JoystickProps {
  joy: JoyState;
  lw: number;
  rw: number;
  onJoyChange: (j: JoyState) => void;
  size?: number;
}

/**
 * Virtual on-screen joystick with drag-constrained knob and left/right wheel speed bars.
 * Calls `onJoyChange` with normalised x/y values in [−1, 1] on every drag frame.
 */
function Joystick({ joy, lw, rw, onJoyChange, size = 156 }: JoystickProps) {
  const BAR_W = 6;
  const BAR_H = Math.round(size * 0.705);
  const JR = Math.round(size * 0.372);
  const KR = Math.round(size * 0.128);

  const knobX = useMotionValue(joy.x * JR);
  const knobY = useMotionValue(-joy.y * JR);

  // 1. Create a ref specifically for attaching gestures to the DOM node
  const knobRef = useRef<HTMLDivElement>(null);

  // 2. Bind useDrag via target ref instead of spreading the properties directly onto the JSX
  useDrag(
    ({ active, movement: [mx, my], first, memo, event }) => {
      if (first) {
        if (event) event.stopPropagation();
        memo = [knobX.get(), knobY.get()];
      }
      
      let targetX = memo[0] + mx;
      let targetY = memo[1] + my;

      const distance = Math.sqrt(targetX * targetX + targetY * targetY);
      if (distance > JR) {
        targetX = (targetX / distance) * JR;
        targetY = (targetY / distance) * JR;
      }

      if (active) {
        knobX.set(targetX);
        knobY.set(targetY);
        onJoyChange({ x: targetX / JR, y: -targetY / JR });
      } else {
        knobX.set(0);
        knobY.set(0);
        onJoyChange({ x: 0, y: 0 });
      }

      return memo;
    },
    { 
      target: knobRef, // Binds events natively directly to the element under the hood
      eventOptions: { passive: false } 
    }
  );

  /** Renders the colored fill segment for a wheel-speed bar at the given normalised value. */
  const renderBarFill = (val: number) => {
    const fillH = Math.abs(val) * (BAR_H / 2);
    const isPositive = val >= 0;
    return (
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: `${fillH}px`,
          backgroundColor: isPositive ? '#4aaeff' : '#ff8844',
          bottom: isPositive ? '50%' : 'auto',
          top: isPositive ? 'auto' : '50%',
          borderRadius: isPositive ? '3px 3px 0 0' : '0 0 3px 3px',
        }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, userSelect: 'none' }}>
      <Box style={{ width: size, height: size, position: 'relative', overflow: 'hidden' }}>
        
        {/* Left Bar */}
        <Box sx={{ position: 'absolute', left: 3, top: (size - BAR_H) / 2, width: BAR_W, height: BAR_H, bgcolor: 'rgba(40,60,100,0.5)', border: '0.5px solid rgba(100,160,220,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '0.5px', bgcolor: 'rgba(100,160,220,0.3)' }} />
          {renderBarFill(lw)}
        </Box>

        {/* Right Bar */}
        <Box sx={{ position: 'absolute', right: 9, top: (size - BAR_H) / 2, width: BAR_W, height: BAR_H, bgcolor: 'rgba(40,60,100,0.5)', border: '0.5px solid rgba(100,160,220,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '0.5px', bgcolor: 'rgba(100,160,220,0.3)' }} />
          {renderBarFill(rw)}
        </Box>

        {/* Outer Ring */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: JR * 2,
            height: JR * 2,
            borderRadius: '50%',
            bgcolor: 'rgba(20,35,70,0.7)',
            border: '1.5px solid rgba(100,160,220,0.4)',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              bgcolor: 'rgba(100,160,220,0.2)',
            },
            '&::before': { top: '50%', left: 0, right: 0, height: '0.5px' },
            '&::after': { left: '50%', top: 0, bottom: 0, width: '0.5px' },
          }}
        >
          {/* Draggable Knob */}
          <MotionBox
            ref={knobRef} // Use the ref here instead of {...bind()}
            style={{
              x: knobX,
              y: knobY,
              touchAction: 'none',
            }}
            sx={{
              position: 'absolute',
              left: `calc(50% - ${KR}px)`,
              top: `calc(50% - ${KR}px)`,
              width: KR * 2,
              height: KR * 2,
              borderRadius: '50%',
              bgcolor: '#1a4fcc',
              border: '1.5px solid #4aaeff',
              boxShadow: '1px 2px 0px rgba(0,0,0,0.2)',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:active': { cursor: 'grabbing', bgcolor: '#2a6fff' },
            }}
          >
            {/* Bow Arrow */}
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: `${KR * 0.38}px solid transparent`,
                borderRight: `${KR * 0.38}px solid transparent`,
                borderBottom: `${KR * 0.8}px solid rgba(120,210,255,0.9)`,
                transform: 'translateY(-10%)',
              }}
            />
          </MotionBox>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: size, px: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>L</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>R</Typography>
      </Box>
    </Box>
  );
}

export default Joystick;