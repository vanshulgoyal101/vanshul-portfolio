import { useState } from 'react';
import { useToast } from '../components/Toast';

// Formspree endpoint for the contact form. Override with VITE_CONTACT_ENDPOINT.
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'https://formspree.io/f/xgvzkqob';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Submit-time validation: every field is required (whitespace does not count),
// and the email must look like an address. Empty-required errors surface on
// submit; handleChange only live-checks email format so we don't nag mid-typing.
const fieldError = (name, value) => {
  const v = value.trim();
  if (name === 'name') return v ? '' : 'Please enter your name.';
  if (name === 'email')
    return !v
      ? 'Please enter your email address.'
      : EMAIL_RE.test(v) ? '' : 'Please enter a valid email address.';
  if (name === 'message') return v ? '' : 'Please enter a message.';
  return '';
};

export const useContactForm = (initialState = { name: '', email: '', message: '' }) => {
  const { showSuccess, showError } = useToast();
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      const valid = !value || EMAIL_RE.test(value);
      setErrors((prev) => ({ ...prev, email: valid ? '' : 'Please enter a valid email address.' }));
    } else {
      setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {
      name: fieldError('name', formState.name),
      email: fieldError('email', formState.email),
      message: fieldError('message', formState.message),
    };
    setErrors(next);
    if (next.name || next.email || next.message) {
      showError('Missing details', 'Please add your name, a valid email, and a message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
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
        setErrors({});
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
    errors,
    emailError: errors.email || '',
    handleChange,
    handleSubmit,
  };
};
