import { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Styled Components
const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 400px;
  
  @media (max-width: 768px) {
    top: 80px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
`;

const ToastItem = styled(motion.div)`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  min-width: 300px;
  backdrop-filter: blur(10px);
  animation: ${slideIn} 0.3s ease-out;
  
  ${props => {
    switch (props.$type) {
      case 'success':
        return `border-left: 4px solid #22c55e;`;
      case 'error':
        return `border-left: 4px solid #ef4444;`;
      case 'info':
        return `border-left: 4px solid #3b82f6;`;
      default:
        return `border-left: 4px solid var(--color-accent-primary);`;
    }
  }}
  
  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
  
  ${props => {
    switch (props.$type) {
      case 'success':
        return `color: #22c55e;`;
      case 'error':
        return `color: #ef4444;`;
      case 'info':
        return `color: #3b82f6;`;
      default:
        return `color: var(--color-accent-primary);`;
    }
  }}
`;

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const ToastTitle = styled.h4`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const ToastMessage = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: var(--color-text-primary);
  }
`;

// Toast Component
const Toast = ({ id, type, title, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'info':
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <ToastItem
      $type={type}
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ duration: 0.3 }}
    >
      <IconWrapper $type={type}>{getIcon()}</IconWrapper>
      <ToastContent>
        {title && <ToastTitle>{title}</ToastTitle>}
        {message && <ToastMessage>{message}</ToastMessage>}
      </ToastContent>
      <CloseButton onClick={() => onClose(id)} aria-label="Close notification">
        <FaTimes />
      </CloseButton>
    </ToastItem>
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, type, title, message };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title, message, duration) => {
    return addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const showError = useCallback((title, message, duration) => {
    return addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const showInfo = useCallback((title, message, duration) => {
    return addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const value = {
    showSuccess,
    showError,
    showInfo,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ToastProvider;
