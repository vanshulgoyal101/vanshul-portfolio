import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiOutlineShare } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';

import PageLayout from '../components/ui/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button, ButtonLink, TextLink } from '../components/ui/Button';
import { eyebrow } from '../components/ui/typography';
import PostList from '../components/Blog/PostList';
import { useToast } from '../components/Toast';
import { loadBlogBySlug, loadBlogPosts } from '../utils/blogLoader';
import { getRelatedPosts, formatPostDate } from '../utils/blogUtils';
import { formatViews } from '../utils/blogViews';
import { parseTags, postDate, postLastModified, postPublishedAt } from '../utils/seoValues';
import { articleHeadings, rehypeHeadingIds, MIN_TOC_HEADINGS } from '../utils/articleHeadings';
import { useBlogView } from '../hooks/useBlogViews';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL, AUTHOR_NAME, AUTHOR_SAME_AS } from '../constants/siteConfig';
import { PROFILE } from '../constants/profile';
import { BLOG_PATH, homeSectionPath, postPath } from '../constants/routes';
import { postJsonLd } from '../../scripts/lib/structuredData.mjs';

const Back = styled(TextLink)`
  margin-bottom: 1.5rem;
`;

const Byline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-hairline);
  border-bottom: 1px solid var(--color-hairline);
`;

const Avatar = styled.img`
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--color-bg-tertiary);
`;

const BylineText = styled.div`
  flex: 1;
  min-width: 0;
`;

const Author = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-ink);
`;

const Facts = styled.p`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: var(--color-text-muted);
`;

const ShareButton = styled(Button)`
  flex-shrink: 0;
  min-height: 44px;
  padding: 0 1.125rem;
  font-size: 0.875rem;
`;

const Contents = styled.nav`
  margin-bottom: 2.75rem;
  padding: 1.25rem 1.5rem 0.75rem;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);

  p {
    ${eyebrow}
    margin-bottom: 0.25rem;
    color: var(--color-text-muted);
  }

  ol {
    padding-left: 2rem;
    list-style: decimal-leading-zero;
  }

  li::marker {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  /* Subsections are indented under their section and keep its numbering. */
  li[data-level='3'] {
    margin-left: 1.25rem;
    list-style: none;
    counter-increment: list-item 0;
  }

  a {
    display: flex;
    align-items: center;
    padding: 0.25rem 0;
    font-size: 0.9375rem;
    line-height: 1.45;
    color: var(--color-text-primary);
    text-decoration: none;

    &:hover {
      color: var(--color-accent-primary);
    }

    /* Touch keeps 44px rows; a mouse pointer gets a tighter list. */
    @media (hover: hover) and (pointer: fine) {
      min-height: 2.25rem;
    }
  }
`;

// Long-form typography: an 18px body on a ~70 character measure.
const Prose = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-primary);
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.0625rem;
    line-height: 1.75;
  }

  p,
  ul,
  ol,
  blockquote,
  pre {
    margin-bottom: 1.4em;
  }

  p {
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  h2,
  h3 {
    color: var(--color-ink);
    letter-spacing: -0.02em;
  }

  h2 {
    margin: 2.2em 0 0.7em;
    font-size: clamp(1.5rem, 3.6vw, 1.875rem);
    line-height: 1.25;
  }

  h3 {
    margin: 1.8em 0 0.6em;
    font-size: 1.25rem;
    line-height: 1.35;
  }

  strong {
    font-weight: 600;
    color: var(--color-ink);
  }

  a {
    font-weight: 500;
    color: var(--color-accent-primary);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: var(--color-accent-line);
    text-underline-offset: 3px;

    &:hover {
      text-decoration-color: currentColor;
    }
  }

  ul,
  ol {
    padding-left: 1.4em;
  }

  li {
    margin: 0.4em 0;
    padding-left: 0.2em;
  }

  li::marker {
    color: var(--color-accent-primary);
  }

  blockquote {
    margin-top: 1.8em;
    padding-left: 1.25em;
    border-left: 2px solid var(--color-accent-primary);
    font-family: var(--font-display);
    font-size: 1.1875em;
    line-height: 1.55;
    color: var(--color-ink);

    p:last-child {
      margin-bottom: 0;
    }
  }

  code {
    padding: 0.15em 0.4em;
    border-radius: 6px;
    background: var(--color-bg-tertiary);
    font-family: var(--font-mono);
    font-size: 0.85em;
  }

  pre {
    padding: 1.25rem;
    overflow-x: auto;
    border-radius: var(--radius-md);
    background: var(--color-ink);
    color: #e2e8f0;
    font-size: 0.875rem;
    line-height: 1.7;

    code {
      padding: 0;
      background: none;
      color: inherit;
    }
  }

  img {
    margin: 2em 0;
    border-radius: var(--radius-md);
  }

  /* Section break: a centred dinkus instead of a full-width rule. */
  hr {
    margin: 2.5em 0;
    border: 0;
    text-align: center;

    &::before {
      content: '· · ·';
      letter-spacing: 0.5em;
      color: var(--color-text-muted);
    }
  }
`;

const AuthorCard = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
  margin-top: 3.5rem;
  padding: 1.5rem;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);

  ${Avatar} {
    width: 4rem;
    height: 4rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    padding: 1.25rem;

    ${Avatar} {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const CardLabel = styled.p`
  ${eyebrow}
  color: var(--color-text-muted);
`;

const CardName = styled.p`
  margin-top: 0.25rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-ink);
`;

const CardBio = styled.p`
  margin: 0.5rem 0 0.25rem;
  font-size: 0.9375rem;
  line-height: 1.65;
