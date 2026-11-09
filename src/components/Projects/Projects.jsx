// src/components/Projects/Projects.jsx
import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaRocket, FaCode, FaGithub, FaSun, FaPuzzlePiece, FaTools, FaBrain, FaLock, FaEnvelope,
  FaWrench, FaEye, FaCube, FaRobot, FaBalanceScale, FaGlobeAmericas, FaDesktop, FaFileAlt,
  FaDatabase,
} from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import { IoGameController } from 'react-icons/io5';
import { HiArrowUpRight, HiChevronDown } from 'react-icons/hi2';
import SectionHeader from '../ui/SectionHeader';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY, CASE_STUDY_FIELDS } from '../../constants/projects';

// ─── Layout ───────────────────────────────────────────────────────────────────

const ProjectsSection = styled.section`
  position: relative;
  padding: 2rem 0 clamp(3.5rem, 7vw, 6rem);

  @media (max-width: 768px) {
    padding-top: 1rem;
  }
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Featured card ────────────────────────────────────────────────────────────

const ProjectCard = styled(motion.article)`
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition:
    border-color var(--duration-base) ease,
    box-shadow var(--duration-base) ease;

  &:hover {
    border-color: var(--color-accent-line);
    box-shadow: var(--shadow-md);
  }
`;

const ProjectImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 8 / 5;
  overflow: hidden;
  background: var(--color-bg-tertiary);
`;

const ProjectImg = styled.img`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
`;

const ProjectImageFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 2.5rem;
  color: var(--color-accent-primary);
`;

const ProjectContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const ProjectRole = styled.p`
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent-primary);
`;

const ProjectTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
`;

const AdBrainMark = styled.img.attrs({
  src: '/images/projects/adbrain-icon.svg',
  alt: '',
  'aria-hidden': true,
  width: 28,
  height: 28,
})`
  flex-shrink: 0;
  width: 1.4em;
  height: 1.4em;
  object-fit: contain;
`;

const ProjectDescription = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.65;
`;

const ProjectStats = styled.ul`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  list-style: none;
`;

const StatItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-secondary);

  svg {
    flex-shrink: 0;
    font-size: 0.875rem;
    color: var(--color-accent-primary);
  }
`;

const CaseStudy = styled.details`
  border-top: 1px solid var(--color-border);

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 48px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-ink);
    list-style: none;
    cursor: pointer;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary svg {
    color: var(--color-text-muted);
    transition: transform var(--duration-base) var(--ease-out);
  }

  &[open] summary svg {
    transform: rotate(180deg);
  }

  summary:hover {
    color: var(--color-accent-primary);
  }

  summary:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  dl {
    padding-bottom: 1rem;
  }

  dt {
    margin-top: 1rem;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  dt:first-child {
    margin-top: 0.25rem;
  }

  dd {
    margin-top: 0.375rem;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 0.375rem;
  min-height: 48px;
  padding-top: 0.25rem;
  border-top: 1px solid var(--color-border);
  width: 100%;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent-primary);

  svg {
    transition: transform var(--duration-fast) var(--ease-out);
  }

  &:hover svg {
    transform: translate(2px, -2px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

// ─── Directory ────────────────────────────────────────────────────────────────

const MoreProjects = styled.details`
  margin-top: clamp(3rem, 6vw, 4.5rem);
  border-top: 1px solid var(--color-hairline);
`;

const MoreHeader = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 44px;
  padding: 1.5rem 0 0.5rem;
  list-style: none;
  text-align: left;
  cursor: pointer;

  &::-webkit-details-marker {
    display: none;
  }

  > svg {
    flex-shrink: 0;
    font-size: 1.25rem;
    color: var(--color-ink);
    transition: transform var(--duration-base) var(--ease-out);
  }

  ${MoreProjects}[open] > & > svg {
    transform: rotate(180deg);
  }

  &:hover h3 {
    color: var(--color-accent-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const MoreHeading = styled.span`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const MoreTitle = styled.h3`
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  letter-spacing: -0.02em;
  transition: color var(--duration-fast) ease;
`;

const Count = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
`;

const MoreSubtitle = styled.p`
  font-size: 0.9375rem;
`;

const CategoryGroup = styled.div`
  margin-top: 2.25rem;
`;

const CategoryLabel = styled.h4`
  margin-bottom: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CompactCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--color-border);
`;

const CompactTop = styled.div`
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
`;

const CompactIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-muted);

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const VBrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5M3.477 10.896a4 4 0 0 1 .585-.396M19.938 10.5a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
);

const CompactName = styled.h5`
  min-width: 0;
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
`;

const CompactDesc = styled.p`
  margin: 0 0 0 2.25rem;
  font-size: 0.875rem;
  line-height: 1.6;
