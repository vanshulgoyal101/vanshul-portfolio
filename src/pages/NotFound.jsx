import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';

import PageLayout from '../components/ui/PageLayout';
import { ButtonLink } from '../components/ui/Button';
import { eyebrow } from '../components/ui/typography';
import { useSeo } from '../hooks/useSeo';
import { HOME_PATH, BLOG_PATH, READING_LIST_PATH } from '../constants/routes';
import { NOT_FOUND_QUIPS } from '../constants/wit';
import { pickRandom } from '../utils/pickRandom';

const Center = styled(motion.div)`
  padding: clamp(1rem, 6vh, 4rem) 0 clamp(1rem, 4vh, 2rem);
  text-align: center;
`;

const Label = styled.p`
  ${eyebrow}
  margin-bottom: 1rem;
`;

const Code = styled.p`
  font-family: var(--font-display);
  font-size: clamp(6rem, 26vw, 11rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.06em;
  color: var(--color-ink);
`;

const Title = styled.h1`
  margin: 1.5rem 0 0.75rem;
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  letter-spacing: -0.03em;
`;

const Quip = styled.p`
  max-width: 30rem;
  margin: 0 auto 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent-primary);
`;

const Text = styled.p`
  max-width: 30rem;
  margin: 0 auto 2.25rem;

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    overflow-wrap: anywhere;
    color: var(--color-ink);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
`;

const displayPath = pathname => {
  try { return decodeURI(pathname); }
  catch { return pathname; }
};

const NotFound = () => {
  const { pathname } = useLocation();
  const [quip] = useState(() => pickRandom(NOT_FOUND_QUIPS));

  useSeo({
    title: 'Page not found — Vanshul Goyal',
    description: "That page doesn't exist. Head back home or explore the writing and projects.",
    path: pathname,
    robots: 'noindex, follow',
  });

  return (
    <PageLayout width="reading">
      <Center initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <Label>Page not found</Label>
        <Code>404</Code>
        <Title>This page wandered off.</Title>
        <Quip data-not-found-quip>{quip}</Quip>
        <Text>
          Nothing lives at <code>{displayPath(pathname)}</code>. The link may be broken or the
          page may have moved. Let&apos;s get you back on track.
        </Text>
        <Actions>
          <ButtonLink to={HOME_PATH}>
            <HiArrowLeft aria-hidden="true" data-arrow="back" /> Back home
          </ButtonLink>
          <ButtonLink $variant="secondary" to={BLOG_PATH}>Read the blog</ButtonLink>
          <ButtonLink $variant="secondary" to={READING_LIST_PATH}>Reading list</ButtonLink>
        </Actions>
      </Center>
    </PageLayout>
  );
};

export default NotFound;
