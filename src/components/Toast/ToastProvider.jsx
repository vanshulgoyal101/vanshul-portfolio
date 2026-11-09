/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
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

// Status tones: each meets 4.5:1 on white, so icons and edges stay legible.
const TONES = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  info: 'var(--color-accent-primary)',
};

// Always mounted, so screen readers announce toasts as they are added
// (WCAG 4.1.3 status messages) without moving focus.
const ToastContainer = styled.div`
  position: fixed;
  top: 6rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: min(24rem, calc(100vw - 3rem));

  @media (max-width: 768px) {
    top: 5.5rem;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
`;

const ToastItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 0.5rem 1rem 1rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-hairline);
  border-left: 3px solid ${({ $type }) => TONES[$type]};
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 0.125rem;
  font-size: 1.125rem;
  color: ${({ $type }) => TONES[$type]};
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-ink);
`;

const ToastMessage = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: -0.625rem 0;
  border: 0;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    color var(--duration-fast) ease,
    background-color var(--duration-fast) ease;

  &:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-ink);
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
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <IconWrapper $type={type} aria-hidden="true">{getIcon()}</IconWrapper>
      <ToastContent>
        {title && <ToastTitle>{title}</ToastTitle>}
        {message && <ToastMessage>{message}</ToastMessage>}
      </ToastContent>
      <CloseButton type="button" onClick={() => onClose(id)} aria-label="Close notification">
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

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

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
  }, [removeToast]);

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
      <ToastContainer aria-live="polite">
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
