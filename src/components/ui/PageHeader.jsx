import styled from 'styled-components';
import PropTypes from 'prop-types';
import { eyebrow } from './typography';

const Header = styled.header`
  margin-bottom: clamp(2.5rem, 6vw, 3.5rem);
`;

const Eyebrow = styled.p`
  ${eyebrow}
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  line-height: 1.08;
  letter-spacing: -0.035em;
`;

const Lede = styled.p`
  max-width: 40rem;
  margin-top: 1.25rem;
  font-size: clamp(1.0625rem, 2vw, 1.25rem);
  line-height: 1.6;
`;

// Left-aligned title block for subpages: label, h1, optional lede, then any
// page-specific extras (byline, collection index, feed link).
const PageHeader = ({ label, title, lede, children, ...rest }) => (
  <Header {...rest}>
    {label && <Eyebrow>{label}</Eyebrow>}
    <Title>{title}</Title>
    {lede && <Lede>{lede}</Lede>}
    {children}
  </Header>
);

PageHeader.propTypes = {
  label: PropTypes.node,
  title: PropTypes.node.isRequired,
  lede: PropTypes.node,
  children: PropTypes.node,
};

export default PageHeader;
