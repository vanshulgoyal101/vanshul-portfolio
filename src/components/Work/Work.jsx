// src/components/Work/Work.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlane, FaLaptopCode } from 'react-icons/fa';
import { HiArrowUpRight } from 'react-icons/hi2';
import SectionHeader from '../ui/SectionHeader';
import { EXPERIENCE } from '../../constants/experience';

// Typography sizes here are a tested contract (see documentation/homepage.md):
// role 20px / 18px mobile, company 16px, description 16px, metadata 14px.

const WorkSection = styled.section`
  position: relative;
  padding: clamp(3.5rem, 7vw, 6rem) 0;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: 1.25rem;
  max-width: 56rem;
  margin: 0 auto;
  list-style: none;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ExperienceCard = styled(motion.li)`
  position: relative;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--duration-base) ease, box-shadow var(--duration-base) ease;

  &:hover {
    border-color: var(--color-accent-line);
    box-shadow: var(--shadow-md);
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    gap: 0.875rem;
    margin-bottom: 12px;
  }
`;

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-bg-tertiary);
  color: var(--color-ink);
  font-size: 1.0625rem;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const CardInfo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 1.5rem;
  row-gap: 0.25rem;
  min-width: 0;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  line-height: 1.3;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CompanyName = styled.h4`
  grid-column: 1;
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--color-text-secondary);
`;

const MetaInfo = styled.div`
  grid-column: 2;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  white-space: nowrap;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: auto;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem 0.75rem;
    margin-top: 0.25rem;
    white-space: normal;
  }
`;

const Description = styled.p`
  margin-bottom: 1.25rem;
  font-size: 1rem;
  line-height: 1.8;

  @media (max-width: 768px) {
    line-height: 1.6;
    margin-bottom: 12px;
  }
`;

const CardFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
`;

const TechStack = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
`;

const TechTag = styled.li`
  padding: 0.25rem 0.625rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
`;

const CompanyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 44px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
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

// Data in constants/experience.js refers to icons by key.
const ICONS = { plane: FaPlane, laptop: FaLaptopCode };

const hostname = (url) => new URL(url).hostname.replace(/^www\./, '');

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Work = () => (
  <WorkSection>
    <Container>
      <SectionHeader
        index="03"
        eyebrow="Experience"
        title="Work Experience"
        lede="Building impactful solutions across aviation and healthcare"
      />

      <Timeline>
        {EXPERIENCE.map((exp, i) => {
          const Icon = ICONS[exp.icon];
          return (
            <ExperienceCard
              key={exp.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <CardHeader>
                <CardIcon aria-hidden="true"><Icon /></CardIcon>
                <CardInfo>
                  <JobTitle>{exp.title}</JobTitle>
                  <CompanyName>
                    {exp.company}
                    {exp.department && ` · ${exp.department}`}
                  </CompanyName>
                  <MetaInfo>
                    <span>{exp.duration}</span>
                    <span>{exp.location}</span>
                  </MetaInfo>
                </CardInfo>
              </CardHeader>

              <Description>{exp.description}</Description>

              <CardFooter>
                <TechStack aria-label="Tools">
                  {exp.tech.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </TechStack>
                {exp.link && (
                  <CompanyLink href={exp.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit the ${exp.company} website`}>
                    {hostname(exp.link)}
                    <HiArrowUpRight aria-hidden="true" />
                  </CompanyLink>
                )}
              </CardFooter>
            </ExperienceCard>
          );
        })}
      </Timeline>
    </Container>
  </WorkSection>
);

export default Work;
