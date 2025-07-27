// src/components/Blog/Blog.jsx
import { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaPen, FaBook, FaQuoteLeft, FaFeatherAlt } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdArrowForward } from 'react-icons/md';

// Styled Components
const BlogSection = styled.section`
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

const BlogContent = styled.div`
  display: grid;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
`;

const ComingSoonCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-2xl);
  text-align: center;
  position: relative;
  overflow: hidden;
  
    @media (max-width: 768px) {
        padding: var(--spacing-lg);
        border-radius: 12px;
    }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--color-gradient-1);
  }
`;

const ComingSoonIcon = styled.div`
  font-size: 4rem;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ComingSoonTitle = styled.h3`
  font-size: var(--text-3xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const ComingSoonText = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto var(--spacing-lg);
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }
`;

const TopicCard = styled(motion.div)`
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: var(--color-accent-primary);
    transform: translateY(-5px);
  }
`;

const TopicIcon = styled.div`
  font-size: 2rem;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-sm);
`;

const TopicTitle = styled.h4`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
`;

const TopicDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`;

const QuoteSection = styled(motion.div)`
  max-width: 800px;
  margin: var(--spacing-2xl) auto;
  text-align: center;
  position: relative;
`;

const QuoteIcon = styled.div`
  font-size: 3rem;
  color: var(--color-accent-primary);
  opacity: 0.2;
  margin-bottom: var(--spacing-md);
`;

const Quote = styled.blockquote`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`;

const QuoteAuthor = styled.cite`
  font-size: var(--text-base);
  color: var(--color-accent-primary);
  font-style: normal;
  
  &::before {
    content: '— ';
  }
`;

const NotifySection = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-card);
  border-radius: 20px;
  border: 1px solid var(--color-border);
    
  @media (max-width: 768px) {
    padding: var(--spacing-lg);
    border-radius: 12px;
  }
`;

const NotifyTitle = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const NotifyText = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
`;

const EmailForm = styled.form`
  display: flex;
  gap: var(--spacing-sm);
  max-width: 400px;
  margin: 0 auto;
  
  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }

`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 25px;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 24px;
  background: var(--color-gradient-1);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  }
`;

// Floating Feather Component
const FloatingFeather = styled(motion.div)`
  position: absolute;
  font-size: 2.5rem;
  color: var(--color-accent-primary);
  opacity: 0.1;
  z-index: 1;
  pointer-events: none;
  top: 10%;
  right: 10%;
`;

const Blog = () => {
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

  const topics = [
    {
      icon: <FaPen />,
      title: 'Life Insights',
      description: 'Random thoughts and observations about life',
    },
    {
      icon: <FaBook />,
      title: 'Book Notes',
      description: 'Key takeaways from Naval & Yuval',
    },
    {
      icon: <BiTime />,
      title: 'Tech & Future',
      description: 'Thoughts on technology and innovation',
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle email subscription
    console.log('Email subscription submitted');
  };

  return (
    <BlogSection ref={sectionRef}>
      {/* Floating Feather */}
      <FloatingFeather
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <FaFeatherAlt />
      </FloatingFeather>

      <Container>
        <SectionHeader
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <SectionTitle>Writings</SectionTitle>
            <SectionSubtitle>
              A collection of thoughts, insights, and learnings from my journey
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>

        <BlogContent>
          <ComingSoonCard
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={{ scale: 1.02 }}
          >
            <ComingSoonIcon>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaPen />
              </motion.div>
            </ComingSoonIcon>
            <ComingSoonTitle>Coming Soon</ComingSoonTitle>
            <ComingSoonText>
              I'm currently crafting my thoughts into words. Soon, this space will be filled 
              with insights on technology, entrepreneurship, life lessons, and everything in between. 
              Stay tuned for stories from my journey - from NASA challenges to building sustainable futures.
            </ComingSoonText>
          </ComingSoonCard>

          <TopicsGrid>
            {topics.map((topic, index) => (
              <TopicCard
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <TopicIcon>{topic.icon}</TopicIcon>
                <TopicTitle>{topic.title}</TopicTitle>
                <TopicDescription>{topic.description}</TopicDescription>
              </TopicCard>
            ))}
          </TopicsGrid>

          <QuoteSection
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <QuoteIcon>
              <FaQuoteLeft />
            </QuoteIcon>
            <Quote>
              "Specific knowledge is found by pursuing your genuine curiosity and passion 
              rather than whatever is hot right now."
            </Quote>
            <QuoteAuthor>Naval Ravikant</QuoteAuthor>
          </QuoteSection>

          <NotifySection
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <NotifyTitle>Get Notified</NotifyTitle>
            <NotifyText>
              Be the first to know when I publish new articles
            </NotifyText>
            <EmailForm onSubmit={handleSubscribe}>
              <EmailInput 
                type="email" 
                placeholder="Enter your email" 
                required 
              />
              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Notify Me
                <MdArrowForward />
              </SubmitButton>
            </EmailForm>
          </NotifySection>
        </BlogContent>
      </Container>
    </BlogSection>
  );
};

export default Blog;