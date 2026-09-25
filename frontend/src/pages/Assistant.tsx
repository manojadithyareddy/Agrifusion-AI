import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUndoRedo } from '../hooks/useUndoRedo';
import {
  PRESET_CROP_SAMPLES,
  type CropAnalysisResult,
  type PresetCropSample,
  analyzeCustomImageElement,
} from '../utils/agriFramerEngine';
import {
  scanCropImageWithGeminiAPI,
  getActiveGeminiApiKey,
  saveGeminiApiKey,
  DEFAULT_GEMINI_KEY,
} from '../utils/geminiVisionEngine';

// Subcomponents
import AICommandHeader from '../components/assistant/AICommandHeader';
import AI3DCore, { type AI3DState } from '../components/assistant/AI3DCore';
import AIProcessingPipelineBar from '../components/assistant/AIProcessingPipelineBar';
import AIInputWorkspace from '../components/assistant/AIInputWorkspace';
import AIIntelligencePanel from '../components/assistant/AIIntelligencePanel';
import QuickActionGrid, { type QuickActionItem } from '../components/assistant/QuickActionGrid';
import AIResponseReport from '../components/assistant/AIResponseReport';
import AIBackgroundGrid from '../components/assistant/AIBackgroundGrid';

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

let globalMsgCounter = 0;
function createMsgId(prefix: string) {
  globalMsgCounter += 1;
  return `${prefix}-${globalMsgCounter}`;
}

