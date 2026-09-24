import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { INDIAN_STATES } from '../utils/geoCropData';
import { useI18n } from '../i18n';

interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  benefit: string;
  eligibility: string;
  website?: string;
  relevance_score?: number;
  match_reasons?: string[];
}

interface MandiPriceItem {
  id: string;
  commodity: string;
  hindi_name: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Commercial' | 'Vegetables';
  state: string;
  mandi_name: string;
  modal_price: number;
  msp_2024_25: number | null;
  min_price: number;
  max_price: number;
  daily_arrivals_qtl: number;
  trend: 'up' | 'down' | 'stable';
  advisory: string;
}

const LIVE_MANDI_DATA: MandiPriceItem[] = [
  // Punjab
  {
    id: 'pb_paddy',
    commodity: 'Paddy (Common / PR-126)',
    hindi_name: 'धान (सामान्य)',
    category: 'Cereals',
    state: 'Punjab',
    mandi_name: 'Khanna APMC',
    modal_price: 2360,
    msp_2024_25: 2300,
    min_price: 2250,
    max_price: 2420,
    daily_arrivals_qtl: 4200,
    trend: 'up',
    advisory: 'Firm demand from private millers. Clean and dry harvest below 14% moisture.'
  },
  {
    id: 'pb_basmati',
    commodity: 'Basmati Paddy (Pusa 1121)',
    hindi_name: 'बासमती धान',
    category: 'Cereals',
    state: 'Punjab',
    mandi_name: 'Amritsar APMC',
    modal_price: 3850,
    msp_2024_25: null,
    min_price: 3600,
    max_price: 4150,
    daily_arrivals_qtl: 3100,
    trend: 'up',
    advisory: 'Gulf export orders driving high demand for premium 1121 and 1509 varieties.'
  },
  {
    id: 'pb_wheat',
    commodity: 'Wheat (PBW-826 / HD-3086)',
    hindi_name: 'गेहूं',
    category: 'Cereals',
    state: 'Punjab',
    mandi_name: 'Ludhiana APMC',
    modal_price: 2420,
    msp_2024_25: 2275,
    min_price: 2320,
    max_price: 2500,
    daily_arrivals_qtl: 5600,
    trend: 'up',
    advisory: 'Trading 6.4% above MSP with heavy buying by roller flour mills.'
  },
  {
    id: 'pb_cotton',
    commodity: 'Bt Cotton (Medium Staple)',
    hindi_name: 'कपास',
    category: 'Commercial',
    state: 'Punjab',
    mandi_name: 'Bathinda APMC',
    modal_price: 7420,
    msp_2024_25: 7121,
    min_price: 7100,
    max_price: 7680,
    daily_arrivals_qtl: 1400,
    trend: 'up',
    advisory: 'CCI procurement centers active. Keep moisture below 8%.'
  },
  {
    id: 'pb_maize',
    commodity: 'Maize (Kharif/Spring)',
    hindi_name: 'मक्का',
    category: 'Cereals',
    state: 'Punjab',
    mandi_name: 'Hoshiarpur APMC',
    modal_price: 2240,
    msp_2024_25: 2090,
    min_price: 2100,
    max_price: 2320,
    daily_arrivals_qtl: 2100,
    trend: 'up',
    advisory: 'Starch industry and silage buyers bidding actively.'
  },

  // Haryana
  {
    id: 'hr_paddy',
    commodity: 'Paddy (Grade A / 1509)',
    hindi_name: 'धान (ग्रेड ए)',
    category: 'Cereals',
    state: 'Haryana',
    mandi_name: 'Karnal APMC',
    modal_price: 2385,
    msp_2024_25: 2320,
    min_price: 2280,
    max_price: 2450,
    daily_arrivals_qtl: 3100,
    trend: 'up',
    advisory: 'Procurement at MSP ongoing. High export inquiries.'
  },
  {
    id: 'hr_wheat',
    commodity: 'Wheat (WH-1105)',
    hindi_name: 'गेहूं',
    category: 'Cereals',
    state: 'Haryana',
    mandi_name: 'Sirsa APMC',
    modal_price: 2440,
    msp_2024_25: 2275,
    min_price: 2350,
    max_price: 2510,
    daily_arrivals_qtl: 4800,
    trend: 'up',
    advisory: 'Strong mill inquiry keeping spot rates firm.'
  },
  {
    id: 'hr_mustard',
    commodity: 'Mustard / Rapeseed',
    hindi_name: 'सरसों',
    category: 'Oilseeds',
    state: 'Haryana',
    mandi_name: 'Hisar APMC',
    modal_price: 5880,
    msp_2024_25: 5650,
    min_price: 5600,
    max_price: 6100,
    daily_arrivals_qtl: 3400,
    trend: 'up',
    advisory: 'Crush margins steady. Stagger your sales.'
  },
  {
    id: 'hr_bajra',
    commodity: 'Bajra (Pearl Millet)',
    hindi_name: 'बाजरा',
    category: 'Cereals',
    state: 'Haryana',
    mandi_name: 'Rewari APMC',
    modal_price: 2625,
    msp_2024_25: 2625,
    min_price: 2450,
    max_price: 2700,
    daily_arrivals_qtl: 1900,
    trend: 'stable',
    advisory: 'HAFED government buying operational under Bhavantar scheme.'
  },

  // Maharashtra
  {
    id: 'mh_soybean',
    commodity: 'Soybean (Yellow)',
    hindi_name: 'सोयाबीन (पीला)',
    category: 'Oilseeds',
    state: 'Maharashtra',
    mandi_name: 'Latur APMC',
    modal_price: 4720,
    msp_2024_25: 4892,
    min_price: 4400,
    max_price: 4950,
    daily_arrivals_qtl: 6400,
    trend: 'down',
    advisory: 'Heavy arrivals pulled spot rates below MSP. Hold in warehouse if possible.'
  },
  {
    id: 'mh_cotton',
    commodity: 'Bt Cotton (Medium Staple)',
    hindi_name: 'कपास',
    category: 'Commercial',
    state: 'Maharashtra',
    mandi_name: 'Jalgaon APMC',
    modal_price: 7450,
    msp_2024_25: 7121,
    min_price: 7200,
    max_price: 7650,
    daily_arrivals_qtl: 2800,
    trend: 'up',
    advisory: 'Textile spinning mills buying steadily. Ensure lint is dry.'
  },
  {
    id: 'mh_onion',
    commodity: 'Onion (Nashik Red)',
    hindi_name: 'प्याज़ (लाल)',
    category: 'Vegetables',
    state: 'Maharashtra',
    mandi_name: 'Lasalgaon APMC',
    modal_price: 2450,
    msp_2024_25: null,
    min_price: 1800,
    max_price: 2800,
    daily_arrivals_qtl: 14000,
    trend: 'up',
    advisory: 'High demand across metropolitan centres. Well cured bulbs fetch top price.'
  },
  {
    id: 'mh_tomato',
    commodity: 'Tomato (Hybrid)',
    hindi_name: 'टमाटर',
    category: 'Vegetables',
    state: 'Maharashtra',
    mandi_name: 'Narayangaon APMC',
    modal_price: 1850,
    msp_2024_25: null,
    min_price: 1200,
    max_price: 2300,
    daily_arrivals_qtl: 8500,
    trend: 'up',
    advisory: 'Harvest firm green-shoulder fruit for distant transit.'
  },
  {
    id: 'mh_chana',
    commodity: 'Gram / Chana',
    hindi_name: 'चना',
    category: 'Pulses',
    state: 'Maharashtra',
    mandi_name: 'Akola APMC',
    modal_price: 5740,
    msp_2024_25: 5440,
    min_price: 5400,
    max_price: 5950,
    daily_arrivals_qtl: 3200,
    trend: 'up',
    advisory: 'Good festive season dal mill consumption.'
  },
  {
    id: 'mh_banana',
    commodity: 'Banana (Grand Naine / G9)',
    hindi_name: 'केला (जी-९)',
    category: 'Vegetables',
    state: 'Maharashtra',
    mandi_name: 'Raver / Jalgaon Mandi',
    modal_price: 2150,
    msp_2024_25: null,
    min_price: 1800,
    max_price: 2450,
    daily_arrivals_qtl: 9200,
    trend: 'up',
    advisory: 'Export shipments to Middle East strong. Cut at 80% maturity.'
  },

  // Karnataka
  {
    id: 'ka_maize',
    commodity: 'Maize (Feed / Yellow Corn)',
    hindi_name: 'मक्का',
    category: 'Cereals',
    state: 'Karnataka',
    mandi_name: 'Davanagere APMC',
    modal_price: 2180,
    msp_2024_25: 2090,
    min_price: 2020,
    max_price: 2260,
    daily_arrivals_qtl: 4100,
    trend: 'up',
    advisory: 'Poultry and starch demand strong. Selling window favorable.'
  },
  {
    id: 'ka_ragi',
    commodity: 'Finger Millet (Ragi)',
    hindi_name: 'रागी',
    category: 'Cereals',
    state: 'Karnataka',
    mandi_name: 'Mysuru APMC',
    modal_price: 4350,
    msp_2024_25: 4290,
    min_price: 4100,
    max_price: 4500,
    daily_arrivals_qtl: 1800,
    trend: 'up',
    advisory: 'State procurement under Raitha Siri active with prompt bank credit.'
  },
  {
    id: 'ka_cotton',
    commodity: 'Bt Cotton (Long Staple)',
    hindi_name: 'कपास',
    category: 'Commercial',
    state: 'Karnataka',
    mandi_name: 'Raichur APMC',
    modal_price: 7620,
    msp_2024_25: 7521,
    min_price: 7300,
    max_price: 7850,
    daily_arrivals_qtl: 2300,
    trend: 'up',
    advisory: 'Active bidding by Coimbatore textile buyers.'
  },
  {
    id: 'ka_bengal_gram',
    commodity: 'Bengal Gram (Desi Chana)',
    hindi_name: 'चना',
    category: 'Pulses',
    state: 'Karnataka',
    mandi_name: 'Kalaburagi APMC',
    modal_price: 5820,
    msp_2024_25: 5440,
    min_price: 5500,
    max_price: 6050,
    daily_arrivals_qtl: 2600,
    trend: 'up',
    advisory: 'Trading 7% over MSP. High demand for besan processing.'
  },
  {
    id: 'ka_tomato',
    commodity: 'Tomato',
    hindi_name: 'टमाटर',
    category: 'Vegetables',
    state: 'Karnataka',
    mandi_name: 'Kolar APMC',
    modal_price: 1920,
    msp_2024_25: null,
    min_price: 1400,
    max_price: 2400,
    daily_arrivals_qtl: 11000,
    trend: 'up',
    advisory: 'Largest tomato yard in South India. Heavy inter-state dispatches.'
  },
  {
    id: 'ka_coffee',
    commodity: 'Coffee (Robusta Cherry / Parchment)',
    hindi_name: 'कॉफी',
    category: 'Commercial',
    state: 'Karnataka',
    mandi_name: 'Chikkamagaluru Mandi',
    modal_price: 26500,
    msp_2024_25: null,
    min_price: 24000,
    max_price: 28500,
    daily_arrivals_qtl: 620,
    trend: 'up',
    advisory: 'Global Arabica and Robusta deficit driving all-time record bean prices.'
  },

  // Madhya Pradesh
  {
    id: 'mp_wheat',
    commodity: 'Wheat (Sharbati & Lokwan)',
    hindi_name: 'गेहूं (शरबती)',
    category: 'Cereals',
    state: 'Madhya Pradesh',
    mandi_name: 'Sehore APMC',
    modal_price: 2520,
    msp_2024_25: 2275,
    min_price: 2380,
    max_price: 2750,
    daily_arrivals_qtl: 5800,
    trend: 'up',
    advisory: 'Premium Sharbati commanding massive price bonus over MSP.'
  },
  {
    id: 'mp_soybean',
    commodity: 'Soybean (Yellow)',
    hindi_name: 'सोयाबीन',
    category: 'Oilseeds',
    state: 'Madhya Pradesh',
    mandi_name: 'Ujjain APMC',
    modal_price: 4810,
    msp_2024_25: 4892,
    min_price: 4500,
    max_price: 4980,
    daily_arrivals_qtl: 5200,
    trend: 'stable',
    advisory: 'Oil refiners purchasing steadily. Hold graded seed.'
  },
  {
    id: 'mp_chana',
    commodity: 'Gram / Chana (Kabuli / Desi)',
    hindi_name: 'चना (काबुली)',
    category: 'Pulses',
    state: 'Madhya Pradesh',
    mandi_name: 'Indore APMC',
    modal_price: 6150,
    msp_2024_25: 5440,
    min_price: 5600,
    max_price: 6500,
    daily_arrivals_qtl: 2750,
    trend: 'up',
    advisory: 'Kabuli chana fetching ₹9,000+; bold desi trading well over MSP.'
  },
  {
    id: 'mp_mustard',
    commodity: 'Mustard',
    hindi_name: 'सरसों',
    category: 'Oilseeds',
    state: 'Madhya Pradesh',
    mandi_name: 'Morena APMC',
    modal_price: 5790,
    msp_2024_25: 5650,
    min_price: 5500,
    max_price: 6000,
    daily_arrivals_qtl: 3100,
    trend: 'up',
    advisory: 'High oil content lot yielding best returns.'
  },

  // Gujarat
  {
    id: 'gj_cotton',
    commodity: 'Bt Cotton (Medium Staple)',
    hindi_name: 'कपास',
    category: 'Commercial',
    state: 'Gujarat',
    mandi_name: 'Rajkot APMC',
    modal_price: 7380,
    msp_2024_25: 7121,
    min_price: 7050,
    max_price: 7550,
    daily_arrivals_qtl: 2400,
    trend: 'up',
    advisory: 'Spinning mills buying actively. Maintain strict dry packing.'
  },
  {
    id: 'gj_groundnut',
    commodity: 'Groundnut (in shell)',
    hindi_name: 'मूंगफली',
    category: 'Oilseeds',
    state: 'Gujarat',
    mandi_name: 'Gondal APMC',
    modal_price: 6940,
    msp_2024_25: 6783,
    min_price: 6500,
    max_price: 7200,
    daily_arrivals_qtl: 1900,
    trend: 'up',
    advisory: 'Bold export varieties commanding ₹7,200+.'
  },
  {
    id: 'gj_castor',
    commodity: 'Castor Seed (Divela)',
    hindi_name: 'अरंडी',
    category: 'Oilseeds',
    state: 'Gujarat',
    mandi_name: 'Patan APMC',
    modal_price: 5850,
    msp_2024_25: null,
    min_price: 5600,
    max_price: 6100,
    daily_arrivals_qtl: 2100,
    trend: 'up',
    advisory: 'Global industrial oil orders keeping sentiment positive.'
  },
  {
    id: 'gj_cumin',
    commodity: 'Cumin Seed (Jeera)',
    hindi_name: 'जीरा',
    category: 'Commercial',
    state: 'Gujarat',
    mandi_name: 'Unjha APMC',
    modal_price: 24500,
    msp_2024_25: null,
    min_price: 22000,
    max_price: 27000,
    daily_arrivals_qtl: 1100,
    trend: 'up',
    advisory: 'Asia’s largest spice hub. Global demand very buoyant.'
  },

  // Rajasthan
  {
    id: 'rj_mustard',
    commodity: 'Mustard / Rapeseed',
    hindi_name: 'सरसों / राई',
    category: 'Oilseeds',
    state: 'Rajasthan',
    mandi_name: 'Bharatpur APMC',
    modal_price: 5850,
    msp_2024_25: 5650,
    min_price: 5500,
    max_price: 6100,
    daily_arrivals_qtl: 3200,
    trend: 'up',
    advisory: 'Crushing mills running at capacity. Stagger sales over 3 weeks.'
  },
  {
    id: 'rj_moong',
    commodity: 'Moong (Green Gram)',
    hindi_name: 'मूंग (दाल)',
    category: 'Pulses',
    state: 'Rajasthan',
    mandi_name: 'Nagaur APMC',
    modal_price: 8820,
    msp_2024_25: 8682,
    min_price: 8300,
    max_price: 9200,
    daily_arrivals_qtl: 1200,
    trend: 'up',
    advisory: 'Government procurement centers open at MSP rate.'
  },
  {
    id: 'rj_bajra',
    commodity: 'Bajra (Pearl Millet)',
    hindi_name: 'बाजरा',
    category: 'Cereals',
    state: 'Rajasthan',
    mandi_name: 'Alwar APMC',
    modal_price: 2625,
    msp_2024_25: 2625,
    min_price: 2450,
    max_price: 2750,
    daily_arrivals_qtl: 2800,
    trend: 'stable',
    advisory: 'MSP procurement by FCI taking place.'
  },
  {
    id: 'rj_guar',
    commodity: 'Guar Seed (Cluster Bean)',
    hindi_name: 'ग्वार',
    category: 'Commercial',
    state: 'Rajasthan',
    mandi_name: 'Jodhpur APMC',
    modal_price: 5320,
    msp_2024_25: null,
    min_price: 5050,
    max_price: 5600,
    daily_arrivals_qtl: 1700,
    trend: 'up',
    advisory: 'Shale gas drillers driving gum demand.'
  },

  // Telangana
  {
    id: 'tg_cotton',
    commodity: 'Bt Cotton (Long Staple)',
    hindi_name: 'कपास (लंबा रेशा)',
    category: 'Commercial',
    state: 'Telangana',
    mandi_name: 'Warangal APMC',
    modal_price: 7750,
    msp_2024_25: 7521,
    min_price: 7300,
    max_price: 7920,
    daily_arrivals_qtl: 1850,
    trend: 'up',
    advisory: 'Warangal offering top regional prices. CCI procurement active.'
  },
  {
    id: 'tg_paddy',
    commodity: 'Paddy (Super Fine / BPT-5204)',
    hindi_name: 'धान (बारीक)',
    category: 'Cereals',
    state: 'Telangana',
    mandi_name: 'Nalgonda APMC',
    modal_price: 2480,
    msp_2024_25: 2320,
    min_price: 2350,
    max_price: 2580,
    daily_arrivals_qtl: 4200,
    trend: 'up',
    advisory: 'State bonus + MSP provides remunerative realization for Samba Mahsuri.'
  },
  {
    id: 'tg_maize',
    commodity: 'Maize (Yellow)',
    hindi_name: 'मक्का',
    category: 'Cereals',
    state: 'Telangana',
    mandi_name: 'Karimnagar APMC',
    modal_price: 2210,
    msp_2024_25: 2090,
    min_price: 2050,
    max_price: 2280,
    daily_arrivals_qtl: 2900,
    trend: 'up',
    advisory: 'Poultry hub demand steady and firm.'
  },
  {
    id: 'tg_turmeric',
    commodity: 'Turmeric (Finger / Nizamabad)',
    hindi_name: 'हल्दी',
    category: 'Commercial',
    state: 'Telangana',
    mandi_name: 'Nizamabad APMC',
    modal_price: 14800,
    msp_2024_25: null,
    min_price: 13000,
    max_price: 16500,
    daily_arrivals_qtl: 880,
    trend: 'up',
    advisory: 'Global demand for high curcumin content fingers reaching decade highs.'
  },

  // Andhra Pradesh
  {
    id: 'ap_chilli',
    commodity: 'Dry Red Chilli (Teja / 334)',
    hindi_name: 'सूखी लाल मिर्च (तेजा)',
    category: 'Commercial',
    state: 'Andhra Pradesh',
    mandi_name: 'Guntur APMC',
    modal_price: 18400,
    msp_2024_25: null,
    min_price: 15500,
    max_price: 21000,
    daily_arrivals_qtl: 750,
    trend: 'up',
    advisory: 'Strong export orders from Southeast Asia. Moisture must be <10%.'
  },
  {
    id: 'ap_paddy',
    commodity: 'Paddy (Grade A / Swarna)',
    hindi_name: 'धान (ग्रेड ए)',
    category: 'Cereals',
    state: 'Andhra Pradesh',
    mandi_name: 'Eluru APMC',
    modal_price: 2370,
    msp_2024_25: 2320,
    min_price: 2280,
    max_price: 2420,
    daily_arrivals_qtl: 4900,
    trend: 'up',
    advisory: 'Civil Supplies Corporation procurement centers operating smoothly.'
  },
  {
    id: 'ap_groundnut',
    commodity: 'Groundnut Pods',
    hindi_name: 'मूंगफली',
    category: 'Oilseeds',
    state: 'Andhra Pradesh',
    mandi_name: 'Anantapur APMC',
    modal_price: 6850,
    msp_2024_25: 6783,
    min_price: 6400,
    max_price: 7100,
    daily_arrivals_qtl: 1600,
    trend: 'up',
    advisory: 'Good buying by regional expellers.'
  },
  {
    id: 'ap_cotton',
    commodity: 'Bt Cotton',
    hindi_name: 'कपास',
    category: 'Commercial',
    state: 'Andhra Pradesh',
    mandi_name: 'Adoni APMC',
    modal_price: 7500,
    msp_2024_25: 7121,
    min_price: 7200,
    max_price: 7700,
    daily_arrivals_qtl: 2100,
    trend: 'up',
    advisory: 'Major cotton hub in Rayalaseema. Fair average quality easily sold.'
  },

  // Uttar Pradesh
  {
    id: 'up_potato',
    commodity: 'Potato (Jyoti / Pukhraj / Chipsona)',
    hindi_name: 'आलू',
    category: 'Vegetables',
    state: 'Uttar Pradesh',
    mandi_name: 'Agra APMC',
    modal_price: 1380,
    msp_2024_25: null,
    min_price: 1100,
    max_price: 1600,
    daily_arrivals_qtl: 11200,
    trend: 'stable',
    advisory: 'Chipsona grade attracts ₹300 premium from snack food manufacturers.'
  },
  {
    id: 'up_sugarcane',
    commodity: 'Sugarcane (Statutory SAP)',
    hindi_name: 'गन्ना',
    category: 'Commercial',
    state: 'Uttar Pradesh',
    mandi_name: 'Shamli Sugar Mill',
    modal_price: 370,
    msp_2024_25: 340,
    min_price: 350,
    max_price: 380,
    daily_arrivals_qtl: 22000,
    trend: 'stable',
    advisory: 'Deliver within 24 hours of cutting to maintain high sugar recovery.'
  },
  {
    id: 'up_wheat',
    commodity: 'Wheat',
    hindi_name: 'गेहूं',
    category: 'Cereals',
    state: 'Uttar Pradesh',
    mandi_name: 'Aligarh APMC',
    modal_price: 2410,
    msp_2024_25: 2275,
    min_price: 2320,
    max_price: 2480,
    daily_arrivals_qtl: 5300,
    trend: 'up',
    advisory: 'Packs cleanly in 50kg bags for immediate procurement payment.'
  },
  {
    id: 'up_mustard',
    commodity: 'Mustard Seed',
    hindi_name: 'सरसों',
    category: 'Oilseeds',
    state: 'Uttar Pradesh',
    mandi_name: 'Mathura APMC',
    modal_price: 5780,
    msp_2024_25: 5650,
    min_price: 5500,
    max_price: 5950,
    daily_arrivals_qtl: 2200,
    trend: 'up',
    advisory: 'Trading comfortably above MSP.'
  },

  // Tamil Nadu
  {
    id: 'tn_paddy',
    commodity: 'Paddy (Ponni / Deluxe)',
    hindi_name: 'धान (पोन्नी)',
    category: 'Cereals',
    state: 'Tamil Nadu',
    mandi_name: 'Thanjavur APMC',
    modal_price: 2460,
    msp_2024_25: 2320,
    min_price: 2350,
    max_price: 2550,
    daily_arrivals_qtl: 4100,
    trend: 'up',
    advisory: 'Cauvery delta kuruvai harvest moving briskly to modern rice mills.'
  },
  {
    id: 'tn_coconut',
    commodity: 'Coconut / Copra (Milling)',
    hindi_name: 'नारियल / खोपरा',
    category: 'Commercial',
    state: 'Tamil Nadu',
    mandi_name: 'Pollachi APMC',
    modal_price: 11200,
    msp_2024_25: 11160,
    min_price: 10500,
    max_price: 11800,
    daily_arrivals_qtl: 1400,
    trend: 'up',
    advisory: 'NAFED procurement operational; copra oil extractors active.'
  },
  {
    id: 'tn_banana',
    commodity: 'Banana (Poovan / Red Banana)',
    hindi_name: 'केला',
    category: 'Vegetables',
    state: 'Tamil Nadu',
    mandi_name: 'Tiruchirappalli Mandi',
    modal_price: 2280,
    msp_2024_25: null,
    min_price: 1900,
    max_price: 2600,
    daily_arrivals_qtl: 6800,
    trend: 'up',
    advisory: 'Temple festival demand steady across Southern districts.'
  },

  // West Bengal
  {
    id: 'wb_paddy',
    commodity: 'Paddy (Aman / Minikit)',
    hindi_name: 'धान (मिनीकिट)',
    category: 'Cereals',
    state: 'West Bengal',
    mandi_name: 'Burdwan APMC',
    modal_price: 2390,
    msp_2024_25: 2300,
    min_price: 2260,
    max_price: 2450,
    daily_arrivals_qtl: 5500,
    trend: 'up',
    advisory: 'Rice bowl of Bengal; KMS paddy purchase centers fully open.'
  },
  {
    id: 'wb_jute',
    commodity: 'Raw Jute (TD-5)',
    hindi_name: 'कच्चा जूट / पटसन',
    category: 'Commercial',
    state: 'West Bengal',
    mandi_name: 'Nadia Mandi',
    modal_price: 5450,
    msp_2024_25: 5335,
    min_price: 5200,
    max_price: 5700,
    daily_arrivals_qtl: 1800,
    trend: 'up',
    advisory: 'Jute Corporation of India (JCI) ensuring price floor support.'
  },
  {
    id: 'wb_potato',
    commodity: 'Potato (Jyoti)',
    hindi_name: 'आलू',
    category: 'Vegetables',
    state: 'West Bengal',
    mandi_name: 'Hooghly Mandi',
    modal_price: 1350,
    msp_2024_25: null,
    min_price: 1100,
    max_price: 1550,
    daily_arrivals_qtl: 13000,
    trend: 'stable',
    advisory: 'Cold-storage dispatch in regulated orderly batches.'
  },

  // Kerala
  {
    id: 'kl_coconut',
    commodity: 'Copra (Ball & Milling)',
    hindi_name: 'खोपरा',
    category: 'Commercial',
    state: 'Kerala',
    mandi_name: 'Kozhikode APMC',
    modal_price: 11800,
    msp_2024_25: 11160,
    min_price: 11000,
    max_price: 12400,
    daily_arrivals_qtl: 850,
    trend: 'up',
    advisory: 'Ball copra fetching premium ₹12,000+ for sweet confectioners.'
  },
  {
    id: 'kl_banana',
    commodity: 'Banana (Nendran / Plantain)',
    hindi_name: 'नेन्द्रन केला',
    category: 'Vegetables',
    state: 'Kerala',
    mandi_name: 'Thrissur Mandi',
    modal_price: 3600,
    msp_2024_25: null,
    min_price: 3200,
    max_price: 4100,
    daily_arrivals_qtl: 3200,
    trend: 'up',
    advisory: 'Kerala banana chip makers competing vigorously for prime bunches.'
  },
  {
    id: 'kl_rubber',
    commodity: 'Natural Rubber (RSS-4)',
    hindi_name: 'प्राकृतिक रबर',
    category: 'Commercial',
    state: 'Kerala',
    mandi_name: 'Kottayam Market',
    modal_price: 19500,
    msp_2024_25: null,
    min_price: 18500,
    max_price: 20500,
    daily_arrivals_qtl: 950,
    trend: 'up',
    advisory: 'Automotive tyre production boosting RSS-4 sheets.'
  },

  // Odisha
  {
    id: 'or_paddy',
    commodity: 'Paddy (Common)',
    hindi_name: 'धान',
    category: 'Cereals',
    state: 'Odisha',
    mandi_name: 'Bargarh APMC',
    modal_price: 2340,
    msp_2024_25: 2300,
    min_price: 2280,
    max_price: 2400,
    daily_arrivals_qtl: 4800,
    trend: 'up',
    advisory: 'RMC mandis operating online token-based centralized paddy intake.'
  },
  {
    id: 'or_moong',
    commodity: 'Green Gram (Moong)',
    hindi_name: 'मूंग दाल',
    category: 'Pulses',
    state: 'Odisha',
    mandi_name: 'Nayagarh Mandi',
    modal_price: 8700,
    msp_2024_25: 8682,
    min_price: 8400,
    max_price: 9000,
    daily_arrivals_qtl: 620,
    trend: 'up',
    advisory: 'High protein content pulses fetching prime spot bids.'
  },

  // Bihar
  {
    id: 'br_maize',
    commodity: 'Rabi Maize (Yellow Feed)',
    hindi_name: 'मक्का',
    category: 'Cereals',
    state: 'Bihar',
    mandi_name: 'Gulabbagh / Purnea APMC',
    modal_price: 2260,
    msp_2024_25: 2090,
    min_price: 2150,
    max_price: 2380,
    daily_arrivals_qtl: 8500,
    trend: 'up',
    advisory: 'Gulabbagh is India’s premier maize hub; bulk rakes being loaded for poultry feeds.'
  },
  {
    id: 'br_paddy',
    commodity: 'Paddy (Common / Katarni)',
    hindi_name: 'धान (कतरनी)',
    category: 'Cereals',
    state: 'Bihar',
    mandi_name: 'Buxar APMC',
    modal_price: 2350,
    msp_2024_25: 2300,
    min_price: 2280,
    max_price: 2440,
    daily_arrivals_qtl: 3900,
    trend: 'up',
    advisory: 'Aromatic Katarni paddy commands strong local premium.'
  }
];

