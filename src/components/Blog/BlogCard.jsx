import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BiTime } from 'react-icons/bi';
import { MdArrowForward, MdDateRange } from 'react-icons/md';
import PropTypes from 'prop-types';

// Styled Components
const Card = styled(motion.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
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
    border-color: var(--color-accent-primary);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
  }
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);

  svg {
    display: inline-block;
    vertical-align: middle;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
`;

const Summary = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
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
const BlogCard = ({ blog, index, isInView, variants }) => {
  if (!blog) return null;

  return (
    <CardLink to={`/blog/${blog.slug}`}>
      <Card
        variants={variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
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
  isInView: PropTypes.bool.isRequired,
  variants: PropTypes.object.isRequired,
};

export default BlogCard;
