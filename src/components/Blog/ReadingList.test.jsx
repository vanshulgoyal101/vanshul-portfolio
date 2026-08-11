import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReadingList from './ReadingList';

describe('ReadingList', () => {
  it('renders a compact card and hides the books until opened', () => {
    render(<ReadingList />);
    expect(
      screen.getByRole('button', { name: /open .*favourite books/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Sapiens')).not.toBeInTheDocument();
  });

  it('opens a modal listing the books and closes it again', async () => {
    const user = userEvent.setup();
    render(<ReadingList />);

    await user.click(screen.getByRole('button', { name: /favourite books/i }));

    const dialog = screen.getByRole('dialog', { name: /from my shelf/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Sapiens')).toBeInTheDocument();
    expect(screen.getByText('The Almanack of Naval Ravikant')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
  });
});
