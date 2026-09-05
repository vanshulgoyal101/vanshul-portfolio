// src/components/FunElements/BootLoader.jsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Styled Components ────────────────────────────────────────────────────────

const LoaderWrapper = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: var(--color-bg-primary);
  background-image:
    linear-gradient(to right, rgba(30, 41, 59, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(30, 41, 59, 0.025) 1px, transparent 1px);
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
  /* Fixed height prevents layout shift as words change */
  height: 180px;
`;

const GreetingWord = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: 800;
  color: var(--color-accent-primary);
  letter-spacing: 0;
  line-height: 1;
  /* Reserve space so height never jumps */
  margin: 0;
  @media (max-width: 768px) { font-size: 3rem; }
`;

const LangLabel = styled(motion.p)`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  letter-spacing: 0;
  text-transform: uppercase;
  margin-top: 1.5rem;
  height: 1.2em; /* fixed height — prevents layout shift */
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Dot = styled(motion.span)`
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-accent-secondary);
  flex-shrink: 0;
`;

// ─── Greeting data ────────────────────────────────────────────────────────────

const ALL_GREETINGS = [
  { word: 'Hello',      lang: 'English'    },
  { word: 'Hola',       lang: 'Spanish'    },
  { word: 'Bonjour',    lang: 'French'     },
  { word: 'नमस्ते',      lang: 'Hindi'      },
  { word: 'こんにちは',  lang: 'Japanese'   },
  { word: 'Ciao',       lang: 'Italian'    },
  { word: '你好',        lang: 'Chinese'    },
  { word: 'Hallo',      lang: 'German'     },
  { word: 'Olá',        lang: 'Portuguese' },
  { word: '안녕하세요',  lang: 'Korean'     },
  { word: 'Merhaba',    lang: 'Turkish'    },
  { word: 'Shalom',     lang: 'Hebrew'     },
  { word: 'Sawatdee',   lang: 'Thai'       },
  { word: 'Hej',        lang: 'Swedish'    },
  { word: 'Ahoj',       lang: 'Czech'      },
  { word: 'Привет',     lang: 'Russian'    },
];

// How long each greeting is visible (word-switch interval in ms)
const STEP_MS = 220;
// Number of random greetings to show before the final "Welcome"
const SHOW_COUNT = 8;
// The mandatory closing greeting
const FINAL = { word: 'Welcome', lang: 'English' };

// Fisher-Yates shuffle (pure, no mutation of original)
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build the sequence once — deterministic after mount
const buildSequence = () => [
  ...shuffle(ALL_GREETINGS).slice(0, SHOW_COUNT),
  FINAL,
];

// ─── Component ────────────────────────────────────────────────────────────────

const BootLoader = ({ onComplete }) => {
  // Build the sequence synchronously at init time — no async shuffle effect.
  // useRef so it's stable across renders (never changes identity).
  const sequenceRef = useRef(buildSequence());

  // Single source of truth: which index are we on.
  const [index, setIndex] = useState(0);

  // Track whether the wrapper exit animation has started.
  const [exiting, setExiting] = useState(false);

  // Stable onComplete ref so the interval closure never captures a stale prop.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const sequence = sequenceRef.current;

    // Respect reduced-motion: skip the animated greeting cycle and reveal the
    // page immediately instead of holding it behind a loader.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onCompleteRef.current?.();
      return;
    }

    const isFinal = index === sequence.length - 1;
    const timer = setTimeout(() => {
      if (isFinal) setExiting(true);
      else setIndex(index + 1);
    }, isFinal ? STEP_MS * 2 : STEP_MS);
    return () => clearTimeout(timer);
  }, [index]);

  // When exiting is set, wait for exit animation then call onComplete.
  useEffect(() => {
    if (!exiting) return;
    // 500ms matches the LoaderWrapper exit transition duration.
    const id = setTimeout(() => onCompleteRef.current?.(), 500);
    return () => clearTimeout(id);
  }, [exiting]);

  const current = sequenceRef.current[index];

  return (
    <AnimatePresence>
      {!exiting && (
        <LoaderWrapper
          data-boot-loader
          role="status"
          aria-label="Loading website"
          key="bootloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <GreetingContainer aria-hidden="true">
            {/*
              FIX for word/lang mismatch:
              Both the greeting word AND the lang label share the same `key`.
              AnimatePresence animates the ENTIRE block together, so they
              always display the same greeting pair — never mismatched.
            */}
            <AnimatePresence mode="wait" key={index === SHOW_COUNT ? 'welcome' : 'greetings'}>
              <motion.div
                key={current ? current.word : index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.13, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <GreetingWord data-greeting-word>{current.word}</GreetingWord>

                <LangLabel data-greeting-language>
                  <Dot
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {current.lang}
                  <Dot
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: 0.55 }}
                  />
                </LangLabel>
              </motion.div>
            </AnimatePresence>
          </GreetingContainer>
        </LoaderWrapper>
      )}
    </AnimatePresence>
  );
};

export default BootLoader;
