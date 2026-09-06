import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReadingListPage from './ReadingList';
import { BOOKS, ESSAYS, SHELF_ITEMS } from '../constants/books';

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
    expect(screen.getByRole('link', { name: /back to writings/i })).toHaveAttribute('href', '/#blog');
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

  it('keeps complete, separately labelled book and essay collections', () => {
    render(<MemoryRouter><ReadingListPage /></MemoryRouter>);
    const books = screen.getByRole('region', { name: 'Books' });
    const essays = screen.getByRole('region', { name: 'Essays' });
    expect(within(books).getAllByRole('listitem')).toHaveLength(BOOKS.length);
    expect(within(essays).getAllByRole('listitem')).toHaveLength(ESSAYS.length);
    expect(within(books).getByText(`${BOOKS.length} on the shelf`)).toBeInTheDocument();
    expect(within(essays).getByText(`${ESSAYS.length} worth your time`)).toBeInTheDocument();
    BOOKS.forEach((book) => {
      expect(within(books).getByRole('heading', { name: book.title })).toBeInTheDocument();
      expect(within(essays).queryByText(book.title)).not.toBeInTheDocument();
    });
    ESSAYS.forEach((essay) => {
      expect(within(essays).getByRole('link', { name: essay.title })).toHaveAttribute('href', essay.url);
      expect(within(essays).getByRole('link', { name: essay.title })).toHaveAttribute('rel', 'noopener noreferrer');
      expect(within(books).queryByText(essay.title)).not.toBeInTheDocument();
    });
    const index = screen.getByRole('navigation', { name: 'Shelf collections' });
    expect(within(index).getByRole('link', { name: `Books ${BOOKS.length}` })).toHaveAttribute('href', '#books');
    expect(within(index).getByRole('link', { name: `Essays ${ESSAYS.length}` })).toHaveAttribute('href', '#essays');
  });
});
