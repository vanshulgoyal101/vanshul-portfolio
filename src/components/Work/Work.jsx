// src/components/Work/Work.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlane, FaSolarPanel, FaLaptopCode, FaExternalLinkAlt } from 'react-icons/fa';
import { experiences } from '../../constants/portfolioData';

// Styled Components
const WorkSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-primary);
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

const WorkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 900px;
  margin-top: var(--spacing-lg);
`;

const WorkRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 80px 1.2fr 2fr;
  gap: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-lg);
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    padding-bottom: var(--spacing-md);
  }
`;

const IconColumn = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Role = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
`;

const CompanyName = styled.h4`
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-accent-secondary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  a {
    color: var(--color-accent-secondary);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--text-xs);
    
    &:hover {
      color: var(--color-accent-primary);
    }
  }
`;

const DateRange = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
`;

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Description = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.75;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const TechTag = styled.span`
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
`;

const Work = () => {
  const getIcon = (id) => {
    switch (id) {
      case 'work-united':
        return <FaPlane />;
      case 'work-solaride':
        return <FaSolarPanel />;
      case 'work-zhealth':
        return <FaLaptopCode />;
      default:
        return <FaLaptopCode />;
    }
  };

  return (
    <WorkSection id="work">
      <Container>
        <SectionHeader>
          <Title>Professional <span>Footprint</span></Title>
          <Underline />
        </SectionHeader>
        
        <WorkList>
          {experiences.map((exp, index) => (
            <WorkRow
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <IconColumn>
                {getIcon(exp.id)}
              </IconColumn>
              
              <TitleColumn>
                <Role>{exp.role}</Role>
                <CompanyName>
                  {exp.company}
                  {exp.link && (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${exp.company} Website`}>
                      <FaExternalLinkAlt size={10} />
                    </a>
                  )}
                </CompanyName>
                <DateRange>{exp.duration} // {exp.location}</DateRange>
              </TitleColumn>
              
              <DetailsColumn>
                <Description>{exp.description}</Description>
                <TechStack>
                  {exp.tech.map((tag) => (
                    <TechTag key={tag}>{tag}</TechTag>
                  ))}
                </TechStack>
              </DetailsColumn>
            </WorkRow>
          ))}
        </WorkList>
      </Container>
    </WorkSection>
  );
};

export default Work;