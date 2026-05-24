// src/components/Hero/FloatingShape.jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  MeshDistortMaterial, 
  Float, 
  Environment,
  ContactShadows,
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Create gradient texture for the main 3D mesh
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 128, 128);
    
    gradient.addColorStop(0, '#f59e0b'); // Solar Amber
    gradient.addColorStop(0.5, '#38bdf8'); // Celestial Blue
    gradient.addColorStop(1, '#f59e0b');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, []);

  // Animate shape rotations and distortion properties
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
      meshRef.current.rotation.y = time * 0.15;
      meshRef.current.position.y = Math.sin(time * 0.4) * 0.08;
    }
    
    if (materialRef.current) {
      materialRef.current.distort = 0.35 + Math.sin(time * 0.4) * 0.15;
      materialRef.current.speed = 1.2 + Math.sin(time * 0.2) * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      
      {/* Dynamic Directional lights targeting gold/blue glows */}
      <directionalLight
        position={[8, 8, 4]}
        intensity={1.2}
        castShadow
      />
      
      <pointLight position={[-8, -8, -4]} intensity={0.6} color="#38bdf8" />
      
      <spotLight
        position={[0, 8, 0]}
        intensity={0.4}
        angle={0.5}
        penumbra={1}
        color="#f59e0b"
      />
      
      <Environment preset="city" />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      {/* Main floating solar-distorted body */}
      <Float
        speed={2}
        rotationIntensity={0.8}
        floatIntensity={1.5}
        floatingRange={[-0.08, 0.08]}
      >
        <mesh ref={meshRef} castShadow receiveShadow scale={1.4}>
          <icosahedronGeometry args={[1, 3]} />
          
          <MeshDistortMaterial
            ref={materialRef}
            color="#fbbf24"
            map={gradientTexture}
            emissive="#d97706"
            emissiveIntensity={0.15}
            roughness={0.15}
            metalness={0.75}
            distort={0.3}
            speed={1.5}
            envMapIntensity={1}
          />
        </mesh>
      </Float>
      
      {/* Orbiting stardust satellites */}
      {[...Array(3)].map((_, i) => (
        <Float
          key={i}
          speed={1.2 + i * 0.4}
          rotationIntensity={0.4}
          floatIntensity={0.8}
          floatingRange={[-0.15, 0.15]}
        >
          <mesh
            position={[
              Math.sin(i * Math.PI * 2 / 3) * 2.8,
              Math.cos(i * Math.PI * 2 / 3) * 0.3,
              Math.cos(i * Math.PI * 2 / 3) * 2.8
            ]}
            scale={0.22}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0ea5e9"
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}
      
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.25}
        scale={8}
        blur={2}
        far={6}
        color="#0c0f1a"
      />
      
      <Particles />
    </>
  );
};

// Orbit Particle system representing space stardust
const Particles = () => {
  const particlesRef = useRef();
  const particleCount = 80;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 8;
      pos[i + 1] = (Math.random() - 0.5) * 8;
      pos[i + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
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
          key={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#38bdf8"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

export default FloatingShape;