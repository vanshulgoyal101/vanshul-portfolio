import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaArrowUp, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { BOOKS, ESSAYS } from '../constants/books';
import { READING_LIST_DESCRIPTION, READING_LIST_JSON_LD } from '../constants/readingListSeo';
import { useSeo } from '../hooks/useSeo';
import { scrollToSection } from '../utils/scrollToSection';
import Navigation from '../components/Navigation/Navigation';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: transparent;
  position: relative;
  overflow-x: hidden;
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
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 var(--container-padding) 5rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  text-decoration: none;
  min-height: 44px;
  &:hover { color: var(--color-accent-primary); }
`;

const Article = styled.article`
  letter-spacing: 0;
  overflow-wrap: anywhere;
`;

const Header = styled.header`
  padding: 2rem 0;
  border-bottom: 2px solid var(--color-text-primary);
  scroll-margin-top: 110px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: var(--color-text-primary);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: 0;
  @media (max-width: 768px) { font-size: 2.5rem; }
`;

const Subtitle = styled.p`
  margin-top: 1rem;
  font-size: var(--text-base);
  color: var(--color-text-secondary);
`;

const Index = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  margin-top: 1.5rem;
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 44px;
    color: var(--color-accent-primary);
    text-decoration: none;
    border-bottom: 1px solid var(--color-accent-primary);
  }
  a:hover { color: var(--color-text-primary); }
  span { font-family: var(--font-mono); font-size: 0.75rem; }
`;

const Collection = styled.section`
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 2rem;
  padding: 3rem 0;
  border-bottom: 1px solid var(--color-border);
  scroll-margin-top: 110px;
  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
    padding: 2rem 0;
  }
`;

const CollectionHeading = styled.div`
  h2 { font-size: 1.75rem; line-height: 1.2; letter-spacing: 0; }
  p {
    margin-top: 0.6rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
`;

const BookList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`;

const BookItem = styled.li`
  min-width: 0;
  padding: 0 0 1.5rem 1rem;
  border-left: 2px solid var(--color-accent-primary);
  border-bottom: 1px solid var(--color-border);
`;

const Number = styled.span`
  display: block;
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-secondary);
`;

const ItemTitle = styled.h3`
  font-size: 1.125rem;
  line-height: 1.35;
  letter-spacing: 0;
  color: var(--color-text-primary);
`;

const ReadingLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 44px;
  color: inherit;
  text-decoration: none;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  svg { flex-shrink: 0; color: var(--color-accent-primary); width: 14px; }
  &:hover { color: var(--color-accent-primary); text-decoration: underline; }
`;

const By = styled.p`
  margin-top: 0.4rem;
  font-size: 0.8125rem;
  color: var(--color-accent-primary);
`;

const EssayList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  li { padding: 1.25rem 0; border-bottom: 1px solid var(--color-border); }
  li:first-child { padding-top: 0; }
  li:last-child { border-bottom: 0; padding-bottom: 0; }
`;

const Source = styled.span`
  display: block;
  margin-top: 0.75rem;
  font: 0.7rem/1.6 var(--font-mono);
  color: var(--color-text-secondary);
`;

const Note = styled.p`
  margin-top: 0.75rem;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.75;
  max-width: 65ch;
`;

const End = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1.5rem;
`;

const ReadingListPage = () => {
  useSeo({
    title: 'Reading List — Vanshul Goyal',
    description: READING_LIST_DESCRIPTION,
    path: '/reading-list',
    jsonLd: JSON.stringify(READING_LIST_JSON_LD),
  });

  useEffect(() => {
    const section = window.location.hash.slice(1);
    if (!['books', 'essays', 'shelf-top'].includes(section)) {
      window.scrollTo(0, 0);
      return;
    }
    let cancelled = false;
    let frame;
    Promise.resolve(document.fonts?.ready).then(() => {
      if (!cancelled) frame = requestAnimationFrame(() => scrollToSection(section, { focus: true, behavior: 'instant' }));
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <PageWrapper>
      <Navigation />
      <ContentWrapper>
        <Container>
          <BackLink to="/#blog"><FaArrowLeft aria-hidden="true" /> Back to Writings</BackLink>
          <Article>
            <Header id="shelf-top">
              <Title>From My Shelf</Title>
              <Subtitle>Books and essays that shaped how I think.</Subtitle>
              <Index aria-label="Shelf collections">
                <a href="#books">Books <span>{BOOKS.length}</span></a>
                <a href="#essays">Essays <span>{ESSAYS.length}</span></a>
              </Index>
            </Header>
            <Collection id="books" aria-labelledby="books-heading">
              <CollectionHeading>
                <h2 id="books-heading">Books</h2>
                <p>{BOOKS.length} on the shelf</p>
              </CollectionHeading>
              <BookList aria-label="Books">
                {BOOKS.map((book, index) => (
                  <BookItem key={book.title}>
                    <Number aria-hidden="true">{String(index + 1).padStart(2, '0')}</Number>
                    <ItemTitle>{book.title}</ItemTitle>
                    <By>{book.author}</By>
                    <Note>{book.note}</Note>
                  </BookItem>
                ))}
              </BookList>
            </Collection>
            <Collection id="essays" aria-labelledby="essays-heading">
              <CollectionHeading>
                <h2 id="essays-heading">Essays</h2>
                <p>{ESSAYS.length} worth your time</p>
              </CollectionHeading>
              <EssayList aria-label="Essays">
                {ESSAYS.map((essay) => (
                  <li key={essay.title}>
                    <ItemTitle>
                      <ReadingLink href={essay.url} target="_blank" rel="noopener noreferrer">
                        {essay.title}<FaArrowUpRightFromSquare aria-hidden="true" />
                      </ReadingLink>
                    </ItemTitle>
                    <By>{essay.author}</By>
                    <Note>{essay.note}</Note>
                    <Source>{new URL(essay.url).hostname.replace(/^www\./, '')}</Source>
                  </li>
                ))}
              </EssayList>
            </Collection>
            <End>
              <BackLink to="/#blog"><FaArrowLeft aria-hidden="true" /> Writings</BackLink>
              <BackLink as="a" href="#shelf-top">Back to top <FaArrowUp aria-hidden="true" /></BackLink>
            </End>
          </Article>
        </Container>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ReadingListPage;
