import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BLOG_ANIMATION_VARIANTS } from '../../constants/blogConstants';

// A small, hand-picked shelf — image-free by design so the section stays fast
// and reads like a curated index rather than a store listing.
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

const Section = styled.div`
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--color-border);
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const Eyebrow = styled.span`
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-sm);
`;

const Title = styled.h3`
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);

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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Book = styled(motion.article)`
  position: relative;
  padding: var(--spacing-lg);
  padding-left: calc(var(--spacing-lg) + 8px);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  /* book-spine accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    background: var(--color-accent-primary);
    opacity: 0.85;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-accent-primary);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
  }
`;

const BookTitle = styled.h4`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
`;

const Author = styled.p`
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 8px 0 var(--spacing-sm);
`;

const Note = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.65;
`;

const ReadingList = () => (
  <Section>
    <Header
      variants={BLOG_ANIMATION_VARIANTS.item}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Eyebrow>Reading List</Eyebrow>
      <Title>From My Shelf</Title>
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
          <BookTitle>{book.title}</BookTitle>
          <Author>{book.author}</Author>
          <Note>{book.note}</Note>
        </Book>
      ))}
    </Grid>
  </Section>
);

export default ReadingList;
