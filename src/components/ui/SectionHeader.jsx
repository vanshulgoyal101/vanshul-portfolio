import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header = styled.header`
  max-width: 46rem;
  margin: 0 auto clamp(2.5rem, 5vw, 3.5rem);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: var(--text-section-title);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  text-align: center;
`;

// Rendered inside the h2 so in-page navigation, which aligns the heading below
// the fixed header, keeps the label visible. aria-hidden keeps the heading's
// accessible name to the title alone.
const Eyebrow = styled.span`
  display: block;
  margin-bottom: 0.875rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-accent-primary);
`;

const Lede = styled.p`
  max-width: 38rem;
  margin: 0 auto;
  font-size: var(--text-lede);
  line-height: 1.6;
  color: var(--color-text-secondary);
  text-align: center;
`;

const SectionHeader = ({ index, eyebrow, title, lede }) => (
  <Header>
    <Title>
      <Eyebrow aria-hidden="true">
        {index} / {eyebrow}
      </Eyebrow>
      {title}
    </Title>
    {lede && <Lede>{lede}</Lede>}
  </Header>
);

SectionHeader.propTypes = {
  index: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  lede: PropTypes.string,
};

export default SectionHeader;
