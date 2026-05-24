// src/components/About/About.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaQuoteLeft, FaBookOpen } from 'react-icons/fa';
import { bioData, wisdomQuotes } from '../../constants/portfolioData';

// Styled Components
const AboutSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  text-align: left;
`;

const Title = styled.h2`
  font-size: var(--text-4xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
  
  span {
    color: var(--color-accent-primary);
  }
`;

const Underline = styled.div`
  width: 60px;
  height: 2px;
  background: var(--color-accent-primary);
  margin-top: var(--spacing-xs);
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--spacing-xl);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const BioColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const BioParagraph = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
  
  strong {
    color: var(--color-text-primary);
    font-weight: 500;
  }
`;

const HighlightText = styled.span`
  color: var(--color-accent-primary);
  font-weight: 500;
`;

const SkillsSection = styled.div`
  margin-top: var(--spacing-lg);
`;

const SkillsSubTitle = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SkillGroup = styled.div`
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: 8px;
`;

const SkillGroupTitle = styled.h4`
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-accent-secondary);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
`;

const SkillTag = styled.span`
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: var(--text-xs);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  transition: var(--transition-base);
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: rgba(245, 158, 11, 0.3);
    background: rgba(245, 158, 11, 0.02);
  }
`;

// Wisdom Card widget styled with a sophisticated book/stone feel
const WisdomColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 100px;
`;

const WisdomCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 440px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: rgba(245, 158, 11, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  
  span {
    font-family: var(--font-display);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
  }
  
  svg {
    color: var(--color-accent-primary);
  }
`;

const QuoteBody = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const QuoteText = styled(motion.p)`
  font-family: var(--font-serif);
  font-size: var(--text-base);
  font-style: italic;
  line-height: 1.8;
  color: var(--color-text-primary);
  text-align: left;
  
  svg {
    display: inline;
    margin-right: var(--spacing-xs);
    opacity: 0.25;
    color: var(--color-accent-primary);
  }
`;

const QuoteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-sm);
`;

const QuoteAuthor = styled.span`
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-accent-primary);
`;

const ClickPrompt = styled.span`
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const StatCard = styled.div`
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: var(--spacing-md);
  text-align: left;
`;

const StatNumber = styled.div`
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
`;

const About = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const rotateQuote = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % wisdomQuotes.length);
      setIsAnimating(false);
    }, 250);
  };

  const activeQuote = wisdomQuotes[quoteIndex];

  return (
    <AboutSection id="about">
      <Container>
        <SectionHeader>
          <Title>About <span>Me</span></Title>
          <Underline />
        </SectionHeader>
        
        <LayoutGrid>
          <BioColumn>
            <BioParagraph>
              Hey there! I'm <strong>{bioData.name}</strong>, an engineer and entrepreneur. I recently graduated from <HighlightText>Punjab Engineering College</HighlightText> with a degree in Electronics & Communication and a minor in Computer Science.
            </BioParagraph>
            <BioParagraph>
              Currently, I'm an Associate Analyst at <HighlightText>United Airlines</HighlightText> in Gurgaon, where I work with operations databases. Alongside my corporate role, I co-founded <a href="https://solaride.in" target="_blank" rel="noopener noreferrer"><HighlightText>Solaride</HighlightText></a>, a solar EPC startup designed to speed up clean energy adoption under PM Surya Ghar and PM KUSUM initiatives in India.
            </BioParagraph>
            <BioParagraph>
              My path has always hovered around curiosity. From heading PEC's human exploration rover project for <HighlightText>NASA HERC</HighlightText> to representing my region at state-level sports tournaments, I've realized that the best problems to solve lie at the intersection of logistics, software, and real physical structures.
            </BioParagraph>
            
            <StatsGrid>
              {bioData.achievements.map((ach, idx) => (
                <StatCard key={idx}>
                  <StatNumber>{ach.number}</StatNumber>
                  <StatLabel>{ach.label}</StatLabel>
                </StatCard>
              ))}
            </StatsGrid>

            <SkillsSection>
              <SkillsSubTitle>Skills Index</SkillsSubTitle>
              <SkillsGrid>
                {Object.entries(bioData.skills).map(([category, skillList]) => (
                  <SkillGroup key={category}>
                    <SkillGroupTitle>{category}</SkillGroupTitle>
                    <SkillList>
                      {skillList.map((skill) => (
                        <SkillTag key={skill}>{skill}</SkillTag>
                      ))}
                    </SkillList>
                  </SkillGroup>
                ))}
              </SkillsGrid>
            </SkillsSection>
          </BioColumn>
          
          <WisdomColumn>
            <WisdomCard
              onClick={rotateQuote}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              animate={{ rotateY: isAnimating ? 90 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <CardHeader>
                <span>Wisdom Library // {activeQuote.category}</span>
                <FaBookOpen size={14} />
              </CardHeader>
              
              <QuoteBody>
                <AnimatePresence mode="wait">
                  <QuoteText
                    key={quoteIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaQuoteLeft size={16} /> {activeQuote.quote}
                  </QuoteText>
                </AnimatePresence>
              </QuoteBody>
              
              <QuoteFooter>
                <QuoteAuthor>{activeQuote.author}</QuoteAuthor>
                <ClickPrompt>FLIP CARD</ClickPrompt>
              </QuoteFooter>
            </WisdomCard>
          </WisdomColumn>
        </LayoutGrid>
      </Container>
    </AboutSection>
  );
};

export default About;