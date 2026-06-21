// src/components/Navigation/MobileStickyCTA.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

const CTAWrapper = styled(motion.div)`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: var(--z-fixed);
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CTAPill = styled(motion.button)`
  background: var(--color-gradient-1);
  color: var(--color-bg-primary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-weight: 600;
  font-size: var(--text-sm);
  box-shadow: 0 10px 25px rgba(29, 78, 216, 0.25);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const MobileStickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Fade in once scrolled past 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <CTAWrapper
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <CTAPill
            onClick={handleClick}
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane size={12} />
            Let's Talk
          </CTAPill>
        </CTAWrapper>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyCTA;
