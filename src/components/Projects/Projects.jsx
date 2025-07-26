// src/components/Projects/Projects.jsx
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaRocket, FaGlobeAfrica, FaTelescope, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Styled Components
const ProjectsSection = styled.section`
  position: relative;
  background: var(--color-bg-secondary);
  overflow: hidden;
  padding: var(--spacing-2xl) 0;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
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

const HorizontalScrollWrapper = styled.div`
  overflow: hidden;
  position: relative;
`;

const ProjectsTimeline = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl) 0;
  will-change: transform;
`;

const ProjectCard = styled(motion.div)`
  flex: 0 0 auto;
  width: min(400px, 80vw);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: var(--color-accent-primary);
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  }
`;

const ProjectImage = styled.div`
  height: 250px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--color-gradient-1)'};
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.8) 100%);
  }
`;

const ProjectIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(99, 102, 241, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  z-index: 2;
`;

const ProjectContent = styled.div`
  padding: var(--spacing-lg);
`;

const ProjectTitle = styled.h3`
  font-size: var(--text-2xl);
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  
  svg {
    color: var(--color-accent-primary);
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const ProjectLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-accent-primary);
  border-radius: 20px;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
    transform: translateY(-2px);
  }
`;

const ScrollIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ArrowIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  font-size: var(--text-xl);
`;

// Floating Rocket Component
const FloatingRocketIcon = styled(motion.div)`
  position: absolute;
  font-size: 4rem;
  color: var(--color-accent-primary);
  opacity: 0.1;
  z-index: 1;
  pointer-events: none;
  top: 20%;
  left: 5%;
`;

const Projects = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const trigger = triggerRef.current;

    if (!timeline || !trigger) return;

    // Calculate the scroll distance
    const getScrollDistance = () => {
      const timelineWidth = timeline.scrollWidth;
      const windowWidth = window.innerWidth;
      return -(timelineWidth - windowWidth);
    };

    // Create GSAP timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollDistance()) * 1.5}`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Horizontal scroll animation
    tl.to(timeline, {
      x: getScrollDistance,
      ease: 'none',
    });

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: 'NASA Human Exploration Rover Challenge',
      role: 'Team Lead',
      description: 'Led the design and construction of a human-powered rover for NASA HERC 2023. Achieved top 20 global ranking among international teams.',
      image: '/images/projects/nasa-herc.jpg',
      icon: <FaRocket />,
      stats: [
        { icon: <MdGroups />, text: '12,000+ Students Engaged' },
        { icon: <BiMoney />, text: '$30,000 Sponsorship' },
      ],
      links: [
        { text: 'View Project', url: '#', icon: <FaExternalLinkAlt /> }
      ]
    },
    {
      id: 2,
      title: 'NASA Space Apps Challenge',
      role: 'Global Space Leader',
      description: 'Selected among 30 global space leaders for the pilot program. Developed weather visualization tools for Zimbabwean farmers using NASA open data.',
      image: '/images/projects/space-apps.jpg',
      icon: <FaGlobeAfrica />,
      stats: [
        { icon: <MdGroups />, text: 'Global Collaboration' },
        { icon: <FaRocket />, text: 'NASA Open Data' },
      ],
      links: [
        { text: 'View Solution', url: '#', icon: <FaExternalLinkAlt /> }
      ]
    },
    {
      id: 3,
      title: 'Astronomy & Space Physics Society',
      role: 'Core Team Member',
      description: 'Organized telescope workshops, stargazing sessions, and educational events to promote space sciences among students.',
      image: '/images/projects/college.jpg',
      icon: <FaTelescope />,
      stats: [
        { icon: <MdGroups />, text: '500+ Participants' },
        { icon: <FaRocket />, text: 'Multiple Events' },
      ],
      links: [
        { text: 'Learn More', url: '#', icon: <FaExternalLinkAlt /> }
      ]
    },
    {
      id: 4,
      title: 'Solaride',
      role: 'Co-Founder',
      description: 'Building sustainable energy solutions across Chandigarh and Haryana. Installing solar plants under government schemes.',
      image: '/images/projects/solaride.jpg',
      icon: <FaRocket />,
      stats: [
        { icon: <MdGroups />, text: 'Multiple Installations' },
        { icon: <FaRocket />, text: 'Government Registered' },
      ],
      links: [
        { text: 'Visit Website', url: 'https://solaride.in', icon: <FaExternalLinkAlt /> }
      ]
    }
  ];

  return (
    <ProjectsSection ref={sectionRef}>
      {/* Floating Rocket */}
      <FloatingRocketIcon
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <FaRocket />
      </FloatingRocketIcon>

      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionSubtitle>
            From space exploration to sustainable energy - projects that define my journey
          </SectionSubtitle>
        </SectionHeader>
      </Container>

      <HorizontalScrollWrapper ref={triggerRef}>
        <ProjectsTimeline ref={timelineRef}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectImage $image={project.image}>
                <ProjectIcon>{project.icon}</ProjectIcon>
              </ProjectImage>
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

                <ProjectLinks>
                  {project.links.map((link, idx) => (
                    <ProjectLink
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.text}
                      {link.icon}
                    </ProjectLink>
                  ))}
                </ProjectLinks>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsTimeline>
      </HorizontalScrollWrapper>

      <ScrollIndicator
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowIcon
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ←
        </ArrowIcon>
        <span>Scroll horizontally to explore projects</span>
        <ArrowIcon
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          →
        </ArrowIcon>
      </ScrollIndicator>
    </ProjectsSection>
  );
};

export default Projects;