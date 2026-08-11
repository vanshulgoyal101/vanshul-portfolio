import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadingList from './ReadingList';
import { BOOKS } from '../../constants/books';

const renderCard = () =>
  render(
    <MemoryRouter>
      <ReadingList variants={{}} />
    </MemoryRouter>
  );

describe('ReadingList card', () => {
  it('is a link to the /reading-list page, like a blog card', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /reading list/i });
    expect(link).toHaveAttribute('href', '/reading-list');
    expect(screen.getByText('From My Shelf')).toBeInTheDocument();
    expect(screen.getByText(`${BOOKS.length} books`)).toBeInTheDocument();
    expect(screen.getByText(/read more/i)).toBeInTheDocument();
  });

  it('does not list the books on the card itself', () => {
    renderCard();
    expect(screen.queryByText('Sapiens')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
