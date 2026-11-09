// src/components/Projects/Projects.jsx
import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaExternalLinkAlt, FaCode, FaGithub, FaSun, FaPuzzlePiece, FaTools, FaBrain, FaLock, FaEnvelope, FaWrench, FaEye, FaCube, FaRobot, FaBalanceScale, FaGlobeAmericas, FaDesktop, FaFileAlt, FaDatabase, FaChevronDown } from 'react-icons/fa';
import { FEATURED_PROJECTS, PROJECT_DIRECTORY, CASE_STUDY_FIELDS } from '../../constants/projects';
import { MdGroups } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import { IoGameController } from 'react-icons/io5';

// ─── Styled Components ────────────────────────────────────────────────────────

const ProjectsSection = styled.section`
  position: relative;
  background: transparent;
  padding: 2rem 0 var(--spacing-2xl);

  @media (max-width: 768px) {
    padding: 1rem 0 var(--spacing-xl);
  }
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-lg);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-section-title);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

`;

const SectionSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`;

const ProjectCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  min-width: 0;
  overflow: hidden;
  position: relative;
  transition: border-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08), 
                0 0 0 1px rgba(29, 78, 216, 0.05);
    transform: translateY(-6px);
  }
`;

const ProjectImageWrapper = styled.div`
  aspect-ratio: 8 / 5;
  overflow: hidden;
  background: var(--color-bg-secondary);
  position: relative;
`;

const ProjectImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  display: block;
`;

/* Fallback gradient shown when image is missing */
const ProjectImageFallback = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(54, 217, 138, 0.2), rgba(54, 217, 138, 0.06));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #36d98a;
  font-size: 2.5rem;
  opacity: 0.7;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const ProjectTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  overflow-wrap: anywhere;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
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

const ProjectRole = styled.p`
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 500;
`;

const ProjectDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  font-size: var(--text-base);

  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-bottom: var(--spacing-sm);
  }
`;

const ProjectStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);

  svg {
    color: var(--color-accent-primary);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: var(--text-xs);
  }
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: var(--spacing-xs) 0;
  min-height: 44px;
  transition: gap 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    text-decoration: underline;
    
    svg {
      transform: translateX(4px);
    }
  }

  @media (max-width: 768px) {
    min-height: 48px;
  }
`;

/* ── "More projects" compact tier ── */

const MoreProjects = styled.details`
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
`;

const CaseStudy = styled.details`
  margin: 1rem 0;
  border-top: 1px solid var(--color-border);

  summary {
    cursor: pointer;
    padding: 0.75rem 0;
    font-weight: 600;
    color: var(--color-accent-primary);
  }

  dt { font-weight: 600; margin-top: 0.75rem; }
  dd { margin: 0.25rem 0 1rem; color: var(--color-text-secondary); font-size: 0.9375rem; }
`;

const MoreHeader = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 44px;
  padding: 0.75rem 0;
  cursor: pointer;
  list-style: none;
  text-align: left;
  &::-webkit-details-marker { display: none; }
  > svg { flex-shrink: 0; color: var(--color-accent-primary); }
  ${MoreProjects}[open] > & > svg { transform: rotate(180deg); }
  &:focus-visible { outline: 2px solid var(--color-accent-primary); outline-offset: 4px; }
`;

const MoreTitle = styled.h3`
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin: 0;

  @media (max-width: 768px) {
    font-size: var(--text-xl);
  }
`;

const MoreSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--text-base);
`;

const CategoryGroup = styled.div`
  margin-top: 2rem;
`;

const CategoryLabel = styled.h4`
  font-size: var(--text-sm);
  letter-spacing: 0;
  color: var(--color-text-secondary);
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const CompactCard = styled(motion.div)`
  min-width: 0;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const CompactTop = styled.div`
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
`;

const CompactIcon = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);

  svg {
    width: 1.05rem;
    height: 1.05rem;
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
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
`;

const CompactDesc = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.55;
  margin: 0 0 0 2.25rem;
`;

const CompactLinks = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--color-text-secondary);
  border-radius: 6px;

  &:hover {
    color: var(--color-accent-primary);
    background: var(--color-bg-secondary);
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

// ─── Animation variants ───────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: 'easeOut' },
  }),
};

// ─── Sub-component: project image with fallback ───────────────────────────────

const ProjectImage = ({ src, alt, fallback }) => {
  const [errored, setErrored] = useState(false);
  return (
    <ProjectImageWrapper>
      {!errored ? (
        <ProjectImg
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <ProjectImageFallback>{fallback}</ProjectImageFallback>
      )}
    </ProjectImageWrapper>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────



const Projects = () => {
  return (
    <ProjectsSection>
      <Container>
        <SectionHeader
          variants={headerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            Software in use. Games you can play. A rover we built.
          </SectionSubtitle>
        </SectionHeader>

        <ProjectsGrid>
          {FEATURED_PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              custom={i}
              variants={cardVariants}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <ProjectImage
                src={project.image}
                alt={project.title}
                fallback={<ProjectIcon name={project.fallbackIcon} />}
              />
              <ProjectContent>
                <ProjectTitle>{project.brand && <ProjectIcon name={project.brand} />}{project.title}</ProjectTitle>
                <ProjectRole>{project.role}</ProjectRole>
                <ProjectDescription>{project.description}</ProjectDescription>
                <CaseStudy>
                  <summary aria-label={`Read case study: ${project.title}`}>Read case study</summary>
                  <dl>
                    {CASE_STUDY_FIELDS.map(([field, label]) => (
                      <Fragment key={field}>
                        <dt>{label}</dt>
                        <dd>{project.caseStudy[field]}</dd>
                      </Fragment>
                    ))}
                  </dl>
                </CaseStudy>

                <ProjectStats>
                  {project.stats.map((stat) => (
                    <StatItem key={stat.text}>
                      <ProjectIcon name={stat.icon} />
                      <span>{stat.text}</span>
                    </StatItem>
                  ))}
                </ProjectStats>

                {project.link && (
                  <ProjectLink href={project.link} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <FaExternalLinkAlt size={12} />
                  </ProjectLink>
                )}
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>

        <MoreProjects role="region" aria-labelledby="project-directory-title">
          <MoreHeader>
            <MoreTitle id="project-directory-title">More things I&apos;ve built</MoreTitle>
            <FaChevronDown aria-hidden="true" />
          </MoreHeader>
          <MoreSubtitle>Live products, open-source packages and interactive experiments.</MoreSubtitle>

          {PROJECT_DIRECTORY.map((group) => (
            <CategoryGroup key={group.category}>
              <CategoryLabel>{group.category}</CategoryLabel>
              <CompactGrid>
                {group.items.map((item) => (
                  <CompactCard
                    key={item.title}
                  >
                    <CompactTop>
                      <CompactIcon aria-hidden="true"><ProjectIcon name={item.icon} /></CompactIcon>
                      <CompactName>{item.title}</CompactName>
                      <CompactLinks>
                        {item.live && (
                          <IconLink href={item.live} aria-label={`Visit ${item.title}`} title={`Visit ${item.title}`} target="_blank" rel="noopener noreferrer">
                            <FaExternalLinkAlt size={14} aria-hidden="true" />
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
};

export default Projects;