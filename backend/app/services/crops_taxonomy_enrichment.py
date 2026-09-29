"""
AgriFusion AI — 37-Crop Taxonomy Enrichment & Complete Pathology Parity
=======================================================================
Authentic, peer-reviewed extension dataset ensuring 100% parity with the
official 37-Crop Major Diseases & Pests Directory.

Referenced against:
- ICAR (Indian Council of Agricultural Research) & NCIPM
- FAO Crop Protection Compendium
- Directorate of Plant Protection, Quarantine & Storage (DPPQS)
- State Agricultural Universities (TNAU, PAU, ANGRAU, UAS, CCS HAU)
"""

from typing import Dict, Any

TAXONOMY_ENRICHMENT_DATA: Dict[str, Dict[str, Any]] = {
    "wheat": {
        "diseases": {
            "karnal_bunt": {
                "name": "Wheat Karnal Bunt",
                "scientific_name": "Tilletia indica",
                "symptoms": [
                    "Partial conversion of wheat kernels into a black powdery mass of teliospores",
                    "Characteristic rotten fishy odor due to the production of trimethylamine",
                    "Only a portion of the grain is bunted, usually starting at the embryo point"
                ],
                "treatment": [
                    "Seed treatment with Carboxin 37.5% + Thiram 37.5% DS @ 2.5 g/kg seed or Tebuconazole 2% DS @ 1.5 g/kg seed.",
                    "Foliar spray: Propiconazole 25% EC (Tilt) @ 1.0 ml/L at boot-leaf / earhead emergence."
                ],
                "prevention": [
                    "Sow certified bunt-free seeds; avoid excessive nitrogen fertilization.",
                    "Avoid continuous wheat-after-wheat monoculture in endemic pockets."
                ]
            }
        }
    },
    "maize": {
        "diseases": {
            "stalk_rot": {
                "name": "Maize Stalk Rot",
                "scientific_name": "Fusarium verticillioides / Macrophomina phaseolina",
                "symptoms": [
                    "Premature drying, wilting, and lodging of maize plants during grain filling",
                    "Internal stalk pith shreds, softens, and turns pinkish or charcoal black with disintegrating vascular bundles",
                    "Hollow stalk easily crushes between thumb and forefinger at lower internodes"
                ],
                "treatment": [
                    "Soil drench around root zone with Carbendazim 50% WP @ 1.0 g/L or Copper Oxychloride @ 2.5 g/L.",
                    "Apply Trichoderma viride @ 5 kg/ha mixed with 500 kg well-decomposed FYM at sowing."
                ],
                "prevention": [
                    "Maintain balanced N-P-K nutrition with adequate Potash (K2O) to strengthen stalk rind.",
                    "Avoid moisture stress during flowering and post-flowering grain filling stages."
                ]
            }
        },
        "supported_pests": {
            "maize_aphid": {
                "name": "Maize Aphid",
                "scientific_name": "Rhopalosiphum maidis",
                "keywords": ["aphid", "maize aphid", "rhopalosiphum", "corn aphid", "honeydew"],
                "damage_signs": [
                    "Bluish-green aphid colonies congregated in central whorls, leaf sheaths, and emerging tassels",
                    "Copious excretion of honeydew leading to dense black sooty mold and poor pollen dispersal"
                ],
                "pest_control": [
                    "Conserve natural predators: ladybird beetles (Coccinella septempunctata) and syrphid fly larvae.",
                    "Foliar spray of Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L if infestation is severe."
                ],
                "prevention": [
                    "Early planting with first monsoon showers to avoid mid-season aphid escalation."
                ]
            }
        }
    },
    "cotton": {
        "diseases": {
            "fusarium_wilt": {
                "name": "Cotton Fusarium Wilt",
                "scientific_name": "Fusarium oxysporum f. sp. vasinfectum",
                "symptoms": [
                    "Initial yellowing and vein clearing on cotyledons and leaves starting from bottom upward",
                    "Loss of turgidity, drooping, and complete browning of foliage leading to wilted defoliation",
                    "Dark brown to blackish discoloration of internal vascular ring visible upon splitting stem"
                ],
                "treatment": [
                    "Soil drench around collar zone with Carbendazim 50% WP @ 1.0 g/L or Benomyl @ 1.0 g/L.",
                    "Uproot and burn severely wilted plants to prevent microconidial soil contamination."
                ],
                "prevention": [
                    "Seed treatment with Trichoderma viride @ 4 g/kg seed or Carbendazim @ 2 g/kg seed.",
                    "Grow wilt-resistant cotton cultivars; adopt 3-year rotation with non-host cereal crops."
                ]
            },
            "boll_rot": {
                "name": "Cotton Boll Rot Complex",
                "scientific_name": "Fusarium / Colletotrichum / Aspergillus / Xanthomonas complex",
                "symptoms": [
                    "Small water-soaked circular spots on green bolls enlarging rapidly into dark sunken lesions",
                    "Internal rotting, lint discoloration, and seed destruction before normal boll opening",
                    "Bolls fail to dehisce normally and remain mummified on branches"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L + Mancozeb 75% WP @ 2.0 g/L at early boll formation.",
                    "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L during prolonged wet weather."
                ],
                "prevention": [
                    "Avoid excessive dense vegetative growth by timely shoot topping (detopping at 90-100 DAS).",
                    "Ensure adequate row spacing and manage sucking pests to prevent wound entry points."
                ]
            }
        },
        "supported_pests": {
            "cotton_jassid": {
                "name": "Cotton Jassid / Leafhopper",
                "scientific_name": "Amrasca biguttula biguttula",
                "keywords": ["jassid", "leafhopper", "amrasca", "hopper burn"],
                "damage_signs": [
                    "Nymphs and adults suck phloem sap from leaf undersides, walking sideways characteristically",
                    "Downward curling and yellowing of leaf margins turning reddish-brown necrotic ('hopper burn')"
                ],
                "pest_control": [
                    "Install yellow sticky traps @ 15-20 traps/acre.",
                    "Foliar spray: Flonicamid 50% WG @ 0.3 g/L or Dinotefuran 20% SG @ 0.3 g/L or Diafenthiuron 50% WP @ 1.2 g/L."
                ],
                "prevention": [
                    "Sow hair-dense jassid-resistant cotton hybrids.",
                    "Seed treatment with Imidacloprid 70% WS @ 5 g/kg seed."
                ]
            },
            "cotton_aphid": {
                "name": "Cotton Aphid",
                "scientific_name": "Aphis gossypii",
                "keywords": ["aphid", "cotton aphid", "aphis gossypii", "sooty mold"],
                "damage_signs": [
                    "Colonies of tiny yellowish-green soft insects encrusting tender growing tips and undersides of leaves",
                    "Leaves cup downward, crinkle, and dry up with sticky honeydew attracting sooty mold onto open bolls"
                ],
                "pest_control": [
                    "Spray Acetamiprid 20% SP @ 0.2 g/L or Thiamethoxam 25% WG @ 0.3 g/L.",
                    "Conserve ladybird beetles, syrphid flies, and chrysopid predators."
                ],
                "prevention": [
                    "Avoid early application of broad-spectrum synthetic pyrethroids which wipe out aphid bio-agents."
                ]
            }
        }
    },
    "sugarcane": {
        "diseases": {
            "wilt": {
                "name": "Sugarcane Wilt",
                "scientific_name": "Fusarium sacchari / Cephalosporium sacchari",
                "symptoms": [
                    "Gradual yellowing and withering of crown leaves; stalks become lightweight, hollow, and pith turns dingy red to purple",
                    "Canes shrink and show boat-shaped cavities in the pith without transverse white bands"
                ],
                "treatment": [
                    "Rogue out and destroy wilted cane clumps along with underground stubble.",
                    "Dip setts in Carbendazim 50% WP @ 1.0 g/L for 15 minutes before planting."
                ],
                "prevention": [
                    "Avoid planting setts from wilt-endemic fields; practice 2-year crop rotation with paddy or green manure.",
                    "Provide proper drainage to prevent root asphyxiation during monsoons."
                ]
            },
            "yellow_leaf": {
                "name": "Sugarcane Yellow Leaf Disease (SCYLD)",
                "scientific_name": "Sugarcane yellow leaf virus (SCYLV)",
                "symptoms": [
                    "Characteristic bright yellowing of the midrib on lower surface of 3rd to 6th leaves",
                    "Yellowing spreads to lamina followed by necrosis from leaf tip downward; shortened internodes and stunted cane clumps"
                ],
                "treatment": [
                    "No curative chemical therapy; manage aphid vector Melanaphis sacchari with Imidacloprid 17.8% SL @ 0.3 ml/L.",
                    "Rogue out severely stunted clumps."
                ],
                "prevention": [
                    "Plant virus-tested tissue culture plantlets or AST (aerated steam therapy) treated seed setts.",
                    "Erect yellow sticky traps to detect early aphid vector arrivals."
                ]
            }
        },
        "supported_pests": {
            "sugarcane_leaf_hopper": {
                "name": "Sugarcane Leafhopper / Pyrilla",
                "scientific_name": "Pyrilla perpusilla",
                "keywords": ["pyrilla", "leafhopper", "sugarcane leaf hopper", "white wax"],
                "damage_signs": [
                    "Nymphs and adults suck phloem sap in large numbers from leaf undersides, covered with white waxy tail filaments",
                    "Leaves turn pale yellowish-white and dry; heavy secretion of honeydew spurring black sooty mold"
                ],
                "pest_control": [
                    "Conserve and distribute nymphal ectoparasitoid Epiricania melanoleuca cocoons and egg masses.",
                    "Spray Chlorpyrifos 20% EC @ 2.0 ml/L or Malathion 50% EC @ 1.5 ml/L if parasitoid is absent."
                ],
                "prevention": [
                    "Detrash lower dry leaves periodically to eliminate nymphal shelter.",
                    "Avoid excessive top-dressing of nitrogen fertilizers."
                ]
            },
            "sugarcane_whitefly": {
                "name": "Sugarcane Whitefly",
                "scientific_name": "Aleurolobus barodensis",
                "keywords": ["whitefly", "sugarcane whitefly", "aleurolobus"],
                "damage_signs": [
                    "Thousands of scale-like black nymphs with white fringed margins encrusting lower surface of leaves",
                    "Foliage turns chlorotic yellow to pinkish-purple and dries; thick sooty mold reduces sucrose synthesis"
                ],
                "pest_control": [
                    "Spray Acephate 75% SP @ 1.5 g/L or Dimethoate 30% EC @ 1.5 ml/L directing spray nozzle to leaf undersides.",
                    "Drain stagnant water from waterlogged plots immediately."
                ],
                "prevention": [
                    "Avoid waterlogging and nitrogen deficiency; maintain balanced fertigation."
                ]
            },
            "sugarcane_woolly_aphid": {
                "name": "Sugarcane Woolly Aphid",
                "scientific_name": "Ceratovacuna lanigera",
                "keywords": ["woolly aphid", "ceratovacuna", "white wool"],
                "damage_signs": [
                    "Dense white woolly or powdery colonies completely coating the undersides of sugarcane leaf blades",
                    "Leaves wither, dry up prematurely, and turn black with sooty mold; significant drop in juice quality"
                ],
                "pest_control": [
                    "Release predatory caterpillars Dipha aphidivora or green lacewings Chrysoperla carnea.",
                    "Foliar spray: Thiamethoxam 25% WG @ 0.3 g/L or Dimethoate 30% EC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Destroy initial infested leaves manually before colony spreads across the field."
                ]
            },
            "sugarcane_termite": {
                "name": "Sugarcane Termites",
                "scientific_name": "Odontotermes obesus",
                "keywords": ["termite", "termites", "deemak", "white ants"],
                "damage_signs": [
                    "Termites enter through cut ends of setts and devour soft internal pith and buds, leading to poor germination",
                    "Subterranean root feeding on grown canes causing yellowing, drying, and easy lodging"
                ],
                "pest_control": [
                    "Apply Chlorpyrifos 20% EC @ 2.0 L/acre or Fipronil 0.3% G @ 10 kg/acre in furrows over setts before covering with soil.",
                    "In standing crop: apply Chlorpyrifos with irrigation stream."
                ],
                "prevention": [
                    "Do not apply raw or unrotted farmyard manure; ensure complete decomposition."
                ]
            }
        }
    },
    "soybean": {
        "diseases": {
            "alternaria_leaf_spot": {
                "name": "Soybean Alternaria Leaf Spot",
                "scientific_name": "Alternaria alternata",
                "symptoms": [
                    "Small brown to dark brown circular spots with concentric rings and chlorotic halos on foliage",
                    "Spots coalesce into large irregular necrotic blighted patches causing premature leaf drop"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.0 g/L or Pyraclostrobin 20% WG @ 0.5 g/L.",
                    "Apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L at early infection."
                ],
                "prevention": [
                    "Sow certified pathogen-free seeds; practice crop rotation with non-host crops.",
                    "Ensure adequate row spacing for canopy ventilation."
                ]
            },
            "bacterial_pustule": {
                "name": "Soybean Bacterial Pustule",
                "scientific_name": "Xanthomonas axonopodis pv. glycines",
                "symptoms": [
                    "Small yellowish-green spots with raised blister-like pustules in the center on lower leaf surfaces",
                    "Pustules rupture leaving ragged holes; lesions merge into large brown necrotic dead areas"
                ],
                "treatment": [
                    "Foliar spray of Copper Oxychloride 50% WP @ 2.5 g/L mixed with Streptocycline @ 0.1 g/L."
                ],
                "prevention": [
                    "Plant resistant soybean cultivars (e.g. JS 335, NRC 37).",
                    "Deep ploughing to bury infected crop residue after harvest."
                ]
            },
            "pod_blight": {
                "name": "Soybean Pod Blight / Anthracnose",
                "scientific_name": "Colletotrichum truncatum",
                "symptoms": [
                    "Dark brown to black sunken lesions with tiny black fruiting bodies (acervuli) on pods and stems",
                    "Infected pods fail to fill seeds or produce small, shriveled, moldy seeds"
                ],
                "treatment": [
                    "Spray Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2.0 g/L or Tebuconazole 25.9% EC @ 1.0 ml/L.",
                    "Apply at pod emergence and repeat 15 days later if wet weather persists."
                ],
                "prevention": [
                    "Seed treatment with Thiram 37.5% + Carbendazim 37.5% DS @ 3 g/kg seed before sowing."
                ]
            }
        },
        "supported_pests": {
            "soybean_whitefly": {
                "name": "Soybean Whitefly",
                "scientific_name": "Bemisia tabaci",
                "keywords": ["whitefly", "soybean whitefly", "ymv vector", "bemisia"],
                "damage_signs": [
                    "Nymphs and adults suck phloem sap from leaf undersides, causing foliar mottling and speckling",
                    "Acts as the primary insect vector transmitting Yellow Mosaic Virus (YMV) in soybean fields"
                ],
                "pest_control": [
                    "Install yellow sticky traps @ 15-20 traps/acre.",
                    "Spray Thiamethoxam 25% WG @ 0.3 g/L or Diafenthiuron 50% WP @ 1.2 g/L or Pyriproxyfen 10% EC @ 2.0 ml/L."
                ],
                "prevention": [
                    "Grow YMV-resistant cultivars; avoid staggered plantings in neighboring plots."
                ]
            }
        }
    },
    "chickpea": {
        "diseases": {
            "botrytis_grey_mould": {
                "name": "Chickpea Botrytis Grey Mould",
                "scientific_name": "Botrytis cinerea",
                "symptoms": [
                    "Water-soaked lesions on leaflets, branches, and flowers covered by dense ash-grey fuzzy mold",
                    "Extensive flower drop, pod rotting, and shed of infected floral buds under overcast humid weather"
                ],
                "treatment": [
                    "Spray Carbendazim 12% + Mancozeb 63% WP @ 2.0 g/L or Chlorothalonil 75% WP @ 2.0 g/L.",
                    "Apply Propiconazole 25% EC @ 1.0 ml/L at first appearance of flower blight."
                ],
                "prevention": [
                    "Maintain wide row spacing (45 cm) to facilitate canopy aeration and reduce relative humidity.",
                    "Avoid excessive dense vegetative growth by moderating irrigation."
                ]
            }
        }
    },
    "pigeonpeas": {
        "supported_pests": {
            "pigeonpea_pod_fly": {
                "name": "Pigeonpea Pod Fly",
                "scientific_name": "Melanagromyza obtusa",
                "keywords": ["pod fly", "melanagromyza", "maggot", "seed borer"],
                "damage_signs": [
                    "Maggots feed entirely within the pod, excavating grooves into developing green seeds",
                    "Damage remains invisible from the outside until the adult fly cuts a neat exit hole to emerge"
                ],
                "pest_control": [
                    "Foliar spray: Monocrotophos 36% SL @ 1.5 ml/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L at pod initiation.",
                    "Spray Neem seed kernel extract (NSKE 5%) at 50% flowering stage."
                ],
                "prevention": [
                    "Cultivate pod fly-tolerant or early-maturing pigeonpea cultivars."
                ]
            },
            "pigeonpea_pod_bug": {
                "name": "Pigeonpea Pod Bug",
                "scientific_name": "Clavigralla gibbosa",
                "keywords": ["pod bug", "clavigralla", "coreid bug"],
                "damage_signs": [
                    "Nymphs and adults pierce green pods and suck sap from developing seeds",
                    "Seeds shrivel, turn black, and develop resinous puncture marks, losing germination viability"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Quinalphos 25% EC @ 2.0 ml/L.",
                    "Shake plants in early morning over a collection sheet to dislodge and eliminate sluggish bugs."
                ],
                "prevention": [
                    "Maintain clean weed-free borders around the field."
                ]
            },
            "blister_beetle": {
                "name": "Blister Beetle",
                "scientific_name": "Mylabris phalerata",
                "keywords": ["blister beetle", "mylabris", "flower feeder"],
                "damage_signs": [
                    "Conspicuous black and red/orange banded beetles voraciously chew petals, floral buds, and tender pods",
                    "Severe flower destruction resulting in failure of pod setting"
                ],
                "pest_control": [
                    "Hand-collect beetles wearing protective gloves in the cool morning hours and destroy in kerosene water.",
                    "Spray Malathion 50% EC @ 2.0 ml/L or Quinalphos 25% EC @ 2.0 ml/L if infestation is severe."
                ],
                "prevention": [
                    "Set up light traps at night to trap adult beetles."
                ]
            }
        }
    },
    "blackgram": {
        "diseases": {
            "anthracnose": {
                "name": "Blackgram Anthracnose",
                "scientific_name": "Colletotrichum lindemuthianum",
                "symptoms": [
                    "Circular dark brown sunken necrotic spots with raised purple boundaries on leaf lamina and stems",
                    "Pods develop circular sunken lesions with pinkish gelatinous spore ooze during wet weather"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.0 g/L or Carbendazim 50% WP @ 1.0 g/L.",
                    "Apply Azoxystrobin 23% SC @ 1.0 ml/L at first onset of foliar spots."
                ],
                "prevention": [
                    "Seed treatment with Carbendazim 50% WP @ 2 g/kg seed before sowing."
                ]
            }
        },
        "supported_pests": {
            "hairy_caterpillar": {
                "name": "Bihar Hairy Caterpillar",
                "scientific_name": "Spilosoma obliqua",
                "keywords": ["hairy caterpillar", "spilosoma", "bihar hairy caterpillar", "skeletonizer"],
                "damage_signs": [
                    "Gregarious young orange-yellow hairy larvae scrape the green matter, skeletonizing leaves into paper-thin webs",
                    "Older solitary larvae devour the entire leaf blade and green pods rapidly"
                ],
                "pest_control": [
                    "Collect and destroy leaves with gregarious young larval colonies.",
                    "Spray Chlorpyrifos 20% EC @ 2.5 ml/L or Quinalphos 25% EC @ 2.0 ml/L in evening."
                ],
                "prevention": [
                    "Dig a 30 cm deep isolation trench around infested plots and dust with Malathion 5% dust."
                ]
            }
        }
    },
    "mungbean": {
        "diseases": {
            "cercospora_leaf_spot": {
                "name": "Mungbean Cercospora Leaf Spot",
                "scientific_name": "Cercospora canescens",
                "symptoms": [
                    "Circular to irregular necrotic spots with greyish-white center and distinct reddish-brown borders",
                    "Lesions coalesce, causing leaf chlorosis and premature defoliation under high relative humidity"
                ],
                "treatment": [
                    "Spray Carbendazim 50% WP @ 1.0 g/L or Mancozeb 75% WP @ 2.0 g/L.",
                    "Spray Hexaconazole 5% SC @ 1.0 ml/L at flowering initiation."
                ],
                "prevention": [
                    "Use certified disease-free seeds; practice crop rotation with cereals."
                ]
            }
        },
        "supported_pests": {
            "mungbean_stem_fly": {
                "name": "Mungbean Stem Fly",
                "scientific_name": "Ophiomyia phaseoli",
                "keywords": ["stem fly", "ophiomyia", "collar swelling", "seedling fly"],
                "damage_signs": [
                    "Maggots tunnel down the petiole into the collar region of young seedlings",
                    "Stem swells, cracks longitudinally, and turns brown, causing yellowing, drooping, and seedling death"
                ],
                "pest_control": [
                    "Seed treatment with Thiamethoxam 30 FS @ 5 ml/kg seed before sowing.",
                    "Foliar spray: Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L at 7-10 days after germination."
                ],
                "prevention": [
                    "Timely synchronous sowing with monsoon arrival; provide light earthing up to protect collar."
                ]
            }
        }
    },
    "lentil": {
        "supported_pests": {
            "lentil_aphid": {
                "name": "Lentil Aphid",
                "scientific_name": "Aphis craccivora",
                "keywords": ["aphid", "lentil aphid", "aphis craccivora", "black aphid"],
                "damage_signs": [
                    "Dense colonies of small blackish-brown aphids clustering on tender growing tips, flower buds, and pods",
                    "Sap sucking causes curling of leaflets, stunted growth, and sticky honeydew attracting sooty mold"
                ],
                "pest_control": [
                    "Conserve ladybird beetles and syrphid fly larvae.",
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L if aphid colonies persist."
                ],
                "prevention": [
                    "Early sowing in late October to complete flowering before peak aphid multiplication in February."
                ]
            },
            "lentil_thrips": {
                "name": "Lentil Thrips",
                "scientific_name": "Caliothrips indicus",
                "keywords": ["thrips", "lentil thrips", "silvery leaf", "caliothrips"],
                "damage_signs": [
                    "Rasping and sucking of tender foliage causing silvery speckling, leaf curl, and blossom drop"
                ],
                "pest_control": [
                    "Spray Quinalphos 25% EC @ 1.5 ml/L or Fipronil 5% SC @ 1.0 ml/L.",
                    "Install blue sticky traps @ 10 traps/acre."
                ],
                "prevention": [
                    "Maintain adequate soil moisture during vegetative growth to deter thrips build-up."
                ]
            }
        }
    },
    "kidneybeans": {
        "diseases": {
            "angular_leaf_spot": {
                "name": "Kidneybean Angular Leaf Spot",
                "scientific_name": "Phaeoisariopsis griseola",
                "symptoms": [
                    "Small greyish to brown angular spots strictly delimited by leaf veins giving a mosaic checkerboard appearance",
                    "Premature defoliation; circular sunken spots on green pods with grey fungal centers"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.0 g/L or Carbendazim 50% WP @ 1.0 g/L.",
                    "Apply Azoxystrobin 23% SC @ 1.0 ml/L at first sign of angular spots."
                ],
                "prevention": [
                    "Crop rotation of at least two seasons away from Phaseolus species; use certified clean seed."
                ]
            },
            "kidneybean_rust": {
                "name": "Kidneybean Rust",
                "scientific_name": "Uromyces appendiculatus",
                "symptoms": [
                    "Small, circular reddish-brown powdery uredinial pustules primarily on leaf undersides",
                    "Pustules surrounded by a light chlorotic yellow halo; severe infection causes leaf drying and drop"
                ],
                "treatment": [
                    "Spray Propiconazole 25% EC @ 1.0 ml/L or Wettable Sulphur 80% WP @ 2.5 g/L.",
                    "Spray Mancozeb 75% WP @ 2.0 g/L at 10-day intervals."
                ],
                "prevention": [
                    "Destroy volunteer bean plants and crop residue after harvest."
                ]
            }
        }
    },
    "mothbeans": {
        "diseases": {
            "powdery_mildew": {
                "name": "Mothbean Powdery Mildew",
                "scientific_name": "Erysiphe polygoni",
                "symptoms": [
                    "White powdery talcum-like patches developing on leaves, stems, and pods",
                    "Patches coalesce covering entire leaves; foliage turns yellow, necrotic, and drops prematurely"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Dinocap 48% EC @ 1.0 ml/L.",
                    "Apply Hexaconazole 5% EC @ 1.0 ml/L if infection appears during flowering."
                ],
                "prevention": [
                    "Early sowing with optimal spacing to avoid high evening relative humidity."
                ]
            }
        },
        "supported_pests": {
            "mothbean_thrips": {
                "name": "Mothbean Thrips",
                "scientific_name": "Caliothrips indicus",
                "keywords": ["thrips", "mothbean thrips", "silvery leaf", "leaf curling"],
                "damage_signs": [
                    "Rasping of leaf surface causing silvery-white streaks and upward curling of leaflets",
                    "Stunted shoot growth and premature blossom drop in dry arid weather"
                ],
                "pest_control": [
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Neem oil (10,000 ppm) @ 3 ml/L.",
                    "Install blue sticky traps @ 10 traps/acre."
                ],
                "prevention": [
                    "Ensure timely light irrigation to alleviate dryland moisture stress."
                ]
            }
        }
    },
    "groundnut": {
        "diseases": {
            "stem_rot": {
                "name": "Groundnut Stem / Collar Rot",
                "scientific_name": "Sclerotium rolfsii",
                "symptoms": [
                    "Yellowing and sudden wilting of primary lateral branches and central shoot",
                    "White fan-like mycelial felt spreading around stem collar at soil line, studded with mustard-seed-like brown sclerotia",
                    "Infected peg and pod stems rot, leaving pods detached in the soil during harvest"
                ],
                "treatment": [
                    "Drench stem base with Tebuconazole 25.9% EC @ 1.0 ml/L or Hexaconazole 5% SC @ 2.0 ml/L.",
                    "Apply Trichoderma viride @ 5 kg/ha enriched in farmyard manure."
                ],
                "prevention": [
                    "Seed treatment with Trichoderma viride @ 5 g/kg seed or Saaf (Carbendazim + Mancozeb @ 2 g/kg seed).",
                    "Deep summer ploughing to bury sclerotia beyond the active root zone."
                ]
            }
        },
        "supported_pests": {
            "groundnut_thrips": {
                "name": "Groundnut Thrips",
                "scientific_name": "Scirtothrips dorsalis / Frankliniella schultzei",
                "keywords": ["thrips", "groundnut thrips", "pbnv vector", "leaf puckering"],
                "damage_signs": [
                    "Silvery feeding scars, puckering, and upward curling of young expanding leaves",
                    "Acts as the vector transmitting destructive Peanut Bud Necrosis Virus (PBNV)"
                ],
                "pest_control": [
                    "Foliar spray: Dimethoate 30% EC @ 1.5 ml/L or Fipronil 5% SC @ 1.5 ml/L or Imidacloprid @ 0.3 ml/L.",
                    "Install blue sticky traps @ 10 traps/acre."
                ],
                "prevention": [
                    "Intercrop with pearl millet (7:1 ratio) to create a barrier against immigrant thrips vectors."
                ]
            }
        }
    },
    "mustard": {
        "diseases": {
            "sclerotinia_stem_rot": {
                "name": "Mustard Sclerotinia Stem Rot",
                "scientific_name": "Sclerotinia sclerotiorum",
                "symptoms": [
                    "Water-soaked elongated lesions on stem turning bleached paper-white and chalky",
                    "Stems shred easily and lodge; split stems reveal large, black, hard irregular sclerotial bodies inside the hollow pith"
                ],
                "treatment": [
                    "Foliar spray: Carbendazim 50% WP @ 1.0 g/L or Thiophanate-Methyl 70% WP @ 1.0 g/L at initiation of flowering.",
                    "Rogue out and destroy infected lodged plants to prevent sclerotia from entering soil."
                ],
                "prevention": [
                    "Practice 3-year crop rotation with non-host graminaceous crops (wheat, barley).",
                    "Avoid excessive vegetative density and over-irrigation during flowering."
                ]
            }
        }
    },
    "tomato": {
        "diseases": {
            "bacterial_wilt": {
                "name": "Tomato Bacterial Wilt",
                "scientific_name": "Ralstonia solanacearum",
                "symptoms": [
                    "Rapid, sudden daytime wilting of entire plant without initial chlorosis or leaf yellowing",
                    "Cut stem ends immersed in a glass of clear water produce thick, milky-white bacterial streaming threads"
                ],
                "treatment": [
                    "No curative chemical therapy once vascular system is blocked; uproot and burn wilted plants immediately.",
                    "Drench surrounding soil with Copper Oxychloride 50% WP @ 3.0 g/L + Streptocycline @ 0.1 g/L."
                ],
                "prevention": [
                    "Grow resistant cultivars (e.g. Arka Rakshak, Arka Samrat).",
                    "Raise soil pH with agricultural lime (2-3 tonnes/ha) in acidic soils; rotate with corn or sugarcane."
                ]
            }
        },
        "supported_pests": {
            "tomato_aphid": {
                "name": "Tomato Foliar Aphid",
                "scientific_name": "Myzus persicae",
                "keywords": ["aphid", "tomato aphid", "myzus", "honeydew", "virus vector"],
                "damage_signs": [
                    "Dense colonies sucking phloem sap on tender shoots, flower clusters, and undersides of leaves",
                    "Curling of leaves, stunting of terminal shoots, and honeydew secretion promoting sooty mold"
                ],
                "pest_control": [
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.",
                    "Install yellow sticky traps @ 15 traps/acre."
                ],
                "prevention": [
                    "Conserve ladybird beetles and avoid broad-spectrum pyrethroid sprays."
                ]
            }
        }
    },
    "potato": {
        "diseases": {
            "bacterial_wilt": {
                "name": "Potato Bacterial Wilt / Brown Rot",
                "scientific_name": "Ralstonia solanacearum",
                "symptoms": [
                    "Rapid wilting and stunting of foliage with bronzed leaves and downward curling",
                    "Cross-section of harvested tubers shows brown vascular ring that oozes white bacterial slime when gently squeezed"
                ],
                "treatment": [
                    "Eradicate infected plants immediately; drench surrounding soil with Bleaching powder @ 10 kg/ha or Copper Oxychloride @ 3.0 g/L."
                ],
                "prevention": [
                    "Plant only certified disease-free seed tubers from wilt-free certified hill seed tracts.",
                    "Practice 3-year crop rotation with maize, sorghum, or paddy; avoid solanaceous rotation."
                ]
            },
            "common_scab": {
                "name": "Potato Common Scab",
                "scientific_name": "Streptomyces scabies",
                "symptoms": [
                    "Rough, raised circular corky or pitted brownish-black scab-like eruptions on tuber skin",
                    "Skin lesions impair market appeal and grade, though deep flesh remains intact"
                ],
                "treatment": [
                    "Dip seed tubers in Boric Acid 3% solution for 30 minutes or Mancozeb @ 2.5 g/L before cold storage/planting."
                ],
                "prevention": [
                    "Maintain soil pH slightly acidic (5.2-5.5); avoid heavy liming.",
                    "Ensure adequate soil moisture during the tuber initiation stage (4-6 weeks after planting)."
                ]
            }
        }
    },
    "onion": {
        "diseases": {
            "downy_mildew": {
                "name": "Onion Downy Mildew",
                "scientific_name": "Peronospora destructor",
                "symptoms": [
                    "Pale green to yellowish oval lesions on older leaves covered with violet-grey downy felt in humid morning hours",
                    "Leaf tips collapse, turn pale white, and break over, resulting in stunted small bulbs"
                ],
                "treatment": [
                    "Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L with agricultural wetting agent/sticker.",
                    "Spray Dimethomorph 50% WP @ 1.0 g/L or Cymoxanil + Mancozeb @ 2.0 g/L."
                ],
                "prevention": [
                    "Orient rows in the direction of prevailing wind to maximize foliar air circulation.",
                    "Avoid overhead sprinkler irrigation; destroy volunteer onion culls."
                ]
            }
        }
    },
    "banana": {
        "diseases": {
            "bacterial_soft_rot": {
                "name": "Banana Bacterial Soft Rot / Head Rot",
                "scientific_name": "Dickeya dadantii / Pectobacterium carotovorum",
                "symptoms": [
                    "Water-soaked decaying pseudostem collar and rhizome emitting a pungent rotting odor",
                    "Yellowing of leaves, central leaf collapse, and sudden toppling of the entire banana pseudostem"
                ],
                "treatment": [
                    "Drench pseudostem collar with Copper Oxychloride 50% WP @ 3.0 g/L + Streptocycline @ 0.1 g/L.",
                    "Apply Bleaching powder @ 15 g/plant in the root basin."
                ],
                "prevention": [
                    "Ensure good plantation drainage; plant suckers on raised beds in flood-prone lands.",
                    "Dip suckers in 0.1% Emisan / Streptocycline solution before planting."
                ]
            }
        }
    },
    "mango": {
        "diseases": {
            "malformation": {
                "name": "Mango Malformation",
                "scientific_name": "Fusarium moniliforme var. subglutinans",
                "symptoms": [
                    "Vegetative malformation: compact bunchy top of stunted shoots with small crowded leaves in seedlings",
                    "Floral malformation: flower panicles become thick, crowded, fleshy, and highly hypertrophied with zero fruit set"
                ],
                "treatment": [
                    "Prune malformed panicles along with 15-20 cm of healthy twig tissue and burn promptly.",
                    "Foliar spray of NAA (200 ppm) in the first week of October to induce normal panicles."
                ],
                "prevention": [
                    "Dip scion sticks in Carbendazim (1 g/L) before grafting; use certified nursery stock."
                ]
            },
            "dieback": {
                "name": "Mango Dieback",
                "scientific_name": "Lasiodiplodia theobromae",
                "symptoms": [
                    "Drying and withering of twigs and branches progressing downwards from the tip ('dieback')",
                    "Leaves turn brown, roll up, and remain hanging on dead twigs; dark brown discoloration under bark"
                ],
                "treatment": [
                    "Prune affected branches 5-8 cm below the dead margin; paint cut surfaces with Bordeaux paste (1:1:10).",
                    "Spray Copper Oxychloride 50% WP @ 3.0 g/L or Thiophanate-Methyl @ 1.0 g/L."
                ],
                "prevention": [
                    "Maintain tree vigor with balanced N-P-K and avoid root damage during intercultivation."
                ]
            }
        },
        "supported_pests": {
            "inflorescence_midge": {
                "name": "Mango Inflorescence Midge",
                "scientific_name": "Erosomyia mangiferae",
                "keywords": ["midge", "mango midge", "inflorescence midge", "erosomyia"],
                "damage_signs": [
                    "Minute maggots bore into tender blossom buds, flower axis, and newly formed pea-size fruits",
                    "Panicles turn black, bend, dry up, and young fruitlets drop prematurely"
                ],
                "pest_control": [
                    "Foliar spray: Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L at bud burst.",
                    "Deep ploughing around tree basins in winter to expose diapausing pupae to sun and predatory birds."
                ],
                "prevention": [
                    "Conserve natural platygastrid parasitoids."
                ]
            },
            "stone_weevil": {
                "name": "Mango Stone Weevil",
                "scientific_name": "Sternochetus mangiferae",
                "keywords": ["stone weevil", "mango weevil", "sternochetus", "seed borer"],
                "damage_signs": [
                    "Female weevil oviposits on marble-sized fruit skin; grub tunnels into the stone to consume cotyledons",
                    "Internal seed damage leads to rotting of fruit pulp adjacent to the stone at ripening"
                ],
                "pest_control": [
                    "Spray Deltamethrin 2.8% EC @ 0.5 ml/L or Chlorpyrifos 20% EC @ 2.0 ml/L at marble-fruit stage.",
                    "Collect and deeply bury or destroy all fallen stones and fruit refuse after harvest."
                ],
                "prevention": [
                    "Practice orchard sanitation and post-harvest hot water fruit treatment."
                ]
            }
        }
    },
    "papaya": {
        "diseases": {
            "powdery_mildew": {
                "name": "Papaya Powdery Mildew",
                "scientific_name": "Oidium caricae",
                "symptoms": [
                    "White powdery mycelial patches on underside of leaves and young green fruit surfaces",
                    "Leaves turn chlorotic yellow and drop; fruit develops rough circular corky scars"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.0 g/L or Hexaconazole 5% EC @ 1.0 ml/L.",
                    "Spray Dinocap 48% EC @ 1.0 ml/L during high disease pressure."
                ],
                "prevention": [
                    "Avoid overly dense planting and maintain proper sunlight penetration in the orchard."
                ]
            },
            "damping_off": {
                "name": "Papaya Damping-Off & Foot Rot",
                "scientific_name": "Pythium aphanidermatum / Phytophthora palmivora",
                "symptoms": [
                    "Water-soaking and collapse of tender seedlings at soil line in nursery beds",
                    "Stem collar of mature trees becomes soft, spongy, water-soaked, and cracks, causing tree collapse"
                ],
                "treatment": [
                    "Drench nursery beds and tree collar with Metalaxyl + Mancozeb (Ridomil MZ @ 2.0 g/L).",
                    "Drench with Copper Oxychloride 50% WP @ 3.0 g/L."
                ],
                "prevention": [
                    "Plant papaya strictly on raised ridges or mounds (30-40 cm high); avoid waterlogging."
                ]
            }
        },
        "supported_pests": {
            "papaya_fruit_fly": {
                "name": "Papaya Fruit Fly",
                "scientific_name": "Bactrocera papayae",
                "keywords": ["fruit fly", "bactrocera", "maggot", "fruit puncture"],
                "damage_signs": [
                    "Puncture wounds with oozing latex droplets on green fruit surfaces",
                    "Maggots feed within the pulp causing internal liquefaction, yellowing, and premature fruit fall"
                ],
                "pest_control": [
                    "Install methyl eugenol pheromone traps @ 6-8 traps/acre.",
                    "Apply bait spray (Protein hydrolysate 10 g + Malathion 50 EC 2 ml per liter of water) onto foliage."
                ],
                "prevention": [
                    "Harvest papaya fruits at color-break stage (first yellow streak) to avoid fruit fly oviposition."
                ]
            }
        }
    },
    "apple": {
        "diseases": {
            "fire_blight": {
                "name": "Apple Fire Blight",
                "scientific_name": "Erwinia amylovora",
                "symptoms": [
                    "Blossoms, leaves, and terminal twigs wilt rapidly and turn blackened, looking as if scorched by fire",
                    "Characteristic shepherd's crook curved tip on young blighted shoots; amber bacterial slime oozing in warm humid weather"
                ],
                "treatment": [
                    "Prune affected shoots 30 cm below the visible blight margin during dry weather; sterilize shears with 70% ethanol.",
                    "Spray Streptocycline @ 0.1 g/L or Copper Oxychloride @ 2.0 g/L during bloom."
                ],
                "prevention": [
                    "Avoid high-nitrogen fertilizer applications that promote succulent vegetative flushes."
                ]
            },
            "alternaria_blotch": {
                "name": "Apple Alternaria Blotch",
                "scientific_name": "Alternaria mali",
                "symptoms": [
                    "Circular brown spots (2-5 mm) with distinct dark purple margins on leaf lamina",
                    "Severe foliar defoliation and small, dark, corky indented lesions on developing fruit skin"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Pyraclostrobin 20% WG @ 0.5 g/L.",
                    "Apply Difenoconazole 25% EC @ 0.5 ml/L at petal fall stage."
                ],
                "prevention": [
                    "Prune dense tree canopy to ensure rapid drying of foliage after rain."
                ]
            },
            "canker": {
                "name": "Apple Canker",
                "scientific_name": "Valsa ceratosperma / Botryosphaeria obtusa",
                "symptoms": [
                    "Sunken, discolored elliptical cankers on bark of scaffold limbs and trunk",
                    "Bark cracks, loosens, and shows concentric zones of pinhead black fruiting bodies; dieback above canker"
                ],
                "treatment": [
                    "Scrape away diseased bark until clean white wood is reached; apply Chaubattia paste (Copper carbonate + Red lead + Linseed oil).",
                    "Spray Copper Oxychloride 50% WP @ 3.0 g/L after leaf fall in autumn."
                ],
                "prevention": [
                    "Protect trunks from winter sunscald and frost cracks by applying white lime wash."
                ]
            }
        },
        "supported_pests": {
            "european_red_mite": {
                "name": "Apple European Red Mite",
                "scientific_name": "Panonychus ulmi",
                "keywords": ["mite", "red mite", "panonychus", "bronzing"],
                "damage_signs": [
                    "Nymphs and adults feed on chlorophyll, turning leaf blades bronze, rusty brown, and dull chlorotic",
                    "Premature leaf drop impairs fruit sizing and compromises flower bud initiation for the next season"
                ],
                "pest_control": [
                    "Apply Tree Spray Oil (TSO @ 2%) at delayed dormant / green tip stage to kill overwintering eggs.",
                    "Foliar spray: Spiromesifen 22.9% SC @ 0.7 ml/L or Propargite 57% EC @ 2.0 ml/L in summer."
                ],
                "prevention": [
                    "Conserve phytoseiid predatory mites and avoid broad-spectrum pyrethroid sprays."
                ]
            }
        }
    },
    "grapes": {
        "diseases": {
            "bacterial_leaf_spot": {
                "name": "Grapevine Bacterial Leaf Spot / Canker",
                "scientific_name": "Xanthomonas ampelina",
                "symptoms": [
                    "Angular water-soaked dark brown spots on leaves surrounded by yellow halos",
                    "Linear cracked cankers on young shoots causing shoot tip dieback and cluster drying"
                ],
                "treatment": [
                    "Spray Streptocycline @ 0.1 g/L + Copper Oxychloride 50% WP @ 2.5 g/L.",
                    "Spray Kasugamycin 3% SL @ 2.0 ml/L at first onset of shoot cankers."
                ],
                "prevention": [
                    "Prune and destroy infected canes; sanitize secateurs with disinfectant."
                ]
            },
            "botrytis_bunch_rot": {
                "name": "Grapevine Botrytis Bunch Rot / Grey Mould",
                "scientific_name": "Botrytis cinerea",
                "symptoms": [
                    "Soft water-soaked brown rotting of ripening berries in compact grape bunches",
                    "Bunches covered under humid conditions with an ash-grey velvety fur of fungal spores"
                ],
                "treatment": [
                    "Spray Fenhexamid 50% SC @ 1.0 ml/L or Iprodione 50% WP @ 2.0 g/L at berry touch and veraison.",
                    "Spray Tebuconazole 25.9% EC @ 0.7 ml/L."
                ],
                "prevention": [
                    "De-leaf cluster zone around bunches to promote sunlight penetration and air movement."
                ]
            }
        },
        "supported_pests": {
            "grape_fruit_fly": {
                "name": "Grape Berry Fruit Fly",
                "scientific_name": "Drosophila melanogaster",
                "keywords": ["fruit fly", "drosophila", "sour rot", "vinegar fly"],
                "damage_signs": [
                    "Flies lay eggs in cracked, bird-pecked, or thin-skinned ripening berries",
                    "Maggots liquefy berry pulp, introducing acetic acid bacteria leading to sour rot and vinegar odor"
                ],
                "pest_control": [
                    "Install vinegar/yeast bait traps in the vineyard perimeter.",
                    "Foliar spray of Spinosad 45% SC @ 0.3 ml/L or Malathion 50% EC @ 1.5 ml/L."
                ],
                "prevention": [
                    "Harvest grape bunches promptly at optimal maturity; remove split or damaged berries."
                ]
            }
        }
    },
    "pomegranate": {
        "diseases": {
            "pomegranate_wilt": {
                "name": "Pomegranate Ceratocystis Wilt",
                "scientific_name": "Ceratocystis fimbriata",
                "symptoms": [
                    "Yellowing and wilting of foliage on a single branch, progressing systematically across the whole tree",
                    "Dark brown or purple-black vascular streaking and cross-sectional staining in the rootstock and trunk"
                ],
                "treatment": [
                    "Drench tree basin with Propiconazole 25% EC @ 2.0 ml/L or Carbendazim @ 2.0 g/L + Chlorpyrifos @ 3.0 ml/L.",
                    "Uproot and burn dead trees along with root systems; sanitize pit with lime."
                ],
                "prevention": [
                    "Use disease-free tissue culture plantlets or rooted cuttings from certified wilt-free nurseries.",
                    "Avoid excessive flood irrigation which spreads fungal spores from tree to tree."
                ]
            }
        },
        "supported_pests": {
            "pomegranate_whitefly": {
                "name": "Pomegranate Whitefly",
                "scientific_name": "Siphoninus phillyreae",
                "keywords": ["whitefly", "pomegranate whitefly", "siphoninus", "sooty mold"],
                "damage_signs": [
                    "Dense nymphal colonies on leaf undersides sucking sap, leading to leaf yellowing and curling",
                    "Heavy honeydew secretion promoting dense black sooty mold on leaves and fruit rind"
                ],
                "pest_control": [
                    "Spray Diafenthiuron 50% WP @ 1.2 g/L or Pyriproxyfen 10% EC @ 1.5 ml/L.",
                    "Install yellow sticky traps @ 15 traps/acre."
                ],
                "prevention": [
                    "Conserve aphelinid parasitoid Encarsia inermis."
                ]
            }
        }
    },
    "watermelon": {
        "diseases": {
            "fusarium_wilt": {
                "name": "Watermelon Fusarium Wilt",
                "scientific_name": "Fusarium oxysporum f. sp. niveum",
                "symptoms": [
                    "Daytime wilting of runners with partial recovery at night, progressing to permanent collapse",
                    "Dark brown vascular ring visible inside split taproot and crown stem"
                ],
                "treatment": [
                    "Drench root basin with Carbendazim 50% WP @ 1.0 g/L or Trichoderma harzianum @ 10 g/plant."
                ],
                "prevention": [
                    "Graft watermelon scions onto Fusarium-resistant bottle gourd or pumpkin rootstocks.",
                    "Practice 4-5 year crop rotation away from cucurbitaceous crops."
                ]
            }
        },
        "supported_pests": {
            "watermelon_thrips": {
                "name": "Watermelon Thrips",
                "scientific_name": "Thrips palmi",
                "keywords": ["thrips", "watermelon thrips", "thrips palmi", "silvering"],
                "damage_signs": [
                    "Silvery feeding scars and bronzing on leaf undersides; upward crinkling of vine growing tips",
                    "Russeting and scarring of young melon rind reducing marketable value"
                ],
                "pest_control": [
                    "Spray Spinetoram 11.7% SC @ 0.8 ml/L or Fipronil 5% SC @ 1.5 ml/L.",
                    "Install blue sticky traps @ 15 traps/acre."
                ],
                "prevention": [
                    "Use silver-black reflective plastic mulch to disorient immigrant thrips."
                ]
            }
        }
    },
    "muskmelon": {
        "diseases": {
            "anthracnose": {
                "name": "Muskmelon Anthracnose",
                "scientific_name": "Colletotrichum orbiculare",
                "symptoms": [
                    "Circular water-soaked reddish-brown spots on leaves; sunken circular lesions on fruit rind",
                    "Under humid conditions, fruit lesions produce salmon-pink slimy spore masses"
                ],
                "treatment": [
                    "Spray Chlorothalonil 75% WP @ 2.0 g/L or Mancozeb 75% WP @ 2.5 g/L.",
                    "Spray Azoxystrobin 23% SC @ 1.0 ml/L at first lesion appearance."
                ],
                "prevention": [
                    "Seed treatment with Thiram 75% WP @ 3 g/kg seed; avoid overhead irrigation."
                ]
            },
            "gummy_stem_blight": {
                "name": "Muskmelon Gummy Stem Blight",
                "scientific_name": "Didymella bryoniae",
                "symptoms": [
                    "Circular brown foliar lesions with concentric rings; cracked stem cankers oozing reddish-brown amber gummy sap",
                    "Vines wilt and die prematurely when collar stem is girdled"
                ],
                "treatment": [
                    "Spray Azoxystrobin 23% SC @ 1.0 ml/L or Tebuconazole 25.9% EC @ 1.0 ml/L.",
                    "Spray Mancozeb 75% WP @ 2.5 g/L."
                ],
                "prevention": [
                    "2-3 year crop rotation away from cucurbits; destroy vine residue after harvest."
                ]
            }
        },
        "supported_pests": {
            "muskmelon_mites": {
                "name": "Muskmelon Red Spider Mites",
                "scientific_name": "Tetranychus urticae",
                "keywords": ["mite", "spider mite", "tetranychus", "webbing"],
                "damage_signs": [
                    "Fine chlorotic stippling and yellow speckling on upper leaf lamina",
                    "Fine silken webbing on leaf undersides; leaves turn bronze, desiccate, and drop under hot dry conditions"
                ],
                "pest_control": [
                    "Spray Spiromesifen 22.9% SC @ 1.0 ml/L or Wettable Sulphur 80% WP @ 2.5 g/L.",
                    "Spray Fenazaquin 10% EC @ 2.0 ml/L."
                ],
                "prevention": [
                    "Eliminate dry grassy weeds from field borders."
                ]
            }
        }
    },
    "orange": {
        "diseases": {
            "citrus_tristeza": {
                "name": "Citrus Tristeza Virus (CTV)",
                "scientific_name": "Citrus tristeza closterovirus",
                "symptoms": [
                    "Quick decline of sweet orange grafted on sour orange; vein clearing on lime leaves and stem pitting under bark",
                    "Severe chlorosis, root dieback, and stunted small fruit development"
                ],
                "treatment": [
                    "No chemical cure; eradicate severely declined trees and spray Imidacloprid (0.3 ml/L) for aphid vector control."
                ],
                "prevention": [
                    "Use CTV-tolerant rootstocks (Rangpur lime, Rough lemon, Troyer citrange); use certified virus-free budwood."
                ]
            },
            "citrus_anthracnose": {
                "name": "Citrus Anthracnose / Wither Tip",
                "scientific_name": "Colletotrichum gloeosporioides",
                "symptoms": [
                    "Dieback of young twigs from the tips downward ('wither tip') with silvery grey dead wood",
                    "Brown sunken lesions on fruit rind and tear-staining patterns from dripping rainwater"
                ],
                "treatment": [
                    "Prune dead twigs 5-10 cm below infection mark; spray Copper Oxychloride 50% WP @ 2.5 g/L.",
                    "Spray Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Apply copper wash following monsoon pruning."
                ]
            }
        },
        "supported_pests": {
            "citrus_aphid": {
                "name": "Citrus Black Aphid",
                "scientific_name": "Toxoptera citricida",
                "keywords": ["aphid", "citrus aphid", "toxoptera", "ctv vector"],
                "damage_signs": [
                    "Shiny black colonies encrusting tender new growth flushes and blossom buds",
                    "Leaf curling, stunting, and transmission of destructive Citrus Tristeza Virus (CTV)"
                ],
                "pest_control": [
                    "Spray Thiamethoxam 25% WG @ 0.3 g/L or Dimethoate 30% EC @ 1.5 ml/L.",
                    "Conserve syrphid and coccinellid predators."
                ],
                "prevention": [
                    "Avoid high nitrogen fertilizer top-dressing during new flush flushes."
                ]
            },
            "citrus_scale": {
                "name": "Citrus Scale Insects / Red Scale",
                "scientific_name": "Aonidiella aurantii",
                "keywords": ["scale", "citrus scale", "aonidiella", "red scale"],
                "damage_signs": [
                    "Circular reddish-brown scale armor encrusting twigs, leaves, and fruit rind",
                    "Chlorotic yellow halos on leaves; fruit blemishes reducing export and market grade"
                ],
                "pest_control": [
                    "Spray Horticultural Mineral Oil (HMO @ 1.5-2.0%) or Chlorpyrifos 20% EC @ 2.0 ml/L.",
                    "Release parasitoid Aphytis melinus."
                ],
                "prevention": [
                    "Prune dense interior twigs to enhance light penetration."
                ]
            }
        }
    },
    "coconut": {
        "diseases": {
            "bud_rot": {
                "name": "Coconut Bud Rot",
                "scientific_name": "Phytophthora palmivora",
                "symptoms": [
                    "Central spindle leaf loses luster, turns pale yellowish-brown, wilts, and can be pulled out effortlessly",
                    "Foul-smelling soft putrefactive rot of the central growing point and cabbage"
                ],
                "treatment": [
                    "Excise all rotting tissues from crown; apply Bordeaux paste (1:1:10) to exposed core and protect with a polythene cap.",
                    "Drench crown with Metalaxyl + Mancozeb @ 2.0 g/L."
                ],
                "prevention": [
                    "Prophylactic crown spray of 1% Bordeaux mixture before southwest and northeast monsoons."
                ]
            },
            "leaf_blight": {
                "name": "Coconut Leaf Blight / Grey Blight",
                "scientific_name": "Pestalotiopsis palmarum",
                "symptoms": [
                    "Minute yellow spots on leaflets enlarging into oval greyish-white necrotic lesions with dark brown borders",
                    "Leaflets become blighted, brittle, and dry, reducing photosynthetic frond capacity"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L or Mancozeb 75% WP @ 2.0 g/L on affected lower fronds."
                ],
                "prevention": [
                    "Apply Potash fertilizer (apply 1.5-2.0 kg MOP per adult palm annually); cut and burn severely diseased dried lower fronds."
                ]
            }
        },
        "supported_pests": {
            "slug_caterpillar": {
                "name": "Coconut Slug Caterpillar",
                "scientific_name": "Contheyla rotunda",
                "keywords": ["slug caterpillar", "contheyla", "nettle grub", "stinging caterpillar"],
                "damage_signs": [
                    "Fleshy green slug-like caterpillars with stinging spines voraciously feed on leaflets",
                    "Severe defoliation leaving only bare midribs ('ribbed fronds'), causing drastic yield reduction"
                ],
                "pest_control": [
                    "Spray Dichlorvos 76% EC @ 2.0 ml/L or Chlorpyrifos 20% EC @ 2.5 ml/L on lower fronds.",
                    "Set up light traps to catch adult moths."
                ],
                "prevention": [
                    "Conserve parasitic braconid and tachinid wasps."
                ]
            }
        }
    },
    "jute": {
        "diseases": {
            "root_rot": {
                "name": "Jute Root Rot",
                "scientific_name": "Rhizoctonia bataticola / Macrophomina",
                "symptoms": [
                    "Decay of taproot and secondary feeder roots; roots shred into fibrous strings with tiny black sclerotia",
                    "Yellowing and sudden wilting of plants in patches across the field"
                ],
                "treatment": [
                    "Drench soil with Carbendazim 50% WP @ 1.0 g/L or Copper Oxychloride 50% WP @ 3.0 g/L."
                ],
                "prevention": [
                    "Seed treatment with Trichoderma viride @ 5 g/kg seed; ensure surface drainage furrows."
                ]
            },
            "leaf_spot": {
                "name": "Jute Leaf Spot",
                "scientific_name": "Cercospora corchori",
                "symptoms": [
                    "Small circular yellowish-brown spots with dark brown margins scattered on leaf lamina",
                    "Severe infection leads to leaf yellowing and defoliation during humid monsoon weather"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.0 g/L or Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Timely weeding and adherence to recommended plant spacing."
                ]
            }
        },
        "supported_pests": {
            "jute_mealybug": {
                "name": "Jute Mealybug",
                "scientific_name": "Phenacoccus hirsutus",
                "keywords": ["mealybug", "jute mealybug", "tuka", "bunchy top"],
                "damage_signs": [
                    "Infests apical growing points, causing severe internode shortening and clustering of leaves ('bunchy top' or 'tuka')",
                    "Stem swells and curls, destroying quality of fiber extraction"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Profenofos 50% EC @ 1.5 ml/L.",
                    "Uproot and burn initial bunchy top plants."
                ],
                "prevention": [
                    "Destroy alternate weed hosts around the jute field."
                ]
            }
        }
    },
    "coffee": {
        "diseases": {
            "root_rot": {
                "name": "Coffee Root Diseases / Stump Rot",
                "scientific_name": "Rosellinia bunodes / Fusarium oxysporum / Fomes noxius",
                "symptoms": [
                    "Gradual yellowing, wilting, and sudden death of coffee bushes",
                    "Roots covered with dark brown to black fungal mycelial crusts and internal brown vascular staining"
                ],
                "treatment": [
                    "Uproot dead bushes along with complete root system and burn on site.",
                    "Isolate infected area with a 1m deep trench and drench pit with Copper Oxychloride 50% WP @ 4.0 g/L."
                ],
                "prevention": [
                    "Apply Trichoderma harzianum @ 50 g/pit mixed with organic compost before planting supplies."
                ]
            }
        },
        "supported_pests": {
            "coffee_green_scale": {
                "name": "Coffee Green Scale",
                "scientific_name": "Coccus viridis",
                "keywords": ["green scale", "scale", "coccus viridis", "sooty mold"],
                "damage_signs": [
                    "Flat oval pale green scale insects encrusting tender green twigs and lower leaf surfaces along veins",
                    "Copious honeydew promotes dense black sooty mold over canopy, reducing photosynthetic capacity"
                ],
                "pest_control": [
                    "Spray Quinalphos 25% EC @ 1.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L with agricultural sticker.",
                    "Control attending ants by dusting Chlorpyrifos 1.5% dust around tree base."
                ],
                "prevention": [
                    "Conserve entomopathogenic fungus Lecanicillium lecanii during monsoon."
                ]
            }
        }
    },
    "chilli": {
        "diseases": {
            "damping_off": {
                "name": "Chilli Damping-Off",
                "scientific_name": "Pythium debaryanum / Rhizoctonia solani",
                "symptoms": [
                    "Pre-emergence seed rot; post-emergence water-soaking and girdling of collar tissue causing seedlings to topple and collapse"
                ],
                "treatment": [
                    "Drench nursery beds with Metalaxyl + Mancozeb (Ridomil MZ @ 2.0 g/L) or Copper Oxychloride @ 3.0 g/L."
                ],
                "prevention": [
                    "Raise seedlings on raised nursery beds with solarized soil; treat seeds with Thiram @ 3 g/kg seed."
                ]
            }
        },
        "supported_pests": {
            "chilli_yellow_mite": {
                "name": "Chilli Yellow / Broad Mite",
                "scientific_name": "Polyphagotarsonemus latus",
                "keywords": ["mite", "yellow mite", "murda", "downward curling"],
                "damage_signs": [
                    "Downward curling of leaf margins into an inverted boat shape; leaves become brittle, elongated, and bronzed on undersides"
                ],
                "pest_control": [
                    "Spray Spiromesifen 22.9% SC @ 1.0 ml/L or Fenazaquin 10% EC @ 2.0 ml/L or Wettable Sulphur @ 2.5 g/L."
                ],
                "prevention": [
                    "Avoid excessive nitrogenous fertilization which promotes succulent vegetative flush."
                ]
            },
            "chilli_whitefly": {
                "name": "Chilli Whitefly",
                "scientific_name": "Bemisia tabaci",
                "keywords": ["whitefly", "bemisia", "chilcv vector"],
                "damage_signs": [
                    "Nymphs and adults suck phloem sap; acts as the primary vector for Chilli Leaf Curl Virus (ChiLCV)"
                ],
                "pest_control": [
                    "Spray Diafenthiuron 50% WP @ 1.2 g/L or Pyriproxyfen 10% EC @ 1.5 ml/L.",
                    "Install yellow sticky traps @ 15 traps/acre."
                ],
                "prevention": [
                    "Grow border rows of maize or sorghum as windbreaks against whitefly migration."
                ]
            }
        }
    },
    "turmeric": {
        "supported_pests": {
            "turmeric_lacewing_bug": {
                "name": "Turmeric Lacewing Bug",
                "scientific_name": "Stephanitis typicus",
                "keywords": ["lacewing bug", "stephanitis", "yellow spots", "tar spots"],
                "damage_signs": [
                    "Nymphs and adults feed on lower leaf surface, leaving yellow speckled spots; undersides fouled with black tar-like excreta droplets"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Quinalphos 25% EC @ 1.5 ml/L.",
                    "Direct water spray forcefully to leaf undersides to dislodge nymphs."
                ],
                "prevention": [
                    "Maintain clean cultivation and destroy infested leaves."
                ]
            }
        }
    },
    "sunflower": {
        "diseases": {
            "downy_mildew": {
                "name": "Sunflower Downy Mildew",
                "scientific_name": "Plasmopara halstedii",
                "symptoms": [
                    "Stunting of plants with pale yellow chlorosis along primary veins; white cottony downy growth on lower leaf surfaces"
                ],
                "treatment": [
                    "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.0 g/L; rogue out stunted systemically infected plants."
                ],
                "prevention": [
                    "Seed treatment with Metalaxyl 35% WS @ 6 g/kg seed before sowing."
                ]
            },
            "charcoal_rot": {
                "name": "Sunflower Charcoal Rot",
                "scientific_name": "Macrophomina phaseolina",
                "symptoms": [
                    "Premature drying and ripening; stem base turns ash-grey, pith disintegrates, and inside stalk is packed with jet-black sclerotia"
                ],
                "treatment": [
                    "Drench stem base with Carbendazim 50% WP @ 1.0 g/L."
                ],
                "prevention": [
                    "Avoid moisture stress during flowering and seed development; practice crop rotation."
                ]
            },
            "sunflower_necrosis": {
                "name": "Sunflower Necrosis Disease (SND)",
                "scientific_name": "Tobacco streak virus (TSV)",
                "symptoms": [
                    "Mosaic and necrosis of leaf lamina and petiole; systemic death of terminal bud resulting in complete flower head failure"
                ],
                "treatment": [
                    "Spray Imidacloprid 17.8% SL @ 0.3 ml/L to control thrips vector (Thrips palmi)."
                ],
                "prevention": [
                    "Destroy weed hosts like Parthenium hysterophorus around field borders."
                ]
            }
        },
        "supported_pests": {
            "sunflower_bihar_hairy_caterpillar": {
                "name": "Bihar Hairy Caterpillar",
                "scientific_name": "Spilarctia obliqua",
                "keywords": ["hairy caterpillar", "spilarctia", "defoliator"],
                "damage_signs": [
                    "Gregarious young larvae skeletonize leaves; older caterpillars devour foliage, ray florets, and developing heads"
                ],
                "pest_control": [
                    "Collect and destroy gregarious leaf clusters; spray Chlorpyrifos 20% EC @ 2.5 ml/L in evening."
                ],
                "prevention": [
                    "Dig boundary trenches around field plots."
                ]
            }
        }
    },
    "sorghum": {
        "diseases": {
            "downy_mildew": {
                "name": "Sorghum Downy Mildew",
                "scientific_name": "Peronosclerospora sorghi",
                "symptoms": [
                    "Vivid pale yellow chlorotic stripes on leaves; white downy growth on lower surfaces; leaves shred longitudinally into brown ribbons"
                ],
                "treatment": [
                    "Rogue out and destroy infected shredded plants; spray Metalaxyl + Mancozeb @ 2.0 g/L."
                ],
                "prevention": [
                    "Seed treatment with Metalaxyl 35% WS (Apron @ 6 g/kg seed)."
                ]
            },
            "rust": {
                "name": "Sorghum Rust",
                "scientific_name": "Puccinia purpurea",
                "symptoms": [
                    "Small reddish, purplish, or brown uredinial pustules on both leaf surfaces; premature leaf drying under cool moist conditions"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.0 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Destroy alternative weed hosts like Cyperus rotundus."
                ]
            }
        },
        "supported_pests": {
            "sorghum_armyworm": {
                "name": "Sorghum Armyworm",
                "scientific_name": "Mythimna separata",
                "keywords": ["armyworm", "mythimna", "earhead caterpillar"],
                "damage_signs": [
                    "Larvae march into fields devouring leaf blades from margins inward; heavy chewing of developing earheads at night"
                ],
                "pest_control": [
                    "Spray Chlorpyrifos 20% EC @ 2.0 ml/L or Quinalphos 25% EC @ 2.0 ml/L in late evening."
                ],
                "prevention": [
                    "Deep summer ploughing to expose pupae to sun and predators."
                ]
            },
            "sorghum_aphid": {
                "name": "Sorghum / Sugarcane Aphid",
                "scientific_name": "Melanaphis sacchari",
                "keywords": ["aphid", "sorghum aphid", "melanaphis", "honeydew"],
                "damage_signs": [
                    "Dense colonies on lower leaf surfaces sucking sap; copious sticky honeydew attracting heavy black sooty mold"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L."
                ],
                "prevention": [
                    "Conserve coccinellid ladybird beetles and syrphid fly larvae."
                ]
            }
        }
    },
    "pearl millet": {
        "diseases": {
            "blast": {
                "name": "Pearl Millet Blast",
                "scientific_name": "Pyricularia grisea",
                "symptoms": [
                    "Diamond or eye-shaped foliar lesions with greyish center and reddish-brown borders; severe foliar scorching and premature drying"
                ],
                "treatment": [
                    "Spray Tricyclazole 75% WP @ 0.6 g/L or Mancozeb 75% WP @ 2.0 g/L at first lesion detection."
                ],
                "prevention": [
                    "Plant blast-resistant hybrids (e.g. MPMH 17, HHB 67 Improved); treat seed with Carbendazim (2 g/kg)."
                ]
            }
        },
        "supported_pests": {
            "bajra_aphid": {
                "name": "Pearl Millet Aphid",
                "scientific_name": "Rhopalosiphum maidis",
                "keywords": ["aphid", "pearl millet aphid", "corn aphid", "rhopalosiphum"],
                "damage_signs": [
                    "Colonies of dark green aphids clustered in leaf whorls and developing earheads; honeydew secretions impair grain set"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid 17.8% SL @ 0.3 ml/L."
                ],
                "prevention": [
                    "Early sowing with monsoon onset to escape aphid multiplication."
                ]
            }
        }
    },
    "barley": {
        "diseases": {
            "powdery_mildew": {
                "name": "Barley Powdery Mildew",
                "scientific_name": "Blumeria graminis f. sp. hordei",
                "symptoms": [
                    "White fluffy powdery patches on upper leaf blades turning dull brown with black cleistothecia; foliar chlorosis and drying"
                ],
                "treatment": [
                    "Spray Wettable Sulphur 80% WP @ 2.5 g/L or Propiconazole 25% EC @ 1.0 ml/L."
                ],
                "prevention": [
                    "Avoid excessively dense sowing; maintain balanced N-P-K nutrition."
                ]
            }
        }
    },
    "finger millet": {
        "diseases": {
            "smut": {
                "name": "Finger Millet Smut",
                "scientific_name": "Melanopsichium eleusinis",
                "symptoms": [
                    "Individual grains in finger spikelets swell into prominent round or oval greenish-black gall-like smut sacs filled with sooty spores"
                ],
                "treatment": [
                    "Seed treatment with Carboxin 37.5% + Thiram 37.5% DS @ 2.5 g/kg seed; spray Mancozeb @ 2.0 g/L at earhead emergence."
                ],
                "prevention": [
                    "Collect and destroy smutted spikelet galls inside polythene bags before spore release."
                ]
            }
        },
        "supported_pests": {
            "ragi_aphid": {
                "name": "Finger Millet Aphid",
                "scientific_name": "Rhopalosiphum maidis",
                "keywords": ["aphid", "ragi aphid", "rhopalosiphum"],
                "damage_signs": [
                    "Aphids clustered inside leaf whorls and along developing finger spikes; causes chlorosis and sticky honeydew"
                ],
                "pest_control": [
                    "Spray Dimethoate 30% EC @ 1.5 ml/L or Imidacloprid @ 0.3 ml/L."
                ],
                "prevention": [
                    "Maintain optimum plant population and avoid delayed sowing."
                ]
            }
        }
    }
}


def apply_taxonomy_enrichment(crops_dict: Dict[str, Dict[str, Any]]) -> None:
    """Enriches CROPS_TAXONOMY_37 in place with full disease and pest parity."""
    for crop_key, enrichment in TAXONOMY_ENRICHMENT_DATA.items():
        if crop_key not in crops_dict:
            continue
        crop_data = crops_dict[crop_key]
        
        # Enrich diseases
        if "diseases" in enrichment:
            if "diseases" not in crop_data:
                crop_data["diseases"] = {}
            for d_key, d_val in enrichment["diseases"].items():
                crop_data["diseases"][d_key] = d_val
                if "supported_conditions" in crop_data and d_key not in crop_data["supported_conditions"]:
                    crop_data["supported_conditions"].insert(0, d_key)
                    
        # Enrich supported_pests
        if "supported_pests" in enrichment:
            if "supported_pests" not in crop_data:
                crop_data["supported_pests"] = {}
            for p_key, p_val in enrichment["supported_pests"].items():
                crop_data["supported_pests"][p_key] = p_val
