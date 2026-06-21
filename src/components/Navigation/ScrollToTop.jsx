// src/components/Navigation/ScrollToTop.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi';
import Magnetic from '../FunElements/Magnetic';

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  z-index: var(--z-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(30, 41, 59, 0.08);
  outline: none;

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 44px;
    height: 44px;
  }
`;

const SvgRing = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update progress tracking for SVG dashoffset
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setProgress(latest);
    });
  }, [scrollYProgress]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG parameters
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <Magnetic range={30}>
          <FloatingButton
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <SvgRing viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="transparent"
                stroke="rgba(29, 78, 216, 0.1)"
                strokeWidth="2.5"
              />
              <motion.circle
                cx="25"
                cy="25"
                r={radius}
                fill="transparent"
                stroke="var(--color-accent-primary)"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
              />
            </SvgRing>
            <HiArrowUp size={18} />
          </FloatingButton>
        </Magnetic>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
