// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

import GlobalStyles from './styles/GlobalStyles';
import { useIdle } from './hooks/useIdle';
import { pageVariants } from './constants/motionVariants';
import Navigation from './components/Navigation/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import BackgroundElements from './components/BackgroundElements';
import NotFound from './pages/NotFound';
import CursorToggle from './components/CursorToggle';

// Long-form pages pull in the markdown renderer — keep them off the home bundle.
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const ReadingListPage = lazy(() => import('./pages/ReadingList'));

// Sections (critical path)
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Work from './components/Work/Work';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';

// Decorative elements
import BootLoader from './components/FunElements/BootLoader';
import CustomCursor from './components/FunElements/CustomCursor';
import SmokeTransition from './components/FunElements/SmokeTransition';
import Analytics from './components/Analytics';

// Heavy decorative elements — lazy loaded after first paint
const FloatingRocket = lazy(() => import('./components/FunElements/FloatingRocket'));
const RandomTelemetry = lazy(() => import('./components/FunElements/RandomTelemetry'));
const InteractiveSpaceBackground = lazy(() => import('./components/FunElements/InteractiveSpaceBackground'));

// Private analytics dashboard — off the critical path.
const Dashboard = lazy(() => import('./pages/Dashboard'));

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

// Keyboard/screen-reader affordance: hidden until focused, then jumps to content.
const SkipLink = styled.a`
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 1000;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-accent-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  /* Fully off-screen (size-independent) until keyboard focus reveals it. */
  transform: translateY(calc(-100% - 16px));
  transition: transform 0.15s ease;

  &:focus {
    transform: translateY(0);
  }
`;

const SectionWrapper = styled(motion.section)`
  width: 100%;
  position: relative;
`;

const SiteFooter = styled.footer`
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) var(--container-padding);
  text-align: center;
  color: var(--color-text-secondary);
`;

const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);

  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-accent-primary);
    }
  }
`;

const FooterNote = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ScrollToHash: scrolls to a section when returning from a subroute, or when
// the URL contains a hash on a direct hit.
const ScrollToHash = ({ isBooting }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isBooting && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timeoutId = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [location, isBooting]);

  return null;
};

ScrollToHash.propTypes = {
  isBooting: PropTypes.bool.isRequired,
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

// Redirect legacy/plural blog URLs (/blogs, /blogs/:slug) to the canonical /blog.
const RedirectBlogSlug = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
};

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Router>
      <ScrollToHash isBooting={isBooting} />
      <Analytics />
      <ToastProvider>
        <GlobalStyles />
        <AnimatePresence mode="wait">
          {isBooting && <BootLoader onComplete={() => setIsBooting(false)} />}
        </AnimatePresence>
        
        <AppWrapper>
          <SkipLink href="#main-content">Skip to content</SkipLink>
          <CustomCursor />
          {/* Background ambient elements */}
          <BackgroundElements $animated />
          
          {/* Fun Interactive Elements — deferred until after first paint */}
          <IdleBackground />
          <SmokeTransition />
          
          <Suspense fallback={null}>
          <Routes>
            {/* Main portfolio page */}
            <Route path="/" element={
            <>
              <Navigation scrollToSection={scrollToSection} />
              <MainContent id="main-content" tabIndex={-1}>
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

              <SiteFooter>
                <FooterLinks aria-label="Vanshul Goyal network">
                  <a href="/#blog">Blog</a>
                  <a href="https://games.vanshul.com" target="_blank" rel="noopener noreferrer">Games</a>
                  <a href="https://links.vanshul.com" target="_blank" rel="noopener noreferrer">Links</a>
                  <a href="https://github.com/vanshulgoyal101" target="_blank" rel="noopener noreferrer">GitHub</a>
                </FooterLinks>
                <FooterNote>© {new Date().getFullYear()} Vanshul Goyal · vanshul.com</FooterNote>
                <CursorToggle />
              </SiteFooter>
            </>
          } />
          
            
            {/* Curated reading list */}
            <Route path="/reading-list" element={<ReadingListPage />} />

            {/* Individual blog post page */}
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Blog index / listing page */}
            <Route path="/blog" element={<BlogIndex />} />

            {/* Plural/legacy aliases → canonical /blog */}
            <Route path="/blogs" element={<Navigate to="/blog" replace />} />
            <Route path="/blogs/:slug" element={<RedirectBlogSlug />} />

            {/* Private analytics dashboard (owner-only, server-gated) */}
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={null}>
                  <Dashboard />
                </Suspense>
              }
            />

            {/* Catch-all: friendly, noindex 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AppWrapper>
      </ToastProvider>
    </Router>
  );
}

export default App;