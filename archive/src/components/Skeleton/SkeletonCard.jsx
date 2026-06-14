import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonWrapper = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: ${props => props.$minHeight || '300px'};
  
  @media (max-width: 768px) {
    min-height: ${props => props.$mobileMinHeight || '250px'};
  }
`;

const SkeletonElement = styled.div`
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(99, 102, 241, 0.1) 50%,
    rgba(99, 102, 241, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${props => props.$radius || '8px'};
  height: ${props => props.$height || '20px'};
  width: ${props => props.$width || '100%'};
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
`;

const SkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
`;

// Blog Skeleton Card
export const BlogSkeletonCard = () => {
  return (
    <SkeletonWrapper $minHeight="400px" $mobileMinHeight="350px">
      <SkeletonHeader>
        <SkeletonElement $width="80px" $height="24px" $radius="12px" />
        <SkeletonElement $width="100px" $height="18px" />
      </SkeletonHeader>
      <SkeletonContent>
        <SkeletonElement $width="90%" $height="32px" $radius="4px" />
        <SkeletonElement $width="100%" $height="20px" />
        <SkeletonElement $width="95%" $height="20px" />
        <SkeletonElement $width="85%" $height="20px" />
      </SkeletonContent>
      <SkeletonFooter>
        <SkeletonElement $width="120px" $height="18px" />
        <SkeletonElement $width="80px" $height="18px" />
      </SkeletonFooter>
    </SkeletonWrapper>
  );
};

// Project Skeleton Card
export const ProjectSkeletonCard = () => {
  return (
    <SkeletonWrapper $minHeight="350px" $mobileMinHeight="300px">
      <SkeletonHeader>
        <SkeletonElement $width="48px" $height="48px" $radius="50%" />
        <div style={{ flex: 1 }}>
          <SkeletonElement $width="70%" $height="28px" $radius="4px" />
        </div>
      </SkeletonHeader>
      <SkeletonContent>
        <SkeletonElement $width="100%" $height="18px" />
        <SkeletonElement $width="95%" $height="18px" />
        <SkeletonElement $width="90%" $height="18px" />
        <SkeletonElement $width="60%" $height="18px" />
      </SkeletonContent>
      <SkeletonFooter>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <SkeletonElement $width="60px" $height="28px" $radius="14px" />
          <SkeletonElement $width="70px" $height="28px" $radius="14px" />
          <SkeletonElement $width="65px" $height="28px" $radius="14px" />
        </div>
        <SkeletonElement $width="32px" $height="32px" $radius="50%" />
      </SkeletonFooter>
    </SkeletonWrapper>
  );
};

// Work Experience Skeleton Card
export const WorkSkeletonCard = () => {
  return (
    <SkeletonWrapper $minHeight="280px" $mobileMinHeight="250px">
      <SkeletonHeader>
        <SkeletonElement $width="56px" $height="56px" $radius="50%" />
        <div style={{ flex: 1 }}>
          <SkeletonElement $width="60%" $height="24px" $radius="4px" />
          <div style={{ marginTop: 'var(--spacing-xs)' }}>
            <SkeletonElement $width="40%" $height="18px" />
          </div>
        </div>
      </SkeletonHeader>
      <SkeletonContent>
        <SkeletonElement $width="100%" $height="16px" />
        <SkeletonElement $width="95%" $height="16px" />
        <SkeletonElement $width="85%" $height="16px" />
      </SkeletonContent>
      <SkeletonFooter>
        <SkeletonElement $width="150px" $height="16px" />
        <SkeletonElement $width="100px" $height="16px" />
      </SkeletonFooter>
    </SkeletonWrapper>
  );
};

// Generic Skeleton Card with custom props
export const SkeletonCard = ({ 
  minHeight, 
  mobileMinHeight, 
  children 
}) => {
  return (
    <SkeletonWrapper 
      $minHeight={minHeight} 
      $mobileMinHeight={mobileMinHeight}
    >
      {children}
    </SkeletonWrapper>
  );
};

SkeletonCard.propTypes = {
  minHeight: PropTypes.string,
  mobileMinHeight: PropTypes.string,
  children: PropTypes.node
};

// Export utility components for custom skeleton layouts
export { SkeletonElement, SkeletonHeader, SkeletonContent, SkeletonFooter };
