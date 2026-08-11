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
    note: 'A distilled playbook on building wealth and staying happy through leverage, judgement and clear thinking.',
  },
  {
    title: 'Exhalation',
    author: 'Ted Chiang',
    note: 'Luminous short stories that turn physics and free will into deeply human questions.',
  },
  {
    title: 'The Lifecycle of Software Objects',
    author: 'Ted Chiang',
    note: 'A tender novella about raising digital beings — and what we owe the minds we create.',
  },
  {
    title: 'The Prophet',
    author: 'Kahlil Gibran',
    note: 'Poetic meditations on love, work and freedom that read like scripture for everyday life.',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    note: "A shepherd's journey that became the classic parable for following your Personal Legend.",
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    note: "A woman slips between life and death to try on the lives she didn't live — a warm fable about regret and possibility.",
  },
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    note: 'The comfort epic: friendship, courage and growing up under a sky full of magic.',
  },
  {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    note: 'First contact told with staggering scope, where physics itself becomes the antagonist.',
  },
  {
    title: 'Macbeth',
    author: 'William Shakespeare',
    note: "Ambition curdles into paranoia in Shakespeare's tightest, darkest tragedy.",
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    note: 'A sweeping story of how shared fictions let one species take over the planet.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    note: 'The definitive warning about surveillance, language and truth bent to power.',
  },
  {
    title: '80,000 Hours',
    author: 'Benjamin Todd',
    note: 'A practical guide to spending your career — your ~80,000 working hours — doing the most good.',
  },
  {
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    note: '366 short readings that turn Stoic wisdom into a daily habit.',
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
