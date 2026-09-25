import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type AI3DState = 'idle' | 'analyzing' | 'success' | 'error';

interface AI3DCoreProps {
  state?: AI3DState;
  cropName?: string;
  confidence?: number;
  height?: number | string;
  className?: string;
}

export default function AI3DCore({
  state = 'idle',
  cropName,
  confidence,
  height = 200,
  className = '',
}: AI3DCoreProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 300;
    const heightPx = typeof height === 'number' ? height : container.clientHeight || 200;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.z = 5.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      setWebGLSupported(false);
      return;
    }

    // 1. Central Core: Inner Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.05, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Inner Glowing Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.55,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    scene.add(nucleusMesh);

    // 3. Orbital Data Rings
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.015, 8, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.9, 0.012, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    scene.add(ring2);

    // 4. Neural Particle Field (Surrounding Cloud)
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const emeraldColor = new THREE.Color(0x10b981);
    const cyanColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = emeraldColor.clone().lerp(cyanColor, Math.random());
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth;
      const newH = typeof height === 'number' ? height : container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentState = stateRef.current;

      // Adjust dynamics based on state
      let speedFactor = 0.5;
      let targetCoreColor = 0x10b981;
      let targetNucleusScale = 1.0;

      if (currentState === 'analyzing') {
        speedFactor = 2.4;
        targetCoreColor = 0xf59e0b; // Amber/Gold inference mode
        targetNucleusScale = 1.15 + Math.sin(elapsed * 8) * 0.15;
      } else if (currentState === 'error') {
        speedFactor = 0.8;
        targetCoreColor = 0xef4444; // Red alert
        targetNucleusScale = 0.9 + Math.sin(elapsed * 4) * 0.1;
      } else if (currentState === 'success') {
        speedFactor = 0.7;
        targetCoreColor = 0x34d399; // Brilliant emerald
        targetNucleusScale = 1.05 + Math.sin(elapsed * 2) * 0.05;
      }

      // Smooth color transitions
      coreMat.color.setHex(targetCoreColor);
      nucleusMat.color.setHex(targetCoreColor);

      // Core rotation
      coreMesh.rotation.y += 0.006 * speedFactor;
      coreMesh.rotation.x += 0.003 * speedFactor;

      // Nucleus pulse
      nucleusMesh.scale.set(targetNucleusScale, targetNucleusScale, targetNucleusScale);

      // Ring rotations
      ring1.rotation.z += 0.008 * speedFactor;
      ring2.rotation.z -= 0.006 * speedFactor;

      // Particle cloud gentle rotation
      particleCloud.rotation.y += 0.002 * speedFactor;
      particleCloud.rotation.x = Math.sin(elapsed * 0.3) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [height]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, rgba(7, 10, 17, 0.8) 70%, transparent 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3D Canvas Mount */}
      {webGLSupported ? (
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        /* Graceful 2D Fallback for Low-Power or Non-WebGL Environments */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #10b981 0%, #064e3b 80%)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              animation: 'aiPulse 2s ease-in-out infinite',
            }}
          >
            🌱
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: '1px' }}>
            NEURAL ENGINE ONLINE
          </span>
        </div>
      )}

      {/* Overlay HUD Telemetry Data */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.8px',
            color: state === 'analyzing' ? '#f59e0b' : state === 'error' ? '#ef4444' : '#34d399',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: state === 'analyzing' ? '#f59e0b' : state === 'error' ? '#ef4444' : '#34d399',
              boxShadow: `0 0 8px ${state === 'analyzing' ? '#f59e0b' : state === 'error' ? '#ef4444' : '#34d399'}`,
            }}
          />
          <span>{state === 'analyzing' ? 'INFERENCE ACTIVE' : state === 'error' ? 'SYSTEM DIAGNOSTIC' : 'AI CORE READY'}</span>
        </div>
        <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>
          MULTI-AGENT LATENCY: ~118ms
        </div>
      </div>

      {/* Target Focus Crop Badge (if analyzed) */}
      {cropName && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '14px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4px 10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>🌾</span>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f1f5f9' }}>
              {cropName}
            </div>
            {confidence !== undefined && (
              <div style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 700 }}>
                {Math.round(confidence * 100)}% Confidence
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
