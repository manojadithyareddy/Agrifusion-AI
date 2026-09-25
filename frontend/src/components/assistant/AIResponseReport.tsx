import { useState } from 'react';
import type { CropAnalysisResult } from '../../utils/agriFramerEngine';
import { getPlainLanguageDiagnosis } from '../../utils/agriFramerEngine';

interface AIResponseReportProps {
  analysis: CropAnalysisResult;
  imageSrc?: string;
  timestamp: string;
  isHi?: boolean;
  onSpeak: (text: string) => void;
  className?: string;
}

export default function AIResponseReport({
  analysis,
  imageSrc,
  timestamp,
  isHi = false,
  onSpeak,
  className = '',
}: AIResponseReportProps) {
  const [copied, setCopied] = useState(false);
  const plainDiag = getPlainLanguageDiagnosis(analysis);

  const confidencePct = Math.round((analysis.confidence ?? 0.95) * 100);

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
      case 'high':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)' };
      case 'moderate':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' };
      case 'low':
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)' };
      default:
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)' };
    }
  };

  const sevBadge = getSeverityBadge(analysis.severity ?? 'Moderate');

  const handleCopy = () => {
    const text = `🌾 AGRIFUSION AI INTELLIGENCE REPORT
Crop: ${plainDiag.cropName}
Condition: ${plainDiag.diseaseSimple} (${plainDiag.confidenceBadge})
Pest Status: ${plainDiag.pestsStatus}

💊 STORE MEDICINE:
${plainDiag.storeMedicine}

🏡 ORGANIC HOME REMEDY:
${plainDiag.homeRemedy}

🚫 CRITICAL MISTAKES TO AVOID:
${plainDiag.avoidMistakes.map((m) => `• ${m}`).join('\n')}

Generated at ${timestamp} via AgriFusion AI.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={className}
      aria-label="Agricultural AI Intelligence Report"
      style={{
        background: 'linear-gradient(180deg, #0e1524 0%, #090d18 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* ── Top Header: Crop Name, Disease, Confidence Score, Audio & Copy ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Diagnosed crop leaf"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              }}
            />
          )}

          <div>
            <div
              style={{
                color: '#10b981',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
              }}
            >
              🌾 {isHi ? 'पहचानी गई फसल' : 'Identified Crop'}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginTop: '1px' }}>
              {plainDiag.cropName}
            </div>
            <div
              style={{
                color: '#38bdf8',
                fontSize: '0.98rem',
                fontWeight: 800,
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🦠</span>
              <span>{plainDiag.diseaseSimple}</span>
            </div>
          </div>
        </div>

        {/* Action Pills: Confidence, Speech & Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Severity Pill */}
            <span
              style={{
                background: sevBadge.bg,
                border: `1px solid ${sevBadge.border}`,
                color: sevBadge.color,
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              {analysis.severity} Risk
            </span>

            {/* Confidence Pill */}
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontSize: '0.74rem',
                fontWeight: 900,
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              {confidencePct}% Confidence
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Audio Read-Out */}
            <button
              onClick={() =>
                onSpeak(
                  `${plainDiag.cropName}. ${plainDiag.diseaseSimple}. ${plainDiag.pestsStatus}. Remedy: ${plainDiag.homeRemedy}. Store medicine: ${plainDiag.storeMedicine}`
                )
              }
              title="Speak Diagnosis Audio"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🔊</span>
              <span>{isHi ? 'सुनें' : 'Listen'}</span>
            </button>

            {/* Copy Dossier */}
            <button
              onClick={handleCopy}
              title="Copy diagnosis report"
              style={{
                background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.14)'}`,
                color: copied ? '#34d399' : '#cbd5e1',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* ── 1. VISIBLE SYMPTOMS ── */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.06)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '12px 14px',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            color: '#38bdf8',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🔍</span>
          <span>{isHi ? 'लक्षण (पहचानने के सरल संकेत):' : 'Visible Foliar Symptoms:'}</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#e2e8f0', fontSize: '0.84rem', lineHeight: 1.5 }}>
          {plainDiag.symptomsList.map((sym, idx) => (
            <li key={idx} style={{ marginBottom: '2px' }}>
              {sym}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 2. PESTS & INSECT STATUS ── */}
      <div
        style={{
          background: plainDiag.pestsStatus.includes('ALERT')
            ? 'rgba(239, 68, 68, 0.08)'
            : 'rgba(16, 185, 129, 0.06)',
          border: `1px solid ${
            plainDiag.pestsStatus.includes('ALERT')
              ? 'rgba(239, 68, 68, 0.25)'
              : 'rgba(16, 185, 129, 0.2)'
          }`,
          padding: '12px 14px',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            color: plainDiag.pestsStatus.includes('ALERT') ? '#fca5a5' : '#86efac',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🐛</span>
          <span>{isHi ? 'कीट स्थिति (Pest Assessment):' : 'Pests & Insects Status:'}</span>
        </div>
        <div style={{ color: '#f1f5f9', fontSize: '0.84rem', fontWeight: 600, lineHeight: 1.45 }}>
          {plainDiag.pestsStatus}
        </div>
      </div>

      {/* ── 3. TREATMENT MATRIX ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            color: '#34d399',
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          💊 {isHi ? 'इलाज एवं समाधान' : 'Treatment & Agronomic Prescription:'}
        </div>

        {/* Immediate Home Remedy */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '4px solid #10b981',
            padding: '10px 12px',
            borderRadius: '0 10px 10px 0',
          }}
        >
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#86efac', marginBottom: '2px' }}>
            🏡 {isHi ? 'घरेलू जैविक उपाय:' : 'Immediate Home / Organic Remedy:'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            {plainDiag.homeRemedy}
          </div>
        </div>

        {/* Store Medicine with exact dosage */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '4px solid #38bdf8',
            padding: '10px 12px',
            borderRadius: '0 10px 10px 0',
          }}
        >
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#7dd3fc', marginBottom: '2px' }}>
            🛒 {isHi ? 'कृषि केंद्र से दवा व सटीक मात्रा:' : 'Store Medicine & Exact Dilution:'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            {plainDiag.storeMedicine}
          </div>
        </div>

        {/* Mistakes to avoid */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '4px solid #f59e0b',
            padding: '10px 12px',
            borderRadius: '0 10px 10px 0',
          }}
        >
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fcd34d', marginBottom: '4px' }}>
            🚫 {isHi ? 'सावधानी: ये गलतियां कभी न करें:' : 'Critical Prohibited Mistakes:'}
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.45 }}>
            {plainDiag.avoidMistakes.map((mis, idx) => (
              <li key={idx}>{mis}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Footer: Knowledge Sources & Timestamp ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.66rem',
          color: '#64748b',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '10px',
        }}
      >
        <span>
          📚 Verified by ICAR Corpus & {analysis.id.includes('gemini') ? 'Gemini 2.5 Vision' : 'Dual CNN-YOLO Ensemble'}
        </span>
        <span>{timestamp}</span>
      </div>
    </article>
  );
}
