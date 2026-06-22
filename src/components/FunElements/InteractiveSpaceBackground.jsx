// src/components/FunElements/InteractiveSpaceBackground.jsx
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.canvas`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0; /* Below all content, above basic body color */
  width: 100%;
  height: 100%;
`;

const InteractiveSpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic sizing on window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Blinking Stars pool (increased from 45 to 90 for a richer background)
    const stars = Array.from({ length: 90 }, () => {
      const isTwinklyStar = Math.random() > 0.8; // 20% multi-point twinkling stars
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isTwinklyStar ? Math.random() * 2 + 1.5 : Math.random() * 1.5 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        direction: Math.random() > 0.5 ? 1 : -1,
        // Drift speeds for floating effect
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        isTwinkly: isTwinklyStar,
        points: Math.floor(Math.random() * 2) + 4, // 4 or 5 point stars
      };
    });

    // Shooting Stars pool
    let shootingStars = [];
    const spawnShootingStar = () => {
      // Spawn from top-left direction zipping to bottom-right
      const side = Math.random() > 0.5;
      const startX = side ? Math.random() * (width * 0.7) : 0;
      const startY = side ? 0 : Math.random() * (height * 0.5);

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() * 0.1 - 0.05), // ~45 degrees diagonal
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01,
      });
    };

    // Planets pool (gentle decorative floating bodies with lifecycle)
    const planets = [
      {
        x: width * 0.15,
        y: height * 0.25,
        radius: 14,
        baseR: 59, baseG: 130, baseB: 246, // cyan/blue gas giant
        hasRing: true,
        ringR: 59, ringG: 130, ringB: 246,
        vx: 0.04,
        vy: 0.01,
        alpha: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.0004 + 0.0002,
        direction: Math.random() > 0.5 ? 1 : -1,
      },
      {
        x: width * 0.45,
        y: height * 0.8,
        radius: 9,
        baseR: 139, baseG: 92, baseB: 246, // soft violet planet
        hasRing: true,
        ringR: 139, ringG: 92, ringB: 246,
        vx: 0.02,
        vy: -0.02,
        alpha: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.0004 + 0.0002,
        direction: Math.random() > 0.5 ? 1 : -1,
      }
    ];

    // Auto spawn shooting stars occasionally
    const spawnInterval = setInterval(() => {
      if (shootingStars.length < 3 && Math.random() > 0.3) {
        spawnShootingStar();
      }
    }, 4000);

    // Radar click rings pool
    let radarRings = [];
    const handleGlobalClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const xPercent = ((x / window.innerWidth) * 100).toFixed(0);
      const yPercent = ((y / window.innerHeight) * 100).toFixed(0);

      radarRings.push({
        x,
        y,
        radius: 2,
        maxRadius: Math.random() * 30 + 35,
        alpha: 0.5,
        speed: 1.5,
        label: `TRK_LOC [${xPercent}%, ${yPercent}%]`
      });
    };
    window.addEventListener('click', handleGlobalClick);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 0. Draw floating background planets (slow and low-contrast to not distract)
      planets.forEach((planet) => {
        planet.x += planet.vx;
        planet.y += planet.vy;

        // Apply fade-in and fade-out animation cycle
        planet.alpha += planet.fadeSpeed * planet.direction;

        // If planet fades out completely, respawn at a random coordinate and trigger fade-in!
        if (planet.alpha <= 0) {
          planet.x = Math.random() * width;
          planet.y = Math.random() * height;
          planet.alpha = 0.01;
          planet.direction = 1;
          // Randomize speeds and trajectory
          planet.vx = (Math.random() - 0.5) * 0.06;
          planet.vy = (Math.random() - 0.5) * 0.06;
        } else if (planet.alpha >= 1) {
          planet.direction = -1;
        }

        // Screen wrap boundaries for planet sizes
        if (planet.x + planet.radius < 0) planet.x = width + planet.radius;
        if (planet.x - planet.radius > width) planet.x = -planet.radius;
        if (planet.y + planet.radius < 0) planet.y = height + planet.radius;
        if (planet.y - planet.radius > height) planet.y = -planet.radius;

        ctx.save();

        // Dynamic alphas (0.04 represents peak design visibility limit to avoid distraction)
        const activeAlpha = planet.alpha * 0.04;
        const bodyColor = `rgba(${planet.baseR}, ${planet.baseG}, ${planet.baseB}, ${activeAlpha})`;
        const ringColor = planet.hasRing ? `rgba(${planet.ringR}, ${planet.ringG}, ${planet.ringB}, ${planet.alpha * 0.03})` : '';

        // Draw orbital shadow/glow
        const glowGradient = ctx.createRadialGradient(
          planet.x, planet.y, planet.radius * 0.1,
          planet.x, planet.y, planet.radius * 1.5
        );
        glowGradient.addColorStop(0, bodyColor);
        glowGradient.addColorStop(1, 'rgba(246, 243, 235, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw planet body
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw rings if applicable
        if (planet.hasRing) {
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = Math.max(1, planet.radius * 0.15);
          ctx.save();
          // Scale/transform context to draw an oval/rotated ellipse ring
          ctx.translate(planet.x, planet.y);
          ctx.rotate(-Math.PI / 8); // 22.5 deg tilt
          ctx.scale(2, 0.45); // squish into ellipse ring
          ctx.beginPath();
          ctx.arc(0, 0, planet.radius * 1.3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      });

      // 1. Draw static blinking stars
      stars.forEach((star) => {
        // Drift/Float position
        star.x += star.vx;
        star.y += star.vy;

        // Twinkle/Blink animation
        star.alpha += star.speed * star.direction;

        // If star fades out completely, respawn it at a brand new random coordinate!
        if (star.alpha <= 0) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
          star.alpha = 0.01;
          star.direction = 1;
          // Assign new gentle drift speeds
          star.vx = (Math.random() - 0.5) * 0.25;
          star.vy = (Math.random() - 0.5) * 0.25;
        } else if (star.alpha >= 0.75) {
          star.direction = -1;
        }

        // Screen boundary wrapping
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.save();
        if (star.isTwinkly) {
          // Draw a twinkling multi-pointed cross star
          ctx.strokeStyle = `rgba(59, 130, 246, ${star.alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Horizontal line
          ctx.moveTo(star.x - star.size * 2, star.y);
          ctx.lineTo(star.x + star.size * 2, star.y);
          // Vertical line
          ctx.moveTo(star.x, star.y - star.size * 2);
          ctx.lineTo(star.x, star.y + star.size * 2);
          ctx.stroke();

          // Draw solid core
          ctx.fillStyle = `rgba(29, 78, 216, ${star.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard circular soft star
          ctx.fillStyle = `rgba(29, 78, 216, ${star.alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 1.5 Draw constellations (connect nearby stars with very thin faint lines)
      ctx.save();
      ctx.strokeStyle = 'rgba(29, 78, 216, 0.05)';
      ctx.lineWidth = 5;
      const maxDistance = 200; // max distance to connect stars

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const starA = stars[i];
          const starB = stars[j];
          const dist = Math.hypot(starA.x - starB.x, starA.y - starB.y);

          if (dist < maxDistance) {
            // Fade out the link line if either star is dim
            const lineAlpha = Math.min(starA.alpha, starB.alpha) * 0.04 * (1 - dist / maxDistance);
            ctx.strokeStyle = `rgba(29, 78, 216, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(starA.x, starA.y);
            ctx.lineTo(starB.x, starB.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 2. Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= ss.decay;

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const gradient = ctx.createLinearGradient(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length,
          ss.x,
          ss.y
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        gradient.addColorStop(1, `rgba(29, 78, 216, ${ss.alpha * 0.45})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }

      // 3. Draw radar rings on click
      for (let i = radarRings.length - 1; i >= 0; i--) {
        const ring = radarRings[i];
        ring.radius += ring.speed;
        ring.alpha -= 0.012;

        if (ring.alpha <= 0) {
          radarRings.splice(i, 1);
          continue;
        }

        // Circular ring
        ctx.strokeStyle = `rgba(29, 78, 216, ${ring.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Outer dotted accents
        ctx.strokeStyle = `rgba(59, 130, 246, ${ring.alpha * 0.5})`;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Coordinate text readout
        ctx.fillStyle = `rgba(30, 41, 59, ${ring.alpha * 0.8})`;
        ctx.font = '7px monospace';
        ctx.fillText(ring.label, ring.x + ring.radius + 10, ring.y + 3);

        // Minor targeting crosshair
        ctx.strokeStyle = `rgba(29, 78, 216, ${ring.alpha * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(ring.x - 3, ring.y);
        ctx.lineTo(ring.x + 3, ring.y);
        ctx.moveTo(ring.x, ring.y - 3);
        ctx.lineTo(ring.x, ring.y + 3);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleGlobalClick);
      clearInterval(spawnInterval);
    };
  }, []);

  return <CanvasContainer ref={canvasRef} />;
};

export default InteractiveSpaceBackground;
