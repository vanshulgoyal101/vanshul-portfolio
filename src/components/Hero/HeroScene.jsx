// src/components/Hero/HeroScene.jsx
// Isolated so three.js + @react-three/* stay in an async chunk instead of the
// first-paint bundle. Only ever rendered in the browser.
import { Canvas } from '@react-three/fiber';

import FloatingShape from './FloatingShape';

const HeroScene = () => (
  <Canvas
    camera={{ position: [0, 0, 6], fov: 55 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    dpr={Math.min(window.devicePixelRatio, 1.5)}
  >
    <FloatingShape />
  </Canvas>
);

export default HeroScene;
