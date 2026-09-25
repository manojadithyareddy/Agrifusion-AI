export interface QuickActionItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  actionType: 'prompt' | 'upload' | 'camera' | 'navigate';
  payload: string;
}

interface QuickActionGridProps {
  onExecuteAction: (action: QuickActionItem) => void;
  isHi?: boolean;
  className?: string;
}

export default function QuickActionGrid({
  onExecuteAction,
  isHi = false,
  className = '',
}: QuickActionGridProps) {
  const actions: QuickActionItem[] = [
    {
      id: 'identify_crop',
      icon: '🌱',
      title: isHi ? 'फसल पहचानें' : 'Identify Crop',
      desc: isHi ? 'पत्ती से फसल का प्रकार व प्रजाति जानें' : 'Taxonomy, growth stage & botanical profile',
      actionType: 'upload',
      payload: isHi ? 'कृपया इस फसल की पत्ती की पहचान करें।' : 'Identify this crop species, variety, and growth stage.',
    },
    {
      id: 'detect_disease',
      icon: '🔬',
      title: isHi ? 'रोग व कीट जांच' : 'Detect Disease',
      desc: isHi ? 'कैमरे या फोटो से तत्काल निदान' : 'Foliar pathology, spore detection & severity',
      badge: '98% ACC',
      actionType: 'camera',
      payload: isHi ? 'फसल की पत्ती में रोग और कीट की जांच करें।' : 'Detect active foliar diseases, fungal lesions, and insect pest infestations.',
    },
    {
      id: 'irrigation_advice',
      icon: '💧',
      title: isHi ? 'सिंचाई सलाह' : 'Irrigation Advice',
      desc: isHi ? 'मिट्टी की नमी अनुसार जल प्रबंधन' : 'ETc water demand, CRI stage & schedule',
      actionType: 'prompt',
      payload: isHi ? 'मेरी फसल के लिए उचित सिंचाई चक्र और जल प्रबंधन बताएं।' : 'What is the optimal irrigation schedule and moisture requirement for my crop?',
    },
    {
      id: 'climate_risk',
      icon: '🌦',
      title: isHi ? 'मौसम व जलवायु जोखिम' : 'Climate Risk',
      desc: isHi ? 'तापमान, वर्षा व पाला से बचाव' : 'Micro-climate stress, frost & rainfall alerts',
      actionType: 'prompt',
      payload: isHi ? 'जलवायु जोखिम, बेमौसम बारिश और तापमान तनाव से बचाव के उपाय बताएं।' : 'Analyze climate risks, unseasonal rain vulnerability, and heat stress defenses.',
    },
    {
      id: 'yield_prediction',
      icon: '📈',
      title: isHi ? 'उत्पादन अनुमान' : 'Yield Prediction',
      desc: isHi ? 'प्रति एकड़ संभावित उपज का मॉडल' : 'Multi-variable tonnage forecast per hectare',
      actionType: 'navigate',
      payload: '/yield-prediction',
    },
    {
      id: 'crop_recommendation',
      icon: '🌾',
      title: isHi ? 'फसल अनुशंसा' : 'Crop Matcher',
      desc: isHi ? 'मिट्टी के NPK अनुसार सर्वोत्तम फसल' : 'Soil chemistry & agro-climatic matching',
      actionType: 'navigate',
      payload: '/crop-recommendation',
    },
    {
      id: 'market_intelligence',
      icon: '💰',
      title: isHi ? 'मंडी भाव व बाजार' : 'Market Intel',
      desc: isHi ? 'मंडी दरें, MSP और मूल्य रुझान' : 'APMC mandi arrivals, price trends & MSP',
      actionType: 'navigate',
      payload: '/market',
    },
    {
      id: 'ask_ai',
      icon: '🤖',
      title: isHi ? 'एग्रीफ्यूजन से पूछें' : 'Ask AgriFusion AI',
      desc: isHi ? 'उर्वरक, कीटनाशक व पोषण प्रश्न' : 'Open multimodal agronomic consultation',
      actionType: 'prompt',
      payload: isHi ? 'खाद की सही मात्रा और कीट नियंत्रण का सर्वोत्तम तरीका क्या है?' : 'What is the recommended fertilizer schedule and integrated pest protocol for high yields?',
    },
  ];

  return (
    <div className={className} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#94a3b8',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          ⚡ {isHi ? 'त्वरित कृषि कमांड्स' : 'Intelligent Quick Actions'}
        </span>
        <span style={{ fontSize: '0.65rem', color: '#10b981', fontFamily: 'monospace' }}>
          8 CORES CONNECTED
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '8px',
        }}
      >
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => onExecuteAction(act)}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Top row: Icon & Badge */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{act.icon}</span>
              {act.badge && (
                <span
                  style={{
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '2px 5px',
                    borderRadius: '6px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  {act.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: '2px',
                lineHeight: 1.2,
              }}
            >
              {act.title}
            </div>

            {/* Sub description */}
            <div
              style={{
                fontSize: '0.64rem',
                color: '#64748b',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {act.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
