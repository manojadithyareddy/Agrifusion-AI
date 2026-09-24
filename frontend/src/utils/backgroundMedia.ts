/**
 * High-definition, watermark-free agricultural background imagery
 * and animated visual themes for prediction models and individual crops.
 */

export interface BackgroundTheme {
  title: string;
  subtitle: string;
  imageUrl: string;
  accentColor: string;
  ambientGrad: string;
  videoOverlayEffect?: 'rain' | 'sunbeams' | 'dust' | 'mist' | 'golden';
}

// Model-specific visual backdrops
export const PREDICTION_THEMES: Record<string, BackgroundTheme> = {
  crop: {
    title: 'Crop Recommendation Intelligence',
    subtitle: 'Matching soil nutrients and climate envelopes to optimal crops',
    imageUrl: '/backgrounds/sustainable_journey.jpg', // lush green rolling farm landscape
    accentColor: '#4ade80',
    ambientGrad: 'radial-gradient(ellipse at 30% 20%, rgba(34,197,94,0.18) 0%, transparent 60%)',
    videoOverlayEffect: 'sunbeams',
  },
  yield: {
    title: 'Yield Prediction Engine',
    subtitle: 'Forecasting harvest tonnage and production biomass',
    imageUrl: '/backgrounds/golden_harvest.jpg', // golden wheat field with combine harvester
    accentColor: '#38bdf8',
    ambientGrad: 'radial-gradient(ellipse at 70% 30%, rgba(56,189,248,0.18) 0%, transparent 60%)',
    videoOverlayEffect: 'golden',
  },
  climate: {
    title: 'Climate Risk & Weather Shield',
    subtitle: 'Multi-hazard monitoring for drought, flood, and heat stress',
    imageUrl: '/backgrounds/climate_risk.jpg', // dramatic storm clouds over field
    accentColor: '#f59e0b',
    ambientGrad: 'radial-gradient(ellipse at 40% 20%, rgba(245,158,11,0.18) 0%, transparent 60%)',
    videoOverlayEffect: 'rain',
  },
  irrigation: {
    title: 'Precision Irrigation Advisory',
    subtitle: 'Smart evapotranspiration scheduling and moisture conservation',
    imageUrl: '/backgrounds/smart_irrigation.jpg', // irrigation sprinklers misting green field
    accentColor: '#06b6d4',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.18) 0%, transparent 60%)',
    videoOverlayEffect: 'mist',
  },
  market: {
    title: 'Mandi Market Intelligence',
    subtitle: 'Price discovery, MSP benchmarking, and seasonal arrival forecasting',
    imageUrl: '/backgrounds/mandi_market.jpg', // bustling vibrant farm harvest mandi market
    accentColor: '#a855f7',
    ambientGrad: 'radial-gradient(ellipse at 60% 40%, rgba(168,85,247,0.18) 0%, transparent 60%)',
    videoOverlayEffect: 'dust',
  },
  revenue: {
    title: 'Farm Revenue & Profitability Calculator',
    subtitle: 'Enterprise economics, cost breakdown, and net margin optimization',
    imageUrl: '/backgrounds/sunrise_horizon.jpg', // prosperous sunlit agricultural estate
    accentColor: '#ec4899',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(236,72,153,0.18) 0%, transparent 60%)',
    videoOverlayEffect: 'golden',
  },
};

