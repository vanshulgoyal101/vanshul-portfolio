// src/components/FunElements/AirplaneTrail.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

const AirplaneContainer = styled(motion.div)`
  position: fixed;
  z-index: 50;
  pointer-events: none;
`;

const Airplane = styled(motion.div)`
  font-size: 2rem;
  color: var(--color-accent-primary);
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
  transform: rotate(45deg);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TrailDot = styled(motion.div)`
  position: fixed;
  width: 6px;
  height: 6px;
  background: var(--color-accent-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 49;
`;

const Banner = styled(motion.div)`
  position: fixed;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  white-space: nowrap;
  pointer-events: none;
  z-index: 48;
`;

const AirplaneTrail = () => {
  const [trails, setTrails] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [flightCount, setFlightCount] = useState(0);

  // Flight paths
  const flightPaths = [
    {
      startX: -100,
      startY: '20%',
      endX: window.innerWidth + 100,
      endY: '25%',
      duration: 15,
      message: 'United Airlines ✈️'
    },
    {
      startX: window.innerWidth + 100,
      startY: '60%',
      endX: -100,
      endY: '65%',
      duration: 18,
      message: 'To infinity and beyond! 🚀'
    },
    {
      startX: -100,
      startY: '40%',
      endX: window.innerWidth + 100,
      endY: '30%',
      duration: 20,
      message: 'Next stop: Innovation! 💡'
    }
  ];

  const currentPath = flightPaths[flightCount % flightPaths.length];

  // Create trail effect
  const createTrail = (x, y) => {
    const newTrail = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    setTrails(prev => [...prev, newTrail]);
    
    // Remove trail after animation
    setTimeout(() => {
      setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
    }, 1000);
  };

  // Start new flight
  const startFlight = () => {
    setFlightCount(prev => prev + 1);
    
    // Show banner at random times
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000);
      }, currentPath.duration * 500);
    }
  };

  useEffect(() => {
    // Start first flight after 5 seconds
    const initialTimer = setTimeout(startFlight, 5000);
    
    // Schedule periodic flights
    const interval = setInterval(startFlight, 30000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {flightCount > 0 && (
          <AirplaneContainer
            key={flightCount}
            initial={{ 
              x: currentPath.startX, 
              y: currentPath.startY,
              rotate: currentPath.startX < 0 ? 45 : -135
            }}
            animate={{ 
              x: currentPath.endX, 
              y: currentPath.endY,
            }}
            transition={{ 
              duration: currentPath.duration,
              ease: "linear",
              repeat: 0
            }}
            onUpdate={(latest) => {
              // Create trail dots during flight
              if (Math.random() > 0.8) {
                createTrail(latest.x, latest.y);
              }
            }}
            exit={{ opacity: 0 }}
          >
            <Airplane>
              <FaPaperPlane />
            </Airplane>
          </AirplaneContainer>
        )}
        
        {/* Trail dots */}
        {trails.map(trail => (
          <TrailDot
            key={trail.id}
            initial={{ 
              x: trail.x - 10, 
              y: trail.y,
              opacity: 0.8,
              scale: 1
            }}
            animate={{ 
              opacity: 0,
              scale: 0,
              x: trail.x - 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
        
        {/* Banner message */}
        {showBanner && (
          <Banner
            initial={{ 
              x: window.innerWidth / 2 - 100,
              y: currentPath.endY,
              opacity: 0,
              scale: 0.8
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: `calc(${currentPath.endY} - 50px)`
            }}
            exit={{ 
              opacity: 0,
              scale: 0.8,
              y: `calc(${currentPath.endY} - 70px)`
            }}
            transition={{ duration: 0.5 }}
          >
            {currentPath.message}
          </Banner>
        )}
      </AnimatePresence>
    </>
  );
};

export default AirplaneTrail;