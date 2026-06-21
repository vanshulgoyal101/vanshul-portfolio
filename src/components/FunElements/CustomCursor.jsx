// src/components/FunElements/CustomCursor.jsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: transform;
  mix-blend-mode: difference;
`;

const CursorRing = styled(motion.div)`
  width: 36px;
  height: 36px;
  border: 1.5px solid #ffffff;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  will-change: transform, width, height, background-color;
  background-color: rgba(255, 255, 255, 0);
  mix-blend-mode: difference;
`;

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the trailing ring
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if the device has hover capabilities (i.e. not a touch device)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsSupported(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsSupported(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('[role="button"]') ||
        target.style.cursor === 'pointer';

      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Disable default body cursor when custom cursor is active
    document.body.classList.add('has-custom-cursor');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isSupported, mouseX, mouseY, isVisible]);

  if (!isSupported || !isVisible) return null;

  return (
    <>
      <CursorDot
        style={{ x: mouseX, y: mouseY }}
        animate={{
          scale: isHovered ? 0.5 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <CursorRing
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0)',
          borderColor: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
