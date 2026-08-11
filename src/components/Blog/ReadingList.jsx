import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBookOpen } from 'react-icons/fa';
import { BLOG_ANIMATION_VARIANTS } from '../../constants/blogConstants';

// A small, hand-picked shelf. `cover` is a genre glyph used as a stand-in for
// the book cover so the section stays image-free and fast.
const BOOKS = [
  {
    cover: '📈',
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    note: 'A distilled playbook on building wealth and staying happy through leverage, judgement and clear thinking.',
  },
  {
    cover: '🌌',
    title: 'Exhalation',
    author: 'Ted Chiang',
    note: 'Luminous short stories that turn physics and free will into deeply human questions.',
  },
  {
    cover: '🤖',
    title: 'The Lifecycle of Software Objects',
    author: 'Ted Chiang',
    note: 'A tender novella about raising digital beings — and what we owe the minds we create.',
  },
  {
    cover: '🕊️',
    title: 'The Prophet',
    author: 'Kahlil Gibran',
    note: 'Poetic meditations on love, work and freedom that read like scripture for everyday life.',
  },
  {
    cover: '🏜️',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    note: "A shepherd's journey that became the classic parable for following your Personal Legend.",
  },
  {
    cover: '⚡',
    title: 'Harry Potter (series)',
    author: 'J.K. Rowling',
    note: 'The comfort epic: friendship, courage and growing up under a sky full of magic.',
  },
  {
    cover: '🪐',
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    note: 'First contact told with staggering scope, where physics itself becomes the antagonist.',
  },
  {
    cover: '🗡️',
    title: 'Macbeth',
    author: 'William Shakespeare',
    note: "Ambition curdles into paranoia in Shakespeare's tightest, darkest tragedy.",
  },
  {
    cover: '🌍',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    note: 'A sweeping story of how shared fictions let one species take over the planet.',
  },
  {
    cover: '👁️',
    title: '1984',
    author: 'George Orwell',
    note: 'The definitive warning about surveillance, language and truth bent to power.',
  },
  {
    cover: '🎯',
    title: '80,000 Hours',
    author: 'Benjamin Todd',
    note: 'A practical guide to spending your career — your ~80,000 working hours — doing the most good.',
  },
  {
    cover: '🏛️',
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    note: '366 short readings that turn Stoic wisdom into a daily habit.',
  },
];

const Section = styled.div`
  margin-top: var(--spacing-2xl);
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);

  svg {
    color: var(--color-accent-primary);
  }

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const Subtitle = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  max-width: 560px;
  margin: 0 auto;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Book = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent-primary);
  border-radius: 12px;
  transition: transform 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent-primary);
  }
`;

const Cover = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 10px;
`;

const Info = styled.div`
  min-width: 0;
`;

const BookTitle = styled.p`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
`;

const Author = styled.p`
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
`;

const Note = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
`;

const ReadingList = () => (
  <Section>
    <Header
      variants={BLOG_ANIMATION_VARIANTS.item}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Title>
        <FaBookOpen /> From My Shelf
      </Title>
      <Subtitle>A few books that shaped how I think — fiction and non-fiction alike.</Subtitle>
    </Header>

    <Grid
      variants={BLOG_ANIMATION_VARIANTS.container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {BOOKS.map((book) => (
        <Book key={book.title} variants={BLOG_ANIMATION_VARIANTS.item}>
          <Cover aria-hidden="true">{book.cover}</Cover>
          <Info>
            <BookTitle>{book.title}</BookTitle>
            <Author>{book.author}</Author>
            <Note>{book.note}</Note>
          </Info>
        </Book>
      ))}
    </Grid>
  </Section>
);

export default ReadingList;
