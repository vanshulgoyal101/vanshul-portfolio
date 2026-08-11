import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBookOpen } from 'react-icons/fa';
import { BLOG_ANIMATION_VARIANTS } from '../../constants/blogConstants';

// A single "shelf" card that sits first in the blog grid — all the books live
// inside it as a two-column list, image-free by design so it stays fast.
const BOOKS = [
  {
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    note: "Wealth, health and peace aren't luck — they're skills. The closest thing to a manual for all three.",
  },
  {
    title: 'Exhalation',
    author: 'Ted Chiang',
    note: 'Science fiction for people who actually think. Each story is a quiet thought experiment that rearranges you.',
  },
  {
    title: 'The Lifecycle of Software Objects',
    author: 'Ted Chiang',
    note: 'What do we owe the minds we build? Chiang takes his time, and the question stays with you for years.',
  },
  {
    title: 'The Prophet',
    author: 'Kahlil Gibran',
    note: 'Old wisdom in plain clothes. Read one page, close the book, and think for an hour.',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    note: 'One simple idea that is hard to live: commit fully, and the world starts conspiring to help you.',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    note: "Every regret is a door to a life you didn't live. The work is learning to close them and stay.",
  },
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    note: "Not really about magic. It's about choosing your people and being brave when it's inconvenient.",
  },
  {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    note: 'Physics as horror. It keeps stretching your sense of scale until the present feels small.',
  },
  {
    title: 'Macbeth',
    author: 'William Shakespeare',
    note: 'Ambition with no floor. A good man talks himself into ruin, one rationalisation at a time.',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    note: "We run the planet because we can believe in things that don't exist — money, nations, gods, all stories.",
  },
  {
    title: '1984',
    author: 'George Orwell',
    note: 'Control the words and you control the thoughts. Worth rereading whenever you feel too comfortable.',
  },
  {
    title: '80,000 Hours',
    author: 'Benjamin Todd',
    note: "You'll work about 80,000 hours in a life. Spend them like they matter, because they do.",
  },
  {
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    note: 'One page a day. Not to sound wise — to actually be a little calmer tomorrow.',
  },
];

// Spans the full width of the blog grid so it reads as the first ("zeroth") entry.
const Card = styled(motion.article)`
  grid-column: 1 / -1;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);

  svg {
    color: var(--color-accent-primary);
    font-size: 1.1rem;
  }
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  color: var(--color-text-primary);
`;

const Count = styled.span`
  margin-left: auto;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-accent-primary);
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
`;

const Subtitle = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  columns: 2;
  column-gap: var(--spacing-2xl);

  @media (max-width: 640px) {
    columns: 1;
  }
`;

const Item = styled.li`
  break-inside: avoid;
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--color-border);

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

const BookLine = styled.p`
  font-size: var(--text-base);
  line-height: 1.4;
  color: var(--color-text-primary);
`;

const BookName = styled.span`
  font-weight: 600;
`;

const By = styled.span`
  color: var(--color-text-muted);
`;

const Note = styled.p`
  margin-top: 2px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
`;

const ReadingList = () => (
  <Card
    variants={BLOG_ANIMATION_VARIANTS.item}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    <Header>
      <FaBookOpen aria-hidden="true" />
      <Title>From My Shelf</Title>
      <Count>{BOOKS.length} books</Count>
    </Header>
    <Subtitle>Books that shaped how I think — fiction and non-fiction alike.</Subtitle>
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
  </Card>
);

export default ReadingList;
