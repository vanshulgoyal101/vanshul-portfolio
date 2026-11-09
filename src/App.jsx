// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MotionConfig, useReducedMotion } from 'framer-motion';

import GlobalStyles from './styles/GlobalStyles';
import { useIdle } from './hooks/useIdle';
import { getHashTarget, scrollToSection as scrollToSectionUtil } from './utils/scrollToSection';
import { useSeo } from './hooks/useSeo';
import { SITE_URL, AUTHOR_NAME, AUTHOR_SAME_AS, HOME_DESCRIPTION } from './constants/siteConfig';
import { PROFILE } from './constants/profile';
import { homeJsonLd } from '../scripts/lib/structuredData.mjs';
import { HOME_PATH, BLOG_PATH, postPath } from './constants/routes';
import Navigation from './components/Navigation/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import RouteError from './components/RouteError';
import PageLayout from './components/ui/PageLayout';
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
import BootLoader from './components/FunElements/BootLoader';
import Analytics from './components/Analytics';

// Heavy decorative elements — lazy loaded after first paint
const FloatingRocket = lazy(() => import('./components/FunElements/FloatingRocket'));
const SmokeTransition = lazy(() => import('./components/FunElements/SmokeTransition'));
const RandomTelemetry = lazy(() => import('./components/FunElements/RandomTelemetry'));
const InteractiveSpaceBackground = lazy(() => import('./components/FunElements/InteractiveSpaceBackground'));

// Private analytics dashboard — off the critical path.
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Styled Components
const AppWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  opacity: ${({ $isBooting }) => ($isBooting ? 0 : 1)};
`;

const MainContent = styled.main`
  position: relative;
  z-index: 2;
`;

// Holds the page's height while a lazy route loads, so the footer does not
// jump up and back down.
const PageLoading = styled.p`
  display: grid;
  place-items: center;
  min-height: 50vh;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
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

const HOME_JSON_LD = JSON.stringify(homeJsonLd({
  site: SITE_URL, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS, profile: PROFILE,
}));

const HomeMetadata = () => {
  useSeo({ title: AUTHOR_NAME, description: HOME_DESCRIPTION, path: HOME_PATH, jsonLd: HOME_JSON_LD });
  return null;
};

// ScrollToHash: scrolls to a section when returning from a subroute, or when
// the URL contains a hash on a direct hit.
const ScrollToHash = ({ isBooting }) => {
  const location = useLocation();

  useEffect(() => {
    if (isBooting || !location.hash) return;
    const target = getHashTarget(location.hash);
    let cancelled = false;
    let frame;
    document.fonts?.ready.then(() => {
      if (!cancelled) frame = requestAnimationFrame(() => scrollToSectionUtil(target, { focus: true }));
    });
    if (!document.fonts) frame = requestAnimationFrame(() => scrollToSectionUtil(target, { focus: true }));
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [location, isBooting]);

  return null;
};

// IdleBackground: renders decorative elements only after browser idle
const IdleBackground = () => {
  const ready = useIdle(1200);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <SmokeTransition />
      <FloatingRocket />
      <RandomTelemetry />
      <InteractiveSpaceBackground />
    </Suspense>
  );
};

// A page that fails to load or render is replaced by a full error page, which
// clears again as soon as the visitor navigates elsewhere.
const RouteBoundary = ({ children }) => {
  const { pathname } = useLocation();
  return <ErrorBoundary resetKey={pathname} fallback={<RouteError />}>{children}</ErrorBoundary>;
};

// Redirect legacy/plural blog URLs (/blogs, /blogs/:slug) to the canonical /blog/.
const RedirectBlogSlug = () => {
  const { slug } = useParams();
  return <Navigate to={postPath(slug)} replace />;
};

function App() {
  const [isBooting, setIsBooting] = useState(true);
  useEffect(() => {
    if (!isBooting) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isBooting]);

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
      <ScrollToHash isBooting={isBooting} />
      <Analytics />
      <ToastProvider>
        <GlobalStyles />
        {isBooting && <BootLoader onComplete={() => setIsBooting(false)} />}
        
        <AppWrapper inert={isBooting} $isBooting={isBooting}>
          <SkipLink href="#main-content">Skip to content</SkipLink>
          {!isBooting && <CustomCursor />}
          {/* Background ambient elements */}
          <BackgroundElements />
          
          {/* Fun Interactive Elements — deferred until after first paint */}
          {!isBooting && ambientEnabled && !reducedMotion && <IdleBackground />}
          
          <div id="main-content" tabIndex={-1}>
          <Suspense fallback={<PageLayout><PageLoading role="status">Loading page...</PageLoading></PageLayout>}>
          <RouteBoundary>
          <Routes>
            {/* Main portfolio page */}
            <Route path="/" element={
            <>
              <HomeMetadata />
              <Navigation />
              <MainContent>
                  {/* Hero Section */}
                  <ErrorBoundary>
                    <SectionWrapper id="home">
                      <Hero sceneEnabled={!isBooting} />
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

            </>
          } />
          
            
            {/* Curated reading list */}
            <Route path="/reading-list" element={<ReadingListPage />} />

            {/* Individual blog post page */}
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Blog index / listing page */}
            <Route path="/blog" element={<BlogIndex />} />

            {/* Plural/legacy aliases → canonical /blog/ */}
            <Route path="/blogs" element={<Navigate to={BLOG_PATH} replace />} />
            <Route path="/blogs/:slug" element={<RedirectBlogSlug />} />

            {/* Private analytics dashboard (owner-only, server-gated) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Catch-all: friendly, noindex 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </RouteBoundary>
          </Suspense>
          </div>
          <SiteFooter ambientEnabled={ambientEnabled} reducedMotion={reducedMotion} onAmbientChange={changeAmbient} />
        </AppWrapper>
      </ToastProvider>
    </Router>
    </MotionConfig>
  );
}

export default App;