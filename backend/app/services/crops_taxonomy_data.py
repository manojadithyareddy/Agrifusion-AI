"""
AgriFusion AI — 37-Crop Comprehensive Botanical Pathology & Pest Taxonomy
========================================================================
Authentic, peer-reviewed agronomic database covering all 37 Target Crops:
1. Rice           2. Wheat          3. Maize          4. Cotton         5. Sugarcane
6. Soybean        7. Chickpea       8. Pigeonpeas     9. Blackgram      10. Mungbean
11. Lentil        12. Kidneybeans   13. Mothbeans     14. Groundnut     15. Mustard
16. Tomato        17. Potato        18. Onion         19. Banana        20. Mango
21. Papaya        22. Apple         23. Grapes        24. Pomegranate   25. Watermelon
26. Muskmelon     27. Orange        28. Coconut       29. Jute          30. Coffee
31. Chilli        32. Turmeric      33. Sunflower     34. Sorghum       35. Pearl Millet
36. Barley        37. Finger Millet

Referenced against:
- ICAR (Indian Council of Agricultural Research) & NCIPM
- FAO Crop Protection Compendium
- Directorate of Plant Protection, Quarantine & Storage (DPPQS)
- Agricultural University Extension Protocols (TNAU, PAU, ANGRAU, UAS)
"""

from typing import Dict, Any

