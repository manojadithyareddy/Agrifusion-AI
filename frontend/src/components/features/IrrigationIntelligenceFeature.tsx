import { useState, useMemo } from 'react';

export default function IrrigationIntelligenceFeature() {
  const [cropStage, setCropStage] = useState<'Tillering' | 'Flowering' | 'Grain Filling'>('Flowering');
  const [weatherCondition, setWeatherCondition] = useState<'Rain in 36h (75%)' | 'Sunny / Dry Spell' | 'Extreme Heatwave'>('Rain in 36h (75%)');
  const [sensorDepth15] = useState<number>(31); // % volumetric water
  const [sensorDepth45] = useState<number>(42);

  // Evapotranspiration & Recommended schedule logic
  const { et0, waterNeededMm, actionTitle, actionBadge, actionColor, explanation, waterSavingsLiters } = useMemo(() => {
    let baseEt0 = 4.6; // mm/day
    let stageCoefficient = 1.05; // Kc
    if (cropStage === 'Tillering') stageCoefficient = 0.85;
    if (cropStage === 'Flowering') stageCoefficient = 1.25;
    if (cropStage === 'Grain Filling') stageCoefficient = 0.95;

    let weatherMultiplier = 1.0;
    if (weatherCondition.includes('Heatwave')) weatherMultiplier = 1.45;
    if (weatherCondition.includes('Rain')) weatherMultiplier = 0.7;

    const actualEt = Number((baseEt0 * stageCoefficient * weatherMultiplier).toFixed(2));
    const dailyNeed = Number((actualEt * 4.2).toFixed(1));

    if (weatherCondition.includes('Rain in 36h')) {
      return {
        et0: actualEt,
        waterNeededMm: dailyNeed,
        actionTitle: 'DELAY IRRIGATION BY 36 HOURS',
        actionBadge: 'RAIN PENDING • DEFER ACTIVATION',
        actionColor: '#38bdf8',
        explanation: 'Doppler radar detects 75% probability of 22mm rainfall in 36 hours. Current 45cm root-zone moisture (42%) is above permanent wilting point. Deferring irrigation avoids root hypoxia and nutrient leaching.',
        waterSavingsLiters: '46,000 Liters / Acre Saved',
      };
    } else if (weatherCondition.includes('Extreme Heatwave')) {
      return {
        et0: actualEt,
        waterNeededMm: Number((dailyNeed * 1.3).toFixed(1)),
        actionTitle: 'TRIGGER 22mm NIGHT DEFICIT IRRIGATION',
        actionBadge: 'HIGH TRANSPIRATION ALERT',
        actionColor: '#f97316',
        explanation: 'Canopy temperature exceeds 36°C with vapor pressure deficit > 2.8 kPa. Run drip emitters between 22:00 and 04:00 to replenish soil moisture with zero evaporative solar loss.',
        waterSavingsLiters: '18,500 Liters / Acre Evaporation Loss Prevented',
      };
    } else {
      return {
        et0: actualEt,
        waterNeededMm: dailyNeed,
        actionTitle: 'STANDARD SCHEDULE: 16mm DRIP CYCLE',
        actionBadge: 'OPTIMAL CANOPY HYDRATION',
        actionColor: '#00ff66',
        explanation: 'Soil capacitance sensors indicate steady 1.4% daily moisture depletion. Apply 16mm across a 3.5-hour scheduled drip cycle at 06:00 AM to maintain field capacity.',
        waterSavingsLiters: 'Precision Matched to Daily Crop ET',
      };
    }
  }, [cropStage, weatherCondition]);

  return (
    <section
      id="section-feature-irrigation"
      aria-label="Irrigation Intelligence Feature"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '90px 40px',
        maxWidth: '1320px',
        margin: '0 auto',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '40px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>💧</span>
          <span>FEATURE 05 — CLOSED-LOOP HYDROLOGICAL MODEL</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            margin: '0 0 14px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Smart Evapotranspiration Irrigation
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Moving beyond fixed timers: our FAO-56 Penman-Monteith model calculates real-time crop water requirements
          and dynamically defers or triggers irrigation pulses based on upcoming rainfall.
        </p>
      </div>

      {/* Grid Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Left Column: Hydrological Telemetry Inputs */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <h3 style={{ margin: '0 0 20px', fontSize: '1.3rem', color: '#f8fafc', fontWeight: 800 }}>
            Root-Zone Telemetry & Scenarios
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Weather Condition Scenario Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                Forecast Weather Condition:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(['Rain in 36h (75%)', 'Sunny / Dry Spell', 'Extreme Heatwave'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeatherCondition(w)}
                    style={{
                      textAlign: 'left',
                      background: weatherCondition === w ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: weatherCondition === w ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: weatherCondition === w ? '#38bdf8' : '#cbd5e1',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {w === 'Rain in 36h (75%)' ? '🌧️ ' : w === 'Sunny / Dry Spell' ? '☀️ ' : '🔥 '}
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Stage */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                Crop Phenological Stage:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(['Tillering', 'Flowering', 'Grain Filling'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setCropStage(s)}
                    style={{
                      background: cropStage === s ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: cropStage === s ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: cropStage === s ? '#4ade80' : '#cbd5e1',
                      padding: '8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Probe Readings */}
            <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
                Soil Capacitance Probe (TDR)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
                <span style={{ color: '#cbd5e1' }}>Depth 15cm (Topsoil):</span>
                <strong style={{ color: '#38bdf8' }}>{sensorDepth15}% VWC</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#cbd5e1' }}>Depth 45cm (Sub-Root):</span>
                <strong style={{ color: '#00ff66' }}>{sensorDepth45}% VWC</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Prescription & Explainable Reasoning */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${actionColor}40`,
            borderRadius: '24px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#6ee7b7', fontWeight: 800 }}>
                  Automated Hydrological Action
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.4rem', color: '#f8fafc', fontWeight: 800 }}>
                  Smart Irrigation Directive
                </h3>
              </div>

              <span
                style={{
                  background: `${actionColor}20`,
                  color: actionColor,
                  border: `1px solid ${actionColor}60`,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                }}
              >
                {actionBadge}
              </span>
            </div>

            {/* Directive Box */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: `1px solid ${actionColor}30`,
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: actionColor, marginBottom: '6px' }}>
                {actionTitle}
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {explanation}
              </p>
            </div>

            {/* 3 Metrics: ET0, Water Requirement, Water Savings */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '18px',
              }}
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>EVAPOTRANSPIRATION</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{et0} mm</div>
                <div style={{ fontSize: '0.66rem', color: '#64748b' }}>FAO Penman-Monteith</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>CANOPY WATER DEMAND</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{waterNeededMm} mm</div>
                <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Daily Requirement</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>CONSERVATION IMPACT</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00ff66' }}>OPTIMAL</div>
                <div style={{ fontSize: '0.66rem', color: '#a7f3d0' }}>Groundwater Preserved</div>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.78rem',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡</span>
            <span>{waterSavingsLiters}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
