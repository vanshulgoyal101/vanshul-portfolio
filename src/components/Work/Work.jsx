// src/components/Work/Work.jsx
import { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaPlane, FaSolarPanel, FaLaptopCode, FaExternalLinkAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';

// Styled Components
const WorkSection = styled.section`
  padding: var(--spacing-xl) 0;
  position: relative;
  background: var(--color-bg-primary);
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
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
`;

// Simplified Timeline
const ExperienceGrid = styled.div`
  display: grid;
  gap: var(--spacing-md);
  max-width: 900px;
  margin: 0 auto;
`;

const ExperienceCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: var(--color-accent-primary);
    border-radius: 50%;
    opacity: 0.5;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const CardInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const CompanyName = styled.h4`
  font-size: var(--text-lg);
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const MetaInfo = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const TechTag = styled.span`
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-accent-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--text-xs);
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const CompanyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  margin-top: var(--spacing-sm);
  
  &:hover {
    text-decoration: underline;
  }
`;

const Work = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const experiences = [
    {
      id: 1,
      icon: <FaPlane />,
      title: 'Associate Analyst',
      company: 'United Airlines',
      department: 'Air Operations',
      duration: 'Jul 2025 - Present',
      location: 'Gurugram, India',
      description: 'Contributing to air operations systems and processes at one of the world\'s leading airlines. Working on optimizing critical aviation systems and improving operational efficiency.',
      tech: ['Power BI', 'MS Excel', 'Tableau', 'Data Analysis'],
      link: null,
    },
    {
      id: 2,
      icon: <FaSolarPanel />,
      title: 'Co-Founder',
      company: 'Solaride',
      department: 'Operations & Strategy',
      duration: '2024 - Present',
      location: 'Chandigarh, India',
      description: 'Leading business operations and scaling strategies for the EPC company specializing in solar installations. Managing projects under PM Surya Ghar and PM KUSUM Yojana.',
      tech: ['Operations', 'Project Management', 'Business Development', 'Solar Energy'],
      link: 'https://solaride.in',
    },
    {
      id: 3,
      icon: <FaLaptopCode />,
      title: 'Software Development Engineer Intern',
      company: 'zHealth',
      department: 'Engineering',
      duration: '2023 - 2024',
      location: 'San Francisco, US (Remote)',
      description: 'Developed and automated end-to-end sign-up process for healthcare providers. Engineered custom interfaces for 100+ Healthcare Organizations to securely manage Patient Health Records in compliance with healthcare standards.',
      tech: ['Java', 'Spring Boot', 'JavaScript', 'SQL'],
      link: 'https://www.zhealthehr.com/',
    },
  ];

  return (
    <WorkSection ref={sectionRef}>
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Work Experience</SectionTitle>
          <SectionSubtitle>
            Building impactful solutions across aviation, renewable energy, and healthcare
          </SectionSubtitle>
        </SectionHeader>

        <ExperienceGrid>
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardHeader>
                <CardInfo>
                  <JobTitle>{exp.title}</JobTitle>
                  <CompanyName>
                    {exp.company}
                    {exp.department && ` • ${exp.department}`}
                  </CompanyName>
                  <MetaInfo>
                    <span>{exp.duration}</span>
                    <span>{exp.location}</span>
                  </MetaInfo>
                </CardInfo>
              </CardHeader>

              <Description>{exp.description}</Description>

              <TechStack>
                {exp.tech.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </TechStack>

              {exp.link && (
                <CompanyLink
                  href={exp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                  <FaExternalLinkAlt size={12} />
                </CompanyLink>
              )}
            </ExperienceCard>
          ))}
        </ExperienceGrid>
      </Container>
    </WorkSection>
  );
};

export default Work;