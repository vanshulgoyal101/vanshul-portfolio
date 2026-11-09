import { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Navigation from '../components/Navigation/Navigation';
import BlogCard from '../components/Blog/BlogCard';
import { loadBlogPosts } from '../utils/blogLoader';
import { sortBlogsByDate } from '../utils/blogUtils';
import { useBlogViews } from '../hooks/useBlogViews';
import { useSeo } from '../hooks/useSeo';
import { itemVariants } from '../constants/motionVariants';
import { SITE_URL, AUTHOR_NAME } from '../constants/siteConfig';
import { BLOG_PATH } from '../constants/routes';
import { BLOG_INDEX_DESCRIPTION } from '../constants/blogConstants';
import { blogIndexJsonLd } from '../../scripts/lib/structuredData.mjs';

const PageWrapper = styled.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;

  @media (max-width: 768px) {
    padding-top: 90px;
  }
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding) var(--spacing-2xl);
`;

const Header = styled.header`
  margin-bottom: var(--spacing-xl);

  h1 {
    font-size: var(--text-4xl);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);

    @media (max-width: 768px) {
      font-size: var(--text-3xl);
    }
  }

  p {
    color: var(--color-text-secondary);
    font-size: var(--text-lg);
    max-width: 640px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const TITLE = `Blog — ${AUTHOR_NAME}`;

const BlogIndex = () => {
  const posts = useMemo(() => sortBlogsByDate(loadBlogPosts()), []);
  const views = useBlogViews();

  const jsonLd = useMemo(
    () => JSON.stringify(blogIndexJsonLd(posts, {
      site: SITE_URL,
      authorName: AUTHOR_NAME,
      title: TITLE,
      description: BLOG_INDEX_DESCRIPTION,
    })),
    [posts]
  );

  useSeo({ title: TITLE, description: BLOG_INDEX_DESCRIPTION, path: BLOG_PATH, jsonLd });

  return (
    <PageWrapper>
      <Navigation />
      <ContentWrapper>
        <Container>
          <Header>
            <h1>Writings</h1>
            <p>{BLOG_INDEX_DESCRIPTION}</p>
          </Header>
          <Grid as={motion.div} initial="hidden" animate="visible">
            {posts.map((post, i) => (
              <BlogCard
                key={post.slug}
                blog={post}
                index={i}
                variants={itemVariants}
                views={views[post.slug]}
              />
            ))}
          </Grid>
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default BlogIndex;
