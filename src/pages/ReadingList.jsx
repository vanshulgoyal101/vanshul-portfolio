import { useEffect } from 'react';
import styled from 'styled-components';
import { HiArrowLeft, HiArrowUp } from 'react-icons/hi';
import { HiArrowUpRight } from 'react-icons/hi2';

import PageLayout from '../components/ui/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { TextLink } from '../components/ui/Button';
import { BOOKS, ESSAYS } from '../constants/books';
import { READING_LIST_DESCRIPTION, READING_LIST_JSON_LD } from '../constants/readingListSeo';
import { useSeo } from '../hooks/useSeo';
import { READING_LIST_PATH, homeSectionPath } from '../constants/routes';
import { scrollToSection } from '../utils/scrollToSection';

const Back = styled(TextLink)`
  margin-bottom: 1.5rem;
`;

const Article = styled.article`
  overflow-wrap: anywhere;
`;

const Index = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0 1.25rem;
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius-pill);
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-ink);
    text-decoration: none;

    &:hover {
      border-color: var(--color-ink);
      background: var(--color-bg-card);
    }
  }

  span {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
`;

const Collection = styled.section`
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 2rem;
  padding: 2.5rem 0 3rem;
  border-top: 1px solid var(--color-ink);
  scroll-margin-top: 110px;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
    padding: 2rem 0 2.5rem;
  }
`;

const CollectionHeading = styled.div`
  h2 {
    font-size: 1.5rem;
    line-height: 1.2;
  }

  p {
    margin-top: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
`;

const BookList = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.25rem 2.5rem;
  list-style: none;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
`;

const BookItem = styled.li`
  min-width: 0;
`;

const Number = styled.span`
  display: block;
  margin-bottom: 0.625rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent-primary);
`;

const ItemTitle = styled.h3`
  font-size: 1.125rem;
  line-height: 1.35;
  letter-spacing: -0.01em;
`;

const ReadingLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: inherit;
  text-decoration: none;

  svg {
    flex-shrink: 0;
    color: var(--color-text-muted);
    transition:
      color var(--duration-fast) ease,
      transform var(--duration-fast) var(--ease-out);
  }

  &:hover {
    color: var(--color-accent-primary);

    svg {
      color: var(--color-accent-primary);
      transform: translate(2px, -2px);
    }
  }
`;

const By = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const EssayList = styled.ol`
  list-style: none;

  li {
    padding: 1.25rem 0;
  }

  li:first-child {
    padding-top: 0;
  }

  li + li {
    border-top: 1px solid var(--color-hairline);
  }
`;

const Source = styled.span`
  display: block;
  margin-top: 0.625rem;
  font: 0.75rem/1.6 var(--font-mono);
  color: var(--color-text-muted);
`;

const Note = styled.p`
  max-width: 65ch;
  margin-top: 0.625rem;
  font-size: 0.9375rem;
  line-height: 1.7;
`;

const End = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-hairline);
`;

const ReadingListPage = () => {
  useSeo({
    title: 'Reading List — Vanshul Goyal',
    description: READING_LIST_DESCRIPTION,
    path: READING_LIST_PATH,
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
    <PageLayout>
      <Back to={homeSectionPath('blog')}>
        <HiArrowLeft aria-hidden="true" data-arrow="back" /> Back to Writings
      </Back>
      <Article>
        <PageHeader id="shelf-top" label="Reading list" title="From My Shelf" lede="Books and essays that shaped how I think.">
          <Index aria-label="Shelf collections">
            <a href="#books">Books <span>{BOOKS.length}</span></a>
            <a href="#essays">Essays <span>{ESSAYS.length}</span></a>
          </Index>
        </PageHeader>
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
                    {essay.title}
                    <HiArrowUpRight aria-hidden="true" />
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
          <TextLink to={homeSectionPath('blog')}>
            <HiArrowLeft aria-hidden="true" data-arrow="back" /> Writings
          </TextLink>
          <TextLink as="a" href="#shelf-top">
            Back to top <HiArrowUp aria-hidden="true" data-arrow="up" />
          </TextLink>
        </End>
      </Article>
    </PageLayout>
  );
};

export default ReadingListPage;
