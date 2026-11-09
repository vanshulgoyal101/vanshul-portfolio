import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Button, ButtonLink, TextLink } from './Button';

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Button primitives', () => {
  it('ButtonLink navigates with the router', () => {
    inRouter(<ButtonLink to="/blog/">Read the blog</ButtonLink>);
    expect(screen.getByRole('link', { name: 'Read the blog' })).toHaveAttribute('href', '/blog/');
  });

  it('Button is a real button that forwards type and clicks', async () => {
    const onClick = vi.fn();
    inRouter(<Button type="submit" $variant="secondary" onClick={onClick}>Send</Button>);
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toHaveAttribute('type', 'submit');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('a disabled Button ignores clicks', async () => {
    const onClick = vi.fn();
    inRouter(<Button disabled onClick={onClick}>Sending…</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Sending…' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('TextLink routes by default and renders a plain anchor for in-page targets', () => {
    inRouter(
      <>
        <TextLink to="/#blog">Back to Writings</TextLink>
        <TextLink as="a" href="#shelf-top">Back to top</TextLink>
      </>
    );
    expect(screen.getByRole('link', { name: 'Back to Writings' })).toHaveAttribute('href', '/#blog');
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#shelf-top');
  });
});
