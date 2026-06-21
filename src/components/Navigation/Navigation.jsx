// src/components/Navigation/Navigation.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

// Styled Components
const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;

  ${({ $scrolled }) => $scrolled && `
    top: 1rem;
    left: 1.5rem;
    right: 1.5rem;
    max-width: calc(var(--container-xl) - 3rem);
    margin: 0 auto;
    background: rgba(246, 243, 235, 0.75);
    border: 1px solid rgba(30, 41, 59, 0.06);
    border-radius: 100px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 12px 30px rgba(30, 41, 59, 0.06);
    
    @media (max-width: 768px) {
      top: 0.5rem;
      left: 1rem;
      right: 1rem;
      max-width: calc(100% - 2rem);
    }
  `}
`;

const NavContainer = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: ${({ $scrolled }) => $scrolled ? '0.75rem 1.75rem' : 'clamp(1rem, 3vw, 1.5rem) var(--container-padding)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  @media (max-width: 768px) {
    padding: ${({ $scrolled }) => $scrolled ? '0.6rem 1.2rem' : '1rem var(--container-padding)'};
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
  border: 1.5px solid var(--color-border);
  box-shadow: 0 4px 10px rgba(30, 41, 59, 0.03);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-accent-primary);
  font-family: var(--font-display);
`;

const ProgressRingSvg = styled.svg`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 40px;
  height: 40px;
  transform: rotate(-90deg);
  pointer-events: none;
`;

const LogoText = styled.span`
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  font-family: var(--font-display);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-gradient-1);
    transition: width 0.3s ease;
  }

  ${LogoContainer}:hover &::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    display: none;
  }
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
    height: 100vh;
    width: min(75vw, 360px);
    background: rgba(246, 243, 235, 0.85);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    transform: translateX(calc(100% + 40px));
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -15px 0 40px rgba(30, 41, 59, 0.05);
    border-left: 1px solid rgba(30, 41, 59, 0.08);
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;

    ${({ $isOpen }) => $isOpen && `
      transform: translateX(0);
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

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-gradient-1);
  transform-origin: 0%;
  z-index: var(--z-tooltip); /* Sit above everything, even fixed nav */
`;

// Navigation Component
const Navigation = ({ scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Memoized nav items — stable across renders
  const navItems = useMemo(() => [
    { id: 'home',     label: 'Home'     },
    { id: 'about',    label: 'About'    },
    { id: 'work',     label: 'Work'     },
    { id: 'projects', label: 'Projects' },
    { id: 'blog',     label: 'Blog'     },
    { id: 'contact',  label: 'Contact'  },
  ], []);

  // Treat /blog/:slug pages as "blog" section active
  const effectiveSection = location.pathname.startsWith('/blog') ? 'blog' : activeSection;

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar background on scroll
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section, index) => {
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(navItems[index].id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle navigation click
  const handleNavClick = useCallback((e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Check if we're on the home page
    const isOnHomePage = location.pathname === '/';
    
    if (isOnHomePage) {
      // Already on home page, just scroll to section
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    } else {
      // Navigate to home page first, then scroll
      navigate('/');
      // Wait for navigation and DOM render to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [scrollToSection, navigate, location.pathname]);

  // Animation variants
  const navVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

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
        variants={navVariants}
        initial="hidden"
        animate="visible"
        $scrolled={isScrolled}
      >
        <NavContainer $scrolled={isScrolled}>
          <LogoContainer
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
                  style={{ pathLength: scaleX }}
                />
              </ProgressRingSvg>
            </LogoBadge>
            <LogoText>Vanshul Goyal</LogoText>
          </LogoContainer>

          <NavLinks $isOpen={isMobileMenuOpen}>
            {navItems.map((item, index) => (
              <motion.li
                key={item.id}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <NavLink
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={effectiveSection === item.id ? 'active' : ''}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {item.label}
                </NavLink>
              </motion.li>
            ))}
          </NavLinks>

          <MenuButton
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
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;