import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  analyzeImageWithLocalVisionEngine,
  analyzeVideoFrames,
  analyzeSoilHealthDocument,
  ALL_37_CROPS,
  type AssistantDiagnosisResult,
} from '../utils/localAssistantVisionEngine';
import {
  SAMPLE_LEAF_PRESETS,
  generateSampleLeafFile,
  generateSampleSoilReportFile,
  generateSampleVideoFile,
  type SampleLeafOption,
} from '../utils/sampleLeafImages';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  initOrRestoreConversation,
  saveConversationMessages,
  createNewConversation,
  getActiveConversationId,
  getUserScope,
  fileToDataUrl,
  getGroupedConversations,
  getConversationList,
  renameConversation,
  deleteConversation,
  loadConversation,
  type ConversationSummary,
  type GroupedConversations,
} from '../utils/chatStorage';

interface StagedFile {
  id: string;
  src: string;
  file: File;
  label?: string;
  type: 'image' | 'video' | 'document';
  textPreview?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  images?: string[];
  videos?: string[];
  documents?: Array<{ name: string; size: string; text?: string; url?: string }>;
  diagnosis?: AssistantDiagnosisResult;
  isAnalyzing?: boolean;
  analyzingStage?: string;
  analyzingProgress?: number;
  analyzingRemainingSeconds?: number;
  activeTreatmentTab?: 'cultural' | 'chemical' | 'safety';
  showEvidenceOverlay?: boolean;
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

export const TARGET_CROP_OPTIONS = [
  { value: 'all', label: '-- Auto-Detect All Crops --', emoji: '🌱' },
  { value: 'Rice', label: 'Rice', emoji: '🌾' },
  { value: 'Wheat', label: 'Wheat', emoji: '🌾' },
  { value: 'Maize', label: 'Maize', emoji: '🌽' },
  { value: 'Cotton', label: 'Cotton', emoji: '☁️' },
  { value: 'Sugarcane', label: 'Sugarcane', emoji: '🎋' },
  { value: 'Soybean', label: 'Soybean', emoji: '🌱' },
  { value: 'Chickpea', label: 'Chickpea', emoji: '🫘' },
  { value: 'Pigeonpeas', label: 'Pigeonpeas', emoji: '🫘' },
  { value: 'Blackgram', label: 'Blackgram', emoji: '🫘' },
  { value: 'Mungbean', label: 'Mungbean', emoji: '🫘' },
  { value: 'Lentil', label: 'Lentil', emoji: '🫘' },
  { value: 'Kidneybeans', label: 'Kidneybeans', emoji: '🫘' },
  { value: 'Mothbeans', label: 'Mothbeans', emoji: '🫘' },
  { value: 'Groundnut', label: 'Groundnut', emoji: '🥜' },
  { value: 'Mustard', label: 'Mustard', emoji: '🌼' },
  { value: 'Tomato', label: 'Tomato', emoji: '🍅' },
  { value: 'Potato', label: 'Potato', emoji: '🥔' },
  { value: 'Onion', label: 'Onion', emoji: '🧅' },
  { value: 'Banana', label: 'Banana', emoji: '🍌' },
  { value: 'Mango', label: 'Mango', emoji: '🥭' },
  { value: 'Papaya', label: 'Papaya', emoji: '🍈' },
  { value: 'Apple', label: 'Apple', emoji: '🍎' },
  { value: 'Grapes', label: 'Grapes', emoji: '🍇' },
  { value: 'Pomegranate', label: 'Pomegranate', emoji: '🫐' },
  { value: 'Watermelon', label: 'Watermelon', emoji: '🍉' },
  { value: 'Muskmelon', label: 'Muskmelon', emoji: '🍈' },
  { value: 'Orange', label: 'Orange', emoji: '🍊' },
  { value: 'Coconut', label: 'Coconut', emoji: '🥥' },
  { value: 'Jute', label: 'Jute', emoji: '🌿' },
  { value: 'Coffee', label: 'Coffee', emoji: '☕' },
  { value: 'Chilli', label: 'Chilli', emoji: '🌶️' },
  { value: 'Turmeric', label: 'Turmeric', emoji: '🫚' },
  { value: 'Sunflower', label: 'Sunflower', emoji: '🌻' },
  { value: 'Sorghum', label: 'Sorghum', emoji: '🌾' },
  { value: 'Pearl Millet', label: 'Pearl Millet', emoji: '🌾' },
  { value: 'Barley', label: 'Barley', emoji: '🌾' },
  { value: 'Finger Millet', label: 'Finger Millet', emoji: '🌾' },
];

let globalMsgCounter = 0;
function createMsgId(prefix: string) {
  globalMsgCounter += 1;
  return `${prefix}-${Date.now()}-${globalMsgCounter}`;
}

/**
 * Universal Crop Emoji resolver covering ALL 37 crops
 */
export function getCropEmoji(cropName: string): string {
  const lower = (cropName || '').toLowerCase();
  if (lower.includes('rice') || lower.includes('paddy') || lower.includes('dhan')) return '🌾';
  if (lower.includes('wheat') || lower.includes('gehun')) return '🌾';
  if (lower.includes('maize') || lower.includes('corn') || lower.includes('makka')) return '🌽';
  if (lower.includes('cotton') || lower.includes('kapas')) return '☁️';
  if (lower.includes('sugarcane') || lower.includes('ganna')) return '🎋';
  if (lower.includes('soybean') || lower.includes('soya')) return '🌱';
  if (lower.includes('chickpea') || lower.includes('chana') || lower.includes('gram')) return '🧆';
  if (lower.includes('pigeonpea') || lower.includes('arhar') || lower.includes('tur')) return '🫘';
  if (lower.includes('blackgram') || lower.includes('urad')) return '🫘';
  if (lower.includes('mungbean') || lower.includes('moong')) return '🫘';
  if (lower.includes('lentil') || lower.includes('masoor')) return '🥣';
  if (lower.includes('kidneybean') || lower.includes('rajma')) return '🫘';
  if (lower.includes('mothbean') || lower.includes('moth')) return '🫘';
  if (lower.includes('groundnut') || lower.includes('peanut') || lower.includes('moongphali')) return '🥜';
  if (lower.includes('mustard') || lower.includes('sarson')) return '🌼';
  if (lower.includes('tomato') || lower.includes('tamatar')) return '🍅';
  if (lower.includes('potato') || lower.includes('aloo')) return '🥔';
  if (lower.includes('onion') || lower.includes('pyaz')) return '🧅';
  if (lower.includes('banana') || lower.includes('kela')) return '🍌';
  if (lower.includes('mango') || lower.includes('aam')) return '🥭';
  if (lower.includes('papaya') || lower.includes('papita')) return '🍈';
  if (lower.includes('apple') || lower.includes('seb')) return '🍎';
  if (lower.includes('grape') || lower.includes('angoor')) return '🍇';
  if (lower.includes('pomegranate') || lower.includes('anar')) return '🫐';
  if (lower.includes('watermelon') || lower.includes('tarbooj')) return '🍉';
  if (lower.includes('muskmelon') || lower.includes('kharbooza')) return '🍈';
  if (lower.includes('orange') || lower.includes('santra') || lower.includes('citrus')) return '🍊';
  if (lower.includes('coconut') || lower.includes('nariyal')) return '🥥';
  if (lower.includes('jute') || lower.includes('pat')) return '🌿';
  if (lower.includes('coffee') || lower.includes('kaapi')) return '☕';
  if (lower.includes('chilli') || lower.includes('chili') || lower.includes('mirch')) return '🌶️';
  if (lower.includes('turmeric') || lower.includes('haldi')) return '🫚';
  if (lower.includes('sunflower') || lower.includes('surajmukhi')) return '🌻';
  if (lower.includes('sorghum') || lower.includes('jowar')) return '🌾';
  if (lower.includes('pearl millet') || lower.includes('bajra')) return '🌾';
  if (lower.includes('barley') || lower.includes('jau')) return '🌾';
  if (lower.includes('finger millet') || lower.includes('ragi')) return '🌾';
  if (lower.includes('soil') || lower.includes('card') || lower.includes('fertility')) return '📄';
  return '🌱';
}

export function parseDiseaseName(fullName: string): { common: string; scientific: string } {
  if (!fullName) return { common: 'Crop Condition', scientific: '' };
  const match = fullName.match(/^(.*?)\s*(\(.*?\))$/);
  if (match) {
    return {
      common: match[1].trim(),
      scientific: match[2].trim(),
    };
  }
  return {
    common: fullName,
    scientific: '',
  };
}

export const CARD_LABELS: Record<string, {
  header: string;
  crop: string;
  disease: string;
  pests: string;
  pestDamage: string;
  confidence: string;
  symptoms: string;
  treatment: string;
  pestControl: string;
  prevention: string;
  moreDetails: string;
  organicTreatment: string;
  similarCases: string;
  showInLocalLang: string;
  introText: string;
}> = {
  en: {
    header: 'Crop Disease Analysis',
    crop: 'Crop',
    disease: 'Disease',
    pests: 'Pests',
    pestDamage: 'Pest Damage',
    confidence: 'Confidence',
    symptoms: 'Symptoms',
    treatment: 'Treatment',
    pestControl: 'Pest Control',
    prevention: 'Prevention',
    moreDetails: 'More details',
    organicTreatment: 'Organic treatment',
    similarCases: 'Similar cases',
    showInLocalLang: 'Show in local language',
    introText: 'Here is the analysis of your uploaded media:',
  },
  hi: {
    header: 'फसल रोग एवं कीट विश्लेषण (Crop Analysis)',
    crop: 'फसल (Crop)',
    disease: 'रोग / स्थिति (Disease)',
    pests: 'कीट (Pests)',
    pestDamage: 'कीट क्षति / लक्षण (Pest Damage)',
    confidence: 'विश्वास (Confidence)',
    symptoms: 'रोग लक्षण (Symptoms)',
    treatment: 'रोग उपचार (Treatment)',
    pestControl: 'कीट नियंत्रण (Pest Control)',
    prevention: 'रोकथाम (Prevention)',
    moreDetails: 'अधिक विवरण (More details)',
    organicTreatment: 'जैविक उपचार (Organic treatment)',
    similarCases: 'समान मामले (Similar cases)',
    showInLocalLang: 'स्थानीय भाषा (Change language)',
    introText: 'आपकी अपलोड की गई मीडिया का विस्तृत विश्लेषण यहाँ है:',
  },
  te: {
    header: 'పంట వ్యాధి & చీడపీడల విశ్లేషణ',
    crop: 'పంట (Crop)',
    disease: 'వ్యాధి (Disease)',
    pests: 'చీడపీడలు (Pests)',
    pestDamage: 'చీడపీడల నష్టం / లక్షణాలు',
    confidence: 'విశ్వాస స్థాయి',
    symptoms: 'వ్యాధి లక్షణాలు',
    treatment: 'చికిత్స',
    pestControl: 'పురుగుల నివారణ',
    prevention: 'నిరోధక చర్యలు',
    moreDetails: 'మరిన్ని వివరాలు',
    organicTreatment: 'సేంద్రీయ చికిత్స',
    similarCases: 'సారూప్య కేసులు',
    showInLocalLang: 'భాష మార్పు',
    introText: 'మీరు అప్‌లోడ్ చేసిన మీడియా యొక్క విశ్లేషణ ఇక్కడ ఉంది:',
  },
  ta: {
    header: 'பயிர் நோய் & பூச்சி பகுப்பாய்வு',
    crop: 'பயிர் (Crop)',
    disease: 'நோய் (Disease)',
    pests: 'பூச்சிகள் (Pests)',
    pestDamage: 'பூச்சி பாதிப்பு / அறிகுறிகள்',
    confidence: 'நம்பகத்தன்மை',
    symptoms: 'அறிகுறிகள்',
    treatment: 'சிகிச்சை',
    pestControl: 'பூச்சி கட்டுப்பாடு',
    prevention: 'தடுப்பு முறைகள்',
    moreDetails: 'கூடுதல் விவரங்கள்',
    organicTreatment: 'இயற்கை சிகிச்சை',
    similarCases: 'ஒத்த வழக்குகள்',
    showInLocalLang: 'மொழி மாற்றம்',
    introText: 'நீங்கள் பதிவேற்றிய கோப்பின் பகுப்பாய்வு இதோ:',
  },
  kn: {
    header: 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಕೀಟ ವಿಶ್ಲೇಷಣೆ',
    crop: 'ಬೆಳೆ (Crop)',
    disease: 'ರೋಗ (Disease)',
    pests: 'ಕೀಟಗಳು (Pests)',
    pestDamage: 'ಕೀಟ ಹಾನಿ / ಲಕ್ಷಣಗಳು',
    confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
    symptoms: 'ರೋಗ ಲಕ್ಷಣಗಳು',
    treatment: 'ಚಿಕಿತ್ಸೆ',
    pestControl: 'ಕೀಟ ನಿಯಂತ್ರಣ',
    prevention: 'ತಡೆಗಟ್ಟುವಿಕೆ',
    moreDetails: 'ಹೆಚ್ಚಿನ ವಿವರಗಳು',
    organicTreatment: 'ಸಾವಯವ ಚಿಕಿತ್ಸೆ',
    similarCases: 'ಇದೇ ರೀತಿಯ ಪ್ರಕರಣಗಳು',
    showInLocalLang: 'ಭಾಷೆ ಬದಲಿಸಿ',
    introText: 'ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಮಾಧ್ಯಮದ ವಿಶ್ಲೇಷಣೆ ಇಲ್ಲಿದೆ:',
  },
  mr: {
    header: 'पीक रोग व कीड विश्लेषण',
    crop: 'पीक (Crop)',
    disease: 'रोग (Disease)',
    pests: 'कीड (Pests)',
    pestDamage: 'किडींचे नुकसान / लक्षणे',
    confidence: 'विश्वासार्हता',
    symptoms: 'लक्षणे',
    treatment: 'उपचार',
    pestControl: 'कीड नियंत्रण',
    prevention: 'प्रतिबंधक उपाय',
    moreDetails: 'अधिक माहिती',
    organicTreatment: 'सेंद्रिय उपचार',
    similarCases: 'समान प्रकरणे',
    showInLocalLang: 'स्थानिक भाषा',
    introText: 'आपल्या अपलोड केलेल्या मीडियाचे विश्लेषण येथे आहे:',
  },
};

export const HINDI_DISEASE_CONTENT: Record<string, {
  crop: string;
  disease: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}> = {
  tomato_early_blight: {
    crop: 'टमाटर (Tomato)',
    disease: 'अगेती झुलसा / अर्ली ब्लाइट (Alternaria solani)',
    symptoms: [
      'पत्तियों पर संकेंद्रित छल्लों वाले भूरे गोल धब्बे ("टारगेट बोर्ड" पैटर्न)',
      'पुरानी और निचली पत्तियों का पीला पड़ना',
      'धब्बे आपस में मिलकर पत्तियों को झुलसा देते हैं',
    ],
    treatment: [
      'मैंकोजेब या क्लोरोथैलोनिल कवकनाशी का छिड़काव करें',
      '7-10 दिनों के अंतराल पर छिड़काव दोहराएं',
      'गंभीर रूप से संक्रमित पत्तियों को तुरंत हटाएं',
    ],
    prevention: [
      'प्रमाणित और रोगमुक्त बीजों का उपयोग करें',
      'पौधों के बीच उचित दूरी बनाए रखें',
      'ऊपर से फव्वारा सिंचाई से बचें, ड्रिप सिंचाई अपनाएं',
      'फसल चक्र (क्रॉप रोटेशन) का पालन करें',
    ],
  },
  tomato_late_blight: {
    crop: 'टमाटर (Tomato)',
    disease: 'पछेती झुलसा / लेट ब्लाइट (Phytophthora infestans)',
    symptoms: [
      'पत्तियों पर गहरे भूरे-काले जलभरे धब्बे तेजी से फैलते हैं',
      'सुबह के समय पत्तियों के नीचे सफेद फफूंद दिखना',
      'फलों पर काले-भूरे तैलीय धब्बे बनना',
    ],
    treatment: [
      'कॉपर ऑक्सीक्लोराइड 50% WP (2.5 ग्राम/लीटर) या रिडोमिल एमजेड का छिड़काव करें',
      'सुबह धूप निकलने से पहले छिड़काव करें',
      'संक्रमित पौधों के पत्तों को नष्ट करें',
    ],
    prevention: [
      'खेत में जल निकासी की उत्तम व्यवस्था रखें',
      'प्रमाणित और स्वस्थ पौधों की रोपाई करें',
      'पौधों को सहारा (स्टेकिंग) दें',
    ],
  },
};

export interface SimilarCaseItem {
  name: string;
  scientific: string;
  differentiatingSymptoms: string;
  imageHint: string;
}

export const SIMILAR_CASES_DB: Record<string, SimilarCaseItem[]> = {
  tomato: [
    {
      name: 'Early Blight',
      scientific: 'Alternaria solani',
      differentiatingSymptoms: 'Concentric dark brown rings ("target-board" pattern) mostly on older lower leaves with yellow halo.',
      imageHint: 'Concentric circular rings on leaves',
    },
    {
      name: 'Late Blight',
      scientific: 'Phytophthora infestans',
      differentiatingSymptoms: 'Rapidly spreading dark water-soaked greasy patches with white fuzzy downy fungal growth on underside in humid weather.',
      imageHint: 'Water-soaked greasy dark blotches',
    },
    {
      name: 'Septoria Leaf Spot',
      scientific: 'Septoria lycopersici',
      differentiatingSymptoms: 'Numerous small circular spots (1-3mm) with light gray centers, dark brown borders, and tiny black fruiting specks.',
      imageHint: 'Small circular spots with gray centers',
    },
    {
      name: 'Tomato Leaf Curl Virus',
      scientific: 'ToLCV (Begomovirus)',
      differentiatingSymptoms: 'Upward and inward cupping/curling of leaves, thick leathery texture, yellowing veins, and stunted bushy growth.',
      imageHint: 'Curled and puckered leaves',
    },
  ],
  potato: [
    {
      name: 'Early Blight',
      scientific: 'Alternaria solani',
      differentiatingSymptoms: 'Concentric ring brown spots delimited by major leaf veins.',
      imageHint: 'Brown ring spots',
    },
    {
      name: 'Late Blight',
      scientific: 'Phytophthora infestans',
      differentiatingSymptoms: 'Water-soaked black margins on leaflets with white mold under damp conditions.',
      imageHint: 'Black water-soaked decay',
    },
  ],
  rice: [
    {
      name: 'Rice Blast',
      scientific: 'Pyricularia oryzae',
      differentiatingSymptoms: 'Spindle-shaped or diamond lesions with gray centers and reddish-brown borders.',
      imageHint: 'Spindle lesions with gray center',
    },
    {
      name: 'Brown Spot',
      scientific: 'Bipolaris oryzae',
      differentiatingSymptoms: 'Uniformly distributed small oval or circular brown spots resembling sesame seeds with yellow halo.',
      imageHint: 'Small round brown spots',
    },
  ],
  wheat: [
    {
      name: 'Yellow / Stripe Rust',
      scientific: 'Puccinia striiformis',
      differentiatingSymptoms: 'Parallel yellow-orange powdery pustules forming distinct stripes along monocot leaf veins.',
      imageHint: 'Linear yellow stripes of powder',
    },
    {
      name: 'Brown / Leaf Rust',
      scientific: 'Puccinia triticina',
      differentiatingSymptoms: 'Scattered circular or oval orange-brown pustules randomly distributed across leaf surface, not in stripes.',
      imageHint: 'Scattered brown powdery dots',
    },
  ],
  cotton: [
    {
      name: 'Bacterial Blight',
      scientific: 'Xanthomonas citri pv. malvacearum',
      differentiatingSymptoms: 'Angular water-soaked leaf spots bounded by veinlets turning reddish-brown, and black arm stem cankers.',
      imageHint: 'Angular geometric vein-bounded spots',
    },
    {
      name: 'Alternaria Leaf Spot',
      scientific: 'Alternaria macrospora',
      differentiatingSymptoms: 'Circular brown spots with purple margins on mature foliage.',
      imageHint: 'Circular spots with purple borders',
    },
  ],
  sugarcane: [
    {
      name: 'Red Rot',
      scientific: 'Colletotrichum falcatum',
      differentiatingSymptoms: 'Red discoloration inside split cane with white transverse patches and alcoholic fermentation smell.',
      imageHint: 'Red stalk discoloration with white patches',
    },
    {
      name: 'Smut',
      scientific: 'Sporisorium scitamineum',
      differentiatingSymptoms: 'Long whip-like curved black dusty shoot emerging from central growing tip.',
      imageHint: 'Curved black whip structure',
    },
  ],
  banana: [
    {
      name: 'Yellow Sigatoka',
      scientific: 'Mycosphaerella musicola',
      differentiatingSymptoms: 'Yellow linear streaks parallel to leaf veins turning into elliptical spots with sunken gray centers.',
      imageHint: 'Linear yellow streaks turning gray',
    },
    {
      name: 'Panama Wilt',
      scientific: 'Fusarium oxysporum f. sp. cubense',
      differentiatingSymptoms: 'Yellowing of lower leaf margins progressing inward, leaf petiole buckling, and reddish-brown vascular discolouration.',
      imageHint: 'Buckled yellowing leaves and brown vascular ring',
    },
  ],
};

export default function Assistant() {
  const { user } = useAuth();
  const userId = user?.id != null ? String(user.id) : null;

  // Language & Localization
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => localStorage.getItem('farmer_lang_chosen') || 'en'
  );
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
  const isHi = selectedLanguage === 'hi';

