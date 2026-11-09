import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HiArrowRight } from 'react-icons/hi2';
import { AiOutlineEye } from 'react-icons/ai';
import { formatViews } from '../../utils/blogViews';
import { postPath } from '../../constants/routes';

const CardLink = styled(Link)`
  display: block;
  height: 100%;
  color: inherit;
  text-decoration: none;
  border-radius: var(--radius-lg);

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }
`;

const Card = styled(motion.article)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--duration-base) ease, box-shadow var(--duration-base) ease;

  ${CardLink}:hover &,
  ${CardLink}:focus-visible & {
    border-color: var(--color-accent-line);
    box-shadow: var(--shadow-md);
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    white-space: nowrap;
  }

  span + span::before {
    content: '·';
    margin-right: 0.5rem;
  }

  svg {
    font-size: 0.95em;
  }
`;

const Title = styled.h3`
  display: -webkit-box;
  margin-bottom: 0.75rem;
  overflow: hidden;
  font-size: 1.25rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color var(--duration-fast) ease;

  ${CardLink}:hover & {
    color: var(--color-accent-primary);
  }
`;

const Summary = styled.p`
  display: -webkit-box;
  margin-bottom: 1.5rem;
  overflow: hidden;
  font-size: 0.9375rem;
  line-height: 1.65;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: auto;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent-primary);

  svg {
    transition: transform var(--duration-fast) var(--ease-out);
  }

  ${CardLink}:hover & svg {
    transform: translateX(4px);
  }
`;

/**
 * A post preview card linking to the article.
 *
 * @param {Object} props
 * @param {Object} props.blog - Post data (title, slug, summary, date, readTime)
 * @param {number} props.index - Position, used to stagger the reveal
 * @param {Object} props.variants - Framer Motion reveal variants
 * @param {number} [props.views] - View count, shown when available
 */
const BlogCard = ({ blog, index, variants, views }) => {
  if (!blog) return null;

  return (
    <CardLink to={postPath(blog.slug)}>
      <Card
        variants={variants}
        initial="hidden"
        whileInView="visible"
        whileHover={{ y: -4 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ delay: index * 0.05 }}
        aria-label={`Blog post: ${blog.title}`}
      >
        <Meta>
          <span>{blog.date}</span>
          <span>{blog.readTime}</span>
          {views != null && (
            <span>
              <AiOutlineEye aria-label="Views" /> {formatViews(views)}
            </span>
          )}
        </Meta>
        <Title>{blog.title}</Title>
        <Summary>{blog.summary}</Summary>
        <ReadMore>
          Read More <HiArrowRight aria-hidden="true" />
        </ReadMore>
      </Card>
    </CardLink>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    date: PropTypes.string,
    readTime: PropTypes.string,
  }),
  index: PropTypes.number,
  variants: PropTypes.object,
  views: PropTypes.number,
};

export default BlogCard;
