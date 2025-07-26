// src/components/Projects/Projects.jsx
import { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaRocket, FaGlobeAfrica, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';

// Styled Components
const ProjectsSection = styled.section`
  position: relative;
  background: var(--color-bg-secondary);
  padding: var(--spacing-xl) 0;
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

// Simple Grid Layout (No GSAP)
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
`;

const ProjectCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--color-accent-primary);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--color-gradient-1)'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProjectContent = styled.div`
  padding: var(--spacing-lg);
`;

const ProjectTitle = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
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
`;

const ProjectStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  
  svg {
    color: var(--color-accent-primary);
  }
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const projects = [
    {
      id: 1,
      title: 'NASA Human Exploration Rover Challenge',
      role: 'Team Lead',
      description: 'Led the design and construction of a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking.',
      image: '/images/projects/nasa-herc.jpg',
      stats: [
        { icon: <MdGroups />, text: '12k+ Students' },
        { icon: <BiMoney />, text: '$30k Funding' },
      ],
      link: '#'
    },
    {
      id: 2,
      title: 'NASA Space Apps Challenge',
      role: 'Global Space Leader',
      description: 'Selected among 30 global space leaders. Developed weather visualization tools for Zimbabwean farmers using NASA data.',
      image: '/images/projects/space-apps.jpg',
      stats: [
        { icon: <MdGroups />, text: 'Global Team' },
        { icon: <FaRocket />, text: 'NASA Data' },
      ],
      link: '#'
    },
    {
      id: 3,
      title: 'Astronomy & Space Physics Society',
      role: 'Core Team Member',
      description: 'Organized telescope workshops and educational events to promote space sciences among students.',
      image: '/images/projects/college.jpg',
      stats: [
        { icon: <MdGroups />, text: '500+ Students' },
        { icon: <FaRocket />, text: 'Multiple Events' },
      ],
      link: '#'
    },
    {
      id: 4,
      title: 'Solaride',
      role: 'Co-Founder',
      description: 'Building sustainable energy solutions across Chandigarh and Haryana. Installing solar plants under government schemes.',
      image: '/images/projects/solaride.jpg',
      stats: [
        { icon: <MdGroups />, text: 'Active Projects' },
        { icon: <FaRocket />, text: 'Govt. Registered' },
      ],
      link: 'https://solaride.in'
    }
  ];

  return (
    <ProjectsSection ref={sectionRef}>
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            From space exploration to sustainable energy - projects that define my journey
          </SectionSubtitle>
        </SectionHeader>

        <ProjectsGrid>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <ProjectImage $image={project.image} />
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectRole>{project.role}</ProjectRole>
                <ProjectDescription>{project.description}</ProjectDescription>
                
                <ProjectStats>
                  {project.stats.map((stat, idx) => (
                    <StatItem key={idx}>
                      {stat.icon}
                      <span>{stat.text}</span>
                    </StatItem>
                  ))}
                </ProjectStats>

                {project.link && (
                  <ProjectLink
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <FaExternalLinkAlt size={12} />
                  </ProjectLink>
                )}
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;