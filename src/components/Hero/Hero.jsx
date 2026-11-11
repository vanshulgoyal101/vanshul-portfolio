// src/components/Hero/Hero.jsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

import Magnetic from '../FunElements/Magnetic';
import { useIdle } from '../../hooks/useIdle';
import ErrorBoundary from '../ErrorBoundary';
import { ButtonLink } from '../ui/Button';
import { PROFILE } from '../../constants/profile';
import { SOCIAL_PROFILES } from '../../constants/siteConfig';
import { homeSectionPath } from '../../constants/routes';
import { SOCIAL_ICONS } from '../socialIcons';

const HeroScene = lazy(() => import('./HeroScene'));

const HeroSection = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 0 3rem;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    padding: 6.5rem 0 2rem;
  }
`;

const HeroContainer = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  text-align: left;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const HeroContent = styled(motion.div)`
  min-width: 0;
  max-width: 40rem;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const SceneArea = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  height: clamp(20rem, 45vh, 28rem);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Eyebrow = styled(motion.p)`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent-primary);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
  flex-shrink: 0;
`;

const Title = styled(motion.h1)`
  margin-bottom: 1.25rem;
  font-size: clamp(2.5rem, 10vw, 4.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-ink);
`;

const Summary = styled(motion.p)`
  max-width: 34rem;
  margin-bottom: 1.25rem;
  font-size: clamp(1.0625rem, 2.2vw, 1.3125rem);
  line-height: 1.55;
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    margin-inline: auto;
  }
`;

const Credentials = styled(motion.p)`
  margin-bottom: 2rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-secondary);

  a {
    color: var(--color-text-primary);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: var(--color-hairline);
    text-underline-offset: 4px;

    &:hover {
      color: var(--color-accent-primary);
      text-decoration-color: currentColor;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const Separator = styled.span`
  margin: 0 0.5rem;
  color: var(--color-text-muted);
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.75rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;

    a {
      width: 280px;
      max-width: 100%;
    }
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  gap: 0.625rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--color-hairline);
  border-radius: 50%;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  transition:
    color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    background-color var(--duration-fast) ease;

  &:hover {
    color: var(--color-ink);
    border-color: var(--color-ink);
    background: var(--color-bg-card);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 3px;
    color: var(--color-ink);
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const Hero = ({ sceneEnabled = true }) => {
  const idle = useIdle(1200);
  const [sceneAllowed, setSceneAllowed] = useState(false);
  const sceneArea = useRef(null);
  const [sceneRequested, setSceneRequested] = useState(false);

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

  useEffect(() => {
    if (!sceneEnabled || !idle || !sceneAllowed || sceneRequested) return;
    let cancelled = false;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!cancelled && entry.isIntersecting) setSceneRequested(true);
    });
    const observe = () => {
      if (cancelled) return;
      // Let the initial hash scroll and font layout settle before deciding to download 3D.
      frame = requestAnimationFrame(() => observer.observe(sceneArea.current));
    };
    if (document.fonts) document.fonts.ready.then(observe);
    else observe();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [sceneEnabled, idle, sceneAllowed, sceneRequested]);

  return (
    <HeroSection>
      <HeroContainer>
        <HeroContent variants={containerVariants} initial={false} animate="visible">
          <Eyebrow variants={itemVariants}>
            <Dot aria-hidden="true" />
            {PROFILE.headline}
          </Eyebrow>

          <Title variants={itemVariants}>Vanshul Goyal</Title>

          <Summary variants={itemVariants}>{PROFILE.summary}</Summary>

          <Credentials variants={itemVariants}>
            {PROFILE.role} at{' '}
            <a href="https://www.united.com/en/us/fly/company/company-info/about-united.html" target="_blank" rel="noopener noreferrer">
              {PROFILE.employer.name}
            </a>
            <Separator aria-hidden="true">·</Separator>
            <a href="https://www.spaceappschallenge.org/collective/" target="_blank" rel="noopener noreferrer">
              NASA Space Apps Collective
            </a>
            <Separator aria-hidden="true">·</Separator>
            <a href="https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/" target="_blank" rel="noopener noreferrer">
              HERC 2023
            </a>
          </Credentials>

          <Actions variants={itemVariants}>
            <Magnetic range={80}>
              <ButtonLink to={homeSectionPath('projects')}>
                Explore My Work
                <HiArrowRight aria-hidden="true" data-arrow="forward" />
              </ButtonLink>
            </Magnetic>
            <Magnetic range={80}>
              <ButtonLink $variant="secondary" to={homeSectionPath('contact')}>
                Get In Touch
              </ButtonLink>
            </Magnetic>
          </Actions>

          <SocialLinks variants={itemVariants}>
            {SOCIAL_PROFILES.map(({ id, label, url }) => {
              const Icon = SOCIAL_ICONS[id];
              return (
                <Magnetic key={id} range={35}>
                  <SocialLink
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon />
                  </SocialLink>
                </Magnetic>
              );
            })}
          </SocialLinks>
        </HeroContent>
        <SceneArea ref={sceneArea} aria-hidden="true" data-hero-scene>
          {sceneEnabled && idle && sceneAllowed && sceneRequested && (
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </ErrorBoundary>
          )}
        </SceneArea>
      </HeroContainer>
    </HeroSection>
  );
};

export default Hero;
