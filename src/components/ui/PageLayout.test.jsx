import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageLayout from './PageLayout';

describe('PageLayout', () => {
  it('renders the site navigation and one main landmark holding the page', () => {
    render(
      <MemoryRouter initialEntries={['/blog/']}>
        <PageLayout width="reading">
          <p>Page body</p>
        </PageLayout>
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveTextContent('Page body');
  });
});
