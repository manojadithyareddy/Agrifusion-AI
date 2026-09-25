import { useState } from 'react';

interface CommodityData {
  id: string;
  name: string;
  currentPrice: number;
  currency: string;
  msp: number;
  weeklyChange: string;
  isPositive: boolean;
  trend: 'Bullish' | 'Stable' | 'Bearish';
  arrivalVolume: string;
  signals: { title: string; detail: string; impact: 'Positive' | 'Neutral' | 'Negative' }[];
  historyPoints: { day: string; price: number; isForecast?: boolean }[];
  forecastSummary: string;
  recommendedAction: string;
}

const COMMODITIES: CommodityData[] = [
  {
    id: 'rice',
    name: 'Rice (Paddy Fine)',
    currentPrice: 2380,
    currency: '₹ / Quintal',
    msp: 2300,
    weeklyChange: '+4.8%',
    isPositive: true,
    trend: 'Bullish',
    arrivalVolume: '18,400 Q (Down 14% WoW)',
    signals: [
      { title: 'Supply Tightening', detail: 'Terminal Kharif arrivals tapering off across southern APMCs.', impact: 'Positive' },
      { title: 'Inter-State Arbitrage', detail: 'Telangana mills paying +₹140/Q premium over local mandi bids.', impact: 'Positive' },
      { title: 'Buffer Stock Procurement', detail: 'FCI active in district collection centers maintaining floor price.', impact: 'Positive' },
    ],
    historyPoints: [
      { day: 'Day 1', price: 2280 },
      { day: 'Day 5', price: 2295 },
      { day: 'Day 10', price: 2310 },
      { day: 'Day 15', price: 2335 },
      { day: 'Day 20', price: 2350 },
      { day: 'Day 25', price: 2380 },
      { day: 'FC +5D', price: 2420, isForecast: true },
      { day: 'FC +10D', price: 2465, isForecast: true },
      { day: 'FC +15D', price: 2450, isForecast: true },
    ],
    forecastSummary: 'AI time-series forecast predicts prices to peak at ₹2,465 within 10 days before northern harvest shipments arrive.',
    recommendedAction: 'Hold inventory 7-10 days to capture additional ₹85/Q upside.',
  },
  {
    id: 'cotton',
    name: 'Cotton (Medium Staple)',
    currentPrice: 7150,
    currency: '₹ / Quintal',
    msp: 6620,
    weeklyChange: '+2.3%',
    isPositive: true,
    trend: 'Bullish',
    arrivalVolume: '32,100 Bales',
    signals: [
      { title: 'Spinning Mill Demand', detail: 'Export orders up 8% for 29mm yarn grade.', impact: 'Positive' },
      { title: 'Moisture Quality Discount', detail: 'Bales with >10% moisture penalized ₹180/Q by ginners.', impact: 'Neutral' },
    ],
    historyPoints: [
      { day: 'Day 1', price: 6950 },
      { day: 'Day 5', price: 6990 },
      { day: 'Day 10', price: 7040 },
      { day: 'Day 15', price: 7080 },
      { day: 'Day 20', price: 7110 },
      { day: 'Day 25', price: 7150 },
      { day: 'FC +5D', price: 7220, isForecast: true },
      { day: 'FC +10D', price: 7300, isForecast: true },
      { day: 'FC +15D', price: 7280, isForecast: true },
    ],
    forecastSummary: 'Global ICE cotton futures strength and low ginner inventory expected to sustain ₹7,250 - ₹7,300 bracket.',
    recommendedAction: 'Sell 50% lot at current ₹7,150; retain balance for peak ₹7,300 target.',
  },
  {
    id: 'maize',
    name: 'Maize (Yellow Corn)',
    currentPrice: 2180,
    currency: '₹ / Quintal',
    msp: 2090,
    weeklyChange: '-1.2%',
    isPositive: false,
    trend: 'Stable',
    arrivalVolume: '24,500 Q (Steady)',
    signals: [
      { title: 'Poultry Feed Procurement', detail: 'Consistent poultry consumption absorbing daily arrivals.', impact: 'Positive' },
      { title: 'Starch Industry Stocks', detail: 'Commercial starch processors report 45-day reserve stock.', impact: 'Neutral' },
    ],
    historyPoints: [
      { day: 'Day 1', price: 2210 },
      { day: 'Day 5', price: 2200 },
      { day: 'Day 10', price: 2190 },
      { day: 'Day 15', price: 2185 },
      { day: 'Day 20', price: 2180 },
      { day: 'Day 25', price: 2180 },
      { day: 'FC +5D', price: 2190, isForecast: true },
      { day: 'FC +10D', price: 2215, isForecast: true },
      { day: 'FC +15D', price: 2230, isForecast: true },
    ],
    forecastSummary: 'Market consolidating near ₹2,180 with mild upside towards ₹2,230 driven by ethanol blending demand.',
    recommendedAction: 'Staggered release as required for liquidity.',
  },
];

