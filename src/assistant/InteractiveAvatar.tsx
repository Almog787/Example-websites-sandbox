import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { EmotionalState } from './types';

interface InteractiveAvatarProps {
  emotionalState?: EmotionalState;
  size?: number;
  className?: string;
  isTrigger?: boolean;
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  emotionalState = 'idle',
  size = 56,
  className = '',
  isTrigger = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Eye Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || emotionalState === 'thinking') return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      // Max eye travel in pixels
      const maxOffset = 3.5;
      if (distance === 0) {
        setPupilOffset({ x: 0, y: 0 });
        return;
      }

      // Smooth normalized clamping
      const factor = Math.min(distance / 300, 1);
      const targetX = (deltaX / distance) * maxOffset * factor;
      const targetY = (deltaY / distance) * maxOffset * factor;

      setPupilOffset({ x: targetX, y: targetY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [emotionalState]);

  // Thinking state animated eye drift
  useEffect(() => {
    if (emotionalState !== 'thinking') return;

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      const positions = [
        { x: 2, y: -3 },
        { x: -2, y: -3 },
        { x: 3, y: -1 },
        { x: -1, y: -2 }
      ];
      setPupilOffset(positions[step]);
    }, 600);

    return () => clearInterval(interval);
  }, [emotionalState]);

  // Natural Blinking Timer (every 4-5.5s)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);

      const nextInterval = 3800 + Math.random() * 2200;
      blinkTimeout = setTimeout(triggerBlink, nextInterval);
    };

    blinkTimeout = setTimeout(triggerBlink, 3500);
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          emotionalState === 'happy' || emotionalState === 'success'
            ? { y: [0, -3, 0], scale: [1, 1.05, 1] }
            : emotionalState === 'thinking'
            ? { rotate: [-2, 2, -2] }
            : { y: [0, -1, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: emotionalState === 'happy' || emotionalState === 'success' ? 1.4 : 3,
          ease: 'easeInOut'
        }}
      >
        <defs>
          {/* Luxury Metallic Gold Gradients */}
          <linearGradient id="goldHeadGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E1C18" />
            <stop offset="0.5" stopColor="#121212" />
            <stop offset="1" stopColor="#2A261F" />
          </linearGradient>

          <linearGradient id="goldRimGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F6E27A" />
            <stop offset="0.4" stopColor="#C59B27" />
            <stop offset="0.8" stopColor="#9A7B1C" />
            <stop offset="1" stopColor="#E2BA4B" />
          </linearGradient>

          <linearGradient id="faceScreenGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#18181B" />
            <stop offset="1" stopColor="#09090B" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Halo Glow when Trigger */}
        {isTrigger && (
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#goldRimGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
            className="animate-spin"
            style={{ transformOrigin: '50% 50%', animationDuration: '24s' }}
          />
        )}

        {/* Bot Outer Head Shell */}
        <rect
          x="12"
          y="14"
          width="76"
          height="72"
          rx="26"
          fill="url(#goldHeadGrad)"
          stroke="url(#goldRimGrad)"
          strokeWidth="3.5"
          filter="url(#goldGlow)"
        />

        {/* Mini Crown / Golden Top Antenna */}
        <path
          d="M44 14 L50 6 L56 14"
          stroke="url(#goldRimGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="6" r="3.5" fill="#F6E27A" />

        {/* High-Tech Dark Visor / Face Screen */}
        <rect
          x="20"
          y="24"
          width="60"
          height="52"
          rx="18"
          fill="url(#faceScreenGrad)"
          stroke="#3F3F46"
          strokeWidth="1.5"
        />

        {/* Eye Socket Left & Right / Expressive Shapes */}
        {emotionalState === 'happy' || emotionalState === 'success' ? (
          // Happy Joyful Arcs (^ ^)
          <g stroke="#F6E27A" strokeWidth="4" strokeLinecap="round" filter="url(#eyeGlow)">
            <path d="M29 48 Q 36 38, 43 48" fill="none" />
            <path d="M57 48 Q 64 38, 71 48" fill="none" />
          </g>
        ) : (
          // Dynamic Eyes with Eye-Tracking & Blinking
          <g
            style={{
              transformOrigin: '50% 45%',
              transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
              transition: 'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Left Eye Sclera / Background */}
            <circle cx="36" cy="45" r="9.5" fill="#27272A" stroke="#C59B27" strokeWidth="1" />
            {/* Left Eye Pupil */}
            <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
              <circle cx="36" cy="45" r="6" fill="#F6E27A" filter="url(#eyeGlow)" />
              <circle cx="34.5" cy="43.5" r="2" fill="#FFFFFF" />
            </g>

            {/* Right Eye Sclera / Background */}
            <circle cx="64" cy="45" r="9.5" fill="#27272A" stroke="#C59B27" strokeWidth="1" />
            {/* Right Eye Pupil */}
            <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
              <circle cx="64" cy="45" r="6" fill="#F6E27A" filter="url(#eyeGlow)" />
              <circle cx="62.5" cy="43.5" r="2" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* Mouth / Emotional Smile Arc */}
        {emotionalState === 'happy' || emotionalState === 'success' ? (
          <path
            d="M38 61 Q 50 71, 62 61"
            fill="none"
            stroke="#F6E27A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : emotionalState === 'thinking' ? (
          <ellipse cx="50" cy="62" rx="3.5" ry="3.5" fill="#E2BA4B" />
        ) : (
          <path
            d="M42 62 Q 50 67, 58 62"
            fill="none"
            stroke="#C59B27"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Rosy Cheeks when Happy */}
        {(emotionalState === 'happy' || emotionalState === 'success') && (
          <>
            <circle cx="26" cy="54" r="3.5" fill="#F59E0B" opacity="0.6" />
            <circle cx="74" cy="54" r="3.5" fill="#F59E0B" opacity="0.6" />
          </>
        )}
      </motion.svg>
    </div>
  );
};
