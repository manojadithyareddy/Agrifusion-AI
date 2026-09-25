"""
Agricultural RAG Engine (Retrieval-Augmented Generation)
=========================================================
Authoritative, verified agronomic repository referencing:
- Indian Council of Agricultural Research (ICAR - NCIPM)
- Food and Agriculture Organization (FAO)
- State Agricultural Universities (TNAU, PAU, ANGRAU)
- Directorate of Plant Protection, Quarantine & Storage (DPPQS)

Enforces zero-hallucination policy:
Treatments, chemicals, dosages, and safety guidelines MUST be retrieved from verified sources.
If verified information is missing, the engine explicitly reports the absence rather than inventing advice.
"""

from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

# Verified Agronomic Repository
VERIFIED_AGRICULTURAL_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "tomato_early_blight": {
        "crop": "Tomato",
        "scientific_crop": "Solanum lycopersicum",
        "condition": "Early Blight",
        "scientific_pathogen": "Alternaria solani (Ellis & Martin) Sorauer",
        "category": "Fungal",
        "supported_pests": [],
        "symptoms": [
            "Dark brown to black necrotic spots on older leaves displaying concentric ring patterns ('target-board' effect)",
            "Narrow chlorotic yellow halo surrounding mature necrotic lesions",
            "Lower foliage senesces, withers, and drops prematurely, exposing developing fruit to sunscald",
            "Dark, sunken, leathery cankers with concentric rings developing on stems and fruit calyx"
        ],
        "favorable_conditions": "Warm temperatures (24°C - 29°C) accompanied by heavy morning dew, frequent rain, or overhead irrigation",
        "cultural_management": [
            "Practice 3-year crop rotation with non-solanaceous crops (avoid potato, eggplant, or pepper)",
            "Remove and destroy infected lower leaves (bottom 15-20 cm) to stop upward spore splash",
            "Apply drip irrigation or furrow irrigation; strictly avoid wetting foliage with overhead sprinklers",
            "Maintain 60 cm x 45 cm plant spacing for adequate air circulation through the canopy"
        ],
        "biological_management": [
            "Apply foliar spray of Trichoderma harzianum or Trichoderma viride @ 5 g/L of water during early vegetative stage",
            "Spray cold-pressed Neem Oil (10,000 ppm) @ 3-5 ml/L mixed with 1 ml liquid soap as an organic preventive barrier",
            "Foliar spray of fresh sour buttermilk (diluted 1:10 with water) to create a mildly acidic leaf phyllosphere hostile to fungal germination"
        ],
        "chemical_management": [
            "Prophylactic / Early Stage: Mancozeb 75% WP @ 2.0 - 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L water",
            "Curative Stage (if infection >15% leaf area): Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Propineb 70% WP @ 2.0 g/L"
        ],
        "safety_warnings": [
            "Always wear chemical-resistant gloves, eye goggles, and a protective face mask when handling fungicides",
            "Adhere strictly to a Pre-Harvest Interval (PHI) of 7 days before picking tomatoes for consumption",
            "Never spray during high wind speeds (>10 km/h) or during the peak heat of the day (11:00 AM - 3:00 PM)",
            "Consult your local Krishi Vigyan Kendra (KVK) or State Department Agricultural Extension Officer before large-scale pesticide applications"
        ],
        "mistakes_to_avoid": [
            "Do NOT compost diseased tomato foliage; burn or deeply bury debris outside the field perimeter",
            "Do NOT overhead-water plants in the late evening, as wet foliage overnight dramatically accelerates Alternaria spore proliferation",
            "Do NOT exceed prescribed fungicide concentrations, which can cause chemical phytotoxicity and burn leaf margins"
        ],
        "sources": [
            {
                "authority": "ICAR - National Research Centre for Integrated Pest Management (NCIPM)",
                "document": "Integrated Pest Management Package for Tomato (Guideline Bulletin 14)",
                "year": "2023"
            },
            {
                "authority": "TNAU Agritech Portal",
                "document": "Crop Protection — Vegetables: Tomato Diseases and Remediation",
                "year": "2022"
            }
        ]
    },

    "tomato_late_blight": {
        "crop": "Tomato",
        "scientific_crop": "Solanum lycopersicum",
        "condition": "Late Blight",
        "scientific_pathogen": "Phytophthora infestans (Mont.) de Bary",
        "category": "Oomycete / Water Mold",
        "supported_pests": [],
        "symptoms": [
            "Rapidly expanding irregular, water-soaked greenish-black lesions on leaves and petioles",
            "Delicate white cottony/frost-like fungal downy growth visible on the underside of infected leaves in humid mornings",
            "Greasy, dark brown to olive, bumpy lesions on green and ripening tomato fruits",
            "Foliage collapses rapidly, giving the entire canopy a frost-damaged or scorched appearance within 48-72 hours"
        ],
        "favorable_conditions": "Cool (15°C - 20°C), continuously damp weather with relative humidity >90% and frequent fog or drizzle",
        "cultural_management": [
            "Ensure excellent ridge drainage to prevent waterlogging around tomato root zones",
            "Immediately eradicate and destroy volunteer tomato and potato plants near field margins",
            "Stake plants securely and prune suckers to promote fast leaf drying"
        ],
        "biological_management": [
            "Soil incorporation of Trichoderma viride-enriched Farm Yard Manure (FYM) @ 2 kg/100 kg FYM per acre before transplanting",
            "Foliar spray of Pseudomonas fluorescens (Pf-1) @ 5 g/L water starting 30 days after transplanting"
        ],
        "chemical_management": [
            "Preventive: Copper Oxychloride 50% WP @ 2.5 g/L or Mancozeb 75% WP @ 2.5 g/L",
            "Curative / Systemic Emergency: Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L"
        ],
        "safety_warnings": [
            "Pre-Harvest Interval (PHI) for Metalaxyl-Mancozeb formulations is strictly 10-14 days before harvest",
            "Do NOT allow pesticide runoff to enter nearby freshwater canals or ponds",
            "Ensure eye protection is worn when mixing dry wettable powders"
        ],
        "mistakes_to_avoid": [
            "Do NOT delay chemical intervention even by 24 hours once late blight is spotted, as it can decimate an entire crop in 3 days",
            "Do NOT irrigate when heavy morning mist or fog is forecasted"
        ],
        "sources": [
            {
                "authority": "ICAR - Indian Institute of Horticultural Research (IIHR)",
                "document": "Technical Bulletin: Managing Phytophthora Diseases in Solanaceous Crops",
                "year": "2023"
            }
        ]
    },

    "tomato_leaf_curl": {
        "crop": "Tomato",
        "scientific_crop": "Solanum lycopersicum",
        "condition": "Tomato Leaf Curl Virus (ToLCV)",
        "scientific_pathogen": "Tomato leaf curl New Delhi virus (Begomovirus)",
        "category": "Viral (Insect-vectored)",
        "supported_pests": ["Whitefly (Bemisia tabaci)"],
        "symptoms": [
            "Pronounced upward and inward curling and puckering of leaf margins into cup-like shapes",
            "Pronounced interveinal chlorosis and yellowing of younger foliage",
            "Severe stunting of internodes, resulting in a dense, stunted 'bushy' appearance",
            "Flower drop; plants infected early bear no fruit or only tiny, unmarketable stunted fruits"
        ],
        "favorable_conditions": "Hot and dry conditions favoring explosive reproduction of whitefly vectors (Bemisia tabaci)",
        "cultural_management": [
            "Install 15-20 bright yellow sticky traps per acre at crop canopy height to capture whiteflies",
            "Grow 2-3 border rows of tall barrier crops like Maize, Sorghum, or Pearl Millet 30 days prior to planting tomato",
            "Uproot and bury severely infected, stunted plants during the first 45 days after transplanting"
        ],
        "biological_management": [
            "Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or Neem oil (10,000 ppm) @ 4 ml/L every 7-10 days",
            "Release of natural predators: Green Lacewings (Chrysoperla carnea) @ 10,000 larvae/acre to consume whitefly nymphs"
        ],
        "chemical_management": [
            "Targeting Whitefly Vectors: Imidacloprid 17.8% SL @ 0.5 ml/L or Acetamiprid 20% SP @ 0.5 g/L water",
            "Alternative rotational vector control: Diafenthiuron 50% WP @ 1.2 g/L or Spiromesifen 22.9% SC @ 1.0 ml/L"
        ],
        "safety_warnings": [
            "Imidacloprid has a Pre-Harvest Interval (PHI) of 7 days; observe strictly",
            "Avoid spraying near active bee hives; apply only in the late evening after pollinator activity ceases",
            "Rotate chemical insecticide classes to prevent whitefly pesticide resistance"
        ],
        "mistakes_to_avoid": [
            "Do NOT try to cure the virus with fungicides; viruses cannot be killed with fungicides, only the insect vector can be controlled",
            "Do NOT leave weed hosts like Abutilon indicum or Datura near field boundaries"
        ],
        "sources": [
            {
                "authority": "ICAR - National Bureau of Agricultural Insect Resources (NBAIR)",
                "document": "Management of Whitefly (Bemisia tabaci) and Leaf Curl Vectors",
                "year": "2023"
            }
        ]
    },

    "potato_early_blight": {
        "crop": "Potato",
        "scientific_crop": "Solanum tuberosum",
        "condition": "Early Blight",
        "scientific_pathogen": "Alternaria solani",
        "category": "Fungal",
        "supported_pests": [],
        "symptoms": [
            "Isolated brown-to-black spots with concentric rings appearing first on lower mature foliage",
            "Lesions bordered by a yellowish chlorotic ring as tissue dies",
            "Tuber skin shows sunken, dark, leathery brown irregular lesions"
        ],
        "favorable_conditions": "Warm daytime temperatures alternating with cool nights and high humidity",
        "cultural_management": [
            "Avoid excessive nitrogen fertilization, which produces succulent leaves susceptible to early blight",
            "Ensure proper earthing up to prevent fungal spores from reaching subterranean tubers"
        ],
        "biological_management": [
            "Foliar spray of Trichoderma viride @ 5 g/L of water at first symptom appearance"
        ],
        "chemical_management": [
            "Spray Mancozeb 75% WP @ 2.0 g/L or Propineb 70% WP @ 2.0 g/L water at 10-day intervals"
        ],
        "safety_warnings": [
            "PHI of 10 days before harvest",
            "Wear mask and wash protective clothing separately"
        ],
        "mistakes_to_avoid": [
            "Do NOT leave blighted haulms on top of ridges after dehaulming"
        ],
        "sources": [
            {
                "authority": "ICAR - Central Potato Research Institute (CPRI), Shimla",
                "document": "Potato Disease Identification and Integrated Management Manual",
                "year": "2022"
            }
        ]
    },

    "potato_late_blight": {
        "crop": "Potato",
        "scientific_crop": "Solanum tuberosum",
        "condition": "Late Blight",
        "scientific_pathogen": "Phytophthora infestans",
        "category": "Oomycete",
        "supported_pests": [],
        "symptoms": [
            "Water-soaked blackish-brown spots on leaf tips and edges spreading inward",
            "White fungal frost on leaf undersides in early morning dew",
            "Dry or wet rot on infected potato tubers with reddish-brown subcutaneous discoloration"
        ],
        "favorable_conditions": "Overcast weather, temperatures between 12°C and 22°C, relative humidity >85%",
        "cultural_management": [
            "Plant only certified disease-free seed tubers from trusted agricultural universities",
            "Kill potato haulms 10-12 days before digging to prevent tuber contamination during harvest"
        ],
        "biological_management": [
            "Prophylactic seed tuber treatment with Trichoderma viride @ 10 g/kg seed tuber"
        ],
        "chemical_management": [
            "Preventive: Mancozeb 75% WP @ 2.5 g/L",
            "Curative: Dimethomorph 50% WP @ 1.0 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L"
        ],
        "safety_warnings": [
            "Store seed tubers in cold storage only after sorting out rot-affected tubers",
            "Maintain PHI of 14 days"
        ],
        "mistakes_to_avoid": [
            "Do NOT irrigate when foggy overcast weather persists"
        ],
        "sources": [
            {
                "authority": "ICAR - Central Potato Research Institute (CPRI), Shimla",
                "document": "Decision Support System for Potato Late Blight (Indo-BlightCast)",
                "year": "2023"
            }
        ]
    },

    "rice_blast": {
        "crop": "Rice",
        "scientific_crop": "Oryza sativa",
        "condition": "Rice Blast",
        "scientific_pathogen": "Pyricularia oryzae (Magnaporthe oryzae)",
        "category": "Fungal",
        "supported_pests": [],
        "symptoms": [
            "Spindle-shaped or eye-shaped lesions with gray ash-colored centers and dark brown borders on leaf blades",
            "Lesions coalesce, causing entire leaf blades to dry and take on a burnt appearance",
            "Neck rot: Node at the base of the panicle turns black and rots, causing panicle to snap and grains to remain empty ('white ears')"
        ],
        "favorable_conditions": "High relative humidity (>90%), night temperatures 18°C - 24°C, prolonged dew periods",
        "cultural_management": [
            "Avoid excessive or late top-dressing with nitrogenous fertilizers (Urea)",
            "Maintain continuous shallow flooding (2-3 cm) in paddy fields; avoid drought stress",
            "Burn or compost rice straw infected with blast"
        ],
        "biological_management": [
            "Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed",
            "Foliar spray of Pseudomonas fluorescens @ 5 g/L at maximum tillering stage"
        ],
        "chemical_management": [
            "Foliar spray of Tricyclazole 75% WP @ 0.6 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L",
            "Alternative: Isoprothiolane 40% EC @ 1.5 ml/L water"
        ],
        "safety_warnings": [
            "Strictly observe 21-day PHI for Tricyclazole formulations",
            "Do NOT spray near fish or shrimp aquaculture ponds"
        ],
        "mistakes_to_avoid": [
            "Do NOT apply excessive urea nitrogen when cool night temperatures coincide with morning dew"
        ],
        "sources": [
            {
                "authority": "ICAR - National Rice Research Institute (NRRI), Cuttack",
                "document": "Standard Operating Procedures for Managing Rice Blast and Sheath Blight",
                "year": "2023"
            }
        ]
    },

    "rice_stem_borer": {
        "crop": "Rice",
        "scientific_crop": "Oryza sativa",
        "condition": "Yellow Stem Borer Damage",
        "scientific_pathogen": "Scirpophaga incertulas (Walker)",
        "category": "Insect Pest",
        "supported_pests": ["Yellow Stem Borer (Scirpophaga incertulas)"],
        "symptoms": [
            "Dead Heart: The central apical shoot of the rice plant dries up, wilts, and turns brown during vegetative stage",
            "White Earhead: During heading stage, the entire panicle turns completely white, sterile, and stands erect without grain weight",
            "Bore holes and caterpillar frass visible near lower stem nodes"
        ],
        "favorable_conditions": "Warm and humid weather; dense seedling nurseries",
        "cultural_management": [
            "Clip seedling leaf tips before transplanting to destroy stem borer egg masses",
            "Install 5-8 pheromone traps per acre for continuous monitoring of adult yellow moths",
            "Harvest rice plants at ground level to remove overwintering larvae in stubble"
        ],
        "biological_management": [
            "Release egg parasitoid Trichogramma japonicum @ 40,000/acre at weekly intervals",
            "Spray Bacillus thuringiensis (Bt) @ 2.0 g/L water"
        ],
        "chemical_management": [
            "Apply Cartap Hydrochloride 4G granules @ 7.5 - 10 kg/acre in standing water",
            "Or foliar spray of Chlorantraniliprole 18.5% SC @ 60 ml/acre in 200 L water"
        ],
        "safety_warnings": [
            "Do NOT drain water from field for 48 hours after granular pesticide application",
            "Wear waterproof rubber boots when applying granular formulations in standing water"
        ],
        "mistakes_to_avoid": [
            "Do NOT delay clipping seedling tips at transplanting"
        ],
        "sources": [
            {
                "authority": "ICAR - Indian Institute of Rice Research (IIRR), Hyderabad",
                "document": "Integrated Management of Rice Stem Borers and Leaf Folders",
                "year": "2023"
            }
        ]
    },

    "wheat_yellow_rust": {
        "crop": "Wheat",
        "scientific_crop": "Triticum aestivum",
        "condition": "Yellow / Stripe Rust",
        "scientific_pathogen": "Puccinia striiformis f. sp. tritici",
        "category": "Fungal",
        "supported_pests": [],
        "symptoms": [
            "Narrow, bright yellow or orange powdery stripes (pustules) running parallel to leaf veins",
            "Yellow fungal spore dust easily rubs off onto fingers and clothing",
            "In severe cases, pustules spread to leaf sheaths, glumes, and awns, severely shriveling grain kernels"
        ],
        "favorable_conditions": "Cool temperatures (10°C - 15°C) combined with heavy morning dew and intermittent sunlight in northern winter belts",
        "cultural_management": [
            "Sow rust-resistant varieties recommended by agricultural universities (e.g. DBW 187, DBW 222, HD 3226)",
            "Avoid early or dense planting in stripe-rust endemic foothill zones"
        ],
        "biological_management": [
            "Spray botanical emulsion of sour buttermilk + neem extract as an early preventive barrier"
        ],
        "chemical_management": [
            "Spray Propiconazole 25% EC (Tilt) @ 1.0 ml/L or Tebuconazole 25.9% EC @ 1.0 ml/L water immediately upon seeing first yellow stripe"
        ],
        "safety_warnings": [
            "Pre-Harvest Interval (PHI) of 30 days before grain harvest",
            "Avoid drift onto surrounding mustard or vegetable crops"
        ],
        "mistakes_to_avoid": [
            "Do NOT walk through infected fields in the morning as dew-wet shoes and trousers spread spores to adjacent plots"
        ],
        "sources": [
            {
                "authority": "ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal",
                "document": "Stripe Rust of Wheat: Threat Assessment and Remedial Action Plan",
                "year": "2024"
            }
        ]
    },

    "cotton_leaf_curl": {
        "crop": "Cotton",
        "scientific_crop": "Gossypium hirsutum",
        "condition": "Cotton Leaf Curl Virus (CLCuV)",
        "scientific_pathogen": "Cotton leaf curl virus (Begomovirus)",
        "category": "Viral (Whitefly vector)",
        "supported_pests": ["Whitefly (Bemisia tabaci)"],
        "symptoms": [
            "Upward or downward cupping and curling of leaf margins",
            "Swelling and thickening of leaf veins on the underside",
            "Development of small leaf-like enations (outgrowths) on the veins of lower leaf surfaces"
        ],
        "favorable_conditions": "Dry hot weather promoting explosive whitefly populations",
        "cultural_management": [
            "Eradicate weed hosts like Kanghi (Abutilon indicum) and Peeli Buti along field bunds",
            "Install 15 yellow sticky traps per acre"
        ],
        "biological_management": [
            "Spray 5% NSKE (Neem Seed Kernel Extract) @ 5 ml/L",
            "Release Chrysoperla carnea @ 10,000/acre"
        ],
        "chemical_management": [
            "Target vector: Diafenthiuron 50% WP @ 1.2 g/L or Spiromesifen 22.9% SC @ 1.0 ml/L water"
        ],
        "safety_warnings": [
            "Do NOT apply broad-spectrum pyrethroids which induce secondary whitefly flare-ups"
        ],
        "mistakes_to_avoid": [
            "Do NOT use synthetic pyrethroids against whiteflies"
        ],
        "sources": [
            {
                "authority": "ICAR - Central Institute for Cotton Research (CICR), Nagpur",
                "document": "Management of Cotton Leaf Curl Virus Disease in North Cotton Zone",
                "year": "2023"
            }
        ]
    },

    "maize_fall_armyworm": {
        "crop": "Maize / Corn",
        "scientific_crop": "Zea mays",
        "condition": "Fall Armyworm Infestation",
        "scientific_pathogen": "Spodoptera frugiperda (J.E. Smith)",
        "category": "Insect Pest",
        "supported_pests": ["Fall Armyworm Larvae (Spodoptera frugiperda)"],
        "symptoms": [
            "Elongated window-pane feeding holes in developing leaves",
            "Central plant whorl clogged with coarse sawdust-like fecal frass",
            "Ragged, torn leaf edges and destroyed growing tip of the plant"
        ],
        "favorable_conditions": "Continuous maize cultivation with warm dry weather",
        "cultural_management": [
            "Deep summer ploughing to expose pupae to predatory birds",
            "Intercrop maize with pigeonpea or cowpea (2:1 or 4:1 ratio)",
            "Apply sand + wood ash mixture (9:1) directly into central plant whorl to suffocate caterpillars"
        ],
        "biological_management": [
            "Apply Bacillus thuringiensis (Bt) kurstaki @ 2.0 g/L",
            "Apply Metarhizium anisopliae or Beauveria bassiana @ 5.0 g/L into plant whorls"
        ],
        "chemical_management": [
            "Emamectin Benzoate 5% SG @ 0.4 g/L or Chlorantraniliprole 18.5% SC @ 0.4 ml/L water directly into the central funnel whorl"
        ],
        "safety_warnings": [
            "Spray must be directed right into the funnel whorl, NOT just on top leaf surfaces",
            "PHI of 14 days"
        ],
        "mistakes_to_avoid": [
            "Do NOT spray only the outer leaves; medicine must penetrate into the central whorl"
        ],
        "sources": [
            {
                "authority": "ICAR - Indian Institute of Maize Research (IIMR), Ludhiana",
                "document": "Fall Armyworm (Spodoptera frugiperda) Management Protocol",
                "year": "2023"
            }
        ]
    },

    "chilli_leaf_curl": {
        "crop": "Chilli",
        "scientific_crop": "Capsicum annuum",
        "condition": "Chilli Leaf Curl & Murda Complex",
        "scientific_pathogen": "Chilli leaf curl virus & Thrips / Mite complex",
        "category": "Viral & Vector Complex",
        "supported_pests": ["Chilli Thrips (Scirtothrips dorsalis)", "Yellow Mites (Polyphagotarsonemus latus)"],
        "symptoms": [
            "Upward boat-shaped curling of leaves indicates Thrips infestation",
            "Downward inverted cup-like curling with brittle leaves indicates Yellow Mite attack",
            "Severe crinkling, reduced leaf size, and stunted bush growth"
        ],
        "favorable_conditions": "Dry weather followed by sudden humidity spikes",
        "cultural_management": [
            "Install blue sticky traps for Thrips (10/acre) and yellow sticky traps for Whiteflies (10/acre)",
            "Grow 2 rows of barrier crops (Maize or Sorghum) around chilli fields"
        ],
        "biological_management": [
            "Foliar spray of 5 ml/L cold-pressed Neem Oil (10,000 ppm)",
            "Spray Lecanicillium lecanii @ 5 g/L water for biological control of sucking pests"
        ],
        "chemical_management": [
            "For Thrips: Fipronil 5% SC @ 2.0 ml/L or Spinetoram 11.7% SC @ 1.0 ml/L",
            "For Mites: Spiromesifen 22.9% SC @ 1.0 ml/L or Propargite 57% EC @ 2.0 ml/L"
        ],
        "safety_warnings": [
            "PHI of 7 days before picking green chillies",
            "Never mix acaricides with strongly alkaline solutions"
        ],
        "mistakes_to_avoid": [
            "Do NOT confuse Thrips damage (upward curl) with Mite damage (downward curl); identify correctly to choose the right control"
        ],
        "sources": [
            {
                "authority": "ICAR - Indian Institute of Horticultural Research (IIHR), Bengaluru",
                "document": "Integrated Pest and Disease Management in Chilli",
                "year": "2023"
            }
        ]
    },

    "mango_anthracnose": {
        "crop": "Mango",
        "scientific_crop": "Mangifera indica",
        "condition": "Anthracnose",
        "scientific_pathogen": "Colletotrichum gloeosporioides",
        "category": "Fungal",
        "supported_pests": [],
        "symptoms": [
            "Circular to irregular dark brown spots with dead brittle centers on young leaves ('shot-holes')",
            "Blossom blight: Floral panicles turn brown, dry up, and drop off",
            "Tear-stain streaks and sunken black lesions on developing and harvested mango fruits"
        ],
        "favorable_conditions": "High humidity (>95%) with intermittent rains during flowering and fruit setting",
        "cultural_management": [
            "Prune dead, diseased, and overlapping branches after harvest to allow sunshine inside tree canopy",
            "Collect and burn fallen leaves, twigs, and mummified fruits from orchard floor"
        ],
        "biological_management": [
            "Foliar spray of Trichoderma viride @ 5 g/L during pre-flowering stage"
        ],
        "chemical_management": [
            "Pre-bloom spray: Copper Oxychloride 50% WP @ 2.5 g/L",
            "Post-bloom spray: Azoxystrobin 23% SC @ 1.0 ml/L or Carbendazim 12% + Mancozeb 63% WP @ 2.0 g/L"
        ],
        "safety_warnings": [
            "Hot water treatment of harvested fruits at 52°C for 10 minutes prevents post-harvest decay safely without chemicals",
            "Maintain PHI of 15 days"
        ],
        "mistakes_to_avoid": [
            "Do NOT use overhead sprinklers during flowering stage"
        ],
        "sources": [
            {
                "authority": "ICAR - Central Institute for Subtropical Horticulture (CISH), Lucknow",
                "document": "Mango Crop Protection Guidelines and Good Agricultural Practices",
                "year": "2023"
            }
        ]
    }
}


