// src/components/FunElements/FloatingRocket.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

const RocketContainer = styled(motion.div)`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 100;
  cursor: pointer;
  
  @media (max-width: 768px) {
    bottom: 30px;
    right: 30px;
  }
`;

const Rocket = styled(motion.div)`
  font-size: 3rem;
  color: var(--color-accent-primary);
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Flame = styled(motion.div)`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
  background: linear-gradient(180deg, #ff6b6b 0%, #ffd93d 50%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  filter: blur(2px);
  opacity: 0;
`;

const Smoke = styled(motion.div)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  filter: blur(5px);
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  margin-bottom: 10px;
  border: 1px solid var(--color-border);
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 20px;
    border: 6px solid transparent;
    border-top-color: var(--color-border);
  }
`;

const FloatingRocket = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const controls = useAnimation();

  const handleClick = async () => {
    if (hasLaunched) return;
    
    setClickCount(prev => prev + 1);
    
    if (clickCount >= 2) {
      // Launch sequence
      setHasLaunched(true);
      
      // Shake before launch
      await controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 }
      });
      
      // Launch!
      controls.start({
        y: -window.innerHeight - 200,
        transition: { 
          duration: 2,
          ease: "easeIn"
        }
      });
      
      // Reset after launch
      setTimeout(() => {
        controls.set({ y: 0 });
        setHasLaunched(false);
        setClickCount(0);
      }, 3000);
    } else {
      // Small bounce
      controls.start({
        y: [0, -20, 0],
        transition: { duration: 0.3 }
      });
    }
  };

  useEffect(() => {
    // Floating animation
    if (!hasLaunched) {
      controls.start({
        y: [0, -10, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    }
  }, [hasLaunched, controls]);

  const tooltipText = clickCount === 0 
    ? "Click me!" 
    : clickCount === 1 
    ? "Click again!" 
    : "Ready for launch!";

  return (
    <RocketContainer
      animate={controls}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Rocket
        animate={{ 
          rotate: hasLaunched ? -45 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <FaRocket />
      </Rocket>
      
      <Flame
        animate={{ 
          opacity: hasLaunched ? 1 : 0,
          scaleY: hasLaunched ? [1, 1.5, 1] : 1
        }}
        transition={{ 
          duration: 0.2,
          repeat: hasLaunched ? Infinity : 0,
          repeatType: "reverse"
        }}
      />
      
      {hasLaunched && (
        <>
          {[...Array(3)].map((_, i) => (
            <Smoke
              key={i}
              initial={{ opacity: 0.5, scale: 0 }}
              animate={{
                y: [0, 100],
                x: [0, (i - 1) * 20],
                opacity: [0.5, 0],
                scale: [1, 3]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity
              }}
            />
          ))}
        </>
      )}
      
      <Tooltip
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered && !hasLaunched ? 1 : 0,
          y: isHovered && !hasLaunched ? 0 : 10
        }}
      >
        {tooltipText}
      </Tooltip>
    </RocketContainer>
  );
};

export default FloatingRocket;