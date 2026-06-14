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
  
  // Create gradient texture for the material
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 128, 128);
    
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#6366f1');
    
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
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      
      {/* Key light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Fill light */}
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      
      {/* Rim light */}
      <spotLight
        position={[0, 10, 0]}
        intensity={0.5}
        angle={0.6}
        penumbra={1}
        color="#6366f1"
      />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Orbit controls for interactivity */}
      <OrbitControls
        enableZoom={false}
        enablePan={true}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      {/* Main floating shape */}
      <Float
        speed={3}
        rotationIntensity={1}
        floatIntensity={2}
        floatingRange={[-0.1, 0.1]}
      >
        <mesh ref={meshRef} castShadow receiveShadow scale={1.5}>
          {/* Icosahedron geometry for interesting shape */}
          <icosahedronGeometry args={[1, 4]} />
          
          {/* Distort material for organic feel */}
          <MeshDistortMaterial
            ref={materialRef}
            color="#8b5cf6"
            map={gradientTexture}
            emissive="#6366f1"
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.8}
            distort={0.4}
            speed={2}
            envMapIntensity={1}
          />
        </mesh>
      </Float>
      
      {/* Secondary floating elements */}
      {[...Array(3)].map((_, i) => (
        <Float
          key={i}
          speed={1.5 + i * 0.5}
          rotationIntensity={0.5}
          floatIntensity={1}
          floatingRange={[-0.2, 0.2]}
        >
          <mesh
            position={[
              Math.sin(i * Math.PI * 2 / 3) * 3,
              Math.cos(i * Math.PI * 2 / 3) * 0.5,
              Math.cos(i * Math.PI * 2 / 3) * 3
            ]}
            scale={0.3}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#8b5cf6"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Contact shadows for depth */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={10}
        blur={2}
        far={10}
        color="#8b5cf6"
      />
      
      {/* Particles for atmosphere */}
      <Particles />
    </>
  );
};

// Particle system component
const Particles = () => {
  const particlesRef = useRef();
  const particleCount = 100;
  
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
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export default FloatingShape;