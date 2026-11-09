import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, renderHook, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './index';

// framer-motion is mocked globally in src/test/setup.js so AnimatePresence
// removes elements immediately (its real exit animations keep nodes mounted).

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;

describe('useToast', () => {
  it('throws when used outside of a ToastProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within ToastProvider'
    );
    spy.mockRestore();
  });

  it('exposes the toast API when wrapped', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    expect(typeof result.current.showSuccess).toBe('function');
    expect(typeof result.current.showError).toBe('function');
    expect(typeof result.current.showInfo).toBe('function');
    expect(typeof result.current.removeToast).toBe('function');
  });
});

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Pending auto-dismiss timers remove toasts, which is a state update.
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('renders its children', () => {
    render(
      <ToastProvider>
        <div>child content</div>
      </ToastProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('shows a success toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showSuccess('Done', 'It worked');
    });
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('It worked')).toBeInTheDocument();
  });

  it('shows an error toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showError('Failed', 'Something broke');
    });
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('shows an info toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showInfo('Note', 'Just so you know');
    });
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('returns a unique id from each show call', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    let id1, id2;
    act(() => {
      id1 = result.current.showInfo('A');
      id2 = result.current.showInfo('B');
    });
    expect(id1).not.toBe(id2);
  });

  it('auto-dismisses a toast after its duration', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showSuccess('Temp', 'Gone soon', 1000);
    });
    expect(screen.getByText('Temp')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Temp')).not.toBeInTheDocument();
  });

  it('does not auto-dismiss when duration is zero', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showInfo('Persistent', 'Stays', 0);
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText('Persistent')).toBeInTheDocument();
  });

  it('removes a toast via removeToast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    let id;
    act(() => {
      id = result.current.showInfo('RemoveMe', 'body', 0);
    });
    expect(screen.getByText('RemoveMe')).toBeInTheDocument();
    act(() => {
      result.current.removeToast(id);
    });
    expect(screen.queryByText('RemoveMe')).not.toBeInTheDocument();
  });

  it('supports multiple simultaneous toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showInfo('One', 'a', 0);
      result.current.showInfo('Two', 'b', 0);
      result.current.showInfo('Three', 'c', 0);
    });
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('announces toasts from a live region that exists before any toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    const region = document.querySelector('[aria-live="polite"]');
    expect(region).toBeInTheDocument();
    expect(region).toBeEmptyDOMElement();
    act(() => {
      result.current.showSuccess('Message sent!', "I'll reply soon.");
    });
    expect(region).toContainElement(screen.getByText('Message sent!'));
    expect(region).toContainElement(screen.getByText("I'll reply soon."));
  });

  it('keeps toast titles out of the page heading outline', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showError('Failed', 'Something broke');
    });
    expect(screen.queryAllByRole('heading')).toHaveLength(0);
  });

  it('closes a toast from its close button', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.showInfo('Closable', 'body', 0);
    });
    const close = screen.getByRole('button', { name: 'Close notification' });
    expect(close).toHaveAttribute('type', 'button');
    fireEvent.click(close);
    expect(screen.queryByText('Closable')).not.toBeInTheDocument();
  });
});
