import { useEffect, useRef, useState, useTransition } from 'react';
import * as THREE from 'three';
import { detectDeviceCapabilities, type DeviceTier } from '../../utils/hardwareDetection';

interface Cinematic3DHeroProps {
  onNavigate?: (page: string) => void;
}

export default function Cinematic3DHero({ onNavigate }: Cinematic3DHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [deviceTier, setDeviceTier] = useState<DeviceTier | null>(null);
  const [activeMetric, setActiveMetric] = useState<'ndvi' | 'moisture' | 'temperature' | 'yield'>('ndvi');
  const [, startTransition] = useTransition();

  useEffect(() => {
    const tier = detectDeviceCapabilities();
    startTransition(() => {
      setDeviceTier(tier);
    });
  }, []);

  useEffect(() => {
    if (!deviceTier) return;
    if (deviceTier.tier === 'low' || !deviceTier.hasWebGL || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050a11, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: deviceTier.tier === 'high',
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(deviceTier.pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0f291e, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x4ade80, 2.2);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const blueLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueLight.position.set(-6, 4, -3);
    scene.add(blueLight);

    // --- 1. Procedural Farmland Terrain Mesh ---
    const terrainSegments = deviceTier.tier === 'high' ? 44 : 26;
    const terrainGeo = new THREE.PlaneGeometry(18, 14, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Gentle elevation waves + furrow rows
      const furrow = Math.sin(x * 2.8) * 0.14;
      const rollingHill = Math.sin(x * 0.4) * Math.cos(z * 0.5) * 0.35;
      posAttr.setY(i, furrow + rollingHill - 0.4);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x071b12,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrainMesh);

    // Subtle holographic wireframe grid on top of terrain
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new THREE.Mesh(terrainGeo, wireframeMat);
    wireframeMesh.position.y += 0.01;
    scene.add(wireframeMesh);

    // --- 2. Instanced Crop Rows (Low-poly emerald stems) ---
    const rowCount = deviceTier.tier === 'high' ? 12 : 8;
    const plantsPerRow = deviceTier.tier === 'high' ? 24 : 14;
    const totalCrops = rowCount * plantsPerRow;

    const plantGeo = new THREE.ConeGeometry(0.08, 0.45, 4);
    plantGeo.translate(0, 0.22, 0);

    const plantMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.5,
      metalness: 0.2,
      emissive: 0x052e16,
      emissiveIntensity: 0.6,
    });

    const instancedPlants = new THREE.InstancedMesh(plantGeo, plantMat, totalCrops);
    const dummy = new THREE.Object3D();
    let cropIndex = 0;

    const xStart = -7.5;
    const xSpacing = 15 / (rowCount - 1);
    const zStart = -5.5;
    const zSpacing = 11 / (plantsPerRow - 1);

    for (let r = 0; r < rowCount; r++) {
      const x = xStart + r * xSpacing;
      for (let p = 0; p < plantsPerRow; p++) {
        const z = zStart + p * zSpacing + (Math.random() - 0.5) * 0.1;
        const furrow = Math.sin(x * 2.8) * 0.14;
        const rollingHill = Math.sin(x * 0.4) * Math.cos(z * 0.5) * 0.35;
        const y = furrow + rollingHill - 0.38;

        const scale = 0.75 + Math.random() * 0.5;
        dummy.position.set(x, y, z);
        dummy.scale.set(scale, scale * (1 + Math.random() * 0.4), scale);
        dummy.rotation.y = Math.random() * Math.PI * 2;
        dummy.rotation.z = (Math.random() - 0.5) * 0.15;
        dummy.updateMatrix();
        instancedPlants.setMatrixAt(cropIndex++, dummy.matrix);
      }
    }
    instancedPlants.instanceMatrix.needsUpdate = true;
    scene.add(instancedPlants);

    // --- 3. Floating Sensor Nodes & Neural Connections ---
    const sensorCount = deviceTier.tier === 'high' ? 9 : 5;
    const sensorPositions: THREE.Vector3[] = [];
    const sensorGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const sensorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const centralAiHub = new THREE.Vector3(0, 2.8, -0.5);

    const sensorGroup = new THREE.Group();
    for (let i = 0; i < sensorCount; i++) {
      const sx = (Math.random() - 0.5) * 12;
      const sz = (Math.random() - 0.5) * 8;
      const sy = 0.5 + Math.random() * 0.4;
      const sPos = new THREE.Vector3(sx, sy, sz);
      sensorPositions.push(sPos);

      const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
      sensorMesh.position.copy(sPos);
      sensorGroup.add(sensorMesh);

      // Connecting laser line to Central AI Hub
      const lineGeo = new THREE.BufferGeometry().setFromPoints([sPos, centralAiHub]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.28,
      });
      const connectionLine = new THREE.Line(lineGeo, lineMat);
      sensorGroup.add(connectionLine);
    }
    scene.add(sensorGroup);

    // Central AI Core Node (Hovering holographic sphere)
    const coreGeo = new THREE.IcosahedronGeometry(0.38, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x10b981,
      emissiveIntensity: 1.2,
      wireframe: true,
    });
    const centralCore = new THREE.Mesh(coreGeo, coreMat);
    centralCore.position.copy(centralAiHub);
    scene.add(centralCore);

    // Core pulsing ring
    const ringGeo = new THREE.RingGeometry(0.55, 0.62, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const coreRing = new THREE.Mesh(ringGeo, ringMat);
    coreRing.position.copy(centralAiHub);
    scene.add(coreRing);

    // --- 4. Floating AI Telemetry Particles ---
    const particleCount = deviceTier.recommendedParticles;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 4.5 + 0.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      particleSpeeds[i] = 0.004 + Math.random() * 0.008;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 5. Laser Scanning Plane / Sweep Bar ---
    const scanPlaneGeo = new THREE.PlaneGeometry(16, 0.15);
    scanPlaneGeo.rotateX(Math.PI / 2);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const scanBar = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanBar.position.set(0, 0.4, 0);
    scene.add(scanBar);

    // --- Mouse Parallax Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.8;
      targetY = ny * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 2.2;
      camera.position.y = 5.5 + mouseY * 1.2;
      camera.lookAt(0, 0.5, 0);

      // Rotate AI Core
      centralCore.rotation.x = elapsed * 0.6;
      centralCore.rotation.y = elapsed * 0.8;
      coreRing.rotation.z = -elapsed * 0.4;
      const pulse = 1 + Math.sin(elapsed * 3) * 0.08;
      centralCore.scale.set(pulse, pulse, pulse);

      // Laser scanner sweep across terrain (-5 to +5 on Z)
      scanBar.position.z = Math.sin(elapsed * 0.7) * 5.2;

      // Animate floating telemetry particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 4.8) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle pulse on sensor nodes
      sensorGroup.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          const s = 1 + Math.sin(elapsed * 2 + idx) * 0.15;
          child.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Thorough Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries, materials, renderer
      terrainGeo.dispose();
      terrainMat.dispose();
      wireframeMat.dispose();
      plantGeo.dispose();
      plantMat.dispose();
      sensorGeo.dispose();
      sensorMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      scanPlaneGeo.dispose();
      scanPlaneMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [deviceTier]);

  return (
    <section
      aria-label="AgriFusion AI Platform Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '130px 40px 60px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.08) 0%, rgba(5, 10, 17, 0.98) 75%)',
      }}
    >
      {/* ── 3D Interactive WebGL Scene Mount ── */}
      <div
        ref={mountRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      />

      {/* ── Low-Power / Mobile / Reduced-Motion 2D Fallback ── */}
      {deviceTier && (deviceTier.tier === 'low' || !deviceTier.hasWebGL) && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            backgroundImage: `
              radial-gradient(circle at 75% 30%, rgba(16, 185, 129, 0.18) 0%, transparent 50%),
              radial-gradient(circle at 25% 70%, rgba(56, 189, 248, 0.14) 0%, transparent 50%),
              linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
          }}
        />
      )}

      {/* ── Satellite-Style Coordinates & Telemetry HUD Overlay ── */}
      <div
        className="hero-hud-coordinates"
        style={{
          position: 'absolute',
          top: '95px',
          right: '40px',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          color: '#6ee7b7',
          background: 'rgba(5, 15, 10, 0.65)',
          backdropFilter: 'blur(12px)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(74, 222, 128, 0.2)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 8px #00ff66', display: 'inline-block' }} />
          GRID: LAT 16.3067° N • LON 80.4365° E
        </span>
        <span style={{ color: '#64748b' }}>|</span>
        <span>SENTINEL-2 NDVI: 0.81 [HEALTHY]</span>
        <span style={{ color: '#64748b' }}>|</span>
        <span>MODELS: ACTIVE</span>
      </div>

      {/* ── Main Content Container ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Deep-Tech Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            padding: '8px 20px',
            borderRadius: '40px',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#86efac',
            marginBottom: '28px',
            boxShadow: '0 0 25px rgba(0, 255, 102, 0.15)',
            letterSpacing: '0.5px',
          }}
        >
          <span style={{ fontSize: '1rem' }}>✨</span>
          <span>MULTIMODAL AGRICULTURE INTELLIGENCE & DECISION AGENT</span>
          <span
            style={{
              fontSize: '0.68rem',
              background: 'rgba(74, 222, 128, 0.25)',
              padding: '2px 8px',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 800,
            }}
          >
            v2.4
          </span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 6.2vw, 5.4rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            margin: '0 0 24px',
            letterSpacing: '-1.5px',
            maxWidth: '1000px',
          }}
        >
          Intelligence for{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #4ade80 0%, #00ff66 40%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(74, 222, 128, 0.35)',
              display: 'inline-block',
            }}
          >
            Every Acre.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
            lineHeight: 1.6,
            color: '#cbd5e1',
            maxWidth: '820px',
            margin: '0 0 36px',
            fontWeight: 400,
          }}
        >
          AgriFusion AI combines computer vision, machine learning, generative AI, RAG, and autonomous
          agents to transform agricultural data into actionable decisions.
        </p>

        {/* Action CTAs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}
        >
          <button
            onClick={() => onNavigate?.('assistant')}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #00ff66 100%)',
              color: '#022c22',
              border: 'none',
              padding: '16px 36px',
              borderRadius: '36px',
              fontSize: '1.02rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0, 255, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 255, 102, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 102, 0.4)';
            }}
          >
            <span>Explore AI Assistant</span>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('section-pipeline');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate?.('predictions');
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(16px)',
              padding: '16px 34px',
              borderRadius: '36px',
              fontSize: '1.02rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Explore Platform</span>
            <span style={{ color: '#4ade80' }}>⚡</span>
          </button>
        </div>

        {/* ── Holographic Live Telemetry Indicators Strip ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '1000px',
          }}
        >
          <TelemetryCard
            icon="🛰️"
            label="Sentinel-2 Optical NDVI"
            value="0.84 μm"
            subtext="Optimal Chlorophyll Density"
            active={activeMetric === 'ndvi'}
            onClick={() => setActiveMetric('ndvi')}
          />
          <TelemetryCard
            icon="💧"
            label="Root-Zone Moisture"
            value="34.2%"
            subtext="Volumetric Soil Water (45cm)"
            active={activeMetric === 'moisture'}
            onClick={() => setActiveMetric('moisture')}
          />
          <TelemetryCard
            icon="🌡️"
            label="Microclimate Vapor Deficit"
            value="1.24 kPa"
            subtext="Non-Stressed Transpiration"
            active={activeMetric === 'temperature'}
            onClick={() => setActiveMetric('temperature')}
          />
          <TelemetryCard
            icon="📈"
            label="Yield Forecast Potential"
            value="48.5 Q/Ha"
            subtext="95% Confidence Interval"
            active={activeMetric === 'yield'}
            onClick={() => setActiveMetric('yield')}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-hud-coordinates { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function TelemetryCard({
  icon,
  label,
  value,
  subtext,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  value: string;
  subtext: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(16px)',
        border: active ? '1px solid rgba(74, 222, 128, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: active ? '0 10px 30px rgba(0, 255, 102, 0.15)' : 'none',
      }}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span style={{ fontSize: '0.72rem', color: active ? '#4ade80' : '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '2px', letterSpacing: '-0.3px' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
        {subtext}
      </div>
    </div>
  );
}
