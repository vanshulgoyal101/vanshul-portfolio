// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MotionConfig, useReducedMotion } from 'framer-motion';

import GlobalStyles from './styles/GlobalStyles';
import { useIdle } from './hooks/useIdle';
import { scrollToSection as scrollToSectionUtil } from './utils/scrollToSection';
import Navigation from './components/Navigation/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import BackgroundElements from './components/BackgroundElements';
import NotFound from './pages/NotFound';
import SiteFooter from './components/SiteFooter';

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
import CustomCursor from './components/FunElements/CustomCursor';
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

const SectionWrapper = styled.div`
  width: 100%;
  position: relative;
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ScrollToHash: scrolls to a section when returning from a subroute, or when
// the URL contains a hash on a direct hit.
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    let cancelled = false;
    let frame;
    document.fonts?.ready.then(() => {
      if (!cancelled) frame = requestAnimationFrame(() => scrollToSectionUtil(decodeURIComponent(location.hash.slice(1)), { focus: true }));
    });
    if (!document.fonts) frame = requestAnimationFrame(() => scrollToSectionUtil(location.hash.slice(1), { focus: true }));
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [location]);

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

// Redirect legacy/plural blog URLs (/blogs, /blogs/:slug) to the canonical /blog.
const RedirectBlogSlug = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
};

function App() {
  const [ambientEnabled, setAmbientEnabled] = useState(() => {
    try { return localStorage.getItem('vg.ambient') !== 'off'; }
    catch { return true; }
  });
  const reducedMotion = useReducedMotion();
  const changeAmbient = enabled => {
    setAmbientEnabled(enabled);
    try { localStorage.setItem('vg.ambient', enabled ? 'on' : 'off'); }
    catch { return; }
  };

  return (
    <MotionConfig reducedMotion="user">
    <Router>
      <ScrollToHash />
      <Analytics />
      <ToastProvider>
        <GlobalStyles />
        
        <AppWrapper>
          <SkipLink href="#main-content">Skip to content</SkipLink>
          <CustomCursor />
          {/* Background ambient elements */}
          <BackgroundElements />
          
          {/* Fun Interactive Elements — deferred until after first paint */}
          {ambientEnabled && !reducedMotion && <IdleBackground />}
          
          <div id="main-content" tabIndex={-1}>
          <Suspense fallback={<MainContent role="status" style={{ padding: '8rem 2rem' }}>Loading page...</MainContent>}>
          <ErrorBoundary>
          <Routes>
            {/* Main portfolio page */}
            <Route path="/" element={
            <>
              <Navigation />
              <MainContent>
                  {/* Hero Section */}
                  <ErrorBoundary>
                    <SectionWrapper id="home">
                      <Hero />
                    </SectionWrapper>
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <SectionWrapper id="projects">
                      <Projects />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* About Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="about"
                    >
                      <About />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Work Experience Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="work"
                    >
                      <Work />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Blog Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="blog"
                    >
                      <Blog />
                    </SectionWrapper>
                  </ErrorBoundary>

                  {/* Contact Section */}
                  <ErrorBoundary>
                    <SectionWrapper
                      id="contact"
                    >
                      <Contact />
                    </SectionWrapper>
                  </ErrorBoundary>
                </MainContent>

              <SiteFooter ambientEnabled={ambientEnabled} reducedMotion={reducedMotion} onAmbientChange={changeAmbient} />
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
          </ErrorBoundary>
          </Suspense>
          </div>
        </AppWrapper>
      </ToastProvider>
    </Router>
    </MotionConfig>
  );
}

export default App;