import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Analytics from './Analytics';

describe('Analytics', () => {
  beforeEach(() => vi.stubEnv('VITE_GOATCOUNTER_CODE', ''));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    document.getElementById('goatcounter')?.remove();
    delete window.goatcounter;
    delete window.doNotTrack;
    delete navigator.globalPrivacyControl;
    delete navigator.doNotTrack;
  });

  const Controls = () => {
    const navigate = useNavigate();
    return <>
      <button onClick={() => navigate('/blog?token=secret#private')}>Blog</button>
      <button onClick={() => navigate('/dashboard')}>Private</button>
      <button onClick={() => navigate('/blog#section')}>Hash</button>
    </>;
  };
  const configured = (path = '/') => {
    vi.stubEnv('VITE_GOATCOUNTER_CODE', 'portfolio');
    return render(<MemoryRouter initialEntries={[path]}><Analytics /><Controls /></MemoryRouter>);
  };
  const load = () => {
    window.goatcounter = { count: vi.fn() };
    act(() => document.getElementById('goatcounter')?.dispatchEvent(new Event('load')));
    return window.goatcounter.count;
  };

  it('renders nothing and injects no script when unconfigured', () => {
    const { container } = render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
    expect(document.getElementById('goatcounter')).toBeNull();
  });

  it.each(['/dashboard', '/dashboard/settings', '/Dashboard'])('does not load on private route %s', path => {
    configured(path);
    expect(document.getElementById('goatcounter')).toBeNull();
  });

  it.each(['globalPrivacyControl', 'doNotTrack'])('respects %s before loading', preference => {
    Object.defineProperty(navigator, preference, { configurable: true, value: preference === 'globalPrivacyControl' ? true : '1' });
    configured();
    expect(document.getElementById('goatcounter')).toBeNull();
  });

  it('counts only the latest public pathname after a delayed load', () => {
    configured();
    const script = document.getElementById('goatcounter');
    expect(JSON.parse(script.dataset.goatcounterSettings)).toEqual({ no_onload: true, no_events: true });
    expect(script.referrerPolicy).toBe('no-referrer');
    fireEvent.click(screen.getByText('Blog'));
    const count = load();
    expect(count).toHaveBeenCalledExactlyOnceWith({ path: '/blog', title: '/blog', referrer: '' });
    fireEvent.click(screen.getByText('Hash'));
    expect(count).toHaveBeenCalledTimes(1);
  });

  it('does not count a private route reached before the script loads', () => {
    configured();
    fireEvent.click(screen.getByText('Private'));
    const count = load();
    expect(count).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Blog'));
    expect(count).toHaveBeenCalledTimes(1);
  });

  it('removes pending counts on unmount and rechecks privacy on load', () => {
    const { unmount } = configured();
    window.doNotTrack = '1';
    const count = load();
    expect(count).not.toHaveBeenCalled();
    delete window.doNotTrack;
    unmount();
    act(() => document.getElementById('goatcounter').dispatchEvent(new Event('load')));
    expect(count).not.toHaveBeenCalled();
  });
});
