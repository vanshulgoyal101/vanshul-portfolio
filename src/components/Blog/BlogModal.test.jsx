import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogModal from './BlogModal';

const blog = {
  id: 1,
  title: 'Sample Post',
  date: 'Jan 1, 2024',
  readTime: '5 min read',
  content: 'This is the **body** of the post.\n\nSecond paragraph.',
  slug: 'sample-post',
};

describe('BlogModal', () => {
  it('renders nothing when blog is null', () => {
    const { container } = render(<BlogModal blog={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the blog title in the modal', () => {
    render(<BlogModal blog={blog} onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Sample Post' })).toBeInTheDocument();
  });

  it('renders the date and read time', () => {
    render(<BlogModal blog={blog} onClose={vi.fn()} />);
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it('renders the markdown body content', () => {
    render(<BlogModal blog={blog} onClose={vi.fn()} />);
    expect(screen.getByText('body')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
  });

  it('is exposed as a modal dialog', () => {
    render(<BlogModal blog={blog} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<BlogModal blog={blog} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the overlay is clicked', () => {
    const onClose = vi.fn();
    render(<BlogModal blog={blog} onClose={onClose} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<BlogModal blog={blog} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose for other keys', () => {
    const onClose = vi.fn();
    render(<BlogModal blog={blog} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and restores it on unmount', () => {
    const { unmount } = render(<BlogModal blog={blog} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
