// src/components/Hero/HeroScene.jsx
// Isolated so three.js + @react-three/* stay in an async chunk instead of the
// first-paint bundle. Only ever rendered in the browser.
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import FloatingShape from './FloatingShape';

const HeroScene = () => {
  const container = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let inView = false;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(container.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <div ref={container} data-scene-active={active} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        frameloop={active ? 'always' : 'never'}
        fallback={null}
      >
        <FloatingShape />
      </Canvas>
    </div>
  );
};

export default HeroScene;
