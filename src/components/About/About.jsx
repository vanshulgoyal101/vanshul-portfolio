// src/components/About/About.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaGraduationCap, FaCode, FaRocket, FaTrophy,
  FaReact, FaServer, FaTools, FaJava,
} from 'react-icons/fa';

// ─── Styled Components ────────────────────────────────────────────────────────

const AboutSection = styled.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);

  @media (max-width: 768px) {
    margin-bottom: var(--spacing-lg);
  }
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
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

const AboutContent = styled.div`
  order: 1;

  @media (max-width: 1024px) {
    order: 2;
  }
`;

const AboutImageContainer = styled.div`
  order: 2;
  position: relative;

  @media (max-width: 1024px) {
    order: 1;
    max-width: 500px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4/5;
  background: var(--color-gradient-1);
  padding: 3px;

  @media (max-width: 768px) {
    aspect-ratio: 1/1;
  }

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

  a {
    color: var(--color-accent-primary);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const HighlightText = styled.span`
  color: var(--color-accent-primary);
  font-weight: 500;
`;

// ─── Stats ────────────────────────────────────────────────────────────────────

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }
`;

const StatCard = styled(motion.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: default;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
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

// ─── Skills ───────────────────────────────────────────────────────────────────

const SkillsContainer = styled.div`
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
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--color-accent-primary);
  }
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

const SkillTag = styled.li`
  background: rgba(99, 102, 241, 0.08);
  color: var(--color-text-primary);
  padding: 5px 14px;
  border-radius: 20px;
  font-size: var(--text-sm);
  border: 1px solid rgba(99, 102, 241, 0.18);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.18);
    border-color: var(--color-accent-primary);
    transform: translateY(-2px);
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const statsData = [
  { icon: <FaGraduationCap />, number: '2025',   label: 'B.Tech — Electronics & Communication Engineering' },
  { icon: <FaTrophy />,        number: 'Sports', label: 'State Level Cricket, Baseball & Softball' },
  { icon: <FaRocket />,        number: 'Top 20', label: 'NASA HERC 2023 Global Ranking' },
  { icon: <FaTrophy />,        number: '98.6%',  label: 'JEE Mains Percentile' },
];

const skills = [
  { category: 'Languages', icon: <FaJava />,    list: ['Java', 'Python', 'JavaScript', 'SQL'] },
  { category: 'Frontend',  icon: <FaReact />,   list: ['React', 'HTML/CSS', 'Framer Motion', 'Styled Components'] },
  { category: 'Backend',   icon: <FaServer />,  list: ['Spring Boot', 'Node.js', 'Express', 'REST APIs'] },
  { category: 'Tools',     icon: <FaTools />,   list: ['Git', 'Docker', 'MySQL', 'Postman', 'Power BI', 'Tableau'] },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

const About = () => {

  // Start false — set true only on successful load; show placeholder on error
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError]   = useState(false);

  return (
    <AboutSection id="about">
      <Container>
        <SectionHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>About Me</SectionTitle>
            <SectionSubtitle>
              Engineer and a passionate learner.
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>

        <AboutGrid>
          {/* Text content */}
          <AboutContent>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <AboutText>
                <h3>Hey There!</h3>
                <p>
                  I'm <HighlightText>Vanshul Goyal</HighlightText>, a recent graduate from Punjab
                  Engineering College with a B.Tech in <HighlightText>Electronics and Communication
                  Engineering</HighlightText> and a minor in Computer Science.
                </p>
                <p>
                  Currently, I work as an <HighlightText>Associate Analyst at{' '}
                  <a href="https://www.united.com" target="_blank" rel="noopener noreferrer">
                    United Airlines
                  </a></HighlightText> in the Airport Operations department.
                </p>
                <p>
                  My journey has been shaped by incredible experiences — from leading a team to{' '}
                  <HighlightText>NASA's Human Exploration Rover Challenge</HighlightText> to being
                  selected among <HighlightText>30 global space leaders</HighlightText> for the
                  NASA Space Apps Collective. Innovation happens at the intersection of technology,
                  teamwork, and purpose.
                </p>
                <p>
                  When I'm not coding or optimizing business operations, you'll find me lost in
                  books or playing cricket in the park.
                </p>
              </AboutText>
            </motion.div>
          </AboutContent>

          {/* Profile image */}
          <AboutImageContainer>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <ImageWrapper>
                {!imageError && (
                  <ProfileImage
                    src="/images/projects/profile2.webp"
                    alt="Vanshul Goyal — Associate Analyst"
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
                  />
                )}
                {(imageError || !imageLoaded) && (
                  <ImagePlaceholder style={{ position: imageLoaded ? 'absolute' : 'relative', opacity: imageLoaded ? 0 : 1 }}>
                    <FaCode />
                  </ImagePlaceholder>
                )}
              </ImageWrapper>
            </motion.div>
          </AboutImageContainer>
        </AboutGrid>

        {/* Stats */}
        <div>
          <StatsGrid>
            {statsData.map((stat, i) => (
              <StatCard
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <StatIcon>{stat.icon}</StatIcon>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </div>

        {/* Skills */}
        <SkillsContainer>
          <SkillsTitle>Technical Skills</SkillsTitle>
          <SkillsGrid>
            {skills.map(({ category, icon, list }, i) => (
              <SkillCategory
                key={category}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <SkillCategoryTitle>
                  {icon}
                  {category}
                </SkillCategoryTitle>
                <SkillsList>
                  {list.map((skill) => (
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