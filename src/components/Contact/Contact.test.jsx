import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from './Contact';
import { ToastProvider } from '../Toast';

const renderContact = () => render(<ToastProvider><Contact /></ToastProvider>);

describe('Contact', () => {
  // Reassign fetch per test. We intentionally do NOT call vi.restoreAllMocks()
  // here — it would reset the shared window.matchMedia mock from setup.js and
  // break matchMedia-dependent children (Magnetic) on subsequent renders.
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });

  it('renders the labelled form fields and submit button', () => {
    renderContact();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  it('updates field values as the user types', () => {
    renderContact();
    const name = screen.getByLabelText('Your Name');
    fireEvent.change(name, { target: { value: 'Ada Lovelace' } });
    expect(name).toHaveValue('Ada Lovelace');
  });

  it('shows a validation error for an invalid email', () => {
    renderContact();
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'not-an-email' } });
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('clears the email error once a valid email is entered', () => {
    renderContact();
    const email = screen.getByLabelText('Email Address');
    fireEvent.change(email, { target: { value: 'bad' } });
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    fireEvent.change(email, { target: { value: 'ada@example.com' } });
    expect(screen.queryByText('Please enter a valid email address.')).not.toBeInTheDocument();
  });

  it('submits the completed form', async () => {
    renderContact();
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there, nice work.' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('takes focus to the first invalid field and ties each error to its field', () => {
    renderContact();
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    const name = screen.getByLabelText('Your Name');
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Please enter your name.');
    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('Please enter a message.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('focuses the email field when it is the only problem', () => {
    renderContact();
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'ada@' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there.' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(screen.getByLabelText('Email Address')).toHaveFocus();
    expect(screen.getByLabelText('Your Name')).not.toHaveAttribute('aria-invalid');
  });

  it('exposes accessible social links', () => {
    const { container } = renderContact();
    expect(container.querySelectorAll('a[aria-label]').length).toBeGreaterThan(0);
  });
});