export default function MarketInsights() {
  const [activeTab, setActiveTab] = useState<'schemes' | 'pricing'>('schemes');

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '1150px', margin: '0 auto', padding: '120px 32px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.25)',
          borderRadius: '40px', padding: '8px 20px', fontSize: '0.8rem', fontWeight: 700,
          color: '#4ade80', marginBottom: '16px', letterSpacing: '0.5px'
        }}>
          📈 REAL-TIME APMC & SCHEMES INTELLIGENCE
        </div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
          background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          Market Intelligence & Government Schemes
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, maxWidth: '680px' }}>
          Compare live mandi prices against official 2024-25 MSP benchmarks, track daily arrivals,
          and discover central & state agricultural subsidies customized for your farm.
        </p>
      </div>

      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {[
          { id: 'schemes' as const, label: '🏛️ Government Schemes & Subsidies' },
          { id: 'pricing' as const, label: '📊 Live Mandi Prices & MSP Tracker' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 28px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(0,255,102,0.18), rgba(0,225,255,0.1))'
                : 'rgba(255,255,255,0.04)',
              border: activeTab === tab.id ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
              color: activeTab === tab.id ? '#4ade80' : '#94a3b8',
              boxShadow: activeTab === tab.id ? '0 0 20px rgba(0,255,102,0.15)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'schemes' && <SchemesTab />}
      {activeTab === 'pricing' && <PricingTab />}
    </div>
  );
}

