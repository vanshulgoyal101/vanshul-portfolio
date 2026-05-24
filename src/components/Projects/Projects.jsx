// src/components/Projects/Projects.jsx
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { projects } from '../../constants/portfolioData';

// Styled Components
const ProjectsSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
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

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const ProjectCard = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: rgba(245, 158, 11, 0.4);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--color-gradient-2)'};
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid var(--color-border);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(7, 10, 19, 0.15); /* dark screen overlay */
  }
`;

const CardContent = styled.div`
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardRole = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const CardTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
`;

const CardDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  flex: 1;
`;

const CardStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  
  span.label {
    color: var(--color-text-muted);
  }
  
  span.value {
    color: var(--color-text-primary);
    font-weight: 500;
  }
`;

const CardLink = styled.a`
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-accent-secondary);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: var(--color-accent-primary);
    
    svg {
      transform: translate(2px, -2px);
    }
  }
`;

const Projects = () => {
  return (
    <ProjectsSection id="projects">
      <Container>
        <SectionHeader>
          <Title>Featured <span>Pursuits</span></Title>
          <Underline />
        </SectionHeader>
        
        <ProjectGrid>
          {projects.map((proj, index) => (
            <ProjectCard
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CardImage $image={proj.image} />
              <CardContent>
                <CardRole>{proj.role}</CardRole>
                <CardTitle>{proj.title}</CardTitle>
                <CardDescription>{proj.description}</CardDescription>
                
                <CardStats>
                  {proj.stats.map((stat, idx) => (
                    <StatItem key={idx}>
                      <span className="label">{stat.label}</span>
                      <span className="value">{stat.value}</span>
                    </StatItem>
                  ))}
                </CardStats>
                
                {proj.link && (
                  <CardLink href={proj.link} target="_blank" rel="noopener noreferrer">
                    Explore Project <FaExternalLinkAlt size={10} />
                  </CardLink>
                )}
              </CardContent>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;