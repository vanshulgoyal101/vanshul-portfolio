import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
import { BOOKS, ESSAYS } from '../../constants/books';
import { READING_LIST_PATH } from '../../constants/routes';

// The one dark surface on the page: an ink banner that sends readers to the
// shelf. Text colours are chosen for contrast on ink, not on paper.
const Banner = styled(Link)`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem 3rem;
  align-items: center;
  padding: clamp(1.5rem, 3.5vw, 2.25rem) clamp(1.5rem, 4vw, 2.75rem);
  overflow: hidden;
  color: #f8fafc;
  text-decoration: none;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(59, 130, 246, 0.28) 0%, transparent 55%),
    var(--color-ink);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) ease;

  &:hover {
    transform: translateY(-3px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #93c5fd;
`;

const Title = styled.h3`
  margin-bottom: 0.375rem;
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  letter-spacing: -0.03em;
  color: #ffffff;
`;

const Summary = styled.p`
  font-size: 1rem;
  color: rgba(248, 250, 252, 0.78);
`;

const Side = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 2rem;
`;

const Collections = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.9375rem;
  color: rgba(248, 250, 252, 0.78);

  strong {
    margin-right: 0.375rem;
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
  }
`;

const Explore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-ink);
  background: #ffffff;
  border-radius: var(--radius-pill);

  svg {
    transition: transform var(--duration-fast) var(--ease-out);
  }

  ${Banner}:hover & svg {
    transform: translateX(4px);
  }
`;

const ReadingList = () => (
  <Banner to={READING_LIST_PATH} aria-label="Reading list: From My Shelf">
    <div>
      <Label>
        <FaBookOpen aria-hidden="true" /> Reading list
      </Label>
      <Title>From My Shelf</Title>
      <Summary>Books and essays that shaped how I think.</Summary>
    </div>
    <Side>
      <Collections>
        <span><strong>{BOOKS.length}</strong> Books</span>
        <span><strong>{ESSAYS.length}</strong> Essays</span>
      </Collections>
      <Explore>
        Explore the shelf <HiArrowRight aria-hidden="true" />
      </Explore>
    </Side>
  </Banner>
);

export default ReadingList;
