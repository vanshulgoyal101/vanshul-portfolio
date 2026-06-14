// src/components/CelestialCanvas.jsx
import { useEffect, useRef } from 'react';

const CelestialCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let shootingStars = [];
    const starCount = Math.min(Math.floor(window.innerWidth / 8), 150);

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.15 + 0.02,
          opacity: Math.random() * 0.8 + 0.2,
          blinkSpeed: Math.random() * 0.02 + 0.005,
          blinkDir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint background nebula/glows
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        100,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      gradient.addColorStop(0, 'rgba(13, 13, 26, 0.4)');
      gradient.addColorStop(1, 'rgba(3, 3, 6, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render standard stars
      stars.forEach((star) => {
        // Star breathing/blinking
        star.opacity += star.blinkSpeed * star.blinkDir;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.blinkDir = -1;
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.blinkDir = 1;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${star.opacity})`;
        ctx.fill();

        // Slow horizontal movement to simulate rotation
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      // Spawn shooting stars periodically
      if (Math.random() < 0.0015 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 12 + 6,
          angle: (Math.random() * 20 + 10) * (Math.PI / 180), // angle down-left
          opacity: 1,
        });
      }

      // Render shooting stars
      shootingStars = shootingStars.filter((s) => {
        const dx = Math.cos(s.angle + Math.PI) * s.speed;
        const dy = Math.sin(s.angle) * s.speed;

        ctx.beginPath();
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
        grad.addColorStop(0, `rgba(0, 240, 255, ${s.opacity})`);
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - dx, s.y - dy);
        ctx.stroke();

        s.x += dx;
        s.y += dy;
        s.opacity -= 0.015;

        return s.opacity > 0 && s.x > 0 && s.y < canvas.height;
      });
    };

    const animate = () => {
      drawStars();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="celestial-backdrop" />;
};

export default CelestialCanvas;