`;

const CompactLinks = styled.div`
  display: flex;
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);

  &:hover {
    color: var(--color-ink);
    background: var(--color-bg-card);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: -3px;
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────

// Data in constants/projects.js refers to icons by key.
const ICONS = {
  adbrain: AdBrainMark,
  brain: FaBrain,
  code: FaCode,
  cube: FaCube,
  database: FaDatabase,
  desktop: FaDesktop,
  envelope: FaEnvelope,
  eye: FaEye,
  file: FaFileAlt,
  game: IoGameController,
  globe: FaGlobeAmericas,
  groups: MdGroups,
  lock: FaLock,
  money: BiMoney,
  puzzle: FaPuzzlePiece,
  robot: FaRobot,
  rocket: FaRocket,
  scale: FaBalanceScale,
  sun: FaSun,
  tools: FaTools,
  vbrain: VBrainIcon,
  wrench: FaWrench,
};

const ProjectIcon = ({ name }) => {
  const Icon = ICONS[name];
  return <Icon />;
};

const DIRECTORY_SIZE = PROJECT_DIRECTORY.reduce((total, group) => total + group.items.length, 0);

// ─── Components ───────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ProjectImage = ({ src, alt, fallback }) => {
  const [errored, setErrored] = useState(false);
  return (
    <ProjectImageWrapper>
      {errored ? (
        <ProjectImageFallback>{fallback}</ProjectImageFallback>
      ) : (
        <ProjectImg src={src} alt={alt} loading="lazy" decoding="async" onError={() => setErrored(true)} />
      )}
    </ProjectImageWrapper>
  );
};

const Projects = () => (
  <ProjectsSection>
    <Container>
      <SectionHeader
        index="01"
        eyebrow="Selected work"
        title="Featured Projects"
        lede="Software in use. Games you can play. A rover we built."
      />

      <ProjectsGrid>
        {FEATURED_PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.id}
            custom={i}
            variants={cardVariants}
            initial={false}
            whileInView="visible"
            whileHover={{ y: -4 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            <ProjectImage
              src={project.image}
              alt={project.title}
              fallback={<ProjectIcon name={project.fallbackIcon} />}
            />
            <ProjectContent>
              <ProjectRole>{project.role}</ProjectRole>
              <ProjectTitle>{project.brand && <ProjectIcon name={project.brand} />}{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>

              <ProjectStats>
                {project.stats.map((stat) => (
                  <StatItem key={stat.text}>
                    <ProjectIcon name={stat.icon} />
                    <span>{stat.text}</span>
                  </StatItem>
                ))}
              </ProjectStats>

              <CaseStudy>
                <summary aria-label={`Read case study: ${project.title}`}>
                  Read case study
                  <HiChevronDown aria-hidden="true" />
                </summary>
                <dl>
                  {CASE_STUDY_FIELDS.map(([field, label]) => (
                    <Fragment key={field}>
                      <dt>{label}</dt>
                      <dd>{project.caseStudy[field]}</dd>
                    </Fragment>
                  ))}
                </dl>
              </CaseStudy>

              <ProjectLink href={project.link} target="_blank" rel="noopener noreferrer">
                Visit Website
                <HiArrowUpRight aria-hidden="true" />
              </ProjectLink>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <MoreProjects role="region" aria-labelledby="project-directory-title">
        <MoreHeader>
          <MoreHeading>
            <MoreTitle id="project-directory-title">More things I&apos;ve built</MoreTitle>
            <Count>{DIRECTORY_SIZE} projects</Count>
          </MoreHeading>
          <HiChevronDown aria-hidden="true" />
        </MoreHeader>
        <MoreSubtitle>Live products, open-source packages and interactive experiments.</MoreSubtitle>

        {PROJECT_DIRECTORY.map((group) => (
          <CategoryGroup key={group.category}>
            <CategoryLabel>{group.category}</CategoryLabel>
            <CompactGrid>
              {group.items.map((item) => (
                <CompactCard key={item.title}>
                  <CompactTop>
                    <CompactIcon aria-hidden="true"><ProjectIcon name={item.icon} /></CompactIcon>
                    <CompactName>{item.title}</CompactName>
                    <CompactLinks>
                      {item.live && (
                        <IconLink href={item.live} aria-label={`Visit ${item.title}`} title={`Visit ${item.title}`} target="_blank" rel="noopener noreferrer">
                          <HiArrowUpRight size={17} aria-hidden="true" />
                        </IconLink>
                      )}
                      {item.repo && (
                        <IconLink href={item.repo} aria-label={`View ${item.title} source code`} title={`View ${item.title} source code`} target="_blank" rel="noopener noreferrer">
                          <FaGithub size={17} aria-hidden="true" />
                        </IconLink>
                      )}
                    </CompactLinks>
                  </CompactTop>
                  <CompactDesc>{item.desc}</CompactDesc>
                </CompactCard>
              ))}
            </CompactGrid>
          </CategoryGroup>
        ))}
      </MoreProjects>
    </Container>
  </ProjectsSection>
);

export default Projects;
