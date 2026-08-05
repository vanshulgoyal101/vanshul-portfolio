import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  BlogSkeletonCard,
  ProjectSkeletonCard,
  WorkSkeletonCard,
  SkeletonCard,
} from './SkeletonCard';

describe('Skeleton cards', () => {
  it('render the named placeholder cards without crashing', () => {
    for (const Card of [BlogSkeletonCard, ProjectSkeletonCard, WorkSkeletonCard]) {
      const { container, unmount } = render(<Card />);
      // Each skeleton renders a non-empty shimmer layout.
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelectorAll('div').length).toBeGreaterThan(1);
      unmount();
    }
  });

  it('SkeletonCard renders its children inside the wrapper', () => {
    const { getByText } = render(
      <SkeletonCard minHeight="200px">
        <span>loading…</span>
      </SkeletonCard>
    );
    expect(getByText('loading…')).toBeInTheDocument();
  });
});
