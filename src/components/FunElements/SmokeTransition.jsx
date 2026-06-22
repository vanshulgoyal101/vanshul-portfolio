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

// Particle class representing a pooled smoke puff
class SmokeParticle {
  constructor(x, y) {
    this.reset(x, y);
    this.maxSize = Math.max(window.innerWidth, window.innerHeight) * 0.95;
    
    // Target background color #f6f3eb (246, 243, 235)
    this.targetR = 246;
    this.targetG = 243;
    this.targetB = 235;
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
      // Neon Cyan
      this.r = 6; this.g = 182; this.b = 212;
    } else if (rand < 0.5) {
      // Hot Magenta
      this.r = 236; this.g = 72; this.b = 153;
    } else if (rand < 0.75) {
      // Electric Violet
      this.r = 139; this.g = 92; this.b = 246;
    } else {
      // Soft Smoke Grey (slate-400)
      this.r = 148; this.g = 163; this.b = 184;
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
    ctx.beginPath();
    
    // Pre-calculated offset radius to keep GPU drawings lightweight
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 1,
      this.x, this.y, this.size
    );
    
    const floorR = Math.floor(this.r);
    const floorG = Math.floor(this.g);
    const floorB = Math.floor(this.b);
    
    gradient.addColorStop(0, `rgba(${floorR}, ${floorG}, ${floorB}, ${this.opacity})`);
    gradient.addColorStop(0.25, `rgba(${floorR}, ${floorG}, ${floorB}, ${this.opacity * 0.4})`);
    gradient.addColorStop(1, `rgba(${floorR}, ${floorG}, ${floorB}, 0)`); // fade to transparent particle color
    
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const SmokeTransition = () => {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const poolRef = useRef(new ParticlePool());

  useEffect(() => {
    const handleLaunch = () => {
      setIsActive(true);
      poolRef.current.clear();
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

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const handleEmitSmoke = (e) => {
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

    let frameId;
    let startTime = Date.now();
    let scrollTriggered = false;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

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

      // Smoothly scroll down
      if (elapsed > 350 && !scrollTriggered) {
        scrollTriggered = true;
        const aboutEl = document.getElementById('about');
        if (aboutEl) {
          aboutEl.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Terminate transition loop when all particles are processed
      if (elapsed > 800 && pool.active.length === 0) {
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
