// src/components/FunElements/PandaCursor.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useSpring } from 'framer-motion';
import { GiPanda } from 'react-icons/gi';

const PandaContainer = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  
  @media (max-width: 768px) {
    display: none; // Hide on mobile
  }
`;

const PandaIcon = styled.div`
  font-size: 2rem;
  color: var(--color-accent-primary);
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.3));
  transition: transform 0.2s ease;
  
  &.sleeping {
    transform: translate(-50%, -50%) rotate(-30deg);
  }
`;

const ThoughtBubble = styled(motion.div)`
  position: absolute;
  top: -40px;
  left: 20px;
  background: white;
  color: black;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 10px;
    width: 10px;
    height: 10px;
    background: white;
    transform: rotate(45deg);
  }
`;

const ZzzContainer = styled(motion.div)`
  position: absolute;
  top: -20px;
  right: -20px;
  font-size: 1rem;
  color: var(--color-accent-primary);
`;

const PandaCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [moveTimeout, setMoveTimeout] = useState(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Smooth spring animation for cursor movement
  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      x.set(clientX);
      y.set(clientY);
      
      // Calculate if mouse is moving
      const distance = Math.sqrt(
        Math.pow(clientX - lastPosition.x, 2) + 
        Math.pow(clientY - lastPosition.y, 2)
      );
      
      if (distance > 5) {
        setIsMoving(true);
        setLastPosition({ x: clientX, y: clientY });
        
        // Clear existing timeout
        if (moveTimeout) clearTimeout(moveTimeout);
        
        // Set new timeout
        const timeout = setTimeout(() => {
          setIsMoving(false);
        }, 1000);
        
        setMoveTimeout(timeout);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      setMousePosition({ x: -100, y: -100 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (moveTimeout) clearTimeout(moveTimeout);
    };
  }, [lastPosition, moveTimeout, x, y]);

  const thoughts = [
    "🎋 Bamboo?",
    "💤 Sleepy...",
    "🚀 Space!",
    "☀️ Solar power!",
    "✈️ Flying high!"
  ];

  const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];

  return (
    <PandaContainer
      style={{ x, y }}
      animate={{
        scale: isClicking ? 0.8 : 1,
        rotate: isMoving ? [0, -10, 10, 0] : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      <PandaIcon className={!isMoving ? 'sleeping' : ''}>
        <GiPanda />
      </PandaIcon>
      
      {!isMoving && (
        <>
          <ZzzContainer
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -20],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            Z
          </ZzzContainer>
          <ZzzContainer
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -20],
            }}
            transition={{ 
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
            style={{ fontSize: '0.8rem', right: '-15px' }}
          >
            z
          </ZzzContainer>
        </>
      )}
      
      {isClicking && (
        <ThoughtBubble
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {randomThought}
        </ThoughtBubble>
      )}
    </PandaContainer>
  );
};

export default PandaCursor;