`;

const Related = styled.section`
  margin-top: 4.5rem;
  border-top: 1px solid var(--color-ink);
`;

const RelatedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.25rem;

  h2 {
    font-size: 1.5rem;
    letter-spacing: -0.02em;
  }
`;

// Post links point to outside sources; open them without leaving the article.
const markdownComponents = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

const BlogPost = () => {
  const { slug } = useParams();
  const { showSuccess, showError } = useToast();
  const blog = loadBlogBySlug(slug);
  const views = useBlogView(blog ? slug : null);
  const related = useMemo(() => (blog ? getRelatedPosts(loadBlogPosts(), blog, 3) : []), [blog]);
  const headings = useMemo(() => (blog ? articleHeadings(blog.content) : []), [blog]);

  // Per-post SEO: unique title/description/canonical + BlogPosting structured data.
  const jsonLd = useMemo(() => {
    if (!blog) return undefined;
    const wordCount = blog.content ? blog.content.trim().split(/\s+/).length : undefined;
    return JSON.stringify(postJsonLd({ ...blog, wordCount }, {
      site: SITE_URL, authorName: AUTHOR_NAME, authorSameAs: AUTHOR_SAME_AS,
    }));
  }, [blog]);

  const articleMeta = useMemo(() => {
    if (!blog) return undefined;
    return {
      publishedTime: postPublishedAt(blog.date),
      modifiedTime: postPublishedAt(postLastModified(blog)),
      author: AUTHOR_NAME,
      section: blog.category,
      tags: parseTags(blog.tags),
    };
  }, [blog]);

  useSeo({
    title: blog ? `${blog.title} — ${AUTHOR_NAME}` : `Post not found — ${AUTHOR_NAME}`,
    description: blog?.summary || 'The requested blog post could not be found.',
    path: postPath(blog ? blog.slug : slug ?? ''),
    image: blog ? `${SITE_URL}/og/${blog.slug}.png` : undefined,
    type: blog ? 'article' : 'website',
    robots: blog ? undefined : 'noindex, follow',
    jsonLd,
    article: articleMeta,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title || 'Blog Post',
          text: blog?.summary || '',
          url,
        });
      } catch (err) {
        if (err?.name !== 'AbortError') console.error('Error sharing:', err);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showSuccess('Link copied', 'The post link is now on your clipboard.');
    } catch {
      showError('Could not copy link', 'Copy the URL from your browser address bar instead.');
    }
  };

  const backLink = (
    <Back to={BLOG_PATH}>
      <HiArrowLeft aria-hidden="true" data-arrow="back" /> Back to Blog
    </Back>
  );

  if (!blog) {
    return (
      <PageLayout width="reading">
        {backLink}
        <PageHeader
          label="Error 404"
          title="Blog Post Not Found"
          lede="The blog post you're looking for doesn't exist. It may have moved, or the link may be mistyped."
        />
        <ButtonLink to={BLOG_PATH}>
          Browse all posts <HiArrowRight aria-hidden="true" data-arrow="forward" />
        </ButtonLink>
      </PageLayout>
    );
  }

  const facts = [blog.readTime, views != null && `${formatViews(views)} views`].filter(Boolean);
  // Shown only when the post declares a later update date.
  const updated = postDate(postLastModified(blog)) !== postDate(blog.date) ? blog.updated : null;

  return (
    <PageLayout width="reading">
      {backLink}
      <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <PageHeader label={blog.category} title={blog.title} lede={blog.summary}>
          <Byline>
            <Avatar src={PROFILE.avatar} alt="" width="44" height="44" decoding="async" />
            <BylineText>
              <Author>{AUTHOR_NAME}</Author>
              <Facts>
                <time dateTime={postDate(blog.date)}>{formatPostDate(blog.date)}</time>
                {updated && (
                  <>
                    {' · Updated '}
                    <time dateTime={postDate(updated)}>{formatPostDate(updated)}</time>
                  </>
                )}
                {facts.map((fact) => ` · ${fact}`).join('')}
              </Facts>
            </BylineText>
            <ShareButton type="button" $variant="secondary" onClick={handleShare}>
              <HiOutlineShare aria-hidden="true" /> Share
            </ShareButton>
          </Byline>
        </PageHeader>

        {headings.length >= MIN_TOC_HEADINGS && (
          <Contents aria-label="Table of contents">
            <p>On this page</p>
            <ol>
              {headings.map((heading) => (
                <li key={heading.id} data-level={heading.level}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ol>
          </Contents>
        )}

        <Prose>
          <ReactMarkdown rehypePlugins={[rehypeHeadingIds]} components={markdownComponents}>
            {blog.content}
          </ReactMarkdown>
        </Prose>

        <AuthorCard>
          <Avatar src={PROFILE.avatar} alt="" width="64" height="64" loading="lazy" decoding="async" />
          <div>
            <CardLabel>Written by</CardLabel>
            <CardName>{AUTHOR_NAME}</CardName>
            <CardBio>
              {PROFILE.role} at {PROFILE.employer.name}. {PROFILE.summary}
            </CardBio>
            <TextLink to={homeSectionPath('about')}>
              More about me <HiArrowRight aria-hidden="true" data-arrow="forward" />
            </TextLink>
          </div>
        </AuthorCard>
      </motion.article>

      {related.length > 0 && (
        <Related aria-labelledby="more-writings">
          <RelatedHeader>
            <h2 id="more-writings">More writings</h2>
            <TextLink to={BLOG_PATH}>
              All posts <HiArrowRight aria-hidden="true" data-arrow="forward" />
            </TextLink>
          </RelatedHeader>
          <PostList posts={related} />
        </Related>
      )}
    </PageLayout>
  );
};

export default BlogPost;
