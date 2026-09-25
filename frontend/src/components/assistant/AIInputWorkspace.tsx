import { useState, useRef, useEffect } from 'react';

interface AIInputWorkspaceProps {
  inputText: string;
  setInputText: (val: string) => void;
  stagedImage: { src: string; file: File } | null;
  setStagedImage: (val: { src: string; file: File } | null) => void;
  isAnalyzing: boolean;
  isListening: boolean;
  toggleVoiceInput: () => void;
  startCamera: () => void;
  onTriggerFileUpload: () => void;
  onSubmit: () => void;
  isHi?: boolean;
  className?: string;
}

export default function AIInputWorkspace({
  inputText,
  setInputText,
  stagedImage,
  setStagedImage,
  isAnalyzing,
  isListening,
  toggleVoiceInput,
  startCamera,
  onTriggerFileUpload,
  onSubmit,
  isHi = false,
  className = '',
}: AIInputWorkspaceProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    if (showPlusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlusMenu]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setValidationError(null);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError(isHi ? 'कृपया केवल छवि (JPG, PNG, WEBP) अपलोड करें।' : 'Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError(isHi ? 'छवि का आकार 10MB से कम होना चाहिए।' : 'Image size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setStagedImage({ src: reader.result as string, file });
    };
    reader.readAsDataURL(file);
  };

  const canSubmit = !isAnalyzing && (inputText.trim().length > 0 || stagedImage !== null);

  return (
    <div
      className={className}
      style={{
        background: 'rgba(11, 16, 28, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🔬</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.5px' }}>
            {isHi ? 'मल्टीमोडल इनपुट स्टेशन' : 'MULTIMODAL INPUT DOCK'}
          </span>
        </div>
        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>
          CAMERA & UPLOAD ACTIVE
        </span>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '8px 12px',
            color: '#fca5a5',
            fontSize: '0.74rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>⚠️ {validationError}</span>
          <button
            onClick={() => setValidationError(null)}
            style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Drag & Drop / Upload / Camera Zone */}
      {!stagedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragOver ? '#10b981' : 'rgba(255, 255, 255, 0.12)'}`,
            borderRadius: '16px',
            padding: '18px 14px',
            textAlign: 'center',
            background: isDragOver ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '1.8rem' }}>🍃</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
            {isHi ? 'पत्ती की फोटो यहां खींचें या चुनें' : 'Drag & Drop Crop Leaf Photo Here'}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
            Supports JPG, PNG, WEBP (Max 10MB)
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Upload File Button */}
            <button
              onClick={onTriggerFileUpload}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <span>📤</span>
              <span>{isHi ? 'फोटो चुनें' : 'Upload Image'}</span>
            </button>

            {/* Live Camera Scanner Button */}
            <button
              onClick={startCamera}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)')}
            >
              <span>📸</span>
              <span>{isHi ? 'कैमरा स्कैन' : 'Scan with Camera'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Staged Image Preview Card */
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={stagedImage.src}
              alt="Staged leaf"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                {stagedImage.file.name}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#34d399', fontWeight: 600 }}>
                {(stagedImage.file.size / 1024).toFixed(1)} KB • {isHi ? 'स्कैन के लिए तैयार' : 'Ready for Diagnosis'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setStagedImage(null)}
            title="Remove staged image"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: 'none',
              color: '#f87171',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Multimodal Prompt Input Box */}
      <div
        ref={plusMenuRef}
        style={{
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Top Input Row: [+] Button & Text Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Plus (+) Button with popover */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setShowPlusMenu(!showPlusMenu)}
              title={isHi ? 'छवि जोड़ें या स्कैन करें' : 'Add image or scan'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: showPlusMenu
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${
                  showPlusMenu ? '#10b981' : 'rgba(255, 255, 255, 0.18)'
                }`,
                color: showPlusMenu ? '#86efac' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: 1,
                transition: 'all 0.2s ease',
                transform: showPlusMenu ? 'rotate(45deg)' : 'none',
                boxShadow: showPlusMenu ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              +
            </button>

            {/* Plus Options Popover Menu */}
            {showPlusMenu && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '125%',
                  left: 0,
                  background: '#0d1525',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '220px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.15)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Option 1: Add Image */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPlusMenu(false);
                    onTriggerFileUpload();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                    width: '100%',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    🖼️
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
                      {isHi ? 'छवि जोड़ें' : 'Add image'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {isHi ? 'गैलरी या फ़ाइल से अपलोड करें' : 'Upload photo from device'}
                    </div>
                  </div>
                </button>

                {/* Option 2: Scan */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPlusMenu(false);
                    startCamera();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                    width: '100%',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    📸
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#86efac' }}>
                      {isHi ? 'स्कैन करें' : 'Scan'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {isHi ? 'लाइव कैमरे से पत्ता स्कैन करें' : 'Live optical camera scanner'}
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder={
              isHi
                ? 'Ask फसल की बीमारी या उपचार के बारे में...'
                : stagedImage
                ? 'Add notes (e.g., "Brown spots appeared 3 days ago")...'
                : 'Ask anything about crops, pests, fertilizers or upload leaf...'
            }
            style={{
              flex: 1,
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.88rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Input Bar Bottom Actions: Voice & Submit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
          {/* Voice Input Button */}
          <button
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... Click to stop' : 'Voice Input (Speech-to-Text)'}
            style={{
              background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isListening ? '🔴' : '🎙️'}</span>
            <span>{isListening ? 'Listening...' : 'Voice'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: canSubmit ? '#ffffff' : '#64748b',
              padding: '7px 18px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: canSubmit ? '0 2px 14px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {isAnalyzing ? (
              <>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span>Analyzing...</span>
              </>
            ) : stagedImage ? (
              <>
                <span>🔬</span>
                <span>{isHi ? 'फसल विश्लेषण करें' : 'Analyze Crop'}</span>
              </>
            ) : (
              <>
                <span>➔</span>
                <span>{isHi ? 'पूछें' : 'Send Question'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
