// src/components/Blog/Blog.jsx
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaPen, FaBook, FaQuoteLeft, FaFeatherAlt, FaTimes } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdArrowForward, MdDateRange } from 'react-icons/md';
import blogPosts from './blogs.json'; // Import blog data

// Styled Components
const BlogSection = styled.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: var(--color-bg-primary);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

const SectionSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
`;

const BlogCard = styled(motion.article)`
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
`;

const BlogMeta = styled.div`
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

const BlogTitle = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
`;

const BlogSummary = styled.p`
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
  
  ${BlogCard}:hover & svg {
    transform: translateX(5px);
  }
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
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

const ModalHeader = styled.div`
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-bg-card);
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: var(--text-3xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
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

const ModalBody = styled.div`
  padding: var(--spacing-xl);
  
  h3 {
    font-size: var(--text-2xl);
    margin: var(--spacing-lg) 0 var(--spacing-md);
    color: var(--color-text-primary);
  }
  
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
  }
  
  li {
    margin-bottom: var(--spacing-sm);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  
  svg {
    font-size: 4rem;
    color: var(--color-accent-primary);
    opacity: 0.3;
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    max-width: 400px;
    margin: 0 auto;
  }
`;

const QuoteSection = styled(motion.div)`
  max-width: 800px;
  margin: var(--spacing-2xl) auto;
  text-align: center;
  position: relative;
`;

const QuoteIcon = styled.div`
  font-size: 3rem;
  color: var(--color-accent-primary);
  opacity: 0.2;
  margin-bottom: var(--spacing-md);
`;

const Quote = styled.blockquote`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  font-style: italic;
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
`;

const QuoteAuthor = styled.cite`
  font-size: var(--text-base);
  color: var(--color-accent-primary);
  font-style: normal;
  
  &::before {
    content: '— ';
  }
`;

const Blog = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedBlog, setSelectedBlog] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

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

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = '';
  };

  return (
    <BlogSection ref={sectionRef} id="blog">
      <Container>
        <SectionHeader
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <SectionTitle>Writings</SectionTitle>
            <SectionSubtitle>
              A collection of thoughts and insights (More coming soon...)
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>

        {blogPosts && blogPosts.length > 0 ? (
          <BlogGrid>
            {blogPosts.map((blog, index) => (
              <BlogCard
                key={blog.id}
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBlogClick(blog)}
                whileHover={{ scale: 1.02 }}
              >
                <BlogMeta>
                  <span>
                    <MdDateRange /> {blog.date}
                  </span>
                  <span>
                    <BiTime /> {blog.readTime}
                  </span>
                </BlogMeta>
                <BlogTitle>{blog.title}</BlogTitle>
                <BlogSummary>{blog.summary}</BlogSummary>
                <ReadMore>
                  Read More <MdArrowForward />
                </ReadMore>
              </BlogCard>
            ))}
          </BlogGrid>
        ) : (
          <EmptyState>
            <FaPen />
            <h3>Coming Soon</h3>
            <p>I'm currently crafting my thoughts into words. Check back soon for insights and stories from my journey.</p>
          </EmptyState>
        )}

        <QuoteSection
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <QuoteIcon>
            <FaQuoteLeft />
          </QuoteIcon>
          <Quote>
            "Specific knowledge is found by pursuing your genuine curiosity and passion 
            rather than whatever is hot right now."
          </Quote>
          <QuoteAuthor>Naval Ravikant</QuoteAuthor>
        </QuoteSection>
      </Container>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <CloseButton onClick={handleCloseModal}>
                  <FaTimes />
                </CloseButton>
                <ModalTitle>{selectedBlog.title}</ModalTitle>
                <ModalMeta>
                  <span>
                    <MdDateRange /> {selectedBlog.date}
                  </span>
                  <span>
                    <BiTime /> {selectedBlog.readTime}
                  </span>
                </ModalMeta>
              </ModalHeader>
              <ModalBody dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </BlogSection>
  );
};

export default Blog;