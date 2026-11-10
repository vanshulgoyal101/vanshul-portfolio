import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

import { postPath } from '../../constants/routes';
import { postDate } from '../../utils/seoValues';
import { formatPostDate } from '../../utils/blogUtils';
import { formatViews } from '../../utils/blogViews';

const List = styled.ol`
  list-style: none;
`;

const Row = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr) 1.25rem;
  gap: 0.375rem 1.5rem;
  padding: 1.5rem 0;

  & + & {
    border-top: 1px solid var(--color-hairline);
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 1.25rem 0;
  }
`;

const When = styled.time`
  padding-top: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--color-text-muted);
`;

const Body = styled.div`
  min-width: 0;
`;

const Title = styled.h3`
  font-size: clamp(1.25rem, 2.4vw, 1.4375rem);
  line-height: 1.3;
  letter-spacing: -0.02em;

  a {
    color: var(--color-ink);
    text-decoration: none;
    transition: color var(--duration-fast) ease;

    /* The whole row is the click target; the link's name stays the title. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-sm);
    }

    &:focus-visible {
      outline: none;
    }

    &:focus-visible::after {
      outline: 3px solid var(--color-accent-primary);
      outline-offset: 2px;
    }
  }

  ${Row}:hover & a {
    color: var(--color-accent-primary);
  }
`;

const Summary = styled.p`
  margin-top: 0.5rem;
  font-size: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.p`
  margin-top: 0.625rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--color-text-muted);
`;

const Arrow = styled(HiArrowRight)`
  align-self: center;
  color: var(--color-accent-primary);
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity var(--duration-fast) ease,
    transform var(--duration-base) var(--ease-out);

  ${Row}:hover & {
    opacity: 1;
    transform: none;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

// Editorial list of posts: date, linked title, summary and reading facts.
// Used by the archive and by "More writings" under each article.
const PostList = ({ posts, views = {}, showYear = true }) => (
  <List>
    {posts.map((post) => {
      const facts = [post.category, post.readTime, views[post.slug] != null && `${formatViews(views[post.slug])} views`].filter(Boolean);
      return (
        <Row key={post.slug}>
          <When dateTime={postDate(post.date)}>{formatPostDate(post.date, { year: showYear })}</When>
          <Body>
            <Title>
              <Link to={postPath(post.slug)}>{post.title}</Link>
            </Title>
            {post.summary && <Summary>{post.summary}</Summary>}
            {facts.length > 0 && <Meta>{facts.join(' · ')}</Meta>}
          </Body>
          <Arrow aria-hidden="true" />
        </Row>
      );
    })}
  </List>
);

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string,
      summary: PropTypes.string,
      category: PropTypes.string,
      readTime: PropTypes.string,
    })
  ).isRequired,
  views: PropTypes.objectOf(PropTypes.number),
  showYear: PropTypes.bool,
};

export default PostList;
