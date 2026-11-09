import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RouteError from './RouteError';
import { RETRY_KEY } from '../utils/routeRetry';

const originalLocation = Object.getOwnPropertyDescriptor(window, 'location');
let reload;

const renderError = () => render(<MemoryRouter><RouteError /></MemoryRouter>);

describe('RouteError', () => {
  beforeEach(() => {
    reload = vi.fn();
    Object.defineProperty(window, 'location', { configurable: true, value: { ...window.location, reload } });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', originalLocation);
    sessionStorage.clear();
  });

  it('keeps the site navigation and offers a reload and a way home', () => {
    sessionStorage.setItem(RETRY_KEY, String(Date.now()));
    renderError();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: "This page didn't load" })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');

    const button = screen.getByRole('button', { name: 'Reload page' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads once on its own to pick up a new release', () => {
    renderError();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(RETRY_KEY)).not.toBeNull();
  });

  it('stays put when it already reloaded moments ago', () => {
    sessionStorage.setItem(RETRY_KEY, String(Date.now()));
    renderError();
    expect(reload).not.toHaveBeenCalled();
  });
});
