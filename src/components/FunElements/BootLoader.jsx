// src/components/FunElements/BootLoader.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const LoaderWrapper = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: var(--color-bg-primary);
  background-image: 
    linear-gradient(to right, rgba(30, 41, 59, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30, 41, 59, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const GreetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
`;

const GreetingWord = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 800;
  color: var(--color-accent-primary);
  margin-bottom: var(--spacing-md);
  letter-spacing: -0.03em;
  line-height: 1;
`;

const SubtitleText = styled(motion.p)`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SpinnerDot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-accent-secondary);
`;

const GREETINGS = [
  { word: 'Hello', lang: 'English' },
  { word: 'Hola', lang: 'Spanish' },
  { word: 'Bonjour', lang: 'French' },
  { word: 'नमस्ते', lang: 'Hindi' },
  { word: 'こんにちは', lang: 'Japanese' },
  { word: 'Ciao', lang: 'Italian' },
  { word: '你好', lang: 'Chinese' },
  { word: 'Hallo', lang: 'German' },
  { word: 'Hej', lang: 'Swedish' },
  { word: 'Olá', lang: 'Portuguese' },
  { word: '안녕하세요', lang: 'Korean' },
  { word: 'Merhaba', lang: 'Turkish' },
  { word: 'Shalom', lang: 'Hebrew' },
  { word: 'Sawatdee', lang: 'Thai' },
  { word: 'Welcome', lang: 'English' }
];

const BootLoader = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [shuffledGreetings, setShuffledGreetings] = useState([]);
  const [isDone, setIsDone] = useState(false);

  // Shuffle the greetings list on mount, keeping 'Welcome' as the final word
  useEffect(() => {
    const pool = GREETINGS.slice(0, -1);
    // Fisher-Yates Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // Limit to 10 random greetings, then append the final 'Welcome'
    setShuffledGreetings([...pool.slice(0, 10), GREETINGS[GREETINGS.length - 1]]);
  }, []);

  useEffect(() => {
    if (shuffledGreetings.length === 0 || isDone) return;

    // Fast rotation of words (every 180ms)
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= shuffledGreetings.length - 1) {
          clearInterval(interval);
          setIsDone(true);
          // Complete and trigger page fade out
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [shuffledGreetings, isDone, onComplete]);

  if (shuffledGreetings.length === 0) return null;

  const currentGreeting = shuffledGreetings[index];

  return (
    <AnimatePresence>
      <LoaderWrapper
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <GreetingContainer>
          <AnimatePresence mode="wait">
            <GreetingWord
              key={currentGreeting.word}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {currentGreeting.word}
            </GreetingWord>
          </AnimatePresence>

          <SubtitleText
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.2 }}
          >
            <span>SYSTEM BOOTING</span>
            <SpinnerDot
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span>{currentGreeting.lang}</span>
          </SubtitleText>
        </GreetingContainer>
      </LoaderWrapper>
    </AnimatePresence>
  );
};

export default BootLoader;
