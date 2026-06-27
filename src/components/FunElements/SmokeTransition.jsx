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

// Particle Pool Manager to prevent GC jank during high-frequency emissions
class ParticlePool {
  constructor() {
    this.pool = [];
    this.active = [];
  }

  // Retrieve a particle from the pool or instantiate one if empty
  obtain(x, y) {
    let p;
    if (this.pool.length > 0) {
      p = this.pool.pop();
      p.reset(x, y);
    } else {
      p = new SmokeParticle(x, y);
    }
    this.active.push(p);
    return p;
  }

  // Recycle active particles back to the pool
  recycle(index) {
    const p = this.active[index];
    this.active.splice(index, 1);
    this.pool.push(p);
  }

  clear() {
    this.active = [];
  }
}

// Pre-render a smoke puff gradient to a small offscreen canvas to avoid createRadialGradient calls inside the frame loop.
const createOffscreenSmokeCanvas = (r, g, b) => {
  const size = 128; // 128x128 provides crisp quality and fits scaling perfectly
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 1, half, half, half);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  gradient.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.4)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas;
};

const colorDefs = [
  { r: 6, g: 182, b: 212 },   // Neon Cyan
  { r: 236, g: 72, b: 153 },  // Hot Magenta
  { r: 139, g: 92, b: 246 },  // Electric Violet
  { r: 148, g: 163, b: 184 }, // Soft Smoke Grey
];

// Cache the canvases statically outside render loop
const cachedCanvases = colorDefs.map(c => createOffscreenSmokeCanvas(c.r, c.g, c.b));

// Background color canvas for blending (246, 243, 235)
const bgCanvas = createOffscreenSmokeCanvas(246, 243, 235);

// Particle class representing a pooled smoke puff
class SmokeParticle {
  constructor(x, y) {
    this.reset(x, y);
    this.maxSize = Math.max(window.innerWidth, window.innerHeight) * 0.95;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 3;
    this.speedX = (Math.random() - 0.5) * 6;
    this.speedY = Math.random() * 3 + 1.5;
    this.opacity = 0.95;
    this.growth = Math.random() * 5 + 4; // slower growth for smoother expansion

    const rand = Math.random();
    if (rand < 0.25) {
      this.colorIndex = 0;
    } else if (rand < 0.5) {
      this.colorIndex = 1;
    } else if (rand < 0.75) {
      this.colorIndex = 2;
    } else {
      this.colorIndex = 3;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size += this.growth;
    
    // Smoother, less abrupt deceleration
    this.speedX *= 0.96;
    this.speedY *= 0.96;
    
    this.opacity -= 0.015; // fade out slower and smoother
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.save();
    
    // Calculate blending progress (0 = fully colored, 1 = morphed to bg)
    const progress = Math.min(1, (0.95 - this.opacity) / 0.7);
    const cachedCanvas = cachedCanvases[this.colorIndex];
    
    // Draw base color (slightly desaturates towards age)
    ctx.globalAlpha = this.opacity * (1 - progress * 0.65);
    ctx.drawImage(
      cachedCanvas,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2
    );
    
    // Overlay background color to merge seamlessly
    ctx.globalAlpha = this.opacity * progress * 0.65;
    ctx.drawImage(
      bgCanvas,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2
    );
    
    ctx.restore();
  }
}

const SmokeTransition = () => {
  const canvasRef = useRef(null);
  const poolRef = useRef(new ParticlePool());
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const scrollTriggeredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleEmitSmoke = (e) => {
      if (!isAnimatingRef.current) return;
      const { x, y } = e.detail;
      // Spawn 2 optimized particles every frame for a continuous dense trail
      for (let i = 0; i < 2; i++) {
        poolRef.current.obtain(
          x + (Math.random() - 0.5) * 10,
          y + (Math.random() - 0.5) * 6
        );
      }
    };
    window.addEventListener('rocket-emit-smoke', handleEmitSmoke);

    const animate = () => {
      if (!isAnimatingRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTimeRef.current;

      const pool = poolRef.current;
      // Loop backwards to allow clean splicing and recycling
      for (let i = pool.active.length - 1; i >= 0; i--) {
        const p = pool.active[i];
        p.update();
        p.draw(ctx);

        if (p.opacity <= 0 || p.size > p.maxSize) {
          pool.recycle(i);
        }
      }

      // Smoothly scroll down after the rocket has gained significant altitude
      if (elapsed > 550 && !scrollTriggeredRef.current) {
        scrollTriggeredRef.current = true;
        const aboutEl = document.getElementById('about');
        if (aboutEl) {
          aboutEl.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Terminate transition loop when all particles are processed
      if (elapsed > 800 && pool.active.length === 0) {
        isAnimatingRef.current = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const handleLaunch = () => {
      poolRef.current.clear();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      startTimeRef.current = Date.now();
      scrollTriggeredRef.current = false;

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('rocket-launch', handleLaunch);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('rocket-emit-smoke', handleEmitSmoke);
      window.removeEventListener('rocket-launch', handleLaunch);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <SmokeCanvas ref={canvasRef} />;
};

export default SmokeTransition;
