// src/components/Footer/Footer.jsx
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { bioData } from '../../constants/portfolioData';

// ─── Styled Components ─────────────────────────────────────────────────────────

const FooterWrapper = styled.footer`
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  overflow: hidden;
`;

const FooterGlow = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(197, 179, 163, 0.06) 0%, transparent 70%);
  pointer-events: none;
`;

const FooterInner = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 5rem) var(--container-padding) clamp(1.5rem, 3vw, 2.5rem);
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(2rem, 4vw, 4rem);
  align-items: start;
  padding-bottom: clamp(2rem, 4vw, 3.5rem);
  border-bottom: 1px solid var(--color-border);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 420px;
`;

const FooterLogo = styled(motion.span)`
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  cursor: pointer;
  display: inline-block;
`;

const FooterTagline = styled.p`
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.7;
  margin: 0;
`;

const FooterQuote = styled.blockquote`
  margin: 0;
  padding: 0 0 0 1rem;
  border-left: 2px solid var(--color-accent-primary);
`;

const QuoteText = styled.p`
  font-family: var(--font-serif);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-style: italic;
  margin: 0 0 0.4rem;
`;

const QuoteAttribution = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const FooterNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: flex-end;

  @media (max-width: 640px) {
    align-items: flex-start;
  }
`;

const FooterNavLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const FooterNavLink = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: 0;
  transition: color 0.25s ease;
  text-align: right;
  min-height: auto;
  min-width: auto;

  &:hover {
    color: var(--color-accent-primary);
  }

  @media (max-width: 640px) {
    text-align: left;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: clamp(1.5rem, 2.5vw, 2rem);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CopyrightBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CopyrightText = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
`;

const CoordinateTelemetry = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-muted);
  opacity: 0.6;
  letter-spacing: 0.06em;
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocialLink = styled(motion.a)`
  color: var(--color-text-muted);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.25s ease;

  &:hover {
    color: var(--color-accent-primary);
    border-color: var(--color-accent-primary);
    background: rgba(197, 179, 163, 0.05);
  }
`;

// ─── Nav items (mirrors the main nav) ─────────────────────────────────────────

const footerNavItems = [
  { id: 'home',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'work',     label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog',     label: 'Blog' },
  { id: 'contact',  label: 'Contact' },
];

const socialLinks = [
  { href: bioData.github,    icon: <FaGithub />,    label: 'GitHub' },
  { href: bioData.linkedin,  icon: <FaLinkedin />,  label: 'LinkedIn' },
  { href: bioData.twitter,   icon: <FaTwitter />,   label: 'Twitter / X' },
  { href: bioData.instagram, icon: <FaInstagram />, label: 'Instagram' },
];

// ─── Footer Component ──────────────────────────────────────────────────────────

const Footer = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const year      = new Date().getFullYear();

  const handleNavClick = useCallback((sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [navigate, location.pathname]);

  return (
    <FooterWrapper>
      <FooterGlow />

      <FooterInner>
        {/* ── Top Row ── */}
        <FooterTop>
          {/* Brand + Quote */}
          <FooterBrand>
            <FooterLogo
              onClick={() => handleNavClick('home')}
              whileHover={{ opacity: 0.75 }}
              transition={{ duration: 0.2 }}
            >
              Vanshul Goyal
            </FooterLogo>

            <FooterTagline>{bioData.tagline}</FooterTagline>

            <FooterQuote>
              <QuoteText>
                "Somewhere, something incredible is waiting to be known."
              </QuoteText>
              <QuoteAttribution>— Carl Sagan</QuoteAttribution>
            </FooterQuote>
          </FooterBrand>

          {/* Quick Nav */}
          <FooterNav aria-label="Footer navigation">
            <FooterNavLabel>Navigate</FooterNavLabel>
            {footerNavItems.map((item) => (
              <FooterNavLink
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to ${item.label} section`}
              >
                {item.label}
              </FooterNavLink>
            ))}
          </FooterNav>
        </FooterTop>

        {/* ── Bottom Row ── */}
        <FooterBottom>
          <CopyrightBlock>
            <CopyrightText>
              © {year} Vanshul Goyal — All rights reserved.
            </CopyrightText>
            <CoordinateTelemetry>
              28°36′N 77°12′E · Gurugram, India
            </CoordinateTelemetry>
          </CopyrightBlock>

          <SocialLinks>
            {socialLinks.map(({ href, icon, label }) => (
              <SocialLink
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.92 }}
              >
                {icon}
              </SocialLink>
            ))}
          </SocialLinks>
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  );
};

export default Footer;
