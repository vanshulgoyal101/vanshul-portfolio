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
  left: 1.5rem;
  right: 1.5rem;
  max-width: calc(var(--container-xl) - 3rem);
  margin: 0 auto;
  border: 1px solid transparent;
  border-radius: 100px;
  z-index: var(--z-fixed);
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  background: transparent;

  @media (max-width: 768px) {
    top: calc(0.5rem + env(safe-area-inset-top, 0px));
    left: 1rem;
    right: 1rem;
  }

  ${({ $scrolled }) => $scrolled && `
    background: rgba(246, 243, 235, 0.98);
    border: 1px solid rgba(30, 41, 59, 0.06);
    box-shadow: 0 12px 30px rgba(30, 41, 59, 0.06);
  `}
`;

const NavContainer = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0.75rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
  }
`;

const LogoContainer = styled(motion.a)`
  display: flex;
  align-items: center;
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
  gap: clamp(1.5rem, 3vw, 3rem);
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100dvh;
    overflow-y: auto;
    width: min(75vw, 360px);
    background: rgba(246, 243, 235, 0.85);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    transform: translateX(calc(100% + 40px));
    visibility: hidden;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -15px 0 40px rgba(30, 41, 59, 0.05);
    border-left: 1px solid rgba(30, 41, 59, 0.08);
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;

    ${({ $isOpen }) => $isOpen && `
      transform: translateX(0);
      visibility: visible;
    `}
  }
`;

const NavLink = styled(motion.a)`
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-text-primary);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 4px;
    color: var(--color-text-primary);
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    display: flex;
    align-items: center;
  }

  @media (min-width: 769px) {
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: var(--color-accent-primary);
      transition: width 0.3s ease;
    }

    &:hover::after,
    &:focus-visible::after {
      width: 100%;
    }

    &.active::after {
      width: 100%;
      background: var(--color-gradient-1);
    }
  }

  @media (max-width: 768px) {
    font-size: var(--text-lg);
    width: 100%;
    padding: 1rem 0;
    
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

  // Treat /blog/:slug pages as "blog" section active
  const effectiveSection = location.pathname.startsWith('/blog') ? 'blog' : activeSection;

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
    const handleScroll = () => {
      // Update navbar background on scroll
      setIsScrolled(window.scrollY > 50);

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
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