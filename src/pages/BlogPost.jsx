// src/pages/BlogPost.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShare } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdDateRange } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { loadBlogBySlug } from '../utils/blogLoader';
import Navigation from '../components/Navigation/Navigation';

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--color-bg-primary);
  position: relative;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;
  
  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const Container = styled.div`
  max-width: 800px; /* narrowed for comfortable reading line-length */
  margin: 0 auto;
  padding: 0 var(--spacing-md) var(--spacing-2xl);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: var(--transition-base);
  min-height: auto;
  min-width: auto;
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    background: rgba(245, 158, 11, 0.02);
  }
`;

const ShareButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: var(--transition-base);
  min-height: auto;
  min-width: auto;
  
  &:hover {
    color: var(--color-accent-secondary);
    border-color: var(--color-accent-secondary);
    background: rgba(56, 189, 248, 0.02);
  }
`;

const ArticleHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-accent-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-md);
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const ArticleBody = styled.div`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  line-height: 1.85;
  color: var(--color-text-primary);
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    color: var(--color-text-primary);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-xs);
    font-weight: 600;
    line-height: 1.3;
  }
  
  h1 { font-size: var(--text-2xl); }
  h2 { 
    font-size: var(--text-xl);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 4px;
  }
  h3 { font-size: var(--text-lg); }
  
  p {
    font-family: var(--font-serif);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }
  
  ul, ol {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
    
    li {
      margin-bottom: 6px;
    }
  }
  
  a {
    color: var(--color-accent-primary);
    text-decoration: underline;
    text-decoration-color: rgba(245, 158, 11, 0.3);
    text-underline-offset: 3px;
    transition: var(--transition-base);
    
    &:hover {
      color: var(--color-accent-glow);
      text-decoration-color: var(--color-accent-glow);
    }
  }
  
  blockquote {
    border-left: 3px solid var(--color-accent-primary);
    padding-left: var(--spacing-md);
    margin: var(--spacing-md) 0;
    color: var(--color-text-primary);
    font-style: italic;
    background: rgba(255, 255, 255, 0.01);
    padding-top: var(--spacing-xs);
    padding-bottom: var(--spacing-xs);
  }
  
  code {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--color-border);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: var(--font-mono);
    color: var(--color-accent-secondary);
  }
  
  pre {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: var(--spacing-md);
    
    code {
      background: none;
      border: none;
      padding: 0;
      color: var(--color-text-primary);
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: var(--spacing-lg) 0 var(--spacing-xs);
    border: 1px solid var(--color-border);
  }

  em.caption {
    display: block;
    text-align: center;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-md);
  }
  
  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--spacing-xl) 0;
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  
  h2 {
    font-size: var(--text-2xl);
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
  }
`;

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const blog = loadBlogBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleBack = () => {
    navigate('/#blog');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title || 'Blog Post',
          text: blog?.summary || '',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback copy
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const scrollToSection = (sectionId) => {
    navigate(`/#${sectionId}`);
  };

  return (
    <PageWrapper>
      <Navigation scrollToSection={scrollToSection} />
      <ContentWrapper>
        <Container>
          <TopBar>
            <BackButton onClick={handleBack} whileHover={{ x: -2 }}>
              <FaArrowLeft size={10} /> Back to chronicles
            </BackButton>
            {blog && (
              <ShareButton onClick={handleShare}>
                <FaShare size={10} /> Share entry
              </ShareButton>
            )}
          </TopBar>
          
          {blog ? (
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <ArticleHeader>
                {blog.category && <CategoryBadge>{blog.category}</CategoryBadge>}
                <Title>{blog.title}</Title>
                <Meta>
                  <span>
                    <MdDateRange size={12} /> {blog.date}
                  </span>
                  <span>
                    <BiTime size={12} /> {blog.readTime}
                  </span>
                </Meta>
              </ArticleHeader>
              
              <ArticleBody>
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </ArticleBody>
            </motion.article>
          ) : (
            <NotFound>
              <h2>Entry Not Found</h2>
              <p>The chronicle you're searching for does not exist in this library.</p>
              <BackButton onClick={handleBack}>
                Return to blog
              </BackButton>
            </NotFound>
          )}
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default BlogPost;
