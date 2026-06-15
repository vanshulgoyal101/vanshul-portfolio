import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const Item = styled(motion.div)`
  position: absolute;
  user-select: none;
`;

// ─── Screen divided into a 3×3 grid of zones ─────────────────────────────────
// Each zone owns a portion of the viewport so elements stay spread out.
const ZONES = [
  { top: [5,  28], left: [4,  28]  }, // top-left
  { top: [5,  28], left: [36, 60]  }, // top-center
  { top: [5,  28], left: [66, 90]  }, // top-right
  { top: [35, 60], left: [4,  24]  }, // mid-left
  { top: [35, 60], left: [72, 92]  }, // mid-right
  { top: [65, 88], left: [4,  28]  }, // bottom-left
  { top: [65, 88], left: [36, 60]  }, // bottom-center
  { top: [65, 88], left: [66, 90]  }, // bottom-right
];

const rand = (min, max) => Math.random() * (max - min) + min;

// ─── All element definitions (small & subtle) ─────────────────────────────────
const ALL_ELEMENTS = [
  {
    id: 'orbit',
    render: () => (
      <svg width="24" height="24" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13" fill="none" stroke="#1d4ed8" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.5" />
        <circle cx="16" cy="16" r="4" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.6" />
        <circle cx="29" cy="16" r="2" fill="#3b82f6" opacity="0.7" />
        <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="10s" repeatCount="indefinite" />
      </svg>
    ),
  },
  {
    id: 'constellation',
    render: () => (
      <svg width="40" height="40" viewBox="0 0 50 50">
        <line x1="8" y1="40" x2="25" y2="10" stroke="#3b82f6" strokeWidth="0.5" opacity="0.45" />
        <line x1="25" y1="10" x2="42" y2="28" stroke="#3b82f6" strokeWidth="0.5" opacity="0.45" />
        <line x1="42" y1="28" x2="18" y2="25" stroke="#3b82f6" strokeWidth="0.5" opacity="0.45" />
        <line x1="18" y1="25" x2="8" y2="40" stroke="#3b82f6" strokeWidth="0.5" opacity="0.45" />
        <circle cx="8" cy="40" r="1.5" fill="#1d4ed8" opacity="0.6" />
        <circle cx="25" cy="10" r="2.5" fill="#1d4ed8" opacity="0.7" />
        <circle cx="42" cy="28" r="1.5" fill="#1d4ed8" opacity="0.6" />
        <circle cx="18" cy="25" r="2" fill="#3b82f6" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'wave',
    render: () => (
      <svg width="48" height="22" viewBox="0 0 60 26">
        <path d="M 0 13 Q 15 3, 30 13 T 60 13" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.45" />
        <path d="M 0 18 Q 15 8, 30 18 T 60 18" fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'hexagon',
    render: () => (
      <svg width="30" height="34" viewBox="0 0 40 46">
        <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="none" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.45" />
        <circle cx="20" cy="23" r="2.5" fill="#1d4ed8" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'diamond',
    render: () => (
      <svg width="26" height="26" viewBox="0 0 32 32">
        <polygon points="16,2 30,16 16,30 2,16" fill="none" stroke="#1d4ed8" strokeWidth="0.9" opacity="0.45" />
        <polygon points="16,9 23,16 16,23 9,16" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'concentric',
    render: () => (
      <svg width="32" height="32" viewBox="0 0 40 40">
        {[18, 13, 8, 4].map((r, i) => (
          <circle key={r} cx="20" cy="20" r={r} fill="none" stroke="#1d4ed8"
            strokeWidth="0.6" opacity={0.12 + i * 0.1} />
        ))}
        <circle cx="20" cy="20" r="1.5" fill="#3b82f6" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'corner-marks',
    render: () => (
      <svg width="28" height="28" viewBox="0 0 36 36">
        <path d="M2 10 L2 2 L10 2" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.45" />
        <path d="M26 2 L34 2 L34 10" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.45" />
        <path d="M2 26 L2 34 L10 34" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.45" />
        <path d="M26 34 L34 34 L34 26" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'sine',
    render: () => (
      <svg width="56" height="24" viewBox="0 0 70 28">
        <path d="M 0 14 C 6 2, 12 2, 18 14 C 24 26, 30 26, 36 14 C 42 2, 48 2, 54 14 C 60 26, 66 26, 70 20"
          fill="none" stroke="#1d4ed8" strokeWidth="0.9" opacity="0.45" />
        <line x1="0" y1="14" x2="70" y2="14" stroke="#1d4ed8" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'arrow-flow',
    render: () => (
      <svg width="40" height="16" viewBox="0 0 50 18">
        <path d="M2 9 L36 9" stroke="#1d4ed8" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.45" />
        <path d="M30 4 L40 9 L30 14" stroke="#1d4ed8" strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
        <circle cx="5" cy="9" r="1.5" fill="#3b82f6" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'music-note',
    render: () => (
      <svg width="22" height="28" viewBox="0 0 28 36">
        <path d="M12 28 L12 8 L26 5 L26 16" stroke="#1d4ed8" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.45" />
        <circle cx="9" cy="29" r="3.5" fill="none" stroke="#1d4ed8" strokeWidth="1.1" opacity="0.45" />
        <circle cx="23" cy="17" r="3.5" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'pi',
    render: () => (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: '#1d4ed8', opacity: 0.28, fontWeight: 700 }}>π</div>
    ),
  },
  {
    id: 'infinity',
    render: () => (
      <svg width="40" height="22" viewBox="0 0 50 28">
        <path d="M25 14 C25 14 18 4 10 4 C2 4 2 24 10 24 C18 24 25 14 25 14 C25 14 32 4 40 4 C48 4 48 24 40 24 C32 24 25 14 25 14 Z"
          fill="none" stroke="#1d4ed8" strokeWidth="1.1" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'sigma',
    render: () => (
      <div style={{ fontFamily: 'serif', fontSize: '1.6rem', color: '#1d4ed8', opacity: 0.28, fontWeight: 400 }}>Σ</div>
    ),
  },
  {
    id: 'brackets',
    render: () => (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: '#1d4ed8', opacity: 0.25, letterSpacing: '0.15em' }}>{'{ }'}</div>
    ),
  },
  {
    id: 'binary',
    render: () => (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: '#1d4ed8', opacity: 0.22, lineHeight: 1.9, letterSpacing: '0.05em' }}>
        {['01001000', '01101001', '00100001'].map((b, i) => <div key={i}>{b}</div>)}
      </div>
    ),
  },
  {
    id: 'haiku',
    render: () => (
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '0.45rem', color: '#1d4ed8', opacity: 0.2, textAlign: 'center', fontStyle: 'italic', lineHeight: 2.1 }}>
        code flows like water<br />
        a bug hides in still silence<br />
        the fix: just breathe
      </div>
    ),
  },
  {
    id: 'code-snippet',
    render: () => (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: '#1d4ed8', opacity: 0.22, lineHeight: 1.7, whiteSpace: 'pre' }}>
        {`const joy =\n  () => ∞;`}
      </div>
    ),
  },
  {
    id: 'dna',
    render: () => (
      <svg width="18" height="38" viewBox="0 0 24 50">
        {[0, 8, 16, 24, 32, 40].map((y, i) => (
          <g key={i}>
            <line x1="2" y1={y + 4} x2="22" y2={y + 4} stroke="#1d4ed8" strokeWidth="0.7" opacity="0.4" />
            <circle cx={i % 2 === 0 ? 2 : 22} cy={y + 4} r="1.5" fill="#3b82f6" opacity="0.5" />
          </g>
        ))}
        <path d="M4 2 Q20 12 4 22 Q20 32 4 42" fill="none" stroke="#1d4ed8" strokeWidth="0.7" opacity="0.4" />
        <path d="M20 2 Q4 12 20 22 Q4 32 20 42" fill="none" stroke="#3b82f6" strokeWidth="0.7" opacity="0.35" />
      </svg>
    ),
  },
  {
    id: 'triangle',
    render: () => (
      <svg width="30" height="28" viewBox="0 0 40 36">
        <polygon points="20,2 38,34 2,34" fill="none" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.45" />
        <polygon points="20,10 30,30 10,30" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.25" />
      </svg>
    ),
  },
];