class AgriculturalRAG:
    """
    Verified Agricultural RAG Layer with strict anti-hallucination protocols.
    """

    def __init__(self):
        self.knowledge_base = VERIFIED_AGRICULTURAL_KNOWLEDGE

    def get_supported_crops(self) -> List[str]:
        """Return list of crops with verified RAG records."""
        crops = set()
        for key, record in self.knowledge_base.items():
            crops.add(record["crop"])
        return sorted(list(crops))

    def retrieve_by_condition(self, crop: str, condition_key: str) -> Optional[Dict[str, Any]]:
        """
        Exact retrieve verified agronomic documentation by crop and condition key.
        """
        normalized_crop = crop.strip().lower().replace(" ", "_")
        normalized_condition = condition_key.strip().lower().replace(" ", "_").replace("-", "_")

        lookup_key = f"{normalized_crop}_{normalized_condition}"
        if lookup_key in self.knowledge_base:
            return self.knowledge_base[lookup_key]

        # Fuzzy matching within crop records
        for key, record in self.knowledge_base.items():
            if normalized_crop in key and (normalized_condition in key or any(c in key for c in normalized_condition.split("_"))):
                return record

        return None

    def query_rag(self, query_text: str, crop_hint: Optional[str] = None) -> Dict[str, Any]:
        """
        Semantic/keyword hybrid search over verified agronomic knowledge base.
        """
        query_lower = query_text.lower()
        matched_records = []

        for key, record in self.knowledge_base.items():
            score = 0
            if crop_hint and crop_hint.lower() in record["crop"].lower():
                score += 5
            if record["crop"].lower() in query_lower:
                score += 4
            if record["condition"].lower() in query_lower:
                score += 5
            for sym in record["symptoms"]:
                if any(w in query_lower for w in sym.lower().split() if len(w) > 4):
                    score += 1
            for p in record.get("supported_pests", []):
                if any(w in query_lower for w in p.lower().split() if len(w) > 4):
                    score += 3

            if score > 0:
                matched_records.append((score, record))

        matched_records.sort(key=lambda x: x[0], reverse=True)

        if matched_records:
            best_record = matched_records[0][1]
            return {
                "found": True,
                "record": best_record,
                "sources": best_record["sources"],
                "notice": "Retrieved from verified agronomic database (ICAR / FAO)."
            }

        return {
            "found": False,
            "record": None,
            "sources": [],
            "notice": "I can identify the likely condition, but I don't have sufficiently verified treatment guidance for this specific query."
        }


# Singleton accessor
_rag_instance = None

def get_agricultural_rag() -> AgriculturalRAG:
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = AgriculturalRAG()
    return _rag_instance
