import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BiTime } from 'react-icons/bi';
import { MdArrowForward, MdDateRange } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { formatViews } from '../../utils/blogViews';

// Styled Components
const Card = styled(motion.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: border-color 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }
  
  @media (max-width: 768px) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 16px;
  
  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }
  
  &:focus-visible ${Card} {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin-bottom: var(--spacing-sm);
  font-size: 0.78rem;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  /* Views read as secondary, quieter than date/read-time */
  span.views {
    opacity: 0.7;
  }

  svg {
    flex-shrink: 0;
    font-size: 0.95em;
    opacity: 0.7;
  }
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
`;

const Summary = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 4.8em;
`;

const ReadMore = styled.span`
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  svg {
    transition: transform 0.3s ease;
  }
  
  ${Card}:hover & svg {
    transform: translateX(5px);
  }
`;

/**
 * BlogCard Component
 * Displays a single blog post preview card with title, summary, and metadata
 * 
 * @param {Object} props
 * @param {Object} props.blog - Blog post data object
 * @param {number} props.index - Index for animation delay
 * @param {boolean} props.isInView - Whether the card is in viewport
 * @param {Object} props.variants - Animation variants
 */
const BlogCard = ({ blog, index, variants, views }) => {
  if (!blog) return null;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <CardLink to={`/blog/${blog.slug}`}>
      <Card
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ delay: index * 0.1 }}
        whileHover={isMobile ? {} : { scale: 1.02 }}
        role="article"
        aria-label={`Blog post: ${blog.title}`}
      >
        <Meta>
          <span>
            <MdDateRange aria-label="Publication date" /> {blog.date}
          </span>
          <span>
            <BiTime aria-label="Reading time" /> {blog.readTime}
          </span>
          {views != null && (
            <span className="views">
              <AiOutlineEye aria-label="Views" /> {formatViews(views)}
            </span>
          )}
        </Meta>
      <Title>{blog.title}</Title>
      <Summary>{blog.summary}</Summary>
      <ReadMore>
        Read More <MdArrowForward />
      </ReadMore>
      </Card>
    </CardLink>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  variants: PropTypes.object.isRequired,
  views: PropTypes.number,
};

export default BlogCard;
