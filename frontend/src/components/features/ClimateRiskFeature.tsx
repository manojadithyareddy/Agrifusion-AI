import { useState, useMemo } from 'react';

export default function ClimateRiskFeature() {
  const [tempOffset, setTempOffset] = useState<number>(0); // -4 to +6 °C
  const [rainOffset, setRainOffset] = useState<number>(0); // -50% to +50%

  // Simulated base environmental metrics
  const baseTemp = 32.5;
  const baseRain = 65;
  const baseHumidity = 78;
  const baseWind = 12;

  // Dynamically computed metrics based on user sliders
  const currentTemp = Number((baseTemp + tempOffset).toFixed(1));
  const currentRain = Math.max(5, Math.round(baseRain * (1 + rainOffset / 100)));
  const currentHumidity = Math.min(98, Math.max(30, Math.round(baseHumidity - tempOffset * 2.5 + rainOffset * 0.3)));
  const currentWind = baseWind;

  // Climate Risk Calculation & Breakdown
  const { score, droughtRisk, floodRisk, heatStress, level, color } = useMemo(() => {
    let drought = 35 - rainOffset * 0.6 + tempOffset * 4;
    drought = Math.min(95, Math.max(5, Math.round(drought)));

    let flood = 20 + rainOffset * 0.7 - tempOffset * 2;
    flood = Math.min(95, Math.max(5, Math.round(flood)));

    let heat = 40 + tempOffset * 8;
    heat = Math.min(99, Math.max(10, Math.round(heat)));

    const compositeScore = Math.round(drought * 0.4 + flood * 0.25 + heat * 0.35);

    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';
    let riskColor = '#eab308';
    if (compositeScore < 40) {
      riskLevel = 'Low';
      riskColor = '#22c55e';
    } else if (compositeScore < 65) {
      riskLevel = 'Moderate';
      riskColor = '#eab308';
    } else if (compositeScore < 80) {
      riskLevel = 'High';
      riskColor = '#f97316';
    } else {
      riskLevel = 'Severe';
      riskColor = '#ef4444';
    }

    return {
      score: compositeScore,
      droughtRisk: drought,
      floodRisk: flood,
      heatStress: heat,
      level: riskLevel,
      color: riskColor,
    };
  }, [tempOffset, rainOffset]);

  return (
    <section
      id="section-feature-climate"
      aria-label="Climate Risk Intelligence Feature"
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
          <span>🌦️</span>
          <span>FEATURE 02 — ENVIRONMENTAL TELEMETRY</span>
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
          Cinematic Climate Risk Intelligence
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Synthesizing real-time Doppler radar, satellite evapotranspiration, and soil capacitance to
          predict crop stress before visible foliar symptoms manifest.
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Left Column: Live Environmental Station Gauges */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>
                  Hyperlocal Field Station #AP-08
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.3rem', color: '#f8fafc', fontWeight: 800 }}>
                  Atmospheric & Soil Sensors
                </h3>
              </div>
              <span
                style={{
                  background: 'rgba(0, 255, 102, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(0, 255, 102, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66' }} />
                LIVE STREAM
              </span>
            </div>

            {/* Environmental 4-Pack */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TEMPERATURE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{currentTemp}°C</div>
                <div style={{ fontSize: '0.7rem', color: tempOffset > 0 ? '#f87171' : '#4ade80' }}>
                  {tempOffset >= 0 ? `+${tempOffset}` : tempOffset}°C anomaly
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>14-DAY RAINFALL</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{currentRain} mm</div>
                <div style={{ fontSize: '0.7rem', color: rainOffset >= 0 ? '#38bdf8' : '#f87171' }}>
                  {rainOffset >= 0 ? `+${rainOffset}%` : `${rainOffset}%`} vs average
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CANOPY HUMIDITY</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a7f3d0' }}>{currentHumidity}%</div>
                <div style={{ fontSize: '0.7rem', color: currentHumidity > 85 ? '#eab308' : '#94a3b8' }}>
                  {currentHumidity > 85 ? 'Spore Risk Active' : 'Normal range'}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>WIND VELOCITY</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{currentWind} km/h</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Direction: WNW</div>
              </div>
            </div>

            {/* Interactive Scenario Simulators */}
            <div
              style={{
                background: 'rgba(5, 10, 18, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                Simulate Climate Scenarios
              </div>

              {/* Temp Slider */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  <span>Simulate Temperature Shift:</span>
                  <strong style={{ color: '#f8fafc' }}>{tempOffset >= 0 ? `+${tempOffset}` : tempOffset}°C</strong>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="6"
                  step="1"
                  value={tempOffset}
                  onChange={(e) => setTempOffset(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
              </div>

              {/* Rain Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  <span>Simulate Rainfall Anomaly:</span>
                  <strong style={{ color: '#f8fafc' }}>{rainOffset >= 0 ? `+${rainOffset}%` : `${rainOffset}%`}</strong>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="10"
                  value={rainOffset}
                  onChange={(e) => setRainOffset(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#00ff66', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Climate Risk Score */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${color}40`,
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
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#6ee7b7', fontWeight: 800 }}>
                  Explainable AI Synthesis
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.4rem', color: '#f8fafc', fontWeight: 800 }}>
                  Composite Climate Risk Score
                </h3>
              </div>

              <div
                style={{
                  background: `${color}20`,
                  color: color,
                  border: `1px solid ${color}60`,
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                }}
              >
                {level.toUpperCase()} THREAT
              </div>
            </div>

            {/* Circular Gauge Representation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '20px 24px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                  boxShadow: `0 0 25px ${color}30`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    background: '#090f19',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: color, lineHeight: 1 }}>
                    {score}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>/ 100</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  {level} Agro-Ecological Risk
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {score > 70
                    ? 'Elevated heat accumulation coupled with moisture deficit requires emergency deficit irrigation.'
                    : score > 45
                    ? 'Sub-optimal transpiration window. Stagger fertilization and calibrate evening watering.'
                    : 'Optimal physiological growth window with minimal crop stress.'}
                </p>
              </div>
            </div>

            {/* Explainable Contributing Factors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Explainable Contributing Factors:
              </div>

              {/* Drought Factor */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>🌵 Drought & Soil Moisture Deficit</span>
                  <strong style={{ color: droughtRisk > 60 ? '#f87171' : '#4ade80' }}>{droughtRisk}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${droughtRisk}%`, height: '100%', background: droughtRisk > 60 ? '#f87171' : '#38bdf8', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Heat Stress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>🔥 Heat Shock & Transpiration Stress</span>
                  <strong style={{ color: heatStress > 60 ? '#f87171' : '#facc15' }}>{heatStress}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${heatStress}%`, height: '100%', background: heatStress > 60 ? '#ef4444' : '#facc15', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Flood / Excess Wetness */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>🌊 Waterlogging & Anaerobic Root Threat</span>
                  <strong style={{ color: floodRisk > 60 ? '#f87171' : '#4ade80' }}>{floodRisk}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${floodRisk}%`, height: '100%', background: floodRisk > 60 ? '#ef4444' : '#00ff66', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.78rem',
              color: '#a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>✓</span>
            <span>SHAP (SHapley Additive exPlanations) verified with zero black-box opacity</span>
          </div>
        </div>
      </div>
    </section>
  );
}