export default function Assistant() {
  const navigate = useNavigate();
  const defaultSample = PRESET_CROP_SAMPLES[0];

  // Initial State for Undo/Redo
  const initialAssistantState: AssistantState = {
    messages: [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: 'Just now',
        text:
          'Welcome to AgriFusion AI — Autonomous Multimodal Agricultural Command Center.\n\nUpload a leaf image, scan with your device camera, or ask any agronomic question. The system will deploy computer vision, pathology classification, and ICAR knowledge synthesis to deliver immediate, verified treatment protocols.',
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

  // Input & Workspace state
  const [inputText, setInputText] = useState('');
  const [stagedImage, setStagedImage] = useState<{ src: string; file: File } | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Responsive Mobile View Switcher: 'command' (Chat & 3D Core) | 'dossier' (Intelligence Panel) | 'actions' (Quick Actions)
  const [mobileView, setMobileView] = useState<'command' | 'dossier' | 'actions'>('command');

  // Language & Audio
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => localStorage.getItem('farmer_lang_chosen') || 'en'
  );
  const isHi = selectedLanguage === 'hi';

  // Active Gemini Vision API Key & Settings Modal
  const [apiKey, setApiKey] = useState<string>(() => getActiveGeminiApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState<string>(() => getActiveGeminiApiKey());

  // Camera Scanner Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Center Column Chat Plus Menu
  const [centerPlusMenuOpen, setCenterPlusMenuOpen] = useState(false);
  const centerPlusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (centerPlusMenuRef.current && !centerPlusMenuRef.current.contains(e.target as Node)) {
        setCenterPlusMenuOpen(false);
      }
    };
    if (centerPlusMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [centerPlusMenuOpen]);

  // Reactive inference state
  const isCurrentlyAnalyzing = assistantState.messages.some((m) => m.isAnalyzing);

  const ai3DState: AI3DState = isCurrentlyAnalyzing
    ? 'analyzing'
    : assistantState.currentAnalysis
    ? 'success'
    : 'idle';

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantState.messages]);

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
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Camera Scanner Handlers ──
  const startCamera = async () => {
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
        ? '🔍 फसल की छवि का विश्लेषण और पैथोलॉजी परीक्षण जारी है...'
        : '🔍 Autonomous leaf analysis and pathology scanning active...',
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
        ? `🌱 **कृषि मित्र सलाह:**\n\nआपके प्रश्न: "${textToSend}" के संबंध में:\n\n1. **पत्ती परीक्षण:** सटीक रोग व कीट पहचान के लिए बाईं तरफ **मल्टीमोडल इनपुट** में पत्ती की फोटो अपलोड या स्कैन करें।\n2. **तुरंत उपाय:** फसल में वायु संचार बनाए रखें और अत्यधिक नाइट्रोजन खाद से बचें।\n3. **सटीक मात्रा:** किसी भी कीट या फंगल लक्षण के लिए तुरंत दवा का अनुशंसित अनुपात ही उपयोग करें।`
        : `🌱 **Agri Advisor Response:**\n\nRegarding: "${textToSend}":\n\n1. **Visual Crop Check:** For 96%+ accurate disease & pest diagnosis, drag or upload a crop leaf image in the Multimodal Dock on the left.\n2. **General Field Hygiene:** Maintain good spacing between rows, remove weed hosts, and monitor lower leaves for early discoloration.\n3. **Balanced Plant Health:** Ensure adequate micronutrients (Boron, Zinc) along with balanced NPK.`;
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
      text: `Analyze benchmark crop sample: ${sample.cropName} (${sample.diseaseName.split(' ')[0]})`,
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

  // ── Execute Quick Action ──
  const handleQuickAction = (act: QuickActionItem) => {
    if (act.actionType === 'navigate') {
      navigate(act.payload);
    } else if (act.actionType === 'upload') {
      fileInputRef.current?.click();
    } else if (act.actionType === 'camera') {
      startCamera();
    } else if (act.actionType === 'prompt') {
      setInputText(act.payload);
    }
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

      {/* Subtle Digital Farmland Background Grid */}
      <AIBackgroundGrid />

      {/* ── TOP AREA: AGRICULTURAL AI COMMAND HEADER ── */}
      <AICommandHeader
        isAnalyzing={isCurrentlyAnalyzing}
        onClearChat={handleClearChat}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        historyStep={currentIndex + 1}
        historyTotal={history.length}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(langCode) => {
          setSelectedLanguage(langCode);
          localStorage.setItem('farmer_lang_chosen', langCode);
        }}
        onOpenKeyModal={() => {
          setTempKey(apiKey);
          setShowKeyModal(true);
        }}
        onSelectSample={handleLoadSample}
        presetSamples={PRESET_CROP_SAMPLES}
      />

      {/* ── MOBILE VIEW SELECTOR TABS (Visible only on screens < 1024px) ── */}
      <div
        className="show-mobile-tabs"
        style={{
          display: 'none',
          padding: '8px 16px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '8px',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setMobileView('command')}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: '8px',
            border: 'none',
            background: mobileView === 'command' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            color: mobileView === 'command' ? '#34d399' : '#94a3b8',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          💬 AI Core & Chat
        </button>
        <button
          onClick={() => setMobileView('dossier')}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: '8px',
            border: 'none',
            background: mobileView === 'dossier' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
            color: mobileView === 'dossier' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          📊 Agronomic Dossier
        </button>
        <button
          onClick={() => setMobileView('actions')}
          style={{
            flex: 1,
            padding: '7px 4px',
            borderRadius: '8px',
            border: 'none',
            background: mobileView === 'actions' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
            color: mobileView === 'actions' ? '#c084fc' : '#94a3b8',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          ⚡ Quick Actions
        </button>
      </div>

      {/* ── 3-COLUMN ENTERPRISE WORKSPACE GRID ── */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '350px 1fr 380px',
          gap: '16px',
          padding: '16px 20px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
        }}
        className="command-center-grid"
      >
        {/* ── COLUMN 1: LEFT / MULTIMODAL INPUT AREA & QUICK ACTIONS ── */}
        <section
          aria-label="Input workspace and quick action panel"
          className={`command-col-left ${mobileView !== 'command' && mobileView !== 'actions' ? 'hide-mobile' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {/* Multimodal Input Dock */}
          <AIInputWorkspace
            inputText={inputText}
            setInputText={setInputText}
            stagedImage={stagedImage}
            setStagedImage={setStagedImage}
            isAnalyzing={isCurrentlyAnalyzing}
            isListening={isListening}
            toggleVoiceInput={toggleVoiceInput}
            startCamera={startCamera}
            onTriggerFileUpload={() => fileInputRef.current?.click()}
            onSubmit={handleSendMessage}
            isHi={isHi}
          />

          {/* Quick Actions Grid */}
          <QuickActionGrid
            onExecuteAction={handleQuickAction}
            isHi={isHi}
          />
        </section>

        {/* ── COLUMN 2: CENTER / 3D AI PROCESSING CORE & CONVERSATION STREAM ── */}
        <section
          aria-label="AI processing core and conversation stream"
          className={`command-col-center ${mobileView !== 'command' ? 'hide-mobile' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Top 3D AI Core (Procedural sphere with neural nodes & telemetry) */}
          <AI3DCore
            state={ai3DState}
            cropName={assistantState.currentAnalysis?.cropName}
            confidence={assistantState.currentAnalysis?.confidence}
            height={160}
          />

          {/* Real Pipeline Progression Indicator */}
          <AIProcessingPipelineBar
            isAnalyzing={isCurrentlyAnalyzing}
            cropName={assistantState.currentAnalysis?.cropName}
            diseaseName={assistantState.currentAnalysis?.diseaseName}
            modelLabel={
              assistantState.currentAnalysis?.id.includes('gemini')
                ? 'Gemini 2.5 Flash Vision API'
                : 'Dual YOLO & CNN Ensemble'
            }
          />

          {/* Conversation Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {assistantState.messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: isUser ? '85%' : '100%',
                    width: isUser ? 'auto' : '100%',
                  }}
                >
                  {/* Assistant Avatar */}
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
                        fontSize: '1.15rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      🤖
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
                          padding: '12px 16px',
                          borderRadius: '16px 16px 4px 16px',
                          color: '#f8fafc',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        }}
                      >
                        {/* Attached Image Thumbnail */}
                        {msg.imageSrc && (
                          <div style={{ marginBottom: '8px' }}>
                            <img
                              src={msg.imageSrc}
                              alt="Crop leaf attachment"
                              style={{
                                maxWidth: '200px',
                                maxHeight: '140px',
                                borderRadius: '10px',
                                objectFit: 'cover',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'block',
                              }}
                            />
                            <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: '4px', fontWeight: 600 }}>
                              📷 Foliar Leaf Scan Attached
                            </div>
                          </div>
                        )}
                        <div>{msg.text}</div>
                      </div>
                    )}

                    {/* Assistant Text Response (Welcome or General Agronomic Advice) */}
                    {!isUser && msg.text && !msg.analysis && !msg.isAnalyzing && (
                      <div
                        style={{
                          background: 'rgba(15, 23, 42, 0.75)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '16px 20px',
                          borderRadius: '18px',
                          color: '#e2e8f0',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
                        }}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Assistant Analyzing Spinner State */}
                    {!isUser && msg.isAnalyzing && (
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          padding: '14px 18px',
                          borderRadius: '16px',
                          color: '#86efac',
                          fontSize: '0.88rem',
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

                    {/* Assistant Structured Intelligence Diagnosis Report */}
                    {!isUser && msg.analysis && (
                      <AIResponseReport
                        analysis={msg.analysis}
                        imageSrc={msg.imageSrc}
                        timestamp={msg.timestamp}
                        isHi={isHi}
                        onSpeak={speakDiagnosis}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* ── CENTER CHAT INPUT DOCK: [ + ] Ask ... ── */}
          <div
            ref={centerPlusMenuRef}
            style={{
              position: 'relative',
              background: 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '8px 12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              backdropFilter: 'blur(20px)',
              flexShrink: 0,
            }}
          >
            {/* Staged Image Chip Preview if any */}
            {stagedImage && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  width: 'fit-content',
                }}
              >
                <img
                  src={stagedImage.src}
                  alt="Staged foliar leaf"
                  style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.74rem', color: '#86efac', fontWeight: 600 }}>
                  📷 {isHi ? 'पत्ते की छवि संलग्न' : 'Leaf image attached'}
                </span>
                <button
                  type="button"
                  onClick={() => setStagedImage(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    marginLeft: '4px',
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Pill Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Plus (+) Button with popover */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setCenterPlusMenuOpen(!centerPlusMenuOpen)}
                  title={isHi ? 'छवि जोड़ें या स्कैन करें' : 'Add image or scan'}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: centerPlusMenuOpen
                      ? 'rgba(16, 185, 129, 0.25)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${
                      centerPlusMenuOpen ? '#10b981' : 'rgba(255, 255, 255, 0.18)'
                    }`,
                    color: centerPlusMenuOpen ? '#86efac' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    lineHeight: 1,
                    transition: 'all 0.2s ease',
                    transform: centerPlusMenuOpen ? 'rotate(45deg)' : 'none',
                    boxShadow: centerPlusMenuOpen ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none',
                  }}
                >
                  +
                </button>

                {/* Popover Options Menu */}
                {centerPlusMenuOpen && (
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
                        setCenterPlusMenuOpen(false);
                        fileInputRef.current?.click();
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
                        setCenterPlusMenuOpen(false);
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
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && (inputText.trim().length > 0 || stagedImage !== null) && !isCurrentlyAnalyzing) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isHi
                    ? 'Ask फसल, कीट या खाद के बारे में पूछें...'
                    : stagedImage
                    ? 'Ask about this leaf (e.g. "What disease is this and how to treat?")...'
                    : 'Ask AgriFusion AI anything about crops, diseases, fertilizers...'
                }
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.9rem',
                }}
              />

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? 'Stop listening' : 'Voice input (Mic)'}
                style={{
                  background: isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                {isListening ? '🔴' : '🎙️'}
              </button>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isCurrentlyAnalyzing || (inputText.trim().length === 0 && !stagedImage)}
                title="Send message"
                style={{
                  background: (inputText.trim().length > 0 || stagedImage) && !isCurrentlyAnalyzing
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: (inputText.trim().length > 0 || stagedImage) && !isCurrentlyAnalyzing ? '#fff' : '#64748b',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (inputText.trim().length > 0 || stagedImage) && !isCurrentlyAnalyzing ? 'pointer' : 'not-allowed',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  boxShadow: (inputText.trim().length > 0 || stagedImage) && !isCurrentlyAnalyzing
                    ? '0 2px 10px rgba(16, 185, 129, 0.4)'
                    : 'none',
                  flexShrink: 0,
                }}
              >
                {isCurrentlyAnalyzing ? '⟳' : '➔'}
              </button>
            </div>
          </div>
        </section>

        {/* ── COLUMN 3: RIGHT / CONTEXTUAL INTELLIGENCE PANEL & TECHNICAL DOSSIER ── */}
        <section
          aria-label="Contextual intelligence dossier and diagnostic tools"
          className={`command-col-right ${mobileView !== 'dossier' ? 'hide-mobile' : ''}`}
          style={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <AIIntelligencePanel
            analysis={assistantState.currentAnalysis}
            activeImageSrc={assistantState.imageSrc}
            isHi={isHi}
            onSelectSample={handleLoadSample}
            onCustomImageAnalyzed={(res, src) => {
              setAssistantState(
                {
                  messages: assistantState.messages,
                  currentAnalysis: res,
                  imageSrc: src,
                },
                `Analyzed: ${res.cropName}`
              );
            }}
            onSpeak={speakDiagnosis}
          />
        </section>
      </main>

      {/* ── CAMERA SCANNER MODAL (Reticle Overlay & Capture) ── */}
      {showCameraModal && (
        <div
          role="dialog"
          aria-label="Live crop leaf scanner modal"
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
                aria-label="Close camera scanner"
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

      {/* ── GEMINI API KEY CONFIGURATION MODAL ── */}
      {showKeyModal && (
        <div
          role="dialog"
          aria-label="Google Gemini Vision API Key settings modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#141a26',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>🔑</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                  Google Gemini Vision API Key
                </span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                aria-label="Close API Key modal"
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '12px 14px',
                borderRadius: '12px',
                marginBottom: '16px',
                fontSize: '0.82rem',
                color: '#86efac',
                lineHeight: 1.5,
              }}
            >
              ✅ <strong>Active Vision AI Connected:</strong> When you upload or scan an image, AgriFusion AI directly calls Google Gemini Vision API to detect the real crop, real disease, pest status, symptoms, and exact medicine dosages.
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                Gemini API Key:
              </label>
              <input
                type="text"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Paste your Google Gemini API Key here"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#090e17',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                Stored safely in your browser session. Free Gemini keys available at aistudio.google.com.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => setTempKey(DEFAULT_GEMINI_KEY)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset to Default System Key
              </button>

              <button
                onClick={() => {
                  const keyToSave = tempKey.trim() || DEFAULT_GEMINI_KEY;
                  setApiKey(keyToSave);
                  saveGeminiApiKey(keyToSave);
                  setShowKeyModal(false);
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Save & Apply Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Responsive & Animation Rules */}
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
        @media (max-width: 1200px) {
          .command-center-grid {
            grid-template-columns: 320px 1fr 340px !important;
            padding: 12px 14px !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 1024px) {
          .show-mobile-tabs {
            display: flex !important;
          }
          .command-center-grid {
            grid-template-columns: 1fr !important;
            padding: 10px 12px !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hide-mobile-sm {
            display: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
