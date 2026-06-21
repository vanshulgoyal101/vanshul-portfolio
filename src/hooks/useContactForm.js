import { useState } from 'react';
import { useToast } from '../components/Toast';

export const useContactForm = (initialState = { name: '', email: '', message: '' }) => {
  const { showSuccess, showError } = useToast();
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(value && !valid ? 'Please enter a valid email address.' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xgvzkqob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formState,
          _replyto: formState.email,
          _subject: `Portfolio Contact: ${formState.name}`,
        }),
      });

      if (response.ok) {
        showSuccess(
          'Message Sent!',
          "Thank you for reaching out. I'll get back to you soon!"
        );
        setFormState(initialState);
      } else {
        showError(
          'Oops! Something went wrong',
          'Failed to send your message. Please try again or email me directly.'
        );
      }
    } catch {
      showError(
        'Network Error',
        'Unable to send message. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    isSubmitting,
    emailError,
    handleChange,
    handleSubmit,
  };
};
