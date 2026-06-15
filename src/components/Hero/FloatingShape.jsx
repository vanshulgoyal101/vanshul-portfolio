// src/components/Hero/FloatingShape.jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Float,
  OrbitControls,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';

// ─── Baked gradient texture — deep navy → electric blue → indigo ─────────────
const useGradientTexture = () =>
  useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0,    '#0b0f19'); // slate-950
    g.addColorStop(0.3,  '#1d4ed8'); // blue-700
    g.addColorStop(0.7,  '#3b82f6'); // blue-500
    g.addColorStop(1,    '#6366f1'); // indigo-500
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

// ─── Scene ────────────────────────────────────────────────────────────────────
const FloatingShape = () => {
  const knotRef = useRef();
  const wireframeRef = useRef();
  const innerRingRef = useRef();
  const outerRingRef = useRef();
  const gradientTexture = useGradientTexture();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Slow, elegant rotation for the central sculpture
    if (knotRef.current) {
      knotRef.current.rotation.y = t * 0.15;
      knotRef.current.rotation.x = t * 0.08;
    }

    // Spin the wireframe overlay slightly differently to create depth
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = t * 0.15;
      wireframeRef.current.rotation.x = t * 0.08;
    }

    // Gyroscopic tech rings rotating on different axes
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = -t * 0.25;
      innerRingRef.current.rotation.x = t * 0.12;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = -t * 0.18;
      outerRingRef.current.rotation.z = t * 0.22;
    }
  });

  return (
    <>
      {/* ── Lighting setup ───────────────────────────────────────────────── */}
      <ambientLight intensity={0.4} />

      {/* Main Key light — warm white */}
      <directionalLight
        position={[8, 8, 8]}
        intensity={2.2}
        color="#ffffff"
      />

      {/* Accent Point Light — Electric Blue */}
      <pointLight
        position={[-6, 4, -4]}
        intensity={3.0}
        color="#3b82f6"
      />

      {/* Rim Point Light — Indigo/Violet for depth */}
      <pointLight
        position={[4, -6, -6]}
        intensity={2.0}
        color="#6366f1"
      />

      {/* ── Interaction controls ────────────────────────────────────────── */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.5}
      />

      {/* ── Float group ─────────────────────────────────────────────────── */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={1.2}
        floatingRange={[-0.15, 0.15]}
      >
        <group>
          {/* Central Torus Knot (Main Sculpture) */}
          <mesh ref={knotRef} scale={1.25}>
            <torusKnotGeometry args={[0.9, 0.26, 120, 16]} />
            <meshStandardMaterial
              map={gradientTexture}
              color="#3b82f6"
              emissive="#1e3a8a"
              emissiveIntensity={0.25}
              roughness={0.12}
              metalness={0.9}
            />
          </mesh>

          {/* Wireframe overlay for a high-tech/engineering look */}
          <mesh ref={wireframeRef} scale={1.26}>
            <torusKnotGeometry args={[0.9, 0.26, 120, 16]} />
            <meshBasicMaterial
              color="#60a5fa"
              wireframe
              transparent
              opacity={0.15}
            />
          </mesh>

          {/* Gyroscopic Inner Ring */}
          <mesh ref={innerRingRef} scale={1.85}>
            <torusGeometry args={[1, 0.015, 12, 64]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Gyroscopic Outer Ring */}
          <mesh ref={outerRingRef} scale={2.15}>
            <torusGeometry args={[1, 0.012, 12, 64]} />
            <meshStandardMaterial
              color="#818cf8"
              emissive="#6366f1"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      </Float>

      {/* Subtle background particles */}
      <Sparkles
        count={25}
        scale={6}
        size={1.2}
        speed={0.15}
        opacity={0.35}
        color="#93c5fd"
      />
    </>
  );
};

export default FloatingShape;