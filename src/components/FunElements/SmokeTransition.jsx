import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const SmokeCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
`;

const SmokeTransition = () => {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const particlesRef = useRef([]);

  useEffect(() => {
    const handleLaunch = () => {
      setIsActive(true);
      particlesRef.current = [];
    };

    window.addEventListener('rocket-launch', handleLaunch);
    return () => {
      window.removeEventListener('rocket-launch', handleLaunch);
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // High fidelity Particle simulation representing expanding exhaust
    class SmokeParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.maxSize = Math.max(window.innerWidth, window.innerHeight) * 0.95;
        
        // Fast initial speed to expand away quickly
        this.speedX = (Math.random() - 0.5) * 12;
        this.speedY = Math.random() * 6 + 3; 
        
        this.opacity = 0.95;
        // Faster growth for snappy appearance
        this.growth = Math.random() * 16 + 10;
        
        const rand = Math.random();
        if (rand < 0.33) {
          // Neon Cyan
          this.r = 6; this.g = 182; this.b = 212;
        } else if (rand < 0.66) {
          // Hot Magenta
          this.r = 236; this.g = 72; this.b = 153;
        } else {
          // Electric Violet/Purple
          this.r = 139; this.g = 92; this.b = 246;
        }
        
        this.targetR = 246;
        this.targetG = 243;
        this.targetB = 235;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += this.growth;
        
        // Faster damping for snappy spread
        this.speedX *= 0.92;
        this.speedY *= 0.92;

        this.r += (this.targetR - this.r) * 0.12;
        this.g += (this.targetG - this.g) * 0.12;
        this.b += (this.targetB - this.b) * 0.12;
        
        // Dissipate faster (matching the faster scroll)
        this.opacity -= 0.024;
      }

      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.beginPath();
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, this.size * 0.02,
          this.x, this.y, this.size
        );
        
        const floorR = Math.floor(this.r);
        const floorG = Math.floor(this.g);
        const floorB = Math.floor(this.b);
        
        gradient.addColorStop(0, `rgba(${floorR}, ${floorG}, ${floorB}, ${this.opacity})`);
        gradient.addColorStop(0.3, `rgba(${floorR}, ${floorG}, ${floorB}, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${this.targetR}, ${this.targetG}, ${this.targetB}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const handleEmitSmoke = (e) => {
      const { x, y } = e.detail;
      for (let i = 0; i < 4; i++) {
        particlesRef.current.push(new SmokeParticle(
          x + (Math.random() - 0.5) * 15,
          y + (Math.random() - 0.5) * 10
        ));
      }
    };
    window.addEventListener('rocket-emit-smoke', handleEmitSmoke);

    let frameId;
    let startTime = Date.now();
    let scrollTriggered = false;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.opacity <= 0 || p.size > p.maxSize) {
          particles.splice(i, 1);
        }
      }

      // Smoothly initiate scroll during flight (snappy 350ms trigger)
      if (elapsed > 350 && !scrollTriggered) {
        scrollTriggered = true;
        const aboutEl = document.getElementById('about');
        if (aboutEl) {
          aboutEl.scrollIntoView({ behavior: 'smooth' });
        }
      }

      if (elapsed > 800 && particles.length === 0) {
        setIsActive(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('rocket-emit-smoke', handleEmitSmoke);
    };
  }, [isActive]);

  return <SmokeCanvas ref={canvasRef} />;
};

export default SmokeTransition;