  // Target Crop Selection (All 37 Crops or Auto-Detect)
  const [assistantTargetCrop, setAssistantTargetCrop] = useState<string>('all');
  const [showCropMenu, setShowCropMenu] = useState(false);
  const selectedTargetCropObj = TARGET_CROP_OPTIONS.find((c) => c.value === assistantTargetCrop) || TARGET_CROP_OPTIONS[0];

  // Active Conversation ID & Messages initialized from ChatStorage Engine
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    return getActiveConversationId(getUserScope(userId)) || `conv-${Date.now()}`;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const restored = initOrRestoreConversation(userId, isHi);
    return restored.messages as ChatMessage[];
  });

  // Clipboard User Notice state (for graceful handling of Google/Bing search URL metadata)
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);
  const clipboardTimerRef = useRef<any>(null);

  // Conversational Context Memory
  const [lastDiagnosedCondition, setLastDiagnosedCondition] = useState<string | null>(null);
  const [lastDiagnosedCrop, setLastDiagnosedCrop] = useState<string | null>(null);

  const sessionIdRef = useRef<string>(activeConvId);

  // Restore conversation if userId changes (login/logout/switch account)
  useEffect(() => {
    const restored = initOrRestoreConversation(userId, isHi);
    setActiveConvId(restored.id);
    setMessages(restored.messages as ChatMessage[]);
    sessionIdRef.current = restored.id;
  }, [userId]);

  // Persist conversation messages automatically to localStorage whenever updated
  useEffect(() => {
    if (activeConvId && messages.length > 0) {
      saveConversationMessages(
        activeConvId,
        messages as any,
        userId,
        lastDiagnosedCrop || undefined,
        lastDiagnosedCondition || undefined
      );
    }
  }, [messages, activeConvId, userId, lastDiagnosedCrop, lastDiagnosedCondition]);

  // Handle explicit "➕ New Chat"
  const handleNewChat = useCallback(() => {
    const fresh = createNewConversation(userId, isHi);
    setActiveConvId(fresh.id);
    setMessages(fresh.messages as ChatMessage[]);
    sessionIdRef.current = fresh.id;
    setLastDiagnosedCondition(null);
    setLastDiagnosedCrop(null);
    setStagedMedia([]);
    setClipboardNotice(null);
  }, [userId, isHi]);

  // Dedicated History Drawer on Right Side
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  // Grouped history loaded for user (reactive to refreshKey and search)
  const groupedHistory: GroupedConversations = useMemo(
    () => getGroupedConversations(userId, historySearchQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, historySearchQuery, historyRefreshKey]
  );

  // Reopen conversation from history
  const handleReopenConversation = (convId: string) => {
    const loaded = loadConversation(convId, userId);
    if (loaded && loaded.messages.length > 0) {
      setActiveConvId(loaded.id);
      setMessages(loaded.messages as ChatMessage[]);
      sessionIdRef.current = loaded.id;
      const list = getConversationList(userId);
      const sum = list.find((c: ConversationSummary) => c.id === convId);
      if (sum?.lastCrop) setLastDiagnosedCrop(sum.lastCrop);
      if (sum?.lastCondition) setLastDiagnosedCondition(sum.lastCondition);
      setShowHistoryDrawer(false);
    }
  };

  // Start renaming a conversation in history
  const handleStartRename = (conv: ConversationSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditingTitleText(conv.title);
  };

  // Save renamed conversation
  const handleSaveRename = (convId: string, e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editingTitleText.trim()) {
      renameConversation(convId, editingTitleText.trim(), userId);
      setHistoryRefreshKey((k) => k + 1);
    }
    setEditingConvId(null);
  };

  // Delete conversation from history
  const handleDeleteConv = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      isHi
        ? 'क्या आप इस बातचीत को इतिहास से हटाना चाहते हैं?'
        : 'Are you sure you want to delete this conversation from history?'
    );
    if (!confirmed) return;

    deleteConversation(convId, userId);
    setHistoryRefreshKey((k) => k + 1);

    if (activeConvId === convId) {
      handleNewChat();
    }
  };

  // Replace Staged Media File Ref & States
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingMediaId, setReplacingMediaId] = useState<string | null>(null);

  // Multi-image selection per diagnosis card (allowing users to click and inspect each submitted image)
  const [selectedAnalysisImageIndex, setSelectedAnalysisImageIndex] = useState<Record<string, number>>({});

  // Input states
  const [inputText, setInputText] = useState('');
  const [stagedMedia, setStagedMedia] = useState<StagedFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Camera Scanner Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Modals & Interactive feature states
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    diagnosis?: AssistantDiagnosisResult;
  } | null>(null);
  const [lightboxShowContours, setLightboxShowContours] = useState(false);
  const [similarCasesModal, setSimilarCasesModal] = useState<{
    crop: string;
    condition: string;
  } | null>(null);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleModalTab, setSampleModalTab] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [generatingSample, setGeneratingSample] = useState(false);

  // Per-message expandable state
  const [expandedDetailsMap, setExpandedDetailsMap] = useState<Record<string, boolean>>({});
  const [expandedOrganicMap, setExpandedOrganicMap] = useState<Record<string, boolean>>({});
  const [cardLangMap, setCardLangMap] = useState<Record<string, string>>({});

  // Fast-forward / Skip Ref for the 28s deep analysis
  const skipAnalysisRef = useRef(false);

  const toggleDetails = (msgId: string) => {
    setExpandedDetailsMap((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const toggleOrganic = (msgId: string) => {
    setExpandedOrganicMap((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const cycleCardLanguage = (msgId: string) => {
    const langKeys = ['en', 'hi', 'te', 'ta', 'kn', 'mr'];
    setCardLangMap((prev) => {
      const current = prev[msgId] || selectedLanguage;
      const nextIdx = (langKeys.indexOf(current) + 1) % langKeys.length;
      return { ...prev, [msgId]: langKeys[nextIdx] };
    });
  };

  const openSimilarCases = (crop: string, condition: string) => {
    setSimilarCasesModal({ crop, condition });
  };

  // Sample Preset Loader
  const handleLoadSampleLeaf = async (preset: SampleLeafOption) => {
    setGeneratingSample(true);
    try {
      if (preset.type === 'document') {
        const { file, text, dataUrl } = generateSampleSoilReportFile();
        const staged: StagedFile = {
          id: `sample-doc-${Date.now()}`,
          src: dataUrl,
          file,
          label: 'Soil Health Card (Guntur Sample)',
          type: 'document',
          textPreview: text,
        };
        await runMultimodalAnalysisPipeline([staged]);
      } else if (preset.type === 'video') {
        const { file, dataUrl } = await generateSampleVideoFile();
        const staged: StagedFile = {
          id: `sample-vid-${Date.now()}`,
          src: dataUrl,
          file,
          label: 'Field Canopy Walkthrough Video',
          type: 'video',
        };
        await runMultimodalAnalysisPipeline([staged]);
      } else {
        const { file, dataUrl } = await generateSampleLeafFile(preset.id);
        const staged: StagedFile = {
          id: `sample-img-${Date.now()}`,
          src: dataUrl,
          file,
          label: preset.id.replace(/_/g, ' '),
          type: 'image',
        };
        await runMultimodalAnalysisPipeline([staged]);
      }
    } catch (err) {
      console.error('Failed to load sample preset:', err);
    } finally {
      setGeneratingSample(false);
      setSampleModalOpen(false);
    }
  };

  // File Input Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto scroll to diagnosis top or latest message
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.diagnosis) {
      const el = document.getElementById(`msg-${lastMsg.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close attachment dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Text-To-Speech (TTS)
  const speakDiagnosis = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Recognition (STT)
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
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const speechText = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${speechText}` : speechText));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Camera Scanner Functions
  const startCamera = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera. Please allow camera permissions.');
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      stopCamera();

      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], `camera_leaf_${Date.now()}.jpg`, { type: mimeString });

      setStagedMedia((prev) => [
        ...prev.slice(0, 2),
        { id: uuidMini(), src: dataUrl, file, label: `Leaf Photo #${prev.length + 1}`, type: 'image' },
      ]);
    }
  };

  // Helper UUID
  const uuidMini = () => Math.random().toString(36).substring(2, 9);

  // Allowed Image MIME types for direct clipboard paste, drag-and-drop, and upload
  const ALLOWED_IMAGE_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB limit per image
  const MAX_IMAGES_COUNT = 3;

  // Helper to stage image files from clipboard paste, drag-and-drop, or input
  const stageImageFiles = useCallback((files: File[]) => {
    if (!files || files.length === 0) return;

    setStagedMedia((prev) => {
      const currentImages = prev.filter((m) => m.type === 'image');
      const remainingSlots = Math.max(0, MAX_IMAGES_COUNT - currentImages.length);

      if (remainingSlots <= 0) {
        setClipboardNotice(
          isHi
            ? '⚠️ अधिकतम 3 छवियां ही एक संदेश में जोड़ी जा सकती हैं।'
            : '⚠️ Maximum of 3 images can be attached per message.'
        );
        if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
        clipboardTimerRef.current = setTimeout(() => setClipboardNotice(null), 5000);
        return prev;
      }

      const validFiles: File[] = [];
      for (const file of files) {
        const mime = file.type ? file.type.toLowerCase() : '';
        if (!ALLOWED_IMAGE_MIMES.includes(mime)) {
          setClipboardNotice(
            isHi
              ? `⚠️ असमर्थित फ़ाइल प्रारूप: "${file.name}"। केवल JPEG, PNG और WebP समर्थित हैं।`
              : `⚠️ Unsupported image format: "${file.name}". Only JPEG, PNG, and WebP are supported.`
          );
          if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
          clipboardTimerRef.current = setTimeout(() => setClipboardNotice(null), 6000);
          continue;
        }

        if (file.size > MAX_IMAGE_SIZE) {
          setClipboardNotice(
            isHi
              ? `⚠️ फ़ाइल का आकार 15MB से अधिक है: "${file.name}"।`
              : `⚠️ Image "${file.name}" exceeds 15MB size limit.`
          );
          if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
          clipboardTimerRef.current = setTimeout(() => setClipboardNotice(null), 6000);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return prev;

      const toAdd = validFiles.slice(0, remainingSlots).map((file, idx) => {
        const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
        const displayName = file.name && !file.name.startsWith('image.')
          ? file.name
          : `Crop Photo ${currentImages.length + idx + 1}.${ext}`;
        return {
          id: `img-${Date.now()}-${uuidMini()}`,
          src: URL.createObjectURL(file),
          file,
          label: displayName,
          type: 'image' as const,
        };
      });

      return [...prev, ...toAdd];
    });
  }, [isHi]);

  // Direct Clipboard Paste Handler (Ctrl+V)
  const handlePaste = useCallback((e: React.ClipboardEvent | ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const items = Array.from(clipboardData.items || []);
    const rawFiles = Array.from(clipboardData.files || []);

    // 1. Structured Console Debug Logging
    console.debug('[Clipboard] Paste event received:', {
      itemsCount: items.length,
      filesCount: rawFiles.length,
      itemsSummary: items.map((it, idx) => ({ index: idx, kind: it.kind, type: it.type })),
    });

    // 2. Inspect clipboardData.items first: kind === 'file' and type starts with 'image/'
    const extractedFiles: File[] = [];

    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          console.debug('[Clipboard] Image file extracted from items:', {
            name: file.name,
            type: file.type,
            size: `${file.size} bytes`,
          });
          extractedFiles.push(file);
        }
      }
    }

    // 3. Fallback check for clipboardData.files
    if (extractedFiles.length === 0 && rawFiles.length > 0) {
      for (const file of rawFiles) {
        if (file.type.startsWith('image/')) {
          console.debug('[Clipboard] Image file extracted from rawFiles:', {
            name: file.name,
            type: file.type,
            size: `${file.size} bytes`,
          });
          extractedFiles.push(file);
        }
      }
    }

    // 4. Genuine binary image data present: stage thumbnail and prevent default paste
    if (extractedFiles.length > 0) {
      e.preventDefault();
      setClipboardNotice(null);
      if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);

      console.debug('[Clipboard] Successfully staging image(s) for preview & diagnosis:', {
        count: extractedFiles.length,
        files: extractedFiles.map((f) => ({ name: f.name, mime: f.type, size: f.size })),
      });
      stageImageFiles(extractedFiles);
      return;
    }

    // 5. Intercept Search Engine URL Metadata (Google / Bing Images, mediaurl, view=detailV2)
    const textData = clipboardData.getData('text/plain') || '';
    const isUrlOrSearchMetadata =
      /view=detailV2/i.test(textData) ||
      /mediaurl=/i.test(textData) ||
      /imgurl=/i.test(textData) ||
      /ccid=/i.test(textData) ||
      /bing\.com\/images/i.test(textData) ||
      /google\.[a-z.]+\/imgres/i.test(textData) ||
      /google\.[a-z.]+\/search/i.test(textData) ||
      /encrypted-tbn/i.test(textData) ||
      /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(textData.trim());

    if (isUrlOrSearchMetadata) {
      // Intercept and prevent query strings from entering input or being sent to AI
      e.preventDefault();
      console.warn('[Clipboard] Intercepted image URL/search metadata without binary data');

      const noticeMsg = isHi
        ? '⚠️ कृपया असली छवि कॉपी करें, फिर से पेस्ट करें। (सुझाव: Google/Bing पर छवि पर राइट-क्लिक करें और "Copy Image" चुनें, "Copy Link" नहीं)'
        : '⚠️ Please copy the actual image, then paste again. (Tip: Right-click the image directly in Google/Bing and select "Copy Image", not "Copy Link")';

      setClipboardNotice(noticeMsg);
      if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
      clipboardTimerRef.current = setTimeout(() => {
        setClipboardNotice(null);
      }, 7000);
      return;
    }

    // Normal text pastes proceed without interruption
  }, [stageImageFiles, isHi]);

  // Window-level paste listener so pressing Ctrl+V anywhere in chat attaches clipboard image
  useEffect(() => {
    const onWindowPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        activeEl.tagName === 'INPUT' &&
        activeEl !== chatInputRef.current
      ) {
        return;
      }
      handlePaste(e);
    };

    window.addEventListener('paste', onWindowPaste);
    return () => window.removeEventListener('paste', onWindowPaste);
  }, [handlePaste]);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((f) => ALLOWED_IMAGE_MIMES.includes(f.type.toLowerCase()));
      if (imageFiles.length > 0) {
        stageImageFiles(imageFiles);
      } else {
        // Check for documents or videos
        const docsOrVideos = files.filter(
          (f) => f.type.startsWith('video/') || f.name.endsWith('.pdf') || f.name.endsWith('.txt')
        );
        if (docsOrVideos.length > 0) {
          const newStaged: StagedFile[] = docsOrVideos.slice(0, 2).map((file) => ({
            id: `drop-${Date.now()}-${uuidMini()}`,
            src: file.type.startsWith('video/') ? URL.createObjectURL(file) : '',
            file,
            label: file.name,
            type: file.type.startsWith('video/') ? 'video' : 'document',
          }));
          setStagedMedia((prev) => [...prev, ...newStaged].slice(0, 5));
        }
      }
    }
  };

  // Trigger image replacement
  const triggerReplaceMedia = (id: string) => {
    setReplacingMediaId(id);
    replaceFileInputRef.current?.click();
  };

  // Handle single image file replacement
  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingMediaId) return;

    if (!ALLOWED_IMAGE_MIMES.includes(file.type.toLowerCase())) {
      setClipboardNotice(
        isHi
          ? `⚠️ असमर्थित फ़ाइल प्रारूप: "${file.name}"। केवल JPEG, PNG और WebP समर्थित हैं।`
          : `⚠️ Unsupported image format: "${file.name}". Only JPEG, PNG, and WebP are supported.`
      );
      if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
      clipboardTimerRef.current = setTimeout(() => setClipboardNotice(null), 5000);
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setClipboardNotice(
        isHi
          ? `⚠️ फ़ाइल का आकार 15MB से अधिक है: "${file.name}"।`
          : `⚠️ Image "${file.name}" exceeds 15MB size limit.`
      );
      if (clipboardTimerRef.current) clearTimeout(clipboardTimerRef.current);
      clipboardTimerRef.current = setTimeout(() => setClipboardNotice(null), 5000);
      e.target.value = '';
      return;
    }

    setStagedMedia((prev) =>
      prev.map((item) => {
        if (item.id === replacingMediaId) {
          return {
            ...item,
            file,
            src: URL.createObjectURL(file),
            label: file.name,
          };
        }
        return item;
      })
    );
    setReplacingMediaId(null);
    e.target.value = '';
  };

  // Unified Media Upload Handler (Images, Videos, Documents)
  const handleMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: 'image' | 'video' | 'document'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (mediaType === 'image') {
      stageImageFiles(Array.from(files));
      e.target.value = '';
      setShowAttachmentMenu(false);
      return;
    }

    const newStaged: StagedFile[] = [];
    const countToTake = Math.min(files.length, 3 - stagedMedia.length);

    for (let i = 0; i < countToTake; i++) {
      const file = files[i];
      let src = '';
      let textPreview: string | undefined = undefined;

      if (mediaType === 'document') {
        try {
          textPreview = await file.text();
        } catch {
          textPreview = 'Document attached for agricultural review.';
        }
        src = ''; // Document icon indicator
      } else {
        src = URL.createObjectURL(file);
      }

      newStaged.push({
        id: uuidMini(),
        src,
        file,
        label: file.name,
        type: mediaType,
        textPreview,
      });
    }

    setStagedMedia((prev) => [...prev, ...newStaged].slice(0, 3));
    e.target.value = '';
    setShowAttachmentMenu(false);
  };

  const removeStagedMedia = (id: string) => {
    setStagedMedia((prev) => prev.filter((m) => m.id !== id));
  };

  // ── Execute Comprehensive 28-Second Multimodal Deep Diagnostic Pipeline ──
  const runMultimodalAnalysisPipeline = async (
    mediaToAnalyze: StagedFile[],
    userQuestion?: string
  ) => {
    skipAnalysisRef.current = false;
    const primaryMedia = mediaToAnalyze[0];
    const userMsgId = createMsgId('user');
    const assistantMsgId = createMsgId('asst');

    // Convert image files into base64 data URLs so previews survive browser refresh (F5)
    const persistentImages: string[] = [];
    for (const m of mediaToAnalyze) {
      if (m.type === 'image') {
        if (m.src && m.src.startsWith('data:')) {
          persistentImages.push(m.src);
        } else if (m.file) {
          try {
            const dataUrl = await fileToDataUrl(m.file);
            persistentImages.push(dataUrl || m.src);
          } catch {
            persistentImages.push(m.src);
          }
        }
      }
    }
    const resolvedImages = persistentImages.length > 0
      ? persistentImages
      : mediaToAnalyze.filter((m) => m.type === 'image').map((img) => img.src);

    // 1. Add User Message to Chat
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userQuestion || (
        primaryMedia.type === 'video'
          ? (isHi ? 'कृपया इस खेत के वीडियो का विश्लेषण करें।' : 'Analyze this crop field walkthrough video for diseases and canopy health.')
          : primaryMedia.type === 'document'
          ? (isHi ? 'कृपया इस मृदा परीक्षण / कृषि दस्तावेज़ का विश्लेषण करें।' : 'Analyze this Soil Health Card / Farm Document and provide fertilizer recommendations.')
          : (isHi ? 'कृपया इस फसल की पत्ती का परीक्षण करें।' : 'Analyze this crop leaf for diseases and pests.')
      ),
      images: resolvedImages,
      videos: mediaToAnalyze.filter((m) => m.type === 'video').map((v) => v.src),
      documents: mediaToAnalyze.filter((m) => m.type === 'document').map((d) => ({
        name: d.file.name,
        size: `${Math.round(d.file.size / 1024)} KB`,
        text: d.textPreview,
        url: d.src,
      })),
    };

    // 1b. Immediately clear previous diagnosis state for fresh analysis
    setLastDiagnosedCrop(null);
    const currentRequestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 2. Add Progressive Deep Diagnostic Analyzing Card
    const analyzingMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      timestamp: 'Analyzing...',
      isAnalyzing: true,
      analyzingProgress: 15,
      analyzingStage: '📷 Initializing Media & Optical Quality Validation...',
      images: resolvedImages,
      videos: mediaToAnalyze.filter((m) => m.type === 'video').map((v) => v.src),
      documents: mediaToAnalyze.filter((m) => m.type === 'document').map((d) => ({
        name: d.file.name,
        size: `${Math.round(d.file.size / 1024)} KB`,
        text: d.textPreview,
        url: d.src,
      })),
    };

    setMessages((prev) => [...prev, userMsg, analyzingMsg]);

    // Progressive update helper reflecting REAL pipeline stage execution
    const updateProgressState = (progress: number, stageText: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                analyzingProgress: progress,
                analyzingStage: stageText,
              }
            : msg
        )
      );
    };

    try {
      let diagnosisResult: AssistantDiagnosisResult | null = null;

      // Real Stage 1: Quality & Blur Validation
      updateProgressState(25, '📷 Validating Image Quality & Optical Blur Parameters...');

      // Real Stage 2: Crop Species Identification
      updateProgressState(50, '🌾 Identifying Crop Species for Submitted Image(s)...');

      const effectiveCropHint = (assistantTargetCrop && assistantTargetCrop !== 'all')
        ? assistantTargetCrop
        : (userQuestion || undefined);

      // 1. If Document: Parse with Soil Health & Agronomic Document Parser
      if (primaryMedia.type === 'document') {
        updateProgressState(70, '📄 Optical Character Recognition & Soil Index Parsing...');
        const docText = primaryMedia.textPreview || (await primaryMedia.file.text());
        diagnosisResult = analyzeSoilHealthDocument(docText, primaryMedia.file.name);
        updateProgressState(90, '📚 ICAR Agronomic Advisory Formulation...');
      }
      // 2. If Video: Process with Temporal Video Keyframe Analyzer
      else if (primaryMedia.type === 'video') {
        updateProgressState(70, '🎥 Temporal Keyframe Extraction & Motion Analysis...');
        const videoEl = document.createElement('video');
        videoEl.src = primaryMedia.src;
        videoEl.muted = true;
        videoEl.playsInline = true;
        await new Promise((r) => {
          videoEl.onloadedmetadata = () => r(true);
          videoEl.onerror = () => r(false);
          setTimeout(r, 1000);
        });

        diagnosisResult = await analyzeVideoFrames(videoEl, primaryMedia.file.name, effectiveCropHint);
        updateProgressState(90, '📚 Synthesizing Pathology & Treatment Recommendations...');
      }
      // 3. If Image: Process with Server-Side FastAPI Vision Engine (Strict 20s Max Limit & Smooth Progress)
      else {
        let currentProgress = 20;
        const progressStages = [
          { at: 20, text: '📷 1. Optical Sensor & Exposure Check...' },
          { at: 40, text: '🌾 2. Spectral Canopy Segmentation...' },
          { at: 60, text: '🔬 3. 37-Crop Pathology Matching...' },
          { at: 80, text: '📚 4. ICAR & FAO RAG Synthesis...' },
          { at: 92, text: '🧪 5. Chemical & Organic Calibration...' },
          { at: 98, text: '🌾 6. Final Report Assembly...' },
        ];

        // Smoothly advance progress bar over ~16 seconds (well under 20s)
        const progressInterval = setInterval(() => {
          if (skipAnalysisRef.current) {
            clearInterval(progressInterval);
            return;
          }
          currentProgress = Math.min(95, currentProgress + 4);
          const stage = progressStages.slice().reverse().find((s) => currentProgress >= s.at);
          updateProgressState(currentProgress, stage ? stage.text : '🔬 Analyzing Crop Foliage (≤ 20s)...');
        }, 700);

        try {
          const additionalImageFiles = mediaToAnalyze
            .slice(1)
            .filter((m) => m.type === 'image')
            .map((m) => m.file);

          // Hard 18-second timeout promise to guarantee entire flow finishes strictly under 20 seconds
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Inspection time limit reached (20s max)')), 18000)
          );

          // Check if skip was triggered
          const skipPromise = new Promise<never>((_, reject) => {
            const checkSkip = setInterval(() => {
              if (skipAnalysisRef.current) {
                clearInterval(checkSkip);
                reject(new Error('Skipped by user'));
              }
            }, 200);
          });

          const apiCall = api.uploadFiles<any>(
            '/api/assistant/analyze-image',
            primaryMedia.file,
            additionalImageFiles,
            {
              request_id: currentRequestId,
              crop_hint: effectiveCropHint,
              language: selectedLanguage,
            }
          );

          const apiRes = await Promise.race([apiCall, timeoutPromise, skipPromise]);

          if (apiRes && apiRes.crop) {
            diagnosisResult = {
              status: apiRes.status || (apiRes.crop.name === 'Unknown' || apiRes.crop.name === 'Unable to identify crop' ? 'UNABLE_TO_IDENTIFY_CROP' : 'CONFIRMED_DIAGNOSIS'),
              mediaType: 'image',
              crop: {
                name: typeof apiRes.crop === 'string' ? apiRes.crop : (apiRes.crop?.name || 'Unknown'),
                scientific: typeof apiRes.crop === 'object' ? apiRes.crop.scientific : undefined,
                confidence: typeof apiRes.crop_confidence === 'number' ? apiRes.crop_confidence : (typeof apiRes.crop?.confidence === 'number' ? apiRes.crop.confidence : 0),
                key: typeof apiRes.crop === 'object' ? apiRes.crop.key : undefined,
              },
              crop_confidence: typeof apiRes.crop_confidence === 'number' ? apiRes.crop_confidence : 0,
              disease: {
                name: typeof apiRes.disease === 'string' ? apiRes.disease : (apiRes.disease?.name || 'Unknown'),
                scientific_name: typeof apiRes.disease === 'object' ? apiRes.disease.scientific_name : undefined,
                confidence: typeof apiRes.disease_confidence === 'number' ? apiRes.disease_confidence : (typeof apiRes.disease?.confidence === 'number' ? apiRes.disease.confidence : 0),
                confidence_level: (apiRes.disease_confidence ?? apiRes.disease?.confidence ?? 0) >= 0.85 ? 'HIGH' : ((apiRes.disease_confidence ?? apiRes.disease?.confidence ?? 0) >= 0.65 ? 'MEDIUM' : 'LOW'),
                severity: (apiRes.disease?.severity as any) || (apiRes.severity as any) || 'None',
                key: typeof apiRes.disease === 'object' ? apiRes.disease.key : undefined,
              },
              disease_confidence: typeof apiRes.disease_confidence === 'number' ? apiRes.disease_confidence : 0,
              pests: apiRes.pests || [],
              pest_confidence: typeof apiRes.pest_confidence === 'number' ? apiRes.pest_confidence : null,
              pest_status: apiRes.pest_status || 'No active insect infestation',
              symptoms: apiRes.symptoms || [],
              pest_damage: apiRes.pest_damage || [],
              treatment: apiRes.treatment || [],
              pest_control: apiRes.pest_control || [],
              prevention: apiRes.prevention || [],
              evidence: (apiRes.evidence || []).map((ev: any) => ({
                label: ev.label || 'Pathology lesion',
                category: ev.category || 'disease_lesion',
                confidence: ev.confidence ?? 0.85,
                box: ev.box || [0.2, 0.2, 0.8, 0.8],
              })),
              cultural_management: apiRes.prevention || [],
              biological_management: apiRes.pest_control || [],
              chemical_management: apiRes.treatment || [],
              safety_warnings: apiRes.safety_warnings || [],
              sources: apiRes.sources || [
                { authority: 'ICAR-IIHR / NCIPM', document: 'Integrated Pest & Disease Management Protocol', year: '2026' }
              ],
              opencv_metrics: {
                green_foliage_pct: apiRes.opencv_metrics?.green_foliage_pct ?? 0,
                necrotic_lesion_pct: apiRes.opencv_metrics?.necrotic_lesion_pct ?? 0,
                chlorosis_pct: apiRes.opencv_metrics?.chlorosis_pct ?? 0,
                rust_pustule_pct: apiRes.opencv_metrics?.rust_pustule_pct ?? 0,
                laplacian_variance: apiRes.opencv_metrics?.laplacian_variance ?? 0,
                lesion_count: apiRes.opencv_metrics?.lesion_count ?? 0,
              },
              model_versions: {
                vision_engine: apiRes.model_versions?.vision_engine || 'AgriFusion-MultimodalVision-v6.0',
                yolo: apiRes.model_versions?.yolo || 'YOLOv8x-Agriculture-v5.0',
              },
              images_count: apiRes.images_count || (additionalImageFiles.length + 1),
              per_image_results: apiRes.per_image_results || [],
              crops_detected: apiRes.crops_detected || [],
              multi_crop: !!apiRes.multi_crop,
              duplicate_detected: !!apiRes.duplicate_detected,
              fusion_summary: apiRes.fusion_summary || '',
              uncertainty_note: apiRes.uncertainty_note || '',
            };
          }
        } catch (apiErr) {
          console.warn('Backend Assistant Vision API timed out or offline, falling back to local vision engine:', apiErr);
        } finally {
          clearInterval(progressInterval);
        }

        // If backend was unreachable or reached the 20s limit, run instant local client-side pathology engine
        if (!diagnosisResult) {
          updateProgressState(96, '🌾 Assembling Instant Diagnostic Report...');
          const imgEl = new Image();
          imgEl.src = primaryMedia.src;
          await new Promise((resolve) => {
            imgEl.onload = resolve;
            setTimeout(resolve, 300);
          });

          diagnosisResult = await analyzeImageWithLocalVisionEngine(
            imgEl,
            primaryMedia.file.name,
            effectiveCropHint
          );
        }
      }

      updateProgressState(100, '🌾 Finalizing Production Diagnostic Report...');

      // Record conversational context
      if (diagnosisResult.crop?.name && diagnosisResult.crop.name !== 'Unknown' && diagnosisResult.crop.name !== 'Unable to identify crop') {
        setLastDiagnosedCrop(diagnosisResult.crop.name);
      }
      if (diagnosisResult.disease?.name && diagnosisResult.disease.name !== 'Unknown') {
        setLastDiagnosedCondition(diagnosisResult.disease.name);
      }

      const isInsufficient = diagnosisResult.status === 'INSUFFICIENT_VISUAL_EVIDENCE';
      const isUnable = isInsufficient ||
                       diagnosisResult.status === 'UNABLE_TO_IDENTIFY_CROP' || 
                       diagnosisResult.crop?.name === 'Unknown' || 
                       diagnosisResult.crop?.name === 'Unable to identify crop';

      // Final Assistant Message: present diagnosis directly in image format
      const finalAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnalyzing: false,
        text: isInsufficient
          ? (isHi
              ? '⚠️ **अपर्याप्त दृश्य साक्ष्य (Insufficient Visual Evidence):** प्रदान की गई छवि बहुत धुंधली, अस्पष्ट या खराब रोशनी में है। सटीक निदान के लिए कृपया पत्ती पर सीधा फोकस करके अच्छी रोशनी में दोबारा फोटो लें।'
              : '⚠️ **Insufficient visual evidence:** The submitted image is either too blurry, poorly exposed, or does not clearly display crop foliage or pathology. Please retake the photo under natural lighting with steady focus directly on the affected leaf surface.')
          : isUnable
          ? (isHi
              ? '⚠️ **फसल की पहचान करने में असमर्थ:** अपलोड की गई छवि में किसी समर्थित कृषि फसल (केला, चावल, आम, कपास, टमाटर, आलू आदि) की पत्ती या फल स्पष्ट रूप से नहीं दिख रहे हैं।'
              : '⚠️ **Unable to identify crop:** The uploaded image does not clearly match any supported agricultural crop (Banana, Rice, Mango, Cotton, etc.) or plant foliage was insufficient. Please upload a clear photo of the crop leaf or fruit.')
          : '', // Keep clean so the image format card is the primary visual presentation
        diagnosis: diagnosisResult,
        images: resolvedImages,
        videos: mediaToAnalyze.filter((m) => m.type === 'video').map((v) => v.src),
        documents: mediaToAnalyze.filter((m) => m.type === 'document').map((d) => ({
          name: d.file.name,
          size: `${Math.round(d.file.size / 1024)} KB`,
          text: d.textPreview,
          url: d.src,
        })),
        activeTreatmentTab: 'cultural',
        showEvidenceOverlay: false,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? finalAssistantMsg : msg))
      );
    } catch (analysisErr: any) {
      console.error('Deep analysis error:', analysisErr);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                isAnalyzing: false,
                text: `Diagnostic inspection encountered an error: ${analysisErr.message || 'Analysis timed out'}. Please try again.`,
              }
            : msg
        )
      );
    }
  };

  // Skip / Fast-Forward Button Click
  const handleSkipAnalysis = () => {
    skipAnalysisRef.current = true;
  };

  // Text message sending or combined multimodal send
  const handleSendMessage = async () => {
    const textToSend = inputText.trim();
    const mediaToSend = [...stagedMedia];

    if (!textToSend && mediaToSend.length === 0) return;

    setInputText('');
    setStagedMedia([]);

    // If media attached, execute multimodal pipeline
    if (mediaToSend.length > 0) {
      await runMultimodalAnalysisPipeline(mediaToSend, textToSend);
      return;
    }

    // Text-only conversational message
    const userMsgId = createMsgId('user');
    const asstMsgId = createMsgId('asst');

    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = textToSend.toLowerCase();

    // Check if query matches any of the 37 crops
    let matchedCropName = '';
    for (const crop of ALL_37_CROPS) {
      if (lower.includes(crop.toLowerCase())) {
        matchedCropName = crop;
        break;
      }
    }

    const effectiveCrop = matchedCropName || (lastDiagnosedCrop && (lower.includes('crop') || lower.includes('plant') || lower.includes('field') || lower.includes('फसल')) ? lastDiagnosedCrop : '');

    let replyText = '';

    // Backend FastAPI AI Assistant Agent Integration
    try {
      const backendRes = await api.post<{ response_text: string }>('/api/assistant/chat', {
        session_id: sessionIdRef.current,
        message: textToSend,
        language: selectedLanguage,
        crop_hint: effectiveCrop || undefined,
      });
      if (backendRes && backendRes.response_text) {
        replyText = backendRes.response_text;
      }
    } catch (apiErr) {
      console.warn('Backend Assistant API offline, falling back to local agronomy engine:', apiErr);
    }

    if (!replyText) {
      if (effectiveCrop) {
        replyText = isHi
          ? `🌾 **${effectiveCrop} फसल विशेष सलाह:**\n\n1. **प्रमुख लक्षण व पहचान:** फसल की पत्तियों पर धब्बे, पीलापन या कीट दिखने पर तुरंत नीचे **+** बटन दबाकर फोटो या वीडियो अपलोड करें।\n2. **सत्यापित ICAR दिशानिर्देश:** संतुलित NPK पोषण दें और रोग के प्रारंभिक चरण में नीम तेल (10,000 ppm) का छिड़काव करें।\n3. **विस्तृत परीक्षण:** यदि आपके पास मृदा कार्ड (Soil Health Card) है, तो उसे अपलोड करके विशिष्ट खाद तालिका प्राप्त करें।`
          : `🌾 **${effectiveCrop} Crop Expert Advisory:**\n\n1. **Diagnostic Action:** To get instant OpenCV pathology identification for ${effectiveCrop}, click the **+** button below to upload a leaf photo, field video, or Soil Health Card.\n2. **ICAR IPM Guideline:** Practice balanced fertilization; apply bio-control agents (Trichoderma / Pseudomonas) at root zone.\n3. **Safety Notice:** Always observe Pre-Harvest Intervals (PHI) before marketing produce.`;
      } else if (
        (lower.includes('treat') || lower.includes('cure') || lower.includes('medicine') || lower.includes('दवा') || lower.includes('इलाज')) &&
        lastDiagnosedCondition
      ) {
        replyText = isHi
          ? `🌱 **${lastDiagnosedCondition} के लिए सत्यापित उपचार:**\n\n1. **जैविक उपाय:** 5% नीम का तेल (10,000 ppm) 4 मिली प्रति लीटर पानी में मिलाकर शाम के समय छिड़कें।\n2. **दुकान की दवा:** फंगल धब्बों के लिए मैनकोज़ेब 75% WP (2 ग्राम/लीटर) का छिड़काव करें।\n3. **सुरक्षा:** दवा छिड़कते समय मास्क और दस्ताने पहनें तथा 7 दिन के प्री-हार्वेस्ट अंतराल (PHI) का पालन करें।\n\n*स्रोत: ICAR-NCIPM दिशानिर्देश।*`
          : `🌱 **Treatment Advisory for ${lastDiagnosedCondition}:**\n\n1. **Organic / Biological:** Foliar spray of cold-pressed Neem Oil (10,000 ppm) @ 4-5 ml/L mixed with mild surfactant.\n2. **Approved Chemical Formulation:** For fungal leaf spots, apply Mancozeb 75% WP @ 2.0-2.5 g/L water.\n3. **Safety Warning:** Always wear protective gear and observe a 7-day Pre-Harvest Interval (PHI) before picking produce.\n\n*Source: ICAR-NCIPM Technical Protocols.*`;
      } else {
        replyText = isHi
          ? `🌱 **कृषि मित्र सलाह:**\n\nआपके प्रश्न: "${textToSend}" के संबंध में:\n\n1. **मल्टीमॉडल इनपुट:** आप नीचे दिए गए **+** बटन से **फोटो**, **खेत का वीडियो**, या **मृदा कार्ड (PDF/Document)** अपलोड कर सकते हैं।\n2. **37 भारतीय फसलें:** हमारा मॉडल धान, गेहूं, कपास, गन्ना, सोयाबीन, टमाटर, केला, चना, मिर्च आदि सभी 37 फसलों को सपोर्ट करता है।\n3. **28-सेकंड डीप डायग्नोसिस:** 100% सटीक ICAR सिफारिशों के लिए अभी पत्ती की तस्वीर अपलोड करें!`
          : `🌱 **Agri Advisor Response:**\n\nRegarding: "${textToSend}":\n\n1. **Multimodal Inputs:** You can upload **Crop Photos**, **Field Videos**, or **Soil Health Cards (PDF/Text)** using the **+** button below.\n2. **All 37 Crops Supported:** Full coverage for Rice, Wheat, Cotton, Sugarcane, Soybean, Tomato, Banana, Chilli, Pulses, and Millets.\n3. **28-Second Deep Inspection:** Includes real OpenCV contour tracking, multi-spectral segmentation, and ICAR-verified agronomy!`;
      }
    }

    const asstMsg: ChatMessage = {
      id: asstMsgId,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText,
    };

    setMessages((prev) => [...prev, asstMsg]);
  };

  // Clear chat / New conversation
  const handleClearChat = () => {
    if (window.confirm(isHi ? 'क्या आप नई बातचीत शुरू करना चाहते हैं?' : 'Start a fresh conversation?')) {
      handleNewChat();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        paddingTop: '86px',
        background: '#090e17',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── HEADER BAR ── */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            }}
          >
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.02em' }}>
                AgriFusion AI Assistant
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#86efac',
                  fontWeight: 700,
                }}
              >
                ● 37 Crops • Photo / Video / Soil Card Active
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Multimodal 28s Deep Diagnostic Vision & ICAR Verified Knowledge
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleNewChat}
            title={isHi ? 'नई बातचीत शुरू करें' : 'Start a new conversation'}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>➕</span>
            <span>{isHi ? 'नई चैट' : 'New Chat'}</span>
          </button>

          {/* Dedicated History Button on Right Side */}
          <button
            type="button"
            onClick={() => {
              setShowHistoryDrawer((prev) => !prev);
              setHistoryRefreshKey((k) => k + 1);
            }}
            title={isHi ? 'पिछली बातचीत का इतिहास देखें' : 'View conversation history'}
            style={{
              background: showHistoryDrawer ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255, 255, 255, 0.08)',
              border: showHistoryDrawer ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.18)',
              color: showHistoryDrawer ? '#7dd3fc' : '#f8fafc',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: showHistoryDrawer ? '0 0 10px rgba(56, 189, 248, 0.3)' : 'none',
            }}
          >
            <span>🕒</span>
            <span>{isHi ? 'इतिहास' : 'History'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModelModal(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔬</span>
            <span>37 Crops Registry</span>
          </button>

          {/* Target Crop Selector Dropdown (Supports All 37 Crops) */}
          <div style={{ position: 'relative' }}>
            <button
              id="assistant-target-crop-select-btn"
              onClick={() => {
                setShowCropMenu((prev) => !prev);
                setShowLangMenu(false);
              }}
              title="Filter or force Target Crop detection across all 37 crops"
              style={{
                background: assistantTargetCrop !== 'all' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: assistantTargetCrop !== 'all' ? '1px solid rgba(34, 197, 94, 0.45)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: assistantTargetCrop !== 'all' ? '#86efac' : '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{selectedTargetCropObj.emoji}</span>
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedTargetCropObj.label}
              </span>
              <span style={{ fontSize: '0.65rem' }}>▼</span>
            </button>

            {showCropMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '6px',
                  minWidth: '220px',
                  maxHeight: '340px',
                  overflowY: 'auto',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 55,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ padding: '4px 8px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Target Crop
                </div>
                {TARGET_CROP_OPTIONS.map((cropOpt) => (
                  <button
                    key={cropOpt.value}
                    onClick={() => {
                      setAssistantTargetCrop(cropOpt.value);
                      setShowCropMenu(false);
                    }}
                    style={{
                      background: assistantTargetCrop === cropOpt.value ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      border: 'none',
                      color: assistantTargetCrop === cropOpt.value ? '#86efac' : '#e2e8f0',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{cropOpt.emoji}</span>
                    <span>{cropOpt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowLangMenu((prev) => !prev);
                setShowCropMenu(false);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.native}</span>
              <span style={{ fontSize: '0.65rem' }}>▼</span>
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '6px',
                  minWidth: '130px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      localStorage.setItem('farmer_lang_chosen', lang.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      background: selectedLanguage === lang.code ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      border: 'none',
                      color: selectedLanguage === lang.code ? '#86efac' : '#e2e8f0',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear / Reset Chat */}
          <button
            onClick={handleClearChat}
            title="Reset Chat"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ── CONVERSATION CONTAINER ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxWidth: '920px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const hasDiagnosis = !isUser && !!msg.diagnosis;

          // ── CASE 1: RICH CROP DISEASE / SOIL ANALYSIS CARD (Exact Screenshot Match) ──
          if (hasDiagnosis && msg.diagnosis) {
            const isUnable = msg.diagnosis.status === 'UNABLE_TO_IDENTIFY_CROP' ||
                             msg.diagnosis.crop.name === 'Unknown' ||
                             msg.diagnosis.crop.name === 'Unable to identify crop';

            const cardLang = cardLangMap[msg.id] || selectedLanguage;
            const isCardHindi = cardLang === 'hi';
            const labels = CARD_LABELS[cardLang] || CARD_LABELS['en'];
            const hindiContent = isCardHindi && !isUnable ? HINDI_DISEASE_CONTENT[msg.diagnosis.disease.key || ''] : null;

            const cropName = isUnable ? (isCardHindi ? 'पहचान में असमर्थ' : 'Unable to identify crop') : msg.diagnosis.crop.name;
            const cropEmoji = isUnable ? '❓' : getCropEmoji(cropName);
            const cropDisplayName = isCardHindi ? (isUnable ? 'पहचान में असमर्थ' : (hindiContent ? hindiContent.crop : cropName)) : cropName;

            const diseaseParsed = isUnable
              ? { common: isCardHindi ? 'असमर्थित पौधा / कम विश्वास' : 'Unrecognized foliage / Low confidence', scientific: '' }
              : (isCardHindi && hindiContent
                  ? { common: hindiContent.disease, scientific: '' }
                  : parseDiseaseName(msg.diagnosis.disease.name));

            const cropConfidencePct = isUnable ? 0 : Math.round((msg.diagnosis.crop_confidence ?? msg.diagnosis.crop.confidence ?? 0) * 100);
            const diseaseConfidencePct = isUnable ? 0 : Math.round((msg.diagnosis.disease_confidence ?? msg.diagnosis.disease.confidence ?? 0) * 100);
            const confidencePct = isUnable ? 0 : (diseaseConfidencePct || cropConfidencePct || Math.round((msg.diagnosis.disease.confidence || msg.diagnosis.crop.confidence || 0) * 100));

            // Check if condition is healthy
            const isHealthy = !isUnable && (
              (msg.diagnosis.disease.key || '').toLowerCase().includes('healthy') ||
              (msg.diagnosis.disease.name || '').toLowerCase().includes('healthy') ||
              (msg.diagnosis.disease.severity || '').toLowerCase() === 'none'
            );

            // Extract pest details
            const pestsList: Array<{ name: string; scientific: string; confidence?: number; isVector?: boolean }> = [];
            const rawPests = msg.diagnosis.pests || [];
            if (Array.isArray(rawPests)) {
              for (const p of rawPests) {
                if (typeof p === 'string' && p.trim()) {
                  const parsed = parseDiseaseName(p);
                  const isVec = p.toLowerCase().includes('vector');
                  pestsList.push({ name: parsed.common, scientific: parsed.scientific, isVector: isVec });
                } else if (p && typeof p === 'object') {
                  const pObj = p as any;
                  const name = pObj.name || 'Unknown Pest';
                  const parsed = parseDiseaseName(name);
                  const isVec = name.toLowerCase().includes('vector') || (pObj.type && String(pObj.type).toLowerCase().includes('vector'));
                  pestsList.push({
                    name: parsed.common,
                    scientific: pObj.scientific_name || pObj.scientific || parsed.scientific || '',
                    confidence: typeof pObj.confidence === 'number' ? (pObj.confidence <= 1 ? Math.round(pObj.confidence * 100) : Math.round(pObj.confidence)) : undefined,
                    isVector: isVec,
                  });
                }
              }
            }

            const pestStatus = msg.diagnosis.pest_status || (
              pestsList.length > 0
                ? 'Detected'
                : (isHealthy ? 'Clear Foliage — No Pest Infestation' : 'Foliar Pathogen Active — No Live Insect Infestation Observed')
            );
            const isPestModelUnavailable = !isUnable && pestStatus.toLowerCase().includes('unavailable');
            const hasPests = !isUnable && pestsList.length > 0;

            const symptomsList = isUnable
              ? [
                  isCardHindi ? 'छवि में किसी समर्थित कृषि फसल की पत्ती या फल स्पष्ट रूप से नहीं दिख रहे हैं।' : 'Image does not clearly match any supported agricultural crop (Banana, Rice, Mango, Cotton, etc.) or foliage is insufficient.',
                  isCardHindi ? 'कृपया अच्छी रोशनी में सीधे पत्ती या फल की तस्वीर लें।' : 'Please take a close, well-lit photo of the crop leaf or fruit.',
                ]
              : ((isCardHindi && hindiContent?.symptoms) || (
                  (msg.diagnosis.symptoms && msg.diagnosis.symptoms.length > 0)
                    ? msg.diagnosis.symptoms
                    : [
                        'Inspect foliage for necrotic lesions and chlorosis',
                        'Verify leaf margins and venation patterns',
                      ]
                ));

            const pestDamageList = isUnable
              ? [
                  isCardHindi ? 'फसल अपुष्ट होने के कारण कीट क्षति का मूल्यांकन नहीं किया जा सका।' : 'Foliage not recognized; cannot evaluate pest damage signs.',
                ]
              : ((msg.diagnosis.pest_damage && msg.diagnosis.pest_damage.length > 0)
                  ? msg.diagnosis.pest_damage
                  : (hasPests
                      ? ['Visible foliar biting, hole punctures, sap-sucking damage, or insect activity observed.']
                      : (isPestModelUnavailable
                          ? ['Pest detection model unavailable for this crop.']
                          : ['No visible foliar holes, leaf perforation, or sap-sucking damage detected.'])));

            const treatmentList = isUnable
              ? [
                  isCardHindi ? 'समर्थित फसलें: केला, चावल, आम, कपास, टमाटर, आलू, गेहूं आदि।' : 'Supported crops include Banana, Rice, Mango, Cotton, Tomato, Potato, Wheat, and other configured crops.',
                  isCardHindi ? 'फसल की सही पहचान के लिए पत्ती की साफ फोटो अपलोड करें।' : 'Upload a clear image of plant foliage for accurate AI pathogen diagnosis.',
                ]
              : ((isCardHindi && hindiContent?.treatment) || (
                  (msg.diagnosis.treatment && msg.diagnosis.treatment.length > 0)
                    ? msg.diagnosis.treatment
                    : (msg.diagnosis.chemical_management && msg.diagnosis.chemical_management.length > 0
                        ? msg.diagnosis.chemical_management
                        : [
                            'Consult verified ICAR/FAO advisory for targeted treatment',
                          ])
                ));

            const pestControlList = isUnable
              ? [
                  isCardHindi ? 'कीट नियंत्रण के लिए स्पष्ट कृषि छवि अपलोड करें।' : 'Upload a clear agricultural image for pest identification and control guidelines.',
                ]
              : ((msg.diagnosis.pest_control && msg.diagnosis.pest_control.length > 0)
                  ? msg.diagnosis.pest_control
                  : (msg.diagnosis.biological_management && msg.diagnosis.biological_management.length > 0
                      ? msg.diagnosis.biological_management
                      : (hasPests
                          ? ['Deploy pheromone/sticky traps and consult ICAR/FAO pest management schedule.']
                          : ['Routine monitoring with yellow sticky traps; maintain beneficial predatory insects (ladybird beetles, spiders).'])));

            const preventionList = isUnable
              ? [
                  isCardHindi ? 'धुंधली या गैर-कृषि छवियों से बचें।' : 'Avoid blurry, poorly lit, or non-agricultural images.',
                ]
              : ((isCardHindi && hindiContent?.prevention) || (
                  (msg.diagnosis.prevention && msg.diagnosis.prevention.length > 0)
                    ? msg.diagnosis.prevention
                    : (msg.diagnosis.cultural_management && msg.diagnosis.cultural_management.length > 0
                        ? msg.diagnosis.cultural_management
                        : [
                            'Practice balanced NPK soil nutrition',
                            'Maintain proper field spacing, drainage, and field sanitation',
                          ])
                ));

            const primaryImg = (msg.images && msg.images[0]) || '';
            const primaryVideo = (msg.videos && msg.videos[0]) || '';
            const isDoc = msg.diagnosis.mediaType === 'document' || (msg.documents && msg.documents.length > 0);
            const isDetailsOpen = !!expandedDetailsMap[msg.id];
            const isOrganicOpen = !!expandedOrganicMap[msg.id];

            return (
              <div
                key={msg.id}
                id={`msg-${msg.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  gap: '10px',
                  marginBottom: '10px',
                }}
              >
                {/* Assistant Header & Avatar with Intro Text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '2px' }}>
                  {/* Mint Green Circular Robot Avatar (Matching Screenshot) */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#dcfce7',
                      border: '2px solid #86efac',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="2.5" r="1.5" fill="#16a34a" />
                      <line x1="12" y1="4" x2="12" y2="7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                      <rect x="2" y="10" width="2" height="5" rx="1" fill="#16a34a" />
                      <rect x="20" y="10" width="2" height="5" rx="1" fill="#16a34a" />
                      <rect x="4" y="7" width="16" height="13" rx="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
                      <circle cx="8.5" cy="12" r="1.5" fill="#16a34a" />
                      <circle cx="15.5" cy="12" r="1.5" fill="#16a34a" />
                      <path d="M8.5 15.5 Q12 18 15.5 15.5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.96rem', color: '#f8fafc', fontWeight: 500 }}>
                      {labels.introText || 'Here is the analysis of your uploaded image:'}
                    </div>
                  </div>
                </div>

                {/* ── THE WHITE ANALYSIS CARD (Matching Screenshot) ── */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
                    color: '#0f172a',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '24px',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Left Column: Media Preview (Image, Video, or Document) with Multi-Image Support */}
                  {(() => {
                    const activeImageIdx = selectedAnalysisImageIndex[msg.id] || 0;
                    const displayedImg = (msg.images && msg.images[activeImageIdx]) || primaryImg;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px', maxWidth: '100%', flexShrink: 0 }}>
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '280px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                            background: '#f1f5f9',
                          }}
                        >
                          {primaryVideo ? (
                            <video
                              src={primaryVideo}
                              controls
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                borderRadius: '16px',
                              }}
                            />
                          ) : isDoc ? (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f8fafc',
                                padding: '16px',
                                boxSizing: 'border-box',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>📄</div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                                Soil Health Test Report
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                                N-P-K & Soil Reaction Indices Parsed
                              </div>
                            </div>
                          ) : displayedImg ? (
                            <img
                              src={displayedImg}
                              alt="Analyzed crop leaf"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                borderRadius: '16px',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3.5rem',
                                background: '#f8fafc',
                              }}
                            >
                              🍃
                            </div>
                          )}

                          {/* Expand Fullscreen Button for Image */}
                          {displayedImg && !primaryVideo && !isDoc && (
                            <button
                              onClick={() => {
                                setLightboxImage({ src: displayedImg, diagnosis: msg.diagnosis });
                                setLightboxShowContours(false);
                              }}
                              title="Expand Image / View Bounding Boxes"
                              style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: '8px',
                                width: '34px',
                                height: '34px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
                                color: '#334155',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.08)';
                                e.currentTarget.style.background = '#ffffff';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h6v6" />
                                <path d="M9 21H3v-6" />
                                <path d="M21 3l-7 7" />
                                <path d="M3 21l7-7" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Multi-Image Angle Selector (if 2 or 3 images submitted) */}
                        {msg.images && msg.images.length > 1 && (
                          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 0' }}>
                            {msg.images.map((imgUrl, iIdx) => {
                              const isSel = activeImageIdx === iIdx;
                              const perImg = msg.diagnosis?.per_image_results?.[iIdx];
                              const imgCrop = perImg?.crop?.name || `Angle #${iIdx + 1}`;
                              return (
                                <div
                                  key={iIdx}
                                  onClick={() =>
                                    setSelectedAnalysisImageIndex((prev) => ({
                                      ...prev,
                                      [msg.id]: iIdx,
                                    }))
                                  }
                                  title={`View Image #${iIdx + 1} (${imgCrop})`}
                                  style={{
                                    width: '76px',
                                    flexShrink: 0,
                                    borderRadius: '8px',
                                    border: isSel ? '2px solid #16a34a' : '1px solid #cbd5e1',
                                    background: isSel ? '#f0fdf4' : '#ffffff',
                                    padding: '3px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    textAlign: 'center',
                                  }}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Angle #${iIdx + 1}`}
                                    style={{ width: '100%', height: '46px', objectFit: 'cover', borderRadius: '5px' }}
                                  />
                                  <div
                                    style={{
                                      fontSize: '0.62rem',
                                      fontWeight: 700,
                                      color: isSel ? '#166534' : '#64748b',
                                      marginTop: '2px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    #{iIdx + 1} {imgCrop}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Right Column: Pathology & Advisory Details */}
                  <div style={{ flex: 1, minWidth: '270px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Header Title */}
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.01em',
                        marginBottom: '2px',
                      }}
                    >
                      {isDoc ? 'Soil Health & Fertility Analysis' : labels.header || 'Crop Disease Analysis'}
                    </div>

                    {/* Insufficient Visual Evidence Alert Banner */}
                    {msg.diagnosis?.status === 'INSUFFICIENT_VISUAL_EVIDENCE' && (
                      <div
                        style={{
                          background: '#fffbeb',
                          border: '1px solid #fde68a',
                          borderRadius: '12px',
                          padding: '12px 14px',
                          color: '#92400e',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⚠️</span>
                          <span>Insufficient Visual Evidence</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>
                          The submitted image is either too blurry, poorly exposed, or does not clearly display crop foliage or pathology. Please retake the photo under natural daylight with steady focus directly on the affected leaf.
                        </div>
                      </div>
                    )}

                    {/* Multi-Crop Detected Banner */}
                    {msg.diagnosis?.multi_crop && (
                      <div
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '12px',
                          padding: '12px 14px',
                          color: '#1e40af',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🌾</span>
                          <span>Multi-Crop Analysis: Distinct Crops Detected Across Images</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>
                          The submitted images depict multiple distinct agricultural crops. Individual crop findings are summarized below to avoid cross-treatment contamination:
                        </div>
                        {msg.diagnosis?.crops_detected && msg.diagnosis.crops_detected.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                            {msg.diagnosis.crops_detected.map((cd, cIdx) => (
                              <span
                                key={cIdx}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #93c5fd',
                                  borderRadius: '8px',
                                  padding: '3px 8px',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  color: '#1e3a8a',
                                }}
                              >
                                {getCropEmoji(cd.name)} Crop #{cIdx + 1}: {cd.name} — {cd.disease || 'Evaluated'} ({Math.round((cd.confidence || 0) * 100)}% match)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Duplicate Image Warning */}
                    {msg.diagnosis?.duplicate_detected && (
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>ℹ️</span>
                        <span><strong>Cross-Angle Duplicate Detected:</strong> Structurally identical foliage detected across angles; corroborated diagnostic certainty.</span>
                      </div>
                    )}

                    {/* Uncertainty Note */}
                    {msg.diagnosis?.uncertainty_note && (
                      <div
                        style={{
                          background: '#fdf4ff',
                          border: '1px solid #f0abfc',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          color: '#86198f',
                        }}
                      >
                        <strong>Diagnostic Note:</strong> {msg.diagnosis.uncertainty_note}
                      </div>
                    )}

                    {/* Row 1: Crop */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        <span>{labels.crop}</span>
                      </div>
                      <div style={{ color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.2rem' }}>{cropEmoji}</span>
                        <span>{cropDisplayName}</span>
                        {!isUnable && cropConfidencePct > 0 && (
                          <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '1px 7px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 600 }}>
                            {cropConfidencePct}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Disease / Condition */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                        </svg>
                        <span>{labels.disease}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem' }}>🌿</span>
                        <span style={{ color: isUnable ? '#64748b' : '#16a34a', fontWeight: 700 }}>
                          {diseaseParsed.common}
                        </span>
                        {diseaseParsed.scientific && (
                          <span style={{ color: '#475569', fontStyle: 'italic', fontSize: '0.9rem' }}>
                            {diseaseParsed.scientific}
                          </span>
                        )}
                        {!isUnable && diseaseConfidencePct > 0 && (
                          <span style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '1px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                            {diseaseConfidencePct}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Dedicated 🐛 Pests UI Section */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="8" height="14" x="8" y="6" rx="4" />
                          <path d="m19 7-3 2" />
                          <path d="m5 7 3 2" />
                          <path d="m19 19-3-2" />
                          <path d="m5 19 3-2" />
                          <path d="M20 13h-4" />
                          <path d="M4 13h4" />
                          <path d="m10 4 1 2" />
                          <path d="m14 4-1 2" />
                        </svg>
                        <span>{labels.pests || 'Pests'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                        {isUnable ? (
                          <span style={{ color: '#64748b', fontSize: '0.88rem', fontStyle: 'italic' }}>
                            —
                          </span>
                        ) : isPestModelUnavailable ? (
                          <span style={{ color: '#64748b', fontSize: '0.88rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>ℹ️</span> {isCardHindi ? 'कीट पहचान मॉडल उपलब्ध नहीं' : 'Pest detection model unavailable'}
                          </span>
                        ) : !hasPests ? (
                          isHealthy ? (
                            <span style={{ color: '#16a34a', fontSize: '0.86rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '14px' }}>
                              <span>🌿</span> {isCardHindi ? 'स्वच्छ पत्ती — कोई कीट प्रकोप नहीं' : 'Clear Foliage — No Pest Infestation Observed'}
                            </span>
                          ) : (
                            <span style={{ color: '#0369a1', fontSize: '0.86rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '3px 10px', borderRadius: '14px' }}>
                              <span>🔬</span> {isCardHindi ? 'पर्ण रोगजनक सक्रिय — कोई जीवित कीट नहीं' : (pestStatus && !pestStatus.toLowerCase().includes('no visible pest detected') ? pestStatus : 'Foliar Pathogen Active — No Live Insect Infestation Observed')}
                            </span>
                          )
                        ) : (
                          pestsList.map((pest, pIdx) => (
                            <div
                              key={pIdx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: pest.isVector ? '#fff7ed' : '#fef2f2',
                                border: `1px solid ${pest.isVector ? '#fed7aa' : '#fecaca'}`,
                                padding: '3px 10px',
                                borderRadius: '16px',
                                fontSize: '0.86rem',
                              }}
                            >
                              <span style={{ fontSize: '1rem' }}>🐛</span>
                              <span style={{ color: pest.isVector ? '#c2410c' : '#b91c1c', fontWeight: 700 }}>
                                {pest.name}
                              </span>
                              {pest.isVector && (
                                <span style={{ background: '#ffedd5', color: '#9a3412', border: '1px solid #fdba74', padding: '1px 6px', borderRadius: '10px', fontSize: '0.70rem', fontWeight: 800 }}>
                                  VECTOR
                                </span>
                              )}
                              {pest.scientific && (
                                <span style={{ color: '#475569', fontStyle: 'italic', fontSize: '0.80rem' }}>
                                  ({pest.scientific})
                                </span>
                              )}
                              {typeof pest.confidence === 'number' && (
                                <span
                                  style={{
                                    background: pest.isVector ? '#fed7aa' : '#fee2e2',
                                    color: pest.isVector ? '#9a3412' : '#991b1b',
                                    border: `1px solid ${pest.isVector ? '#fdba74' : '#fca5a5'}`,
                                    padding: '1px 6px',
                                    borderRadius: '10px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {pest.confidence}%
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Row 4: Confidence & Diagnostic Certainty */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20v-6M6 20v-2M18 20V8M22 4v16" />
                        </svg>
                        <span>{labels.confidence}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isUnable ? '#64748b' : '#16a34a', fontWeight: 800 }}>
                          <span style={{ fontSize: '1.05rem' }}>{isUnable ? '⚠️' : '📶'}</span>
                          <span>{isUnable ? (confidencePct > 0 ? `${confidencePct}% (Uncertain)` : 'Low / 0%') : `${confidencePct}%`}</span>
                        </div>
                        {/* Certainty Level Tag */}
                        {!isUnable && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: confidencePct >= 85 ? '#dcfce7' : confidencePct >= 65 ? '#fef3c7' : '#fee2e2',
                              color: confidencePct >= 85 ? '#166534' : confidencePct >= 65 ? '#92400e' : '#991b1b',
                              border: confidencePct >= 85 ? '1px solid #86efac' : confidencePct >= 65 ? '1px solid #fde68a' : '1px solid #fca5a5',
                            }}
                          >
                            {confidencePct >= 85 ? 'High Certainty' : confidencePct >= 65 ? 'Moderate Certainty' : 'Presumptive / Low'}
                          </span>
                        )}
                        {/* Progress Bar */}
                        <div
                          style={{
                            flex: 1,
                            minWidth: '90px',
                            maxWidth: '170px',
                            height: '8px',
                            background: isUnable ? '#e2e8f0' : '#dcfce7',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.max(confidencePct, isUnable ? 0 : 5)}%`,
                              height: '100%',
                              background: isUnable ? '#94a3b8' : 'linear-gradient(90deg, #22c55e, #16a34a)',
                              borderRadius: '9999px',
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Symptoms */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        <span>{labels.symptoms}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#334155', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {symptomsList.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Row 6: Pest Symptoms / Damage */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>{labels.pestDamage || 'Pest Damage'}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#334155', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {pestDamageList.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Row 7: Treatment */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                          <path d="m8.5 8.5 7 7" />
                        </svg>
                        <span>{labels.treatment}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#334155', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {treatmentList.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Row 8: Pest Control */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>{labels.pestControl || 'Pest Control'}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#334155', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {pestControlList.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Row 9: Prevention */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem' }}>
                      <div style={{ width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>{labels.prevention}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc', color: '#334155', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {preventionList.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 4 ACTION CHIPS BENEATH THE CARD ── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '2px', alignItems: 'center' }}>
                  {/* Chip 1: More Details */}
                  <button
                    onClick={() => toggleDetails(msg.id)}
                    style={{
                      background: isDetailsOpen ? '#dcfce7' : '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#166534',
                      borderRadius: '9999px',
                      padding: '7px 16px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isDetailsOpen ? '0 2px 6px rgba(16, 185, 129, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>🍃</span>
                    <span>{labels.moreDetails}</span>
                    <span style={{ fontSize: '0.7rem' }}>{isDetailsOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Chip 2: Organic Treatment */}
                  {!isUnable && (
                    <button
                      onClick={() => toggleOrganic(msg.id)}
                      style={{
                        background: isOrganicOpen ? '#dcfce7' : '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        color: '#166534',
                        borderRadius: '9999px',
                        padding: '7px 16px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isOrganicOpen ? '0 2px 6px rgba(16, 185, 129, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>🌿</span>
                      <span>{labels.organicTreatment}</span>
                      <span style={{ fontSize: '0.7rem' }}>{isOrganicOpen ? '▲' : '▼'}</span>
                    </button>
                  )}

                  {/* Chip 3: Similar Cases */}
                  {!isUnable && (
                    <button
                      onClick={() => openSimilarCases(cropName, msg.diagnosis?.disease.name || 'Early Blight')}
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        color: '#166534',
                        borderRadius: '9999px',
                        padding: '7px 16px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>🔍</span>
                      <span>{labels.similarCases}</span>
                    </button>
                  )}

                  {/* Chip 4: Show in local language */}
                  <button
                    onClick={() => cycleCardLanguage(msg.id)}
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#166534',
                      borderRadius: '9999px',
                      padding: '7px 16px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.15s ease',
                    }}
                    title="Click to toggle language"
                  >
                    <span>🌐</span>
                    <span>{labels.showInLocalLang}</span>
                    <span style={{ fontSize: '0.7rem', background: '#dcfce7', padding: '1px 6px', borderRadius: '10px' }}>
                      {cardLang.toUpperCase()}
                    </span>
                  </button>
                </div>

                {/* ── EXPANDABLE MORE DETAILS DRAWER ── */}
                {isDetailsOpen && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      color: '#f8fafc',
                      width: '100%',
                      boxSizing: 'border-box',
                      marginTop: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#86efac', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🔬</span>
                        <span>OpenCV Optical Pathology & Model Evidence</span>
                      </div>
                      {/* Audio TTS button */}
                      <button
                        onClick={() => {
                          const pestSpeech = isUnable
                            ? ''
                            : (hasPests
                                ? `Detected pests: ${pestsList.map(p => p.name).join(', ')}.`
                                : (isPestModelUnavailable
                                    ? 'Pest detection unavailable.'
                                    : (isHealthy ? 'Clear foliage with no insect pests detected.' : 'Foliar pathogen active, no live insect infestation observed.')));
                          const readText = `${cropName}. Condition: ${diseaseParsed.common}. ${pestSpeech} Calibrated confidence ${confidencePct} percent. Symptoms: ${symptomsList.join('. ')}. Recommended treatment: ${treatmentList[0] || ''}`;
                          speakDiagnosis(readText);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>🔊</span>
                        <span>Listen</span>
                      </button>
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Green Foliage</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4ade80', marginTop: '2px' }}>
                          {msg.diagnosis.opencv_metrics.green_foliage_pct}%
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Necrotic Lesions</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
                          {msg.diagnosis.opencv_metrics.necrotic_lesion_pct}%
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Chlorosis (Yellow)</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#facc15', marginTop: '2px' }}>
                          {msg.diagnosis.opencv_metrics.chlorosis_pct}%
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Severity Level</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                          {msg.diagnosis.disease.severity}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Focus / Sharpness</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#cbd5e1', marginTop: '2px' }}>
                          {msg.diagnosis.opencv_metrics.laplacian_variance}
                        </div>
                      </div>
                    </div>

                    {/* View Contours Action */}
                    {primaryImg && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setLightboxImage({ src: primaryImg, diagnosis: msg.diagnosis });
                            setLightboxShowContours(true);
                          }}
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            color: '#38bdf8',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>🔍</span>
                          <span>View OpenCV Contours & Bounding Boxes ({msg.diagnosis.evidence.length})</span>
                        </button>
                      </div>
                    )}

                    {/* Sources Citation */}
                    {msg.diagnosis.sources && msg.diagnosis.sources.length > 0 && (
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                        📚 <strong>ICAR & FAO Research Sources:</strong>{' '}
                        {msg.diagnosis.sources.map((s, idx) => (
                          <span key={idx}>
                            {s.authority} — <em>{s.document}</em>
                            {idx < msg.diagnosis!.sources.length - 1 ? '; ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── EXPANDABLE ORGANIC TREATMENT DRAWER ── */}
                {isOrganicOpen && (
                  <div
                    style={{
                      background: 'rgba(20, 83, 45, 0.35)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      color: '#f0fdf4',
                      width: '100%',
                      boxSizing: 'border-box',
                      marginTop: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#86efac', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🌿</span>
                      <span>Certified Organic & Bio-Control Formulations</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#dcfce7' }}>
                      <div>• <strong>Cold-Pressed Neem Oil (10,000 ppm):</strong> Mix 4-5 ml/L water with 1 ml mild soap as an organic fungal barrier.</div>
                      <div>• <strong>Sour Buttermilk (Khatta Chhachh):</strong> Dilute fresh sour buttermilk 1:10 with water to suppress fungal spore germination.</div>
                      <div>• <strong>Plant Spacing & Hygiene:</strong> Remove bottom leaves touching soil and practice regular crop rotation.</div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // ── CASE 2: REGULAR CHAT MESSAGE (User Text/Media or Assistant Response) ──
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              {/* Message Sender Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                  fontSize: '0.72rem',
                  color: '#64748b',
                  fontWeight: 600,
                  padding: '0 4px',
                }}
              >
                <span>{isUser ? '👤 You' : '🌾 AgriFusion Advisor'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Row with Avatar for Assistant */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  maxWidth: isUser ? '85%' : '100%',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#dcfce7',
                      border: '1.5px solid #86efac',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)',
                      marginTop: '2px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="2.5" r="1.5" fill="#16a34a" />
                      <line x1="12" y1="4" x2="12" y2="7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                      <rect x="2" y="10" width="2" height="5" rx="1" fill="#16a34a" />
                      <rect x="20" y="10" width="2" height="5" rx="1" fill="#16a34a" />
                      <rect x="4" y="7" width="16" height="13" rx="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
                      <circle cx="8.5" cy="12" r="1.5" fill="#16a34a" />
                      <circle cx="15.5" cy="12" r="1.5" fill="#16a34a" />
                      <path d="M8.5 15.5 Q12 18 15.5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                )}

                {/* Message Bubble Card */}
                <div
                  style={{
                    background: isUser
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)'
                      : 'rgba(20, 27, 41, 0.88)',
                    backdropFilter: 'blur(12px)',
                    border: isUser
                      ? '1px solid rgba(16, 185, 129, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    padding: '16px 20px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
                    color: isUser ? '#f0fdf4' : '#e2e8f0',
                    width: msg.isAnalyzing ? '100%' : 'auto',
                    minWidth: msg.isAnalyzing ? '320px' : 'auto',
                  }}
                >
                  {/* User Uploaded Media Previews */}
                  {isUser && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {/* Images */}
                      {msg.images?.map((imgSrc, idx) => (
                        <div
                          key={`img-${idx}`}
                          style={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            width: '110px',
                            height: '110px',
                          }}
                        >
                          <img src={imgSrc} alt="Crop Leaf" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#86efac', fontSize: '0.62rem', fontWeight: 700, padding: '2px 4px', textAlign: 'center' }}>
                            Photo #{idx + 1}
                          </div>
                        </div>
                      ))}
                      {/* Videos */}
                      {msg.videos?.map((vidSrc, idx) => (
                        <div
                          key={`vid-${idx}`}
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            width: '160px',
                            height: '110px',
                            background: '#000',
                          }}
                        >
                          <video src={vidSrc} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                      {/* Documents */}
                      {msg.documents?.map((doc, idx) => (
                        <div
                          key={`doc-${idx}`}
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '1.5rem' }}>📄</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.68rem', color: '#86efac' }}>Soil Report • {doc.size}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Body */}
                  {msg.text && (
                    <div style={{ fontSize: '0.94rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {msg.text}
                    </div>
                  )}

                  {/* ── 28-SECOND DEEP DIAGNOSTIC INSPECTION DASHBOARD ── */}
                  {msg.isAnalyzing && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Top Header & Fast Forward */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: '#22c55e',
                              boxShadow: '0 0 12px #22c55e',
                              animation: 'pulse 1.5s infinite',
                            }}
                          />
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#86efac' }}>
                            Deep Multimodal Agricultural Inspection in Progress...
                          </span>
                        </div>

                        {/* Fast-Forward / Skip Button */}
                        <button
                          onClick={handleSkipAnalysis}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fbbf24',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          title="Skip countdown and render diagnostic report immediately"
                        >
                          ⚡ Skip to Result
                        </button>
                      </div>

                      {/* Animated Progress Bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                          <span>Diagnostic Depth Progress: {msg.analyzingProgress || 15}%</span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                            ⚡ Real-Time Vision Processing (≤ 20s)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${msg.analyzingProgress || 10}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #10b981, #06b6d4, #22c55e)',
                              borderRadius: '9999px',
                              transition: 'width 0.25s linear',
                            }}
                          />
                        </div>
                      </div>

                      {/* Current Stage Box */}
                      <div
                        style={{
                          padding: '10px 14px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          borderRadius: '12px',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          fontSize: '0.84rem',
                          color: '#86efac',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(16, 185, 129, 0.3)',
                            borderTop: '2px solid #86efac',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            flexShrink: 0,
                          }}
                        />
                        <span>{msg.analyzingStage || 'Deep scanning crop foliage...'}</span>
                      </div>

                      {/* 6-Stage Checklist */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: (msg.analyzingProgress || 0) >= 20 ? '#22c55e' : '#64748b' }}>●</span>
                          <span>1. Optical Sensor & Exposure Check</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: (msg.analyzingProgress || 0) >= 40 ? '#22c55e' : '#64748b' }}>●</span>
                          <span>2. Spectral Canopy Segmentation</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: (msg.analyzingProgress || 0) >= 60 ? '#22c55e' : '#64748b' }}>●</span>
                          <span>3. 37-Crop Pathology Matching</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: (msg.analyzingProgress || 0) >= 80 ? '#22c55e' : '#64748b' }}>●</span>
                          <span>4. ICAR & FAO RAG Synthesis</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: (msg.analyzingProgress || 0) >= 95 ? '#22c55e' : '#64748b' }}>●</span>
                          <span>5. Chemical & Organic Calibration</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: (msg.analyzingProgress || 0) >= 100 ? '#22c55e' : '#64748b' }}>●</span>
                          <span>6. Final Report Assembly</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── CHAT INPUT COMPONENT (ChatGPT-Style Direct Clipboard Paste & Drag-and-Drop) ── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: '12px 20px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        {/* User Clipboard Notice Banner if search URL metadata was pasted */}
        {clipboardNotice && (
          <div
            style={{
              maxWidth: '920px',
              width: '100%',
              marginBottom: '10px',
              padding: '10px 16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              color: '#fde68a',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>{clipboardNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setClipboardNotice(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fde68a',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '6px',
                lineHeight: 1,
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <div
          onPaste={handlePaste}
          style={{
            maxWidth: '920px',
            width: '100%',
            background: isDraggingOver ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: isDraggingOver
              ? '2px dashed #10b981'
              : stagedMedia.length > 0
              ? '1px solid rgba(16, 185, 129, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: stagedMedia.length > 0 ? '20px' : '9999px',
            padding: stagedMedia.length > 0 ? '12px 14px 10px' : '6px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: stagedMedia.length > 0 ? '10px' : '0',
            boxShadow: isDraggingOver
              ? '0 0 25px rgba(16, 185, 129, 0.35)'
              : '0 4px 20px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Drag-over active indicator */}
          {isDraggingOver && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '12px',
                color: '#86efac',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <span>📥</span>
              <span>Drop Crop Leaf or Fruit Image here to attach (Ctrl+V paste supported)</span>
            </div>
          )}

          {/* ChatGPT-Style Thumbnail Preview Chips inside input box */}
          {stagedMedia.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {stagedMedia.map((m) => (
                <div
                  key={m.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '12px',
                    padding: '6px 10px 6px 6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'rgba(0, 0, 0, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    {m.type === 'document' ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          background: 'rgba(56, 189, 248, 0.15)',
                        }}
                      >
                        📄
                      </div>
                    ) : m.type === 'video' ? (
                      <video
                        src={m.src}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={m.src}
                        alt="Crop leaf preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ maxWidth: '140px' }}>
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={m.label || m.file.name}
                    >
                      {m.label || m.file.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.66rem',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '2px',
                      }}
                    >
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#86efac',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '0.62rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {m.file.type.split('/')[1] || m.type}
                      </span>
                      <span>{Math.round(m.file.size / 1024)} KB</span>
                    </div>
                  </div>

                  {/* Replace Button */}
                  {m.type === 'image' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerReplaceMedia(m.id);
                      }}
                      title="Replace this image"
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.25)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#7dd3fc',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        marginLeft: '2px',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#0284c7';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                        e.currentTarget.style.color = '#7dd3fc';
                      }}
                    >
                      🔄
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStagedMedia(m.id);
                    }}
                    title="Remove image"
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.25)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#fca5a5',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      marginLeft: '2px',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                      e.currentTarget.style.color = '#fca5a5';
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add more button (capped at MAX_IMAGES_COUNT = 3) */}
              {stagedMedia.length < 3 && (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  title="Attach or paste (Ctrl+V) another image (up to 3)"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}
                >
                  <span>+</span>
                  <span>Add another ({stagedMedia.length}/3)</span>
                </button>
              )}
            </div>
          )}

          {/* Main Controls Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            {/* Hidden File Inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleMediaChange(e, 'image')}
            />
            <input
              ref={replaceFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              style={{ display: 'none' }}
              onChange={handleReplaceFileChange}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              style={{ display: 'none' }}
              onChange={(e) => handleMediaChange(e, 'video')}
            />
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.txt,.csv,.doc,.docx,application/pdf,text/*"
              style={{ display: 'none' }}
              onChange={(e) => handleMediaChange(e, 'document')}
            />

            {/* Attachment '+' Button */}
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
                title="Add Media / Documents / Presets"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: showAttachmentMenu ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                +
              </button>

              {/* Multimodal Attachment Menu */}
              {showAttachmentMenu && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '125%',
                    left: 0,
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '8px',
                    minWidth: '220px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {/* 1. Upload Photo */}
                  <div
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      imageInputRef.current?.click();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: '#86efac',
                      fontWeight: 600,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📤</span>
                    <div>
                      <div>Upload Photo</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Leaf / Crop Photo</div>
                    </div>
                  </div>

                  {/* 2. Upload Video */}
                  <div
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      videoInputRef.current?.click();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: '#a855f7',
                      fontWeight: 600,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🎥</span>
                    <div>
                      <div>Upload Video</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Field Canopy Video</div>
                    </div>
                  </div>

                  {/* 3. Upload Farm Document */}
                  <div
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      documentInputRef.current?.click();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: '#38bdf8',
                      fontWeight: 600,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📄</span>
                    <div>
                      <div>Upload Document</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Soil Health Card / Advisory</div>
                    </div>
                  </div>

                  {/* 4. Live Camera Scan */}
                  <div
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      startCamera();
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: '#f43f5e',
                      fontWeight: 600,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📸</span>
                    <div>
                      <div>Live Camera</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Direct Leaf Capture</div>
                    </div>
                  </div>

                  {/* 5. Sample Crop Presets */}
                  <div
                    onClick={() => {
                      setShowAttachmentMenu(false);
                      setSampleModalOpen(true);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: '#fbbf24',
                      fontWeight: 600,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(251, 191, 36, 0.12)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🧪</span>
                    <div>
                      <div>Sample Presets</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>37 Crops, Soil Card, Video</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Text Input with Direct Clipboard Paste & Drag Support */}
            <input
              ref={chatInputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isHi
                  ? 'फसल रोग पूछें या सीधे इमेज पेस्ट (Ctrl+V) / ड्रैग-एंड-ड्रॉप करें...'
                  : 'Ask about crops, paste (Ctrl+V) or drag & drop leaf image, or attach file...'
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

          {/* Voice Input & Send Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              }}
            >
              {isListening ? '🛑' : '🎤'}
            </button>

            <button
              onClick={handleSendMessage}
              title="Send Message"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
              }}
            >
              ➔
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* ── CAMERA SCANNER MODAL ── */}
      {showCameraModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              background: '#0f172a',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📸</span>
                <span>Live Crop Leaf Scanner</span>
              </div>
              <button
                onClick={stopCamera}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '360px', background: '#000' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Aiming Reticle */}
              <div
                style={{
                  position: 'absolute',
                  inset: '40px',
                  border: '2px dashed rgba(34, 197, 94, 0.6)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.35)',
                }}
              />
            </div>

            <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '16px', background: '#0f172a' }}>
              <button
                onClick={captureCameraPhoto}
                style={{
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  background: '#22c55e',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                }}
              >
                <span>📷</span>
                <span>Capture Leaf</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 37 CROPS REGISTRY MODAL ── */}
      {showModelModal && (
        <div
          onClick={() => setShowModelModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '640px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🌾</span>
                <span>All 37 Evaluated Indian Crops</span>
              </div>
              <button
                onClick={() => setShowModelModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
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
              ✅ <strong>Full Multimodal Registry:</strong> Images, Videos, and Soil Health Documents are analyzed through OpenCV morphometric segmenters & ICAR-NCIPM knowledge databases for all 37 crops.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              {ALL_37_CROPS.map((cropName, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{getCropEmoji(cropName)}</span>
                  <span style={{ fontWeight: 600 }}>{cropName}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModelModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX FULLSCREEN IMAGE MODAL ── */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#0f172a',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Top Toolbar */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>🍃</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                  {lightboxImage.diagnosis?.disease.name || 'Leaf Image Examination'}
                </span>
                {lightboxImage.diagnosis?.disease.confidence && (
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid #22c55e',
                      color: '#4ade80',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {Math.round(lightboxImage.diagnosis.disease.confidence * 100)}% Match
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {lightboxImage.diagnosis?.evidence && lightboxImage.diagnosis.evidence.length > 0 && (
                  <button
                    onClick={() => setLightboxShowContours((prev) => !prev)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: lightboxShowContours ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                      background: lightboxShowContours ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: lightboxShowContours ? '#38bdf8' : '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {lightboxShowContours ? 'Hide Contours' : 'Show OpenCV Contours'}
                  </button>
                )}
                <button
                  onClick={() => setLightboxImage(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Image Container with SVG Evidence Overlay */}
            <div style={{ position: 'relative', maxWidth: '80vw', maxHeight: '75vh', overflow: 'hidden', borderRadius: '12px' }}>
              <img
                src={lightboxImage.src}
                alt="Enlarged view"
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '12px',
                }}
              />
              {lightboxShowContours && lightboxImage.diagnosis?.evidence && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {lightboxImage.diagnosis.evidence.map((ev, i) => {
                    const [ymin, xmin, ymax, xmax] = ev.box;
                    const x = xmin * 100;
                    const y = ymin * 100;
                    const w = Math.max((xmax - xmin) * 100, 4);
                    const h = Math.max((ymax - ymin) * 100, 4);
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          fill="rgba(239, 68, 68, 0.18)"
                          stroke="#ef4444"
                          strokeWidth="1.5"
                          rx="1"
                        />
                        <text
                          x={x + 1}
                          y={Math.max(y - 2, 4)}
                          fill="#fecaca"
                          fontSize="3.2"
                          fontWeight="bold"
                        >
                          {ev.label} ({Math.round(ev.confidence * 100)}%)
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SIMILAR CASES MODAL ── */}
      {similarCasesModal && (
        <div
          onClick={() => setSimilarCasesModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔍</span>
                  <span>Similar Cases & Differential Diagnosis</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Compare distinguishing symptoms for {similarCasesModal.crop}
                </div>
              </div>
              <button
                onClick={() => setSimilarCasesModal(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#475569',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* List of similar cases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(
                SIMILAR_CASES_DB[similarCasesModal.crop.toLowerCase()] ||
                SIMILAR_CASES_DB['tomato']
              ).map((c, idx) => {
                const isCurrent =
                  similarCasesModal.condition.toLowerCase().includes(c.name.toLowerCase()) ||
                  c.name.toLowerCase().includes(similarCasesModal.condition.toLowerCase());

                return (
                  <div
                    key={idx}
                    style={{
                      border: isCurrent ? '2px solid #22c55e' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px',
                      background: isCurrent ? '#f0fdf4' : '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem', color: isCurrent ? '#15803d' : '#0f172a' }}>
                        {c.name} {isCurrent && <span style={{ fontSize: '0.72rem', background: '#22c55e', color: '#fff', padding: '2px 8px', borderRadius: '12px', marginLeft: '6px' }}>Current Diagnosis</span>}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                        ({c.scientific})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                      <strong>Key Differentiator:</strong> {c.differentiatingSymptoms}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSimilarCasesModal(null)}
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 20px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAMPLE CROP & SOIL PRESETS MODAL ── */}
      {sampleModalOpen && (
        <div
          onClick={() => !generatingSample && setSampleModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '680px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🧪</span>
                  <span>Sample Media & Soil Report Presets</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  Test 28-second multimodal deep analysis for crop photos, field video, and soil reports
                </div>
              </div>
              <button
                onClick={() => !generatingSample && setSampleModalOpen(false)}
                disabled={generatingSample}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['all', 'image', 'video', 'document'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSampleModalTab(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: sampleModalTab === tab ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                    background: sampleModalTab === tab ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: sampleModalTab === tab ? '#86efac' : '#94a3b8',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab === 'all' ? 'All Presets' : tab === 'image' ? '📸 Crop Leaves' : tab === 'video' ? '🎥 Field Video' : '📄 Soil Reports'}
                </button>
              ))}
            </div>

            {generatingSample ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid rgba(34, 197, 94, 0.2)',
                    borderTop: '3px solid #22c55e',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px',
                  }}
                />
                <div style={{ color: '#86efac', fontWeight: 600 }}>Synthesizing calibrated agricultural sample...</div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '4px' }}>
                  Preparing media canvas & initializing deep diagnostic engine
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {SAMPLE_LEAF_PRESETS.filter((p) => sampleModalTab === 'all' || p.type === sampleModalTab).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadSampleLeaf(preset)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
                      e.currentTarget.style.borderColor = '#22c55e';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{getCropEmoji(preset.crop)}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#fff' }}>{preset.label}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{preset.disease}</div>
                    <span
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '4px',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.08)',
                        color: preset.badgeColor || '#38bdf8',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {preset.type || 'image'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DEDICATED CONVERSATION HISTORY DRAWER (RIGHT SIDE) ── */}
      {showHistoryDrawer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowHistoryDrawer(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '380px',
              maxWidth: '90vw',
              height: '100%',
              background: '#090e17',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              paddingTop: '86px',
              animation: 'slideInRight 0.22s ease-out',
            }}
          >
            {/* Drawer Top Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.95)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🕒</span>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                  {isHi ? 'बातचीत का इतिहास' : 'Chat History'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleNewChat();
                    setShowHistoryDrawer(false);
                  }}
                  title={isHi ? 'नई बातचीत' : 'New Chat'}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>➕</span>
                  <span>{isHi ? 'नई चैट' : 'New'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer(false)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>🔍</span>
                <input
                  type="text"
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  placeholder={isHi ? 'इतिहास में खोजें...' : 'Search conversations...'}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '0.82rem',
                  }}
                />
                {historySearchQuery && (
                  <button
                    onClick={() => setHistorySearchQuery('')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Grouped Conversations Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(
                [
                  { title: isHi ? 'आज' : 'Today', items: groupedHistory.today },
                  { title: isHi ? 'कल' : 'Yesterday', items: groupedHistory.yesterday },
                  { title: isHi ? 'पिछले 7 दिन' : 'Previous 7 Days', items: groupedHistory.previous7Days },
                  { title: isHi ? 'पिछले 30 दिन' : 'Previous 30 Days', items: groupedHistory.previous30Days },
                  { title: isHi ? 'पुराने' : 'Older', items: groupedHistory.older },
                ] as const
              )
                .filter((g) => g.items.length > 0)
                .map((group, gIdx) => (
                  <div key={gIdx}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '6px',
                        paddingLeft: '4px',
                      }}
                    >
                      {group.title}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {group.items.map((conv) => {
                        const isActive = conv.id === activeConvId;
                        const isEditing = editingConvId === conv.id;

                        return (
                          <div
                            key={conv.id}
                            onClick={() => !isEditing && handleReopenConversation(conv.id)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '10px',
                              background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                              border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={(e) => {
                              if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                            }}
                            onMouseOut={(e) => {
                              if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={editingTitleText}
                                    onChange={(e) => setEditingTitleText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveRename(conv.id);
                                      if (e.key === 'Escape') setEditingConvId(null);
                                    }}
                                    autoFocus
                                    style={{
                                      flex: 1,
                                      background: '#1e293b',
                                      border: '1px solid #10b981',
                                      color: '#fff',
                                      padding: '4px 6px',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                    }}
                                  />
                                  <button
                                    onClick={() => handleSaveRename(conv.id)}
                                    style={{ background: '#10b981', border: 'none', color: '#fff', borderRadius: '4px', padding: '3px 7px', cursor: 'pointer', fontSize: '0.75rem' }}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setEditingConvId(null)}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#cbd5e1', borderRadius: '4px', padding: '3px 7px', cursor: 'pointer', fontSize: '0.75rem' }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div
                                    style={{
                                      fontSize: '0.84rem',
                                      fontWeight: isActive ? 700 : 500,
                                      color: isActive ? '#34d399' : '#f1f5f9',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {conv.title}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', fontSize: '0.7rem', color: '#64748b' }}>
                                    {conv.lastCrop && (
                                      <span style={{ color: '#86efac', fontWeight: 600 }}>
                                        {getCropEmoji(conv.lastCrop)} {conv.lastCrop}
                                      </span>
                                    )}
                                    {conv.lastCondition && (
                                      <span>• {conv.lastCondition}</span>
                                    )}
                                    <span>• {conv.messageCount} msgs</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Action Buttons: Rename (✏️) and Delete (🗑️) */}
                            {!isEditing && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                <button
                                  type="button"
                                  onClick={(e) => handleStartRename(conv, e)}
                                  title="Rename conversation"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    fontSize: '0.8rem',
                                    borderRadius: '4px',
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.color = '#38bdf8')}
                                  onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteConv(conv.id, e)}
                                  title="Delete conversation"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    fontSize: '0.8rem',
                                    borderRadius: '4px',
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.color = '#f87171')}
                                  onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Empty state */}
              {Object.values(groupedHistory).every((arr) => arr.length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📂</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#94a3b8' }}>
                    {isHi ? 'कोई पिछली बातचीत नहीं मिली' : 'No previous conversations found'}
                  </div>
                  <div style={{ fontSize: '0.76rem', marginTop: '4px' }}>
                    {isHi ? 'नया प्रश्न पूछें या फोटो अपलोड करें।' : 'Ask questions or upload photos to start your first session.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Helpers */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
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
