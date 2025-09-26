'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

export interface EnhancedHoverProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'lift' | 'glow' | 'scale' | 'pulse' | 'ripple';
  disabled?: boolean;
}

const hoverVariants = {
  lift: {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    whileTap: { y: -2, transition: { duration: 0.1 } },
  },
  glow: {
    whileHover: {
      boxShadow: '0 8px 32px rgba(20, 182, 155, 0.3)',
      transition: { duration: 0.3 }
    },
  },
  scale: {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98, transition: { duration: 0.1 } },
  },
  pulse: {
    whileHover: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      }
    },
  },
  ripple: {
    whileHover: { scale: 1.01, transition: { duration: 0.2 } },
    whileTap: { scale: 0.99, transition: { duration: 0.1 } },
  },
};

export const EnhancedHover = ({
  children,
  className,
  variant = 'lift',
  disabled = false,
}: EnhancedHoverProps) => {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      {...hoverVariants[variant]}
    >
      {children}
    </motion.div>
  );
};

// Ripple effect component for button-like interactions
export interface RippleHoverProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
}

export const RippleHover = ({
  children,
  className,
  rippleColor = 'rgba(20, 182, 155, 0.4)',
}: RippleHoverProps) => {
  return (
    <motion.div
      className={cn('relative overflow-hidden cursor-pointer', className)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onHoverStart={(e) => {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'absolute rounded-full animate-ping pointer-events-none';
        ripple.style.background = rippleColor;
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = `${(e as any).clientX - (e.target as HTMLElement).offsetLeft - 10}px`;
        ripple.style.top = `${(e as any).clientY - (e.target as HTMLElement).offsetTop - 10}px`;

        (e.target as HTMLElement).appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 1000);
      }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic hover effect for cards and important elements
export interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticHover = ({
  children,
  className,
  strength = 0.3,
}: MagneticHoverProps) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setMousePosition({ x: deltaX, y: deltaY });
  };

  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        mass: 0.5
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </motion.div>
  );
};

// Tilt effect for cards
export interface TiltHoverProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const TiltHover = ({
  children,
  className,
  maxTilt = 15,
}: TiltHoverProps) => {
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;

    setTilt({ rotateX, rotateY });
  };

  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        rotateX: isHovered ? tilt.rotateX : 0,
        rotateY: isHovered ? tilt.rotateY : 0,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 400
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ rotateX: 0, rotateY: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </motion.div>
  );
};

export default EnhancedHover;