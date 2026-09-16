// src/components/FunElements/CustomCursor.jsx
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { isCustomCursorEnabled, CURSOR_PREF_EVENT } from '../../utils/cursorPreference';

const CursorDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background-color: var(--color-accent-primary);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: transform;
`;

const CursorRing = styled(motion.div)`
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--color-accent-primary);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  will-change: transform, width, height, background-color;
  background-color: rgba(29, 78, 216, 0);
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
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () => {
      setIsSupported(isCustomCursorEnabled());
      setIsVisible(false);
    };
    evaluate();

    hoverQuery.addEventListener('change', evaluate);
    motionQuery.addEventListener('change', evaluate);
    window.addEventListener(CURSOR_PREF_EVENT, evaluate);
    return () => {
      hoverQuery.removeEventListener('change', evaluate);
      motionQuery.removeEventListener('change', evaluate);
      window.removeEventListener(CURSOR_PREF_EVENT, evaluate);
    };
  }, []);

  const rafRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;

    const handleMouseMove = (e) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setIsVisible(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

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
    window.addEventListener('blur', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isSupported, mouseX, mouseY]);

  useEffect(() => {
    if (!isSupported || !isVisible) return;
    document.body.classList.add('has-custom-cursor');
    return () => document.body.classList.remove('has-custom-cursor');
  }, [isSupported, isVisible]);

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
          backgroundColor: isHovered ? 'rgba(29, 78, 216, 0.08)' : 'rgba(29, 78, 216, 0)',
          borderColor: isHovered ? 'var(--color-accent-primary)' : 'rgba(29, 78, 216, 0.4)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </>
  );
};

export default CustomCursor;
