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
    ${({ $isMobileOnly }) => $isMobileOnly && `
      display: flex !important;
    `}

    position: fixed;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    left: auto;
    right: 1rem;
    margin: 0;
    display: block;
    pointer-events: none;
    z-index: 100;
    width: fit-content;
    ${({ $isDesktopOnly }) => $isDesktopOnly && `display: none;`}
  }
`;

const RocketContainer = styled(motion.button)`
  position: relative;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  line-height: 1;
  min-width: 44px;
  min-height: 44px;
  cursor: pointer;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  will-change: transform;
`;

const Rocket = styled(motion.span)`
  position: relative;
  display: block;
  width: 1em;
  height: 1em;
  margin: 0 auto;
  font-size: 3rem;
  color: var(--color-accent-primary);
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  will-change: transform;
  > svg { display: block; }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Exhaust = styled.span`
  position: absolute;
  left: 25.5859375%;
  top: 74.4140625%;
  width: 0;
  height: 0;
  transform: rotate(45deg);
`;

const Flame = styled(motion.span)`
  position: absolute;
  top: 0;
  left: -10px;
  width: 20px;
  height: 30px;
  background: linear-gradient(180deg, #ff6b6b 0%, #ffd93d 50%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  filter: blur(2px);
  opacity: 0;
  transform-origin: top center;
  will-change: transform, opacity;
`;

const Smoke = styled(motion.span)`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(56, 189, 248, 0.3) 50%, transparent 100%);
  border-radius: 50%;
  filter: blur(4px);
  will-change: transform, opacity;
`;

const Tooltip = styled(motion.span)`
  position: absolute;
  bottom: 120%;
  right: 0;
  max-width: calc(100vw - 2rem);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.825rem;
  font-weight: 500;
  width: max-content;
  white-space: normal;
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

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const FloatingRocket = ({ isMobileOnly = false, isDesktopOnly = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const controls = useAnimation();
  const exhaustRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);
  const frameRef = useRef(null);
  const generationRef = useRef(0);
  const launchingRef = useRef(false);
  const clickCountRef = useRef(0);

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
    if (launchingRef.current) return;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const generation = ++generationRef.current;
    const nextClickCount = clickCountRef.current + 1;
    clickCountRef.current = nextClickCount;
    setClickCount(nextClickCount);
    setShowBubble(true);
    
    if (nextClickCount >= 3) {
      launchingRef.current = true;
      // Launch sequence
      setHasLaunched(true);
      
      // Emit custom launch event
      window.dispatchEvent(new CustomEvent('rocket-launch'));

      // Shake before launch (shorter, high-frequency engine throttle shake)
      await controls.start({
        x: [0, -8, 8, -8, 8, 0],
        transition: { duration: 0.2 }
      });
      if (generation !== generationRef.current) return;
      
      // Setup position tracking frame loop
      const trackPosition = () => {
        if (generation !== generationRef.current) return;
        if (exhaustRef.current) {
          const rect = exhaustRef.current.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent('rocket-emit-smoke', {
            detail: { x: rect.left, y: rect.top }
          }));
        }
        frameRef.current = requestAnimationFrame(trackPosition);
      };
      
      // Start tracking
      trackPosition();

      // Launch! (Snappy accelerating takeoff)
      await controls.start({
        y: -window.innerHeight - 200,
        transition: { 
          duration: 1.0,
          ease: [0.6, 0.05, 0.8, 0.05] // Faster, natural acceleration
        }
      });
      
      // Stop tracking frame loop
      if (generation !== generationRef.current) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;

      // Reset after launch (quicker reset)
      resetTimeoutRef.current = setTimeout(() => {
        controls.set({ y: 0 });
        launchingRef.current = false;
        clickCountRef.current = 0;
        setHasLaunched(false);
        setClickCount(0);
        setShowBubble(false);
      }, 700);
    } else {
      // Hide chat bubble and reset count after 3 seconds if they don't keep tapping
      clickTimeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        setClickCount(0);
        setShowBubble(false);
      }, 3000);

      await controls.start({
        y: [0, -20, 0],
        transition: { duration: 0.3 }
      });
      if (generation !== generationRef.current) return;
      controls.start(floatingAnimation);
    }
  };

  useEffect(() => {
    return () => {
      generationRef.current += 1;
      controls.stop();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clearTimeout(resetTimeoutRef.current);
      cancelAnimationFrame(frameRef.current);
    };
  }, [controls]);

  useEffect(() => {
    // Floating animation
    if (!hasLaunched) {
      controls.start(floatingAnimation);
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
        data-rocket
        type="button"
        aria-label={hasLaunched ? 'Rocket launching' : `Launch rocket: ${3 - clickCount} taps remaining`}
        aria-disabled={hasLaunched}
        animate={controls}
        onHoverStart={() => { setIsHovered(true); setShowBubble(true); }}
        onHoverEnd={() => { setIsHovered(false); if (clickCount === 0) setShowBubble(false); }}
        onFocus={() => setShowBubble(true)}
        onBlur={() => { if (clickCount === 0) setShowBubble(false); }}
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
          <FaRocket aria-hidden="true" />
          <Exhaust ref={exhaustRef} data-rocket-exhaust aria-hidden="true">
            <Flame
              data-rocket-flame
              animate={{
                opacity: hasLaunched ? 1 : 0,
                scaleY: hasLaunched ? [1, 1.5, 1] : 1,
              }}
              transition={{
                duration: 0.2,
                repeat: hasLaunched ? Infinity : 0,
                repeatType: "reverse"
              }}
            />

            {hasLaunched && (
              <>
                {[...Array(3)].map((_, index) => (
                  <Smoke
                    key={index}
                    initial={{ opacity: 0.6, scale: 0 }}
                    animate={{
                      y: [0, 60],
                      x: [0, (index - 1) * 12],
                      opacity: [0.6, 0],
                      scale: [1, 2.5]
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </Exhaust>
        </Rocket>
        
        <Tooltip
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: (showBubble || isHovered) && !hasLaunched ? 1 : 0,
            y: (showBubble || isHovered) && !hasLaunched ? 0 : 10,
          }}
        >
          {tooltipText}
        </Tooltip>
      </RocketContainer>
    </RocketWrapper>
  );
};

export default FloatingRocket;