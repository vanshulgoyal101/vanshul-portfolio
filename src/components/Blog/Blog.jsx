import { useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaPen, FaQuoteLeft } from 'react-icons/fa';

// Component imports
import BlogCard from './BlogCard';

// Utility imports
import { sortBlogsByDate } from '../../utils/blogUtils';
import { loadBlogPosts } from '../../utils/blogLoader';
import { BLOG_ANIMATION_VARIANTS, BLOG_CONTENT } from '../../constants/blogConstants';

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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  
  svg {
    font-size: 4rem;
    color: var(--color-accent-primary);
    opacity: 0.3;
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    max-width: 400px;
    margin: 0 auto;
  }
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

/**
 * Blog Component
 * Main blog section displaying blog posts with modal functionality
 */
const Blog = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Load blog posts from markdown files (now synchronous)
  const blogPosts = useMemo(() => {
    try {
      return loadBlogPosts();
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }, []);

  // Sort blog posts by date (newest first)
  const sortedBlogPosts = useMemo(() => sortBlogsByDate(blogPosts), [blogPosts]);

  return (
    <BlogSection ref={sectionRef} id="blog">
      <Container>
        <SectionHeader
          variants={BLOG_ANIMATION_VARIANTS.container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={BLOG_ANIMATION_VARIANTS.item}>
            <SectionTitle>{BLOG_CONTENT.sectionTitle}</SectionTitle>
            <SectionSubtitle>{BLOG_CONTENT.sectionSubtitle}</SectionSubtitle>
          </motion.div>
        </SectionHeader>

        {sortedBlogPosts && sortedBlogPosts.length > 0 ? (
          <BlogGrid>
            {sortedBlogPosts.map((blog, index) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                index={index}
                isInView={isInView}
                variants={BLOG_ANIMATION_VARIANTS.item}
              />
            ))}
          </BlogGrid>
        ) : (
          <EmptyState>
            <FaPen />
            <h3>{BLOG_CONTENT.emptyStateTitle}</h3>
            <p>{BLOG_CONTENT.emptyStateMessage}</p>
          </EmptyState>
        )}

        <QuoteSection
          variants={BLOG_ANIMATION_VARIANTS.item}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <QuoteIcon>
            <FaQuoteLeft />
          </QuoteIcon>
          <Quote>{BLOG_CONTENT.quote.text}</Quote>
          <QuoteAuthor>{BLOG_CONTENT.quote.author}</QuoteAuthor>
        </QuoteSection>
      </Container>
    </BlogSection>
  );
};

export default Blog;
