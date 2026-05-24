// src/components/Blog/BlogCard.jsx
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
  border-radius: 8px;
  padding: var(--spacing-lg);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: rgba(245, 158, 11, 0.4);
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  
  &:focus-visible {
    outline: none;
  }
  
  &:focus-visible ${Card} {
    border-color: var(--color-accent-primary);
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const CategoryBadge = styled.span`
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-accent-secondary);
  border: 1px solid var(--color-border);
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 500;
`;

const Title = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const Summary = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  flex: 1;
`;

const ReadMore = styled.span`
  color: var(--color-accent-primary);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  ${Card}:hover & svg {
    transform: translateX(4px);
  }
`;

const BlogCard = ({ blog, index }) => {
  if (!blog) return null;

  return (
    <CardLink to={`/blog/${blog.slug}`}>
      <Card
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileTap={{ scale: 0.99 }}
      >
        <div>
          <Meta>
            {blog.category && (
              <CategoryBadge>{blog.category}</CategoryBadge>
            )}
            <span>
              <MdDateRange size={12} /> {blog.date}
            </span>
            <span>
              <BiTime size={12} /> {blog.readTime}
            </span>
          </Meta>
          <Title>{blog.title}</Title>
          <Summary>{blog.summary}</Summary>
        </div>
        
        <ReadMore>
          Read Entry <MdArrowForward size={14} />
        </ReadMore>
      </Card>
    </CardLink>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default BlogCard;
