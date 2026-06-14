import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdDateRange } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const Content = styled(motion.div)`
  background: var(--color-bg-card);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  @media (max-width: 768px) {
    max-height: 100vh;
    border-radius: 20px 20px 0 0;
  }
`;

const Header = styled.div`
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-bg-card);
  z-index: 10;
`;

const Title = styled.h2`
  font-size: var(--text-3xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  padding-right: var(--spacing-2xl);
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);

  svg {
    display: inline-block;
    vertical-align: middle;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-xl);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-accent-primary);
  }
`;

const Body = styled.div`
  padding: var(--spacing-xl);
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text-primary);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
  }
  
  h1 { font-size: var(--text-4xl); }
  h2 { font-size: var(--text-3xl); }
  h3 { font-size: var(--text-2xl); }
  h4 { font-size: var(--text-xl); }
  
  p {
    font-size: var(--text-base);
    line-height: 1.8;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }
  
  ul, ol {
    margin: var(--spacing-md) 0;
    padding-left: var(--spacing-lg);
    color: var(--color-text-secondary);
    line-height: 1.8;
  }
  
  li {
    margin-bottom: var(--spacing-sm);
  }

  a {
    color: var(--color-accent-primary);
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-accent-secondary);
    }
  }

  strong, b {
    color: var(--color-text-primary);
    font-weight: 600;
  }

  em, i {
    font-style: italic;
  }

  code {
    background: rgba(99, 102, 241, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background: var(--color-bg-secondary);
    padding: var(--spacing-md);
    border-radius: 8px;
    overflow-x: auto;
    margin: var(--spacing-md) 0;

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 4px solid var(--color-accent-primary);
    padding-left: var(--spacing-md);
    margin: var(--spacing-md) 0;
    font-style: italic;
    color: var(--color-text-secondary);
  }
`;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

/**
 * BlogModal Component
 * Displays the full blog post content in a modal overlay
 * 
 * @param {Object} props
 * @param {Object} props.blog - Blog post data object
 * @param {Function} props.onClose - Function to call when closing the modal
 */
const BlogModal = ({ blog, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (blog) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [blog]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (blog) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [blog, onClose]);

  if (!blog) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Content
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <CloseButton 
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes />
            </CloseButton>
            <Title id="modal-title">{blog.title}</Title>
            <Meta>
              <span>
                <MdDateRange aria-label="Publication date" /> {blog.date}
              </span>
              <span>
                <BiTime aria-label="Reading time" /> {blog.readTime}
              </span>
            </Meta>
          </Header>
          <Body>
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </Body>
        </Content>
      </Overlay>
    </AnimatePresence>
  );
};

BlogModal.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default BlogModal;
