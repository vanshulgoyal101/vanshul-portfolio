// src/components/Blog/Blog.jsx
import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPen } from 'react-icons/fa';

// Component imports
import BlogCard from './BlogCard';
import { BlogSkeletonCard } from '../Skeleton';

// Utility imports
import { sortBlogsByDate, getBlogCategories } from '../../utils/blogUtils';
import { loadBlogPosts } from '../../utils/blogLoader';

// Styled Components
const BlogSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-primary);
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  text-align: left;
`;

const Title = styled.h2`
  font-size: var(--text-4xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
  
  span {
    color: var(--color-accent-primary);
  }
`;

const Underline = styled.div`
  width: 60px;
  height: 2px;
  background: var(--color-accent-primary);
  margin-top: var(--spacing-xs);
`;

const CategoryFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-sm);
`;

const FilterButton = styled.button`
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: ${props => props.$active ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'};
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  position: relative;
  transition: var(--transition-base);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${props => props.$active ? '600' : '400'};
  min-height: auto;
  min-width: auto;
  
  &:hover {
    color: var(--color-accent-primary);
  }
`;

const ActiveLine = styled(motion.div)`
  position: absolute;
  bottom: -9px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent-primary);
`;

const BlogGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl) 0;
  
  svg {
    font-size: 3rem;
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-md);
    opacity: 0.4;
  }
  
  h3 {
    font-size: var(--text-lg);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }
`;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Load blog posts from markdown files
  const blogPosts = useMemo(() => {
    try {
      return loadBlogPosts();
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }, []);

  // Sort blog posts by date
  const sortedBlogPosts = useMemo(() => sortBlogsByDate(blogPosts), [blogPosts]);

  // Extract all categories dynamically and append 'All'
  const categories = useMemo(() => {
    const list = getBlogCategories(sortedBlogPosts);
    return ['All', ...list];
  }, [sortedBlogPosts]);

  // Filter posts based on selection
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return sortedBlogPosts;
    return sortedBlogPosts.filter(
      post => post.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [sortedBlogPosts, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BlogSection id="blog">
      <Container>
        <SectionHeader>
          <Title>Ideas & <span>Chronicles</span></Title>
          <Underline />
        </SectionHeader>

        {/* Dynamic Category Switcher */}
        {!isLoading && categories.length > 1 && (
          <CategoryFilterBar>
            {categories.map((cat) => (
              <FilterButton
                key={cat}
                $active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                {selectedCategory === cat && (
                  <ActiveLine layoutId="activeCategory" />
                )}
              </FilterButton>
            ))}
          </CategoryFilterBar>
        )}

        {isLoading ? (
          <BlogGrid>
            {[...Array(3)].map((_, index) => (
              <BlogSkeletonCard key={`skeleton-${index}`} />
            ))}
          </BlogGrid>
        ) : filteredPosts.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <BlogGrid
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredPosts.map((blog, index) => (
                <BlogCard
                  key={blog.slug || blog.filename}
                  blog={blog}
                  index={index}
                />
              ))}
            </BlogGrid>
          </AnimatePresence>
        ) : (
          <EmptyState>
            <FaPen />
            <h3>No Articles Found</h3>
            <p>I haven't written about this category yet. Check back soon!</p>
          </EmptyState>
        )}
      </Container>
    </BlogSection>
  );
};

export default Blog;
