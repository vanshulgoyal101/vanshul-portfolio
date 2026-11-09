import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const Boom = () => {
  throw new Error('kaboom');
};

const Safe = () => <div>safe content</div>;

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Safe />
      </ErrorBoundary>
    );
    expect(screen.getByText('safe content')).toBeInTheDocument();
  });

  it('renders the fallback UI when a child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Something went wrong here' })).toBeInTheDocument();
    expect(
      screen.getByText('This section failed to load. Please try reloading the page.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload Page' })).toHaveAttribute('type', 'button');
  });

  it('logs the caught error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(spy).toHaveBeenCalled();
  });

  it('allows an optional scene to fail without replacing surrounding content', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <>
        <Safe />
        <ErrorBoundary fallback={null}><Boom /></ErrorBoundary>
      </>
    );
    expect(screen.getByText('safe content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong here')).toBeNull();
  });

  it('retries its children when the reset key changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<ErrorBoundary resetKey="/a"><Boom /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong here')).toBeInTheDocument();

    rerender(<ErrorBoundary resetKey="/a"><Safe /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong here')).toBeInTheDocument();

    rerender(<ErrorBoundary resetKey="/b"><Safe /></ErrorBoundary>);
    expect(screen.getByText('safe content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong here')).toBeNull();
  });

  it('shows a reload button that triggers window.location.reload', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
    expect(reload).toHaveBeenCalled();
  });
});
