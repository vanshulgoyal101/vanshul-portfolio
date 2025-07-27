// src/components/Hero/Hero.jsx
import { useRef, Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import FloatingShape from './FloatingShape';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiArrowDown } from 'react-icons/hi';

// Styled Components
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: var(--spacing-xl) var(--container-padding);
`;

const HeroContainer = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 600px;

  @media (max-width: 1024px) {
    margin: 0 auto;
  }
`;

const Greeting = styled(motion.span)`
  display: inline-block;
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
`;

const Description = styled(motion.p)`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.8;
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const CTAButton = styled(motion.a)`
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
`;

const SecondaryButton = styled(motion.a)`
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1.75rem, 4vw, 2.5rem);
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
  font-weight: 600;
  border-radius: 50px;
  font-size: var(--text-base);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-accent-primary);
    color: var(--color-accent-primary);
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
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;

  @media (max-width: 1024px) {
    height: 400px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    z-index: -1;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
`;

const ScrollText = styled.span`
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
`;

// Hero Component
const Hero = () => {
    const containerRef = useRef();

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

    const scrollToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <HeroSection ref={containerRef}>
            <HeroContainer>
                <HeroContent
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Greeting variants={itemVariants}>
                        Hello, I'm
                    </Greeting>

                    <Title variants={itemVariants}>
                        Vanshul Goyal
                    </Title>

                    <Subtitle variants={itemVariants}>
                        Engineer at United Airlines • Co-founder at Solaride
                    </Subtitle>

                    <Description variants={itemVariants}>
                        Building sustainable solutions at the intersection of technology and innovation.
                        Passionate about aerospace, renewable energy, and creating meaningful impact.
                    </Description>

                    <CTAContainer variants={itemVariants}>
                        <CTAButton
                            href="#work"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore My Work
                        </CTAButton>
                        <SecondaryButton
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get In Touch
                        </SecondaryButton>
                    </CTAContainer>

                    <SocialLinks variants={itemVariants}>
                        <SocialLink
                            href="https://x.com/goyal_vanshul"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </SocialLink>
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
                    </SocialLinks>
                </HeroContent>

                <CanvasContainer>
                    <Suspense fallback={
                        <LoadingContainer>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                Loading 3D...
                            </motion.div>
                        </LoadingContainer>
                    }>
                        <Canvas
                            camera={{ position: [0, 0, 5], fov: 75 }}
                            gl={{ antialias: true, alpha: true }}
                        >
                            <Preload all />
                            <FloatingShape />
                        </Canvas>
                    </Suspense>
                </CanvasContainer>
            </HeroContainer>

            {/* <ScrollIndicator
                onClick={scrollToAbout}
                whileHover={{ y: 5 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ScrollText>Scroll</ScrollText>
                <HiArrowDown />
            </ScrollIndicator> */}
        </HeroSection>
    );
};

export default Hero;