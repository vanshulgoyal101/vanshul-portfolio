import { useMemo } from 'react';
import styled from 'styled-components';
import { HiArrowRight, HiOutlineRss } from 'react-icons/hi';

import PageLayout from '../components/ui/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { TextLink } from '../components/ui/Button';
import PostList from '../components/Blog/PostList';
import { loadBlogPosts } from '../utils/blogLoader';
import { sortBlogsByDate, groupPostsByYear } from '../utils/blogUtils';
import { useBlogViews } from '../hooks/useBlogViews';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, AUTHOR_NAME } from '../constants/siteConfig';
import { BLOG_PATH, READING_LIST_PATH } from '../constants/routes';
import { BLOG_INDEX_DESCRIPTION } from '../constants/blogConstants';
import { blogIndexJsonLd } from '../../scripts/lib/structuredData.mjs';

const FEED_PATH = '/feed.xml';

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  margin-top: 1.25rem;
`;

const Year = styled.section`
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: 0 1.5rem;
  border-top: 1px solid var(--color-ink);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const YearHeading = styled.h2`
  align-self: start;
  position: sticky;
  top: 6.5rem;
  padding-top: 1.5rem;
  font-size: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;

  @media (max-width: 640px) {
    position: static;
    padding-top: 1.25rem;
    font-size: 1.25rem;
  }
`;

const TITLE = `Blog — ${AUTHOR_NAME}`;

const BlogIndex = () => {
  const posts = useMemo(() => sortBlogsByDate(loadBlogPosts()), []);
  const years = useMemo(() => groupPostsByYear(posts), [posts]);
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
    <PageLayout>
      <PageHeader label={`Archive · ${posts.length} posts`} title="Writings" lede={BLOG_INDEX_DESCRIPTION}>
        <Links>
          <TextLink as="a" href={FEED_PATH} type="application/rss+xml">
            <HiOutlineRss aria-hidden="true" /> RSS feed
          </TextLink>
          <TextLink to={READING_LIST_PATH}>
            Reading list <HiArrowRight aria-hidden="true" data-arrow="forward" />
          </TextLink>
        </Links>
      </PageHeader>

      {years.map(({ year, posts: yearPosts }) => (
        <Year key={year}>
          <YearHeading>{year}</YearHeading>
          <PostList posts={yearPosts} views={views} showYear={false} />
        </Year>
      ))}
    </PageLayout>
  );
};

export default BlogIndex;