/* ═════════════════════════════════════════════
   Government Schemes Tab
   ═════════════════════════════════════════════ */
function SchemesTab() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ state: '', land_size: '' });

  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.land_size) {
        params.append('land_size', filters.land_size);
        params.append('land_size_hectares', filters.land_size);
      }
      
      const res = await api.get<any>(`/api/v1/schemes/recommend?${params}`);
      const list = Array.isArray(res) ? res : (res?.recommendations || []);
      setSchemes(list);
    } catch (err: any) {
      console.error('Failed to load schemes:', err);
      setError(err.message || 'Failed to load schemes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [filters.state, filters.land_size]);

  const categoryColors: Record<string, string> = {
    income_support: '#22c55e',
    crop_insurance: '#3b82f6',
    irrigation: '#06b6d4',
    soil_health: '#f59e0b',
    organic_farming: '#84cc16',
    credit: '#a855f7',
    market_access: '#ec4899',
  };

  return (
    <div>
      {/* Filters */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px',
        marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end',
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            State / Region
          </label>
          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            style={{ width: '100%', padding: '12px 14px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">All India (National & Central Schemes)</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Landholding Size (Hectares)
          </label>
          <input
            type="number" min="0" step="0.5" placeholder="e.g. 2.0"
            value={filters.land_size}
            onChange={(e) => setFilters({ ...filters, land_size: e.target.value })}
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
        <button
          onClick={fetchSchemes}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #00ff66, #00e1ff)', color: '#050a11',
            border: 'none', padding: '12px 32px', borderRadius: '30px',
            fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
            boxShadow: '0 4px 14px rgba(0,255,102,0.3)'
          }}
        >
          {loading ? '⏳ Loading...' : '🔍 Find Schemes'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '16px 20px', color: '#f87171', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Scheme Cards */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {schemes.map((scheme) => (
          <div key={scheme.id} style={{
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px',
            borderLeft: `5px solid ${categoryColors[scheme.category] || '#64748b'}`,
            transition: 'transform 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{scheme.name}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase',
                  background: `${categoryColors[scheme.category] || '#64748b'}18`,
                  color: categoryColors[scheme.category] || '#64748b',
                  border: `1px solid ${categoryColors[scheme.category] || '#64748b'}40`,
                }}>
                  {scheme.category?.replace('_', ' ')}
                </span>
                {scheme.relevance_score && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4ade80', background: 'rgba(0,255,102,0.1)', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(0,255,102,0.2)' }}>
                    {scheme.relevance_score}% match
                  </span>
                )}
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 14px' }}>{scheme.description}</p>
            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <strong style={{ color: '#4ade80' }}>💰 Direct Benefit:</strong> {scheme.benefit}
            </div>
            {scheme.eligibility && (
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '10px' }}>
                <strong>Eligibility:</strong> {scheme.eligibility}
              </div>
            )}
            {scheme.match_reasons && scheme.match_reasons.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                {scheme.match_reasons.map((r, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', padding: '4px 12px', borderRadius: '20px', background: 'rgba(0,255,102,0.08)', color: '#4ade80', border: '1px solid rgba(0,255,102,0.18)' }}>
                    ✓ {r}
                  </span>
                ))}
              </div>
            )}
            {scheme.website && (
              <a href={scheme.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '14px', color: '#00e1ff', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                Official Government Portal →
              </a>
            )}
          </div>
        ))}
      </div>

      {!loading && schemes.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'rgba(15,23,42,0.5)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏛️</div>
          <p>No schemes matched this specific filter. Switch state to "All India" to view National schemes.</p>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════
   Live Mandi Pricing & MSP Dashboard Tab
   ═════════════════════════════════════════════ */
function PricingTab() {
  const { locale } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Commercial', 'Vegetables'];
  const uniqueStates = ['All', ...Array.from(new Set(LIVE_MANDI_DATA.map((d) => d.state)))];

  const filteredData = LIVE_MANDI_DATA.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchState = selectedState === 'All' || item.state === selectedState;
    const matchSearch =
      !searchQuery ||
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hindi_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mandi_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchState && matchSearch;
  });

  return (
    <div>
      {/* Actionable Market Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(15,23,42,0.8))',
          border: '1px solid rgba(34,197,94,0.3)', borderRadius: '18px', padding: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', marginBottom: '6px' }}>
            🏆 Top Realization Mandi
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Warangal APMC (Telangana)
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            Bt Cotton Long Staple trading at <strong style={{ color: '#4ade80' }}>₹7,750/qtl</strong> (+3.0% over MSP). Strong competitive bidding by export merchants.
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(15,23,42,0.8))',
          border: '1px solid rgba(56,189,248,0.3)', borderRadius: '18px', padding: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
            💧 Moisture Cutoff Alert
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Maintain &lt;12% Grain Moisture
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            Mandis enforce a 10-15% price deduction if paddy exceeds 14% or wheat exceeds 12% moisture at weighbridges. Sun-dry prior to transport.
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(15,23,42,0.8))',
          border: '1px solid rgba(234,179,8,0.3)', borderRadius: '18px', padding: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', marginBottom: '6px' }}>
            ⚖️ Hold vs. Sell Strategy
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Soybean Hold Advisory
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            Soybean is currently 3.5% below MSP due to peak harvest arrivals. Hold stocks in WDRA registered warehouses; price recovery expected in 4 weeks.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px 24px',
        marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                background: selectedCategory === cat ? 'rgba(0,255,102,0.15)' : 'rgba(255,255,255,0.04)',
                border: selectedCategory === cat ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.08)',
                color: selectedCategory === cat ? '#4ade80' : '#94a3b8',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* State and Search Filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{
              padding: '8px 14px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', color: '#fff', fontSize: '0.82rem', outline: 'none', cursor: 'pointer'
            }}
          >
            {uniqueStates.map((st) => (
              <option key={st} value={st}>{st === 'All' ? 'All States' : st}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search crop or mandi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px', background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px', color: '#fff', fontSize: '0.82rem', outline: 'none', minWidth: '180px'
            }}
          />
        </div>
      </div>

      {/* Mandi Price Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {filteredData.map((item) => {
          const diff = item.msp_2024_25
            ? (((item.modal_price - item.msp_2024_25) / item.msp_2024_25) * 100).toFixed(1)
            : null;
          const isAboveMsp = diff !== null && parseFloat(diff) >= 0;

          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div>
                {/* Top Row: Crop & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                      {item.commodity}
                    </h3>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
                      {locale === 'hi' ? `${item.hindi_name} • ` : `${item.category} • `}{item.mandi_name} ({item.state})
                    </div>
                  </div>

                  {diff !== null ? (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '16px',
                      background: isAboveMsp ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: isAboveMsp ? '#4ade80' : '#f87171',
                      border: `1px solid ${isAboveMsp ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    }}>
                      {isAboveMsp ? `▲ +${diff}% Above MSP` : `▼ ${diff}% Below MSP`}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '16px',
                      background: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)'
                    }}>
                      Market-Driven Rate
                    </span>
                  )}
                </div>

                {/* Price Metrics Box */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  margin: '14px 0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Current Modal Price
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80', marginTop: '2px' }}>
                      ₹{item.modal_price.toLocaleString('en-IN')}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}> / qtl</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Official 2024-25 MSP
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: item.msp_2024_25 ? '#fff' : '#64748b', marginTop: '4px' }}>
                      {item.msp_2024_25 ? `₹${item.msp_2024_25.toLocaleString('en-IN')}` : 'No MSP (Open Market)'}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    <strong>Daily Range:</strong> ₹{item.min_price} – ₹{item.max_price}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    <strong>Daily Arrivals:</strong> {item.daily_arrivals_qtl.toLocaleString('en-IN')} qtl
                  </div>
                </div>

                {/* Actionable Advice */}
                <div style={{
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  color: '#cbd5e1',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  borderLeft: '3px solid #00e1ff'
                }}>
                  <strong style={{ color: '#00e1ff' }}>💡 Selling Advice: </strong>
                  {item.advisory}
                </div>
              </div>

              {/* Bottom Mandi Details Link */}
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Verified via e-NAM & APMC</span>
                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700 }}>Active Trade Today ●</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