// Crop-specific high-resolution visual backdrops (watermark-free)
export const CROP_THEMES: Record<string, BackgroundTheme> = {
  Rice: {
    title: 'Rice (Paddy) Ecosystem',
    subtitle: 'Semi-aquatic cereal crop with high moisture demand',
    imageUrl: '/crops/rice.jpg', // verdant terraced rice paddies
    accentColor: '#4ade80',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(74,222,128,0.2) 0%, transparent 60%)',
  },
  Wheat: {
    title: 'Wheat Production Belt',
    subtitle: 'Temperate Rabi staple cereal crop',
    imageUrl: '/backgrounds/golden_harvest.jpg', // glowing golden wheat fields under sunset
    accentColor: '#facc15',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.2) 0%, transparent 60%)',
  },
  Cotton: {
    title: 'Cotton (White Gold) Fields',
    subtitle: 'Deep black soil commercial fiber crop',
    imageUrl: '/crops/cotton.jpg', // authentic blooming cotton farm field
    accentColor: '#f1f5f9',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(241,245,249,0.15) 0%, transparent 60%)',
  },
  Sugarcane: {
    title: 'Sugarcane Plantation',
    subtitle: 'Tropical perennial grass with immense biomass productivity',
    imageUrl: 'https://images.unsplash.com/photo-1599818463359-1e3837d42c30?auto=format&fit=crop&w=2000&q=85', // lush green sugarcane plantation
    accentColor: '#22c55e',
    ambientGrad: 'radial-gradient(ellipse at 40% 30%, rgba(34,197,94,0.2) 0%, transparent 60%)',
  },
  Maize: {
    title: 'Maize (Corn) Agro-ecosystem',
    subtitle: 'High-energy cereal grain with efficient C4 photosynthesis',
    imageUrl: '/crops/maize.jpg', // tall green cornfield with golden ears
    accentColor: '#f59e0b',
    ambientGrad: 'radial-gradient(ellipse at 60% 20%, rgba(245,158,11,0.2) 0%, transparent 60%)',
  },
  Tomato: {
    title: 'Tomato Horticulture Cultivation',
    subtitle: 'High-value solanaceous crop needing intensive care',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=2000&q=85', // lush red tomato vines in greenhouse/farm
    accentColor: '#ef4444',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(239,68,68,0.2) 0%, transparent 60%)',
  },
  Potato: {
    title: 'Potato Tuber Agriculture',
    subtitle: 'Cool-season subterranean carbohydrate powerhouse',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=2000&q=85', // potato cultivation field
    accentColor: '#d97706',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(217,119,6,0.2) 0%, transparent 60%)',
  },
  Apple: {
    title: 'Apple Mountain Orchard',
    subtitle: 'High-altitude temperate fruit with winter chilling requirement',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=2000&q=85', // picturesque apple trees laden with red fruit
    accentColor: '#f43f5e',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(244,63,94,0.2) 0%, transparent 60%)',
  },
  Banana: {
    title: 'Banana Tropical Plantation',
    subtitle: 'Fast-growing giant herbaceous perennial',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=2000&q=85', // lush banana grove with hanging bunches
    accentColor: '#eab308',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(234,179,8,0.2) 0%, transparent 60%)',
  },
  Coffee: {
    title: 'Coffee Estate Hillside',
    subtitle: 'Shade-grown plantation shrub of Western/Eastern Ghats',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=2000&q=85', // coffee cherries on branch in mist
    accentColor: '#b45309',
    ambientGrad: 'radial-gradient(ellipse at 40% 30%, rgba(180,83,9,0.2) 0%, transparent 60%)',
  },
  Soybean: {
    title: 'Soybean Oilseed Crop',
    subtitle: 'High-protein legume crop of central black soil plateau',
    imageUrl: '/crops/soybean.jpg', // green soybean field
    accentColor: '#84cc16',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(132,204,22,0.2) 0%, transparent 60%)',
  },
  Chickpea: {
    title: 'Chickpea (Gram) Pulse Field',
    subtitle: 'Drought-hardy legume fixing biological nitrogen',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=2000&q=85', // organic legume crops in field
    accentColor: '#10b981',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.2) 0%, transparent 60%)',
  },
  Mustard: {
    title: 'Mustard (Sarson) Golden Bloom',
    subtitle: 'Winter oilseed with signature vibrant yellow flowering canopy',
    imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=2000&q=85', // brilliant yellow mustard field
    accentColor: '#facc15',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(250,204,21,0.25) 0%, transparent 60%)',
  },
  Mango: {
    title: 'Mango Orchard & Groves',
    subtitle: 'King of fruits, tropical perennial canopy',
    imageUrl: '/crops/mango.jpg',
    accentColor: '#fb923c',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(251,146,60,0.2) 0%, transparent 60%)',
  },
  Onion: {
    title: 'Onion Field Harvesting',
    subtitle: 'Essential biennial bulb vegetable crop',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=2000&q=85',
    accentColor: '#c084fc',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(192,132,252,0.2) 0%, transparent 60%)',
  },
  Coconut: {
    title: 'Coastal Coconut Palms',
    subtitle: 'Tree of life across tropical coastlines',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    accentColor: '#38bdf8',
    ambientGrad: 'radial-gradient(ellipse at 50% 20%, rgba(56,189,248,0.2) 0%, transparent 60%)',
  },
  Watermelon: {
    title: 'Watermelon Riverbed Cultivation',
    subtitle: 'Cucurbit summer crop with high thirst quenching yield',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=2000&q=85',
    accentColor: '#f43f5e',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(244,63,94,0.2) 0%, transparent 60%)',
  },
  Chilli: {
    title: 'Red Chilli Spice Drying Yards',
    subtitle: 'High-value pungency cash crop of Deccan plains',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=2000&q=85',
    accentColor: '#dc2626',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(220,38,38,0.2) 0%, transparent 60%)',
  },
  Ragi: {
    title: 'Finger Millet (Ragi) Fields',
    subtitle: 'Climate resilient super-cereal of southern plateau',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2000&q=85',
    accentColor: '#a16207',
    ambientGrad: 'radial-gradient(ellipse at 50% 30%, rgba(161,98,7,0.2) 0%, transparent 60%)',
  },
};

