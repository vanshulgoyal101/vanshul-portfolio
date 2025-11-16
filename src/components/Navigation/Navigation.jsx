// src/components/Navigation/Navigation.jsx
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

// Styled Components
const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: var(--transition-base);

  ${({ $scrolled }) => $scrolled && `
    background: rgba(10, 10, 10, 0.9);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  `}
`;

const NavContainer = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.5rem) var(--container-padding);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.a)`
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  cursor: pointer;
  position: relative;
  z-index: var(--z-fixed);

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

  &:hover::after {
    width: 100%;
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
    width: min(75vw, 400px);
    background: rgba(15, 15, 15, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    border-left: 1px solid var(--color-border);

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
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: calc(var(--z-fixed) - 1);
    cursor: pointer;
  }
`;

// Navigation Component
const Navigation = ({ scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

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
  }, []);

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
    
    // Small delay for mobile menu animation
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 300);
  }, [scrollToSection]);

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
        <NavContainer>
          <Logo
            onClick={(e) => handleNavClick(e, 'home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Vanshul Goyal
          </Logo>

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
                  className={activeSection === item.id ? 'active' : ''}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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