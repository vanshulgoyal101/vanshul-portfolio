import styled from 'styled-components';
import PropTypes from 'prop-types';
import Navigation from '../Navigation/Navigation';

// `reading` keeps long-form text near 70 characters per line; `wide` suits
// listings. Both widths include the side padding.
const WIDTHS = {
  reading: '46rem',
  wide: 'var(--container-lg)',
};

const Main = styled.main`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: ${({ $width }) => WIDTHS[$width]};
  margin: 0 auto;
  padding: 8rem var(--container-padding) clamp(4rem, 8vw, 6rem);

  @media (max-width: 768px) {
    padding-top: 6.5rem;
  }
`;

// Every subpage shares the site navigation and exactly one <main> landmark.
const PageLayout = ({ width = 'wide', children }) => (
  <>
    <Navigation />
    <Main $width={width}>{children}</Main>
  </>
);

PageLayout.propTypes = {
  width: PropTypes.oneOf(Object.keys(WIDTHS)),
  children: PropTypes.node.isRequired,
};

export default PageLayout;
