import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { HiArrowRight, HiOutlineRss } from 'react-icons/hi';

import PageLayout from '../components/ui/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button, TextLink } from '../components/ui/Button';
import PostList from '../components/Blog/PostList';
import { loadBlogPosts } from '../utils/blogLoader';
import { sortBlogsByDate, groupPostsByYear } from '../utils/blogUtils';
import { useBlogViews } from '../hooks/useBlogViews';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, AUTHOR_NAME } from '../constants/siteConfig';
import { BLOG_PATH, READING_LIST_PATH } from '../constants/routes';
import { BLOG_INDEX_DESCRIPTION } from '../constants/blogConstants';
import { blogIndexJsonLd } from '../../scripts/lib/structuredData.mjs';
import { filterPosts } from '../utils/blogSearch';

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

const Filters = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 15rem) auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;

  label {
    display: grid;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  input, select {
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding: 0.75rem;
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius-sm);
    color: var(--color-ink);
    background: var(--color-bg-card);
    font: inherit;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ResultCount = styled.p`
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
`;

const BlogIndex = () => {
  const posts = useMemo(() => sortBlogsByDate(loadBlogPosts()), []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [fullPosts, setFullPosts] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    if (!query.trim() || fullPosts) return;
    let active = true;
    setSearchError(false);
    import('../utils/blogPostLoader')
      .then(module => module.loadFullBlogPosts())
      .then(loaded => {
        if (active) setFullPosts(sortBlogsByDate(loaded));
      })
      .catch(error => {
        if (!active) return;
        console.error('Could not load article text for search:', error);
        setSearchError(true);
      });
    return () => { active = false; };
  }, [query, fullPosts]);
  const failed = Boolean(query.trim()) && searchError;
  const pending = Boolean(query.trim()) && !fullPosts && !failed;
  const categories = useMemo(() => [...new Set(posts.map(post => post.category).filter(Boolean))].sort(), [posts]);
  const filtered = useMemo(() => filterPosts(fullPosts ?? posts, query, category), [fullPosts, posts, query, category]);
  const years = useMemo(() => groupPostsByYear(filtered), [filtered]);
  const views = useBlogViews();
  const reset = () => {
    setQuery('');
    setCategory('');
    searchRef.current?.focus();
  };

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

      <Filters role="search" aria-label="Search writings">
        <label>
          Search writings
          <input ref={searchRef} type="search" value={query} onChange={event => setQuery(event.target.value)}
            placeholder="Search titles, topics, or article text" aria-describedby="archive-results" />
        </label>
        <label>
          Topic
          <select value={category} onChange={event => setCategory(event.target.value)}>
            <option value="">All topics</option>
            {categories.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </label>
        <Button type="button" $variant="secondary" onClick={reset} disabled={!query && !category}>
          Clear filters
        </Button>
      </Filters>
      <ResultCount id="archive-results" role="status" aria-atomic="true">
        {pending ? 'Searching all writings...' : failed ? 'Search unavailable' : `${filtered.length} of ${posts.length} posts`}
      </ResultCount>
      {failed && <p role="alert">Article text could not be loaded. <a href={BLOG_PATH}>Reload the archive</a> to retry, or clear the search to browse every writing.</p>}
      {!pending && !failed && filtered.length === 0 && <p>No writings match these filters. Try another word or clear the filters.</p>}

      {!pending && !failed && years.map(({ year, posts: yearPosts }) => (
        <Year key={year}>
          <YearHeading>{year}</YearHeading>
          <PostList posts={yearPosts} views={views} showYear={false} />
        </Year>
      ))}
    </PageLayout>
  );
};

export default BlogIndex;
