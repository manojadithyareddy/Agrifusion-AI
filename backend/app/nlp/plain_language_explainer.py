"""
AgriFusion Plain-Language Explainer (NLP & GenAI)
==================================================
Converts complex computer vision and agronomic pathology output into
crystal-clear, structured answers that anyone with ZERO agricultural knowledge
can immediately understand, follow, and trust.

Supports:
- Google Gemini GenAI via LangChain
- Deterministic multilingual plain-language agronomic fallbacks (en, hi, te, kn, ta, mr, pa, gu)
"""

import os
import logging
from typing import Dict, Any, Optional, List
from app.services.llm_factory import get_llm

logger = logging.getLogger(__name__)

# Multilingual Translations for Section Headers & Key Labels
LABELS_BY_LANG = {
    "en": {
        "plant_title": "🌿 What Plant Is This?",
        "what_happened_title": "🔍 What Is Happening? (Simple Words)",
        "pest_title": "🐛 Any Insects or Pests?",
        "danger_title": "🚨 How Serious Is It?",
        "home_remedy_title": "🏠 Easy Home Remedy (Safe & Gentle)",
        "store_medicine_title": "🛒 Medicine from Shop (Exact Name & Dose)",
        "avoid_title": "🚫 Big Mistakes to Avoid",
        "accuracy_label": "Verified Accuracy (Deep CNN & OpenCV)",
        "listen_btn": "🔊 Listen in Simple Words",
        "will_survive": "Will my plant survive?",
        "yes_survive": "Yes! Treat it this week and it will recover completely.",
        "take_action_in": "Take action within",
        "days": "days"
    },
    "hi": {
        "plant_title": "🌿 यह कौन सा पौधा है?",
        "what_happened_title": "🔍 पौधे को क्या परेशानी है (सरल भाषा में)?",
        "pest_title": "🐛 क्या कोई कीड़ा या कीट लगा है?",
        "danger_title": "🚨 कितनी चिंता की बात है?",
        "home_remedy_title": "🏠 घर पर आसान इलाज (सुरक्षित और घरेलू)",
        "store_medicine_title": "🛒 दुकान से दवा (दवा का नाम व सही मात्रा)",
        "avoid_title": "🚫 ये गलतियां बिल्कुल न करें",
        "accuracy_label": "जांच सटीकता (डीप सीएनएन व कंप्यूटर विजन)",
        "listen_btn": "🔊 सरल भाषा में सुनें",
        "will_survive": "क्या पौधा बच जाएगा?",
        "yes_survive": "हाँ! अगले कुछ दिनों में इलाज करने पर पौधा पूरी तरह स्वस्थ हो जाएगा।",
        "take_action_in": "इलाज का सही समय: अगले",
        "days": "दिन के अंदर"
    },
    "te": {
        "plant_title": "🌿 ఇది ఏ మొక్క?",
        "what_happened_title": "🔍 మొక్కకు ఏమైంది (సులభమైన వివరణ)?",
        "pest_title": "🐛 ఏవైనా పురుగులు లేదా తెగుళ్లు ఉన్నాయా?",
        "danger_title": "🚨 ఎంత ప్రమాదకరం?",
        "home_remedy_title": "🏠 ఇంట్లోనే సులభమైన నివారణ",
        "store_medicine_title": "🛒 దుకాణం నుండి మందు (పేరు మరియు మోతాదు)",
        "avoid_title": "🚫 చేయకూడని తప్పులు",
        "accuracy_label": "ఖచ్చితత్వం (డీప్ CNN & OpenCV)",
        "listen_btn": "🔊 వినండి",
        "will_survive": "మొక్క బతుకుతుందా?",
        "yes_survive": "ఖచ్చితంగా! ఈ వారంలో చికిత్స చేస్తే మొక్క పూర్తిగా కోలుకుంటుంది.",
        "take_action_in": "చర్య తీసుకోండి",
        "days": "రోజుల్లో"
    },
    "kn": {
        "plant_title": "🌿 ಇದು ಯಾವ ಸಸ್ಯ?",
        "what_happened_title": "🔍 ಸಸ್ಯಕ್ಕೆ ಏನಾಗಿದೆ (ಸರಳ ಮಾತುಗಳಲ್ಲಿ)?",
        "pest_title": "🐛 ಯಾವುದೇ ಕೀಟಗಳು ಇವೆಯಾ?",
        "danger_title": "🚨 ಇದು ಎಷ್ಟು ಗಂಭೀರ?",
        "home_remedy_title": "🏠 ಮನೆಯಲ್ಲಿ ಸುಲಭ ಪರಿಹಾರ",
        "store_medicine_title": "🛒 ಅಂಗಡಿಯ ಔಷಧಿ (ಹೆಸರು ಮತ್ತು ಪ್ರಮಾಣ)",
        "avoid_title": "🚫 ಮಾಡಬಾರದ ತಪ್ಪುಗಳು",
        "accuracy_label": "ನಿಖರತೆ (ಡೀಪ್ ಸಿಎನ್‌ಎನ್)",
        "listen_btn": "🔊 ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
        "will_survive": "ಗಿಡ ಉಳಿಯುತ್ತಾ?",
        "yes_survive": "ಹೌದು! ಈ ವಾರ ಪರಿಹಾರ ಮಾಡಿದರೆ ಗಿಡ ಸುಧಾರಿಸುತ್ತದೆ.",
        "take_action_in": "ಕ್ರಮ ಕೈಗೊಳ್ಳಿ",
        "days": "ದಿನಗಳಲ್ಲಿ"
    },
    "ta": {
        "plant_title": "🌿 இது என்ன செடி?",
        "what_happened_title": "🔍 செடிக்கு என்ன பிரச்சனை (எளிய விளக்கம்)?",
        "pest_title": "🐛 பூச்சிகள் ஏதேனும் உள்ளதா?",
        "danger_title": "🚨 எவ்வளவு ஆபத்தானது?",
        "home_remedy_title": "🏠 வீட்டிலேயே எளிய தீர்வு",
        "store_medicine_title": "🛒 கடையில் வாங்க வேண்டிய மருந்து (அளவுடன்)",
        "avoid_title": "🚫 தவிர்க்க வேண்டிய தவறுகள்",
        "accuracy_label": "துல்லியம் (Deep CNN & OpenCV)",
        "listen_btn": "🔊 எளிய தமிழில் கேளுங்கள்",
        "will_survive": "செடி பிழைக்குமா?",
        "yes_survive": "ஆம்! இந்த வாரம் சிகிச்சை அளித்தால் செடி தழைக்கும்.",
        "take_action_in": "செயல்பட வேண்டிய காலம்",
        "days": "நாட்கள்"
    },
    "mr": {
        "plant_title": "🌿 हे कोणते रोप किंवा झाड आहे?",
        "what_happened_title": "🔍 रोपाला काय झाले आहे (सोप्या भाषेत)?",
        "pest_title": "🐛 काही किडे किंवा अळ्या आहेत का?",
        "danger_title": "🚨 काळजीचे प्रमाण किती आहे?",
        "home_remedy_title": "🏠 घरगुती सोपे उपाय (सुरक्षित)",
        "store_medicine_title": "🛒 दुकानातील औषध (नाव व योग्य प्रमाण)",
        "avoid_title": "🚫 कोणत्या चुका करू नयेत?",
        "accuracy_label": "तपासणी अचूकता (Deep CNN & OpenCV)",
        "listen_btn": "🔊 सोप्या भाषेत ऐका",
        "will_survive": "झाड वाचेल का?",
        "yes_survive": "हो नक्की! या आठवड्यात उपाय केल्यास झाड उत्तम फळ देईल.",
        "take_action_in": "उपाय करण्याची मुदत",
        "days": "दिवस"
    },
    "pa": {
        "plant_title": "🌿 ਇਹ ਕਿਹੜਾ ਬੂਟਾ ਹੈ?",
        "what_happened_title": "🔍 ਬੂਟੇ ਨੂੰ ਕੀ ਸਮੱਸਿਆ ਹੈ (ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ)?",
        "pest_title": "🐛 ਕੀ ਕੋਈ ਕੀੜਾ ਜਾਂ ਸੂੰਡੀ ਹੈ?",
        "danger_title": "🚨 ਖ਼ਤਰਾ ਕਿੰਨਾ ਹੈ?",
        "home_remedy_title": "🏠 ਘਰੇਲੂ ਸੌਖਾ ਨੁਸਖਾ (ਸੁਰੱਖਿਅਤ)",
        "store_medicine_title": "🛒 ਦੁਕਾਨ ਤੋਂ ਦਵਾਈ (ਨਾਮ ਤੇ ਖੁਰਾਕ)",
        "avoid_title": "🚫 ਕਿਹੜੀਆਂ ਗ਼ਲਤੀਆਂ ਨਾ ਕਰੋ",
        "accuracy_label": "ਜਾਂਚ ਸ਼ੁੱਧਤਾ (Deep CNN)",
        "listen_btn": "🔊 ਸੌਖੀ ਬੋਲੀ ਵਿੱਚ ਸੁਣੋ",
        "will_survive": "ਕੀ ਬੂਟਾ ਬਚ ਜਾਵੇਗਾ?",
        "yes_survive": "ਹਾਂ ਜੀ! ਅਗਲੇ 3-4 ਦਿਨਾਂ ਵਿੱਚ ਇਲਾਜ ਕਰਨ 'ਤੇ ਬੂਟਾ ਬਚ ਜਾਵੇਗਾ।",
        "take_action_in": "ਕਾਰਵਾਈ ਕਰੋ",
        "days": "ਦਿਨਾਂ ਅੰਦਰ"
    },
    "gu": {
        "plant_title": "🌿 આ કયો છોડ છે?",
        "what_happened_title": "🔍 છોડને શું તકલીફ છે (સરળ શબ્દોમાં)?",
        "pest_title": "🐛 કોઈ જીવાત કે ઈયળ છે?",
        "danger_title": "🚨 જોખમ કેટલું છે?",
        "home_remedy_title": "🏠 ઘરેલુ સરળ ઉપાય (સલામત)",
        "store_medicine_title": "🛒 દુકાનમાંથી દવા (નામ અને યોગ્ય માપ)",
        "avoid_title": "🚫 શું ભૂલ ન કરવી?",
        "accuracy_label": "ચોકસાઈ (Deep CNN & OpenCV)",
        "listen_btn": "🔊 સરળ ભાષામાં સાંભળો",
        "will_survive": "શું છોડ બચી જશે?",
        "yes_survive": "હા! આ અઠવાડિયે સારવાર કરવાથી છોડ તંદુરસ્ત થઈ જશે.",
        "take_action_in": "પગલાં લો",
        "days": "દિવસમાં"
    }
}

