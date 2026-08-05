import styled from 'styled-components';

/**
 * Ambient gradient orbs rendered behind page content. Two blurred radial
 * gradients anchored to opposite corners. Pass `$animated` for the slow drifting
 * motion used on the home page; omit it for the calmer static wash used on
 * article pages. Purely decorative — kept out of the accessibility tree.
 */
const BackgroundElements = styled.div.attrs({ 'aria-hidden': 'true' })`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: ${(props) => (props.$animated ? 1 : 0)};

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(100px);
  }

  &::before {
    top: -50%;
    right: -50%;
    background: radial-gradient(circle, var(--color-accent-primary) 0%, transparent 70%);
    ${(props) =>
      props.$animated
        ? 'animation: bg-float 25s ease-in-out infinite;'
        : 'opacity: 0.05;'}
  }

  &::after {
    bottom: -50%;
    left: -50%;
    background: radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%);
    ${(props) =>
      props.$animated
        ? 'animation: bg-float 30s ease-in-out infinite reverse;'
        : 'opacity: 0.05;'}
  }

  @keyframes bg-float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.02;
    }
    33% {
      transform: translate(80px, -80px) scale(1.15);
      opacity: 0.06;
    }
    66% {
      transform: translate(-50px, 50px) scale(0.9);
      opacity: 0.015;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
      opacity: 0.04;
    }
  }
`;

export default BackgroundElements;