/**
 * Returns the theme for a crop, or falls back to the prediction theme
 */
export function getBackgroundForCrop(cropName?: string, fallbackTab: string = 'crop'): BackgroundTheme {
  if (cropName && cropName.trim()) {
    const clean = cropName.trim().toLowerCase();
    // Direct or alias matches
    if (clean.includes('rice') || clean.includes('paddy')) return CROP_THEMES.Rice;
    if (clean.includes('wheat') || clean.includes('gehun')) return CROP_THEMES.Wheat;
    if (clean.includes('cotton') || clean.includes('kapas')) return CROP_THEMES.Cotton;
    if (clean.includes('sugar') || clean.includes('ganna')) return CROP_THEMES.Sugarcane;
    if (clean.includes('maize') || clean.includes('corn') || clean.includes('makka')) return CROP_THEMES.Maize;
    if (clean.includes('tomato')) return CROP_THEMES.Tomato;
    if (clean.includes('potato') || clean.includes('aalu')) return CROP_THEMES.Potato;
    if (clean.includes('banana') || clean.includes('kela')) return CROP_THEMES.Banana;
    if (clean.includes('apple')) return CROP_THEMES.Apple;
    if (clean.includes('coffee')) return CROP_THEMES.Coffee;
    if (clean.includes('soybean')) return CROP_THEMES.Soybean;
    if (clean.includes('chickpea') || clean.includes('chana') || clean.includes('gram')) return CROP_THEMES.Chickpea;
    if (clean.includes('mustard') || clean.includes('sarson') || clean.includes('rai')) return CROP_THEMES.Mustard;
    if (clean.includes('mango') || clean.includes('aam')) return CROP_THEMES.Mango;
    if (clean.includes('onion') || clean.includes('pyaz')) return CROP_THEMES.Onion;
    if (clean.includes('coconut') || clean.includes('nariyal')) return CROP_THEMES.Coconut;
    if (clean.includes('melon')) return CROP_THEMES.Watermelon;
    if (clean.includes('chilli') || clean.includes('mirch')) return CROP_THEMES.Chilli;
    if (clean.includes('millet') || clean.includes('ragi') || clean.includes('jowar') || clean.includes('bajra')) return CROP_THEMES.Ragi;

    for (const [key, theme] of Object.entries(CROP_THEMES)) {
      if (key.toLowerCase() === clean || clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
        return theme;
      }
    }
  }
  return PREDICTION_THEMES[fallbackTab] || PREDICTION_THEMES.crop;
}
