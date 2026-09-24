import { useState, useEffect, useCallback, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scale: number;
  opacity: number;
  symbol: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const LEAF_SYMBOLS = ['🍃', '🌿', '🌱', '☘️'];

export default function LeafCursorFX() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const animRef = useRef<number>(0);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  // Mouse move listener with smooth trailing follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('select') ||
          target.closest('input') ||
          target.closest('[role="button"]') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'SELECT' ||
          window.getComputedStyle(target).cursor === 'pointer'
        );
        setIsHovering(isClickable);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth lerp follower loop
  useEffect(() => {
    const loop = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.22;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.22;
      setFollowerPos({ x: currentPos.current.x, y: currentPos.current.y });
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Click handler for ripple and leaf particles
  const handleClick = useCallback((e: MouseEvent) => {
    const clickX = e.clientX;
    const clickY = e.clientY;

    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 200);

    // 1. Add Ripple
    const rippleId = Date.now() + Math.random();
    setRipples(prev => [...prev, { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 700);

    // 2. Spawn 8-12 floating leaf particles
    const count = 10;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = 2.5 + Math.random() * 3.5;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2, // Slight upward burst
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        scale: 0.7 + Math.random() * 0.6,
        opacity: 1,
        symbol: LEAF_SYMBOLS[Math.floor(Math.random() * LEAF_SYMBOLS.length)],
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  // Particle physics update loop
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + 0.6, // gentle gravity
            vx: p.vx * 0.94,
            vy: p.vy * 0.94 + 0.15,
            rot: p.rot + p.vRot,
            opacity: p.opacity - 0.035,
          }))
          .filter(p => p.opacity > 0.05)
      );
    }, 24);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        overflow: 'hidden',
      }}
    >
      {/* ── Outer Trailing Green Leaf Aura ── */}
      <div
        style={{
          position: 'absolute',
          left: followerPos.x,
          top: followerPos.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.4 : 1})`,
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1.5px solid rgba(0, 255, 102, 0.6)',
          background: 'radial-gradient(circle, rgba(0, 255, 102, 0.15) 0%, rgba(0, 255, 102, 0) 70%)',
          boxShadow: '0 0 15px rgba(0, 255, 102, 0.4), inset 0 0 10px rgba(0, 255, 102, 0.2)',
          transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Tiny botanical leaf inside cursor */}
        <span
          style={{
            fontSize: '13px',
            filter: 'drop-shadow(0 0 4px rgba(0, 255, 102, 0.8))',
            transform: isHovering ? 'rotate(-25deg) scale(1.15)' : 'rotate(-10deg)',
            transition: 'transform 0.2s ease',
            userSelect: 'none',
          }}
        >
          🌿
        </span>
      </div>

      {/* ── Inner Sharp Pointer Dot ── */}
      <div
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#00ff66',
          boxShadow: '0 0 8px #00ff66, 0 0 14px rgba(0, 255, 102, 0.8)',
        }}
      />

      {/* ── Ripples on Click ── */}
      {ripples.map(r => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid rgba(0, 255, 102, 0.85)',
            boxShadow: '0 0 20px rgba(0, 255, 102, 0.6), inset 0 0 15px rgba(0, 255, 102, 0.3)',
            animation: 'cursorRippleAnim 0.65s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* ── Leaf Particles on Click ── */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) rotate(${p.rot}deg) scale(${p.scale})`,
            opacity: p.opacity,
            fontSize: '18px',
            userSelect: 'none',
            filter: 'drop-shadow(0 2px 8px rgba(0, 255, 102, 0.5))',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {p.symbol}
        </div>
      ))}

      {/* Ripple Animation Keyframes */}
      <style>{`
        @keyframes cursorRippleAnim {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
            border-width: 3px;
          }
          100% {
            width: 110px;
            height: 110px;
            opacity: 0;
            border-width: 1px;
          }
        }
      `}</style>
    </div>
  );
}
