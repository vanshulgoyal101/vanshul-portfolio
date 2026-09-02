// src/components/FunElements/Magnetic.jsx
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { magneticOffset } from '../../utils/magnetic';

const Magnetic = ({ children, range = 40 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () => setIsEnabled(pointer.matches && !reducedMotion.matches);
    evaluate();

    pointer.addEventListener('change', evaluate);
    reducedMotion.addEventListener('change', evaluate);
    return () => {
      pointer.removeEventListener('change', evaluate);
      reducedMotion.removeEventListener('change', evaluate);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!isEnabled || !ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPosition(
      magneticOffset(
        e.clientX - (left + width / 2),
        e.clientY - (top + height / 2),
        range
      )
    );
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.1 }}
      style={{ display: 'inline-block' }}
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
