// src/components/Contact/Contact.jsx
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdLocationOn, MdWork, MdTranslate } from 'react-icons/md';
import { useToast } from '../Toast';
import { bioData } from '../../constants/portfolioData';

// Styled Components
const ContactSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: var(--color-bg-primary);
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  text-align: left;
`;

const Title = styled.h2`
  font-size: var(--text-4xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
  
  span {
    color: var(--color-accent-primary);
  }
`;

const Underline = styled.div`
  width: 60px;
  height: 2px;
  background: var(--color-accent-primary);
  margin-top: var(--spacing-xs);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: var(--spacing-xl);
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const InfoTitle = styled.h3`
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
`;

const InfoText = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.75;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: var(--transition-base);
  
  &:hover {
    border-color: rgba(245, 158, 11, 0.25);
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
  font-size: 1.1rem;
`;

const InfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  span.label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    font-family: var(--font-mono);
  }
  
  span.value {
    font-size: var(--text-sm);
    color: var(--color-text-primary);
    font-weight: 500;
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(7, 10, 19, 0.2);
  border-top-color: #070a13;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ContactFormCard = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  border-radius: 8px;
  position: relative;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FormLabel = styled.label`
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  font-family: var(--font-mono);
  text-transform: uppercase;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  transition: var(--transition-base);
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  resize: vertical;
  min-height: 120px;
  transition: var(--transition-base);
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: var(--color-accent-primary);
  color: #070a13;
  border: none;
  border-radius: 4px;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: var(--transition-base);
  min-height: 44px;
  
  &:hover:not(:disabled) {
    background: #fbbf24;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
  }
`;

const Contact = () => {
  const { showSuccess, showError } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          'Message Sent', 
          "Thank you! I'll get back to you shortly."
        );
        setFormState({ name: '', email: '', message: '' });
      } else {
        showError(
          'Submission Error',
          'Something went wrong. Please try again or reach out on LinkedIn.'
        );
      }
    } catch (error) {
      console.error('Contact Form Submit Error:', error);
      showError(
        'Connection Error',
        'Could not complete submission. Please check your internet connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactSection id="contact">
      <Container>
        <SectionHeader>
          <Title>Get In <span>Touch</span></Title>
          <Underline />
        </SectionHeader>
        
        <ContactGrid>
          <ContactInfo>
            <InfoTitle>Let's Open a Conversation</InfoTitle>
            <InfoText>
              Have a question about my work in operations analysis, solar plants scaling, space research rovers, or stoic philosophy? Send a message through the form or link up on social media.
            </InfoText>
            
            <InfoList>
              <InfoCard>
                <InfoIcon><MdLocationOn /></InfoIcon>
                <InfoDetails>
                  <span className="label">Base location</span>
                  <span className="value">Gurugram / Chandigarh, India</span>
                </InfoDetails>
              </InfoCard>
              <InfoCard>
                <InfoIcon><MdWork /></InfoIcon>
                <InfoDetails>
                  <span className="label">Current Roles</span>
                  <span className="value">United Airlines & Solaride Energy</span>
                </InfoDetails>
              </InfoCard>
              <InfoCard>
                <InfoIcon><MdTranslate /></InfoIcon>
                <InfoDetails>
                  <span className="label">Communication languages</span>
                  <span className="value">English, Hindi</span>
                </InfoDetails>
              </InfoCard>
            </InfoList>
            
            <SocialLinks>
              <SocialLink href={bioData.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </SocialLink>
              <SocialLink href={bioData.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </SocialLink>
              <SocialLink href={bioData.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </SocialLink>
              <SocialLink href={bioData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </SocialLink>
            </SocialLinks>
          </ContactInfo>
          
          <ContactFormCard>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="What would you like to discuss?"
                  required
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </SubmitButton>
            </form>
          </ContactFormCard>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;