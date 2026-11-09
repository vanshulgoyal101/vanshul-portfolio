import { useMemo } from 'react';
import styled from 'styled-components';
import { FaPen } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';

import BlogCard from './BlogCard';
import ReadingList from './ReadingList';
import SectionHeader from '../ui/SectionHeader';
import { ButtonLink } from '../ui/Button';
import { sortBlogsByDate } from '../../utils/blogUtils';
import { loadBlogPosts } from '../../utils/blogLoader';
import { useBlogViews } from '../../hooks/useBlogViews';
import { BLOG_CONTENT } from '../../constants/blogConstants';
import { itemVariants } from '../../constants/motionVariants';
import { BLOG_PATH } from '../../constants/routes';

const BlogSection = styled.section`
  position: relative;
  padding: clamp(3.5rem, 7vw, 6rem) 0;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArchiveRow = styled.div`
  display: flex;
  justify-content: center;
  margin: clamp(1.75rem, 3vw, 2.25rem) 0 clamp(2.5rem, 5vw, 3.5rem);
`;

const EmptyState = styled.div`
  padding: var(--spacing-2xl) 0;
  text-align: center;

  svg {
    margin: 0 auto 1.5rem;
    font-size: 3rem;
    color: var(--color-accent-primary);
    opacity: 0.3;
  }

  h3 {
    margin-bottom: 1rem;
    font-size: var(--text-2xl);
  }

  p {
    max-width: 400px;
    margin: 0 auto;
  }
`;

const Quote = styled.figure`
  max-width: 44rem;
  margin: clamp(4rem, 8vw, 6rem) auto 0;
  padding-top: 2rem;
  text-align: center;
  border-top: 1px solid var(--color-hairline);

  blockquote {
    font-family: var(--font-display);
    font-size: clamp(1.375rem, 3vw, 1.875rem);
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: -0.02em;
    color: var(--color-ink);
    quotes: '“' '”';
    text-wrap: balance;
  }

  blockquote::before {
    content: open-quote;
  }

  blockquote::after {
    content: close-quote;
  }

  figcaption {
    margin-top: 1.25rem;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  cite {
    font-style: normal;
  }

  cite::before {
    content: '— ';
  }
`;

// Homepage writing preview: the newest posts, a link to the full archive and
// the reading-list banner.
const Blog = () => {
  const sortedBlogPosts = useMemo(() => sortBlogsByDate(loadBlogPosts()), []);
  const featuredPosts = sortedBlogPosts.slice(0, 3);

  // View counts keyed by slug (empty until loaded / when Supabase is unconfigured)
  const views = useBlogViews();

  return (
    <BlogSection>
      <Container>
        <SectionHeader
          index="04"
          eyebrow="Essays"
          title={BLOG_CONTENT.sectionTitle}
          lede={BLOG_CONTENT.sectionSubtitle}
        />

        {sortedBlogPosts.length > 0 ? (
          <>
            <PostGrid>
              {featuredPosts.map((blog, index) => (
                <BlogCard
                  key={blog.slug}
                  blog={blog}
                  index={index}
                  variants={itemVariants}
                  views={views[blog.slug]}
                />
              ))}
            </PostGrid>

            <ArchiveRow>
              {sortedBlogPosts.length > featuredPosts.length && (
                <ButtonLink $variant="secondary" to={BLOG_PATH}>
                  View all {sortedBlogPosts.length} posts
                  <HiArrowRight aria-hidden="true" data-arrow="forward" />
                </ButtonLink>
              )}
            </ArchiveRow>
          </>
        ) : (
          <EmptyState>
            <FaPen aria-hidden="true" />
            <h3>{BLOG_CONTENT.emptyStateTitle}</h3>
            <p>{BLOG_CONTENT.emptyStateMessage}</p>
          </EmptyState>
        )}

        <ReadingList />

        <Quote>
          <blockquote>{BLOG_CONTENT.quote.text}</blockquote>
          <figcaption>
            <cite>{BLOG_CONTENT.quote.author}</cite>
          </figcaption>
        </Quote>
      </Container>
    </BlogSection>
  );
};

export default Blog;