class PlainLanguageExplainer:
    """
    Transforms deep vision findings into intuitive, jargon-free answers.
    """

    def __init__(self):
        try:
            self.llm = get_llm(temperature=0.3)
        except Exception as e:
            logger.warning(f"GenAI LLM not available for explainer: {e}")
            self.llm = None

    async def generate_explanation(
        self,
        crop: str,
        disease_info: Dict[str, Any],
        confidence: float,
        opencv_metrics: Dict[str, Any],
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Builds the structured, non-expert understandable explanation.
        Tries GenAI first, falling back to deterministic agricultural expert logic.
        """
        lang = language.lower() if language in LABELS_BY_LANG else "en"
        labels = LABELS_BY_LANG.get(lang, LABELS_BY_LANG["en"])

        plant_name = crop.capitalize()
        disease_name = disease_info.get("name", "Unknown Issue")
        simple_disease = disease_info.get("simple_name", disease_name)
        simple_explanation = disease_info.get("simple_explanation", "Symptoms observed on foliage.")
        pest_explanation = disease_info.get("pest_explanation", "No harmful insects detected.")
        has_pest = bool(disease_info.get("pest_involved"))
        severity = disease_info.get("severity", "Moderate")
        urgency_days = disease_info.get("urgency_days", 4)
        home_remedy = disease_info.get("home_remedy", "Spray mild neem water solution.")
        store_medicine = disease_info.get("store_medicine", "Consult your local agro-dealer.")
        avoid_mistakes = disease_info.get("avoid_mistakes", [
            "Do not splash water directly onto leaves.",
            "Do not spray in bright midday sunlight."
        ])

        # If LLM is available, enrich with GenAI conversational tone
        if self.llm and lang == "en":
            try:
                prompt = f"""
                You are helping a complete beginner who loves plants but knows ZERO science or farming terms.
                Convert this plant disease diagnosis into a warm, friendly, simple explanation:
                - Plant: {plant_name}
                - Problem: {simple_disease}
                - Severity: {severity}
                - Home remedy: {home_remedy}

                Respond in 2 short bullet points that an absolute beginner will love and immediately understand.
                """
                res = await self.llm.ainvoke(prompt)
                llm_text = res.content.strip() if hasattr(res, "content") else str(res).strip()
                if llm_text:
                    simple_explanation += f"\n\n🌱 Quick tip: {llm_text[:200]}"
            except Exception as e:
                logger.info(f"GenAI LLM formatting skipped: {e}")

        # Structure for the Frontend Card
        return {
            "language": lang,
            "labels": labels,
            "plant_identity": {
                "name": plant_name,
                "display": f"{plant_name} Leaf & Foliage",
                "healthy": severity.lower() == "none"
            },
            "simple_problem": {
                "headline": simple_disease,
                "scientific_name": disease_name,
                "easy_description": simple_explanation,
            },
            "pest_status": {
                "has_pest": has_pest,
                "pest_details": pest_explanation,
                "pest_name": disease_info.get("pest_involved") or ("None" if lang == "en" else "कोई कीट नहीं")
            },
            "danger_level": {
                "severity": severity,
                "urgency_days": urgency_days,
                "timeline_text": f"{labels['take_action_in']} {urgency_days} {labels['days']}" if urgency_days > 0 else "Plant is healthy",
                "survival_text": labels["yes_survive"] if urgency_days > 0 else "All good!"
            },
            "easy_steps": {
                "home_remedy": home_remedy,
                "store_medicine": store_medicine,
                "avoid_mistakes": avoid_mistakes
            },
            "accuracy": {
                "percentage": round(confidence, 1),
                "badge": f"{round(confidence, 1)}% {labels['accuracy_label']}"
            },
            "opencv_highlights": {
                "spots_found": opencv_metrics.get("spot_count", 0),
                "leaf_greenery": f"{opencv_metrics.get('green_foliage_pct', 0)}%",
                "lesion_spread": f"{opencv_metrics.get('necrotic_lesion_pct', 0)}%"
            }
        }


# Singleton
_explainer: Optional[PlainLanguageExplainer] = None

def get_plain_language_explainer() -> PlainLanguageExplainer:
    global _explainer
    if _explainer is None:
        _explainer = PlainLanguageExplainer()
    return _explainer
