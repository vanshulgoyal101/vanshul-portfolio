// src/components/Hero/FloatingShape.jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  MeshDistortMaterial, 
  Float, 
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Create gradient texture for the material
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 128, 128);
    
    gradient.addColorStop(0, '#1d4ed8');
    gradient.addColorStop(0.5, '#3b82f6');
    gradient.addColorStop(1, '#1d4ed8');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, []);

  // Animate the shape
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      meshRef.current.rotation.y = time * 0.2;
      
      // Subtle position animation
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
    
    if (materialRef.current) {
      // Animate material properties
      materialRef.current.distort = 0.4 + Math.sin(time * 0.5) * 0.2;
      materialRef.current.speed = 1 + Math.sin(time * 0.3) * 0.5;
    }
  });

  return (
    <>
      {/* Simplified lighting - no HDR environment needed */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-8, -8, -4]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#1d4ed8" />
      
      {/* Orbit controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      {/* Main floating shape */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.1, 0.1]}>
        <mesh ref={meshRef} scale={1.5}>
          <icosahedronGeometry args={[1, 3]} />
          <MeshDistortMaterial
            ref={materialRef}
            color="#3b82f6"
            map={gradientTexture}
            emissive="#1d4ed8"
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.7}
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>
      
      {/* Secondary floating orbs */}
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={1.5 + i * 0.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh
            position={[
              Math.sin(i * Math.PI * 2 / 3) * 3,
              Math.cos(i * Math.PI * 2 / 3) * 0.5,
              Math.cos(i * Math.PI * 2 / 3) * 3,
            ]}
            scale={0.3}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.5} metalness={0.8} roughness={0.15} />
          </mesh>
        </Float>
      ))}
      
      <Particles />
    </>
  );
};

// Particle system - kept lightweight
const Particles = () => {
  const particlesRef = useRef();
  const particleCount = 40;
  
  // Generate random positions
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 10;
      pos[i + 1] = (Math.random() - 0.5) * 10;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);
  
  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export default FloatingShape;