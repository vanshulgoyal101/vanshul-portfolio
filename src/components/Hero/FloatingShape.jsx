// src/components/Hero/FloatingShape.jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  MeshDistortMaterial,
  Float,
  OrbitControls,
  ContactShadows,
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
    g.addColorStop(0,    '#0f172a'); // slate-900
    g.addColorStop(0.3,  '#1e3a8a'); // blue-900
    g.addColorStop(0.65, '#1d4ed8'); // blue-700
    g.addColorStop(1,    '#6366f1'); // indigo-500
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

// ─── Scene ────────────────────────────────────────────────────────────────────
const FloatingShape = () => {
  const meshRef     = useRef();
  const materialRef = useRef();
  const ringRef     = useRef();
  const gradientTexture = useGradientTexture();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Breathe the distortion gently
    if (materialRef.current) {
      materialRef.current.distort = 0.35 + Math.sin(t * 0.4) * 0.12;
      materialRef.current.emissiveIntensity = 0.28 + Math.sin(t * 0.55) * 0.1;
    }

    // Ring orbits around the orb's Y-axis — smooth and continuous
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <>
      {/* ── 3-light warm/cool setup ──────────────────────────────────────── */}

      {/* Ambient base — very dim so lights do the work */}
      <ambientLight intensity={0.25} />

      {/* Key — warm white from top-right, dominant */}
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.0}
        color="#fef3c7"
      />

      {/* Fill — electric blue from left, creates cool-warm contrast */}
      <pointLight
        position={[-9, 2, -3]}
        intensity={2.5}
        color="#3b82f6"
      />

      {/* Rim — soft indigo from below-behind for depth */}
      <pointLight
        position={[2, -5, -7]}
        intensity={1.2}
        color="#6366f1"
      />

      {/* ── Subtle mouse-drag orbit controls ─────────────────────────────── */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
        rotateSpeed={0.4}
      />

      {/* ── ONE Float group — orb + ring move as a single unit ───────────── */}
      <Float
        speed={1.8}
        rotationIntensity={0.4}
        floatIntensity={1.4}
        floatingRange={[-0.12, 0.12]}
      >
        <group>
          {/* Core morphing orb */}
          <mesh ref={meshRef} scale={1.7}>
            <icosahedronGeometry args={[1, 4]} />
            <MeshDistortMaterial
              ref={materialRef}
              map={gradientTexture}
              color="#3b82f6"
              emissive="#1d4ed8"
              emissiveIntensity={0.28}
              roughness={0.04}
              metalness={0.92}
              distort={0.38}
              speed={2.2}
            />
          </mesh>

          {/* Orbital ring — tilted 26° so it reads like a planet ring,
              rotates on Y via useFrame so it truly orbits the orb */}
          <mesh ref={ringRef} rotation={[Math.PI / 7, 0, 0]}>
            <torusGeometry args={[2.15, 0.022, 16, 100]} />
            <meshStandardMaterial
              color="#93c5fd"
              emissive="#3b82f6"
              emissiveIntensity={2.8}
              roughness={0.05}
              metalness={0.95}
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      </Float>

      {/* ── Sparkles — tight atmosphere around the orb ───────────────────── */}
      <Sparkles
        count={30}
        scale={5}
        size={1.1}
        speed={0.22}
        opacity={0.45}
        color="#bfdbfe"
      />

      {/* ── Soft ground shadow for spatial grounding ─────────────────────── */}
      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.18}
        scale={8}
        blur={2.8}
        far={7}
        color="#1d4ed8"
      />
    </>
  );
};

export default FloatingShape;