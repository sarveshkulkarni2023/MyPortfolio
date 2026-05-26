import { useEffect, useRef } from 'react';

export default function CyberCursor() {
  const canvasRef = useRef(null);
  
  // Track mouse coordinates and states in refs to completely bypass React re-renders!
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  const magneticElement = useRef(null);
  const hoverState = useRef({ active: false, x: 0, y: 0, width: 0, height: 0, progress: 0 });
  
  const particles = useRef([]);
  const lastTime = useRef(performance.now());
  const speed = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    // Detect touch device or narrow screen width to preserve mobile battery/CPU
    isMobile.current = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);
    if (isMobile.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Event delegation: capture hover on any interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, [role="button"], input[type="submit"], .interactive-hover, [data-interactive="true"]');
      if (target) {
        magneticElement.current = target;
        const rect = target.getBoundingClientRect();
        hoverState.current = {
          active: true,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          progress: 0,
        };
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('button, a, [role="button"], input[type="submit"], .interactive-hover, [data-interactive="true"]');
      if (target && magneticElement.current === target) {
        magneticElement.current = null;
        hoverState.current.active = false;
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    // Click quick ripple / burst trigger
    const handleMouseDown = () => {
      if (hoverState.current.active) return;
      // Quick energy burst particles on click
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speedMag = Math.random() * 3 + 2;
        const colors = ['#3B82F6', '#60A5FA', '#8B5CF6'];
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: Math.cos(angle) * speedMag,
          vy: Math.sin(angle) * speedMag,
          size: Math.random() * 3 + 3,
          maxLife: Math.random() * 300 + 200, // short lifetime
          life: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };
    window.addEventListener('mousedown', handleMouseDown);

    // Particle factory for motion trails
    const spawnParticle = (x, y, dx, dy) => {
      if (particles.current.length > 80) return; // Hard limit for high performance

      const angle = Math.random() * Math.PI * 2;
      const speedMag = Math.random() * 1.2 + 0.3;
      const colors = ['#3B82F6', '#60A5FA', '#8B5CF6'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.current.push({
        x,
        y,
        vx: -dx * 0.12 + Math.cos(angle) * speedMag * 0.3,
        vy: -dy * 0.12 + Math.sin(angle) * speedMag * 0.3,
        size: Math.random() * 2.5 + 1.5,
        maxLife: Math.random() * 600 + 400, // 0.4s to 1.0s fadeout
        life: 0,
        color,
      });
    };

    let animationFrameId;

    const render = () => {
      const now = performance.now();
      const dt = now - lastTime.current;
      lastTime.current = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Magnetic vs standard easing parameters
      const ease = hoverState.current.active ? 0.14 : 0.08;
      
      let targetX = mouse.current.targetX;
      let targetY = mouse.current.targetY;

      if (hoverState.current.active) {
        // Blend raw mouse coordinates with magnetic attraction coordinates
        targetX = hoverState.current.x + (mouse.current.targetX - hoverState.current.x) * 0.3;
        targetY = hoverState.current.y + (mouse.current.targetY - hoverState.current.y) * 0.3;
        hoverState.current.progress = Math.min(1, hoverState.current.progress + 0.15);
      } else {
        hoverState.current.progress = Math.max(0, hoverState.current.progress - 0.15);
      }

      // Smooth lag behind mouse coordinates
      mouse.current.x += (targetX - mouse.current.x) * ease;
      mouse.current.y += (targetY - mouse.current.y) * ease;

      // Distance moved (speed vector)
      const dx = mouse.current.x - lastMouse.current.x;
      const dy = mouse.current.y - lastMouse.current.y;
      speed.current = Math.sqrt(dx * dx + dy * dy);
      
      const angle = Math.atan2(dy, dx);

      // Spawn trail particles
      if (speed.current > 1.2 && Math.random() < 0.45) {
        spawnParticle(mouse.current.x, mouse.current.y, dx, dy);
      }

      // Process and render active particles
      particles.current = particles.current.filter((p) => {
        p.life += dt;
        const progress = p.life / p.maxLife;
        if (progress >= 1) return false;

        p.x += p.vx;
        p.y += p.vy;

        // Linear dampening
        p.vx *= 0.97;
        p.vy *= 0.97;

        const alpha = (1 - progress) * 0.65;
        const currentSize = p.size * (1 - progress * 0.6);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();

        return true;
      });

      const x = mouse.current.x;
      const y = mouse.current.y;

      // 1. Soft Ambient Outer Glow Aura
      // If hovering, aura slightly stretches to encompass size
      const baseAuraRadius = hoverState.current.active 
        ? Math.min(100, 45 + Math.max(hoverState.current.width, hoverState.current.height) * 0.15) 
        : 60;
      
      const pulse = Math.sin(now * 0.0035) * 4;
      const auraRadius = baseAuraRadius + pulse;

      const auraGradient = ctx.createRadialGradient(x, y, 0, x, y, auraRadius);
      auraGradient.addColorStop(0, 'rgba(96, 165, 250, 0.45)');   // Core cyan-blue
      auraGradient.addColorStop(0.3, 'rgba(59, 130, 246, 0.25)'); // Solid brand blue
      auraGradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.08)');  // Subtle purple transition
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(x, y, auraRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. High-intensity Central Glow Core (Warping Ellipse on fast moves)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.shadowBlur = hoverState.current.active ? 16 : 10;
      ctx.shadowColor = '#60A5FA';
      ctx.fillStyle = '#ffffff';

      if (speed.current > 3 && !hoverState.current.active) {
        // Warp core proportional to fast mouse drag vectors
        const stretch = Math.min(2.8, 1 + speed.current * 0.04);
        const radiusX = 6.5 * stretch;
        const radiusY = 6.5 / Math.sqrt(stretch);

        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, angle, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Micro-breathing animation on idle state
        const sizePulse = hoverState.current.active ? 8.5 : 5.5 + Math.sin(now * 0.006) * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, sizePulse, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      lastMouse.current.x = mouse.current.x;
      lastMouse.current.y = mouse.current.y;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isMobile.current) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen opacity-90"
      style={{ pointerEvents: 'none' }}
    />
  );
}
