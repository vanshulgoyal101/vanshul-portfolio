// src/components/Work/Work.jsx
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation } from 'framer-motion';
import { FaPlane, FaSolarPanel, FaLaptopCode, FaExternalLinkAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { BiRocket } from 'react-icons/bi';

// Styled Components
const WorkSection = styled.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: var(--color-bg-primary);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
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

const TimelineContainer = styled.div`
  position: relative;
  padding: var(--spacing-lg) 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
    transform: translateX(-50%);
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  width: 50%;
  padding: 0 var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  ${props => props.$align === 'left' ? `
    left: 0;
    text-align: right;
  ` : `
    left: 50%;
    text-align: left;
  `}
  
  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    text-align: left;
    padding-left: 80px;
    padding-right: var(--spacing-md);
  }
`;

const TimelineIcon = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  background: var(--color-bg-secondary);
  border: 3px solid var(--color-accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--color-accent-primary);
  z-index: 2;
  
  ${props => props.$align === 'left' ? `
    right: -30px;
  ` : `
    left: -30px;
  `}
  
  @media (max-width: 768px) {
    left: 0;
    right: auto;
  }
`;

const ExperienceCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-gradient-1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const CompanyInfo = styled.div`
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
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Duration = styled.span`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const Location = styled.span`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
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
  margin-bottom: var(--spacing-md);
`;

const TechTag = styled.span`
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-accent-primary);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--text-xs);
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const CompanyLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    gap: var(--spacing-sm);
    text-decoration: underline;
  }
`;

// Floating Airplane Component
const FloatingAirplane = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  color: var(--color-accent-primary);
  opacity: 0.15;
  z-index: 1;
  pointer-events: none;
`;

const Work = () => {
  const sectionRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const experiences = [
    {
      id: 1,
      align: 'left',
      icon: <FaPlane />,
      title: 'Associate Engineer',
      company: 'United Airlines',
      department: 'Air Operations',
      duration: '2024 - Present',
      location: 'India',
      description: 'Contributing to air operations systems and processes at one of the world\'s leading airlines. Working on optimizing critical aviation systems and improving operational efficiency.',
      tech: ['Aviation Systems', 'Operations', 'Data Analysis'],
      link: null,
    },
    {
      id: 2,
      align: 'right',
      icon: <FaSolarPanel />,
      title: 'Co-Founder',
      company: 'Solaride',
      department: 'Operations & Strategy',
      duration: '2024 - Present',
      location: 'Chandigarh, India',
      description: 'Leading business operations and scaling strategies for an EPC company specializing in solar installations. Managing projects under PM Surya Ghar and PM KUSUM Yojana across Chandigarh Tricity and Haryana.',
      tech: ['Business Strategy', 'Operations', 'Solar Energy', 'Project Management'],
      link: 'https://solaride.in',
    },
    {
      id: 3,
      align: 'left',
      icon: <FaLaptopCode />,
      title: 'Software Development Engineer Intern',
      company: 'zHealth',
      department: 'Engineering',
      duration: '2023 - 2024',
      location: 'San Francisco, US (Remote)',
      description: 'Developed and automated end-to-end sign-up process for healthcare providers. Engineered custom interfaces for 100+ Healthcare Organizations to securely manage Patient Health Records in compliance with healthcare standards.',
      tech: ['Java', 'Spring Boot', 'React', 'Healthcare APIs', 'AWS'],
      link: null,
    },
  ];

  return (
    <WorkSection ref={sectionRef}>
      {/* Floating Airplane Animation */}
      <FloatingAirplane
        animate={{
          x: [-100, window.innerWidth + 100],
          y: [50, 100, 50],
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
          y: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <FaPlane />
      </FloatingAirplane>

      <Container>
        <SectionHeader
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>Work Experience</SectionTitle>
          <SectionSubtitle>
            Building impactful solutions across aviation, renewable energy, and healthcare
          </SectionSubtitle>
        </SectionHeader>

        <TimelineContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {experiences.map((exp, index) => (
              <TimelineItem
                key={exp.id}
                $align={exp.align}
                variants={itemVariants}
              >
                <TimelineIcon
                  $align={exp.align}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {exp.icon}
                </TimelineIcon>

                <ExperienceCard
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <CompanyHeader>
                    <CompanyInfo>
                      <JobTitle>{exp.title}</JobTitle>
                      <CompanyName>
                        {exp.company}
                        {exp.department && ` • ${exp.department}`}
                      </CompanyName>
                      <Duration>
                        <MdWork size={14} />
                        {exp.duration}
                      </Duration>
                      <Location>
                        <FaMapMarkerAlt size={12} />
                        {exp.location}
                      </Location>
                    </CompanyInfo>
                  </CompanyHeader>

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
                      whileHover={{ x: 5 }}
                    >
                      Visit Website
                      <FaExternalLinkAlt size={12} />
                    </CompanyLink>
                  )}
                </ExperienceCard>
              </TimelineItem>
            ))}
          </motion.div>
        </TimelineContainer>
      </Container>
    </WorkSection>
  );
};

export default Work;
