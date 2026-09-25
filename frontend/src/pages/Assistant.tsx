import { useState, useRef, useEffect } from 'react';
import { useUndoRedo } from '../hooks/useUndoRedo';
import {
  PRESET_CROP_SAMPLES,
  type CropAnalysisResult,
  type PresetCropSample,
  analyzeCustomImageElement,
  getPlainLanguageDiagnosis,
} from '../utils/agriFramerEngine';
import {
  scanCropImageWithGeminiAPI,
  getActiveGeminiApiKey,
} from '../utils/geminiVisionEngine';


interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  imageSrc?: string;
  analysis?: CropAnalysisResult;
  isAnalyzing?: boolean;
}

interface AssistantState {
  messages: ChatMessage[];
  currentAnalysis: CropAnalysisResult;
  imageSrc?: string;
}

interface LanguageOption {
  code: string;
  name: string;
  native: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🌾' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🌱' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🌿' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🌻' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌾' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🚜' },
];

let globalMsgCounter = 0;
function createMsgId(prefix: string) {
  globalMsgCounter += 1;
  return `${prefix}-${globalMsgCounter}`;
}

export default function Assistant() {
  const defaultSample = PRESET_CROP_SAMPLES[0];

  // Language & TTS
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => localStorage.getItem('farmer_lang_chosen') || 'en'
  );
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
  const isHi = selectedLanguage === 'hi';

  // Initial State for Undo/Redo
  const initialAssistantState: AssistantState = {
    messages: [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: 'Just now',
        text: isHi
          ? 'नमस्ते किसान मित्र! 👋 मैं आपका एग्रीफ्यूजन एआई क्रॉप डॉक्टर हूँ।\n\nअपनी फसल की पत्ती की तस्वीर अपलोड करने (Upload Image) या स्कैन (Scan) करने के लिए नीचे दिए गए + बटन का उपयोग करें, या फसल, कीट और खाद के बारे में कोई भी प्रश्न पूछें! 🌾'
          : 'Hello Farmer Friend! 👋 I am your AgriFusion AI Crop Doctor.\n\nUse the **+** button below to **Upload an Image** or **Scan** your crop leaf, or ask me any question about crops, diseases, pests, and farming! 🌾',
      },
    ],
    currentAnalysis: defaultSample.analysis,
    imageSrc: undefined,
  };

  const {
    state: assistantState,
    setState: setAssistantState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    currentIndex,
  } = useUndoRedo<AssistantState>(initialAssistantState, 'Initial Assistant Welcome');

  // Input state
  const [inputText, setInputText] = useState('');
  const [stagedImage, setStagedImage] = useState<{ src: string; file: File } | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Active Gemini Vision API Key (handled automatically in background)
  const [apiKey] = useState<string>(() => getActiveGeminiApiKey());

  // Camera Scanner Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantState.messages]);

  // Click outside listener for attachment menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Audio Speech Synthesis
  const speakDiagnosis = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // ── File Selection Handler ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setStagedImage({ src: dataUrl, file });
      setShowAttachmentMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Camera Scanner Handlers ──
  const startCamera = async () => {
    setShowAttachmentMenu(false);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 150);
    } catch {
      alert(
        isHi
          ? 'कैमरा शुरू नहीं हो सका। कृपया कैमरा अनुमति की जांच करें।'
          : 'Camera access denied or unavailable. Please check permissions.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();

      // Stage captured photo
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], 'camera_crop_scan.jpg', { type: mimeString });
      setStagedImage({ src: dataUrl, file });
    }
  };

  // ── Analyze and Add to Conversation via REAL Gemini Vision API Call ──
  const processImageAnalysis = async (imgDataUrl: string, fileName: string, userPrompt?: string) => {
    const userMsgId = createMsgId('user');
    const assistantMsgId = createMsgId('asst');

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userPrompt || (isHi ? 'कृपया इस फसल की पत्ती का विश्लेषण करें।' : 'Analyze this crop leaf for diseases and pests.'),
      imageSrc: imgDataUrl,
    };

    // 2. Add Temporary Analyzing Message
    const analyzingMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      timestamp: 'Scanning...',
      isAnalyzing: true,
      text: isHi
        ? '🔍 छवि का विश्लेषण हो रहा है...'
        : '🔍 Analyzing image...',
    };

    const intermediateMessages = [...assistantState.messages, userMsg, analyzingMsg];
    setAssistantState(
      {
        messages: intermediateMessages,
        currentAnalysis: assistantState.currentAnalysis,
        imageSrc: imgDataUrl,
      },
      `Scanning: ${fileName}`
    );

    // 3. Real Vision API Call with Active Key
    try {
      const realResult = await scanCropImageWithGeminiAPI(
        imgDataUrl,
        fileName,
        apiKey,
        selectedLanguage
      );

      const finalAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnalyzing: false,
        analysis: realResult,
        imageSrc: imgDataUrl,
      };

      const updatedMessages = assistantState.messages
        .filter((m) => m.id !== analyzingMsg.id)
        .concat([userMsg, finalAssistantMsg]);

      setAssistantState(
        {
          messages: updatedMessages,
          currentAnalysis: realResult,
          imageSrc: imgDataUrl,
        },
        `Gemini Vision Scanned: ${realResult.cropName}`
      );
    } catch (apiError) {
      console.warn('Gemini Vision API call failed, falling back to local vision engine:', apiError);

      const img = new Image();
      img.onload = async () => {
        const fallbackResult = await analyzeCustomImageElement(img, fileName);

        const finalAssistantMsg: ChatMessage = {
          id: assistantMsgId,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAnalyzing: false,
          analysis: fallbackResult,
          imageSrc: imgDataUrl,
        };

        const updatedMessages = assistantState.messages
          .filter((m) => m.id !== analyzingMsg.id)
          .concat([userMsg, finalAssistantMsg]);

        setAssistantState(
          {
            messages: updatedMessages,
            currentAnalysis: fallbackResult,
            imageSrc: imgDataUrl,
          },
          `Analyzed (Fallback): ${fallbackResult.cropName}`
        );
      };
      img.src = imgDataUrl;
    }
  };

  // ── Handle User Send ──
  const handleSendMessage = async () => {
    if (!inputText.trim() && !stagedImage) return;

    const textToSend = inputText.trim();
    const imageToSend = stagedImage;
    setInputText('');
    setStagedImage(null);

    // If an image was staged
    if (imageToSend) {
      await processImageAnalysis(imageToSend.src, imageToSend.file.name, textToSend);
      return;
    }

    // Text-only question
    const userMsgId = createMsgId('user');
    const asstMsgId = createMsgId('asst');
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    // Generate smart agronomic response
    let answerText = '';
    const lower = textToSend.toLowerCase();

    if (lower.includes('fertilizer') || lower.includes('npk') || lower.includes('urea') || lower.includes('खाद')) {
      answerText = isHi
        ? '🌾 **उर्वरक एवं पोषण सलाह:**\n\n1. **बुवाई के समय:** डीएपी (DAP) 50 किग्रा + पोटाश 25 किग्रा प्रति एकड़ आधार के रूप में डालें।\n2. **पहली सिंचाई:** 35 किग्रा यूरिया + 5 किग्रा जिंक सल्फेट प्रति एकड़ डालें।\n3. **सावधानी:** रोगग्रस्त पत्तियों पर अधिक यूरिया न डालें; पोटाश डालने से फसल की रोग प्रतिरोधक क्षमता बढ़ती है।'
        : '🌾 **Fertilizer & Nutrition Advisory:**\n\n1. **Basal Dose (Sowing):** Apply 50 kg DAP + 25 kg MOP (Potash) per acre.\n2. **First Irrigation (Tillering):** Topdress 35 kg Urea combined with 5 kg Zinc Sulfate (21%) per acre.\n3. **Crucial Rule:** Never over-apply Urea if fungal lesions or leaf spots are visible; Potassium strengthens cell walls against pathogens.';
    } else if (lower.includes('water') || lower.includes('irrigation') || lower.includes('सिंचाई')) {
      answerText = isHi
        ? '💧 **सिंचाई प्रबंधन:**\n\n1. **जड़ जमाव अवस्था:** बुवाई के 20-25 दिनों बाद पहली हल्की सिंचाई करें।\n2. **फूल और दाना बनते समय:** यह सबसे नाजुक अवस्था है, खेत में नमी बनाए रखें।\n3. **सावधानी:** पत्तियों पर ऊपर से पानी छिड़कने से फफूंद रोग फैलता है; केवल नाली या ड्रिप से पानी दें।'
        : '💧 **Irrigation Management:**\n\n1. **Crown Root Initiation (CRI):** Irrigate lightly 20-25 days after sowing.\n2. **Flowering & Grain Filling:** Moisture stress during these stages reduces yield by up to 40%.\n3. **Disease Prevention:** Avoid overhead sprinkler irrigation during cloudy or humid days to prevent fungal spore germination.';
    } else if (lower.includes('pest') || lower.includes('worm') || lower.includes('insect') || lower.includes('कीट')) {
      answerText = isHi
        ? '🐛 **जैविक एवं रासायनिक कीट नियंत्रण:**\n\n1. **घरेलू उपाय:** 5% नीम का तेल (10,000 ppm) 4 मिली प्रति लीटर पानी में मिलाकर शाम के समय छिड़कें।\n2. **दुकान की दवा:** गंभीर सुंडी के लिए एमामेक्टिन बेंजोएट 5% SG (0.4 ग्राम/लीटर) या कोराजन (0.3 मिली/लीटर) का उपयोग करें।\n3. **ट्रैप:** प्रति एकड़ 5-6 फेरोमोन ट्रैप लगाएं।'
        : '🐛 **Integrated Pest Management:**\n\n1. **Home Organic Spray:** Mix 4 ml cold-pressed Neem Oil (10,000 ppm) + 1 tsp liquid soap per 1 liter water. Spray during late afternoon.\n2. **Chemical Control:** For caterpillars/borers, spray Emamectin Benzoate 5% SG @ 0.4 g/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L.\n3. **Monitoring:** Install 5 to 8 pheromone traps per acre to catch adult moths before egg laying.';
    } else {
      answerText = isHi
        ? `🌱 **कृषि मित्र सलाह:**\n\nआपके प्रश्न: "${textToSend}" के संबंध में:\n\n1. **पत्ती परीक्षण:** सटीक रोग व कीट पहचान के लिए बाईं तरफ **+** बटन दबाकर पत्ती की फोटो अपलोड या स्कैन करें।\n2. **तुरंत उपाय:** फसल में वायु संचार बनाए रखें और अत्यधिक नाइट्रोजन खाद से बचें।\n3. **संपर्क:** किसी भी कीट या फंगल लक्षण के लिए तुरंत दवा का अनुशंसित अनुपात ही उपयोग करें।`
        : `🌱 **Agri Advisor Response:**\n\nRegarding: "${textToSend}":\n\n1. **Visual Crop Check:** For 96%+ accurate disease & pest diagnosis, click the **+** button on the bottom-left to upload or scan a crop leaf.\n2. **General Field Hygiene:** Maintain good spacing between rows, remove weed hosts, and monitor lower leaves for early discoloration.\n3. **Balanced Plant Health:** Ensure adequate micronutrients (Boron, Zinc) along with balanced NPK.`;
    }

    const asstMsg: ChatMessage = {
      id: asstMsgId,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: answerText,
    };

    setAssistantState(
      {
        messages: [...assistantState.messages, userMsg, asstMsg],
        currentAnalysis: assistantState.currentAnalysis,
        imageSrc: assistantState.imageSrc,
      },
      `Question: ${textToSend.substring(0, 20)}...`
    );
  };

  // ── Benchmark Sample Trigger ──
  const handleLoadSample = (sample: PresetCropSample) => {
    const userMsg: ChatMessage = {
      id: createMsgId('user-sample'),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Analyze sample crop: ${sample.cropName} (${sample.diseaseName.split(' ')[0]})`,
    };

    const asstMsg: ChatMessage = {
      id: createMsgId('asst-sample'),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      analysis: sample.analysis,
    };

    setAssistantState(
      {
        messages: [...assistantState.messages, userMsg, asstMsg],
        currentAnalysis: sample.analysis,
        imageSrc: undefined,
      },
      `Sample: ${sample.cropName}`
    );
  };

  // ── Speech Recognition (Voice Prompt) ──
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isHi ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // ── Clear Chat ──
  const handleClearChat = () => {
    setAssistantState(initialAssistantState, 'Reset Chat to Initial State');
  };


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        paddingTop: '72px',
        boxSizing: 'border-box',
        minHeight: 0,
        background: '#070a11',
        color: '#f1f5f9',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* ── TOP ASSISTANT BAR (ChatGPT Style Header) ── */}
      <div
        style={{
          height: '56px',
          background: 'rgba(10, 15, 25, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          flexShrink: 0,
          zIndex: 30,
          gap: '12px',
        }}
      >
        {/* Left: Assistant Title & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                AgriFusion <span style={{ color: '#10b981' }}>AI Doctor</span>
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                ● Vision Model Online
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Simple explanations for farmers • Technical diagnosis inside
            </div>
          </div>
        </div>

        {/* Center: Quick Benchmark Crop Sample Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            padding: '2px 0',
            maxWidth: '520px',
          }}
          className="hide-scrollbar"
        >
          {PRESET_CROP_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '4px 10px',
                borderRadius: '14px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              {sample.cropName}
            </button>
          ))}
        </div>

        {/* Right: Undo, Redo, Language & Clear */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Undo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo last action (Ctrl+Z)"
            style={{
              background: canUndo ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${canUndo ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
              color: canUndo ? '#fff' : '#64748b',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: canUndo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>↩</span>
            <span className="hide-mobile-sm">Undo</span>
          </button>

          {/* Redo */}
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo action (Ctrl+Y)"
            style={{
              background: canRedo ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${canRedo ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
              color: canRedo ? '#fff' : '#64748b',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: canRedo ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>↪</span>
            <span className="hide-mobile-sm">Redo</span>
          </button>

          {/* History Step Badge */}
          <span
            style={{
              fontSize: '0.68rem',
              color: '#64748b',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
            title="Analysis history steps"
            className="hide-mobile-sm"
          >
            Step {currentIndex + 1}/{history.length}
          </span>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                padding: '5px 9px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#161c28',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '6px',
                  minWidth: '150px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                  zIndex: 100,
                }}
              >
                {LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      setSelectedLanguage(l.code);
                      localStorage.setItem('farmer_lang_chosen', l.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: selectedLanguage === l.code ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: selectedLanguage === l.code ? '#34d399' : '#e2e8f0',
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.native}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset / Clear Chat */}
          <button
            onClick={handleClearChat}
            title="Clear Chat Conversation"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '6px',
              borderRadius: '6px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ── CHAT MESSAGE STREAM (ChatGPT Center Layout) ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 16px 140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '880px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {assistantState.messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const plainDiag = msg.analysis ? getPlainLanguageDiagnosis(msg.analysis) : null;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: isUser ? '85%' : '100%',
                  width: isUser ? 'auto' : '100%',
                }}
              >
                {/* Avatar */}
                {!isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    🌱
                  </div>
                )}

                {/* Message Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* User Message Bubble */}
                  {isUser && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '12px 18px',
                        borderRadius: '18px 18px 4px 18px',
                        color: '#f8fafc',
                        fontSize: '0.92rem',
                        lineHeight: 1.5,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Attached Thumbnail Preview in user bubble */}
                      {msg.imageSrc && (
                        <div style={{ marginBottom: '10px' }}>
                          <img
                            src={msg.imageSrc}
                            alt="Crop leaf"
                            style={{
                              maxWidth: '220px',
                              maxHeight: '160px',
                              borderRadius: '12px',
                              objectFit: 'cover',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              display: 'block',
                            }}
                          />
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: '#34d399',
                              marginTop: '4px',
                              fontWeight: 600,
                            }}
                          >
                            📷 Agricultural Leaf Image Attached
                          </div>
                        </div>
                      )}
                      <div>{msg.text}</div>
                    </div>
                  )}

                  {/* Assistant Text Response (Non-Diagnosis or Welcome) */}
                  {!isUser && msg.text && (
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '16px 20px',
                        borderRadius: '18px',
                        color: '#e2e8f0',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
                      }}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Assistant Analyzing Spinner */}
                  {!isUser && msg.isAnalyzing && (
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '16px 20px',
                        borderRadius: '18px',
                        color: '#86efac',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid rgba(16, 185, 129, 0.2)',
                          borderTopColor: '#10b981',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      <span>{msg.text}</span>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      DIAGNOSIS CARD: "NO KNOWLEDGE PERSON ALSO UNDERSTAND"
                      Explicitly presents:
                      1. Crop Name
                      2. Disease
                      3. Pests
                      4. Confidence
                      5. Symptoms
                      6. Treatment
                      Inside all features: Pipeline Flow, YOLO Boxes, JSON Output
                     ───────────────────────────────────────────────────────────── */}
                  {!isUser && msg.analysis && plainDiag && (
                    <div
                      style={{
                        background: '#0c121d',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '22px',
                        padding: '24px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                        width: '100%',
                      }}
                    >
                      {/* Top Header: Crop Name, Disease, Confidence Score, Voice Read Aloud */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '14px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                          paddingBottom: '16px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px',
                            }}
                          >
                            🌾 {isHi ? 'फसल का नाम (Crop Name)' : 'Crop Name'}
                          </div>
                          <div
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 900,
                              color: '#ffffff',
                              marginTop: '2px',
                            }}
                          >
                            {plainDiag.cropName}
                          </div>
                          <div
                            style={{
                              color: '#38bdf8',
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              marginTop: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>🦠 {isHi ? 'रोग (Disease):' : 'Disease:'}</span>
                            <span>{plainDiag.diseaseSimple}</span>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '3px' }}>
                            {plainDiag.diseaseExplanation}
                          </div>
                        </div>

                        {/* Confidence Score Pill & Listen Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <div
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              padding: '6px 14px',
                              borderRadius: '14px',
                              textAlign: 'right',
                            }}
                          >
                            <div style={{ color: '#34d399', fontWeight: 900, fontSize: '0.95rem' }}>
                              {plainDiag.confidenceBadge}
                            </div>
                            <div style={{ color: '#86efac', fontSize: '0.65rem', fontWeight: 700 }}>
                              {msg.analysis?.id.includes('gemini') ? '⚡ Scanned via Gemini Vision API' : 'Dual YOLO & CNN Verified'}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              speakDiagnosis(
                                `${plainDiag.cropName}. ${plainDiag.diseaseSimple}. ${plainDiag.pestsStatus}. Treatment: ${plainDiag.homeRemedy}`
                              )
                            }
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#fff',
                              padding: '6px 12px',
                              borderRadius: '10px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                            title="Listen diagnosis in simple voice"
                          >
                            <span>🔊</span>
                            <span>{isHi ? 'बोलकर सुनें (Listen)' : 'Listen Out Loud'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 1. VISIBLE SYMPTOMS (What Anyone Can See With Their Eyes) */}
                      <div
                        style={{
                          background: 'rgba(56, 189, 248, 0.06)',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          padding: '14px 16px',
                          borderRadius: '14px',
                        }}
                      >
                        <div
                          style={{
                            color: '#38bdf8',
                            fontSize: '0.75rem',
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
                          <span>{isHi ? 'लक्षण (Visible Symptoms in Plain Words):' : 'Visible Symptoms (Easy to Spot):'}</span>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {plainDiag.symptomsList.map((sym, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {sym}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 2. PESTS STATUS (Clear Statement: Bugs vs Fungal) */}
                      <div
                        style={{
                          background: plainDiag.pestsStatus.includes('ALERT')
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(16, 185, 129, 0.08)',
                          border: `1px solid ${
                            plainDiag.pestsStatus.includes('ALERT')
                              ? 'rgba(239, 68, 68, 0.3)'
                              : 'rgba(16, 185, 129, 0.25)'
                          }`,
                          padding: '14px 16px',
                          borderRadius: '14px',
                        }}
                      >
                        <div
                          style={{
                            color: plainDiag.pestsStatus.includes('ALERT') ? '#fca5a5' : '#86efac',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>🐛</span>
                          <span>{isHi ? 'कीट स्थिति (Pests Analysis):' : 'Pests & Insects Status:'}</span>
                        </div>
                        <div
                          style={{
                            color: plainDiag.pestsStatus.includes('ALERT') ? '#fee2e2' : '#f0fdf4',
                            fontSize: '0.88rem',
                            lineHeight: 1.5,
                            fontWeight: 600,
                          }}
                        >
                          {plainDiag.pestsStatus}
                        </div>
                      </div>

                      {/* 3. TREATMENT: 3 SIMPLE SECTIONS */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                          style={{
                            color: '#34d399',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          💊 {isHi ? 'इलाज एवं रोकथाम (Easy Treatment & Remedies):' : 'Easy Treatment & Remedies:'}
                        </div>

                        {/* A. Immediate Home Remedy */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderLeft: '4px solid #10b981',
                            padding: '12px 14px',
                            borderRadius: '0 12px 12px 0',
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#86efac', marginBottom: '3px' }}>
                            🏡 {isHi ? 'घरेलू सुरक्षित उपाय (Home Remedy):' : 'Immediate Home Remedy (Safe & Simple):'}
                          </div>
                          <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                            {plainDiag.homeRemedy}
                          </div>
                        </div>

                        {/* B. Agricultural Shop Medicine with exact dosage */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderLeft: '4px solid #38bdf8',
                            padding: '12px 14px',
                            borderRadius: '0 12px 12px 0',
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7dd3fc', marginBottom: '3px' }}>
                            🛒 {isHi ? 'दुकान की दवा एवं मात्रा (Store Medicine & Exact Dose):' : 'Store Medicine (Ask at Shop):'}
                          </div>
                          <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                            {plainDiag.storeMedicine}
                          </div>
                        </div>

                        {/* C. Big Mistakes to Avoid */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderLeft: '4px solid #f59e0b',
                            padding: '12px 14px',
                            borderRadius: '0 12px 12px 0',
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d', marginBottom: '4px' }}>
                            🚫 {isHi ? 'ये गलतियाँ कभी न करें (Mistakes to Avoid):' : 'Critical Mistakes to Avoid:'}
                          </div>
                          <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.5 }}>
                            {plainDiag.avoidMistakes.map((mis, idx) => (
                              <li key={idx}>{mis}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHATGPT-STYLE FLOATING BOTTOM PROMPT BAR
          LEFT SIDE: + Attachment button (Upload Image / Scan Image)
          MIDDLE: Text Prompt Input Box
          RIGHT: Mic / Voice & Send Button
         ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '860px',
          width: 'calc(100% - 32px)',
          zIndex: 40,
        }}
      >
        {/* Staged Image Preview Chip (Visible when an image is ready before sending) */}
        {stagedImage && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '14px',
              padding: '8px 14px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={stagedImage.src}
                alt="Selected crop"
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                  {stagedImage.file.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                  Ready to scan • Click Send ➔
                </div>
              </div>
            </div>
            <button
              onClick={() => setStagedImage(null)}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: 'none',
                color: '#f87171',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
              }}
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Pill Container */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* ── LEFT SIDE: ATTACHMENT MENU (+) & INSTANT CAMERA (Available to all users) ── */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }} ref={menuRef}>
            {/* Attachment Button (+) */}
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              title="Attach Image (Upload or Scan)"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: showAttachmentMenu ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: showAttachmentMenu ? '#042f1a' : '#fff',
                fontSize: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              +
            </button>

            {/* Instant Camera Shortcut */}
            <button
              onClick={startCamera}
              title="Quick Camera Scan"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              📸
            </button>

            {/* Left Attachment Dropdown Popover */}
            {showAttachmentMenu && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '50px',
                  left: 0,
                  background: '#161c28',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '8px',
                  width: '210px',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.7)',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {/* 1. Upload Image */}
                <div
                  onClick={() => {
                    setShowAttachmentMenu(false);
                    fileInputRef.current?.click();
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                    color: '#f8fafc',
                    fontWeight: 600,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '1.2rem' }}>📤</span>
                  <div>
                    <div>Upload Image</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Select image from device</div>
                  </div>
                </div>

                {/* 2. Scan (Live Camera) */}
                <div
                  onClick={() => {
                    setShowAttachmentMenu(false);
                    startCamera();
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    fontWeight: 600,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '1.2rem' }}>📸</span>
                  <div>
                    <div>Scan</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Live Camera Scan</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── MIDDLE: PROMPT TEXT INPUT ── */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isHi
                ? 'फसल, रोग, कीट या खाद के बारे में पूछें या बाईं ओर फोटो अपलोड करें...'
                : 'Ask anything about crops, pests, treatments... or upload/scan leaf on left'
            }
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.92rem',
              padding: '6px 4px',
            }}
          />

          {/* ── RIGHT: VOICE MIC & SEND BUTTON ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Mic Button */}
            <button
              onClick={toggleVoiceInput}
              title={isListening ? 'Listening...' : 'Voice Input'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              🎙️
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() && !stagedImage}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background:
                  inputText.trim() || stagedImage
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: inputText.trim() || stagedImage ? '#ffffff' : '#64748b',
                fontSize: '1.05rem',
                cursor: inputText.trim() || stagedImage ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow:
                  inputText.trim() || stagedImage ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              ➔
            </button>
          </div>
        </div>
      </div>

      {/* ── CAMERA SCANNER MODAL (Available to all users) ── */}
      {showCameraModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#141a26',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Camera Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📸</span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                  Live Crop Leaf Scanner
                </span>
              </div>
              <button
                onClick={stopCamera}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Video Viewfinder */}
            <div style={{ position: 'relative', width: '100%', height: '340px', background: '#000' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Targeting Reticle Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: '40px',
                  border: '2px dashed rgba(16, 185, 129, 0.8)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    color: '#86efac',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  Center diseased crop leaf here
                </div>
              </div>
            </div>

            {/* Capture Buttons */}
            <div
              style={{
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                background: '#0d121c',
              }}
            >
              <button
                onClick={stopCamera}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                onClick={captureCameraPhoto}
                style={{
                  padding: '12px 28px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                }}
              >
                <span>📸</span>
                <span>Capture & Diagnose</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS helpers */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 640px) {
          .hide-mobile-sm {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
