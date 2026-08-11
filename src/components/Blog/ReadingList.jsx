import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaBookOpen } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';
import { BOOKS } from '../../constants/books';

// Mirrors BlogCard so the "From My Shelf" entry looks and behaves exactly like a
// blog card: a link that navigates to a dedicated page (/reading-list).
const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 16px;

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 4px;
  }
`;

const Card = styled(motion.article)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 320px;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba(29, 78, 216, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(29, 78, 216, 0.08);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin-bottom: var(--spacing-sm);
  font-size: 0.78rem;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  svg {
    flex-shrink: 0;
    font-size: 0.95em;
    opacity: 0.85;
    color: var(--color-accent-primary);
  }
`;

const Title = styled.h3`
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
`;

const Summary = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
`;

const Spacer = styled.div`
  flex: 1;
`;

const ReadMore = styled.span`
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

const ReadingList = ({ variants }) => (
  <CardLink to="/reading-list" aria-label="Reading list: From My Shelf">
    <Card
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ scale: 1.02 }}
      role="article"
    >
      <Meta>
        <span>
          <FaBookOpen aria-hidden="true" /> Reading list
        </span>
        <span>{BOOKS.length} books</span>
      </Meta>
      <Title>From My Shelf</Title>
      <Summary>Books that shaped how I think — fiction and non-fiction alike.</Summary>
      <Spacer />
      <ReadMore>
        Read More <MdArrowForward />
      </ReadMore>
    </Card>
  </CardLink>
);

ReadingList.propTypes = {
  variants: PropTypes.object,
};

export default ReadingList;
