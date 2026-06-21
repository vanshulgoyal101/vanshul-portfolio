// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Component imports
import GlobalStyles from './styles/GlobalStyles';
import Navigation from './components/Navigation/Navigation';
import BlogPost from './pages/BlogPost';
import { ToastProvider } from './components/Toast';
import BootLoader from './components/FunElements/BootLoader';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/FunElements/CustomCursor';

// Idle loader — renders children only after browser is idle (post first paint)
const useIdle = (delay = 1500) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Use requestIdleCallback if available, else a plain timeout
    let id;
    if ('requestIdleCallback' in window) {
      id = requestIdleCallback(() => setReady(true), { timeout: delay });
    } else {
      id = setTimeout(() => setReady(true), delay);
    }
    return () => {
      if ('cancelIdleCallback' in window) cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [delay]);
  return ready;
};







// Styled Components
const AppWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  position: relative;
  z-index: 2;
`;

const BackgroundElements = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  
  /* Gradient orbs for ambience */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    filter: blur(100px);
    animation: float 25s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    filter: blur(100px);
    animation: float 30s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.02;
    }
    33% {
      transform: translate(80px, -80px) scale(1.15);
      opacity: 0.06;
    }
    66% {
      transform: translate(-50px, 50px) scale(0.9);
      opacity: 0.015;
    }
  }
`;

const SectionWrapper = styled(motion.section)`
  width: 100%;
  position: relative;
`;




// Loading fallback spacers
const Loading = styled.div`
  min-height: 200px;
`;


import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Work from './components/Work/Work';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import SmokeTransition from './components/FunElements/SmokeTransition';

// Lazy load heavy components
const FloatingRocket = lazy(() => import('./components/FunElements/FloatingRocket'));
const RandomTelemetry = lazy(() => import('./components/FunElements/RandomTelemetry'));
const InteractiveSpaceBackground = lazy(() => import('./components/FunElements/InteractiveSpaceBackground'));

// ScrollToHash: Handles scrolling to sections when returning from subroutes or on direct URL hits containing hashes
import { useLocation } from 'react-router-dom';
const ScrollToHash = ({ isBooting }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isBooting && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timeoutId = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [location, isBooting]);

  return null;
};

// IdleBackground: renders decorative elements only after browser idle
const IdleBackground = () => {
  const ready = useIdle(1200);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <FloatingRocket isDesktopOnly />
      <RandomTelemetry />
      <InteractiveSpaceBackground />
    </Suspense>
  );
};

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <Router>
      <ScrollToHash isBooting={isBooting} />
      <ToastProvider>
        <GlobalStyles />
        <AnimatePresence mode="wait">
          {isBooting && <BootLoader onComplete={() => setIsBooting(false)} />}
        </AnimatePresence>
        
        <AppWrapper>
          <CustomCursor />
          {/* Background ambient elements */}
          <BackgroundElements />
          
          {/* Fun Interactive Elements — deferred until after first paint */}
          <IdleBackground />
          <SmokeTransition />
          
          <Routes>
            {/* Main portfolio page */}
            <Route path="/" element={
            <>
              <Navigation scrollToSection={scrollToSection} />
              <AnimatePresence mode="wait">
                <MainContent>
                  {/* Hero Section */}
                  <ErrorBoundary>
                    <SectionWrapper id="home">
                      <Hero />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* About Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="about"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <About />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Work Experience Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="work"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <Work />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Projects Section with horizontal scroll */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="projects"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <Projects />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Blog Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="blog"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <Blog />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Contact Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="contact"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <Contact />
                    </SectionWrapper>
                  </ErrorBoundary>
                </MainContent>
              </AnimatePresence>
            </>
          } />
          
            
            {/* Individual blog post page */}
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </AppWrapper>
      </ToastProvider>
    </Router>
  );
}export default App;