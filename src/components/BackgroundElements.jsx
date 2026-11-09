import styled from 'styled-components';

/**
 * Ambient gradient wash rendered once by App behind every route: two blurred
 * radial gradients anchored to opposite corners. Purely decorative — kept out
 * of the accessibility tree and transparent to pointer events.
 */
const BackgroundElements = styled.div.attrs({ 'aria-hidden': 'true' })`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(100px);
    opacity: 0.05;
  }

  &::before {
    top: -50%;
    right: -50%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
  }

  &::after {
    bottom: -50%;
    left: -50%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
  }
`;

export default BackgroundElements;
