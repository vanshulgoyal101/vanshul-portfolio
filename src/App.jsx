// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
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
  background-color: var(--color-bg-primary);
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
  opacity: 0.15;
  
  /* Gradient orbs for atmosphere matching solar/sky themes */
  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    filter: blur(140px);
    animation: floatOrb 24s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    filter: blur(140px);
    animation: floatOrb 24s ease-in-out infinite reverse;
  }
  
  @keyframes floatOrb {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(5%, -5%) scale(1.15);
    }
  }
`;

const SectionWrapper = styled(motion.section)`
  width: 100%;
  position: relative;
`;

const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
`;

// Lazy Loaded Components
const Hero = lazy(() => import('./components/Hero/Hero'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const Chatbot = lazy(() => import('./components/Chatbot/Chatbot'));

function App() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset slightly for the fixed navbar
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <Router>
      <ToastProvider>
        <GlobalStyles />
        <AppWrapper>
          <BackgroundElements />
          
          {/* Lazy loaded chatbot assistant */}
          <Suspense fallback={null}>
            <Chatbot />
          </Suspense>
          
          <Routes>
            <Route path="/" element={
              <>
                <Navigation scrollToSection={scrollToSection} />
                <AnimatePresence mode="wait">
                  <MainContent>
                    <Suspense fallback={<LoadingFallback>LOADING SYSTEM...</LoadingFallback>}>
                      <SectionWrapper id="home" variants={pageVariants} initial="initial" animate="animate">
                        <Hero />
                      </SectionWrapper>
                    </Suspense>

                    <SectionWrapper
                      id="about"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.15 }}
                    >
                      <About />
                    </SectionWrapper>

                    <SectionWrapper
                      id="work"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.15 }}
                    >
                      <Work />
                    </SectionWrapper>

                    <Suspense fallback={<LoadingFallback>LOADING PROJECTS...</LoadingFallback>}>
                      <SectionWrapper
                        id="projects"
                        variants={pageVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.15 }}
                      >
                        <Projects />
                      </SectionWrapper>
                    </Suspense>

                    <SectionWrapper
                      id="blog"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.15 }}
                    >
                      <Blog />
                    </SectionWrapper>

                    <SectionWrapper
                      id="contact"
                      variants={pageVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.15 }}
                    >
                      <Contact />
                    </SectionWrapper>
                  </MainContent>
                </AnimatePresence>
              </>
            } />
            
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </AppWrapper>
      </ToastProvider>
    </Router>
  );
}

export default App;