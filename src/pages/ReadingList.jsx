import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBookOpen } from 'react-icons/fa';
import { BOOKS } from '../constants/books';
import { useSeo } from '../hooks/useSeo';
import { SITE_URL } from '../constants/siteConfig';
import Navigation from '../components/Navigation/Navigation';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: transparent;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl) var(--spacing-2xl);

  @media (max-width: 768px) {
    padding: 0 var(--spacing-md) var(--spacing-xl);
  }
`;

const TopBar = styled.div`
  margin-bottom: var(--spacing-md);
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
  min-height: 44px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--color-accent-primary);
    transform: translateX(-3px);
  }
`;

const Article = styled(motion.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-md);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Title = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-4xl);
  color: var(--color-text-primary);
  line-height: 1.2;
  font-weight: 700;

  svg {
    color: var(--color-accent-primary);
    font-size: 0.7em;
  }

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const Subtitle = styled.p`
  margin-top: var(--spacing-sm);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
`;

const Body = styled.div`
  padding: var(--spacing-lg) var(--spacing-xl);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--spacing-2xl);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.li`
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--color-border);

  /* No top border for the first row (single item on mobile, two on desktop). */
  &:first-child {
    border-top: none;
  }

  @media (min-width: 721px) {
    &:nth-child(2) {
      border-top: none;
    }
  }
`;

const BookLine = styled.p`
  font-size: var(--text-lg);
  line-height: 1.35;
  color: var(--color-text-primary);
`;

const BookName = styled.span`
  font-weight: 600;
`;

const By = styled.span`
  color: var(--color-text-muted);
`;

const Note = styled.p`
  margin-top: 4px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const ReadingListPage = () => {
  const navigate = useNavigate();

  const jsonLd = useMemo(() => {
    const url = `${SITE_URL}/reading-list`;
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'From My Shelf — Vanshul Goyal',
        description: 'Favourite books that shaped how Vanshul Goyal thinks.',
        url,
        numberOfItems: BOOKS.length,
        itemListElement: BOOKS.map((book, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Book',
            name: book.title,
            author: { '@type': 'Person', name: book.author },
          },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/#blog` },
          { '@type': 'ListItem', position: 3, name: 'Reading List', item: url },
        ],
      },
    ]);
  }, []);

  useSeo({
    title: 'Reading List — Vanshul Goyal',
    description:
      "From My Shelf: favourite books that shaped how I think — fiction and non-fiction, with a one-line note on each.",
    path: '/reading-list',
    jsonLd,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper>
      <BackgroundElements />
      <Navigation scrollToSection={(id) => navigate(`/#${id}`)} />
      <ContentWrapper>
        <Container>
          <TopBar>
            <BackButton onClick={() => navigate('/#blog')} whileHover={{ scale: 1.05 }}>
              <FaArrowLeft /> Back to Blog
            </BackButton>
          </TopBar>

          <Article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Header>
              <Title>
                <FaBookOpen aria-hidden="true" /> From My Shelf
              </Title>
              <Subtitle>
                {BOOKS.length} books that shaped how I think — fiction and non-fiction alike.
              </Subtitle>
            </Header>

            <Body>
              <List>
                {BOOKS.map((book) => (
                  <Item key={book.title}>
                    <BookLine>
                      <BookName>{book.title}</BookName> <By>· {book.author}</By>
                    </BookLine>
                    <Note>{book.note}</Note>
                  </Item>
                ))}
              </List>
            </Body>
          </Article>
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ReadingListPage;
