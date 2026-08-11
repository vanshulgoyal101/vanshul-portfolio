import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaTimes } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';
import { BLOG_ANIMATION_VARIANTS } from '../../constants/blogConstants';

// A compact blog-sized card; the full list is revealed in a modal on open.
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

/* ── Card (same footprint as a blog card) ── */
const Card = styled(motion.button)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  min-height: 320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);

  svg {
    color: var(--color-accent-primary);
    font-size: 0.95em;
  }
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  line-height: 1.4;
  margin-bottom: var(--spacing-sm);
`;

const Summary = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Action = styled.span`
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);

  svg {
    transition: transform 0.3s ease;
  }

  ${Card}:hover & svg {
    transform: translateX(5px);
  }
`;

/* ── Modal ── */
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const Content = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  max-width: 760px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    max-height: 100vh;
    border-radius: 20px 20px 0 0;
  }
`;

const ModalHeader = styled.div`
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-bg-card);
  z-index: 10;
`;

const ModalTitle = styled.h2`
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  padding-right: var(--spacing-2xl);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);

  svg {
    color: var(--color-accent-primary);
    font-size: 0.8em;
  }

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const ModalSub = styled.p`
  margin-top: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-xl);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-accent-primary);
  }
`;

const ModalBody = styled.div`
  padding: var(--spacing-xl);
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const ReadingList = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <Card
        type="button"
        onClick={() => setOpen(true)}
        variants={BLOG_ANIMATION_VARIANTS.item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        aria-label={`From My Shelf — open ${BOOKS.length} favourite books`}
      >
        <Eyebrow>
          <FaBookOpen aria-hidden="true" /> Reading list
        </Eyebrow>
        <Title>From My Shelf</Title>
        <Summary>A few books that shaped how I think — fiction and non-fiction alike.</Summary>
        <Spacer />
        <Action>
          Open the shelf · {BOOKS.length} books <MdArrowForward />
        </Action>
      </Card>

      <AnimatePresence>
        {open && (
          <Overlay
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Content
              role="dialog"
              aria-modal="true"
              aria-label="From My Shelf"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  <FaBookOpen aria-hidden="true" /> From My Shelf
                </ModalTitle>
                <ModalSub>{BOOKS.length} books that shaped how I think.</ModalSub>
                <CloseButton onClick={() => setOpen(false)} aria-label="Close">
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
            </Content>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReadingList;
