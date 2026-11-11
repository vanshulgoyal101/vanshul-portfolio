// src/components/FunElements/Magnetic.jsx
import { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';
import { magneticOffset } from '../../utils/magnetic';

const SPRING = { stiffness: 180, damping: 22, mass: 0.1 };

const Magnetic = ({ children, range = 40 }) => {
  const ref = useRef(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () => {
      setIsEnabled(pointer.matches && !reducedMotion.matches);
      x.jump(0);
      y.jump(0);
    };
    evaluate();

    pointer.addEventListener('change', evaluate);
    reducedMotion.addEventListener('change', evaluate);
    return () => {
      pointer.removeEventListener('change', evaluate);
      reducedMotion.removeEventListener('change', evaluate);
    };
  }, [x, y]);

  const handleMouseMove = (e) => {
    if (!isEnabled || !ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const offset = magneticOffset(
      e.clientX - (left + width / 2),
      e.clientY - (top + height / 2),
      range
    );
    x.set(offset.x);
    y.set(offset.y);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

Magnetic.propTypes = {
  children: PropTypes.node.isRequired,
  range: PropTypes.number,
};

export default Magnetic;
