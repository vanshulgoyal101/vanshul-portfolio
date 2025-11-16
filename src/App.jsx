// src/App.jsx
import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence } from 'framer-motion';

// Component imports
import GlobalStyles from './styles/GlobalStyles';
import Navigation from './components/Navigation/Navigation';
import About from './components/About/About';
import Work from './components/Work/Work';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import BlogPost from './pages/BlogPost';
import { ToastProvider } from './components/Toast';





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

// Loading component
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--color-accent-primary);
`;

// Lazy load heavy components
const Hero = lazy(() => import('./components/Hero/Hero'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const FloatingRocket = lazy(() => import('./components/FunElements/FloatingRocket'));
const PandaCursor = lazy(() => import('./components/FunElements/PandaCursor'));
const AirplaneTrail = lazy(() => import('./components/FunElements/AirplaneTrail'));



function App() {
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
        <AppWrapper>
          {/* Background ambient elements */}
          <BackgroundElements />
          
          {/* Fun Interactive Elements - spread throughout the site */}
          {/* Lazy load fun elements */}
          <Suspense fallback={null}>
            {/* <PandaCursor /> */}
            <FloatingRocket />
            {/* <AirplaneTrail /> */}
          </Suspense>
          
          <Routes>
            {/* Main portfolio page */}
            <Route path="/" element={
            <>
              <Navigation scrollToSection={scrollToSection} />
              <AnimatePresence mode="wait">
                <MainContent>
                  <Suspense fallback={<Loading>Loading...</Loading>}>
                    <SectionWrapper id="home">
                      <Hero />
                    </SectionWrapper>
                  </Suspense>

                  {/* About Section */}
                  <Suspense fallback={<Loading>Loading...</Loading>}>

                  <SectionWrapper
                    id="about"
                    variants={pageVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <About />
                  </SectionWrapper>

                  {/* Work Experience Section */}
                  <SectionWrapper
                    id="work"
                    variants={pageVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <Work />
                  </SectionWrapper>

                  {/* Projects Section with horizontal scroll */}
                  <SectionWrapper
                    id="projects"
                    variants={pageVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <Projects />
                  </SectionWrapper>

                  {/* Blog Section */}
                  <SectionWrapper
                    id="blog"
                    variants={pageVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <Blog />
                  </SectionWrapper>

                  {/* Contact Section */}
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