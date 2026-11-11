import { useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'framer-motion';

describe('motion test doubles', () => {
  it('keeps element component identities stable like real motion elements', () => {
    expect(motion.div).toBe(motion.div);
    expect(motion.div).not.toBe(motion.span);
  });

  it('preserves child state, focus and effects when its parent rerenders', () => {
    const mount = vi.fn();
    const cleanup = vi.fn();
    const Child = () => {
      useEffect(() => {
        mount();
        return cleanup;
      }, []);
      return <input aria-label="Draft" defaultValue="" />;
    };
    const Parent = () => {
      const [count, setCount] = useState(0);
      return <><button onClick={() => setCount(count + 1)}>Render {count}</button><motion.div><Child /></motion.div></>;
    };
    const { unmount } = render(<Parent />);
    const input = screen.getByRole('textbox');
    input.focus();
    fireEvent.change(input, { target: { value: 'keep this draft' } });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input).toHaveValue('keep this draft');
    expect(input).toHaveFocus();
    expect(mount).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
