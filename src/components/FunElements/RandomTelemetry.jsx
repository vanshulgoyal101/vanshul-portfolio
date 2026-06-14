// src/components/FunElements/RandomTelemetry.jsx
import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const TelemetryOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const ItemWrapper = styled(motion.div)`
  position: absolute;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

// ─── All element types ────────────────────────────────────────────────────────

const ELEMENTS = [
  // SVG Graphics
  { id: 'orbit', render: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke="#1d4ed8" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="18" cy="18" r="5" fill="none" stroke="#1d4ed8" strokeWidth="1" />
      <circle cx="32" cy="18" r="2.5" fill="#3b82f6" />
      <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="10s" repeatCount="indefinite" />
    </svg>
  )},
  { id: 'constellation', render: () => (
    <svg width="50" height="50" viewBox="0 0 50 50">
      <line x1="8" y1="40" x2="25" y2="10" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
      <line x1="25" y1="10" x2="42" y2="28" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
      <line x1="42" y1="28" x2="18" y2="25" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
      <line x1="18" y1="25" x2="8" y2="40" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
      <circle cx="8" cy="40" r="2" fill="#1d4ed8" />
      <circle cx="25" cy="10" r="3" fill="#1d4ed8" />
      <circle cx="42" cy="28" r="2" fill="#1d4ed8" />
      <circle cx="18" cy="25" r="2.5" fill="#3b82f6" />
    </svg>
  )},
  { id: 'wave', render: () => (
    <svg width="60" height="30" viewBox="0 0 60 30">
      <path d="M 0 15 Q 15 3, 30 15 T 60 15" fill="none" stroke="#1d4ed8" strokeWidth="1.2" opacity="0.7" />
      <path d="M 0 20 Q 15 8, 30 20 T 60 20" fill="none" stroke="#3b82f6" strokeWidth="0.7" opacity="0.4" />
      <line x1="0" y1="15" x2="60" y2="15" stroke="#1d4ed8" strokeWidth="0.3" strokeDasharray="2 3" opacity="0.3" />
    </svg>
  )},
  { id: 'hexagon', render: () => (
    <svg width="40" height="46" viewBox="0 0 40 46">
      <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="none" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.7" />
      <polygon points="20,10 30,16 30,30 20,36 10,30 10,16" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
      <circle cx="20" cy="23" r="3" fill="#1d4ed8" opacity="0.5" />
    </svg>
  )},
  { id: 'spiral', render: () => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <path d="M22 22 Q28 16 22 10 Q10 4 4 16 Q-2 28 8 36 Q20 44 32 38 Q44 30 42 18 Q40 6 28 4"
        fill="none" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
      <circle cx="22" cy="22" r="2" fill="#3b82f6" opacity="0.8" />
    </svg>
  )},
  { id: 'diamond', render: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <polygon points="16,2 30,16 16,30 2,16" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.7" />
      <polygon points="16,8 24,16 16,24 8,16" fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.4" />
      <line x1="16" y1="2" x2="16" y2="30" stroke="#1d4ed8" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.3" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="#1d4ed8" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.3" />
    </svg>
  )},
  { id: 'dna', render: () => (
    <svg width="24" height="50" viewBox="0 0 24 50">
      {[0,8,16,24,32,40].map((y, i) => (
        <g key={i}>
          <line x1="2" y1={y+4} x2="22" y2={y+4} stroke="#1d4ed8" strokeWidth="0.8" opacity="0.5" />
          <circle cx={i % 2 === 0 ? 2 : 22} cy={y+4} r="2" fill="#3b82f6" opacity="0.7" />
        </g>
      ))}
      <path d="M4 2 Q20 12 4 22 Q20 32 4 42" fill="none" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.6" />
      <path d="M20 2 Q4 12 20 22 Q4 32 20 42" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.6" />
    </svg>
  )},
  { id: 'flower', render: () => (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 20 + Math.cos(rad) * 10;
        const cy = 20 + Math.sin(rad) * 10;
        return <ellipse key={i} cx={cx} cy={cy} rx="5" ry="3" transform={`rotate(${angle} ${cx} ${cy})`}
          fill="none" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.5" />;
      })}
      <circle cx="20" cy="20" r="4" fill="#3b82f6" opacity="0.6" />
    </svg>
  )},
  { id: 'grid-dot', render: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      {[6,12,18,24,30].map(x =>
        [6,12,18,24,30].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#1d4ed8"
            opacity={0.1 + Math.random() * 0.5} />
        ))
      )}
    </svg>
  )},
  { id: 'triangle', render: () => (
    <svg width="40" height="36" viewBox="0 0 40 36">
      <polygon points="20,2 38,34 2,34" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.6" />
      <polygon points="20,10 30,30 10,30" fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.3" />
      <circle cx="20" cy="18" r="2.5" fill="#1d4ed8" opacity="0.5" />
    </svg>
  )},

  // Music / Audio
  { id: 'music-note', render: () => (
    <svg width="28" height="36" viewBox="0 0 28 36">
      <path d="M12 28 L12 8 L26 5 L26 16" stroke="#1d4ed8" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="9" cy="29" r="4" fill="none" stroke="#1d4ed8" strokeWidth="1.2" opacity="0.7" />
      <circle cx="23" cy="17" r="4" fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.6" />
    </svg>
  )},
  { id: 'equalizer', render: () => (
    <svg width="30" height="28" viewBox="0 0 30 28">
      {[3, 9, 15, 21, 27].map((x, i) => {
        const h = [14, 20, 10, 18, 12][i];
        return <rect key={x} x={x} y={28 - h} width="3" height={h} rx="1.5"
          fill="#1d4ed8" opacity="0.6" />;
      })}
    </svg>
  )},

  // Math / Code
  { id: 'pi', render: () => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: '#1d4ed8', opacity: 0.35, fontWeight: 700 }}>π</div>
  )},
  { id: 'infinity', render: () => (
    <svg width="50" height="28" viewBox="0 0 50 28">
      <path d="M25 14 C25 14 18 4 10 4 C2 4 2 24 10 24 C18 24 25 14 25 14 C25 14 32 4 40 4 C48 4 48 24 40 24 C32 24 25 14 25 14 Z"
        fill="none" stroke="#1d4ed8" strokeWidth="1.2" opacity="0.6" />
    </svg>
  )},
  { id: 'brackets', render: () => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', color: '#1d4ed8', opacity: 0.3, letterSpacing: '0.1em' }}>{'{ }'}</div>
  )},
  { id: 'sigma', render: () => (
    <div style={{ fontFamily: 'serif', fontSize: '2rem', color: '#1d4ed8', opacity: 0.3, fontWeight: 400 }}>Σ</div>
  )},
  { id: 'code-snippet', render: () => (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#1d4ed8', opacity: 0.3,
      lineHeight: 1.6, whiteSpace: 'pre', textAlign: 'left'
    }}>
      {`const joy =\n  () => ∞;`}
    </div>
  )},
  { id: 'binary', render: () => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#1d4ed8', opacity: 0.25, lineHeight: 1.8 }}>
      {['01001000', '01101001', '00100001'].map((b, i) => <div key={i}>{b}</div>)}
    </div>
  )},

  // Minimal text
  { id: 'quote-1', render: () => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#1d4ed8', opacity: 0.22, textAlign: 'center', maxWidth: '100px', lineHeight: 1.6 }}>
      "Stay curious,<br/>keep building"
    </div>
  )},
  { id: 'haiku', render: () => (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '0.5rem', color: '#1d4ed8', opacity: 0.22, textAlign: 'center', fontStyle: 'italic', lineHeight: 2 }}>
      code flows like water<br/>
      a bug hides in still water<br/>
      the fix: deep breathing
    </div>
  )},
  { id: 'coords', render: () => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#475569', opacity: 0.3 }}>
      [{(28.6 + Math.random() * 0.1).toFixed(4)}°N,&nbsp;
      {(77.2 + Math.random() * 0.1).toFixed(4)}°E]
    </div>
  )},
  { id: 'timestamp', render: () => {
    const now = new Date();
    return (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: '#475569', opacity: 0.28 }}>
        T+{String(now.getHours()).padStart(2,'0')}:{String(now.getMinutes()).padStart(2,'0')}:{String(now.getSeconds()).padStart(2,'0')}<br />
        <span style={{ opacity: 0.5 }}>EPOCH_{now.getTime()}</span>
      </div>
    );
  }},

  // Abstract geometric
  { id: 'cross', render: () => (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <line x1="12" y1="2" x2="12" y2="22" stroke="#1d4ed8" strokeWidth="1" opacity="0.4" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="#1d4ed8" strokeWidth="1" opacity="0.4" />
      <circle cx="12" cy="12" r="2" fill="#3b82f6" opacity="0.5" />
    </svg>
  )},
  { id: 'concentric', render: () => (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {[18, 13, 8, 4].map((r, i) => (
        <circle key={r} cx="20" cy="20" r={r} fill="none" stroke="#1d4ed8"
          strokeWidth="0.6" opacity={0.15 + i * 0.12} />
      ))}
      <circle cx="20" cy="20" r="1.5" fill="#3b82f6" opacity="0.6" />
    </svg>
  )},
  { id: 'arrow-flow', render: () => (
    <svg width="50" height="20" viewBox="0 0 50 20">
      <path d="M2 10 L36 10" stroke="#1d4ed8" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M30 5 L40 10 L30 15" stroke="#1d4ed8" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="6" cy="10" r="2" fill="#3b82f6" opacity="0.6" />
    </svg>
  )},
  { id: 'corner-marks', render: () => (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <path d="M2 10 L2 2 L10 2" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.5" />
      <path d="M26 2 L34 2 L34 10" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.5" />
      <path d="M2 26 L2 34 L10 34" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.5" />
      <path d="M26 34 L34 34 L34 26" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.5" />
    </svg>
  )},
  { id: 'sine', render: () => (
    <svg width="70" height="30" viewBox="0 0 70 30">
      <path d="M 0 15 C 6 3, 12 3, 18 15 C 24 27, 30 27, 36 15 C 42 3, 48 3, 54 15 C 60 27, 66 27, 70 20"
        fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.5" />
      <line x1="0" y1="15" x2="70" y2="15" stroke="#1d4ed8" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.25" />
    </svg>
  )},
];

// Pool of positions to avoid clustering
const createRandomItem = (id) => {
  const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
  return {
    uid: `${id}-${Date.now()}-${Math.random()}`,
    stableId: id,
    element,
    top: `${Math.random() * 78 + 5}%`,
    left: `${Math.random() * 82 + 4}%`,
    duration: Math.random() * 8 + 6,   // 6–14s
    delay: Math.random() * 2,
    rotate: (Math.random() - 0.5) * 30,
    scale: 0.7 + Math.random() * 0.6,
  };
};

const RandomTelemetry = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Stagger initial placement
    const initial = Array.from({ length: 12 }, (_, i) => createRandomItem(i));
    setItems(initial);
  }, []);

  const handleAnimationComplete = useCallback((stableId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.stableId === stableId ? createRandomItem(stableId) : item
      )
    );
  }, []);

  return (
    <TelemetryOverlay>
      <AnimatePresence>
        {items.map((item) => (
          <ItemWrapper
            key={item.uid}
            style={{ top: item.top, left: item.left }}
            initial={{ opacity: 0, scale: item.scale * 0.85, rotate: item.rotate - 5 }}
            animate={{ opacity: [0, 0.9, 0.9, 0], scale: [item.scale * 0.85, item.scale, item.scale, item.scale * 0.9], rotate: [item.rotate - 5, item.rotate, item.rotate, item.rotate + 5] }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              times: [0, 0.15, 0.8, 1],
              ease: 'easeInOut',
            }}
            onAnimationComplete={() => handleAnimationComplete(item.stableId)}
          >
            {item.element.render()}
          </ItemWrapper>
        ))}
      </AnimatePresence>
    </TelemetryOverlay>
  );
};

export default RandomTelemetry;
