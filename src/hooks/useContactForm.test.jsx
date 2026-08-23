import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useContactForm } from './useContactForm';
import { ToastProvider } from '../components/Toast';

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;

const renderContactForm = (initial) =>
  renderHook(() => useContactForm(initial), { wrapper });

const changeEvent = (name, value) => ({
  preventDefault: vi.fn(),
  target: { name, value },
});

describe('useContactForm', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with the default empty state', () => {
    const { result } = renderContactForm();
    expect(result.current.formState).toEqual({ name: '', email: '', message: '' });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.emailError).toBe('');
  });

  it('accepts a custom initial state', () => {
    const initial = { name: 'Ada', email: 'ada@example.com', message: 'Hi' };
    const { result } = renderContactForm(initial);
    expect(result.current.formState).toEqual(initial);
  });

  it('updates a field on change', () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('name', 'Grace')));
    expect(result.current.formState.name).toBe('Grace');
  });

  it('flags an invalid email', () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('email', 'not-an-email')));
    expect(result.current.emailError).toBe('Please enter a valid email address.');
  });

  it('clears the email error for a valid email', () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('email', 'bad')));
    expect(result.current.emailError).not.toBe('');
    act(() => result.current.handleChange(changeEvent('email', 'good@example.com')));
    expect(result.current.emailError).toBe('');
  });

  it('does not flag an empty email as invalid', () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('email', '')));
    expect(result.current.emailError).toBe('');
  });

  it('rejects emails without a domain', () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('email', 'user@domain')));
    expect(result.current.emailError).toBe('Please enter a valid email address.');
  });

  it('does not submit when there is an email error', async () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('email', 'invalid')));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits successfully and resets the form', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    const { result } = renderContactForm();

    act(() => result.current.handleChange(changeEvent('name', 'Grace')));
    act(() => result.current.handleChange(changeEvent('email', 'grace@example.com')));
    act(() => result.current.handleChange(changeEvent('message', 'Hello there')));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('formspree.io');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body);
    expect(body.email).toBe('grace@example.com');
    expect(body._replyto).toBe('grace@example.com');
    expect(body._subject).toContain('Grace');

    await waitFor(() => {
      expect(result.current.formState).toEqual({ name: '', email: '', message: '' });
    });
  });

  it('does not reset the form on a failed (non-ok) response', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    const { result } = renderContactForm();

    act(() => result.current.handleChange(changeEvent('name', 'Grace')));
    act(() => result.current.handleChange(changeEvent('email', 'grace@example.com')));
    act(() => result.current.handleChange(changeEvent('message', 'Hello there')));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    expect(result.current.formState.name).toBe('Grace');
  });

  it('handles a network error without throwing', async () => {
    global.fetch.mockRejectedValueOnce(new Error('network down'));
    const { result } = renderContactForm();

    act(() => result.current.handleChange(changeEvent('name', 'Grace')));
    act(() => result.current.handleChange(changeEvent('email', 'grace@example.com')));
    act(() => result.current.handleChange(changeEvent('message', 'Hi')));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('calls preventDefault on submit', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    const { result } = renderContactForm();
    const preventDefault = vi.fn();
    await act(async () => {
      await result.current.handleSubmit({ preventDefault });
    });
    expect(preventDefault).toHaveBeenCalled();
  });

  it('resets isSubmitting to false after success', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('name', 'Grace')));
    act(() => result.current.handleChange(changeEvent('email', 'grace@example.com')));
    act(() => result.current.handleChange(changeEvent('message', 'Hi there')));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('blocks submit and flags every empty required field', async () => {
    const { result } = renderContactForm();
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.message).toBeTruthy();
  });

  it('treats whitespace-only fields as empty', async () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('name', '   ')));
    act(() => result.current.handleChange(changeEvent('email', 'grace@example.com')));
    act(() => result.current.handleChange(changeEvent('message', '   ')));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.errors.message).toBeTruthy();
  });

  it('exposes emailError as an alias of errors.email', () => {
    const { result } = renderContactForm();
    act(() => result.current.handleChange(changeEvent('email', 'bad')));
    expect(result.current.emailError).toBe(result.current.errors.email);
    expect(result.current.emailError).toBe('Please enter a valid email address.');
  });
});
