import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { scrollToSection } from '../../utils/scrollToSection';

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
  obtain(x, y, createdAt = performance.now()) {
    let p;
    if (this.pool.length > 0) {
      p = this.pool.pop();
      p.reset(x, y);
    } else {
      p = new SmokeParticle(x, y);
    }
    p.createdAt = createdAt;
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
    this.pool.push(...this.active);
    this.active.length = 0;
  }
}

// Pre-render a smoke puff gradient to a small offscreen canvas to avoid createRadialGradient calls inside the frame loop.
const createOffscreenSmokeCanvas = (r, g, b) => {
  const size = 128; // 128x128 provides crisp quality and fits scaling perfectly
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
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
  }

  reset(x, y) {
    this.maxSize = Math.max(window.innerWidth, window.innerHeight) * 0.95;
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

  update(milliseconds) {
    const frames = milliseconds / (1000 / 60);
    const damping = 0.96 ** frames;
    const travel = (1 - damping) / (1 - 0.96);
    this.x += this.speedX * travel;
    this.y += this.speedY * travel;
    this.size += this.growth * frames;
    this.speedX *= damping;
    this.speedY *= damping;
    this.opacity -= 0.015 * frames;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    ctx.save();
    
    // Calculate blending progress (0 = fully colored, 1 = morphed to bg)
    const progress = Math.min(1, (0.95 - this.opacity) / 0.7);
    const cachedCanvas = cachedCanvases[this.colorIndex];
    if (!cachedCanvas || !bgCanvas) {
      ctx.restore();
      return;
    }
    
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
    const ownedPool = poolRef.current;

    const ctx = canvas.getContext('2d', { alpha: true });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let previousEmission = null;
    let emissionRemainder = 0;
    let previousFrame = 0;

    const handleEmitSmoke = (e) => {
      if (!ctx) return;
      if (!isAnimatingRef.current) return;
      const { x, y } = e.detail;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const now = performance.now();
      const elapsed = previousEmission ? now - previousEmission.time : 0;
      if (!previousEmission || elapsed > 100) {
        emissionRemainder = 0;
        for (let count = 0; count < 2; count++) ownedPool.obtain(x, y);
      } else {
        const interval = 1000 / 120;
        const accumulated = emissionRemainder + elapsed;
        const count = Math.floor((accumulated + 1e-7) / interval);
        for (let index = 0; index < count; index++) {
          const offset = Math.min(elapsed, interval - emissionRemainder + index * interval);
          const fraction = elapsed > 0 ? offset / elapsed : 1;
          ownedPool.obtain(
            previousEmission.x + (x - previousEmission.x) * fraction,
            previousEmission.y + (y - previousEmission.y) * fraction,
            previousEmission.time + offset
          );
        }
        emissionRemainder = Math.max(0, accumulated - count * interval);
      }
      previousEmission = { x, y, time: now };
    };
    window.addEventListener('rocket-emit-smoke', handleEmitSmoke);

    const animate = (now) => {
      if (!isAnimatingRef.current) return;

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = now - startTimeRef.current;
      const delta = Math.max(0, now - previousFrame);
      previousFrame = now;

      const pool = poolRef.current;
      // Loop backwards to allow clean splicing and recycling
      for (let i = pool.active.length - 1; i >= 0; i--) {
        const p = pool.active[i];
        p.update(Math.max(0, Math.min(delta, now - p.createdAt)));

        if (p.opacity <= 0 || p.size > p.maxSize) {
          pool.recycle(i);
        } else {
          p.draw(ctx);
        }
      }

      // Smoothly scroll down after the rocket has gained significant altitude
      if (elapsed > 550 && !scrollTriggeredRef.current) {
        scrollTriggeredRef.current = true;
        scrollToSection('about', { focus: true });
      }

      // Terminate transition loop when all particles are processed
      if (elapsed > 800 && pool.active.length === 0) {
        isAnimatingRef.current = false;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const handleLaunch = () => {
      poolRef.current.clear();
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      startTimeRef.current = performance.now();
      previousFrame = startTimeRef.current;
      previousEmission = null;
      emissionRemainder = 0;
      scrollTriggeredRef.current = false;

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('rocket-launch', handleLaunch);

    return () => {
      isAnimatingRef.current = false;
      ownedPool.clear();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('rocket-emit-smoke', handleEmitSmoke);
      window.removeEventListener('rocket-launch', handleLaunch);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <SmokeCanvas ref={canvasRef} data-rocket-smoke aria-hidden="true" />;
};

export default SmokeTransition;
