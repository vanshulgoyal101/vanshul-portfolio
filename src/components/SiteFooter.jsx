import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HiOutlineAdjustments } from 'react-icons/hi';
import CursorToggle from './CursorToggle';

const Footer = styled.footer`
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--color-border);
  padding: 1.5rem var(--container-padding);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
`;

const Inner = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 2rem;
  row-gap: 0.5rem;

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: inherit;
    text-decoration: none;
  }
  a:hover { color: var(--color-accent-primary); }
  a:focus-visible, summary:focus-visible, input:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 4px;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }
`;

const Identity = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  a { font-weight: 600; color: var(--color-text-primary); }
  span { color: var(--color-text-muted); }
`;

const Links = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.5rem;
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
  summary:hover, &[open] summary { color: var(--color-accent-primary); }
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
        <Link to="/#home">Vanshul Goyal</Link>
        <span>&copy; {new Date().getFullYear()}</span>
      </Identity>
      <Links aria-label="Footer links">
        <Link to="/blog">Blog</Link>
        <a href="https://games.vanshul.com" target="_blank" rel="noopener noreferrer">Games</a>
        <a href="https://links.vanshul.com" target="_blank" rel="noopener noreferrer">Links</a>
        <a href="https://github.com/vanshulgoyal101" target="_blank" rel="noopener noreferrer">GitHub</a>
      </Links>
      <Preferences>
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