export default function MarketPriceFeature({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const [selected, setSelected] = useState<CommodityData>(COMMODITIES[0]);

  // Generate SVG path points
  const minP = Math.min(...selected.historyPoints.map((p) => p.price)) * 0.98;
  const maxP = Math.max(...selected.historyPoints.map((p) => p.price)) * 1.02;
  const range = maxP - minP || 1;

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const points = selected.historyPoints.map((p, idx) => {
    const x = paddingX + (idx / (selected.historyPoints.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((p.price - minP) / range) * (height - 2 * paddingY);
    return { ...p, x, y };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[idx - 1];
    const cpx = (prev.x + curr.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <section
      id="section-feature-market"
      aria-label="Market Price Intelligence Feature"
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
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '40px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#4ade80',
            marginBottom: '14px',
            letterSpacing: '1px',
          }}
        >
          <span>📊</span>
          <span>FEATURE 06 — APMC MANDI TIME-SERIES PREDICTIONS</span>
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
          Market Price Intelligence & Forecast
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Real-time price discovery combining e-NAM APMC mandi bidding, seasonal arrival velocity, and
          15-day predictive commodity trends to optimize crop liquidation timing.
        </p>
      </div>

      {/* Commodity Selector Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {COMMODITIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              background: selected.id === c.id ? 'rgba(0, 255, 102, 0.2)' : 'rgba(15, 23, 42, 0.65)',
              border: selected.id === c.id ? '1px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
              color: selected.id === c.id ? '#4ade80' : '#cbd5e1',
              padding: '10px 22px',
              borderRadius: '24px',
              fontSize: '0.88rem',
              fontWeight: selected.id === c.id ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main Dashboard Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Left Column: Price Chart with 15-day AI Forecast */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8' }}>
                Current Modal Mandi Rate
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                ₹{selected.currentPrice}{' '}
                <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 500 }}>/ Quintal</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: selected.isPositive ? 'rgba(0, 255, 102, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: selected.isPositive ? '#4ade80' : '#f87171',
                  border: `1px solid ${selected.isPositive ? 'rgba(0, 255, 102, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                }}
              >
                <span>{selected.isPositive ? '▲' : '▼'}</span>
                <span>{selected.weeklyChange} (7D)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                MSP: ₹{selected.msp} / Q
              </div>
            </div>
          </div>

          {/* SVG Chart with historical line & forecasted dashed line */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              background: 'rgba(5, 10, 18, 0.6)',
              borderRadius: '18px',
              padding: '16px 10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '16px',
            }}
          >
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff66" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path d={areaD} fill="url(#priceGradient)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="#00ff66" strokeWidth="3" />

              {/* Points */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={pt.isForecast ? 5 : 4}
                    fill={pt.isForecast ? '#38bdf8' : '#00ff66'}
                    stroke="#050a11"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={height - 2}
                    textAnchor="middle"
                    fill={pt.isForecast ? '#38bdf8' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', fontSize: '0.74rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
                <span style={{ width: '12px', height: '3px', background: '#00ff66' }} />
                Historical Mandi Rates
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
                <span style={{ width: '12px', height: '3px', background: '#38bdf8' }} />
                15-Day AI Forecast
              </span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {selected.forecastSummary}
          </p>
        </div>

        {/* Right Column: Market Signals & Recommended Liquidation Window */}
        <div
          style={{
            background: 'rgba(10, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(74, 222, 128, 0.25)',
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
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>
                Market Signals & Liquidation Strategy
              </h3>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                }}
              >
                APMC e-NAM Synchronized
              </span>
            </div>

            {/* Recommended Action Card */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(0, 255, 102, 0.35)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#4ade80', fontWeight: 800, marginBottom: '4px' }}>
                Algorithmic Selling Window Directive
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                {selected.recommendedAction}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>
                Arrival Volume: {selected.arrivalVolume}
              </div>
            </div>

            {/* Real-time Market Signals List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Active Market Signals:
              </div>

              {selected.signals.map((sig, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                      {sig.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: sig.impact === 'Positive' ? '#4ade80' : '#cbd5e1',
                        background: sig.impact === 'Positive' ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {sig.impact.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {sig.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Link */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => onNavigate?.('market')}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                color: '#86efac',
                padding: '12px 20px',
                borderRadius: '24px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(74, 222, 128, 0.15)';
                e.currentTarget.style.borderColor = '#00ff66';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)';
              }}
            >
              <span>Explore Live APMC Mandis & e-NAM Bids</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
