import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadingListPage from './ReadingList';
import { BOOKS } from '../constants/books';

describe('ReadingList page', () => {
  it('renders every book with its author and a back link', () => {
    render(
      <MemoryRouter>
        <ReadingListPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /from my shelf/i })).toBeInTheDocument();
    expect(screen.getByText('Sapiens')).toBeInTheDocument();
    expect(screen.getByText('The Almanack of Naval Ravikant')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to blog/i })).toBeInTheDocument();
    expect(document.title).toMatch(/reading list/i);
  });

  it('lists all books from the shared data', () => {
    render(
      <MemoryRouter>
        <ReadingListPage />
      </MemoryRouter>
    );
    BOOKS.forEach((book) => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
  });
});