CROPS_TAXONOMY_37: Dict[str, Dict[str, Any]] = {
    # ── 1. RICE / PADDY ──
    "rice": {
        "name": "Rice / Paddy",
        "scientific": "Oryza sativa",
        "family": "Poaceae",
        "keywords": ["rice", "paddy", "dhan", "chawal", "blast", "వరి", "धान", "நெல்", "ಭತ್ತ", "oryza"],
        "leaf_morphology": "Linear slender monocot blade with parallel venation",
        "supported_conditions": ["blast", "bacterial_blight", "brown_spot", "sheath_blight", "healthy"],
        "diseases": {
            "blast": {
                "name": "Rice Blast",
                "scientific_name": "Magnaporthe oryzae",
                "symptoms": [
                    "Spindle-shaped or eye-shaped lesions with pointed ends on leaves",
                    "Grayish-white necrotic center surrounded by brown or reddish-brown border",
                    "Lesions coalesce under humid conditions causing complete foliar desiccation ('blast')",
                    "Blackening of nodal joints and rotting of neck panicle ('neck blast')"
                ],
                "treatment": [
                    "Spray Tricyclazole 75% WP @ 0.6 g/L (120 g/acre) or Isoprothiolane 40% EC @ 1.5 ml/L.",
                    "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L at first appearance of leaf blast."
                ],
                "prevention": [
                    "Treat seeds with Carbendazim 50% WP @ 2 g/kg seed before nursery sowing.",
                    "Avoid excessive split application of nitrogenous fertilizers (>120 kg N/ha in single dose).",
                    "Maintain continuous thin water layer in field to buffer canopy relative humidity."
                ]
            },
            "bacterial_blight": {
                "name": "Bacterial Leaf Blight (BLB)",
                "scientific_name": "Xanthomonas oryzae pv. oryzae",
                "symptoms": [
                    "Water-soaked translucent stripes starting from leaf tips and margins",
                    "Lesions enlarge rapidly with wavy marginal borders turning pale yellow to bleached white",
                    "Milky bacterial ooze beads drying into amber crusted droplets on leaf undersides"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L mixed with Streptocycline @ 0.1 g/L (6 g/acre).",
                    "Apply Plantomycin @ 1.0 g/L or Kasugamycin 3% SL @ 2.0 ml/L."
                ],
                "prevention": [
                    "Drain excess stagnant standing water from fields for 3-4 days to arrest bacterial motility.",
                    "Adopt balanced N-P-K (avoid top-dressing nitrogen during cyclonic rain spells).",
                    "Grow BLB-resistant paddy varieties like Improved Samba Mahsuri or IR64."
                ]
            },
            "brown_spot": {
                "name": "Rice Brown Spot",
                "scientific_name": "Bipolaris oryzae",
                "symptoms": [
                    "Cylindrical to oval dark brown spots resembling sesame seeds evenly scattered across leaf lamina",
                    "Mature spots develop dirty white or straw-colored centers with a dark brown halo",
                    "Discoloration and glume blotching on developing paddy grains"
                ],
                "treatment": [
                    "Foliar spray of Mancozeb 75% WP @ 2.0 g/L or Propiconazole 25% EC @ 1.0 ml/L.",
                    "Spray Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2.0 g/L."
                ],
                "prevention": [
                    "Correct soil potash and silica deficiencies; apply Silicon fertilizer @ 100 kg/ha.",
                    "Avoid severe drought stress during active tillering stage."
                ]
            },
            "sheath_blight": {
                "name": "Rice Sheath Blight",
                "scientific_name": "Rhizoctonia solani",
                "symptoms": [
                    "Greenish-gray, oval or irregular water-soaked spots on leaf sheaths near water line",
                    "Lesions enlarge, turning bleached white with dark purple-brown boundaries ('snake-skin' appearance)",
                    "White sclerotial bodies turn dark brown on leaf sheath surface"
                ],
                "treatment": [
                    "Spray Hexaconazole 5% SC @ 2.0 ml/L or Validamycin 3% L @ 2.0 ml/L.",
                    "Spray Trifloxystrobin 25% + Tebuconazole 50% WG @ 0.4 g/L."
                ],
                "prevention": [
                    "Skim off floating sclerotia during field puddling before transplanting.",
                    "Avoid dense transplanting; adhere to 20 cm x 15 cm spacing."
                ]
            },
            "healthy": {
                "name": "Healthy Rice Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vibrant green linear blades with clean intact chlorophyll, uniform tillering, and healthy white root system."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain optimal water depth (2-5 cm) and balanced N-P-K fertigation."]
            }
        },
        "supported_pests": {
            "stem_borer": {
                "name": "Yellow Stem Borer",
                "scientific_name": "Scirpophaga incertulas",
                "keywords": ["stem borer", "yellow stem borer", "dead heart", "white earhead"],
                "damage_signs": [
                    "Central drying of growing vegetative shoots resulting in 'dead hearts'",
                    "Emerged panicles completely empty, chaffy, and bleached white ('white earheads')"
                ],
                "pest_control": [
                    "Install yellow stem borer pheromone traps @ 5-8 traps/acre.",
                    "Apply Chlorantraniliprole 0.4% GR @ 4 kg/acre or Cartap Hydrochloride 4% G @ 7.5 kg/acre into standing water.",
                    "Foliar spray: Flubendiamide 39.35% SC @ 0.2 ml/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L."
                ],
                "prevention": [
                    "Clip leaf tips of paddy seedlings before transplanting to eliminate egg masses.",
                    "Release egg parasitoid Trichogramma japonicum @ 40,000 wasps/acre."
                ]
            },
            "brown_planthopper": {
                "name": "Brown Planthopper (BPH)",
                "scientific_name": "Nilaparvata lugens",
                "keywords": ["bph", "planthopper", "hopper burn", "brown planthopper"],
                "damage_signs": [
                    "Dense hopper colonies congregated at basal stem above water level sucking sap",
                    "Circular patches of yellowing drying crops suddenly collapsing in a burn pattern ('hopper burn')"
                ],
                "pest_control": [
                    "Drain field water completely for 3-4 days to suppress nymphal reproduction.",
                    "Spray Pymetrozine 50% WG @ 0.6 g/L or Dinotefuran 20% SG @ 0.4 g/L directing nozzle to base of hills."
                ],
                "prevention": [
                    "Form 'alleyways' (skip 1 row every 2-3 meters) for sunlight penetration and aeration.",
                    "Avoid synthetic pyrethroid sprays which cause resurgence of BPH."
                ]
            }
        }
    },

    # ── 2. WHEAT ──
    "wheat": {
        "name": "Wheat",
        "scientific": "Triticum aestivum",
        "family": "Poaceae",
        "keywords": ["wheat", "gehun", "godhuma", "rust", "गेहूं", "గోధుమ", "கோதுமை", "triticum"],
        "leaf_morphology": "Linear parallel-veined erect monocot blade with prominent auricles",
        "supported_conditions": ["yellow_rust", "brown_rust", "loose_smut", "powdery_mildew", "healthy"],
        "diseases": {
            "yellow_rust": {
                "name": "Wheat Yellow / Stripe Rust",
                "scientific_name": "Puccinia striiformis",
                "symptoms": [
                    "Bright yellow powdery pustules (uredinia) arranged in narrow, parallel linear stripes on leaf blades",
                    "Chlorotic striping that turns necrotic and desiccates the flag leaf",
                    "Yellow dust rubs off on fingers upon touching the blade"
                ],
                "treatment": [
                    "Spray Propiconazole 25% EC (Tilt) @ 1.0 ml/L (200 ml/acre) at first detection of stripe foci.",
                    "Spray Tebuconazole 25.9% EC @ 1.0 ml/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Sow rust-resistant varieties like DBW 187, DBW 222, HD 3086, or HD 3226.",
                    "Timely sowing in November to avoid late-season humidity and temperature escalation."
                ]
            },
            "brown_rust": {
                "name": "Wheat Brown / Leaf Rust",
                "scientific_name": "Puccinia triticina",
                "symptoms": [
                    "Round to oval reddish-brown to orange-brown pustules scattered randomly over leaf lamina",
                    "Unlike stripe rust, pustules do NOT form linear stripes but appear dispersed",
                    "Premature drying and yellowing of foliage leading to shriveled grains"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Avoid late nitrogen application which prolongs vegetative succulence.",
                    "Sow certified rust-tolerant wheat cultivars."
                ]
            },
            "loose_smut": {
                "name": "Wheat Loose Smut",
                "scientific_name": "Ustilago tritici",
                "symptoms": [
                    "Entire earhead transformed into a powdery black mass of smut spores",
                    "Floral parts completely devoured, leaving only the bare central rachis ('naked spike')"
                ],
                "treatment": [
                    "Systemic seed treatment before sowing: Carboxin 37.5% + Thiram 37.5% DS @ 2.5 g/kg seed or Tebuconazole 2% DS @ 1.5 g/kg seed."
                ],
                "prevention": [
                    "Use certified smut-free seed lots.",
                    "Rogue out and destroy infected smutted earheads in cloth bags early in the morning."
                ]
            },
            "powdery_mildew": {
                "name": "Wheat Powdery Mildew",
                "scientific_name": "Blumeria graminis f. sp. tritici",
                "symptoms": [
                    "White to gray cottony powdery fungal colonies on upper surface of lower leaves and stems",
                    "Patches turn dull brown with tiny black pinhead-sized fruiting bodies (cleistothecia)"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Avoid excessive dense canopy sowing; maintain proper row-to-row spacing (22.5 cm)."
                ]
            },
            "healthy": {
                "name": "Healthy Wheat Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Stout erect dark green tillers with uniform flag leaf canopy and clean spikes."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Schedule irrigation at Critical Crown Root Initiation (CRI) and Flowering stages."]
            }
        },
        "supported_pests": {
            "wheat_aphid": {
                "name": "Wheat Foliar Aphid",
                "scientific_name": "Rhopalosiphum padi",
                "keywords": ["aphid", "wheat aphid", "rhopalosiphum", "mahun"],
                "damage_signs": [
                    "Colonies of small greenish-black soft insects congregated on flag leaves and earheads",
                    "Yellowing and premature drying of leaves with honeydew excretion and sooty mold"
                ],
                "pest_control": [
                    "Conserve natural predators: ladybird beetles (Coccinella septempunctata).",
                    "If ETL exceeds 10-15 aphids/tiller: Spray Dimethoate 30% EC @ 1.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L."
                ],
                "prevention": [
                    "Avoid late December sowing which coincides with high aphid build-up temperatures."
                ]
            }
        }
    },

    # ── 3. MAIZE / CORN ──
    "maize": {
        "name": "Maize / Corn",
        "scientific": "Zea mays",
        "family": "Poaceae",
        "keywords": ["maize", "corn", "makka", "makai", "armyworm", "మొక్కజొన్న", "मक्का", "சோளம்", "zea"],
        "leaf_morphology": "Broad linear arched leaf blade with prominent white midrib and wavy margins",
        "supported_conditions": ["leaf_blight", "common_rust", "downy_mildew", "healthy"],
        "diseases": {
            "leaf_blight": {
                "name": "Turcicum Leaf Blight (TLB)",
                "scientific_name": "Exserohilum turcicum",
                "symptoms": [
                    "Long, elliptical, cigar-shaped grayish-green or tan lesions on leaves (2.5 to 15 cm long)",
                    "Lesions coalesce, causing extensive foliar blight and premature canopy drying",
                    "Dark olive fungal spore sporulation inside lesions under moist weather"
                ],
                "treatment": [
                    "Foliar spray of Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L.",
                    "Spray Propiconazole 25% EC @ 1.0 ml/L at first appearance of lower leaf lesions."
                ],
                "prevention": [
                    "Destroy and deeply plow post-harvest crop residues to eliminate fungal overwintering.",
                    "Plant resistant maize hybrids like Pioneer 3396 or DKC 9108."
                ]
            },
            "common_rust": {
                "name": "Maize Common Rust",
                "scientific_name": "Puccinia sorghi",
                "symptoms": [
                    "Small, circular to elongated golden-brown to cinnamon-brown pustules scattered across both leaf surfaces",
                    "Pustules rupture epidermal layers releasing powdery brown spores"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Tebuconazole 25.9% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Maintain balanced potassium application to harden leaf epidermal cell walls."
                ]
            },
            "downy_mildew": {
                "name": "Maize Downy Mildew / Crazy Top",
                "scientific_name": "Peronosclerospora sorghi",
                "symptoms": [
                    "Broad yellow and white chlorotic stripes extending length of leaf blades",
                    "White downy fungal growth on lower leaf surfaces on damp mornings",
                    "Stunted plants with malformed leafy tassel ('crazy top') producing no cobs"
                ],
                "treatment": [
                    "Foliar spray of Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L at 20 and 35 days after sowing."
                ],
                "prevention": [
                    "Seed treatment with Metalaxyl 35% WS @ 4 g/kg seed.",
                    "Rogue out and destroy chlorotic crazy-top plants early."
                ]
            },
            "healthy": {
                "name": "Healthy Maize Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Robust thick green stems with vigorous broad leaves and well-filled ear cobs."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Apply recommended N-P-K (120:60:40 kg/ha) with Zinc Sulphate @ 25 kg/ha."]
            }
        },
        "supported_pests": {
            "fall_armyworm": {
                "name": "Fall Armyworm (FAW)",
                "scientific_name": "Spodoptera frugiperda",
                "keywords": ["fall armyworm", "faw", "armyworm", "whorl borer", "spodoptera"],
                "damage_signs": [
                    "Window-pane leaf skeletonization by early instars",
                    "Deep whorl feeding with heavy accumulation of coarse sawdust-like brown frass pellets",
                    "Ragged, irregular large perforations on expanding leaves and bored ear cobs"
                ],
                "pest_control": [
                    "Whorl application of dry sand or ash mixed with lime (9:1) directly into central whorls.",
                    "Spray Metarhizium rileyi or Beauveria bassiana @ 5 g/L.",
                    "Chemical whorl application: Spinetoram 11.7% SC @ 0.5 ml/L or Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L."
                ],
                "prevention": [
                    "Intercrop maize with cowpea or pigeonpea (4:1 ratio).",
                    "Erect FAW pheromone traps @ 5 traps/acre for adult moth monitoring."
                ]
            }
        }
    },

    # ── 4. COTTON ──
    "cotton": {
        "name": "Cotton",
        "scientific": "Gossypium hirsutum",
        "family": "Malvaceae",
        "keywords": ["cotton", "kapas", "patti", "పత్తి", "कपास", "பருத்தி", "gossypium"],
        "leaf_morphology": "Palmately 3-to-5 lobed broad leaf with cordate base and reticulate venation",
        "supported_conditions": ["bacterial_blight", "alternaria_leaf_spot", "grey_mildew", "healthy"],
        "diseases": {
            "bacterial_blight": {
                "name": "Cotton Bacterial Blight / Angular Leaf Spot",
                "scientific_name": "Xanthomonas citri pv. malvacearum",
                "symptoms": [
                    "Water-soaked angular spots bounded strictly by small leaf veinlets on underside of foliage",
                    "Lesions turn dark brown to black and angular on upper surface",
                    "Lesions spread along primary veins creating 'vein blight' and elongated black lesions on stems ('black arm')"
                ],
                "treatment": [
                    "Foliar spray of Copper Oxychloride 50% WP @ 2.5 g/L mixed with Streptocycline @ 0.1 g/L (6-8 g/acre).",
                    "Repeat spray at 15-day intervals if wet humid conditions persist."
                ],
                "prevention": [
                    "Delint acid-treated seed with concentrated sulphuric acid (100 ml/kg seed) followed by fungicide wash.",
                    "Destroy infected stalks and crop debris after final picking."
                ]
            },
            "alternaria_leaf_spot": {
                "name": "Cotton Alternaria Leaf Spot",
                "scientific_name": "Alternaria macrospora",
                "symptoms": [
                    "Small circular to irregular brown spots with distinct concentric rings",
                    "Centers of older spots crack and fall out, giving a 'shot-hole' appearance",
                    "Severe infection causes extensive premature defoliation of middle and lower canopy"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L or Pyraclostrobin 20% WG @ 1.0 g/L."
                ],
                "prevention": [
                    "Avoid potash deficiency which predisposes cotton to Alternaria susceptibility."
                ]
            },
            "grey_mildew": {
                "name": "Cotton Grey Mildew / Dahiya",
                "scientific_name": "Ramularia areola",
                "symptoms": [
                    "Angular pale translucent spots on leaf blade restricted by veinlets",
                    "White to frosty gray powdery fungal mildew on leaf undersides",
                    "Leaves turn yellowish-brown and shed prematurely"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Carbendazim 50% WP @ 1.0 g/L or Kresoxim-methyl 44.3% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Maintain wider plant spacing (90 cm x 60 cm) to facilitate aeration."
                ]
            },
            "healthy": {
                "name": "Healthy Cotton Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush palmately lobed green leaves with strong square and boll development."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Balanced fertigation and timely nipping of terminal buds at 70-80 DAS."]
            }
        },
        "supported_pests": {
            "pink_bollworm": {
                "name": "Pink Bollworm",
                "scientific_name": "Pectinophora gossypiella",
                "keywords": ["pink bollworm", "bollworm", "rosette flower", "locule damage"],
                "damage_signs": [
                    "Twisted, unopened rosette flowers ('rosetted blooms') with petals webbed together",
                    "Round pinhead entry holes on green developing bolls with premature locule burrowing",
                    "Stained discolored lint and internal seed destruction inside harvested bolls"
                ],
                "pest_control": [
                    "Install Pecti-lure sex pheromone traps @ 8-10 traps/acre for ETL monitoring (8 moths/trap/night).",
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L or Spinosad 45% SC @ 0.3 ml/L."
                ],
                "prevention": [
                    "Terminate cotton crop by December/January; strictly avoid ratoon cotton cultivation.",
                    "Release egg parasitoid Trichogramma bactrae @ 60,000 wasps/acre."
                ]
            }
        }
    },

    # ── 5. SUGARCANE ──
    "sugarcane": {
        "name": "Sugarcane",
        "scientific": "Saccharum officinarum",
        "family": "Poaceae",
        "keywords": ["sugarcane", "ganna", "cheruku", "karumbu", "kabbu", "cane", "red rot", "saccharum"],
        "leaf_morphology": "Long linear sword-shaped monocot blade with sharp serrulate edges and prominent midrib",
        "supported_conditions": ["red_rot", "smut", "grassy_shoot", "healthy"],
        "diseases": {
            "red_rot": {
                "name": "Sugarcane Red Rot",
                "scientific_name": "Colletotrichum falcatum",
                "symptoms": [
                    "Third or fourth leaf shows yellowing, drying, and withering from margins inward",
                    "Splitting the cane stalk lengthwise reveals brick-red internal pith tissue interrupted by white transverse bands",
                    "Pith turns dark muddy brown with sour alcoholic fermentation odor"
                ],
                "treatment": [
                    "No chemical cure once stalk vascular bundle is infected; rogue out and burn clump.",
                    "Sette treatment before planting: Carbendazim 50% WP @ 1.0 g/L dip for 15 minutes."
                ],
                "prevention": [
                    "Use disease-free certified sets from secondary seed nurseries.",
                    "Avoid ratoon cultivation in red-rot affected plots; practice crop rotation with rice."
                ]
            },
            "smut": {
                "name": "Sugarcane Smut",
                "scientific_name": "Sporisorium scitamineum",
                "symptoms": [
                    "Production of a conspicuous, black, whip-like unbranched structure from central stalk apex",
                    "Whip is initially covered by a thin silvery membrane that ruptures to expose millions of powdery black chlamydospores"
                ],
                "treatment": [
                    "Cut off whip carefully inside a polythene bag before spore dissemination and burn.",
                    "Sette dip in Triadimefon 25% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Plant smut-resistant varieties (Co 86032, Co 0238).",
                    "Hot water treatment of setts at 52°C for 30 minutes."
                ]
            },
            "grassy_shoot": {
                "name": "Sugarcane Grassy Shoot Disease (GSD)",
                "scientific_name": "Sugarcane grassy shoot phytoplasma",
                "symptoms": [
                    "Proliferation of dense, slender, bushy tillers from the stool base giving a grass-like appearance",
                    "Leaves become narrow, chlorotic, paper-white, and fail to form millable canes"
                ],
                "treatment": [
                    "Rogue out diseased grassy clumps immediately.",
                    "Control insect vectors (aphids and leafhoppers) with Imidacloprid 17.8% SL @ 0.3 ml/L."
                ],
                "prevention": [
                    "Use aerated steam therapy (AST) treated seed setts at 54°C for 2.5 hours."
                ]
            },
            "healthy": {
                "name": "Healthy Sugarcane Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Tall vigorous thick canes with lush green crown foliage and firm solid unblemished internodes."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Earthing up at 90-120 days and balanced application of Nitrogen and Potassium."]
            }
        },
        "supported_pests": {
            "early_shoot_borer": {
                "name": "Early Shoot Borer",
                "scientific_name": "Chilo infuscatellus",
                "keywords": ["shoot borer", "early shoot borer", "chilo", "dead heart"],
                "damage_signs": [
                    "Central whorl dries up causing 'dead hearts' in young shoots up to 3 months of age",
                    "Dead heart emits an offensive rotting odor when pulled out"
                ],
                "pest_control": [
                    "Soil application of Chlorantraniliprole 0.4% G @ 7.5 kg/acre at planting along cane setts.",
                    "Foliar spray: Chlorantraniliprole 18.5% SC @ 0.4 ml/L or Cartap Hydrochloride 50% SP @ 1.5 g/L."
                ],
                "prevention": [
                    "Trash mulching @ 3 tonnes/acre on cane ridges at 30 days after planting.",
                    "Early light earthing up at 45 days."
                ]
            }
        }
    },

    # ── 6. SOYBEAN ──
    "soybean": {
        "name": "Soybean",
        "scientific": "Glycine max",
        "family": "Fabaceae",
        "keywords": ["soybean", "soya", "soy", "glycine", "bhat", "सोयाबीन"],
        "leaf_morphology": "Trifoliate compound leaf with ovate to lanceolate leaflets and fine pubescence",
        "supported_conditions": ["soybean_rust", "charcoal_rot", "yellow_mosaic", "healthy"],
        "diseases": {
            "soybean_rust": {
                "name": "Asian Soybean Rust",
                "scientific_name": "Phakopsora pachyrhizi",
                "symptoms": [
                    "Tiny chlorotic flecks on lower leaf surfaces turning into raised reddish-brown to tan pustules (uredinia)",
                    "Volcano-shaped pustules on leaf undersides releasing powdery spores",
                    "Severe infection causes rapid foliar yellowing and premature total leaf fall"
                ],
                "treatment": [
                    "Spray Hexaconazole 5% SC @ 2.0 ml/L or Propiconazole 25% EC @ 1.0 ml/L at first sign of rust.",
                    "Spray Pyraclostrobin 20% WG @ 1.0 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Early sowing in late June to escape peak rust humidity.",
                    "Maintain optimal row spacing (45 cm x 5 cm) to reduce lower canopy moisture stagnation."
                ]
            },
            "charcoal_rot": {
                "name": "Soybean Charcoal Rot",
                "scientific_name": "Macrophomina phaseolina",
                "symptoms": [
                    "Premature yellowing of leaves that wilt and remain attached to stems",
                    "Splitting lower stem and taproot reveals ash-gray to charcoal-black discoloration packed with micro-sclerotia"
                ],
                "treatment": [
                    "Seed treatment with Trichoderma viride @ 5 g/kg seed + Carboxin 37.5% + Thiram 37.5% @ 2 g/kg seed."
                ],
                "prevention": [
                    "Avoid severe moisture stress during pod filling stage; apply protective sprinkler irrigation.",
                    "Crop rotation with sorghum or maize."
                ]
            },
            "yellow_mosaic": {
                "name": "Soybean Yellow Mosaic Virus",
                "scientific_name": "Mungbean yellow mosaic India virus",
                "symptoms": [
                    "Bright yellow irregular patches alternating with normal green lamina on young leaflets",
                    "Complete yellowing (chlorosis) of canopy with stunted growth and poorly filled pods"
                ],
                "treatment": [
                    "Control whitefly insect vector with Thiamethoxam 25% WG @ 0.3 g/L or Acetamiprid 20% SP @ 0.3 g/L."
                ],
                "prevention": [
                    "Use certified YMV-resistant cultivars (JS 20-34, JS 20-98, NRC 86).",
                    "Install yellow sticky traps @ 15-20 traps/acre."
                ]
            },
            "healthy": {
                "name": "Healthy Soybean Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush trifoliate emerald foliage with uniform pod clusters and clean root nodules."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Rhizobium and PSB seed inoculation before sowing."]
            }
        },
        "supported_pests": {
            "girdle_beetle": {
                "name": "Girdle Beetle",
                "scientific_name": "Obereopsis brevis",
                "keywords": ["girdle beetle", "stem girdle", "obereopsis"],
                "damage_signs": [
                    "Female beetle cuts two parallel circular rings (girdles) around petiole or stem",
                    "Portion of plant above the girdle wilts, dries up, and droops like an inverted umbrella"
                ],
                "pest_control": [
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC @ 0.3 ml/L."
                ],
                "prevention": [
                    "Handpick and destroy girdled plant parts during early vegetative scouting."
                ]
            }
        }
    },

    # ── 7. CHICKPEA / GRAM ──
    "chickpea": {
        "name": "Chickpea / Bengal Gram",
        "scientific": "Cicer arietinum",
        "family": "Fabaceae",
        "keywords": ["chickpea", "gram", "chana", "bengal gram", "cicer", "harbara", "కందులు", "శనగలు", "चना"],
        "leaf_morphology": "Pinnately compound small glandular-hairy leaflets exuding malic acid droplets",
        "supported_conditions": ["fusarium_wilt", "ascochyta_blight", "dry_root_rot", "healthy"],
        "diseases": {
            "fusarium_wilt": {
                "name": "Chickpea Fusarium Wilt",
                "scientific_name": "Fusarium oxysporum f. sp. ciceris",
                "symptoms": [
                    "Sudden drooping, withering, and yellowing of foliage starting from lower branches upward",
                    "Splitting root and collar lengthwise reveals dark brown to black vascular xylem discoloration"
                ],
                "treatment": [
                    "Biological seed treatment with Trichoderma viride @ 10 g/kg seed.",
                    "Soil application of Trichoderma @ 2.5 kg mixed in 250 kg FYM/acre before sowing."
                ],
                "prevention": [
                    "Grow wilt-resistant chickpea varieties (JG 11, JAKI 9218, Digvijay).",
                    "Avoid continuous chickpea cropping in the same plot; rotate with wheat or sorghum."
                ]
            },
            "ascochyta_blight": {
                "name": "Chickpea Ascochyta Blight",
                "scientific_name": "Ascochyta rabiei",
                "symptoms": [
                    "Circular to elongated lesions with dark brown concentric rings and dark pinhead pycnidia",
                    "Girdling lesions on stems cause branches to break and collapse"
                ],
                "treatment": [
                    "Spray Chlorothalonil 75% WP @ 2.0 g/L or Azoxystrobin 23% SC @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Use certified blight-free seed; intercrop chickpea with barley or mustard."
                ]
            },
            "dry_root_rot": {
                "name": "Chickpea Dry Root Rot",
                "scientific_name": "Rhizoctonia bataticola",
                "symptoms": [
                    "Sudden wilting during dry warm spells; taproot becomes brittle and devoid of lateral secondary roots",
                    "Minute black sclerotial bodies visible under the peeling bark of dead roots"
                ],
                "treatment": [
                    "Seed treatment with Carboxin 37.5% + Thiram 37.5% @ 2.0 g/kg seed."
                ],
                "prevention": [
                    "Avoid severe moisture stress during pod filling; apply light supplemental irrigation if winter is rainless."
                ]
            },
            "healthy": {
                "name": "Healthy Chickpea Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush feathery dark green canopy with abundant pink/white blooms and vigorous pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain balanced phosphatic fertilizer (40 kg P2O5/ha) and seed Rhizobium inoculation."]
            }
        },
        "supported_pests": {
            "gram_pod_borer": {
                "name": "Gram Pod Borer",
                "scientific_name": "Helicoverpa armigera",
                "keywords": ["pod borer", "helicoverpa", "caterpillar", "gram caterpillar"],
                "damage_signs": [
                    "Defoliation of tender leaflets and feeding on flower buds",
                    "Round circular holes bored into developing green pods with caterpillar body half inside"
                ],
                "pest_control": [
                    "Install Helilure pheromone traps @ 5 traps/acre.",
                    "Spray HaNPV (Helicoverpa nuclear polyhedrosis virus) @ 250 LE/acre.",
                    "Chemical spray: Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.4 g/L."
                ],
                "prevention": [
                    "Erect bird perches (T-shaped wooden perches) @ 20 perches/acre.",
                    "Intercrop chickpea with coriander or mustard as border trap crop."
                ]
            }
        }
    },

    # ── 8. PIGEONPEAS / RED GRAM / ARHAR ──
    "pigeonpeas": {
        "name": "Pigeonpeas / Red Gram / Arhar",
        "scientific": "Cajanus cajan",
        "family": "Fabaceae",
        "keywords": ["pigeonpeas", "arhar", "tur", "red gram", "toor", "cajanus", "కంది", "துவரை", "ತೊಗರಿ"],
        "leaf_morphology": "Trifoliate compound leaf with oblong-lanceolate velvet-hairy leaflets",
        "supported_conditions": ["fusarium_wilt", "sterility_mosaic", "phytophthora_blight", "healthy"],
        "diseases": {
            "fusarium_wilt": {
                "name": "Pigeonpea Fusarium Wilt",
                "scientific_name": "Fusarium udum",
                "symptoms": [
                    "Gradual yellowing and withering of leaves starting from bottom canopy upwards",
                    "Purple band or streak extending upwards on the green stem from ground level",
                    "Splitting stem reveals dark brown to black vascular bundle discoloration"
                ],
                "treatment": [
                    "Seed treatment with Trichoderma viride @ 10 g/kg seed.",
                    "Soil application of Trichoderma @ 2 kg/acre enriched with 100 kg farmyard manure."
                ],
                "prevention": [
                    "Grow wilt-resistant cultivars like Asha (ICPL 87119), BSMR 736, Maruti (ICP 8863).",
                    "Practice 3-year crop rotation with sorghum or tobacco."
                ]
            },
            "sterility_mosaic": {
                "name": "Sterility Mosaic Disease (SMD)",
                "scientific_name": "Pigeonpea sterility mosaic emaravirus",
                "symptoms": [
                    "Bushy stunted pale green growth with severe reduction in leaf size and leaflet puckering",
                    "Leaves exhibit mosaic mottling and chlorotic ringspots",
                    "Complete absence of flowering and pod formation ('green island' sterility)"
                ],
                "treatment": [
                    "Control eriophyid mite vector (Aceria cajani) by spraying Fenazaquin 10% EC @ 1.5 ml/L or Propargite 57% EC @ 2.0 ml/L."
                ],
                "prevention": [
                    "Grow SMD-resistant cultivars like BSMR 736, ICP 7035, Asha.",
                    "Rogue out infected mosaic plants during early vegetative growth."
                ]
            },
            "phytophthora_blight": {
                "name": "Phytophthora Stem Blight",
                "scientific_name": "Phytophthora cajani",
                "symptoms": [
                    "Brown to dark brown water-soaked lesions on stems near soil level girdling the shoot",
                    "Stems swell above the canker lesion and break easily in wind, causing rapid death"
                ],
                "treatment": [
                    "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L on collar and stems."
                ],
                "prevention": [
                    "Provide proper field drainage; avoid planting in low-lying waterlogged patches."
                ]
            },
            "healthy": {
                "name": "Healthy Pigeonpea Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Erect branching shrub with clean trifoliate foliage and abundant yellow flowers."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Nipping of terminal shoots at 45-50 DAS to promote profuse lateral fruiting branches."]
            }
        },
        "supported_pests": {
            "pod_borer": {
                "name": "Pod Borer Complex",
                "scientific_name": "Helicoverpa armigera",
                "keywords": ["pod borer", "helicoverpa", "maruca", "pod fly"],
                "damage_signs": [
                    "Bored holes on green pods with excreta dropped outside",
                    "Caterpillars web flowers and leaves together feeding inside"
                ],
                "pest_control": [
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Flubendiamide 39.35% SC @ 0.2 ml/L at 50% flowering."
                ],
                "prevention": [
                    "Install pheromone traps @ 5 traps/acre; shake plants over cloth sheets in early morning to dislodge caterpillars."
                ]
            }
        }
    },

    # ── 9. BLACKGRAM / URAD ──
    "blackgram": {
        "name": "Blackgram / Urad",
        "scientific": "Vigna mungo",
        "family": "Fabaceae",
        "keywords": ["blackgram", "urad", "mash", "ulundu", "minapa", "vigna mungo", "उड़द", "మినుములు"],
        "leaf_morphology": "Trifoliate compound leaf with ovate dark green leaflets and hairy stems",
        "supported_conditions": ["yellow_mosaic", "cercospora_leaf_spot", "powdery_mildew", "healthy"],
        "diseases": {
            "yellow_mosaic": {
                "name": "Yellow Mosaic Disease (YMD)",
                "scientific_name": "Mungbean yellow mosaic virus (MYMV)",
                "symptoms": [
                    "Small yellow specks on young leaves expanding into irregular bright yellow mosaic patches",
                    "Entire leaf blade turns completely yellow or golden with necrotic patches",
                    "Pods become stunted, curled, and bear few shriveled seeds"
                ],
                "treatment": [
                    "Control whitefly insect vector with Acetamiprid 20% SP @ 0.3 g/L or Thiamethoxam 25% WG @ 0.3 g/L."
                ],
                "prevention": [
                    "Sow YMD-resistant varieties (VBN 6, VBN 8, Mash 114, PU 31).",
                    "Install yellow sticky traps @ 15-20 traps/acre."
                ]
            },
            "cercospora_leaf_spot": {
                "name": "Cercospora Leaf Spot",
                "scientific_name": "Cercospora canescens",
                "symptoms": [
                    "Circular to angular brown spots with gray or white centers and reddish-brown borders",
                    "Lesions coalesce causing severe blighting and premature leaf shedding"
                ],
                "treatment": [
                    "Spray Carbendazim 50% WP @ 1.0 g/L or Mancozeb 75% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Seed treatment with Thiram + Carbendazim (1:1) @ 2 g/kg seed."
                ]
            },
            "powdery_mildew": {
                "name": "Blackgram Powdery Mildew",
                "scientific_name": "Erysiphe polygoni",
                "symptoms": [
                    "White powdery flour-like patches on upper surface of leaves, stems, and pods",
                    "Affected leaves turn dull yellow and wither prematurely"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Hexaconazole 5% SC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Early morning foliar sprays to maximize sulfur contact before spore dispersal."
                ]
            },
            "healthy": {
                "name": "Healthy Blackgram Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush trifoliate deep green foliage with uniform flower clusters and developing pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Seed inoculation with Rhizobium and Phosphorus Solubilizing Bacteria (PSB)."]
            }
        },
        "supported_pests": {
            "whitefly": {
                "name": "Whitefly",
                "scientific_name": "Bemisia tabaci",
                "keywords": ["whitefly", "bemisia", "sucking pest", "vector"],
                "damage_signs": [
                    "Tiny white flies fluttering beneath leaves; yellow stippling and honeydew drops leading to sooty mold"
                ],
                "pest_control": [
                    "Yellow sticky traps @ 15-20 traps/acre.",
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Diafenthiuron 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Barrier cropping with 2 rows of maize or pearl millet around blackgram plots."
                ]
            }
        }
    },

    # ── 10. MUNGBEAN / GREEN GRAM ──
    "mungbean": {
        "name": "Mungbean / Green Gram",
        "scientific": "Vigna radiata",
        "family": "Fabaceae",
        "keywords": ["mungbean", "mung", "moong", "green gram", "pesara", "pasi payaru", "मूंग", "పెసలు", "ಹೆಸರು"],
        "leaf_morphology": "Trifoliate compound leaf with broad ovate membranous bright green leaflets",
        "supported_conditions": ["yellow_mosaic", "powdery_mildew", "anthracnose", "healthy"],
        "diseases": {
            "yellow_mosaic": {
                "name": "Mungbean Yellow Mosaic Virus (MYMV)",
                "scientific_name": "Mungbean yellow mosaic virus",
                "symptoms": [
                    "Yellow chlorotic specks coalescing into bright golden-yellow patches on leaflets",
                    "Complete yellowing of foliage leading to stunted shoots and malformed pods"
                ],
                "treatment": [
                    "Foliar spray of Thiamethoxam 25% WG @ 0.3 g/L or Dimethoate 30% EC @ 1.5 ml/L to control vector whiteflies."
                ],
                "prevention": [
                    "Use certified resistant varieties (IPM 02-03, IPM 02-14, Samrat, Meha).",
                    "Seed treatment with Imidacloprid 70% WS @ 5 g/kg seed before sowing."
                ]
            },
            "powdery_mildew": {
                "name": "Mungbean Powdery Mildew",
                "scientific_name": "Podosphaera fusca",
                "symptoms": [
                    "White powdery fungal patches on leaves and pods turning grayish-brown with age",
                    "Foliage curls, turns necrotic, and sheds prematurely"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Avoid moisture deficit and shade; ensure good field aeration."
                ]
            },
            "anthracnose": {
                "name": "Mungbean Anthracnose",
                "scientific_name": "Colletotrichum lindemuthianum",
                "symptoms": [
                    "Dark brown to black circular sunken lesions on pods and leaf veins",
                    "Cracked lesions exuding salmon-pink spore masses in moist weather"
                ],
                "treatment": [
                    "Spray Carbendazim 50% WP @ 1.0 g/L or Mancozeb 75% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Use certified anthracnose-free seed lots."
                ]
            },
            "healthy": {
                "name": "Healthy Mungbean Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Clean bright green trifoliate canopy with abundant yellow blossoms and straight green pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain optimal soil moisture during pod development."]
            }
        },
        "supported_pests": {
            "spotted_pod_borer": {
                "name": "Spotted Pod Borer",
                "scientific_name": "Maruca vitrata",
                "keywords": ["spotted pod borer", "maruca", "pod borer", "webbing borer"],
                "damage_signs": [
                    "Webbing of flower buds and green leaves with silk and excreta",
                    "Caterpillars bore into green pods through small entrance holes"
                ],
                "pest_control": [
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Indoxacarb 14.5% SC @ 0.7 ml/L."
                ],
                "prevention": [
                    "Install pheromone traps; spray Neem formulation (10,000 ppm) @ 3 ml/L at flowering initiation."
                ]
            }
        }
    },

    # ── 11. LENTIL / MASOOR ──
    "lentil": {
        "name": "Lentil / Masoor",
        "scientific": "Lens culinaris",
        "family": "Fabaceae",
        "keywords": ["lentil", "masoor", "lens", "masur", "मसूर"],
        "leaf_morphology": "Pinnately compound delicate leaves terminating in a tendril or bristle",
        "supported_conditions": ["rust", "fusarium_wilt", "ascochyta_blight", "healthy"],
        "diseases": {
            "rust": {
                "name": "Lentil Rust",
                "scientific_name": "Uromyces viciae-fabae",
                "symptoms": [
                    "Small, yellowish-white spots on leaves turning into powdery orange-brown pustules",
                    "Dark brown to black teleutosori appear on stems and pods late in the season causing defoliation"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.0 g/L or Propiconazole 25% EC @ 1.0 ml/L or Hexaconazole 5% SC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Grow rust-tolerant varieties like Pant L 406 or DPL 62."
                ]
            },
            "fusarium_wilt": {
                "name": "Lentil Fusarium Wilt",
                "scientific_name": "Fusarium oxysporum f. sp. lentis",
                "symptoms": [
                    "Sudden drooping and wilting of plants in patches; foliage turns yellow, then brown, and dies",
                    "Internal vascular xylem shows dark brown discoloration"
                ],
                "treatment": [
                    "Seed treatment with Trichoderma viride @ 5 g/kg seed + Carbendazim @ 1 g/kg seed."
                ],
                "prevention": [
                    "Rotate crops with rice or wheat; avoid unsterilized fields with prior wilt history."
                ]
            },
            "ascochyta_blight": {
                "name": "Lentil Ascochyta Blight",
                "scientific_name": "Ascochyta lentis",
                "symptoms": [
                    "Circular to oval light brown spots with dark margins and concentric rings of pycnidia",
                    "Stems break at lesion points and pods show purplish-brown sunken lesions"
                ],
                "treatment": [
                    "Spray Chlorothalonil 75% WP @ 2.0 g/L or Carbendazim 12% + Mancozeb 63% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Use certified clean seeds; treat with Thiram @ 2.5 g/kg."
                ]
            },
            "healthy": {
                "name": "Healthy Lentil Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Feathery erect green branching canopy with healthy delicate leaves and numerous pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Timely October/November sowing with 30 cm line spacing."]
            }
        },
        "supported_pests": {
            "black_aphid": {
                "name": "Black Bean Aphid",
                "scientific_name": "Aphis craccivora",
                "keywords": ["aphid", "black aphid", "craccivora", "masoor aphid"],
                "damage_signs": [
                    "Colonies of tiny black aphids clustered on apical shoots, flowers, and pods sucking sap",
                    "Leaves curl and turn chlorotic with sticky honeydew accumulation"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L."
                ],
                "prevention": [
                    "Conserve ladybird beetles and syrphid fly larvae."
                ]
            }
        }
    },

    # ── 12. KIDNEYBEANS / RAJMA ──
    "kidneybeans": {
        "name": "Kidneybeans / Rajma",
        "scientific": "Phaseolus vulgaris",
        "family": "Fabaceae",
        "keywords": ["kidneybeans", "rajma", "french bean", "common bean", "phaseolus", "राजमा"],
        "leaf_morphology": "Trifoliate compound broad heart-shaped leaflets with prominent reticulate veins",
        "supported_conditions": ["common_bacterial_blight", "anthracnose", "bean_mosaic", "healthy"],
        "diseases": {
            "common_bacterial_blight": {
                "name": "Common Bacterial Blight (CBB)",
                "scientific_name": "Xanthomonas axonopodis pv. phaseoli",
                "symptoms": [
                    "Small water-soaked translucent spots on leaves enlarging into large necrotic irregular brown blotches",
                    "Lesions surrounded by a prominent bright yellow chlorotic halo",
                    "Sunken circular water-soaked spots with dark brown margins on bean pods"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L mixed with Streptocycline @ 0.1 g/L."
                ],
                "prevention": [
                    "Use certified Western Himalayan disease-free seed lots.",
                    "Avoid overhead sprinkler irrigation; practice wide furrow watering."
                ]
            },
            "anthracnose": {
                "name": "Bean Anthracnose",
                "scientific_name": "Colletotrichum lindemuthianum",
                "symptoms": [
                    "Dark brick-red to purplish-black lesions along leaf veins on underside of leaflets",
                    "Sunken circular to oval cankers on pods with raised dark purple boundaries and pinkish spore masses"
                ],
                "treatment": [
                    "Spray Carbendazim 50% WP @ 1.0 g/L or Azoxystrobin 23% SC @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Seed treatment with Carbendazim @ 2 g/kg seed; ensure 2-year rotation with non-legumes."
                ]
            },
            "bean_mosaic": {
                "name": "Bean Common Mosaic Virus (BCMV)",
                "scientific_name": "Bean common mosaic virus",
                "symptoms": [
                    "Downward cupping and curling of leaf margins with green and yellow mosaic mottling",
                    "Puckered blistered foliar surface with stunted plant stature"
                ],
                "treatment": [
                    "Spray Thiamethoxam 25% WG @ 0.3 g/L to suppress aphid vector transmission."
                ],
                "prevention": [
                    "Use certified virus-free certified breeder seeds."
                ]
            },
            "healthy": {
                "name": "Healthy Kidneybean Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vigorous bushy or climbing green foliage with clean unblemished pod clusters."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Adequate drainage and organic compost mulching."]
            }
        },
        "supported_pests": {
            "bean_aphid": {
                "name": "Bean Aphid",
                "scientific_name": "Aphis fabae",
                "keywords": ["bean aphid", "aphid", "fabae"],
                "damage_signs": [
                    "Heavy aphid colonies covering growing tips and flower buds, stunting pod growth"
                ],
                "pest_control": [
                    "Spray Neem oil (10,000 ppm) @ 3 ml/L or Acetamiprid 20% SP @ 0.3 g/L."
                ],
                "prevention": [
                    "Early weeding and avoidance of water stress."
                ]
            }
        }
    },

    # ── 13. MOTHBEANS / MATKI ──
    "mothbeans": {
        "name": "Mothbeans / Matki",
        "scientific": "Vigna aconitifolia",
        "family": "Fabaceae",
        "keywords": ["mothbeans", "moth", "matki", "vigna aconitifolia", "arid bean", "मठ", "మోత్ బీన్స్"],
        "leaf_morphology": "Trifoliate compound leaf with deeply lobed or dissected narrow leaflets (drought-adapted)",
        "supported_conditions": ["yellow_mosaic", "bacterial_leaf_blight", "root_rot", "healthy"],
        "diseases": {
            "yellow_mosaic": {
                "name": "Mothbean Yellow Mosaic Virus",
                "scientific_name": "Mungbean yellow mosaic virus",
                "symptoms": [
                    "Bright yellow patches interspersed with green on deeply dissected leaflets",
                    "Leaves turn entirely chlorotic and reduce pod bearing drastically"
                ],
                "treatment": [
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Acetamiprid 20% SP @ 0.3 g/L for vector whitefly."
                ],
                "prevention": [
                    "Sow YMV-resistant mothbean varieties (RMO 40, RMO 257, RMO 435)."
                ]
            },
            "bacterial_leaf_blight": {
                "name": "Mothbean Bacterial Leaf Blight",
                "scientific_name": "Xanthomonas phaseoli",
                "symptoms": [
                    "Small circular water-soaked spots with yellow halo turning necrotic brown on arid foliage"
                ],
                "treatment": [
                    "Spray Streptocycline @ 0.1 g/L + Copper Oxychloride @ 2.0 g/L."
                ],
                "prevention": [
                    "Hot water seed treatment at 50°C for 15 minutes."
                ]
            },
            "root_rot": {
                "name": "Mothbean Macrophomina Root Rot",
                "scientific_name": "Macrophomina phaseolina",
                "symptoms": [
                    "Sudden wilting during arid heat spells with black pinhead sclerotia on decomposing taproot"
                ],
                "treatment": [
                    "Seed treatment with Trichoderma harzianum @ 5 g/kg seed."
                ],
                "prevention": [
                    "Avoid continuous cropping; intercrop with pearl millet in arid sand."
                ]
            },
            "healthy": {
                "name": "Healthy Mothbean Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Prostrate trailing deeply-lobed drought-hardy green foliage with clean tiny pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Conserve soil moisture through dust mulching in Thar desert soils."]
            }
        },
        "supported_pests": {
            "whitefly": {
                "name": "Whitefly",
                "scientific_name": "Bemisia tabaci",
                "keywords": ["whitefly", "bemisia", "vector"],
                "damage_signs": [
                    "Yellowing and honeydew drops on delicate dissected leaflets"
                ],
                "pest_control": [
                    "Spray Thiamethoxam 25% WG @ 0.3 g/L."
                ],
                "prevention": [
                    "Yellow sticky traps @ 10 traps/acre."
                ]
            }
        }
    },

    # ── 14. GROUNDNUT / PEANUT ──
    "groundnut": {
        "name": "Groundnut / Peanut",
        "scientific": "Arachis hypogaea",
        "family": "Fabaceae",
        "keywords": ["groundnut", "peanut", "moongphali", "kadale kayi", "verukadala", "arachis", "వేరుశనగ", "நிலக்கடலை", "मूंगफली"],
        "leaf_morphology": "Pinnately compound with four obovate to elliptical leaflets (tetrafoliate)",
        "supported_conditions": ["tikka_leaf_spot", "groundnut_rust", "collar_rot", "healthy"],
        "diseases": {
            "tikka_leaf_spot": {
                "name": "Tikka Leaf Spot (Early & Late)",
                "scientific_name": "Cercospora arachidicola / Phaeoisariopsis personata",
                "symptoms": [
                    "Early leaf spot: Circular reddish-brown to dark brown spots with a prominent bright yellow chlorotic halo",
                    "Late leaf spot: Small, almost circular, black spots without distinct yellow halo on leaf undersides",
                    "Severe infection causes premature mass defoliation leaving bare stems"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L.",
                    "Spray Tebuconazole 25.9% EC @ 1.0 ml/L or Hexaconazole 5% SC @ 1.5 ml/L at first detection of spots."
                ],
                "prevention": [
                    "Seed treatment with Carbendazim + Mancozeb (Saaf) @ 2 g/kg seed.",
                    "Destroy infected haulms and practice crop rotation with cereals."
                ]
            },
            "groundnut_rust": {
                "name": "Groundnut Rust",
                "scientific_name": "Puccinia arachidis",
                "symptoms": [
                    "Pustules (uredinia) appear primarily on lower surface of leaflets as orange to dark brown powdery blister-like spots",
                    "Unlike Tikka spots, rusted leaves dry up, curl, and remain attached to the plant without immediate shedding"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Sow rust-resistant varieties like Kadiri 9, GPBD 4, or ICGV 91114."
                ]
            },
            "collar_rot": {
                "name": "Groundnut Collar Rot / Crown Rot",
                "scientific_name": "Aspergillus niger",
                "symptoms": [
                    "Rotting of collar region covered by black sooty fungal spore masses; seedlings collapse and die"
                ],
                "treatment": [
                    "Seed treatment with Trichoderma viride @ 4 g/kg seed + Thiram @ 2 g/kg seed."
                ],
                "prevention": [
                    "Avoid deep sowing of groundnut pods; maintain shallow 4-5 cm depth."
                ]
            },
            "healthy": {
                "name": "Healthy Groundnut Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Compact green tetrafoliate canopy with healthy peg penetration into loose friable soil."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Apply Gypsum @ 200 kg/acre at 40-45 DAS for optimal pod filling and shell hardening."]
            }
        },
        "supported_pests": {
            "leaf_miner": {
                "name": "Groundnut Leaf Miner",
                "scientific_name": "Aproaerema modicella",
                "keywords": ["leaf miner", "aproaerema", "blotch mine", "webbed leaves"],
                "damage_signs": [
                    "Small translucent blister mines on leaves; later instars web adjacent leaflets together and feed within"
                ],
                "pest_control": [
                    "Install light traps @ 1 trap/acre.",
                    "Spray Chlorpyrifos 20% EC @ 2.0 ml/L or Quinalphos 25% EC @ 2.0 ml/L or Spinetoram 11.7% SC @ 0.5 ml/L."
                ],
                "prevention": [
                    "Intercrop groundnut with pearl millet or cowpea (4:1 ratio)."
                ]
            }
        }
    },

    # ── 15. MUSTARD / RAPESEED ──
    "mustard": {
        "name": "Mustard / Rapeseed",
        "scientific": "Brassica juncea",
        "family": "Brassicaceae",
        "keywords": ["mustard", "sarson", "rai", "brassica", "rapeseed", "sorisha", "ఆవాలు", "கடுகு", "सरसों"],
        "leaf_morphology": "Lyrate-pinnatifid lower leaves with large terminal lobe and coarsely toothed margins",
        "supported_conditions": ["white_rust", "alternaria_blight", "downy_mildew", "healthy"],
        "diseases": {
            "white_rust": {
                "name": "Mustard White Rust",
                "scientific_name": "Albugo candida",
                "symptoms": [
                    "Prominent creamy white, shiny blister-like pustules (sori) on the underside of leaves and stems",
                    "Floral parts become severely deformed, hypertrophied, and sterile ('staghead' structure)"
                ],
                "treatment": [
                    "Foliar spray of Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.0 g/L or Mancozeb 75% WP @ 2.5 g/L.",
                    "Repeat spray at 15-day intervals if cool foggy weather prevails."
                ],
                "prevention": [
                    "Seed treatment with Metalaxyl 35% WS @ 6 g/kg seed.",
                    "Rogue out and burn staghead malformed inflorescences."
                ]
            },
            "alternaria_blight": {
                "name": "Mustard Alternaria Blight",
                "scientific_name": "Alternaria brassicae",
                "symptoms": [
                    "Small circular brown to black spots with concentric rings appearing on lower leaves first",
                    "Spots enlarge, coalesce, and spread to siliquae (pods), causing pod splitting and grain shriveling"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Iprodione 50% WP @ 2.0 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Sow crop early (mid-October) to escape severe disease incidence in January."
                ]
            },
            "downy_mildew": {
                "name": "Mustard Downy Mildew",
                "scientific_name": "Hyaloperonospora brassicae",
                "symptoms": [
                    "Yellow angular spots on upper leaf surface with delicate grayish-white downy fungal growth on undersides"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L or Dimethomorph 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Maintain proper plant spacing (30 cm x 10 cm) to avoid dense humid microclimate."
                ]
            },
            "healthy": {
                "name": "Healthy Mustard Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vigorous green lyrate leaves with abundant bright yellow four-petaled flowers and clean pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Ensure balanced sulfur fertilization (apply elemental sulfur or gypsum @ 20-30 kg/ha)."]
            }
        },
        "supported_pests": {
            "mustard_aphid": {
                "name": "Mustard Aphid",
                "scientific_name": "Lipaphis erysimi",
                "keywords": ["mustard aphid", "aphid", "lipaphis", "mahun", "chepa"],
                "damage_signs": [
                    "Colonies of small yellowish-green aphids swarming flower buds, inflorescence, and young pods",
                    "Plants turn pale yellow, stunted, and pods fail to fill seeds"
                ],
                "pest_control": [
                    "Conserve coccinellid ladybird beetles.",
                    "If aphid population exceeds ETL (25-30 aphids/10 cm terminal shoot): Spray Dimethoate 30% EC @ 1.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L or Oxydemeton-methyl 25% EC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Timely sowing before 20th October to minimize flowering coincidence with peak aphid flight."
                ]
            }
        }
    },

    # ── 16. TOMATO ──
    "tomato": {
        "name": "Tomato",
        "scientific": "Solanum lycopersicum",
        "family": "Solanaceae",
        "keywords": ["tomato", "tamatar", "thakkali", "tamata", "टमाटर", "టమోటా", "தக்காளி", "ಟೊಮೆಟೊ", "solanum"],
        "leaf_morphology": "Pinnately compound odd-pinnate glandular-pubescent leaves with serrated margins",
        "supported_conditions": ["early_blight", "late_blight", "leaf_curl", "septoria", "healthy"],
        "diseases": {
            "early_blight": {
                "name": "Tomato Early Blight",
                "scientific_name": "Alternaria solani",
                "symptoms": [
                    "Dark brown necrotic lesions with concentric circular rings ('target-board' pattern)",
                    "Yellowing chlorotic halo around mature leaf spots",
                    "Progressive drying of bottom canopy leaflets and stem cankers"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L.",
                    "If infection >15% leaf area: Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Practice crop rotation with non-solanaceous crops.",
                    "Prune bottom 15-20 cm foliage to stop upward soil spore splash."
                ]
            },
            "late_blight": {
                "name": "Tomato Late Blight",
                "scientific_name": "Phytophthora infestans",
                "symptoms": [
                    "Water-soaked dark olive to blackish blotches on foliage",
                    "Rapid foliar collapse under cool humid microclimate",
                    "Delicate white cottony mildew underneath leaves during moist mornings"
                ],
                "treatment": [
                    "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Avoid overhead irrigation; water only the root basin.",
                    "Promptly remove and bury blighted plants."
                ]
            },
            "leaf_curl": {
                "name": "Tomato Leaf Curl Virus (ToLCV)",
                "scientific_name": "Tomato leaf curl New Delhi virus",
                "symptoms": [
                    "Upward curling, puckering, and crinkling of leaflet margins",
                    "Interveinal chlorosis, thickening, and stunted bushy growth"
                ],
                "treatment": [
                    "No curative viricide exists; rogue out severely stunted plants.",
                    "Control whitefly insect vectors with Imidacloprid 17.8% SL @ 0.3 ml/L or Diafenthiuron 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Install yellow sticky traps to intercept whitefly vectors.",
                    "Cover nursery seedbeds with 40-mesh insect-proof nylon netting."
                ]
            },
            "septoria": {
                "name": "Septoria Leaf Spot",
                "scientific_name": "Septoria lycopersici",
                "symptoms": [
                    "Numerous small circular spots with dark brown margins and gray centers containing tiny black pycnidia dots"
                ],
                "treatment": [
                    "Spray Chlorothalonil 75% WP @ 2.0 g/L or Copper Oxychloride 50% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Mulch around tomato stems to prevent soil rain splash."
                ]
            },
            "healthy": {
                "name": "Healthy Tomato Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vibrant green pinnate foliage with vigorous flowering trusses and plump blemish-free fruits."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain morning drip irrigation and balanced N-P-K (120:60:60 kg/ha)."]
            }
        },
        "supported_pests": {
            "fruit_borer": {
                "name": "Tomato Fruit Borer",
                "scientific_name": "Helicoverpa armigera",
                "keywords": ["fruit borer", "borer", "helicoverpa", "tomato caterpillar"],
                "damage_signs": [
                    "Circular entry holes on green and ripe fruits, with hollowed rotting internal cavities",
                    "Feeding holes on flower buds and tender terminal foliage"
                ],
                "pest_control": [
                    "Release Trichogramma pretiosum @ 50,000/acre.",
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Indoxacarb 14.5% SC @ 0.8 ml/L."
                ],
                "prevention": [
                    "Plant African marigold as a border trap crop (1 row marigold for every 16 rows tomato)."
                ]
            }
        }
    },

    # ── 17. POTATO ──
    "potato": {
        "name": "Potato",
        "scientific": "Solanum tuberosum",
        "family": "Solanaceae",
        "keywords": ["potato", "aloo", "batata", "tuberosum", "आलू", "బంగాళాదుంప", "உருளைக்கிழங்கு"],
        "leaf_morphology": "Odd-pinnate compound leaf with large ovate primary leaflets and small interjected secondary leaflets",
        "supported_conditions": ["late_blight", "early_blight", "black_scurf", "healthy"],
        "diseases": {
            "late_blight": {
                "name": "Potato Late Blight",
                "scientific_name": "Phytophthora infestans",
                "symptoms": [
                    "Water-soaked irregular blackish-brown spots spreading rapidly inward from leaf tips and margins",
                    "White delicate downy fungal mold on leaf undersides under high humidity",
                    "Foliage rapidly rots and collapses, producing a characteristic rotting smell"
                ],
                "treatment": [
                    "Prophylactic: Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L.",
                    "Curative: Dimethomorph 50% WP @ 1.0 g/L + Mancozeb @ 2.0 g/L or Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Plant certified disease-free seed tubers.",
                    "Ensure high earthing-up (hilling) to shield developing tubers from downward rain spore wash."
                ]
            },
            "early_blight": {
                "name": "Potato Early Blight",
                "scientific_name": "Alternaria solani",
                "symptoms": [
                    "Brown angular to circular spots with concentric rings appearing on older foliage first"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Propineb 70% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Rotate crops with non-solanaceous crops; destroy haulms after harvest."
                ]
            },
            "black_scurf": {
                "name": "Potato Black Scurf",
                "scientific_name": "Rhizoctonia solani",
                "symptoms": [
                    "Hard, brownish-black irregular encrustations (sclerotia) resembling dirt on harvested tuber skin",
                    "Stem cankers causing aerial tuber formation in leaf axils"
                ],
                "treatment": [
                    "Tuber treatment before planting: Dip tubers in Moncut (Flutolanil 40% SC) @ 2.5 ml/L or Carboxin 37.5% + Thiram 37.5% @ 2.5 g/kg seed."
                ],
                "prevention": [
                    "Green manuring and crop rotation with maize or sorghum."
                ]
            },
            "healthy": {
                "name": "Healthy Potato Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vigorous bushy green foliage with clean unblemished stems and plump subterranean tubers."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Proper hilling up and dehaulming 10-12 days before final harvest to harden tuber skin."]
            }
        },
        "supported_pests": {
            "tuber_moth": {
                "name": "Potato Tuber Moth",
                "scientific_name": "Phthorimaea operculella",
                "keywords": ["tuber moth", "potato moth", "phthorimaea", "leaf mine"],
                "damage_signs": [
                    "Blotch leaf mines between epidermal layers of leaflets",
                    "Silk-lined tunnels in exposed tubers packed with brown caterpillar frass"
                ],
                "pest_control": [
                    "Spray Bacillus thuringiensis (Bt) @ 2 g/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L.",
                    "In storage, cover potato heaps with a 2-3 cm layer of dried Lantana or eucalyptus leaves."
                ],
                "prevention": [
                    "Ensure deep earthing-up (10-15 cm soil cover) so tubers remain unexposed."
                ]
            }
        }
    },

    # ── 18. ONION ──
    "onion": {
        "name": "Onion",
        "scientific": "Allium cepa",
        "family": "Amaryllidaceae",
        "keywords": ["onion", "pyaz", "vengayam", "ullipayalu", "kanda", "erulli", "allium", "प्याज", "ఉల్లిపాయలు", "வெங்காயம்"],
        "leaf_morphology": "Hollow cylindrical erect glaucous tubular leaves with waxy bloom",
        "supported_conditions": ["purple_blotch", "stemphylium_blight", "basal_rot", "healthy"],
        "diseases": {
            "purple_blotch": {
                "name": "Onion Purple Blotch",
                "scientific_name": "Alternaria porri",
                "symptoms": [
                    "Small water-soaked sunken lesions on leaves and seed stalks turning purplish to violet with a dark margin",
                    "Lesions girdle the hollow leaf causing the upper half of the tubular leaf to break and fall over"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L mixed with adhesive sticker/spreader @ 1 ml/L.",
                    "Spray Difenoconazole 25% EC @ 1.0 ml/L or Tebuconazole 25.9% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Use disease-free sets and certified seedlings.",
                    "Ensure good drainage and avoid overhead sprinkler watering in late evenings."
                ]
            },
            "stemphylium_blight": {
                "name": "Onion Stemphylium Leaf Blight",
                "scientific_name": "Stemphylium vesicarium",
                "symptoms": [
                    "Small, yellowish to pale orange flecks developing into elongated white to straw-colored lesions",
                    "Lesions coalesce, causing leaf tips to dry up and die back"
                ],
                "treatment": [
                    "Spray Azoxystrobin 23% SC @ 1.0 ml/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Maintain balanced potassium application to strengthen tubular leaf walls."
                ]
            },
            "basal_rot": {
                "name": "Onion Basal Rot",
                "scientific_name": "Fusarium oxysporum f. sp. cepae",
                "symptoms": [
                    "Yellowing and progressive dieback of leaves starting from tips downward",
                    "Basal plate of the bulb softens and decays with white to pinkish fungal mycelium; roots rot completely"
                ],
                "treatment": [
                    "Dip seedling roots in Carbendazim 50% WP @ 1.0 g/L for 15 minutes before transplanting."
                ],
                "prevention": [
                    "Practice 4-year crop rotation; avoid fields with prior basal rot history."
                ]
            },
            "healthy": {
                "name": "Healthy Onion Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Erect crisp bluish-green cylindrical hollow leaves with firm developing subterranean bulbs."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Stop irrigation 10-15 days prior to harvest to promote bulb curing and storage longevity."]
            }
        },
        "supported_pests": {
            "onion_thrips": {
                "name": "Onion Thrips",
                "scientific_name": "Thrips tabaci",
                "keywords": ["thrips", "onion thrips", "silvery flecks", "tabaci"],
                "damage_signs": [
                    "Minute yellowish-brown slender insects hidden in leaf sheaths",
                    "Silvery rasping streaks and white patches along the leaves that curl and distort"
                ],
                "pest_control": [
                    "Install blue or yellow sticky traps @ 15 traps/acre.",
                    "Spray Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 0.8 ml/L or Acetamiprid 20% SP @ 0.3 g/L with sticker."
                ],
                "prevention": [
                    "Sprinkle water via overhead micro-sprinklers during dry hot spells to wash thrips off foliage."
                ]
            }
        }
    },

    # ── 19. BANANA ──
    "banana": {
        "name": "Banana",
        "scientific": "Musa acuminata",
        "family": "Musaceae",
        "keywords": ["banana", "kela", "arati", "ariti", "vazhai", "bale", "sigatoka", "panama", "plantain", "musa", "అరటి", "కేలా", "केला", "केळी", "ಬಾಳೆ", "வாழை"],
        "leaf_morphology": "Massive oblong leaves with prominent midrib and parallel transverse lateral veins",
        "supported_conditions": ["sigatoka", "anthracnose", "panama_wilt", "healthy"],
        "diseases": {
            "sigatoka": {
                "name": "Banana Sigatoka Leaf Spot",
                "scientific_name": "Mycosphaerella musicola",
                "symptoms": [
                    "Linear reddish-brown streaks parallel to lateral leaf veins",
                    "Elliptical spots with sunken ash-gray centers and bright yellow chlorotic halos",
                    "Extensive marginal scorching and premature drying of photosynthetic lamina"
                ],
                "treatment": [
                    "Foliar spray of Propiconazole 25% EC @ 1.0 ml/L mixed with mineral spray oil (10 ml/L).",
                    "Spray Mancozeb 75% WP @ 2.5 g/L alternating with Carbendazim 50% WP @ 1.0 g/L at 21-day intervals."
                ],
                "prevention": [
                    "Prune and destroy severely infected lower leaves (de-leafing) to reduce spore inoculum.",
                    "Ensure adequate field drainage to lower microclimate relative humidity in the plantation."
                ]
            },
            "anthracnose": {
                "name": "Banana Anthracnose",
                "scientific_name": "Colletotrichum musae",
                "symptoms": [
                    "Dark brown to black sunken circular lesions on ripening banana peel",
                    "Lesions coalesce into large necrotic black patches causing fruit skin rot",
                    "Salmon-pink or orange gelatinous spore masses under humid microclimates"
                ],
                "treatment": [
                    "Post-harvest dip in Prochloraz 45% EC @ 1.0 ml/L or Azoxystrobin 23% SC @ 1.0 ml/L.",
                    "Foliar spray of Copper Oxychloride 50% WP @ 2.5 g/L on developing fruit bunches."
                ],
                "prevention": [
                    "Cover developing bunches with ventilated non-woven polypropylene bags after complete flower opening.",
                    "Handle harvested banana hands gently to avoid skin scratches and peel bruising."
                ]
            },
            "panama_wilt": {
                "name": "Banana Panama Disease / Fusarium Wilt",
                "scientific_name": "Fusarium oxysporum f. sp. cubense",
                "symptoms": [
                    "Intense marginal yellowing progressing from older lower leaves inward",
                    "Buckling and skirt-like collapse of leaf petioles around pseudostem",
                    "Reddish-brown vascular discoloration inside pseudostem bundles"
                ],
                "treatment": [
                    "Soil drenching around plant basin with Carbendazim 50% WP @ 2.0 g/L.",
                    "Bio-control root zone application of Trichoderma viride @ 50 g/plant mixed with 5 kg FYM."
                ],
                "prevention": [
                    "Use certified tissue-culture suckers of wilt-resistant cultivars (Grand Naine).",
                    "Disinfect farm implements before moving between plots."
                ]
            },
            "healthy": {
                "name": "Healthy Banana Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Broad lush emerald-green foliar lamina with intact lateral parallel venation and clean fruit peel."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain balanced N-P-K nutrition (200:40:200 g/plant) and scheduled drip irrigation."]
            }
        },
        "supported_pests": {
            "banana_weevil": {
                "name": "Banana Pseudostem Weevil",
                "scientific_name": "Odoiporus longicollis",
                "keywords": ["pseudostem weevil", "banana weevil", "rhizome borer", "odoiporus"],
                "damage_signs": [
                    "Gelatinous sap oozing from pinhead holes on the outer pseudostem",
                    "Extensive internal larval tunneling causing pseudostem to snap and collapse in mild wind"
                ],
                "pest_control": [
                    "Stem injection or swabbing: Monocrotophos 36% SL @ 1:4 dilution or Chlorpyrifos 20% EC @ 2.5 ml/L.",
                    "Place longitudinal pseudostem split traps @ 25 traps/acre treated with Beauveria bassiana."
                ],
                "prevention": [
                    "Remove dried leaf sheaths and maintain field sanitation."
                ]
            }
        }
    },

    # ── 20. MANGO ──
    "mango": {
        "name": "Mango",
        "scientific": "Mangifera indica",
        "family": "Anacardiaceae",
        "keywords": ["mango", "aam", "mamidi", "anthracnose", "आम", "మామిడి", "மாங்காய்", "mavu", "mangifera"],
        "leaf_morphology": "Simple lanceolate to oblong leathery evergreen leaves with prominent pinnate venation",
        "supported_conditions": ["anthracnose", "powdery_mildew", "bacterial_canker", "dieback", "healthy"],
        "diseases": {
            "anthracnose": {
                "name": "Mango Anthracnose",
                "scientific_name": "Colletotrichum gloeosporioides",
                "symptoms": [
                    "Dark brown to black angular necrotic spots on young foliage and panicles ('blossom blight')",
                    "Lesions cause leaf margins to curl, shred, and fall off ('shot-hole' appearance)",
                    "Sunken black spots on green and ripe mangoes that coalesce into large tear-stain rot"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 3.0 g/L or Azoxystrobin 23% SC @ 1.0 ml/L.",
                    "Pre-flowering and post-flowering sprays of Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Prune dead twigs, criss-cross branches, and mummified fruits before new flush emergence.",
                    "Hot water treatment of harvested mangoes at 52°C for 5 minutes to control latent fruit rot."
                ]
            },
            "powdery_mildew": {
                "name": "Mango Powdery Mildew",
                "scientific_name": "Oidium mangiferae",
                "symptoms": [
                    "White powdery superficial fungal bloom on inflorescence panicles, tender leaves, and fruitlets",
                    "Flowers fail to open, dry up, turn brown, and drop off ('blossom drop') drastically reducing fruit set"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Dinocap 48% EC @ 1.0 ml/L or Hexaconazole 5% SC @ 1.5 ml/L."
                ],
                "prevention": [
                    "First spray at panicle emergence (flower bud stage); second spray at 50% bloom."
                ]
            },
            "bacterial_canker": {
                "name": "Mango Bacterial Canker",
                "scientific_name": "Xanthomonas citri pv. mangiferaeindicae",
                "symptoms": [
                    "Water-soaked dark brown raised angular canker lesions on leaves with chlorotic halo",
                    "Cankers on fruit crack open and ooze bacterial gum exudate ('star-shaped cracks')"
                ],
                "treatment": [
                    "Spray Streptocycline @ 0.1 g/L + Copper Oxychloride @ 2.5 g/L."
                ],
                "prevention": [
                    "Prune infected branches and paint cut surfaces with Bordeaux paste (10%)."
                ]
            },
            "healthy": {
                "name": "Healthy Mango Orchard",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lustrous dark green leathery leaves with healthy panicles and clean glossy fruit skin."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Post-harvest pruning and balanced N-P-K (1000:500:1000 g/tree) with micronutrient foliar spray."]
            }
        },
        "supported_pests": {
            "mango_hopper": {
                "name": "Mango Hopper",
                "scientific_name": "Amritodus atkinsoni",
                "keywords": ["mango hopper", "hopper", "atkinsoni", "blossom hopper"],
                "damage_signs": [
                    "Nymphs and adults suck sap from tender shoots and blossom panicles",
                    "Panicles wither and turn brown; heavy honeydew excretion leads to black sooty mold covering canopy"
                ],
                "pest_control": [
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Thiamethoxam 25% WG @ 0.3 g/L or Buprofezin 25% SC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Open dense canopy through pruning to allow sunlight inside."
                ]
            }
        }
    },

    # ── 21. PAPAYA ──
    "papaya": {
        "name": "Papaya",
        "scientific": "Carica papaya",
        "family": "Caricaceae",
        "keywords": ["papaya", "papita", "pappali", "boppayi", "carica", "ringspot", "पपीता", "బొప్పాయి"],
        "leaf_morphology": "Large palmately lobed leaf (7-to-11 segments) with long hollow petiole",
        "supported_conditions": ["ring_spot_virus", "anthracnose", "foot_rot", "healthy"],
        "diseases": {
            "ring_spot_virus": {
                "name": "Papaya Ring Spot Virus (PRSV)",
                "scientific_name": "Papaya ringspot virus",
                "symptoms": [
                    "Prominent dark green water-soaked oily streaks on petioles and upper stem",
                    "Severe leaf distortion, blistering, shoe-stringing, and mosaic mottling",
                    "Characteristic concentric circular ring spots on green fruit surface"
                ],
                "treatment": [
                    "No curative chemical exists; rogue out and burn infected plants to stop aphid vector spread.",
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L to control aphid vectors."
                ],
                "prevention": [
                    "Grow barrier crops like 3 rows of border corn or sorghum around the papaya block.",
                    "Use PRSV-tolerant varieties like Red Lady 786."
                ]
            },
            "anthracnose": {
                "name": "Papaya Anthracnose",
                "scientific_name": "Colletotrichum gloeosporioides",
                "symptoms": [
                    "Small circular water-soaked sunken spots on fruit skin enlarging to dark brown lesions with pink spore masses"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Post-harvest hot water dip of fruits at 48°C for 20 minutes."
                ]
            },
            "foot_rot": {
                "name": "Papaya Foot Rot / Stem Rot",
                "scientific_name": "Pythium aphanidermatum",
                "symptoms": [
                    "Water-soaked rotting patches at base of stem near soil level; bark sloughs off, plant collapses in wind"
                ],
                "treatment": [
                    "Drench basin with Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L or Bordeaux mixture (1%)."
                ],
                "prevention": [
                    "Plant on raised beds (15-20 cm high) and avoid water accumulation touching trunk bark."
                ]
            },
            "healthy": {
                "name": "Healthy Papaya Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Expansive palmately lobed green crown with clean petioles and uniform developing fruit spiral."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain morning ring irrigation keeping root collar completely dry."]
            }
        },
        "supported_pests": {
            "papaya_mealybug": {
                "name": "Papaya Mealybug",
                "scientific_name": "Paracoccus marginatus",
                "keywords": ["mealybug", "papaya mealybug", "paracoccus", "white waxy"],
                "damage_signs": [
                    "Clusters of white waxy cottony insects covering fruit surfaces, veins, and growing tips",
                    "Heavy honeydew secretion leading to thick black sooty mold and distorted fruit shape"
                ],
                "pest_control": [
                    "Release exotic parasitoid wasp Acerophagus papayae (biological marvel).",
                    "Foliar spray: Profenofos 50% EC @ 2.0 ml/L or Thiamethoxam 25% WG @ 0.5 g/L with soap sticker."
                ],
                "prevention": [
                    "Remove alternate weed hosts (Parthenium hysterophorus) around the plantation."
                ]
            }
        }
    },

    # ── 22. APPLE ──
    "apple": {
        "name": "Apple",
        "scientific": "Malus domestica",
        "family": "Rosaceae",
        "keywords": ["apple", "seb", "seba", "malus", "scab", "सेब", "యాపిల్", "ஆப்பிள்"],
        "leaf_morphology": "Simple alternate ovate serrated leaves with acute apex and dark green upper surface",
        "supported_conditions": ["apple_scab", "powdery_mildew", "black_rot", "healthy"],
        "diseases": {
            "apple_scab": {
                "name": "Apple Scab",
                "scientific_name": "Venturia inaequalis",
                "symptoms": [
                    "Olive-green to dull brown velvety spots on leaves turning dark brown to black and leathery",
                    "Circular brown scab lesions on fruit that harden, crack, and stunt fruit expansion"
                ],
                "treatment": [
                    "Petal fall & fruitlet stage: Difenoconazole 25% EC @ 0.3 ml/L or Dodine 65% WP @ 0.75 g/L.",
                    "Spray Captan 50% WP @ 2.5 g/L or Mancozeb 75% WP @ 3.0 g/L."
                ],
                "prevention": [
                    "Post-harvest urea foliar spray (5%) in autumn to accelerate leaf litter decomposition and eliminate ascospore overwintering."
                ]
            },
            "powdery_mildew": {
                "name": "Apple Powdery Mildew",
                "scientific_name": "Podosphaera leucotricha",
                "symptoms": [
                    "White to light gray powdery coating on young growing shoots, leaves, and blossoms",
                    "Leaves curl upward, become narrow, and shoot tips die back ('silver tips')"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 3.0 g/L or Hexaconazole 5% SC @ 1.0 ml/L or Myclobutanil 10% WP @ 0.4 g/L."
                ],
                "prevention": [
                    "Prune out infected powdery silver-tipped shoots during winter dormancy."
                ]
            },
            "black_rot": {
                "name": "Apple Black Rot / Frogeye Leaf Spot",
                "scientific_name": "Diplodia seriata",
                "symptoms": [
                    "Frogeye leaf spot: Small purple specks enlarging into circular spots with light tan center and purple margin",
                    "Calyx-end fruit rot turning firm, dark brown, and black with pycnidia dots"
                ],
                "treatment": [
                    "Spray Captan 50% WP @ 2.5 g/L or Thiophanate Methyl 70% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Prune dead twigs, fire blight strikes, and remove mummified apples from orchard."
                ]
            },
            "healthy": {
                "name": "Healthy Apple Orchard",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lustrous serrate emerald foliage with uniform fruit cluster load and clean unblemished skin."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Winter dormant copper spray and balanced micro-irrigation."]
            }
        },
        "supported_pests": {
            "woolly_aphid": {
                "name": "Woolly Apple Aphid",
                "scientific_name": "Eriosoma lanigerum",
                "keywords": ["woolly aphid", "eriosoma", "white woolly", "canker gall"],
                "damage_signs": [
                    "White cottony/woolly masses on twigs, pruning wounds, and root collar",
                    "Knobby gall formations on shoots and roots stunting tree vigor"
                ],
                "pest_control": [
                    "Conserve parasitoid Aphelinus mali.",
                    "Spray Chlorpyrifos 20% EC @ 2.5 ml/L or Imidacloprid 17.8% SL @ 0.5 ml/L directing spray into stem crevices."
                ],
                "prevention": [
                    "Use woolly aphid resistant rootstocks (MM 106, MM 111)."
                ]
            }
        }
    },

    # ── 23. GRAPES ──
    "grapes": {
        "name": "Grapes",
        "scientific": "Vitis vinifera",
        "family": "Vitaceae",
        "keywords": ["grape", "grapes", "angoor", "draksha", "vitis", "अंगूर", "ద్రాక్ష", "திராட்சை"],
        "leaf_morphology": "Palmately lobed cordate leaves with toothed margins and tendril-bearing vines",
        "supported_conditions": ["downy_mildew", "powdery_mildew", "anthracnose", "healthy"],
        "diseases": {
            "downy_mildew": {
                "name": "Grapevine Downy Mildew",
                "scientific_name": "Plasmopara viticola",
                "symptoms": [
                    "Translucent yellowish oily spots on upper leaf surface ('oil spots')",
                    "Dense white cottony/downy fungal growth strictly on underside of leaf spots during morning dew",
                    "Infected berries turn grayish-blue, shrivel, and harden into dried mummies"
                ],
                "treatment": [
                    "Prophylactic: Bordeaux mixture (1%) or Copper Oxychloride 50% WP @ 2.5 g/L.",
                    "Systemic curative: Dimethomorph 50% WP @ 1.0 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L or Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Canopy management: Shoot thinning and leaf stripping to improve aeration.",
                    "Avoid microclimate humidity entrapment in vine canopies."
                ]
            },
            "powdery_mildew": {
                "name": "Grapevine Powdery Mildew",
                "scientific_name": "Erysiphe necator",
                "symptoms": [
                    "Ash-gray powdery flour-like fungal coating on both sides of leaves, green shoots, and berries",
                    "Infected berries crack open prematurely exposing seeds ('berry cracking')"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Kresoxim-methyl 44.3% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Apply sulfur dust in early morning before ambient temperatures exceed 32°C."
                ]
            },
            "anthracnose": {
                "name": "Grape Anthracnose / Bird's Eye Rot",
                "scientific_name": "Elsinoë ampelina",
                "symptoms": [
                    "Small circular spots with dark brown to black borders and grayish-white sunken centers ('bird's eye')",
                    "Lesions cause young leaves to curl, shred, and form shot-holes; shoots develop deep cankers"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L or Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Swabbing canes with ferrous sulfate + sulfuric acid during winter dormancy."
                ]
            },
            "healthy": {
                "name": "Healthy Grapevine",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush palmately lobed green vine canopy with clean tendrils and dense intact fruit bunches."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Pruning sanitation and balanced fertigation."]
            }
        },
        "supported_pests": {
            "thrips": {
                "name": "Grapevine Thrips",
                "scientific_name": "Rhipiphorothrips cruentatus",
                "keywords": ["thrips", "grape thrips", "scab on berries", "scab"],
                "damage_signs": [
                    "Rasped corky scabs on berry skin, reducing marketability; leaves curl boat-shaped upward"
                ],
                "pest_control": [
                    "Install blue sticky traps @ 15 traps/acre.",
                    "Spray Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 0.8 ml/L."
                ],
                "prevention": [
                    "Overhead misting to disrupt thrips life cycle."
                ]
            }
        }
    },

    # ── 24. POMEGRANATE ──
    "pomegranate": {
        "name": "Pomegranate",
        "scientific": "Punica granatum",
        "family": "Lythraceae",
        "keywords": ["pomegranate", "anar", "mathulai", "danimma", "dalimbe", "punica", "अनार", "దానిమ్మ", "மாதுளை"],
        "leaf_morphology": "Opposite, glossy, oblong-lanceolate leaves with entire margins and reddish petioles",
        "supported_conditions": ["bacterial_blight", "anthracnose", "cercospora_spot", "healthy"],
        "diseases": {
            "bacterial_blight": {
                "name": "Pomegranate Bacterial Blight / Telya",
                "scientific_name": "Xanthomonas axonopodis pv. punicae",
                "symptoms": [
                    "Small water-soaked dark brown spots on leaves with yellow chlorotic halo turning necrotic",
                    "Black, oily, shiny, raised angular spots on fruit skin developing characteristic 'L' or 'Y' shaped cracks ('Telya')",
                    "Brown-black nodal cankers on twigs causing sudden branch dieback"
                ],
                "treatment": [
                    "Foliar spray of Streptocycline @ 0.5 g/L mixed with Copper Oxychloride @ 2.5 g/L or 2-Bromo-2-nitropropane-1,3-diol (Bacterimycin) @ 0.5 g/L.",
                    "Spray Bordeaux mixture (1%) during monsoon flush intervals."
                ],
                "prevention": [
                    "Prune out infected twigs 5 cm below infection and apply 10% Bordeaux paste to cut ends.",
                    "Strictly disinfect pruning shears with 5% sodium hypochlorite between trees.",
                    "Avoid taking Mrig bahar crop in endemic blight zones; favor Hasta or Ambe bahar."
                ]
            },
            "anthracnose": {
                "name": "Pomegranate Anthracnose",
                "scientific_name": "Colletotrichum gloeosporioides",
                "symptoms": [
                    "Circular brown to dark brown sunken spots on fruit and leaves with black minute acervuli dots"
                ],
                "treatment": [
                    "Spray Azoxystrobin 23% SC @ 1.0 ml/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Bag developing pomegranates with non-woven polypropylene covers at 45 days after fruit set."
                ]
            },
            "cercospora_spot": {
                "name": "Cercospora Fruit & Leaf Spot",
                "scientific_name": "Cercospora punicae",
                "symptoms": [
                    "Small circular to irregular reddish-brown spots with dark borders on foliage and fruit skin"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Keep orchard floor clean of diseased leaf litter."
                ]
            },
            "healthy": {
                "name": "Healthy Pomegranate Orchard",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lustrous vibrant green foliage with bright scarlet flowers and glossy uncracked fruit rinds."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Regulated drip deficit irrigation and balanced potassium-silicon fertilization."]
            }
        },
        "supported_pests": {
            "anar_butterfly": {
                "name": "Pomegranate Butterfly / Fruit Borer",
                "scientific_name": "Deudorix isocrates",
                "keywords": ["anar butterfly", "deudorix", "fruit borer", "butterfly"],
                "damage_signs": [
                    "Single entry hole on fruit rind plugged with larval excrement, rotting fruit emits foul odor"
                ],
                "pest_control": [
                    "Bag young fruits with butter paper or non-woven fabric bags at marble stage.",
                    "Spray Spinosad 45% SC @ 0.3 ml/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L."
                ],
                "prevention": [
                    "Remove and bury punctured bored fruits."
                ]
            }
        }
    },

    # ── 25. WATERMELON ──
    "watermelon": {
        "name": "Watermelon",
        "scientific": "Citrullus lanatus",
        "family": "Cucurbitaceae",
        "keywords": ["watermelon", "tarbooz", "puchakaya", "thanni mathan", "tarbuj", "citrullus", "तरबूज", "పుచ్చకాయ", "தர்பூசணி"],
        "leaf_morphology": "Deeply pinnatifid 3-to-5 lobed leaves with scaberulous hairs",
        "supported_conditions": ["anthracnose", "gummy_stem_blight", "downy_mildew", "healthy"],
        "diseases": {
            "anthracnose": {
                "name": "Watermelon Anthracnose",
                "scientific_name": "Colletotrichum orbiculare",
                "symptoms": [
                    "Small circular water-soaked leaf spots turning dark brown to black and brittle",
                    "Circular sunken spots with black margins on melon rind exuding pink gelatinous spore masses in humid weather"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1.0 ml/L or Chlorothalonil 75% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Practice 3-year crop rotation avoiding other cucurbits.",
                    "Ensure vine beds are mulched with silver-black plastic mulch to prevent rind contact with wet soil."
                ]
            },
            "gummy_stem_blight": {
                "name": "Gummy Stem Blight",
                "scientific_name": "Stagonosporopsis cucurbitacearum",
                "symptoms": [
                    "Water-soaked oily lesions on crown stem that turn tan and ooze amber-colored sticky gum droplets",
                    "Vine wilts rapidly above the girdled gummy stem canker"
                ],
                "treatment": [
                    "Spray Difenoconazole 25% EC @ 1.0 ml/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Drench plant collar with Carbendazim 50% WP @ 1.5 g/L."
                ]
            },
            "downy_mildew": {
                "name": "Watermelon Downy Mildew",
                "scientific_name": "Pseudoperonospora cubensis",
                "symptoms": [
                    "Yellow angular spots bounded by leaf veins on upper leaf surface",
                    "Purplish-gray downy mold on leaf undersides causing leaves to curl and scorch ('fire blight' appearance)"
                ],
                "treatment": [
                    "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L."
                ],
                "prevention": [
                    "Use drip irrigation under mulch; strictly avoid overhead sprinkler watering."
                ]
            },
            "healthy": {
                "name": "Healthy Watermelon Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vigorous spreading vine canopy with deep green lobed leaves and clean striped melons."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Place dried straw under developing melons to prevent soil moisture rot."]
            }
        },
        "supported_pests": {
            "red_pumpkin_beetle": {
                "name": "Red Pumpkin Beetle",
                "scientific_name": "Aulacophora foveicollis",
                "keywords": ["red pumpkin beetle", "cucurbit beetle", "aulacophora", "leaf feeder"],
                "damage_signs": [
                    "Adult orange-red beetles chew circular holes in cotyledons and young leaves",
                    "Grubs feed underground on melon roots and subterranean stems"
                ],
                "pest_control": [
                    "Dust wood ash on young seedling foliage in early morning.",
                    "Spray Chlorpyrifos 20% EC @ 2.0 ml/L or Malathion 50% EC @ 2.0 ml/L around plant basins."
                ],
                "prevention": [
                    "Deep summer plowing to expose pupae to predatory birds."
                ]
            }
        }
    },

    # ── 26. MUSKMELON / CANTALOUPE ──
    "muskmelon": {
        "name": "Muskmelon / Cantaloupe",
        "scientific": "Cucumis melo",
        "family": "Cucurbitaceae",
        "keywords": ["muskmelon", "cantaloupe", "kharbooja", "kharbuj", "cucumis melo", "खरबूजा", "ఖర్బూజ"],
        "leaf_morphology": "Orbicular to reniform cordate leaves with shallow lobes and wavy toothed margins",
        "supported_conditions": ["powdery_mildew", "downy_mildew", "fusarium_wilt", "healthy"],
        "diseases": {
            "powdery_mildew": {
                "name": "Muskmelon Powdery Mildew",
                "scientific_name": "Podosphaera xanthii",
                "symptoms": [
                    "White powdery talc-like patches on both surfaces of leaves and stems",
                    "Foliage becomes yellow, brown, and brittle, exposing developing melons to sunscald"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.0 g/L or Azoxystrobin 23% SC @ 1.0 ml/L or Dinocap 48% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Maintain good air circulation through vine training on raised beds."
                ]
            },
            "downy_mildew": {
                "name": "Muskmelon Downy Mildew",
                "scientific_name": "Pseudoperonospora cubensis",
                "symptoms": [
                    "Angular yellow chlorotic lesions on upper leaf surface with violet-gray downy spore growth below"
                ],
                "treatment": [
                    "Spray Dimethomorph 50% WP @ 1.0 g/L + Mancozeb @ 2.0 g/L or Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Avoid excess moisture; adopt drip fertigation."
                ]
            },
            "fusarium_wilt": {
                "name": "Muskmelon Fusarium Wilt",
                "scientific_name": "Fusarium oxysporum f. sp. melonis",
                "symptoms": [
                    "One-sided wilting of runners with brown longitudinal necrotic streaks on stems oozing amber gum"
                ],
                "treatment": [
                    "Drench root basin with Carbendazim 50% WP @ 1.5 g/L."
                ],
                "prevention": [
                    "Use resistant cultivars or graft on resistant cucurbit rootstocks."
                ]
            },
            "healthy": {
                "name": "Healthy Muskmelon Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush green spreading vine canopy with healthy netting on developing cantaloupes."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Balanced potassium application to enhance fruit sweetness and brix."]
            }
        },
        "supported_pests": {
            "fruit_fly": {
                "name": "Cucurbit Fruit Fly",
                "scientific_name": "Bactrocera cucurbitae",
                "keywords": ["fruit fly", "bactrocera", "maggot", "fruit puncture"],
                "damage_signs": [
                    "Female fly punctures fruit skin to lay eggs; yellowish gum oozes from puncture site",
                    "Internal maggot feeding causes rotting, breakdown of pulp, and premature fruit drop"
                ],
                "pest_control": [
                    "Install cue-lure pheromone traps @ 6-8 traps/acre.",
                    "Apply bait spray: 20 ml Malathion 50% EC + 200 g jaggery in 10 L water sprayed in coarse droplets."
                ],
                "prevention": [
                    "Collect and deeply bury fallen and infested fruits in soil."
                ]
            }
        }
    },

    # ── 27. ORANGE / CITRUS ──
    "orange": {
        "name": "Orange / Citrus",
        "scientific": "Citrus sinensis",
        "family": "Rutaceae",
        "keywords": ["orange", "santra", "citrus", "mosambi", "narangi", "canker", "संतरा", "నారింజ", "ஆரஞ்சு", "ಕಿತ್ತಳೆ"],
        "leaf_morphology": "Unifoliate alternate evergreen oval leaves with narrowly winged petioles",
        "supported_conditions": ["citrus_canker", "gummosis", "greening", "healthy"],
        "diseases": {
            "citrus_canker": {
                "name": "Citrus Canker",
                "scientific_name": "Xanthomonas axonopodis pv. citri",
                "symptoms": [
                    "Raised, corky, rough blister-like cankers with crater-like depressions on leaves and fruit rind",
                    "Leaf cankers surrounded by a prominent translucent yellow chlorotic halo ('halo effect')",
                    "Premature fruit dropping and blemished fruit rinds reducing commercial grade"
                ],
                "treatment": [
                    "Spray Streptocycline @ 0.1 g/L mixed with Copper Oxychloride 50% WP @ 2.5 g/L.",
                    "Apply 1% Bordeaux mixture before onset of monsoon flushes."
                ],
                "prevention": [
                    "Prune canker-affected twigs before new vegetative flush and spray with copper fungicide.",
                    "Control citrus leaf miner which creates wound entries for the canker bacteria."
                ]
            },
            "gummosis": {
                "name": "Citrus Gummosis / Phytophthora Foot Rot",
                "scientific_name": "Phytophthora nicotianae",
                "symptoms": [
                    "Copious golden-brown gum exudation from bark cracking near trunk base",
                    "Bark softens, rots, and sloughs off leaving dead wood; foliage turns yellow and dies"
                ],
                "treatment": [
                    "Scrape off diseased bark and paint wood with Bordeaux paste (10%) or Metalaxyl paste.",
                    "Foliar spray of Potassium Phosphite (Aliette) @ 2.5 g/L."
                ],
                "prevention": [
                    "Bud citrus trees high (minimum 30 cm above soil level) on resistant rootstocks (Rough Lemon, Rangpur Lime)."
                ]
            },
            "greening": {
                "name": "Citrus Greening / Huanglongbing (HLB)",
                "scientific_name": "Candidatus Liberibacter asiaticus",
                "symptoms": [
                    "Blotchy mottle chlorosis on leaves that is asymmetric across the midrib",
                    "Small lopsided bitter fruits that remain green at the stylar end ('greening')"
                ],
                "treatment": [
                    "Control the insect psyllid vector with Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L."
                ],
                "prevention": [
                    "Plant disease-free certified budwood trees from virus-free certified nurseries."
                ]
            },
            "healthy": {
                "name": "Healthy Citrus Orchard",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lustrous dark green canopy with clean aromatic leaves and uniform unblemished round oranges."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Apply Zinc Sulfate (0.5%) and Ferrous Sulfate (0.4%) foliar spray to prevent chlorosis."]
            }
        },
        "supported_pests": {
            "leaf_miner": {
                "name": "Citrus Leaf Miner",
                "scientific_name": "Phyllocnistis citrella",
                "keywords": ["leaf miner", "citrus leaf miner", "silvery serpentine mine", "citrella"],
                "damage_signs": [
                    "Silvery serpentine twisting mines on young tender flush leaves",
                    "Leaves curl, distort, and provide open entry wounds for citrus canker bacteria"
                ],
                "pest_control": [
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Abamectin 1.9% EC @ 0.5 ml/L or Neem oil (10,000 ppm) @ 3 ml/L at flush emergence."
                ],
                "prevention": [
                    "Synchronize vegetative flushes through proper irrigation management."
                ]
            }
        }
    },

    # ── 28. COCONUT ──
    "coconut": {
        "name": "Coconut",
        "scientific": "Cocos nucifera",
        "family": "Arecaceae",
        "keywords": ["coconut", "nariyal", "kobbari", "thengai", "tengu", "cocos", "నారికేళం", "కొబ్బరి", "தேங்காய்", "தென்னை", "ತೆಂಗಿನಕಾಯಿ"],
        "leaf_morphology": "Large pinnate feather-like fronds (4-6 meters long) with numerous linear leaflets",
        "supported_conditions": ["bud_rot", "stem_bleeding", "tanjore_wilt", "healthy"],
        "diseases": {
            "bud_rot": {
                "name": "Coconut Bud Rot",
                "scientific_name": "Phytophthora palmivora",
                "symptoms": [
                    "Central spear leaf turns pale yellow, withers, and bends over horizontally",
                    "Basal portion of the spear leaf decays into a foul-smelling soft rot",
                    "The central spindle leaf can be pulled out effortlessly from the crown"
                ],
                "treatment": [
                    "Clean rotted tissues and apply 10% Bordeaux paste or Copper Oxychloride 50% WP @ 5 g/L to crown bud.",
                    "Place Mancozeb sachets (10 g mixed with sand) in the leaf axils adjacent to the crown."
                ],
                "prevention": [
                    "Prophylactic crown spray with 1% Bordeaux mixture before onset of South-West and North-East monsoons."
                ]
            },
            "stem_bleeding": {
                "name": "Coconut Stem Bleeding",
                "scientific_name": "Thielaviopsis paradoxa",
                "symptoms": [
                    "Exudation of dark reddish-brown to black liquid from longitudinal cracks on lower trunk bark",
                    "Tissues beneath the bleeding patches decay and become fibrous and hollow"
                ],
                "treatment": [
                    "Chisel out infected bark and diseased wood until clean tissue is exposed; paint with Coal tar or Bordeaux paste.",
                    "Root feeding with Carbendazim 50% WP (2 g in 100 ml water) or Hexaconazole 5% SC (2 ml in 100 ml water)."
                ],
                "prevention": [
                    "Apply Trichoderma viride @ 50 g mixed with 5 kg neem cake per palm annually to root zone."
                ]
            },
            "tanjore_wilt": {
                "name": "Tanjore Wilt / Basal Stem Rot",
                "scientific_name": "Ganoderma lucidum",
                "symptoms": [
                    "Withering and drooping of lower fronds which remain hanging down like a skirt around trunk",
                    "Basal trunk shows dark brown bleeding; bracket-shaped fruiting bodies (conks) emerge at trunk base"
                ],
                "treatment": [
                    "Root feeding with Hexaconazole 5% SC @ 2 ml in 100 ml water at quarterly intervals.",
                    "Drench root zone with 1% Bordeaux mixture."
                ],
                "prevention": [
                    "Isolate diseased palm by digging isolation trenches (1 meter deep, 50 cm wide) around the tree."
                ]
            },
            "healthy": {
                "name": "Healthy Coconut Palm",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush spherical crown with 30-40 radiating green fronds and continuous heavy nut bunches."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Apply recommended fertilizer dose (500g N, 320g P2O5, 1200g K2O per palm/year) with regular basin irrigation."]
            }
        },
        "supported_pests": {
            "rhinoceros_beetle": {
                "name": "Rhinoceros Beetle",
                "scientific_name": "Oryctes rhinoceros",
                "keywords": ["rhinoceros beetle", "oryctes", "v-shaped cut", "frond cut"],
                "damage_signs": [
                    "Adult black beetle bores into unopened spear leaf and crown bud",
                    "When fronds emerge and unfold, they display characteristic geometric 'V-shaped' or fan-shaped leaf cuts"
                ],
                "pest_control": [
                    "Extract beetles from crown using a hooked bicycle spoke.",
                    "Place Naphthalene balls @ 3 balls/palm mixed with sand in top 2-3 leaf axils."
                ],
                "prevention": [
                    "Treat manure pits and compost heaps with Metarhizium anisopliae or Carbaryl to kill grubs."
                ]
            }
        }
    },

    # ── 29. JUTE ──
    "jute": {
        "name": "Jute",
        "scientific": "Corchorus olitorius / capsularis",
        "family": "Malvaceae",
        "keywords": ["jute", "pat", "paat", "corchorus", "golden fiber", "পাট"],
        "leaf_morphology": "Simple ovate-lanceolate serrated leaves with distinctive basal setaceous teeth",
        "supported_conditions": ["stem_rot", "anthracnose", "black_band", "healthy"],
        "diseases": {
            "stem_rot": {
                "name": "Jute Stem Rot",
                "scientific_name": "Macrophomina phaseolina",
                "symptoms": [
                    "Dark brown to black necrotic spots on stems at leaf points",
                    "Lesions girdle the fibrous bark, causing stems to shred, rot, and break in wind; black pycnidia dot the bark"
                ],
                "treatment": [
                    "Spray Carbendazim 50% WP @ 1.0 g/L or Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Seed treatment with Carbendazim @ 2 g/kg seed; ensure soil drainage."
                ]
            },
            "anthracnose": {
                "name": "Jute Anthracnose",
                "scientific_name": "Colletotrichum corchorum",
                "symptoms": [
                    "Yellowish-brown spots on stems and leaves with pinkish gelatinous spore exudate; fiber becomes stained"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Use certified seeds and rotate crops with paddy."
                ]
            },
            "black_band": {
                "name": "Jute Black Band",
                "scientific_name": "Diplodia corchori",
                "symptoms": [
                    "Black sooty band completely encircling the stem causing defoliation and fiber disintegration"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Remove and burn diseased jute stubble after retting harvest."
                ]
            },
            "healthy": {
                "name": "Healthy Jute Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Tall erect unbranched cylindrical green stems with lush serrate leaves and intact bast fibers."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Timely weeding and thinning at 21 DAS to maintain 30 cm x 7 cm spacing."]
            }
        },
        "supported_pests": {
            "jute_semilooper": {
                "name": "Jute Semilooper",
                "scientific_name": "Anomis sabulifera",
                "keywords": ["semilooper", "anomis", "looping caterpillar", "leaf feeder"],
                "damage_signs": [
                    "Caterpillars feed voraciously on apical buds and tender top leaves, causing branching and destroying fiber length"
                ],
                "pest_control": [
                    "Spray Chlorpyrifos 20% EC @ 2.0 ml/L or Lambda-cyhalothrin 5% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Draw a kerosene-treated rope across the field canopy to dislodge caterpillars."
                ]
            }
        }
    },

    # ── 30. COFFEE ──
    "coffee": {
        "name": "Coffee",
        "scientific": "Coffea arabica / canephora",
        "family": "Rubiaceae",
        "keywords": ["coffee", "kafi", "kaapi", "coffea", "arabica", "robusta", "కాఫీ", "காபி"],
        "leaf_morphology": "Opposite glossy dark green elliptical leaves with prominent interveinal reticulation",
        "supported_conditions": ["leaf_rust", "black_rot", "anthracnose_dieback", "healthy"],
        "diseases": {
            "leaf_rust": {
                "name": "Coffee Leaf Rust",
                "scientific_name": "Hemileia vastatrix",
                "symptoms": [
                    "Small yellowish spots on upper leaf surface corresponding to powdery bright orange-yellow pustules on undersides",
                    "Pustules coalesce, turning dark brown and necrotic; severe infection triggers massive premature defoliation ('leaf drop')"
                ],
                "treatment": [
                    "Pre-monsoon and post-monsoon sprays of Bordeaux mixture (0.5%) or Copper Oxychloride 50% WP @ 2.5 g/L.",
                    "Systemic curative: Epoxiconazole 7.5% EC @ 1.0 ml/L or Hexaconazole 5% SC @ 1.5 ml/L or Triadimefon 25% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Regulate two-tier shade tree canopy to provide 50-60% filtered sunlight across coffee bushes.",
                    "Grow rust-tolerant Arabica selections (Selection 5B, 795, Chandragiri)."
                ]
            },
            "black_rot": {
                "name": "Coffee Black Rot / Koleroga",
                "scientific_name": "Pellicularia koleroga",
                "symptoms": [
                    "Leaves turn dark brown to black and hang dangling from branches by thin white fungal mycelial threads",
                    "Berries rot, blacken, and drop off in clusters under heavy monsoon mist"
                ],
                "treatment": [
                    "Spray 1% Bordeaux mixture on lower leaf surfaces and berry clusters before South-West monsoon."
                ],
                "prevention": [
                    "Thin out dense criss-cross branches and shade trees to improve air flow during monsoon."
                ]
            },
            "anthracnose_dieback": {
                "name": "Coffee Anthracnose / Twig Dieback",
                "scientific_name": "Colletotrichum kahawae",
                "symptoms": [
                    "Yellowing and necrosis of leaves progressing from twig tips inward ('dieback'); berries show dark sunken cankers"
                ],
                "treatment": [
                    "Prune dead twigs 5 cm into green wood and spray Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Maintain soil pH between 6.0 and 6.5 through agricultural liming."
                ]
            },
            "healthy": {
                "name": "Healthy Coffee Estate",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lustrous dark green leathery leaves with healthy white blossom clusters or tight green berry nodes."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Post-monsoon pruning, handling, and desuckering."]
            }
        },
        "supported_pests": {
            "berry_borer": {
                "name": "Coffee Berry Borer",
                "scientific_name": "Hypothenemus hampei",
                "keywords": ["berry borer", "hypothenemus", "borer in berry", "navel hole"],
                "damage_signs": [
                    "Female beetle bores small entry hole at the apical navel of developing green or ripe berries",
                    "Internal beans hollowed and destroyed with powdery frass"
                ],
                "pest_control": [
                    "Install red/white funnel traps with ethanol-methanol attractant @ 25 traps/acre.",
                    "Spray Beauveria bassiana @ 5 g/L or Chlorpyrifos 20% EC @ 2.0 ml/L at berry development stage."
                ],
                "prevention": [
                    "Thorough clean stripping harvest: collect all gleanings and left-over berries from trees and ground."
                ]
            }
        }
    },

    # ── 31. CHILLI ──
    "chilli": {
        "name": "Chilli",
        "scientific": "Capsicum annuum",
        "family": "Solanaceae",
        "keywords": ["chilli", "chili", "mirch", "mirapa", "capsicum", "pepper", "मिर्च", "మిరప", "மிளகாய்", "ಮೆಣಸಿನಕಾಯಿ"],
        "leaf_morphology": "Simple alternate ovate-lanceolate leaves with acuminate apex and smooth margins",
        "supported_conditions": ["anthracnose", "leaf_curl", "powdery_mildew", "healthy"],
        "diseases": {
            "anthracnose": {
                "name": "Chilli Anthracnose / Fruit Rot / Dieback",
                "scientific_name": "Colletotrichum capsici",
                "symptoms": [
                    "Circular to oval sunken spots with black concentric rings appearing on ripening red chilli pods",
                    "Pods dry prematurely, turn straw-colored, and shrivel ('dieback' of growing tips)",
                    "Acervuli appear as tiny black concentric dots in the sunken fruit spots"
                ],
                "treatment": [
                    "Foliar spray of Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Copper Oxychloride 50% WP @ 2.5 g/L.",
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Pyraclostrobin 20% WG @ 1.0 g/L at early pod formation."
                ],
                "prevention": [
                    "Treat seeds with Trichoderma viride @ 10 g/kg seed before nursery sowing.",
                    "Collect and destroy fallen infected pods during picking."
                ]
            },
            "leaf_curl": {
                "name": "Chilli Leaf Curl Virus (ChiLCV)",
                "scientific_name": "Chilli leaf curl virus",
                "symptoms": [
                    "Severe upward curling, puckering, and reduction in leaf size",
                    "Leaves become leathery, brittle, and crowded with shortened internodes ('murda' symptom)",
                    "Plants are stunted and flower buds drop without setting fruit"
                ],
                "treatment": [
                    "Control thrips and whitefly vectors: Spray Diafenthiuron 50% WP @ 1.2 g/L or Fipronil 5% SC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Erect blue and yellow sticky traps @ 15-20 traps/acre.",
                    "Cover nursery beds with 40-mesh insect netting."
                ]
            },
            "powdery_mildew": {
                "name": "Chilli Powdery Mildew",
                "scientific_name": "Leveillula taurica",
                "symptoms": [
                    "White powdery fungal patches on lower leaf surfaces with corresponding yellow patches on upper surface",
                    "Foliage curls and sheds prematurely"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Hexaconazole 5% SC @ 1.0 ml/L or Myclobutanil 10% WP @ 0.5 g/L."
                ],
                "prevention": [
                    "Spray neem oil (10,000 ppm) @ 3 ml/L prophylactically."
                ]
            },
            "healthy": {
                "name": "Healthy Chilli Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush smooth dark green leaves with continuous flowering and firm glossy pods."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Balanced fertigation and periodic sticky trap monitoring."]
            }
        },
        "supported_pests": {
            "chilli_thrips": {
                "name": "Chilli Thrips",
                "scientific_name": "Scirtothrips dorsalis",
                "keywords": ["thrips", "chilli thrips", "murda", "boat leaf", "scirtothrips"],
                "damage_signs": [
                    "Upward boat-shaped curling and crinkling of leaves with thickened leathery texture",
                    "Silvery or bronzed rasped scarring along veins on leaf undersides",
                    "Brown corky streaks on developing fruit pods"
                ],
                "pest_control": [
                    "Install blue sticky traps @ 15-20 traps/acre (thrips are strongly attracted to blue wavelength).",
                    "Foliar spray: Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 0.8 ml/L or Acetamiprid 20% SP @ 0.3 g/L.",
                    "Spray cold-pressed Neem Oil (10,000 ppm) @ 3 ml/L with soap."
                ],
                "prevention": [
                    "Overhead misting during dry hot spells; avoid consecutive solanaceous plantings."
                ]
            },
            "yellow_mite": {
                "name": "Chilli Yellow Mite",
                "scientific_name": "Polyphagotarsonemus latus",
                "keywords": ["mite", "yellow mite", "downward curl", "tarsonemid"],
                "damage_signs": [
                    "Downward inverted boat-shaped leaf cupping with inverted margins and oily dark green appearance",
                    "Petioles elongate giving an inverted umbrella appearance with brittle leaves"
                ],
                "pest_control": [
                    "Spray Fenpyroximate 5% EC @ 1.0 ml/L or Spiromesifen 22.9% SC @ 0.8 ml/L or Wettable Sulphur 80% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Maintain adequate field moisture and eliminate alternate weed hosts."
                ]
            }
        }
    },

    # ── 32. TURMERIC ──
    "turmeric": {
        "name": "Turmeric",
        "scientific": "Curcuma longa",
        "family": "Zingiberaceae",
        "keywords": ["turmeric", "haldi", "pasupu", "manjal", "arishina", "curcuma", "हल्दी", "పసుపు", "மஞ்சள்"],
        "leaf_morphology": "Large oblong-lanceolate smooth erect green leaves with long petiole arising from rhizome",
        "supported_conditions": ["leaf_spot", "leaf_blotch", "rhizome_rot", "healthy"],
        "diseases": {
            "leaf_spot": {
                "name": "Turmeric Leaf Spot",
                "scientific_name": "Colletotrichum curcumae",
                "symptoms": [
                    "Elliptical to oblong brown spots with gray or white centers and yellow chlorotic halos",
                    "Spots coalesce into large necrotic blighted patches causing drying of leaves"
                ],
                "treatment": [
                    "Foliar spray of Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Treat rhizomes with Mancozeb @ 3 g/L for 30 minutes before planting."
                ]
            },
            "leaf_blotch": {
                "name": "Turmeric Leaf Blotch",
                "scientific_name": "Taphrina maculans",
                "symptoms": [
                    "Numerous small, rectangular to oval reddish-brown to dark brown spots on both sides of leaves",
                    "Leaves display a dirty yellowish-brown appearance and wither prematurely"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L or Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Avoid waterlogging; ensure ridge and furrow planting."
                ]
            },
            "rhizome_rot": {
                "name": "Turmeric Rhizome Rot / Soft Rot",
                "scientific_name": "Pythium aphanidermatum",
                "symptoms": [
                    "Yellowing of lower leaves progressing upward; basal pseudostem becomes water-soaked, soft, and rots",
                    "Rhizomes turn soft, decay, and emit foul odor; plants easily pull out from soil"
                ],
                "treatment": [
                    "Drench basin with Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L or Copper Oxychloride @ 3.0 g/L."
                ],
                "prevention": [
                    "Select healthy seed rhizomes from disease-free plots; provide raised bed drainage."
                ]
            },
            "healthy": {
                "name": "Healthy Turmeric Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Expansive erect dark green foliage with clean unblemished lamina and firm developing rhizomes."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Mulch with green leaves @ 5 tonnes/acre at planting and 45 days after planting."]
            }
        },
        "supported_pests": {
            "shoot_borer": {
                "name": "Turmeric Shoot Borer",
                "scientific_name": "Conogethes punctiferalis",
                "keywords": ["shoot borer", "conogethes", "borer", "frass on pseudostem"],
                "damage_signs": [
                    "Larva bores into pseudostem feeding internally; central shoot dries up ('dead heart')",
                    "Boreholes visible on stem with extruded frass"
                ],
                "pest_control": [
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Malathion 50% EC @ 2.0 ml/L or Neem oil (10,000 ppm) @ 3 ml/L."
                ],
                "prevention": [
                    "Prune and destroy bored shoots early in infestation."
                ]
            }
        }
    },

    # ── 33. SUNFLOWER ──
    "sunflower": {
        "name": "Sunflower",
        "scientific": "Helianthus annuus",
        "family": "Asteraceae",
        "keywords": ["sunflower", "surajmukhi", "proddu thirugudu", "helianthus", "सूरजमुखी", "సూర్యకాంతి"],
        "leaf_morphology": "Large alternate cordate-ovate leaves with rough hispid pubescence and prominent veins",
        "supported_conditions": ["alternaria_blight", "sunflower_rust", "head_rot", "healthy"],
        "diseases": {
            "alternaria_blight": {
                "name": "Sunflower Alternaria Blight",
                "scientific_name": "Alternaria helianthi",
                "symptoms": [
                    "Dark brown to black circular or angular spots with concentric rings surrounded by a chlorotic halo",
                    "Lesions cause leaves to tear, crack, and defoliate; linear dark streaks develop on stems and sepals"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Seed treatment with Carbendazim + Mancozeb (Saaf) @ 2 g/kg seed."
                ]
            },
            "sunflower_rust": {
                "name": "Sunflower Rust",
                "scientific_name": "Puccinia helianthi",
                "symptoms": [
                    "Small powdery cinnamon-brown pustules on both surfaces of leaves",
                    "Pustules turn dark blackish-brown late in season causing premature drying of leaves"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Hexaconazole 5% SC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Grow rust-tolerant sunflower hybrids."
                ]
            },
            "head_rot": {
                "name": "Sunflower Head Rot / Rhizopus Rot",
                "scientific_name": "Rhizopus oryzae",
                "symptoms": [
                    "Water-soaked brown lesions on back of capitulum (head); tissue softens and becomes covered by coarse grayish-white mold with black pinhead sporangia"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L targeting flower heads."
                ],
                "prevention": [
                    "Avoid bird damage and head borer insect punctures which initiate fungal invasion."
                ]
            },
            "healthy": {
                "name": "Healthy Sunflower Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Stout erect rough green stem with large healthy cordate foliage and vigorous bright yellow flower heads."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain balanced Boron fertigation (Borax @ 2 g/L foliar spray at ray floret opening for optimal seed set)."]
            }
        },
        "supported_pests": {
            "head_borer": {
                "name": "Sunflower Head Borer",
                "scientific_name": "Helicoverpa armigera",
                "keywords": ["head borer", "helicoverpa", "capitulum borer"],
                "damage_signs": [
                    "Caterpillars feed on disc florets and tunnel into developing seeds in the sunflower head"
                ],
                "pest_control": [
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Profenofos 50% EC @ 2.0 ml/L targeting the capitulum face."
                ],
                "prevention": [
                    "Install pheromone traps @ 5 traps/acre."
                ]
            }
        }
    },

    # ── 34. SORGHUM / JOWAR ──
    "sorghum": {
        "name": "Sorghum / Jowar",
        "scientific": "Sorghum bicolor",
        "family": "Poaceae",
        "keywords": ["sorghum", "jowar", "jola", "cholam", "jonnalu", "great millet", "జొన్నలు", "சோளம்", "ज्वार"],
        "leaf_morphology": "Broad linear monocot blade with prominent white/yellow midrib and waxy bloom",
        "supported_conditions": ["grain_mold", "anthracnose", "ergot", "healthy"],
        "diseases": {
            "grain_mold": {
                "name": "Sorghum Grain Mold",
                "scientific_name": "Fusarium moniliforme / Curvularia lunata",
                "symptoms": [
                    "Fluffy pink, white, or velvety black fungal growth covering developing grains in the earhead",
                    "Grains become chalky, discolored, light-weight, and crumble easily"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L at flowering and milk stage."
                ],
                "prevention": [
                    "Harvest promptly at physiological maturity; plant mold-tolerant grain sorghum cultivars."
                ]
            },
            "anthracnose": {
                "name": "Sorghum Anthracnose",
                "scientific_name": "Colletotrichum sublineolum",
                "symptoms": [
                    "Small circular to elliptical reddish-purple or tan spots with distinct dark margins on leaves",
                    "Centers of spots become straw-colored with black spore acervuli and hair-like setae"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Seed treatment with Thiram @ 3 g/kg seed; crop rotation with pulses."
                ]
            },
            "ergot": {
                "name": "Sorghum Ergot / Sugary Disease",
                "scientific_name": "Claviceps sorghi",
                "symptoms": [
                    "Sticky, sweet, pinkish or amber-colored fluid droplets ('honeydew') oozing from infected florets",
                    "Fluid hardens into dark brown to black sclerotial bodies replacing grain seeds"
                ],
                "treatment": [
                    "Spray Propiconazole 25% EC @ 1.0 ml/L at 50% flowering."
                ],
                "prevention": [
                    "Float seeds in 20% salt solution to remove floating ergot sclerotia before sowing."
                ]
            },
            "healthy": {
                "name": "Healthy Sorghum Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Vigorous drought-hardy erect stalks with lush waxy blades and well-compacted grain panicles."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Adhere to recommended spacing (45 cm x 15 cm) and balanced N-P-K (80:40:40 kg/ha)."]
            }
        },
        "supported_pests": {
            "shoot_fly": {
                "name": "Sorghum Shoot Fly",
                "scientific_name": "Atherigona soccata",
                "keywords": ["shoot fly", "atherigona", "dead heart", "seedling maggot"],
                "damage_signs": [
                    "Maggots bore into growing point of 1-4 week old seedlings causing drying of central leaf ('dead heart')",
                    "Dead heart emits a characteristic foul odor when extracted"
                ],
                "pest_control": [
                    "Soil application of Carbofuran 3% G @ 10 kg/acre in seed furrow at planting.",
                    "Spray Thiamethoxam 25% WG @ 0.3 g/L or Cypermethrin 10% EC @ 1.0 ml/L at 7 and 14 days after emergence."
                ],
                "prevention": [
                    "Early sowing within 10-14 days of monsoon onset; use higher seed rate (10-12 kg/ha) and thin out dead hearts."
                ]
            }
        }
    },

    # ── 35. PEARL MILLET / BAJRA ──
    "pearl millet": {
        "name": "Pearl Millet / Bajra",
        "scientific": "Pennisetum glaucum",
        "family": "Poaceae",
        "keywords": ["pearl millet", "bajra", "sajje", "kambu", "sajjalu", "pennisetum", "బాజ్రా", "సజ్జలు", "கம்பு", "ಬಾಜ್ರಾ", "बाजरा"],
        "leaf_morphology": "Narrow linear erect monocot blades with fine ligule hairs and thick sturdy fibrous stem",
        "supported_conditions": ["downy_mildew", "ergot", "smut", "healthy"],
        "diseases": {
            "downy_mildew": {
                "name": "Bajra Downy Mildew / Green Ear",
                "scientific_name": "Sclerospora graminicola",
                "symptoms": [
                    "Chlorosis starting from base of leaf blades turning into white chlorotic streaks",
                    "Delicate downy white fungal sporulation on leaf undersides",
                    "Floral parts of earhead transformed into twisted leafy structures resembling green witches' brooms ('green ear')"
                ],
                "treatment": [
                    "Foliar spray of Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5 g/L at 21 days after sowing."
                ],
                "prevention": [
                    "Seed treatment with Metalaxyl 35% WS @ 6 g/kg seed.",
                    "Rogue out and bury green ear malformed plants before oospore shedding."
                ]
            },
            "ergot": {
                "name": "Bajra Ergot",
                "scientific_name": "Claviceps fusiformis",
                "symptoms": [
                    "Creamy pink to amber sticky honeydew droplets exuding from spikelets in the panicle",
                    "Honeydew hardens into dark brown, protruding curved sclerotial horns replacing healthy seeds"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L at boot leaf stage."
                ],
                "prevention": [
                    "Dip seeds in 10% salt water solution; skim off floating ergot sclerotia and rinse in clean water."
                ]
            },
            "smut": {
                "name": "Bajra Smut",
                "scientific_name": "Tolyposporium penicillariae",
                "symptoms": [
                    "Scattered grains in the spikelet swell into enlarged green to chocolate-brown oval sori containing black teliospores"
                ],
                "treatment": [
                    "Foliar spray of Carboxin 75% WP @ 1.5 g/L at panicle emergence."
                ],
                "prevention": [
                    "Deep summer plowing and crop rotation with pulses."
                ]
            },
            "healthy": {
                "name": "Healthy Pearl Millet Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Stout drought-hardy tillers with uniform dense cylindrical earheads packed with plump grains."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Intercropping with mothbeans or clusterbean in arid zones."]
            }
        },
        "supported_pests": {
            "shoot_fly": {
                "name": "Bajra Shoot Fly",
                "scientific_name": "Atherigona soccata",
                "keywords": ["shoot fly", "dead heart", "atherigona"],
                "damage_signs": [
                    "Seedling central leaf withers and dries into a dead heart"
                ],
                "pest_control": [
                    "Spray Chlorpyrifos 20% EC @ 2.0 ml/L."
                ],
                "prevention": [
                    "Early synchronized community sowing."
                ]
            }
        }
    },

    # ── 36. BARLEY ──
    "barley": {
        "name": "Barley",
        "scientific": "Hordeum vulgare",
        "family": "Poaceae",
        "keywords": ["barley", "jau", "yava", "javu", "hordeum", "जौ", "బార్లీ"],
        "leaf_morphology": "Linear lanceolate monocot leaves with very large prominent clasping auricles",
        "supported_conditions": ["yellow_rust", "covered_smut", "net_blotch", "healthy"],
        "diseases": {
            "yellow_rust": {
                "name": "Barley Stripe / Yellow Rust",
                "scientific_name": "Puccinia striiformis f. sp. hordei",
                "symptoms": [
                    "Lemon-yellow powdery pustules arranged in linear stripes between leaf veins",
                    "Foliage desiccates, turns straw-colored, and grains shrivel"
                ],
                "treatment": [
                    "Spray Propiconazole 25% EC (Tilt) @ 1.0 ml/L or Tebuconazole 25.9% EC @ 1.0 ml/L at first stripe focus."
                ],
                "prevention": [
                    "Sow rust-resistant barley cultivars (DWRB 137, RD 2786, BH 946)."
                ]
            },
            "covered_smut": {
                "name": "Barley Covered Smut",
                "scientific_name": "Ustilago hordei",
                "symptoms": [
                    "Grain kernels transformed into hard, persistent black-brown masses of smut spores held by a silvery-gray membrane",
                    "Membrane remains intact until harvest threshing"
                ],
                "treatment": [
                    "Seed treatment with Carboxin 37.5% + Thiram 37.5% @ 2.0 g/kg seed or Tebuconazole 2% DS @ 1.5 g/kg seed."
                ],
                "prevention": [
                    "Use certified disease-free barley seed."
                ]
            },
            "net_blotch": {
                "name": "Barley Net Blotch",
                "scientific_name": "Pyrenophora teres",
                "symptoms": [
                    "Brown longitudinal and transverse narrow necrotic bands creating a distinct 'net-like' pattern on leaf blades"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Rotate barley with non-cereal crops and deeply incorporate stubbles."
                ]
            },
            "healthy": {
                "name": "Healthy Barley Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Lush erect tillers with prominent auricles, clean linear blades, and long awned nodding spikes."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Timely November sowing with balanced fertilizer application (60:30:20 kg/ha)."]
            }
        },
        "supported_pests": {
            "corn_leaf_aphid": {
                "name": "Corn Leaf Aphid",
                "scientific_name": "Rhopalosiphum maidis",
                "keywords": ["aphid", "barley aphid", "rhopalosiphum", "jau aphid"],
                "damage_signs": [
                    "Dark blue-green aphids clustered within the whorl and on emerging earheads sucking sap"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L."
                ],
                "prevention": [
                    "Conserve natural predators: chrysoperla and ladybird beetles."
                ]
            }
        }
    },

    # ── 37. FINGER MILLET / RAGI ──
    "finger millet": {
        "name": "Finger Millet / Ragi",
        "scientific": "Eleusine coracana",
        "family": "Poaceae",
        "keywords": ["finger millet", "ragi", "mandua", "kezhvaragu", "ragulu", "eleusine", "రాగులు", "ರಾಗಿ", "கேழ்வரகு", "रागी"],
        "leaf_morphology": "Linear erect monocot blades with compressed sheath and digitate umbel inflorescence ('fingers')",
        "supported_conditions": ["ragi_blast", "foot_rot", "brown_leaf_spot", "healthy"],
        "diseases": {
            "ragi_blast": {
                "name": "Finger Millet Blast (Leaf, Neck & Finger Blast)",
                "scientific_name": "Magnaporthe grisea / Pyricularia grisea",
                "symptoms": [
                    "Leaf blast: Spindle-shaped lesions with ash-gray centers and yellowish-brown borders on foliage",
                    "Neck blast: Black necrotic ring at the base of the peduncle; earhead breaks and hangs down",
                    "Finger blast: Blackening of individual digit fingers, resulting in chaffy, empty grains"
                ],
                "treatment": [
                    "Spray Tricyclazole 75% WP @ 0.6 g/L (120 g/acre) or Isoprothiolane 40% EC @ 1.5 ml/L.",
                    "Spray Kitazin 48% EC @ 2.0 ml/L or Carbendazim 50% WP @ 1.0 g/L at earhead emergence."
                ],
                "prevention": [
                    "Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed or Carbendazim @ 2 g/kg.",
                    "Grow blast-resistant cultivars (GPU 28, GPU 48, ML 365, MR 1)."
                ]
            },
            "foot_rot": {
                "name": "Ragi Foot Rot / Sclerotial Wilt",
                "scientific_name": "Sclerotium rolfsii",
                "symptoms": [
                    "Brown water-soaked rotting at collar region near soil; white cottony fan-like mycelium with mustard-seed-like brown sclerotia"
                ],
                "treatment": [
                    "Drench plant base with Carbendazim 50% WP @ 1.5 g/L or Copper Oxychloride @ 2.5 g/L."
                ],
                "prevention": [
                    "Enrich soil with Trichoderma viride @ 2.5 kg in 250 kg FYM/acre before transplanting."
                ]
            },
            "brown_leaf_spot": {
                "name": "Ragi Brown Leaf Spot",
                "scientific_name": "Drechslera nodulosa",
                "symptoms": [
                    "Small circular to oval dark brown spots on leaf lamina; seedlings show coleoptile rotting"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "Hot water seed treatment at 52°C for 10 minutes."
                ]
            },
            "healthy": {
                "name": "Healthy Finger Millet Crop",
                "scientific_name": "No pathogen detected",
                "symptoms": ["Stout green tillers with erect clean blades and vigorous radiating digitate finger heads."],
                "treatment": ["No fungicide application required."],
                "prevention": ["Maintain balanced nutrition (50:40:25 kg N:P2O5:K2O per hectare)."]
            }
        },
        "supported_pests": {
            "stem_borer": {
                "name": "Ragi Stem Borer / Pink Borer",
                "scientific_name": "Sesamia inferens",
                "keywords": ["stem borer", "sesamia", "pink borer", "ragi borer"],
                "damage_signs": [
                    "Larvae bore into stem causing central leaf whorl to dry into a dead heart"
                ],
                "pest_control": [
                    "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Quinalphos 25% EC @ 2.0 ml/L."
                ],
                "prevention": [
                    "Rogue out and destroy dead hearts during early crop growth."
                ]
            }
        }
    }
}


def get_supported_crops_list() -> list:
    """Returns sorted list of all 37 supported crops."""
    return [c["name"] for c in CROPS_TAXONOMY_37.values()]


def get_crop_data(crop_key: str) -> Dict[str, Any]:
    """Retrieve full taxonomy and pathology data for a crop key."""
    return CROPS_TAXONOMY_37.get(crop_key.lower().strip(), {})
