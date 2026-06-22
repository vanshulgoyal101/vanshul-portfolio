import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

const RocketWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 100;
  
  ${({ $isMobileOnly }) => $isMobileOnly && `
    display: none;
  `}
  
  @media (max-width: 768px) {
    ${({ $isDesktopOnly }) => $isDesktopOnly && `
      display: none !important;
    `}
    
    ${({ $isMobileOnly }) => $isMobileOnly && `
      display: flex !important;
    `}
    
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    transform: none;
    margin: 60px auto 0 auto;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    width: fit-content;
  }
`;

const RocketContainer = styled(motion.div)`
  cursor: pointer;
  pointer-events: auto;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  will-change: transform;
`;

const Rocket = styled(motion.div)`
  font-size: 3rem;
  color: var(--color-accent-primary);
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  will-change: transform;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Flame = styled(motion.div)`
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 30px;
  background: linear-gradient(180deg, #ff6b6b 0%, #ffd93d 50%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  filter: blur(2px);
  opacity: 0;
  transform-origin: top center;
  will-change: transform, opacity;
`;

const Smoke = styled(motion.div)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 100%);
  border-radius: 50%;
  filter: blur(4px);
  will-change: transform, opacity;
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%) !important;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.825rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
  pointer-events: none;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--color-bg-card);
  }
  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 7px solid transparent;
    border-top-color: var(--color-border);
    z-index: -1;
  }
`;

const FloatingRocket = ({ isMobileOnly = false, isDesktopOnly = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const controls = useAnimation();
  const rocketRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  // Auto-temptation pulse helper: triggers a shake occasionally to catch the eye
  useEffect(() => {
    if (hasLaunched) return;
    const interval = setInterval(() => {
      // Small pulse nudge to tempt the user
      controls.start({
        scale: [1, 1.12, 1],
        transition: { duration: 0.8, ease: "easeInOut" }
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [hasLaunched, controls]);

  const handleClick = async () => {
    if (hasLaunched) return;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const nextClickCount = clickCount + 1;
    setClickCount(nextClickCount);
    setShowBubble(true);
    
    if (nextClickCount >= 3) {
      // Launch sequence
      setHasLaunched(true);
      
      // Emit custom launch event
      window.dispatchEvent(new CustomEvent('rocket-launch'));

      // Shake before launch
      await controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 }
      });
      
      // Setup position tracking frame loop
      let animFrame;
      const trackPosition = () => {
        if (rocketRef.current) {
          const rect = rocketRef.current.getBoundingClientRect();
          const nozzleX = rect.left + rect.width / 2;
          const nozzleY = rect.bottom;
          window.dispatchEvent(new CustomEvent('rocket-emit-smoke', {
            detail: { x: nozzleX, y: nozzleY }
          }));
        }
        animFrame = requestAnimationFrame(trackPosition);
      };
      
      // Start tracking
      trackPosition();

      // Launch! (Accelerating takeoff curve)
      await controls.start({
        y: -window.innerHeight - 200,
        transition: { 
          duration: 1.2,
          ease: [0.7, 0, 0.84, 0] // Accelerates naturally upwards
        }
      });
      
      // Stop tracking frame loop
      cancelAnimationFrame(animFrame);

      // Reset after launch (quicker reset)
      setTimeout(() => {
        controls.set({ y: 0 });
        setHasLaunched(false);
        setClickCount(0);
        setShowBubble(false);
      }, 700);
    } else {
      // Small bounce
      controls.start({
        y: [0, -20, 0],
        transition: { duration: 0.3 }
      });
      
      // Hide chat bubble and reset count after 3 seconds if they don't keep tapping
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
        setShowBubble(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

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
    ? "Tap me to test thrusters! 🚀" 
    : clickCount === 1 
    ? "Ignition checks OK... Tap again! ⚡️" 
    : "T-Minus 1s... Ready for launch! 🎆";

  return (
    <RocketWrapper $isMobileOnly={isMobileOnly} $isDesktopOnly={isDesktopOnly}>
      <RocketContainer
        ref={rocketRef}
        animate={controls}
        onHoverStart={() => { setIsHovered(true); setShowBubble(true); }}
        onHoverEnd={() => { setIsHovered(false); if (clickCount === 0) setShowBubble(false); }}
        onClick={handleClick}
        whileHover={{ scale: 1.15 }}
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
            scaleY: hasLaunched ? [1, 1.5, 1] : 1,
            rotate: hasLaunched ? 45 : 0,
            x: hasLaunched ? '-30%' : '-50%'
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
                initial={{ opacity: 0.6, scale: 0 }}
                animate={{
                  y: [0, 60],
                  x: [0, (i - 1) * 12],
                  opacity: [0.6, 0],
                  scale: [1, 2.5]
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
        
        <Tooltip
          initial={{ opacity: 0, y: 10, x: "-50%" }}
          animate={{ 
            opacity: (showBubble || isHovered) && !hasLaunched ? 1 : 0,
            y: (showBubble || isHovered) && !hasLaunched ? 0 : 10,
            x: "-50%"
          }}
        >
          {tooltipText}
        </Tooltip>
      </RocketContainer>
    </RocketWrapper>
  );
};

export default FloatingRocket;