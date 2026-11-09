import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

// Focus rings come from the global :focus-visible rule in src/index.css.

// Arrow icons marked with data-arrow nudge in their direction on hover.
const arrowNudge = css`
  svg {
    flex-shrink: 0;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  &:hover svg[data-arrow='forward'] {
    transform: translateX(3px);
  }

  &:hover svg[data-arrow='back'] {
    transform: translateX(-3px);
  }

  &:hover svg[data-arrow='up'] {
    transform: translateY(-3px);
  }
`;

// One button vocabulary for the whole site: a solid ink primary action and a
// hairline secondary action, both pill-shaped with 48px targets.
const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  padding: 0 1.5rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color var(--duration-fast) ease,
    border-color var(--duration-fast) ease,
    color var(--duration-fast) ease,
    transform var(--duration-fast) var(--ease-out);

  ${arrowNudge}

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

const variants = {
  primary: css`
    background: var(--color-ink);
    border: 1px solid var(--color-ink);
    color: #ffffff;

    &:hover:not(:disabled) {
      background: var(--color-accent-primary);
      border-color: var(--color-accent-primary);
    }
  `,
  secondary: css`
    background: transparent;
    border: 1px solid var(--color-hairline);
    color: var(--color-ink);

    &:hover:not(:disabled) {
      background: var(--color-bg-card);
      border-color: var(--color-ink);
    }
  `,
};

const variant = ({ $variant = 'primary' }) => variants[$variant];

export const ButtonLink = styled(Link)`
  ${base}
  ${variant}
`;

export const Button = styled.button`
  ${base}
  ${variant}
`;

// Quiet navigation link ("Back to Blog", "Back to top"): secondary text that
// darkens on hover. Render with as="a" for in-page anchors.
export const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;

  &:hover {
    color: var(--color-ink);
  }

  ${arrowNudge}
`;
