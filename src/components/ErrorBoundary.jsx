// src/components/ErrorBoundary.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--container-padding);
  text-align: center;
  background: var(--color-bg-primary);
  border: 1px dashed var(--color-border);
  border-radius: 16px;
  margin: var(--spacing-lg) auto;
  max-width: 600px;
`;

const FallbackTitle = styled.h3`
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
`;

const FallbackText = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
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
      return (
        <FallbackContainer>
          <FallbackTitle>Something went wrong here</FallbackTitle>
          <FallbackText>This section failed to load. Please try reloading the page.</FallbackText>
          <RetryButton onClick={this.handleRetry}>Reload Page</RetryButton>
        </FallbackContainer>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
