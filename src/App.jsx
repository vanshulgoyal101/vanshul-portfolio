// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from 'framer-motion';

// Component imports
import GlobalStyles from './styles/GlobalStyles';
import Navigation from './components/Navigation/Navigation';
import BlogPost from './pages/BlogPost';
import { ToastProvider } from './components/Toast';
import BootLoader from './components/FunElements/BootLoader';
import { BlogSkeletonCard, ProjectSkeletonCard, WorkSkeletonCard, SkeletonElement } from './components/Skeleton';
import ErrorBoundary from './components/ErrorBoundary';

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
    opacity: 0.05;
    filter: blur(100px);
    animation: float 20s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    opacity: 0.05;
    filter: blur(100px);
    animation: float 20s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
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

const HeroSkeleton = () => (
  <div style={{ padding: '100px var(--container-padding)', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto', minHeight: '80vh', justifyContent: 'center' }}>
    <SkeletonElement $width="200px" $height="24px" />
    <SkeletonElement $width="80%" $height="64px" />
    <SkeletonElement $width="95%" $height="40px" />
    <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
      <SkeletonElement $width="150px" $height="48px" $radius="8px" />
      <SkeletonElement $width="150px" $height="48px" $radius="8px" />
    </div>
  </div>
);

const AboutSkeleton = () => (
  <div style={{ padding: '80px var(--container-padding)', display: 'flex', gap: '60px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', minHeight: '500px', alignItems: 'center' }}>
    <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <SkeletonElement $width="250px" $height="40px" />
      <SkeletonElement $width="100%" $height="180px" />
      <SkeletonElement $width="70%" $height="28px" />
    </div>
    <SkeletonElement $width="300px" $height="300px" $radius="16px" />
  </div>
);

const ContactSkeleton = () => (
  <div style={{ padding: '80px var(--container-padding)', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '400px' }}>
    <div style={{ alignSelf: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <SkeletonElement $width="300px" $height="40px" />
    </div>
    <SkeletonElement $width="100%" $height="50px" />
    <SkeletonElement $width="100%" $height="50px" />
    <SkeletonElement $width="100%" $height="120px" />
    <SkeletonElement $width="160px" $height="48px" $radius="8px" />
  </div>
);


// Lazy load heavy components
const Hero = lazy(() => import('./components/Hero/Hero'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const FloatingRocket = lazy(() => import('./components/FunElements/FloatingRocket'));
const PandaCursor = lazy(() => import('./components/FunElements/PandaCursor'));
const AirplaneTrail = lazy(() => import('./components/FunElements/AirplaneTrail'));
const RandomTelemetry = lazy(() => import('./components/FunElements/RandomTelemetry'));
const InteractiveSpaceBackground = lazy(() => import('./components/FunElements/InteractiveSpaceBackground'));
const About = lazy(() => import('./components/About/About'));
const Work = lazy(() => import('./components/Work/Work'));
const Blog = lazy(() => import('./components/Blog/Blog'));
const Contact = lazy(() => import('./components/Contact/Contact'));

// IdleBackground: renders decorative elements only after browser idle
const IdleBackground = () => {
  const ready = useIdle(1200);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <FloatingRocket />
      <RandomTelemetry />
      <InteractiveSpaceBackground />
    </Suspense>
  );
};

function App() {
  const [isBooting, setIsBooting] = useState(true);
  // const lenisRef = useRef(null);
  // const rafRef = useRef(null);
  // Initialize Lenis smooth scroll
  useEffect(() => {

    // const lenis = new Lenis({
    //   duration: 1.2,
    //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //   direction: 'vertical',
    //   gestureDirection: 'vertical',
    //   smooth: true,
    //   mouseMultiplier: 1,
    //   smoothTouch: false,
    //   touchMultiplier: 2,
    //   infinite: false,
    // });

    // lenisRef.current = lenis;

    // function raf(time) {
    //   lenis.raf(time);
    //   rafRef.current = requestAnimationFrame(raf);
    // }

    // rafRef.current = requestAnimationFrame(raf);
    // document.body.style.cursor = 'none';

    return () => {
      // document.body.style.cursor = 'auto';
    //   lenis.destroy();
    //   if (rafRef.current) {
    //     cancelAnimationFrame(rafRef.current);
    //   }
    };
  }, []);

  // Scroll to section function for navigation
  // const scrollToSection = (sectionId) => {
  //   const element = document.getElementById(sectionId);
  //   if (element && lenisRef.current) {
  //     lenisRef.current.scrollTo(element);
  //   }
  // };

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
      <ToastProvider>
        <GlobalStyles />
        <AnimatePresence mode="wait">
          {isBooting && <BootLoader onComplete={() => setIsBooting(false)} />}
        </AnimatePresence>
        
        <AppWrapper>
          {/* Background ambient elements */}
          <BackgroundElements />
          
          {/* Fun Interactive Elements — deferred until after first paint */}
          <IdleBackground />
          
          <Routes>
            {/* Main portfolio page */}
            <Route path="/" element={
            <>
              <Navigation scrollToSection={scrollToSection} />
              <AnimatePresence mode="wait">
                <MainContent>
                  {/* Hero Section */}
                  <ErrorBoundary>
                    <Suspense fallback={<HeroSkeleton />}>
                      <SectionWrapper id="home">
                        <Hero />
                      </SectionWrapper>
                    </Suspense>
                  </ErrorBoundary>

                  {/* About Section */}
                  <ErrorBoundary>
                    <Suspense fallback={<AboutSkeleton />}>
                      <SectionWrapper
                        id="about"
                        variants={pageVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <About />
                      </SectionWrapper>
                    </Suspense>
                  </ErrorBoundary>

                  {/* Work Experience Section */}
                  <ErrorBoundary>
                    <Suspense fallback={<div style={{ padding: '80px 0', maxWidth: 'var(--container-xl)', margin: '0 auto' }}><WorkSkeletonCard /></div>}>
                      <SectionWrapper
                        id="work"
                        variants={pageVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <Work />
                      </SectionWrapper>
                    </Suspense>
                  </ErrorBoundary>

                  {/* Projects Section with horizontal scroll */}
                  <ErrorBoundary>
                    <Suspense fallback={<div style={{ padding: '80px 0', maxWidth: 'var(--container-xl)', margin: '0 auto' }}><ProjectSkeletonCard /></div>}>
                      <SectionWrapper
                        id="projects"
                        variants={pageVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <Projects />
                      </SectionWrapper>
                    </Suspense>
                  </ErrorBoundary>

                  {/* Blog Section */}
                  <ErrorBoundary>
                    <Suspense fallback={<div style={{ padding: '80px 0', maxWidth: 'var(--container-xl)', margin: '0 auto' }}><BlogSkeletonCard /></div>}>
                      <SectionWrapper
                        id="blog"
                        variants={pageVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <Blog />
                      </SectionWrapper>
                    </Suspense>
                  </ErrorBoundary>

                  {/* Contact Section */}
                  <ErrorBoundary>
                    <Suspense fallback={<ContactSkeleton />}>
                      <SectionWrapper
                        id="contact"
                        variants={pageVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <Contact />
                      </SectionWrapper>
                    </Suspense>
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