import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HiOutlineAdjustments } from 'react-icons/hi';
import CursorToggle from './CursorToggle';
import { BLOG_PATH, homeSectionPath } from '../constants/routes';
import { SOCIAL_LINKS } from '../constants/siteConfig';

const Footer = styled.footer`
  position: relative;
  z-index: 2;
  padding: 2.5rem var(--container-padding) 1.5rem;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
`;

const Inner = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 2rem;
  row-gap: 0.75rem;
  max-width: var(--container-xl);
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid var(--color-hairline);

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: var(--color-ink);
  }

  a:focus-visible, summary:focus-visible, input:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 4px;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.25rem;
  }
`;

const Identity = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.875rem;

  a {
    font-family: var(--font-display);
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--color-ink);
  }

  span {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
  }
`;

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
`;

const Preferences = styled.details`
  grid-column: 1 / -1;
  justify-self: end;
  width: min(100%, 18rem);

  summary {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    min-height: 44px;
    list-style: none;
    cursor: pointer;
    color: var(--color-text-muted);
  }
  summary::-webkit-details-marker { display: none; }
  summary:hover, &[open] summary { color: var(--color-ink); }
  summary svg { width: 1.125rem; height: 1.125rem; flex-shrink: 0; }
  > div { border-top: 1px solid var(--color-border); padding-top: 0.5rem; }
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 44px;
    cursor: pointer;
  }
  input {
    appearance: none;
    width: 2.25rem;
    height: 1.25rem;
    min-width: 0;
    min-height: 0;
    border: 1px solid var(--color-text-muted);
    border-radius: 1rem;
    background: var(--color-bg-secondary);
    flex-shrink: 0;
    cursor: inherit;
  }
  input::before {
    content: '';
    display: block;
    width: 0.875rem;
    height: 0.875rem;
    margin: 2px;
    border-radius: 50%;
    background: var(--color-text-secondary);
  }
  input:checked { background: var(--color-accent-primary); border-color: var(--color-accent-primary); }
  input:checked::before { transform: translateX(1rem); background: #fff; }
  @media (forced-colors: active) {
    input { appearance: auto; }
    input::before { display: none; }
  }
  label:has(input:disabled) { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 640px) {
    justify-self: start;
    summary { justify-content: flex-start; }
  }
`;

const SiteFooter = ({ ambientEnabled, reducedMotion, onAmbientChange }) => (
  <Footer>
    <Inner>
      <Identity>
        <Link to={homeSectionPath('home')}>Vanshul Goyal</Link>
        <span>&copy; {new Date().getFullYear()} · vanshul.com</span>
      </Identity>
      <Links aria-label="Footer links">
        <Link to={BLOG_PATH}>Blog</Link>
        <a href={SOCIAL_LINKS.games} target="_blank" rel="noopener noreferrer">Games</a>
        <a href={SOCIAL_LINKS.links} target="_blank" rel="noopener noreferrer">Links</a>
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </Links>
      <Preferences onToggle={event => {
        if (event.currentTarget.open) event.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }}>
        <summary><HiOutlineAdjustments aria-hidden="true" />Display settings</summary>
        <div>
          <CursorToggle />
          <label title={reducedMotion ? 'Disabled by your reduced-motion preference' : undefined}>
            Ambient motion
            <input type="checkbox" role="switch" checked={ambientEnabled && !reducedMotion} disabled={Boolean(reducedMotion)} onChange={event => onAmbientChange(event.target.checked)} />
          </label>
        </div>
      </Preferences>
    </Inner>
  </Footer>
);

export default SiteFooter;