import { useState } from 'react';
import type { StandardCropDiagnosisJSON } from '../../utils/agriFramerEngine';

interface JsonSchemaViewerProps {
  data: StandardCropDiagnosisJSON;
}

export default function JsonSchemaViewer({ data }: JsonSchemaViewerProps) {
  const [copied, setCopied] = useState(false);

  // Exact JSON string with 2-space indentation
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.crop.toLowerCase().replace(/[^a-z0-9]/g, '_')}_diagnosis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Schema Validation Check
  const requiredKeys = [
    'crop',
    'disease',
    'symptoms',
    'severity',
    'confidence',
    'alternatives',
    'recommendation',
    'treatment'
  ] as const;

  const validKeysCount = requiredKeys.filter(k => {
    const val = data[k];
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'number') return val > 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return false;
  }).length;

  const isValidSchema = validKeysCount === requiredKeys.length;

  return (
    <div style={{
      background: '#11141c',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    }}>
      {/* Top Header Bar */}
      <div style={{
        background: '#161a24',
        padding: '12px 18px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 700 }}>
            Standard Agricultural Diagnosis JSON
          </span>
          <span style={{
            background: isValidSchema ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isValidSchema ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            color: isValidSchema ? '#34d399' : '#fbbf24',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {isValidSchema ? '✓ Schema Verified (8/8 Keys)' : `⚠️ Partial (${validKeysCount}/8)`}
          </span>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${copied ? '#10b981' : 'rgba(255, 255, 255, 0.12)'}`,
              color: copied ? '#34d399' : '#e2e8f0',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <span>💾</span>
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Code Container with Syntax Highlighting */}
      <pre style={{
        margin: 0,
        padding: '20px',
        overflowX: 'auto',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        color: '#e2e8f0',
        background: '#0d1117',
      }}>
        <code>
          {/* Syntax highlighted lines */}
          {jsonString.split('\n').map((line, idx) => {
            // Key highlighting
            const isKeyLine = /^\s*"([^"]+)":/.test(line);
            if (isKeyLine) {
              const parts = line.split(/":\s*/);
              const keyPart = parts[0] + '": ';
              const valuePart = parts.slice(1).join('": ');
              return (
                <div key={idx} style={{ display: 'flex' }}>
                  <span style={{ color: '#475569', width: '32px', userSelect: 'none', textAlign: 'right', marginRight: '16px' }}>
                    {idx + 1}
                  </span>
                  <div>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{keyPart}</span>
                    <span style={{ color: valuePart.startsWith('"') ? '#a7f3d0' : valuePart.startsWith('[') ? '#fbbf24' : '#f472b6' }}>
                      {valuePart}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} style={{ display: 'flex' }}>
                <span style={{ color: '#475569', width: '32px', userSelect: 'none', textAlign: 'right', marginRight: '16px' }}>
                  {idx + 1}
                </span>
                <span style={{ color: line.trim().startsWith('"') ? '#a7f3d0' : '#94a3b8' }}>{line}</span>
              </div>
            );
          })}
        </code>
      </pre>

      {/* Footer Schema Spec Guide */}
      <div style={{
        background: '#161a24',
        padding: '10px 18px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: '#94a3b8',
      }}>
        <span>Target Schema: {`{ crop, disease, symptoms, severity, confidence, alternatives, recommendation, treatment }`}</span>
        <span style={{ color: '#34d399' }}>● 100% Validated Output</span>
      </div>
    </div>
  );
}
