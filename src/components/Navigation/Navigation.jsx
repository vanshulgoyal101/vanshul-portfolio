// src/components/Navigation/Navigation.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

// Styled Components
const Nav = styled(motion.nav)`
  position: fixed;
  top: 1rem;
  left: 0;
  right: 0;
  max-width: var(--container-xl);
  margin: 0 auto;
  border: none;
  border-radius: 100px;
  z-index: var(--z-fixed);
  background: transparent;

  /* The frosted pill is a pseudo-element: a backdrop-filter on the nav itself
     would become the containing block of the fixed mobile drawer. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: rgba(246, 243, 235, 0.82);
    backdrop-filter: saturate(180%) blur(16px);
    -webkit-backdrop-filter: saturate(180%) blur(16px);
    box-shadow: 0 12px 32px -16px rgba(15, 23, 42, 0.25), inset 0 0 0 1px rgba(15, 23, 42, 0.06);
    opacity: ${({ $scrolled }) => ($scrolled ? 1 : 0)};
    transition: opacity var(--duration-base) ease;
  }

  @media (max-width: 768px) {
    top: calc(0.5rem + env(safe-area-inset-top, 0px));
  }
`;

const NavContainer = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0.75rem var(--container-padding);
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    padding: 0.6rem var(--container-padding);
  }
`;

const LogoContainer = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  gap: 12px;
  cursor: pointer;
  position: relative;
  z-index: var(--z-fixed);
  text-decoration: none;
`;

const LogoBadge = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(30, 41, 59, 0.03);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-accent-primary);
  font-family: var(--font-display);
`;

const ProgressRingSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
`;

const NavLinks = styled(motion.ul)`
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.5vw, 2.25rem);
  list-style: none;
  counter-reset: nav-item;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0;
    width: min(86vw, 380px);
    height: 100dvh;
    padding: 5.5rem 2rem 2rem;
    overflow-y: auto;
    background: var(--color-bg-primary);
    border-left: 1px solid var(--color-hairline);
    box-shadow: -24px 0 48px -24px rgba(15, 23, 42, 0.25);
    transform: translateX(calc(100% + 48px));
    visibility: hidden;
    /* Hide only after the slide-out finishes, but become visible instantly on
       open so the first link can receive focus in the same frame. */
    transition: transform 0.35s var(--ease-out), visibility 0s linear 0.35s;

    ${({ $isOpen }) => $isOpen && `
      transform: translateX(0);
      visibility: visible;
      transition: transform 0.35s var(--ease-out), visibility 0s linear 0s;
    `}
  }
`;

const NavLink = styled.a`
  position: relative;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--duration-fast) ease;

  &:hover {
    color: var(--color-ink);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 4px;
    color: var(--color-ink);
  }

  &.active {
    color: var(--color-ink);
  }

  @media (min-width: 769px) {
    display: inline-flex;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 0;
      width: 100%;
      height: 2px;
      border-radius: 2px;
      background: var(--color-accent-primary);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--duration-base) var(--ease-out);
    }

    &:hover::after,
    &:focus-visible::after,
    &.active::after {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    width: 100%;
    min-height: 56px;
    padding: 0.75rem 0;
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--color-ink);
    border-bottom: 1px solid var(--color-border);

    &::before {
      counter-increment: nav-item;
      content: counter(nav-item, decimal-leading-zero);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      color: var(--color-text-muted);
    }

    &.active {
      color: var(--color-accent-primary);
    }
  }
`;

const MenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  z-index: var(--z-fixed);
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileOverlay = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(30, 41, 59, 0.35);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: calc(var(--z-fixed) - 1);
    cursor: pointer;
  }
`;

// Navigation Component
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scroll-spy applies to the homepage; writing pages (and the shelf) highlight
  // Blog, project stories highlight Projects and other routes highlight nothing.
  const { pathname } = location;
  const effectiveSection = pathname === '/'
    ? activeSection
    : /^\/(blog|reading-list)(\/|$)/.test(pathname) ? 'blog'
      : /^\/projects\//.test(pathname) ? 'projects' : null;

  // Keep the shared header offset in sync with the actual nav height so
  // native anchor jumps and programmatic scrolls land cleanly below the fixed bar.
  useEffect(() => {
    const syncHeaderOffset = () => {
      const offset = (navRef.current?.getBoundingClientRect().bottom ?? 76) + 20;
      document.documentElement.style.setProperty('--header-offset', `${offset}px`);
    };

    syncHeaderOffset();
    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(navRef.current);
    window.addEventListener('resize', syncHeaderOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeaderOffset);
    };
  }, []);

  // Handle scroll events
  useEffect(() => {
    let frame = null;
    const updateScroll = () => {
      frame = null;
      // Update navbar background on scroll
      setIsScrolled(window.scrollY > 50);

      if (location.pathname !== '/') return;
      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.innerHeight / 3;

      sections.forEach((section, index) => {
        if (section) {
          const { top, bottom } = section.getBoundingClientRect();
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(navItems[index].id);
          }
        }
      });
    };

    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(updateScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setIsMobile(media.matches);
      if (!media.matches) setIsMobileMenuOpen(false);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a')?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const controls = [...menuRef.current.querySelectorAll('a'), toggleRef.current];
        const current = controls.indexOf(document.activeElement);
        const next = event.shiftKey ? current - 1 : current + 1;
        if (current === -1 || next < 0 || next >= controls.length) {
          event.preventDefault();
          controls[event.shiftKey ? controls.length - 1 : 0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Handle navigation click
  const handleNavClick = (event, sectionId) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setIsMobileMenuOpen(false);
    navigate(`/#${sectionId}`);
  };

  // Animation variants
  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    open: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    },
  };

  return (
    <>
      <Nav
        ref={navRef}
        data-site-header
        aria-label="Primary navigation"
        $scrolled={isScrolled}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
          type: 'tween'
        }}
      >
        <NavContainer $scrolled={isScrolled}>
          <LogoContainer
            href="/#home"
            aria-label="Vanshul Goyal, home"
            onClick={(e) => handleNavClick(e, 'home')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogoBadge>
              VG
              <ProgressRingSvg viewBox="0 0 40 40">
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-accent-primary)" />
                    <stop offset="100%" stopColor="var(--color-accent-secondary)" />
                  </linearGradient>
                </defs>
                {/* Background track circle */}
                <circle
                  cx="20"
                  cy="20"
                  r="19"
                  fill="none"
                  stroke="rgba(30, 41, 59, 0.05)"
                  strokeWidth="1.2"
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx="20"
                  cy="20"
                  r="19"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  pathLength={scaleX}
                />
              </ProgressRingSvg>
            </LogoBadge>
          </LogoContainer>

          <NavLinks id="primary-menu" ref={menuRef} $isOpen={isMobileMenuOpen} inert={isMobile && !isMobileMenuOpen}>
            {navItems.map((item, index) => (
              <motion.li
                key={item.id}
                variants={linkVariants}
                initial={false}
                animate="visible"
                custom={index}
              >
                <NavLink
                  href={`/#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={effectiveSection === item.id ? 'active' : ''}
                  aria-current={effectiveSection === item.id ? 'true' : undefined}
                >
                  {item.label}
                </NavLink>
              </motion.li>
            ))}
          </NavLinks>

          <MenuButton
            ref={toggleRef}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiX />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HiMenuAlt3 />
                </motion.div>
              )}
            </AnimatePresence>
          </MenuButton>
        </NavContainer>
      </Nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileOverlay
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => {
              setIsMobileMenuOpen(false);
              toggleRef.current?.focus();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;