import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Navigation from '../components/Navigation/Navigation';
import BackgroundElements from '../components/BackgroundElements';
import BlogCard from '../components/Blog/BlogCard';
import { loadBlogPosts } from '../utils/blogLoader';
import { sortBlogsByDate } from '../utils/blogUtils';
import { useBlogViews } from '../hooks/useBlogViews';
import { useSeo } from '../hooks/useSeo';
import { itemVariants } from '../constants/motionVariants';
import { SITE_URL, AUTHOR_NAME } from '../constants/siteConfig';

const DESCRIPTION =
  'Essays on AI, robotics, the future of work, and technology by Vanshul Goyal — engineer at United Airlines.';

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

const isoOrUndef = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

const BlogIndex = () => {
  const navigate = useNavigate();
  const posts = useMemo(() => sortBlogsByDate(loadBlogPosts()), []);
  const views = useBlogViews();

  const jsonLd = useMemo(
    () =>
      JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${AUTHOR_NAME} — Blog`,
          url: `${SITE_URL}/blog`,
          description: DESCRIPTION,
          inLanguage: 'en',
          author: { '@type': 'Person', name: AUTHOR_NAME, url: SITE_URL },
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            ...(isoOrUndef(p.date) ? { datePublished: isoOrUndef(p.date) } : {}),
            ...(p.category ? { articleSection: p.category } : {}),
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          ],
        },
      ]),
    [posts]
  );

  useSeo({
    title: `Blog — ${AUTHOR_NAME}`,
    description: DESCRIPTION,
    path: '/blog',
    jsonLd,
  });

  const scrollToSection = (sectionId) => navigate(`/#${sectionId}`);

  return (
    <PageWrapper>
      <BackgroundElements />
      <Navigation scrollToSection={scrollToSection} />
      <ContentWrapper>
        <Container>
          <Header>
            <h1>Writing</h1>
            <p>{DESCRIPTION}</p>
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
