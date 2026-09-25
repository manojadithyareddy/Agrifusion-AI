import { useEffect } from 'react';
import Cinematic3DHero from '../components/hero/Cinematic3DHero';
import HeroAIScanSimulation from '../components/hero/HeroAIScanSimulation';
import TechnologyTrustStrip from '../components/sections/TechnologyTrustStrip';
import PlatformPipelineSection from '../components/sections/PlatformPipelineSection';
import CropDiseaseFeature from '../components/features/CropDiseaseFeature';
import ClimateRiskFeature from '../components/features/ClimateRiskFeature';
import CropRecommendationFeature from '../components/features/CropRecommendationFeature';
import YieldPredictionFeature from '../components/features/YieldPredictionFeature';
import IrrigationIntelligenceFeature from '../components/features/IrrigationIntelligenceFeature';
import MarketPriceFeature from '../components/features/MarketPriceFeature';
import MultimodalAISection from '../components/sections/MultimodalAISection';
import RAGArchitectureSection from '../components/sections/RAGArchitectureSection';
import AIAgentWorkflowSection from '../components/sections/AIAgentWorkflowSection';
import AIAssistantPreviewSection from '../components/sections/AIAssistantPreviewSection';
import StorytellingSection from '../components/sections/StorytellingSection';
import SystemArchitectureSection from '../components/sections/SystemArchitectureSection';
import PerformanceEngineeringSection from '../components/sections/PerformanceEngineeringSection';
import FinalCallToAction from '../components/sections/FinalCallToAction';

interface HomeProps {
  onNavigate?: (page: string) => void;
  onBgChange?: (bgUrl: string) => void;
}

export default function Home({ onNavigate, onBgChange }: HomeProps) {
  useEffect(() => {
    let lastBg = '';

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;

      const sections = [
        { id: 'section-hero', bg: '/hero-cinematic-agri.jpg' },
        { id: 'section-scan-demo', bg: '/backgrounds/leaf_pathology.jpg' },
        { id: 'section-trust', bg: '/backgrounds/smart_agri_lab.jpg' },
        { id: 'section-pipeline', bg: '/backgrounds/precision_farming.jpg' },
        { id: 'section-feature-disease', bg: '/backgrounds/leaf_pathology.jpg' },
        { id: 'section-feature-climate', bg: '/backgrounds/satellite_earth.jpg' },
        { id: 'section-feature-crop-engine', bg: '/backgrounds/golden_harvest.jpg' },
        { id: 'section-feature-yield', bg: '/backgrounds/iot_sensor_field.jpg' },
        { id: 'section-feature-irrigation', bg: '/backgrounds/smart_irrigation.jpg' },
        { id: 'section-feature-market', bg: '/backgrounds/mandi_market.jpg' },
        { id: 'section-multimodal-ai', bg: '/backgrounds/smart_agri_lab.jpg' },
        { id: 'section-rag-engine', bg: '/backgrounds/satellite_earth.jpg' },
        { id: 'section-ai-agent', bg: '/backgrounds/farmer_advisor.jpg' },
        { id: 'section-assistant-preview', bg: '/backgrounds/farmer_advisor.jpg' },
        { id: 'section-storytelling', bg: '/backgrounds/sustainable_journey.jpg' },
        { id: 'section-architecture', bg: '/backgrounds/vertical_farming.jpg' },
        { id: 'section-performance', bg: '/backgrounds/greenhouse_tech.jpg' },
        { id: 'section-final-cta', bg: '/backgrounds/sunrise_horizon.jpg' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          if (sections[i].bg !== lastBg) {
            lastBg = sections[i].bg;
            onBgChange?.(sections[i].bg);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onBgChange]);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {/* 1. Cinematic 3D Hero */}
      <div id="section-hero">
        <Cinematic3DHero onNavigate={onNavigate} />
      </div>

      {/* 2. Hero AI Scan Animation Simulation */}
      <div id="section-scan-demo">
        <HeroAIScanSimulation />
      </div>

      {/* 3. Trust / Technology Strip */}
      <div id="section-trust">
        <TechnologyTrustStrip />
      </div>

      {/* 4. One Platform. Complete Agricultural Intelligence Pipeline */}
      <div id="section-pipeline">
        <PlatformPipelineSection />
      </div>

      {/* 5. Feature 01 — Crop & Disease Detection */}
      <div id="section-feature-disease">
        <CropDiseaseFeature />
      </div>

      {/* 6. Feature 02 — Climate Risk Intelligence */}
      <div id="section-feature-climate">
        <ClimateRiskFeature />
      </div>

      {/* 7. Feature 03 — Crop Recommendation Engine */}
      <div id="section-feature-crop-engine">
        <CropRecommendationFeature />
      </div>

      {/* 8. Feature 04 — Yield Prediction */}
      <div id="section-feature-yield">
        <YieldPredictionFeature />
      </div>

      {/* 9. Feature 05 — Irrigation Intelligence */}
      <div id="section-feature-irrigation">
        <IrrigationIntelligenceFeature />
      </div>

      {/* 10. Feature 06 — Market Price Intelligence */}
      <div id="section-feature-market">
        <MarketPriceFeature onNavigate={onNavigate} />
      </div>

      {/* 11. Multimodal AI Cross-Attention Fusion */}
      <div id="section-multimodal-ai">
        <MultimodalAISection />
      </div>

      {/* 12. RAG Knowledge Engine Architecture */}
      <div id="section-rag-engine">
        <RAGArchitectureSection />
      </div>

      {/* 13. Autonomous AI Agent Workflow */}
      <div id="section-ai-agent">
        <AIAgentWorkflowSection />
      </div>

      {/* 14. Conversational AI Assistant Preview */}
      <div id="section-assistant-preview">
        <AIAssistantPreviewSection onNavigate={onNavigate} />
      </div>

      {/* 15. "From Image to Decision" Storytelling */}
      <div id="section-storytelling">
        <StorytellingSection />
      </div>

      {/* 16. Engineering System Architecture */}
      <div id="section-architecture">
        <SystemArchitectureSection />
      </div>

      {/* 17. Performance Engineering: Built for Scale. Designed for Speed. */}
      <div id="section-performance">
        <PerformanceEngineeringSection />
      </div>

      {/* 30. Final Call to Action */}
      <div id="section-final-cta">
        <FinalCallToAction onNavigate={onNavigate} />
      </div>
    </div>
  );
}
