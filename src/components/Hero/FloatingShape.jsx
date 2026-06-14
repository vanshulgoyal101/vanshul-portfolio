// src/components/Hero/FloatingShape.jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Float,
  OrbitControls,
  ContactShadows,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';

// ─── Rich gradient texture baked at startup (no runtime cost) ─────────────────
const useGradientTexture = () =>
  useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Diagonal gradient: deep navy → electric blue → indigo
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0,    '#0f172a'); // slate-900
    g.addColorStop(0.35, '#1d4ed8'); // blue-700
    g.addColorStop(0.65, '#3b82f6'); // blue-500
    g.addColorStop(1,    '#6366f1'); // indigo-500

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

// ─── Main scene ───────────────────────────────────────────────────────────────
const FloatingShape = () => {
  const meshRef    = useRef();
  const materialRef = useRef();
  const ringRef    = useRef();
  const gradientTexture = useGradientTexture();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18;
      meshRef.current.rotation.x = Math.sin(t * 0.25) * 0.15;
    }

    if (materialRef.current) {
      // Breathe the distortion
      materialRef.current.distort       = 0.38 + Math.sin(t * 0.4) * 0.15;
      materialRef.current.emissiveIntensity = 0.25 + Math.sin(t * 0.6) * 0.12;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.12;
      ringRef.current.rotation.z = t * 0.08;
    }
  });

  return (
    <>
      {/* ── Lighting ──────────────────────────────────────────────────────── */}
      <ambientLight intensity={0.35} />

      {/* Key — warm cool from top-right */}
      <directionalLight position={[8, 12, 6]}  intensity={1.6} color="#e0f2fe" />

      {/* Fill — electric blue from left */}
      <pointLight position={[-10, 2, -4]}  intensity={2.5}  color="#3b82f6" />

      {/* Rim — indigo from behind */}
      <pointLight position={[0, -6, -8]}   intensity={1.8}  color="#6366f1" />

      {/* Glow accent — from below */}
      <pointLight position={[3, -4, 6]}    intensity={1.2}  color="#1d4ed8" />

      {/* ── Interactive orbit ─────────────────────────────────────────────── */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
      />

      {/* ── Core morphing orb ─────────────────────────────────────────────── */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.8} floatingRange={[-0.15, 0.15]}>
        <mesh ref={meshRef} scale={1.65} castShadow>
          {/* level 4 → smooth silhouette */}
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            ref={materialRef}
            map={gradientTexture}
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.3}
            roughness={0.05}
            metalness={0.85}
            distort={0.42}
            speed={2.5}
            transparent
            opacity={0.97}
          />
        </mesh>
      </Float>

      {/* ── Orbiting torus ring ───────────────────────────────────────────── */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={ringRef} scale={1.65} castShadow>
          {/* thin ring around the orb */}
          <torusGeometry args={[1.45, 0.018, 12, 90]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* ── Second inner ring at an offset angle ─────────────────────────── */}
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh rotation={[Math.PI / 2.5, 0.4, 0]} scale={1.65}>
          <torusGeometry args={[1.55, 0.01, 8, 90]} />
          <meshStandardMaterial
            color="#a5b4fc"
            emissive="#6366f1"
            emissiveIntensity={0.9}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.55}
          />
        </mesh>
      </Float>

      {/* ── Three orbiting octahedron satellites ─────────────────────────── */}
      {[0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3;
        return (
          <Float key={i} speed={1.6 + i * 0.3} rotationIntensity={1} floatIntensity={1.2}>
            <mesh
              position={[Math.sin(angle) * 2.9, Math.cos(angle) * 0.6, Math.cos(angle) * 2.9]}
              scale={0.28 + i * 0.04}
            >
              <octahedronGeometry args={[1, 0]} />
              <MeshWobbleMaterial
                color="#1d4ed8"
                emissive="#6366f1"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.08}
                factor={0.4}
                speed={2}
              />
            </mesh>
          </Float>
        );
      })}

      {/* ── Sparkles (built-in Drei — zero custom shader cost) ───────────── */}
      <Sparkles
        count={60}
        scale={7}
        size={1.4}
        speed={0.3}
        opacity={0.55}
        color="#93c5fd"
      />

      {/* ── Soft contact shadow for grounding ────────────────────────────── */}
      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.22}
        scale={9}
        blur={2.5}
        far={8}
        color="#1d4ed8"
      />
    </>
  );
};

export default FloatingShape;