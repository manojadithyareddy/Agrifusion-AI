import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { detectDeviceCapabilities } from '../../utils/hardwareDetection';

interface FinalCallToActionProps {
  onNavigate?: (page: string) => void;
}

export default function FinalCallToAction({ onNavigate }: FinalCallToActionProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tier = detectDeviceCapabilities();
    if (tier.tier === 'low' || !tier.hasWebGL || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: tier.tier === 'high' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(tier.pixelRatio);
    container.appendChild(renderer.domElement);

    // Subtle 3D Agricultural Swarm Particles (chlorophyll green & cyan)
    const particleCount = tier.tier === 'high' ? 400 : 150;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00ff66,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      points.rotation.y = elapsed * 0.04;
      points.rotation.x = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      geo.dispose();
      mat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="section-final-cta"
      aria-label="Final Call to Action"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '120px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle 3D background */}
      <div
        ref={mountRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 255, 102, 0.12)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '40px',
            padding: '6px 20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#4ade80',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}
        >
          <span>🌱</span>
          <span>TRANSFORM YOUR FARMING INTELLIGENCE</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            margin: '0 0 20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Turn Agricultural Data Into Decisions.
        </h2>

        <p
          style={{
            color: '#cbd5e1',
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          See what multimodal AI can do for agriculture.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate?.('assistant')}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #00ff66 100%)',
              color: '#022c22',
              border: 'none',
              padding: '16px 38px',
              borderRadius: '36px',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0, 255, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
              transition: 'all 0.25s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 14px 45px rgba(0, 255, 102, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 102, 0.4)';
            }}
          >
            <span>Launch AI Assistant</span>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>➔</span>
          </button>

          <button
            onClick={() => onNavigate?.('predictions')}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)',
              padding: '16px 36px',
              borderRadius: '36px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Explore Platform
          </button>
        </div>
      </div>
    </section>
  );
}
