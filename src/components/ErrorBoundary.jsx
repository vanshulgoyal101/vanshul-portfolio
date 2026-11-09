// src/components/ErrorBoundary.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from './ui/Button';

const FallbackContainer = styled.div`
  max-width: 36rem;
  margin: var(--spacing-lg) auto;
  padding: clamp(2rem, 5vw, 3rem) var(--container-padding);
  text-align: center;
  border: 1px dashed var(--color-hairline);
  border-radius: var(--radius-lg);
`;

// h2: the fallback stands in for a section whose own title was an h2.
const FallbackTitle = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
`;

const FallbackText = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if ('fallback' in this.props) return this.props.fallback;
      return (
        <FallbackContainer>
          <FallbackTitle>Something went wrong here</FallbackTitle>
          <FallbackText>This section failed to load. Please try reloading the page.</FallbackText>
          <Button type="button" onClick={this.handleRetry}>Reload Page</Button>
        </FallbackContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default ErrorBoundary;
