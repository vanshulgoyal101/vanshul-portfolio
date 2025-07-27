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
  
  @media (max-width: 768px) {
    padding: var(--spacing-lg) 0;
  }
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-md);
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  padding-top: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
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

// Simple Grid Layout (No GSAP)
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`;

const ProjectCard = styled.div`
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
  
  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--color-gradient-1)'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  @media (max-width: 768px) {
    height: 150px;
  }
`;

const ProjectContent = styled.div`
  padding: var(--spacing-lg);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const ProjectTitle = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  
  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
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

  &:hover {
    text-decoration: underline;
  }
`;

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const projects = [
    {
      id: 1,
      title: 'NASA Human Exploration Rover Challenge',
      role: 'Team Lead',
      description: 'Led a team of 6 people to design and manufacture a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking.',
      image: '/images/projects/nasa-herc.jpg',
      stats: [
        { icon: <MdGroups />, text: 'Reached out to 12k+ Students for STEM engagement activites' },
        { icon: <BiMoney />, text: 'Raised $30,000 Funding via government and private sources' },
      ],
      link: 'https://www.nasa.gov/learning-resources/nasa-human-exploration-rover-challenge/'
    },
    {
      id: 2,
      title: 'NASA Space Apps Collective',
      role: 'Global Community Member',
      description: 'Selected among 30 global space leaders. Developed weather visualization tools for Zimbabwean farmers using NASA data.',
      image: '/images/projects/spaceapps.png',
      stats: [
        { icon: <MdGroups />, text: 'Worked with a diverse global team' },
        { icon: <FaRocket />, text: "Used NASA's open-source Data" },
      ],
      link: 'https://www.spaceappschallenge.org/collective/'
    },
    // {
    //   id: 3,
    //   title: 'Astronomy & Space Physics Society',
    //   role: 'Core Team Member',
    //   description: 'Organized telescope workshops and educational events to promote space sciences among students.',
    //   image: '/images/projects/college.jpg',
    //   stats: [
    //     { icon: <MdGroups />, text: '500+ Students' },
    //     { icon: <FaStar />, text: 'Multiple Events' },
    //   ],
    //   link: '#'
    // },
    {
      id: 3,
      title: 'Solaride',
      role: 'Co-Founder',
      description: 'Powering a Greener Future with Solar Energy. Installing solar power plants on houses, malls, factories, farmland, etc .',
      image: '/images/projects/Solaride.png',
      stats: [
        { icon: <MdGroups />, text: 'EPC company' },
        { icon: <FaRocket />, text: 'Govt. Registered vendor' },
      ],
      link: 'https://solaride.in'
    }
  ];

  return (
    <ProjectsSection ref={sectionRef} id="projects">
      <Container>

        {/* <SectionHeader>
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            From space sector to sustainable energy - projects that define my journey
          </SectionSubtitle>
        </SectionHeader> */}

        <SectionHeader
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <SectionTitle>Featured Projects</SectionTitle>
            <SectionSubtitle>
              From space sector to sustainable energy - projects that define my journey
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id}>
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

                {project.link && project.link !== '#' && (
                  <ProjectLink
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                    <FaExternalLinkAlt size={20} />
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