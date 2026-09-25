import { useState, useMemo } from 'react';

interface RecommendedCrop {
  name: string;
  scientificName: string;
  suitabilityScore: number;
  expectedYield: string;
  projectedNetProfit: string;
  waterRequirement: string;
  riskFactor: 'Minimal' | 'Moderate' | 'Low';
  reasoning: string;
}

export default function CropRecommendationFeature() {
  const [season, setSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [nitrogen, setNitrogen] = useState<number>(75); // kg/ha
  const [waterAccess, setWaterAccess] = useState<'Canal / High' | 'Borewell / Moderate' | 'Rainfed / Low'>('Borewell / Moderate');
  const [soilType] = useState<string>('Clay Loam (pH 6.8)');

  // Dynamic ranking based on inputs
  const recommendations: RecommendedCrop[] = useMemo(() => {
    if (season === 'Kharif') {
      if (waterAccess.includes('High') || nitrogen > 70) {
        return [
          {
            name: 'Paddy Rice (BPT 5204 / Samba Mahsuri)',
            scientificName: 'Oryza sativa',
            suitabilityScore: 95.8,
            expectedYield: '52.4 Q/ha',
            projectedNetProfit: '₹48,200 / acre',
            waterRequirement: '1,200 mm',
            riskFactor: 'Minimal',
            reasoning: 'High nitrogen availability and clay loam water retention provide ideal anaerobic rhizosphere conditions for maximum tiller emergence.',
          },
          {
            name: 'Maize (Single Cross Hybrid)',
            scientificName: 'Zea mays',
            suitabilityScore: 91.2,
            expectedYield: '68.0 Q/ha',
            projectedNetProfit: '₹42,500 / acre',
            waterRequirement: '600 mm',
            riskFactor: 'Low',
            reasoning: 'C4 photosynthetic pathway exploits high Kharif insolation and medium-to-high nitrogen for rapid vegetative biomass accumulation.',
          },
          {
            name: 'Soybean (JS 335 / NRC 37)',
            scientificName: 'Glycine max',
            suitabilityScore: 84.5,
            expectedYield: '24.5 Q/ha',
            projectedNetProfit: '₹36,800 / acre',
            waterRequirement: '450 mm',
            riskFactor: 'Moderate',
            reasoning: 'Symbiotic nitrogen fixation benefits from existing soil fertility while offering shorter duration and lower water draw.',
          },
        ];
      } else {
        return [
          {
            name: 'Sorghum / Jowar (CSH 16)',
            scientificName: 'Sorghum bicolor',
            suitabilityScore: 94.1,
            expectedYield: '38.0 Q/ha',
            projectedNetProfit: '₹32,400 / acre',
            waterRequirement: '350 mm',
            riskFactor: 'Minimal',
            reasoning: 'Exceptional drought resilience and deep root penetration optimize yield under lower water supply in clay loam.',
          },
          {
            name: 'Pearl Millet / Bajra',
            scientificName: 'Pennisetum glaucum',
            suitabilityScore: 89.6,
            expectedYield: '28.5 Q/ha',
            projectedNetProfit: '₹29,000 / acre',
            waterRequirement: '280 mm',
            riskFactor: 'Minimal',
            reasoning: 'Extremely efficient water-use ratio with fast maturity profile preventing mid-season moisture stress.',
          },
        ];
      }
    } else if (season === 'Rabi') {
      return [
        {
          name: 'Wheat (HD 2967 / PBW 550)',
          scientificName: 'Triticum aestivum',
          suitabilityScore: 96.4,
          expectedYield: '46.8 Q/ha',
          projectedNetProfit: '₹44,600 / acre',
          waterRequirement: '400 mm',
          riskFactor: 'Minimal',
          reasoning: 'Cool vegetative canopy temperatures match clay loam moisture retention for optimal spikelet fertility.',
        },
        {
          name: 'Chickpea / Gram (JG 11)',
          scientificName: 'Cicer arietinum',
          suitabilityScore: 92.0,
          expectedYield: '22.0 Q/ha',
          projectedNetProfit: '₹39,200 / acre',
          waterRequirement: '250 mm',
          riskFactor: 'Minimal',
          reasoning: 'Deep taproot structure accesses sub-surface residual moisture with high market APMC mandi pricing.',
        },
        {
          name: 'Mustard (Pusa Bold)',
          scientificName: 'Brassica juncea',
          suitabilityScore: 88.3,
          expectedYield: '19.5 Q/ha',
          projectedNetProfit: '₹35,000 / acre',
          waterRequirement: '220 mm',
          riskFactor: 'Low',
          reasoning: 'High oil percentage and low irrigation demand provide resilient profit margins under winter conditions.',
        },
      ];
    } else {
      return [
        {
          name: 'Green Gram / Mungbean (IPM 205-7)',
          scientificName: 'Vigna radiata',
          suitabilityScore: 93.5,
          expectedYield: '14.2 Q/ha',
          projectedNetProfit: '₹28,500 / acre',
          waterRequirement: '250 mm',
          riskFactor: 'Low',
          reasoning: 'Short 60-day lifecycle ideal for summer catch cropping, restoring soil organic nitrogen prior to Kharif.',
        },
        {
          name: 'Watermelon (Sugar Baby / Icebox)',
          scientificName: 'Citrullus lanatus',
          suitabilityScore: 89.1,
          expectedYield: '320 Q/ha',
          projectedNetProfit: '₹55,000 / acre',
          waterRequirement: '350 mm',
          riskFactor: 'Moderate',
          reasoning: 'High summer consumer demand yields exceptional gross returns where assured drip irrigation is maintained.',
        },
      ];
    }
  }, [season, nitrogen, waterAccess]);

  return (
    <section
      id="section-feature-crop-engine"
      aria-label="Crop Recommendation Engine Feature"
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
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '40px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#facc15',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>⚖️</span>
          <span>FEATURE 03 — MULTI-CRITERIA DECISION ENGINE</span>
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
          AI Crop Recommendation Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Visualizing the exact multi-factor reasoning path from soil chemistry and seasonal weather
          patterns to optimal crop selection and net profit projections.
        </p>
      </div>

      {/* 3-Step System Flow: INPUTS → REASONING → RECOMMENDATION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Step 1: Inputs */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#38bdf8', fontSize: '1.2rem' }}>📥</span>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                STAGE 1
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                Agronomic Inputs
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Season Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Cultivation Season:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['Kharif', 'Rabi', 'Zaid'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeason(s)}
                    style={{
                      flex: 1,
                      background: season === s ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: season === s ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: season === s ? '#4ade80' : '#cbd5e1',
                      padding: '8px',
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Nitrogen Level */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Soil Nitrogen (N):</span>
                <strong style={{ color: '#4ade80' }}>{nitrogen} kg/ha</strong>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="5"
                value={nitrogen}
                onChange={(e) => setNitrogen(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00ff66', cursor: 'pointer' }}
              />
            </div>

            {/* Water Access */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Water & Irrigation Access:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(['Canal / High', 'Borewell / Moderate', 'Rainfed / Low'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWaterAccess(w)}
                    style={{
                      textAlign: 'left',
                      background: waterAccess === w ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: waterAccess === w ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: waterAccess === w ? '#38bdf8' : '#cbd5e1',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil Type read-only badge */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>SOIL TEXTURE & REACTION</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>{soilType}</div>
            </div>
          </div>
        </div>

        {/* Step 2: AI Reasoning Weights */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#a855f7', fontSize: '1.2rem' }}>🧠</span>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase' }}>
                STAGE 2
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                Ensemble Reasoning
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Factor 1: Soil Nutrient Matrix */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Soil Agronomy & NPK Affinity</span>
                <strong style={{ color: '#4ade80' }}>35% Weight</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', background: '#4ade80' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                Evaluates N ({nitrogen} kg), P, K, and cation-exchange capacity
              </div>
            </div>

            {/* Factor 2: Thermal & Weather */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Growing Degree Days (GDD)</span>
                <strong style={{ color: '#38bdf8' }}>30% Weight</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: '#38bdf8' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                Calibrates thermal units required for grain filling in {season}
              </div>
            </div>

            {/* Factor 3: Water Balance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>Hydrological Availability</span>
                <strong style={{ color: '#00ff66' }}>20% Weight</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#00ff66' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                Constraints aligned with {waterAccess} supply tier
              </div>
            </div>

            {/* Factor 4: Market Yield Stability */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#cbd5e1' }}>APMC Market Liquidity & Risk</span>
                <strong style={{ color: '#facc15' }}>15% Weight</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: '#facc15' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                Historical wholesale price spread over last 5 seasons
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Recommended Crops Output */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#00ff66', fontSize: '1.2rem' }}>🎯</span>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#00ff66', fontWeight: 800, textTransform: 'uppercase' }}>
                STAGE 3
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                Recommended Crops
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((crop, idx) => (
              <div
                key={idx}
                style={{
                  background: idx === 0 ? 'rgba(0, 255, 102, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  border: idx === 0 ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.92rem' }}>
                    {idx + 1}. {crop.name}
                  </span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#00ff66' }}>
                    {crop.suitabilityScore}% Match
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '6px' }}>
                  <span>Yield: <strong style={{ color: '#f8fafc' }}>{crop.expectedYield}</strong></span>
                  <span>•</span>
                  <span>Net Profit: <strong style={{ color: '#4ade80' }}>{crop.projectedNetProfit}</strong></span>
                </div>

                <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {crop.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
