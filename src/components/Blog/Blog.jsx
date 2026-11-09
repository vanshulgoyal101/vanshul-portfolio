import { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPen, FaQuoteLeft } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';

import BlogCard from './BlogCard';
import ReadingList from './ReadingList';
import { sortBlogsByDate } from '../../utils/blogUtils';
import { loadBlogPosts } from '../../utils/blogLoader';
import { useBlogViews } from '../../hooks/useBlogViews';
import { BLOG_CONTENT } from '../../constants/blogConstants';
import { containerVariants, itemVariants } from '../../constants/motionVariants';
import { BLOG_PATH } from '../../constants/routes';

// Styled Components
const BlogSection = styled.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: transparent;
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
  font-size: var(--text-section-title);
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
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const ArchiveLink = styled(Link)`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.5rem;
  margin: var(--spacing-lg) auto 0;
  padding: 0.75rem 1rem;
  color: var(--color-accent-primary);
  font-weight: 600;
  border-radius: 8px;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 3px;
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
  max-width: 700px;
  margin: var(--spacing-2xl) auto;
  text-align: center;
  position: relative;
  padding: var(--spacing-xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
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

// Homepage writing preview: the shelf card, the newest posts and a link to the
// full archive.
const Blog = () => {
  const sortedBlogPosts = useMemo(() => sortBlogsByDate(loadBlogPosts()), []);
  const featuredPosts = sortedBlogPosts.slice(0, 3);

  // View counts keyed by slug (empty until loaded / when Supabase is unconfigured)
  const views = useBlogViews();

  return (
    <BlogSection>
      <Container>
        <SectionHeader
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            <SectionTitle>{BLOG_CONTENT.sectionTitle}</SectionTitle>
            <SectionSubtitle>{BLOG_CONTENT.sectionSubtitle}</SectionSubtitle>
          </motion.div>
        </SectionHeader>

        {sortedBlogPosts.length > 0 ? (
          <BlogGrid>
            <ReadingList variants={itemVariants} />
            {featuredPosts.map((blog, index) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                index={index}
                variants={itemVariants}
                views={views[blog.slug]}
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

        {sortedBlogPosts.length > featuredPosts.length && (
          <ArchiveLink to={BLOG_PATH}>
            View all {sortedBlogPosts.length} posts
            <MdArrowForward aria-hidden="true" />
          </ArchiveLink>
        )}

        <QuoteSection
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
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
