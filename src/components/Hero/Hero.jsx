// src/components/Hero/Hero.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoGameController } from 'react-icons/io5';
import Magnetic from '../FunElements/Magnetic';
import { useIdle } from '../../hooks/useIdle';
import ErrorBoundary from '../ErrorBoundary';

const HeroScene = lazy(() => import('./HeroScene'));

// Styled Components
const HeroSection = styled.section`
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 8rem 0 2.5rem;
  
  @media (max-width: 768px) {
    min-height: 0;
    padding: 6.5rem 0 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const HeroContainer = styled.div`
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 2rem;
  text-align: left;
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 38rem;
  min-width: 0;
`;

const SceneArea = styled.div`
  min-width: 0;
  width: 100%;
  height: clamp(20rem, 45vh, 28rem);
  position: relative;

  @media (max-width: 1024px) { display: none; }
`;

const Greeting = styled(motion.span)`
  display: inline-block;
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  letter-spacing: 0;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: var(--spacing-xs);
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-xs);
  }
`;

const Description = styled(motion.p)`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-md);
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 0.75rem;
    margin-bottom: var(--spacing-md);
    
    a {
      width: 280px;
      max-width: 100%;
    }
  }
`;

const CTAButton = styled(Link)`
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 4vw, 2.5rem);
  background: var(--color-gradient-1);
  color: var(--color-bg-primary);
  font-weight: 600;
  border-radius: 50px;
  font-size: var(--text-base);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: translateX(0);
  }
  
  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: var(--text-sm);
  }
`;

const SecondaryButton = styled(Link)`
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 4vw, 2.5rem);
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
  font-weight: 600;
  border-radius: 50px;
  font-size: var(--text-base);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: var(--text-sm);
  }
  
  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-start;
`;

const SocialLink = styled(motion.a)`
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    transform: translateY(-3px);
  }
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  }
`;

// Hero Component
const Hero = () => {
  const idle = useIdle(1200);
  const [sceneAllowed, setSceneAllowed] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1025px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSceneAllowed(desktop.matches && !reducedMotion.matches);
    update();
    desktop.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <HeroSection>
      <HeroContainer>
        <HeroContent
          variants={containerVariants}
          initial={false}
          animate="visible"
        >
          <Greeting variants={itemVariants}>
            Engineer &amp; independent builder
          </Greeting>

          <Title variants={itemVariants}>
            Vanshul Goyal
          </Title>

          <Subtitle variants={itemVariants}>
            Associate Analyst at <a href="https://www.united.com/en/us/fly/company/company-info/about-united.html" target="_blank" rel="noopener noreferrer">United Airlines</a> | NASA <a href="https://www.spaceappschallenge.org/collective/" target="_blank" rel="noopener noreferrer"> SpaceApps Collective</a>, <a href="https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge" target="_blank" rel="noopener noreferrer"> HERC 2023</a>
          </Subtitle>

          <Description variants={itemVariants}>
            I build software for real businesses, tools for curious people, and things that move beyond the screen.
          </Description>

          <CTAContainer variants={itemVariants}>
            <Magnetic range={80}>
              <CTAButton
                to="/#projects"
              >
                Explore My Work
              </CTAButton>
            </Magnetic>
            <Magnetic range={80}>
              <SecondaryButton
                to="/#contact"
              >
                Get In Touch
              </SecondaryButton>
            </Magnetic>
          </CTAContainer>

          <SocialLinks variants={itemVariants}>
            <Magnetic range={35}>
              <SocialLink
                href="https://x.com/goyal_vanshul"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Twitter"
              >
                <FaXTwitter />
              </SocialLink>
            </Magnetic>
            <Magnetic range={35}>
              <SocialLink
                href="https://www.linkedin.com/in/vanshul-goyal00/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </SocialLink>
            </Magnetic>
            <Magnetic range={35}>
              <SocialLink
                href="https://www.instagram.com/vanshul_goyal/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Instagram"
              >
                <FaInstagram />
              </SocialLink>
            </Magnetic>
            <Magnetic range={35}>
              <SocialLink
                href="https://github.com/vanshulgoyal101"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="GitHub"
              >
                <FaGithub />
              </SocialLink>
            </Magnetic>
            <Magnetic range={35}>
              <SocialLink
                href="https://games.vanshul.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Games"
              >
                <IoGameController />
              </SocialLink>
            </Magnetic>
          </SocialLinks>
        </HeroContent>
        <SceneArea aria-hidden="true" data-hero-scene>
          {idle && sceneAllowed && <ErrorBoundary fallback={null}><Suspense fallback={null}><HeroScene /></Suspense></ErrorBoundary>}
        </SceneArea>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;