// Max simultaneous elements on screen
const MAX_ACTIVE = 5;
// Time between spawning each new element (ms)
const SPAWN_INTERVAL_MS = 2200;

const pickZone = (usedZoneIndices) => {
  // Avoid the two most recently used zones
  const available = ZONES.map((z, i) => i).filter(i => !usedZoneIndices.includes(i));
  const pool = available.length > 0 ? available : ZONES.map((_, i) => i);
  const idx = pool[Math.floor(Math.random() * pool.length)];
  const zone = ZONES[idx];
  return {
    zoneIdx: idx,
    top: `${rand(zone.top[0], zone.top[1])}%`,
    left: `${rand(zone.left[0], zone.left[1])}%`,
  };
};

const pickElement = (recentIds) => {
  // Never pick one of the last MAX_ACTIVE element types
  const available = ALL_ELEMENTS.filter(e => !recentIds.includes(e.id));
  const pool = available.length > 0 ? available : ALL_ELEMENTS;
  return pool[Math.floor(Math.random() * pool.length)];
};

let _uidCounter = 0;

const RandomTelemetry = () => {
  const [active, setActive] = useState([]);
  const recentIdsRef = useRef([]);    // last N element type ids
  const recentZonesRef = useRef([]); // last N zone indices

  const spawnOne = useCallback(() => {
    setActive(prev => {
      if (prev.length >= MAX_ACTIVE) return prev; // don't overfill

      const element = pickElement(recentIdsRef.current);
      const { zoneIdx, top, left } = pickZone(recentZonesRef.current);

      // Track recent so we don't repeat
      recentIdsRef.current = [element.id, ...recentIdsRef.current].slice(0, MAX_ACTIVE);
      recentZonesRef.current = [zoneIdx, ...recentZonesRef.current].slice(0, 3);

      const uid = ++_uidCounter;
      // Lifespan: 4–7 seconds — enough to notice, short enough to not linger
      const duration = rand(4, 7);

      return [...prev, { uid, element, top, left, duration }];
    });
  }, []);

  const removeOne = useCallback((uid) => {
    setActive(prev => prev.filter(item => item.uid !== uid));
  }, []);

  useEffect(() => {
    // Stagger the very first few spawns so they don't all appear at once
    const staggerTimers = [];
    for (let i = 0; i < MAX_ACTIVE; i++) {
      staggerTimers.push(setTimeout(spawnOne, i * 900));
    }

    // Then keep spawning one at a time on an interval
    const interval = setInterval(spawnOne, SPAWN_INTERVAL_MS);

    return () => {
      staggerTimers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [spawnOne]);

  return (
    <Overlay>
      <AnimatePresence>
        {active.map(item => (
          <TelemetryItem
            key={item.uid}
            item={item}
            onExpired={() => removeOne(item.uid)}
          />
        ))}
      </AnimatePresence>
    </Overlay>
  );
};

const TelemetryItem = ({ item, onExpired }) => {
  useEffect(() => {
    const timer = setTimeout(onExpired, item.duration * 1000);
    return () => clearTimeout(timer);
  }, [item.duration, onExpired]);

  return (
    <Item
      style={{ top: item.top, left: item.left }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {item.element.render()}
    </Item>
  );
};

TelemetryItem.propTypes = {
  item: PropTypes.shape({
    uid: PropTypes.number.isRequired,
    top: PropTypes.string.isRequired,
    left: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    element: PropTypes.shape({
      render: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  onExpired: PropTypes.func.isRequired,
};

export default RandomTelemetry;
