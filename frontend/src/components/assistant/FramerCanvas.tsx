import { useState, useRef } from 'react';
import type { CropAnalysisResult, PresetCropSample, YoloBox } from '../../utils/agriFramerEngine';
import { PRESET_CROP_SAMPLES, analyzeCustomImageElement } from '../../utils/agriFramerEngine';

interface FramerCanvasProps {
  currentAnalysis: CropAnalysisResult;
  onSelectSample: (sample: PresetCropSample) => void;
  onCustomImageAnalyzed: (result: CropAnalysisResult, imageSrc: string) => void;
  activeImageSrc?: string;
}

export default function FramerCanvas({
  currentAnalysis,
  onSelectSample,
  onCustomImageAnalyzed,
  activeImageSrc,
}: FramerCanvasProps) {
  // Canvas Viewport Controls
  const [zoom, setZoom] = useState<number>(100);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'rgb' | 'mask' | 'heatmap' | 'edges'>('rgb');
  const [hoveredBox, setHoveredBox] = useState<YoloBox | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zoom helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  // Custom File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        const result = await analyzeCustomImageElement(img, file.name);
        onCustomImageAnalyzed(result, dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Find thumbnail SVG if preset sample
  const matchingPreset = PRESET_CROP_SAMPLES.find(
    s => s.cropName.toLowerCase() === currentAnalysis.cropName.toLowerCase() ||
         s.diseaseName.toLowerCase().includes(currentAnalysis.diseaseName.toLowerCase().slice(0, 10))
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
    }}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* ── Studio Canvas Card ── */}
      <div style={{
        position: 'relative',
        background: '#0d111a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Canvas Toolbar */}
        <div style={{
          background: '#141a26',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          {/* Left: Layer Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              Layers:
            </span>
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              style={{
                background: showBoxes ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showBoxes ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                color: showBoxes ? '#f472b6' : '#94a3b8',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🎯 YOLO BBoxes ({currentAnalysis.yoloBoxes.length})
            </button>

            <button
              onClick={() => setShowLabels(!showLabels)}
              style={{
                background: showLabels ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showLabels ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                color: showLabels ? '#38bdf8' : '#94a3b8',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🏷️ Confidence Tags
            </button>

            {/* Filter modes */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '2px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['rgb', 'mask', 'heatmap', 'edges'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setActiveFilter(mode)}
                  style={{
                    background: activeFilter === mode ? '#2563eb' : 'transparent',
                    border: 'none',
                    color: activeFilter === mode ? '#fff' : '#94a3b8',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Zoom & Upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={handleZoomOut}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px 6px', fontWeight: 800 }}
              >
                -
              </button>
              <span style={{ fontSize: '0.74rem', color: '#e2e8f0', minWidth: '40px', textAlign: 'center', fontWeight: 700 }}>
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px 6px', fontWeight: 800 }}
              >
                +
              </button>
              <button
                onClick={handleResetZoom}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.68rem', cursor: 'pointer', marginLeft: '4px' }}
                title="Reset zoom"
              >
                Reset
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span>📤</span>
              <span>Upload Crop Image</span>
            </button>
          </div>
        </div>

        {/* ── Visual Viewport ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          background: '#090d14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}>
          {/* Scalable Container */}
          <div style={{
            position: 'relative',
            width: '600px',
            maxWidth: '92%',
            aspectRatio: '4 / 3',
            transform: `scale(${zoom / 100})`,
            transition: 'transform 0.15s ease',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.12)',
            filter: activeFilter === 'mask'
              ? 'hue-rotate(90deg) contrast(150%)'
              : activeFilter === 'heatmap'
              ? 'invert(20%) sepia(100%) saturate(400%) hue-rotate(330deg)'
              : activeFilter === 'edges'
              ? 'grayscale(100%) contrast(300%)'
              : 'none',
          }}>
            {/* Custom Uploaded Image OR Preset Sample Vector Graphic */}
            {activeImageSrc ? (
              <img
                src={activeImageSrc}
                alt="Agricultural Leaf Sample"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : matchingPreset ? (
              <div
                dangerouslySetInnerHTML={{ __html: matchingPreset.thumbnailSvg }}
                style={{ width: '100%', height: '100%', display: 'flex' }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: PRESET_CROP_SAMPLES[0].thumbnailSvg }}
                style={{ width: '100%', height: '100%', display: 'flex' }}
              />
            )}

            {/* ── YOLO Bounding Box Overlays ── */}
            {showBoxes && currentAnalysis.yoloBoxes.map(box => {
              const isHovered = hoveredBox?.id === box.id;
              const boxColor = box.category === 'pest'
                ? '#ec4899'
                : box.category === 'chlorosis'
                ? '#f59e0b'
                : box.category === 'necrosis'
                ? '#ef4444'
                : '#38bdf8';

              return (
                <div
                  key={box.id}
                  onMouseEnter={() => setHoveredBox(box)}
                  onMouseLeave={() => setHoveredBox(null)}
                  style={{
                    position: 'absolute',
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                    border: `2px solid ${boxColor}`,
                    background: isHovered ? `${boxColor}33` : `${boxColor}15`,
                    boxShadow: isHovered ? `0 0 16px ${boxColor}` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    zIndex: isHovered ? 20 : 10,
                  }}
                >
                  {/* Bounding box corner ticks */}
                  <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '8px', height: '8px', borderTop: `3px solid ${boxColor}`, borderLeft: `3px solid ${boxColor}` }} />
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderTop: `3px solid ${boxColor}`, borderRight: `3px solid ${boxColor}` }} />
                  <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '8px', height: '8px', borderBottom: `3px solid ${boxColor}`, borderLeft: `3px solid ${boxColor}` }} />
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '8px', height: '8px', borderBottom: `3px solid ${boxColor}`, borderRight: `3px solid ${boxColor}` }} />

                  {/* Confidence Pill Badge */}
                  {showLabels && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      marginBottom: '2px',
                      background: boxColor,
                      color: '#000',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    }}>
                      {box.label} {(box.confidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hovered Box Telemetry HUD in Corner */}
          {hoveredBox && (
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '18px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '0.75rem',
              color: '#fff',
              zIndex: 30,
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontWeight: 800, color: '#38bdf8' }}>{hoveredBox.label}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                Coords: [{hoveredBox.x.toFixed(1)}%, {hoveredBox.y.toFixed(1)}%] | Size: {hoveredBox.w.toFixed(1)}x{hoveredBox.h.toFixed(1)}% | Conf: {(hoveredBox.confidence * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* ── Preset Sample Gallery Bar ── */}
        <div style={{
          background: '#121722',
          padding: '14px 18px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            fontSize: '0.74rem',
            color: '#94a3b8',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>🌱 Realistic Crop Benchmark Samples (Click to Analyze):</span>
            <span style={{ color: '#34d399' }}>8 High-Precision Datasets Loaded</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '10px',
          }}>
            {PRESET_CROP_SAMPLES.map(sample => {
              const isSelected = sample.cropName.toLowerCase() === currentAnalysis.cropName.toLowerCase() && !activeImageSrc;

              return (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${isSelected ? sample.accentColor : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '12px',
                    padding: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? `0 0 12px ${sample.accentColor}44` : 'none',
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#090d14',
                    marginBottom: '6px',
                  }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: sample.thumbnailSvg }}
                      style={{ width: '100%', height: '100%', display: 'flex' }}
                    />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff' }}>
                    {sample.cropName}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: sample.accentColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sample.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
