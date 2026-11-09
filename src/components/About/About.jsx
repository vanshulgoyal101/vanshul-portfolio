// src/components/About/About.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCode, FaRocket, FaTrophy, FaReact, FaServer, FaTools, FaJava } from 'react-icons/fa';
import SectionHeader from '../ui/SectionHeader';
import { PROFILE, HIGHLIGHTS, SKILL_GROUPS } from '../../constants/profile';
import { EXPERIENCE } from '../../constants/experience';
import { AUTHOR_NAME } from '../../constants/siteConfig';

const [CURRENT_ROLE] = EXPERIENCE;

// ─── Layout ───────────────────────────────────────────────────────────────────

const AboutSection = styled.section`
  position: relative;
  padding: clamp(3.5rem, 7vw, 6rem) 0;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
  margin-bottom: clamp(3rem, 6vw, 4.5rem);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AboutContent = styled(motion.div)`
  order: 1;

  @media (max-width: 1024px) {
    order: 2;
  }
`;

const AboutText = styled.div`
  h3 {
    margin-bottom: 1.25rem;
    font-size: clamp(1.375rem, 2.5vw, 1.75rem);
    letter-spacing: -0.02em;
  }

  p {
    margin-bottom: 1.125rem;
    font-size: 1.0625rem;
    line-height: 1.75;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: var(--color-accent-primary);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
`;

// Emphasis, not links: ink and weight, so blue always means "clickable".
const HighlightText = styled.strong`
  font-weight: 600;
  color: var(--color-text-primary);
`;

const AboutImageContainer = styled(motion.div)`
  order: 2;
  width: 100%;
  max-width: 30rem;
  justify-self: end;

  @media (max-width: 1024px) {
    order: 1;
    justify-self: center;
    max-width: 22rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    aspect-ratio: 1 / 1;
  }
`;

const ProfileImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.4s ease;
`;

const ImagePlaceholder = styled.div`
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3rem;
  color: var(--color-accent-primary);
`;

// ─── Highlights ───────────────────────────────────────────────────────────────

const StatsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.5vw, 1rem);
  list-style: none;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StatCard = styled(motion.li)`
  padding: clamp(1.125rem, 2vw, 1.5rem);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
`;

const StatIcon = styled.span`
  display: block;
  margin-bottom: 0.875rem;
  font-size: 1.125rem;
  color: var(--color-accent-primary);
`;

const StatValue = styled.span`
  display: block;
  margin-bottom: 0.375rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
`;

const StatLabel = styled.span`
  display: block;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
`;

// ─── Skills ───────────────────────────────────────────────────────────────────

const SkillsContainer = styled.div`
  margin-top: clamp(3rem, 6vw, 4.5rem);
`;

const SkillsTitle = styled.h3`
  margin-bottom: 1.75rem;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  letter-spacing: -0.02em;
  text-align: center;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
  padding-top: 1.75rem;
  border-top: 1px solid var(--color-hairline);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCategory = styled(motion.div)`
  min-width: 0;
`;

const SkillCategoryTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-secondary);

  svg {
    color: var(--color-accent-primary);
  }
`;

const SkillsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
`;

const SkillTag = styled.li`
  padding: 0.3125rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
`;

// ─── Icons ────────────────────────────────────────────────────────────────────

// Data in constants/profile.js refers to icons by key.
const ICONS = {
  graduation: FaGraduationCap,
  java: FaJava,
  react: FaReact,
  rocket: FaRocket,
  server: FaServer,
  tools: FaTools,
  trophy: FaTrophy,
};

const DataIcon = ({ name }) => {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" />;
};

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

const About = () => {
  // Start false — set true only on successful load; show placeholder on error
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <AboutSection>
      <Container>
        <SectionHeader index="02" eyebrow="Background" title="About Me" lede="Engineer and a passionate learner." />

        <AboutGrid>
          <AboutContent variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            <AboutText>
              <h3>Hey There!</h3>
              <p>
                I&apos;m <HighlightText>{AUTHOR_NAME}</HighlightText>, a recent graduate from{' '}
                {PROFILE.education.school} with a {PROFILE.education.degree} in{' '}
                <HighlightText>{PROFILE.education.field}</HighlightText> and a minor in{' '}
                {PROFILE.education.minor}.
              </p>
              <p>
                Currently, I work as an <HighlightText>{PROFILE.role}</HighlightText> at{' '}
                <a href={PROFILE.employer.url} target="_blank" rel="noopener noreferrer">
                  {PROFILE.employer.name}
                </a>{' '}
                in the {CURRENT_ROLE.department} department.
              </p>
              <p>
                My journey has been shaped by incredible experiences — from leading a team to{' '}
                <HighlightText>NASA&apos;s Human Exploration Rover Challenge</HighlightText> to being
                selected among <HighlightText>30 global space leaders</HighlightText> for the
                NASA Space Apps Collective. Innovation happens at the intersection of technology,
                teamwork, and purpose.
              </p>
              <p>
                When I&apos;m not coding or optimizing business operations, you&apos;ll find me lost in
                books or playing cricket in the park.
              </p>
            </AboutText>
          </AboutContent>

          <AboutImageContainer variants={reveal} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            <ImageWrapper>
              {!imageError && (
                <ProfileImage
                  src={PROFILE.photo}
                  alt={PROFILE.photoAlt}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
              )}
              {(imageError || !imageLoaded) && (
                <ImagePlaceholder style={{ position: imageLoaded ? 'absolute' : 'relative', opacity: imageLoaded ? 0 : 1 }}>
                  <FaCode aria-hidden="true" />
                </ImagePlaceholder>
              )}
            </ImageWrapper>
          </AboutImageContainer>
        </AboutGrid>

        <StatsGrid>
          {HIGHLIGHTS.map((stat, i) => (
            <StatCard
              key={stat.label}
              custom={i}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <StatIcon><DataIcon name={stat.icon} /></StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <SkillsContainer>
          <SkillsTitle>Technical Skills</SkillsTitle>
          <SkillsGrid>
            {SKILL_GROUPS.map(({ category, icon, skills }, i) => (
              <SkillCategory
                key={category}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <SkillCategoryTitle>
                  <DataIcon name={icon} />
                  {category}
                </SkillCategoryTitle>
                <SkillsList>
                  {skills.map((skill) => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </SkillsList>
              </SkillCategory>
            ))}
          </SkillsGrid>
        </SkillsContainer>
      </Container>
    </AboutSection>
  );
};

export default About;
