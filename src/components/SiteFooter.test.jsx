import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SiteFooter from './SiteFooter';

const renderFooter = (props = {}) => render(
  <MemoryRouter>
    <SiteFooter ambientEnabled={false} reducedMotion={false} onAmbientChange={vi.fn()} {...props} />
  </MemoryRouter>,
);

describe('SiteFooter', () => {
  it('separates identity, navigation, and collapsed display settings', () => {
    const { container } = renderFooter();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Footer links' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: 'Vanshul Goyal' })).toHaveAttribute('href', '/#home');
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });

  it('changes ambient motion through a labelled switch', () => {
    const onAmbientChange = vi.fn();
    const { container } = renderFooter({ onAmbientChange });
    container.querySelector('details').open = true;
    fireEvent.click(screen.getByRole('switch', { name: 'Ambient motion' }));
    expect(onAmbientChange).toHaveBeenCalledWith(true);
  });

  it('keeps ambient motion off when reduced motion is requested', () => {
    const { container } = renderFooter({ ambientEnabled: true, reducedMotion: true });
    container.querySelector('details').open = true;
    const toggle = screen.getByRole('switch', { name: 'Ambient motion' });
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
  });
});