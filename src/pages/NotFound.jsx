import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useSeo } from '../hooks/useSeo';
import Navigation from '../components/Navigation/Navigation';

const Wrap = styled.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const Center = styled(motion.main)`
  position: relative;
  z-index: 2;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  padding: 160px var(--spacing-lg) var(--spacing-2xl);

  @media (max-width: 768px) {
    padding-top: 120px;
  }
`;

const Code = styled.p`
  font-size: clamp(4rem, 14vw, 9rem);
  font-weight: 800;
  line-height: 1;
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin: var(--spacing-md) 0 var(--spacing-sm);
`;

const Text = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
`;

const HomeButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 12px 24px;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: var(--color-gradient-1);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

const QuietLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  min-height: 44px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 600;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--color-accent-primary);
  }
`;

const NotFound = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useSeo({
    title: 'Page not found — Vanshul Goyal',
    description: "That page doesn't exist. Head back home or explore the writing and projects.",
    path: pathname,
    robots: 'noindex, follow',
  });

  return (
    <Wrap>
      <Navigation scrollToSection={(id) => navigate(`/#${id}`)} />
      <Center initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Code>404</Code>
        <Title>This page wandered off.</Title>
        <Text>
          The link may be broken or the page may have moved. Let&apos;s get you back on track.
        </Text>
        <Actions>
          <HomeButton onClick={() => navigate('/')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <FaArrowLeft /> Back home
          </HomeButton>
          <QuietLink to="/blog">Read the blog</QuietLink>
          <QuietLink to="/reading-list">Reading list</QuietLink>
        </Actions>
      </Center>
    </Wrap>
  );
};

export default NotFound;
