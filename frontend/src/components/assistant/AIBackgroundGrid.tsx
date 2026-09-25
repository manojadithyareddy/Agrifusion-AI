export default function AIBackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* 1. Deep Atmospheric Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(16, 185, 129, 0.08) 0%, rgba(7, 10, 17, 1) 70%)',
        }}
      />

      {/* 2. Digital Farmland Grid Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.8,
        }}
      />

      {/* 3. Subtle Agricultural Glow Nodes */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 4. Subtle Ambient Data Stream Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.12,
        }}
      >
        <defs>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M 0,200 Q 300,160 600,240 T 1200,180 T 1800,220"
          fill="none"
          stroke="url(#gridGrad)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M 0,550 Q 400,600 800,520 T 1600,580"
          fill="none"
          stroke="url(#gridGrad)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
      </svg>
    </div>
  );
}
