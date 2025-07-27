// src/components/About/About.jsx
import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation } from 'framer-motion';
import { FaGraduationCap, FaCode, FaRocket, FaTrophy } from 'react-icons/fa';
import { BiAtom } from 'react-icons/bi';
import { GiPanda } from 'react-icons/gi';

// Styled Components
const AboutSection = styled.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: var(--color-bg-secondary);
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

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: center;
  margin-bottom: var(--spacing-2xl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
      @media (max-width: 768px) {
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

`;

const AboutContent = styled(motion.div)`
  order: 1;

  @media (max-width: 1024px) {
    order: 2;
  }
`;

const AboutImageContainer = styled(motion.div)`
  order: 2;
  position: relative;
  
  @media (max-width: 1024px) {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4/5;
  background: var(--color-gradient-1);
  padding: 3px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-gradient-1);
    opacity: 0.5;
    filter: blur(20px);
    transform: scale(1.1);
    z-index: -1;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 17px;
  display: block;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-bg-card);
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-6xl);
  color: var(--color-accent-primary);
`;

const AboutText = styled.div`
  h3 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }

  p {
    font-size: var(--text-base);
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }
`;

const HighlightText = styled.span`
  color: var(--color-accent-primary);
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
`;

const StatCard = styled(motion.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-gradient-1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const StatIcon = styled.div`
  font-size: var(--text-3xl);
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-sm);
`;

const StatNumber = styled.h4`
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
`;

const StatLabel = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`;

const SkillsContainer = styled(motion.div)`
  margin-top: var(--spacing-2xl);
`;

const SkillsTitle = styled.h3`
  font-size: var(--text-2xl);
  text-align: center;
  margin-bottom: var(--spacing-lg);
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

`;

const SkillCategory = styled(motion.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
`;

const SkillCategoryTitle = styled.h4`
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-accent-primary);
`;

const SkillsList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const SkillTag = styled(motion.li)`
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-text-primary);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: var(--text-sm);
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
    transform: translateY(-2px);
  }
`;

// Floating Panda Component
const FloatingPanda = styled(motion.div)`
  position: absolute;
  font-size: 3rem;
  color: var(--color-accent-primary);
  opacity: 0.1;
  z-index: 1;
  pointer-events: none;
`;

const About = () => {
  const sectionRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const statsData = [
    { icon: <FaGraduationCap />, number: '2024', label: 'B.Tech Graduate' },
    { icon: <FaRocket />, number: 'Top 20', label: 'NASA HERC Global' },
    { icon: <FaTrophy />, number: '98.6%', label: 'JEE Mains' },
    { icon: <BiAtom />, number: '30', label: 'Global Space Leaders' },
  ];

  const skills = {
    'Languages': ['Java', 'Python', 'JavaScript', 'SQL'],
    'Frontend': ['React', 'HTML/CSS', 'Framer Motion'],
    'Backend': ['Spring Boot', 'Node.js', 'Express'],
    'Tools': ['Git', 'Docker', 'AWS', 'MongoDB']
  };

  return (
    <AboutSection ref={sectionRef}>
      {/* Floating Panda Easter Egg */}
      <FloatingPanda
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ top: '10%', right: '5%' }}
      >
        <GiPanda />
      </FloatingPanda>

      <Container>
        <SectionHeader
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          <SectionTitle>About Me</SectionTitle>
          <SectionSubtitle>
            Engineer, entrepreneur, and lifelong learner passionate about 
            technology and sustainable innovation
          </SectionSubtitle>
        </SectionHeader>

        <AboutGrid>
          <AboutContent
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <AboutText>
              <motion.h3 variants={itemVariants}>
                Building the Future, One Innovation at a Time
              </motion.h3>
              <motion.p variants={itemVariants}>
                I'm <HighlightText>Vanshul Goyal</HighlightText>, a recent graduate from 
                Punjab Engineering College with a B.Tech in <HighlightText>Electronics and 
                Communication Engineering</HighlightText> and a minor in Computer Science.
              </motion.p>
              <motion.p variants={itemVariants}>
                Currently, I work as an <HighlightText>Associate Engineer at United Airlines</HighlightText> in 
                the Air Operations department, while co-founding <HighlightText>Solaride</HighlightText>, 
                an EPC company accelerating India's transition to sustainable energy.
              </motion.p>
              <motion.p variants={itemVariants}>
                My journey has been shaped by incredible experiences - from leading a team 
                to <HighlightText>NASA's Human Exploration Rover Challenge</HighlightText> to being selected 
                among <HighlightText>30 global space leaders</HighlightText> for NASA Space Apps. 
                These experiences taught me that innovation happens at the intersection of 
                technology, teamwork, and purpose.
              </motion.p>
              <motion.p variants={itemVariants}>
                When I'm not coding or optimizing business operations, you'll find me 
                lost in books by Naval Ravikant or Yuval Noah Harari, or penning down 
                insights about life and technology.
              </motion.p>
            </AboutText>
          </AboutContent>

          <AboutImageContainer
            variants={itemVariants}
            initial="hidden"
            animate={controls}
          >
            <ImageWrapper>
              {imageLoaded ? (
                <ProfileImage 
                  src="/images/profile.jpg" 
                  alt="Vanshul Goyal"
                  onError={() => setImageLoaded(false)}
                />
              ) : (
                <ImagePlaceholder>
                  <FaCode />
                </ImagePlaceholder>
              )}
            </ImageWrapper>
          </AboutImageContainer>
        </AboutGrid>

        {/* Stats Grid */}
        <StatsGrid>
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              whileHover={{ y: -5 }}
            >
              <StatIcon>{stat.icon}</StatIcon>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Skills Section */}
        <SkillsContainer
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <SkillsTitle>Technical Skills</SkillsTitle>
          <SkillsGrid>
            {Object.entries(skills).map(([category, skillList], index) => (
              <SkillCategory
                key={category}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <SkillCategoryTitle>
                  <FaCode />
                  {category}
                </SkillCategoryTitle>
                <SkillsList>
                  {skillList.map((skill, skillIndex) => (
                    <SkillTag
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + skillIndex * 0.05,
                        duration: 0.3 
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </SkillTag>
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