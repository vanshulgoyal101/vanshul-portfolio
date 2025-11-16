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

const BackgroundElements = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    opacity: 0.05;
    filter: blur(100px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    opacity: 0.05;
    filter: blur(100px);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  padding-top: 100px;
  
  @media (max-width: 768px) {
    padding-top: 90px;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-xl);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md) var(--spacing-lg);
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    margin-bottom: var(--spacing-sm);
  }
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
    transform: translateX(-3px);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ShareButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const Article = styled(motion.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-border);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Category = styled.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-accent-primary);
  border-radius: 20px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-md);
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.2;
  font-weight: 700;
  
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
  margin-top: var(--spacing-sm);

  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  svg {
    display: inline-block;
    vertical-align: middle;
    color: var(--color-accent-primary);
  }
`;

const Body = styled.div`
  padding: var(--spacing-lg) var(--spacing-xl);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text-primary);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
    line-height: 1.3;
  }
  
  h1 { font-size: var(--text-3xl); }
  h2 { 
    font-size: var(--text-2xl);
    padding-bottom: var(--spacing-xs);
    border-bottom: 2px solid var(--color-border);
  }
  h3 { font-size: var(--text-xl); }
  h4 { font-size: var(--text-lg); }
  h5 { font-size: var(--text-base); }
  h6 { font-size: var(--text-sm); }
  
  p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin-bottom: var(--spacing-md);
    font-size: var(--text-base);
  }
  
  ul, ol {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
  }
  
  li {
    margin-bottom: var(--spacing-xs);
  }
  
  a {
    color: var(--color-accent-primary);
    text-decoration: underline;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--color-accent-primary);
    padding-left: var(--spacing-md);
    margin: var(--spacing-lg) 0;
    color: var(--color-text-secondary);
    font-style: italic;
  }
  
  code {
    background: rgba(99, 102, 241, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    color: var(--color-accent-primary);
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: var(--spacing-md);
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: var(--spacing-md);
    
    code {
      background: none;
      padding: 0;
      color: var(--color-text-primary);
    }
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: var(--spacing-lg) 0;
  }
  
  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--spacing-xl) 0;
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  
  h2 {
    font-size: var(--text-3xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
  }
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const scrollToSection = (sectionId) => {
    navigate(`/#${sectionId}`);
  };

  if (!blog) {
    return (
      <PageWrapper>
        <BackgroundElements />
        <Navigation scrollToSection={scrollToSection} />
        <ContentWrapper>
          <Container>
            <TopBar>
              <BackButton onClick={handleBack} whileHover={{ scale: 1.05 }}>
                <FaArrowLeft /> Back to Blog
              </BackButton>
            </TopBar>
            <NotFound>
              <h2>Blog Post Not Found</h2>
              <p>The blog post you're looking for doesn't exist.</p>
            </NotFound>
          </Container>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <BackgroundElements />
      <Navigation scrollToSection={scrollToSection} />
      <ContentWrapper>
        <Container>
          <TopBar>
            <BackButton onClick={handleBack} whileHover={{ scale: 1.05 }}>
              <FaArrowLeft /> Back to Blog
            </BackButton>
            <ShareButton onClick={handleShare} whileHover={{ scale: 1.05 }}>
              <FaShare /> Share
            </ShareButton>
          </TopBar>
          
          <Article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Header>
              {blog.category && <Category>{blog.category}</Category>}
              <Title>{blog.title}</Title>
              <Meta>
                <span>
                  <MdDateRange /> {blog.date}
                </span>
                <span>
                  <BiTime /> {blog.readTime}
                </span>
              </Meta>
            </Header>
            
            <Body>
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </Body>
          </Article>
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default BlogPost;
