// src/components/Hero/Hero.jsx
import { Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import FloatingShape from './FloatingShape';
import { bioData } from '../../constants/portfolioData';

// Styled Components
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: clamp(80px, 12vh, 120px) 0;
  background: var(--color-bg-primary);
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--spacing-xl);
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-lg);
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 650px;
  
  @media (max-width: 1024px) {
    margin: 0 auto;
  }
`;

const Greeting = styled(motion.span)`
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  
  span {
    color: var(--color-accent-primary);
    background: linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled(motion.h2)`
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
  
  a {
    color: var(--color-text-primary);
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    transition: var(--transition-base);
    
    &:hover {
      color: var(--color-accent-primary);
      border-color: var(--color-accent-primary);
    }
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(motion.a)`
  padding: 12px 28px;
  background: var(--color-accent-primary);
  color: #070a13;
  font-family: var(--font-display);
  font-weight: 600;
  border-radius: 4px;
  font-size: var(--text-sm);
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: var(--transition-base);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.15);
  
  &:hover {
    background: #fbbf24;
    color: #070a13;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(245, 158, 11, 0.3);
  }
`;

const SecondaryButton = styled(motion.a)`
  padding: 12px 28px;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: var(--font-display);
  font-weight: 500;
  border-radius: 4px;
  font-size: var(--text-sm);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--color-accent-secondary);
    color: var(--color-accent-secondary);
    transform: translateY(-2px);
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    transform: translateY(-3px);
  }
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 480px;
  position: relative;

  @media (max-width: 1024px) {
    height: 320px;
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
`;

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <HeroSection id="home">
      <Container>
        <HeroContent
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Greeting variants={itemVariants}>
            {bioData.tagline}
          </Greeting>

          <Title variants={itemVariants}>
            Vanshul <span>Goyal</span>
          </Title>

          <Subtitle variants={itemVariants}>
            Associate Analyst at <a href="https://www.united.com" target="_blank" rel="noopener noreferrer">United Airlines</a> • Co-founder at <a href="https://solaride.in" target="_blank" rel="noopener noreferrer">Solaride</a> • NASA <a href='https://www.spaceappschallenge.org' target='_blank' rel='noopener noreferrer'>SpaceApps</a> Community & NASA <a href='https://www.nasa.gov' target='_blank' rel='noopener noreferrer'>HERC SEDS PEC</a> Alum.
          </Subtitle>

          <CTAContainer variants={itemVariants}>
            <PrimaryButton
              href="#work"
              whileTap={{ scale: 0.98 }}
            >
              Explore Experience
            </PrimaryButton>
            <SecondaryButton
              href="#contact"
              whileTap={{ scale: 0.98 }}
            >
              Get In Touch
            </SecondaryButton>
          </CTAContainer>

          <SocialLinks variants={itemVariants}>
            <SocialLink
              href={bioData.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </SocialLink>
            <SocialLink
              href={bioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </SocialLink>
            <SocialLink
              href={bioData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </SocialLink>
            <SocialLink
              href={bioData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </SocialLink>
          </SocialLinks>
        </HeroContent>

        <CanvasContainer>
          <Suspense fallback={
            <LoadingContainer>
              INITIALIZING 3D ORBITAL...
            </LoadingContainer>
          }>
            <Canvas
              camera={{ position: [-3, -3, 0], fov: 90 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Preload all />
              <FloatingShape />
            </Canvas>
          </Suspense>
        </CanvasContainer>
      </Container>
    </HeroSection>
  );
};

export default Hero;