import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Analytics from './Analytics';

describe('Analytics', () => {
  it('renders nothing and injects no script when unconfigured', () => {
    const { container } = render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
    expect(document.getElementById('goatcounter')).toBeNull();
  });
});
