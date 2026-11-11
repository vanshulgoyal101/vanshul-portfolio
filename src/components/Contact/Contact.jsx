import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { MdLocationOn, MdWork } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import Magnetic from '../FunElements/Magnetic';
import SectionHeader from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { useContactForm } from '../../hooks/useContactForm';
import { containerVariants, itemVariants } from '../../constants/motionVariants';
import { SOCIAL_PROFILES } from '../../constants/siteConfig';
import { PROFILE } from '../../constants/profile';
import { SOCIAL_ICONS } from '../socialIcons';


const ContactSection = styled.section`
  position: relative;
  padding: clamp(3.5rem, 7vw, 6rem) 0;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;
  max-width: 64rem;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  min-width: 0;
`;

const InfoTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: clamp(1.375rem, 2.5vw, 1.75rem);
  letter-spacing: -0.02em;
`;

const InfoText = styled.p`
  margin-bottom: 2rem;
  font-size: 1.0625rem;
  line-height: 1.7;
`;

const Facts = styled.dl`
  margin-bottom: 2rem;
  border-top: 1px solid var(--color-hairline);
`;

const Fact = styled(motion.div)`
  position: relative;
  display: grid;
  gap: 0.25rem;
  padding: 1rem 0 1rem 3.25rem;
  border-bottom: 1px solid var(--color-hairline);

  dt {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  /* The icon lives in the dt for valid markup but centres on the whole row. */
  dt svg {
    position: absolute;
    top: 50%;
    left: 0;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.625rem;
    color: var(--color-accent-primary);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 50%;
    transform: translateY(-50%);
  }

  dd {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-ink);
  }
`;

const SocialLabel = styled.p`
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
`;

const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 50%;

  &:hover {
    color: var(--color-ink);
    border-color: var(--color-ink);
  }

  &:focus-visible {
    outline: 3px solid var(--color-accent-primary);
    outline-offset: 3px;
  }
`;

const ContactFormWrapper = styled(motion.div)`
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

const ContactForm = styled.form`
  display: grid;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink);
`;

const field = `
  width: 100%;
  padding: 0.8125rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-ink);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease, background-color var(--duration-fast) ease;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:hover:not(:disabled) {
    border-color: var(--color-border-hover);
  }

  &:focus {
    outline: none;
    background: var(--color-bg-card);
    border-color: var(--color-accent-primary);
    box-shadow: 0 0 0 4px var(--color-accent-soft);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }

  &[aria-invalid='true']:focus {
    box-shadow: 0 0 0 4px rgba(185, 28, 28, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FormInput = styled.input`
  ${field}
`;

const FormTextarea = styled.textarea`
  ${field}
  min-height: 140px;
  resize: vertical;
`;

const ValidationError = styled.p`
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--color-danger);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  min-height: 52px;
  margin-top: 0.25rem;
  border-radius: var(--radius-md);
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const contactInfo = [
  { icon: <MdLocationOn aria-hidden="true" />, label: 'Location', value: PROFILE.location },
  { icon: <MdWork aria-hidden="true" />, label: 'Current Position', value: PROFILE.employer.name },
  { icon: <BiWorld aria-hidden="true" />, label: 'Languages', value: PROFILE.languages.join(', ') },
];

const Contact = () => {
  const { formState, isSubmitting, errors, handleChange, handleSubmit } = useContactForm();

  return (
    <ContactSection>
      <Container>
        <SectionHeader
          index="05"
          eyebrow="Say hello"
          title="Get In Touch"
          lede="My inbox is open. Ideas, opportunities and cricket debates welcome"
        />

        <ContactGrid>
          <ContactInfo
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <InfoTitle>Let&apos;s Connect</InfoTitle>
              <InfoText>
                Whether it&apos;s technology, engineering, a book I should add to my shelf or
                just a hello, I&apos;d love to hear from you. Use the form or find me on
                social media.
              </InfoText>
            </motion.div>

            <Facts>
              {contactInfo.map((info) => (
                <Fact key={info.label} variants={itemVariants}>
                  <dt>{info.icon}{info.label}</dt>
                  <dd>{info.value}</dd>
                </Fact>
              ))}
            </Facts>

            <motion.div variants={itemVariants}>
              <SocialLabel>Connect with me on social media</SocialLabel>
              <SocialLinks>
                {SOCIAL_PROFILES.map(({ id, label, url }) => {
                  const Icon = SOCIAL_ICONS[id];
                  return (
                    <Magnetic key={id} range={35}>
                      <SocialLink href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                        <Icon />
                      </SocialLink>
                    </Magnetic>
                  );
                })}
              </SocialLinks>
            </motion.div>
          </ContactInfo>

          <ContactFormWrapper
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <ContactForm onSubmit={handleSubmit} noValidate>
              <FormGroup>
                <FormLabel htmlFor="name">Your Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Ada Lovelace"
                  required
                  disabled={isSubmitting}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <ValidationError id="name-error">{errors.name}</ValidationError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="ada@example.com"
                  required
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <ValidationError id="email-error">{errors.email}</ValidationError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="message">Message</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Pitch me a project, recommend a book, or just say hi!"
                  rows="5"
                  required
                  disabled={isSubmitting}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && <ValidationError id="message-error">{errors.message}</ValidationError>}
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner aria-hidden="true" />
                    Launching...
                  </>
                ) : (
                  <>
                    <FaPaperPlane aria-hidden="true" />
                    Send Message
                  </>
                )}
              </SubmitButton>
            </ContactForm>
          </ContactFormWrapper>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};

export default Contact;
