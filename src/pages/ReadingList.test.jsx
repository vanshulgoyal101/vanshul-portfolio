import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadingListPage from './ReadingList';
import { SHELF_ITEMS } from '../constants/books';

describe('ReadingList page', () => {
  it('renders every shelf item with its author and a back link', () => {
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

  it('lists all shelf items from the shared data', () => {
    render(
      <MemoryRouter>
        <ReadingListPage />
      </MemoryRouter>
    );
    SHELF_ITEMS.forEach((book) => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    });
  });

  it('links essays to their original sources', () => {
    render(
      <MemoryRouter>
        <ReadingListPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Machines of Loving Grace' })).toHaveAttribute('href', 'https://darioamodei.com/essay/machines-of-loving-grace');
    expect(screen.getByRole('link', { name: 'Why Are Rivers So Mathematical?' })).toHaveAttribute('target', '_blank');
  });
});
