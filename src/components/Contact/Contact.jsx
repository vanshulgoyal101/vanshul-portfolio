// src/components/Contact/Contact.jsx
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaTwitter, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { MdLocationOn, MdWork } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';


// Styled Components
const ContactSection = styled.section`
  padding: var(--spacing-2xl) 0;
  position: relative;
  background: var(--color-bg-secondary);
  overflow: hidden;
  min-height: 80vh;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  margin-bottom: var(--spacing-md);
  background: var(--color-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const SectionSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  padding: var(--spacing-lg);
`;

const InfoTitle = styled.h3`
  font-size: var(--text-2xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const InfoText = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-accent-primary);
    transform: translateX(10px);
  }
`;

const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent-primary);
  font-size: 1.25rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: 2px;
`;

const InfoValue = styled.p`
  font-size: var(--text-base);
  color: var(--color-text-primary);
  font-weight: 500;
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const SocialLink = styled(motion.a)`
  width: 48px;
  height: 48px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
  }
`;

const ContactFormWrapper = styled(motion.div)`
  background: var(--color-bg-card);
  padding: var(--spacing-xl);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: var(--color-gradient-1);
    opacity: 0.05;
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
`;

const ContactForm = styled.form`
  position: relative;
  z-index: 2;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FormLabel = styled.label`
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 20px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--color-text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 14px 28px;
  background: var(--color-gradient-1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: all 0.3s ease;
  min-height: 48px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    min-height: 52px;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  padding: var(--spacing-md);
  border-radius: 8px;
  margin-top: var(--spacing-md);
  text-align: center;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: var(--spacing-md);
  border-radius: 8px;
  margin-top: var(--spacing-md);
  text-align: center;
`;

// Floating Paper Plane
const FloatingPlane = styled(motion.div)`
  position: absolute;
  font-size: 3rem;
  color: var(--color-accent-primary);
  opacity: 0.1;
  z-index: 1;
  pointer-events: none;
  bottom: 10%;
  right: 5%;
`;

const Contact = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with your Formspree endpoint
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
        setSubmitStatus('success');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MdLocationOn />,
      label: 'Location',
      value: 'India',
    },
    {
      icon: <MdWork />,
      label: 'Current Positions',
      value: 'United Airlines & Solaride',
    },
    {
      icon: <BiWorld />,
      label: 'Languages',
      value: 'English, Hindi',
    },
  ];

const socialLinks = [
  { icon: <FaTwitter />, url: 'https://x.com/goyal_vanshul', label: 'Twitter' },
  { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/vanshul-goyal00/', label: 'LinkedIn' },
  { icon: <FaInstagram />, url: 'https://www.instagram.com/vanshul_goyal/', label: 'Instagram' },
];


  return (
    <ContactSection ref={sectionRef}>
      {/* Floating Paper Plane */}
      <FloatingPlane
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <FaPaperPlane />
      </FloatingPlane>

      <Container>
        <SectionHeader
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <SectionTitle>Get In Touch</SectionTitle>
            <SectionSubtitle>
              Let's connect and build something amazing together
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>

        <ContactGrid>
          <ContactInfo
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants}>
              <InfoTitle>Let's Connect</InfoTitle>
              <InfoText>
                Whether you want to discuss technology, sustainable energy, or just say hello, 
                I'd love to hear from you. Feel free to reach out through the form or connect 
                on social media.
              </InfoText>
            </motion.div>

            {contactInfo.map((info, index) => (
              <InfoItem
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <InfoIcon>{info.icon}</InfoIcon>
                <InfoContent>
                  <InfoLabel>{info.label}</InfoLabel>
                  <InfoValue>{info.value}</InfoValue>
                </InfoContent>
              </InfoItem>
            ))}

            <motion.div variants={itemVariants}>
              <InfoText>Connect with me on social media:</InfoText>
              <SocialLinks>
                {socialLinks.map((social, index) => (
                  <SocialLink
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </SocialLink>
                ))}
              </SocialLinks>
            </motion.div>
          </ContactInfo>

                    <ContactFormWrapper
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <ContactForm onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Your Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
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
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or just say hi!"
                  rows="5"
                  required
                />
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ⏳
                    </motion.span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </SubmitButton>

              {submitStatus === 'success' && (
                <SuccessMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✅ Message sent successfully! I'll get back to you soon.
                </SuccessMessage>
              )}

              {submitStatus === 'error' && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ❌ Something went wrong. Please try again or email directly at vanshulg101@gmail.com
                </ErrorMessage>
              )}
            </ContactForm>
          </ContactFormWrapper>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;