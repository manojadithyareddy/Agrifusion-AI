export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
  'Puducherry',
];

export function formatLocation(state: string, district?: string, village?: string): string {
  const parts: string[] = [];
  if (village && village.trim() && !village.includes('All Villages') && !village.includes('District Central')) {
    parts.push(village.trim());
  }
  if (district && district.trim()) parts.push(district.trim());
  if (state && state.trim()) parts.push(state.trim());
  return parts.join(', ');
}

export const STATE_DISTRICTS: Record<string, string[]> = {
  'Karnataka': [
    'Belgaum', 'Bangalore Urban', 'Bangalore Rural', 'Bellary', 'Bidar', 'Bijapur',
    'Chamarajanagar', 'Chikkaballapur', 'Chikmagalur', 'Chitradurga', 'Dakshina Kannada',
    'Davanagere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Kodagu',
    'Kolar', 'Koppal', 'Mandya', 'Mysore', 'Raichur', 'Ramanagara', 'Shimoga',
    'Tumkur', 'Udupi', 'Uttara Kannada', 'Yadgir'
  ],
  'Maharashtra': [
    'Nagpur', 'Nashik', 'Pune', 'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed',
    'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Nanded', 'Osmanabad',
    'Palghar', 'Parbhani', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg',
    'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
    'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Mansa', 'Moga',
    'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran'
  ],
  'Uttar Pradesh': [
    'Varanasi', 'Lucknow', 'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha',
    'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
    'Bareilly', 'Basti', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Deoria', 'Etah',
    'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Ghaziabad', 'Gorakhpur',
    'Hardoi', 'Hathras', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Nagar', 'Mathura', 'Mau',
    'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Raebareli', 'Rampur',
    'Saharanpur', 'Sitapur', 'Sultanpur'
  ],
  'Tamil Nadu': [
    'Coimbatore', 'Madurai', 'Chennai', 'Ariyalur', 'Cuddalore', 'Dharmapuri', 'Dindigul',
    'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Nagapattinam', 'Namakkal',
    'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Salem', 'Sivaganga', 'Thanjavur',
    'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur',
    'Tiruvannamalai', 'Vellore', 'Virudhunagar'
  ],
  'Andhra Pradesh': [
    'Guntur', 'Kurnool', 'Anantapur', 'Chittoor', 'East Godavari', 'Krishna', 'Nellore',
    'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
  ],
  'Gujarat': [
    'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch',
    'Bhavnagar', 'Dahod', 'Gandhinagar', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mehsana',
    'Patan', 'Porbandar', 'Sabarkantha', 'Surendranagar', 'Valsad'
  ],
  'Haryana': [
    'Karnal', 'Hisar', 'Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurugram', 'Jhajjar',
    'Jind', 'Kaithal', 'Kurukshetra', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak',
    'Sirsa', 'Sonipat', 'Yamunanagar'
  ],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam',
    'Rewa', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha',
    'Chhatarpur', 'Mandsaur', 'Khargone', 'Neemuch', 'Hoshangabad', 'Sehore'
  ],
  'Rajasthan': [
    'Jodhpur', 'Jaipur', 'Bikaner', 'Kota', 'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer',
    'Bharatpur', 'Bhilwara', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Ganganagar',
    'Hanumangarh', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Nagaur', 'Pali', 'Sikar',
    'Sirohi', 'Tonk', 'Udaipur'
  ],
  'Telangana': [
    'Warangal', 'Hyderabad', 'Karimnagar', 'Nizamabad', 'Khammam', 'Adilabad', 'Bhadradri Kothagudem',
    'Jagtial', 'Jangaon', 'Kamareddy', 'Mahabubabad', 'Mahbubnagar', 'Mancherial', 'Medak',
    'Nalgonda', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet'
  ],
  'West Bengal': [
    'Nadia', 'Hooghly', 'Bardhaman', 'Bankura', 'Birbhum', 'Cooch Behar', 'Darjeeling', 'Howrah',
    'Jalpaiguri', 'Kolkata', 'Malda', 'Murshidabad', 'North 24 Parganas', 'Paschim Medinipur',
    'Purba Medinipur', 'Purulia', 'South 24 Parganas'
  ],
  'Kerala': [
    'Palakkad', 'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
    'Kozhikode', 'Malappuram', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ],
  'Bihar': [
    'Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Araria', 'Aurangabad', 'Banka',
    'Begusarai', 'Bhojpur', 'Buxar', 'East Champaran', 'Gopalganj', 'Katihar', 'Madhubani',
    'Nalanda', 'Purnia', 'Rohtas', 'Samastipur', 'Saran', 'Siwan', 'Vaishali', 'West Champaran'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Kangra', 'Mandi', 'Kullu', 'Solan', 'Sirmaur', 'Chamba', 'Hamirpur', 'Bilaspur',
    'Una', 'Kinnaur', 'Lahaul and Spiti'
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Anantnag', 'Baramulla', 'Pulwama', 'Budgam', 'Jammu', 'Kathua', 'Udhampur', 'Kupwara'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar', 'Almora', 'Pauri Garhwal', 'Tehri Garhwal'
  ]
};

// Comprehensive mapping of District -> Authentic Villages / Taluks / Tehsils
export const DISTRICT_VILLAGES: Record<string, string[]> = {
  // Karnataka
  'Belgaum': ['All Villages / District Central', 'Gokak', 'Athani', 'Chikkodi', 'Bailhongal', 'Hukkeri', 'Khanapur', 'Mudalagi', 'Nipani', 'Ramdurg', 'Raybag', 'Saundatti', 'Kagwad', 'Yadwad', 'Sankeshwar'],
  'Bangalore Urban': ['All Villages / District Central', 'Yelahanka', 'Kengeri', 'Anekal', 'KR Puram', 'Sarjapur', 'Bidarahalli', 'Varthur', 'Begur'],
  'Bangalore Rural': ['All Villages / District Central', 'Devanahalli', 'Doddaballapur', 'Hosakote', 'Nelamangala', 'Vijayapura', 'Tubagere', 'Nandagudi'],
  'Bellary': ['All Villages / District Central', 'Hospet', 'Siruguppa', 'Sandur', 'Kampli', 'Kudligi', 'Kurugodu', 'Tekkalakote'],
  'Bijapur': ['All Villages / District Central', 'Indi', 'Muddebihal', 'Sindgi', 'Basavana Bagewadi', 'Chadchan', 'Tikota', 'Talikoti'],
  'Dharwad': ['All Villages / District Central', 'Hubli Rural', 'Navalgund', 'Kundgol', 'Kalghatgi', 'Alnavar', 'Hebballi', 'Mugad'],
  'Mandya': ['All Villages / District Central', 'Maddur', 'Malavalli', 'Pandavapura', 'Srirangapatna', 'Nagamangala', 'Krishnarajpet'],
  'Mysore': ['All Villages / District Central', 'Nanjangud', 'Hunsur', 'T. Narasipura', 'Periyapatna', 'Heggadadevankote', 'K.R. Nagar'],
  'Shimoga': ['All Villages / District Central', 'Bhadravati', 'Sagar', 'Shikaripura', 'Soraba', 'Thirthahalli', 'Hosanagara'],
  'Udupi': ['All Villages / District Central', 'Kundapura', 'Karkala', 'Brahmavara', 'Byndoor', 'Kaup', 'Hebri', 'Saligrama'],

  // Maharashtra
  'Nagpur': ['All Villages / District Central', 'Katol', 'Kalmeshwar', 'Savner', 'Ramtek', 'Hingna', 'Umred', 'Kamptee', 'Kuhi', 'Narkhed', 'Parseoni', 'Bhiwapur', 'Mauda'],
  'Nashik': ['All Villages / District Central', 'Lasalgaon', 'Niphad', 'Sinnar', 'Yeola', 'Malegaon', 'Dindori', 'Kalwan', 'Chandwad', 'Trimbakeshwar', 'Baglan', 'Satana'],
  'Pune': ['All Villages / District Central', 'Baramati', 'Haveli', 'Shirur', 'Khed', 'Junnar', 'Indapur', 'Daund', 'Purandar', 'Bhor', 'Maval'],
  'Ahmednagar': ['All Villages / District Central', 'Rahata (Shirdi)', 'Sangamner', 'Kopargaon', 'Shrirampur', 'Nevasa', 'Parner', 'Pathardi', 'Shevgaon'],
  'Jalgaon': ['All Villages / District Central', 'Raver', 'Bhusawal', 'Chalisgaon', 'Pachora', 'Jamner', 'Yawal', 'Amalner', 'Erandol', 'Parola'],
  'Kolhapur': ['All Villages / District Central', 'Karveer', 'Shirol', 'Hatkanangle', 'Radhanagari', 'Kagal', 'Panhala', 'Bhudargad', 'Gadhinglaj'],
  'Solapur': ['All Villages / District Central', 'Pandharpur', 'Barshi', 'Malshiras', 'Karmala', 'Madha', 'Sangola', 'Akkalkot', 'Mohol'],

  // Punjab
  'Ludhiana': ['All Villages / District Central', 'Khanna', 'Jagraon', 'Samrala', 'Payal', 'Raikot', 'Doraha', 'Mullanpur Dakha', 'Sahnewal', 'Dehlon', 'Machhiwara'],
  'Amritsar': ['All Villages / District Central', 'Ajnala', 'Attari', 'Baba Bakala', 'Majitha', 'Rayya', 'Verka', 'Chogawan', 'Jandiala Guru'],
  'Bathinda': ['All Villages / District Central', 'Talwandi Sabo', 'Rampura Phul', 'Maur', 'Bhucho Mandi', 'Gonant Mandi', 'Sangat'],
  'Jalandhar': ['All Villages / District Central', 'Phillaur', 'Nakodar', 'Shahkot', 'Kartarpur', 'Goraya', 'Adampur', 'Nurmahal', 'Bhogpur'],
  'Patiala': ['All Villages / District Central', 'Nabha', 'Rajpura', 'Samana', 'Patran', 'Ghanaur', 'Dhudan Sadhan', 'Sanaur'],

  // Uttar Pradesh
  'Varanasi': ['All Villages / District Central', 'Pindra', 'Raja Talab', 'Kashi Vidyapeeth', 'Sewapuri', 'Araziline', 'Cholapur', 'Baragaon', 'Harhua'],
  'Lucknow': ['All Villages / District Central', 'Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar', 'Chinhat', 'Gosainganj', 'Kakori'],
  'Agra': ['All Villages / District Central', 'Fatehabad', 'Etmadpur', 'Bah', 'Kheragarh', 'Kiraoli', 'Barauli Ahir', 'Bichpuri'],
  'Gorakhpur': ['All Villages / District Central', 'Sahjanwa', 'Chauri Chaura', 'Bansgaon', 'Khajni', 'Campierganj', 'Pipraich', 'Bhalluan'],
  'Kanpur Nagar': ['All Villages / District Central', 'Bilhaur', 'Ghatampur', 'Kalyanpur', 'Sarsaul', 'Bidhnu', 'Choubepur', 'Patara'],

  // Rajasthan
  'Jodhpur': ['All Villages / District Central', 'Bhopalgarh', 'Bilara', 'Luni', 'Osian', 'Balesar', 'Baori', 'Shergarh', 'Phalodi', 'Tiwri', 'Mandore'],
  'Jaipur': ['All Villages / District Central', 'Chomu', 'Amer', 'Bassie', 'Chaksu', 'Jamwa Ramgarh', 'Kotputli', 'Phulera', 'Sanganer', 'Shahpura'],
  'Kota': ['All Villages / District Central', 'Ramganj Mandi', 'Sangod', 'Digod', 'Ladpura', 'Chechat', 'Kanwas', 'Morak'],
  'Bikaner': ['All Villages / District Central', 'Nokha', 'Lunkaransar', 'Kolayat', 'Khajuwala', 'Poogal', 'Chhatargarh', 'Sri Dungargarh'],

  // Gujarat
  'Rajkot': ['All Villages / District Central', 'Gondal', 'Jasdan', 'Jetpur', 'Dhoraji', 'Upleta', 'Kotda Sangani', 'Lodhika', 'Paddhari'],
  'Ahmedabad': ['All Villages / District Central', 'Sanand', 'Dholka', 'Dhandhuka', 'Bavla', 'Detroj', 'Mandal', 'Viramgam', 'Daskroi'],
  'Surat': ['All Villages / District Central', 'Bardoli', 'Mahuva', 'Mandvi', 'Mangrol', 'Olpad', 'Kamrej', 'Palsana', 'Umarpada'],

  // Madhya Pradesh
  'Indore': ['All Villages / District Central', 'Mhow (Dr. Ambedkar Nagar)', 'Depalpur', 'Sanwer', 'Hatod', 'Rau', 'Kshipra'],
  'Bhopal': ['All Villages / District Central', 'Berasia', 'Huzur', 'Kolar', 'Phanda', 'Nazeerabad', 'Bairagarh'],
  'Gwalior': ['All Villages / District Central', 'Dabra', 'Bhitarwar', 'Chinour', 'Ghatigaon', 'Morar', 'Barai'],

  // Tamil Nadu
  'Coimbatore': ['All Villages / District Central', 'Pollachi', 'Mettupalayam', 'Sulur', 'Annur', 'Kinathukadavu', 'Valparai', 'Madukkarai'],
  'Madurai': ['All Villages / District Central', 'Melur', 'Thirumangalam', 'Usilampatti', 'Vadipatti', 'Peraiyur', 'Sholavandan', 'Alanganallur'],
  'Thanjavur': ['All Villages / District Central', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Orathanadu', 'Peravurani', 'Budalur', 'Thiruvaiyaru'],

  // Andhra Pradesh
  'Guntur': ['All Villages / District Central', 'Tenali', 'Narasaraopet', 'Sattenapalle', 'Bapatla', 'Mangalagiri', 'Ponnur', 'Vinukonda', 'Chilakaluripet'],
  'Kurnool': ['All Villages / District Central', 'Adoni', 'Nandyal', 'Yemmiganur', 'Dhone', 'Allagadda', 'Nandikotkur', 'Pattikonda', 'Banaganapalle'],

  // Telangana
  'Warangal': ['All Villages / District Central', 'Jangaon', 'Narsampet', 'Parkal', 'Wardhannapet', 'Mahabubabad', 'Station Ghanpur', 'Mulugu'],
  'Karimnagar': ['All Villages / District Central', 'Huzurabad', 'Choppadandi', 'Manakondur', 'Jammikunta', 'Veenavanka', 'Thimmapur'],

  // Kerala
  'Palakkad': ['All Villages / District Central', 'Alathur', 'Chittur', 'Mannarkkad', 'Ottapalam', 'Pattambi', 'Cherpulassery', 'Kollengode'],
  'Wayanad': ['All Villages / District Central', 'Mananthavady', 'Sulthan Bathery', 'Vythiri', 'Kalpetta', 'Meenangadi', 'Pulpally'],

  // Himachal Pradesh
  'Shimla': ['All Villages / District Central', 'Rampur', 'Rohru', 'Theog', 'Chopal', 'Jubbal', 'Kotkhai', 'Kumarsain', 'Sunni', 'Narkanda'],
  'Kullu': ['All Villages / District Central', 'Manali', 'Banjar', 'Anni', 'Nirmand', 'Bhuntar', 'Naggar', 'Sainj'],

  // West Bengal
  'Nadia': ['All Villages / District Central', 'Krishnanagar', 'Ranaghat', 'Kalyani', 'Tehatta', 'Nabadwip', 'Santipur', 'Chakdaha', 'Karimpur'],
  'Bardhaman': ['All Villages / District Central', 'Kalna', 'Katwa', 'Memari', 'Galsi', 'Bhatar', 'Ausgram', 'Jamalpur']
};

export function getDistrictsForState(stateName: string): string[] {
  return STATE_DISTRICTS[stateName] || [
    'Central District',
    'North District',
    'South District',
    'East District',
    'West District',
  ];
}

export function getVillagesForDistrict(districtName: string): string[] {
  if (DISTRICT_VILLAGES[districtName]) {
    return DISTRICT_VILLAGES[districtName];
  }
  return [
    'All Villages / District Central',
    `${districtName} North Block`,
    `${districtName} South Block`,
    `${districtName} East Block`,
    `${districtName} West Block`,
    `${districtName} Rural Area`,
    `${districtName} Main Mandi Town`,
  ];
}

export const CROPS_LIST: string[] = [
  'Rice',
  'Wheat',
  'Maize',
  'Cotton',
  'Sugarcane',
  'Soybean',
  'Chickpea',
  'Pigeonpeas',
  'Blackgram',
  'Mungbean',
  'Lentil',
  'Kidneybeans',
  'Mothbeans',
  'Groundnut',
  'Mustard',
  'Tomato',
  'Potato',
  'Onion',
  'Banana',
  'Mango',
  'Papaya',
  'Apple',
  'Grapes',
  'Pomegranate',
  'Watermelon',
  'Muskmelon',
  'Orange',
  'Coconut',
  'Jute',
  'Coffee',
  'Chilli',
  'Turmeric',
  'Sunflower',
  'Sorghum',
  'Pearl Millet',
  'Barley',
  'Finger Millet'
];

export const SOIL_TYPES: string[] = [
  'Alluvial',
  'Black Cotton',
  'Red',
  'Laterite',
  'Sandy',
  'Clay',
  'Loamy',
  'Saline',
];

export const SEASONS: string[] = [
  'Kharif',
  'Rabi',
  'Zaid',
  'Whole Year',
];

export const MONTHS_OPTIONS = [
  { value: '1', label: '1 - January' },
  { value: '2', label: '2 - February' },
  { value: '3', label: '3 - March' },
  { value: '4', label: '4 - April' },
  { value: '5', label: '5 - May' },
  { value: '6', label: '6 - June' },
  { value: '7', label: '7 - July' },
  { value: '8', label: '8 - August' },
  { value: '9', label: '9 - September' },
  { value: '10', label: '10 - October' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - December' },
];

export const GROWTH_STAGES: string[] = [
  'Germination / Seedling',
  'Vegetative Growth',
  'Flowering / Tillering',
  'Fruit / Grain Formation',
  'Maturity / Ripening',
];

export const MONTHS_AHEAD_OPTIONS = [
  { value: '1', label: '1 Month Ahead' },
  { value: '2', label: '2 Months Ahead' },
  { value: '3', label: '3 Months Ahead' },
  { value: '6', label: '6 Months Ahead' },
  { value: '12', label: '1 Year Ahead' },
];

export interface CropRiskProfile {
  crop: string;
  risk_rating: 'Low' | 'Moderate' | 'High';
  climate_threats: string;
  major_pests_diseases: string[];
  soil_water_fit: string;
  critical_vulnerable_stage: string;
  preventive_measures: string[];
}

// Authoritative Crop Risk Intelligence Directory
export const CROP_RISK_PROFILES: Record<string, CropRiskProfile> = {
  'Cotton': {
    crop: 'Cotton',
    risk_rating: 'Moderate',
    climate_threats: 'Excessive waterlogging causes square and boll shedding; night frost retards vegetative canopy.',
    major_pests_diseases: ['Pink Bollworm (Pectinophora gossypiella)', 'Whitefly & Cotton Leaf Curl Virus', 'Bacterial Blight (Xanthomonas)', 'Spotted Bollworm'],
    soil_water_fit: 'Thrives on deep Black soils (Regur); strictly intolerant to standing water stagnation.',
    critical_vulnerable_stage: 'Square initiation, Flowering, and Active Boll formation.',
    preventive_measures: [
      'Install 5 pheromone traps per acre for early Pink Bollworm detection',
      'Create 30cm drainage furrows between ridges to discharge surface rainwater',
      'Foliar spray of 1% DAP + 1% Potassium Nitrate during peak boll filling stage'
    ]
  },
  'Rice': {
    crop: 'Rice',
    risk_rating: 'Low',
    climate_threats: 'Severe dry spells during panicle initiation cause spikelet sterility; unseasonal cyclonic rain during harvest leads to lodging.',
    major_pests_diseases: ['Rice Blast (Magnaporthe oryzae)', 'Brown Plant Hopper (BPH)', 'Bacterial Leaf Blight (Xanthomonas)', 'Yellow Stem Borer'],
    soil_water_fit: 'Requires 1200-1500mm seasonal water; clayey and alluvial soils with high water holding capacity are ideal.',
    critical_vulnerable_stage: 'Panicle initiation, Booting, Flowering, and Milk dough stage.',
    preventive_measures: [
      'Maintain 3-5 cm standing water layer during reproductive phase',
      'Apply bio-fungicide Tricyclazole 75% WP at boot leaf emergence against blast',
      'Practice alternate wetting and drying (AWD) to curb Brown Plant Hopper build-up'
    ]
  },
  'Wheat': {
    crop: 'Wheat',
    risk_rating: 'Low',
    climate_threats: 'Terminal heat stress (>32°C in February/March) causes premature grain shrivelling; unseasonal hail causes shattering.',
    major_pests_diseases: ['Yellow Stripe Rust (Puccinia striiformis)', 'Karnal Bunt (Tilletia indica)', 'Loose Smut', 'Wheat Aphids'],
    soil_water_fit: 'Well-drained fertile Alluvial or Loamy soils with neutral pH (6.5-7.5).',
    critical_vulnerable_stage: 'Crown Root Initiation (CRI: 21 DAS), Heading, and Grain filling.',
    preventive_measures: [
      'Compulsory first irrigation at CRI (21 days after sowing) to guarantee tillering',
      'Spray Propiconazole 25% EC (Tilt) at first sign of stripe rust pustules',
      'Give a light evening irrigation if early high-temperature heatwave occurs in March'
    ]
  },
  'Maize': {
    crop: 'Maize',
    risk_rating: 'Low',
    climate_threats: 'Waterlogging in the first 30 days causes root asphyxiation; drought during tasseling results in poor pollination.',
    major_pests_diseases: ['Fall Armyworm (Spodoptera frugiperda)', 'Maize Stem Borer (Chilo partellus)', 'Turcicum Leaf Blight'],
    soil_water_fit: 'Medium textured deep loamy soils rich in organic matter with pH 6.0-7.2.',
    critical_vulnerable_stage: 'Knee-high vegetative phase, Tasseling & Silking, and Grain filling.',
    preventive_measures: [
      'Whorl application of Emamectin Benzoate 5% SG or Chlorantraniliprole against Fall Armyworm',
      'Apply split Nitrogen doses: 1/3 at basal, 1/3 at knee-high, and 1/3 at tasseling',
      'Maintain clean drainage furrows to avoid any water stagnation exceeding 12 hours'
    ]
  },
  'Tomato': {
    crop: 'Tomato',
    risk_rating: 'High',
    climate_threats: 'High relative humidity (>85%) triggers sudden Late Blight epidemics; temperature above 35°C induces blossom drop.',
    major_pests_diseases: ['Late Blight (Phytophthora infestans)', 'Early Blight (Alternaria solani)', 'Tomato Leaf Curl Virus (ToLCV)', 'Fruit Borer (Helicoverpa)'],
    soil_water_fit: 'Sandy loam to clay loam soils with high organic matter, pH 6.0-7.0.',
    critical_vulnerable_stage: 'Transplanting, Peak Flowering, Fruit Setting, and Color break.',
    preventive_measures: [
      'Install yellow sticky traps (15/acre) to suppress whitefly vectors transmitting Leaf Curl',
      'Prophylactic spray of Metalaxyl + Mancozeb (Ridomil MZ) before cloudy wet spells',
      'Erect vertical trellising or bamboo staking to keep heavy fruit clusters off damp soil'
    ]
  },
  'Potato': {
    crop: 'Potato',
    risk_rating: 'Moderate',
    climate_threats: 'Night frost in Northern plains damages foliage; cloudy humid weather spurs devastating late blight.',
    major_pests_diseases: ['Late Blight', 'Bacterial Wilt (Ralstonia solanacearum)', 'Aphids (virus vectors)', 'Potato Tuber Moth'],
    soil_water_fit: 'Friable, loose sandy loam rich in organic carbon; pH 5.2-6.5.',
    critical_vulnerable_stage: 'Sprouting, Stolon formation, Tuber initiation, and Tuber bulking.',
    preventive_measures: [
      'Use certified disease-free seed tubers treated with Trichoderma viride',
      'Spray Cymoxanil + Mancozeb on national blight advisory alerts',
      'Dehaulm (cut foliage) 10-15 days prior to harvest to harden tuber skins'
    ]
  },
  'Onion': {
    crop: 'Onion',
    risk_rating: 'Moderate',
    climate_threats: 'Waterlogging causes rapid root rot and bulb decay; hot dry spells induce severe thrips attack.',
    major_pests_diseases: ['Purple Blotch (Alternaria porri)', 'Onion Thrips (Thrips tabaci)', 'Basal Rot (Fusarium)', 'Stemphylium Blight'],
    soil_water_fit: 'Well-drained sandy loam or alluvial soil with pH 6.5-7.5. Avoid heavy cracking clay.',
    critical_vulnerable_stage: 'Seedling establishment, Bulb initiation, and Bulb enlargement.',
    preventive_measures: [
      'Spray Spinosad or Fipronil with a wetting agent for thrips control',
      'Cease irrigation 10-14 days before harvest to prevent storage rotting',
      'Cure harvested bulbs in shade for 7 days to seal neck tissues'
    ]
  },
  'Chickpea': {
    crop: 'Chickpea',
    risk_rating: 'Low',
    climate_threats: 'Cloudy, damp weather promotes pod borer infestation; unseasonal heavy rains trigger collar and root rot.',
    major_pests_diseases: ['Fusarium Wilt', 'Gram Pod Borer (Helicoverpa armigera)', 'Ascochyta Blight', 'Dry Root Rot'],
    soil_water_fit: 'Medium to deep black soils and alluvial soils with pH 6.0-8.0; strictly cannot tolerate waterlogging.',
    critical_vulnerable_stage: 'Branching, Pre-flowering, and Early Pod development.',
    preventive_measures: [
      'Seed treatment with Rhizobium + Trichoderma culture before sowing',
      'Install 4-5 pheromone traps per acre to monitor Helicoverpa moth activity',
      'Spray Emamectin Benzoate 5% SG when young larvae appear on tender pods'
    ]
  },
  'Sugarcane': {
    crop: 'Sugarcane',
    risk_rating: 'Moderate',
    climate_threats: 'Severe summer moisture stress limits tillering; winter frost in North India causes bud killing.',
    major_pests_diseases: ['Red Rot (Colletotrichum falcatum)', 'Early Shoot Borer', 'Top Borer', 'Pyrilla perpusilla'],
    soil_water_fit: 'Deep alluvial and black soils with good drainage; requires 1500-2200mm annual water.',
    critical_vulnerable_stage: 'Germination phase, Formative tillering phase, and Grand growth period.',
    preventive_measures: [
      'Use certified disease-free 2-budded or 3-budded setts treated with Carbendazim',
      'Trash mulching between rows to conserve soil moisture and suppress weeds',
      'Timely earthing-up at 90 and 120 days after planting to prevent stalk lodging'
    ]
  },
  'Soybean': {
    crop: 'Soybean',
    risk_rating: 'Low',
    climate_threats: 'Mid-season dry spells during pod filling reduce grain size; water stagnation during harvest causes seed deterioration.',
    major_pests_diseases: ['Yellow Mosaic Virus (YMV)', 'Girdle Beetle (Obereopsis brevis)', 'Stem Fly', 'Semilooper'],
    soil_water_fit: 'Well-drained fertile black and loamy soils with pH 6.5-7.5.',
    critical_vulnerable_stage: 'Flowering, Pod initiation, and Seed filling.',
    preventive_measures: [
      'Seed treatment with Thiamethoxam 30 FS to protect early seedlings from stem fly',
      'Yellow sticky traps to suppress whiteflies transmitting Yellow Mosaic Virus',
      'Construct broad bed and furrow (BBF) layout to prevent water stagnation'
    ]
  },
  'Apple': {
    crop: 'Apple',
    risk_rating: 'Moderate',
    climate_threats: 'Insufficient winter chilling (<800 hours below 7°C) causes delayed foliation; spring frost or hailstorms destroy blossoms.',
    major_pests_diseases: ['Apple Scab (Venturia inaequalis)', 'San Jose Scale (Quadraspidiotus perniciosus)', 'Powdery Mildew', 'European Red Mite'],
    soil_water_fit: 'Deep, well-drained loamy hillside soils, pH 5.5-6.5.',
    critical_vulnerable_stage: 'Silver tip, Pink bud, Blossom petal fall, and Fruit expansion.',
    preventive_measures: [
      'Erect anti-hail net structures over orchards to protect fruit skin',
      'Apply Tree Spray Oil (TSO) during dormant stage against San Jose scale',
      'Difenoconazole or Captan sprays during primary scab ascospore discharge'
    ]
  },
  'Banana': {
    crop: 'Banana',
    risk_rating: 'Moderate',
    climate_threats: 'Strong gales or cyclonic winds cause pseudostem snapping; temperatures below 14°C induce choke throat.',
    major_pests_diseases: ['Panama Wilt (Fusarium oxysporum f. sp. cubense TR4)', 'Sigatoka Leaf Spot', 'Banana Pseudostem Weevil', 'Bunchy Top Virus'],
    soil_water_fit: 'Rich, well-drained loamy soil with high organic matter, pH 6.0-7.5; requires 1800-2200mm water.',
    critical_vulnerable_stage: 'Shooting (inflorescence emergence), Bunch development, and Finger filling.',
    preventive_measures: [
      'Plant certified disease-free tissue culture plantlets (Grand Naine)',
      'Bamboo prop or rope staking for shooting bunches to avoid wind lodging',
      'Mineral oil + Propiconazole foliar spray for Sigatoka leaf spot management'
    ]
  },
  'Mango': {
    crop: 'Mango',
    risk_rating: 'Low',
    climate_threats: 'Untimely winter rain or cloudy weather during flowering causes severe blossom blight and anthracnose.',
    major_pests_diseases: ['Mango Hopper (Idioscopus spp.)', 'Powdery Mildew (Oidium mangiferae)', 'Anthracnose (Colletotrichum)', 'Fruit Fly (Bactrocera dorsalis)'],
    soil_water_fit: 'Deep alluvial or red loamy soils with good drainage; pH 5.5-7.5.',
    critical_vulnerable_stage: 'Panicle emergence, Blossom flowering, and Pea-size fruit stage.',
    preventive_measures: [
      'Sulfur or Dinocap spray at panicle emergence to safeguard against powdery mildew',
      'Imidacloprid spray during pre-bloom stage to control mango hoppers',
      'Install methyl eugenol pheromone traps (6/acre) for fruit fly control'
    ]
  }
};

export function getCropRiskProfile(cropName: string): CropRiskProfile {
  if (CROP_RISK_PROFILES[cropName]) {
    return CROP_RISK_PROFILES[cropName];
  }
  // Generic comprehensive risk profile for other crops
  return {
    crop: cropName,
    risk_rating: 'Low',
    climate_threats: `Extreme temperature deviations or moisture stress during critical growth stages in ${cropName}.`,
    major_pests_diseases: ['Sucking pest complex (Aphids / Thrips)', 'Foliar Leaf Spot / Blight', 'Root Rot / Wilt in waterlogged soil'],
    soil_water_fit: 'Well-drained fertile loamy soil with neutral pH (6.0 - 7.5); maintain moderate root zone moisture.',
    critical_vulnerable_stage: 'Vegetative establishment, Flowering, and Fruit/Seed formation.',
    preventive_measures: [
      'Use certified quality seeds/planting material with fungicide seed treatment',
      'Install yellow/blue sticky traps to detect early insect pest arrivals',
      'Maintain balanced N-P-K nutrition and avoid prolonged soil moisture deficit'
    ]
  };
}

export interface CropFinancialBenchmark {
  crop: string;
  defaultYieldKgPerHa: number;
  defaultPricePerQuintal: number;
  defaultCostPerHa: number;
  durationDays: number;
  marketSeason: string;
}

export const CROP_FINANCIAL_BENCHMARKS: Record<string, CropFinancialBenchmark> = {
  Rice: { crop: 'Rice', defaultYieldKgPerHa: 3600, defaultPricePerQuintal: 2200, defaultCostPerHa: 28000, durationDays: 125, marketSeason: 'Oct - Dec' },
  Wheat: { crop: 'Wheat', defaultYieldKgPerHa: 3500, defaultPricePerQuintal: 2275, defaultCostPerHa: 26000, durationDays: 120, marketSeason: 'Mar - May' },
  Cotton: { crop: 'Cotton', defaultYieldKgPerHa: 2100, defaultPricePerQuintal: 7800, defaultCostPerHa: 36000, durationDays: 160, marketSeason: 'Nov - Feb' },
  Sugarcane: { crop: 'Sugarcane', defaultYieldKgPerHa: 75000, defaultPricePerQuintal: 340, defaultCostPerHa: 72000, durationDays: 365, marketSeason: 'Dec - Mar' },
  Maize: { crop: 'Maize', defaultYieldKgPerHa: 4200, defaultPricePerQuintal: 2150, defaultCostPerHa: 24000, durationDays: 105, marketSeason: 'Sep - Nov' },
  Soybean: { crop: 'Soybean', defaultYieldKgPerHa: 2200, defaultPricePerQuintal: 4600, defaultCostPerHa: 22000, durationDays: 95, marketSeason: 'Oct - Dec' },
  Tomato: { crop: 'Tomato', defaultYieldKgPerHa: 30000, defaultPricePerQuintal: 1800, defaultCostPerHa: 65000, durationDays: 110, marketSeason: 'Year-Round' },
  Potato: { crop: 'Potato', defaultYieldKgPerHa: 22000, defaultPricePerQuintal: 1400, defaultCostPerHa: 58000, durationDays: 90, marketSeason: 'Jan - Mar' },
  Onion: { crop: 'Onion', defaultYieldKgPerHa: 18000, defaultPricePerQuintal: 2100, defaultCostPerHa: 52000, durationDays: 120, marketSeason: 'Dec - Apr' },
  Chickpea: { crop: 'Chickpea', defaultYieldKgPerHa: 1800, defaultPricePerQuintal: 5400, defaultCostPerHa: 20000, durationDays: 100, marketSeason: 'Feb - Apr' },
  Pigeonpeas: { crop: 'Pigeonpeas', defaultYieldKgPerHa: 1600, defaultPricePerQuintal: 7000, defaultCostPerHa: 22000, durationDays: 150, marketSeason: 'Jan - Mar' },
  Groundnut: { crop: 'Groundnut', defaultYieldKgPerHa: 2400, defaultPricePerQuintal: 6400, defaultCostPerHa: 28000, durationDays: 110, marketSeason: 'Oct - Dec' },
  Mustard: { crop: 'Mustard', defaultYieldKgPerHa: 1900, defaultPricePerQuintal: 5650, defaultCostPerHa: 19000, durationDays: 110, marketSeason: 'Feb - Apr' },
  Apple: { crop: 'Apple', defaultYieldKgPerHa: 12000, defaultPricePerQuintal: 8500, defaultCostPerHa: 95000, durationDays: 180, marketSeason: 'Aug - Nov' },
  Banana: { crop: 'Banana', defaultYieldKgPerHa: 45000, defaultPricePerQuintal: 2200, defaultCostPerHa: 80000, durationDays: 330, marketSeason: 'Year-Round' },
  Mango: { crop: 'Mango', defaultYieldKgPerHa: 9000, defaultPricePerQuintal: 6200, defaultCostPerHa: 45000, durationDays: 150, marketSeason: 'Apr - Jul' },
  Coffee: { crop: 'Coffee', defaultYieldKgPerHa: 1100, defaultPricePerQuintal: 28000, defaultCostPerHa: 70000, durationDays: 240, marketSeason: 'Nov - Jan' },
  Jute: { crop: 'Jute', defaultYieldKgPerHa: 2800, defaultPricePerQuintal: 5050, defaultCostPerHa: 26000, durationDays: 120, marketSeason: 'Jul - Sep' },
  Blackgram: { crop: 'Blackgram', defaultYieldKgPerHa: 1200, defaultPricePerQuintal: 6950, defaultCostPerHa: 18000, durationDays: 85, marketSeason: 'Sep - Nov' },
  Mungbean: { crop: 'Mungbean', defaultYieldKgPerHa: 1100, defaultPricePerQuintal: 8550, defaultCostPerHa: 17000, durationDays: 75, marketSeason: 'May - Jul' },
  Lentil: { crop: 'Lentil', defaultYieldKgPerHa: 1400, defaultPricePerQuintal: 6400, defaultCostPerHa: 19000, durationDays: 110, marketSeason: 'Mar - May' },
  Watermelon: { crop: 'Watermelon', defaultYieldKgPerHa: 28000, defaultPricePerQuintal: 1100, defaultCostPerHa: 38000, durationDays: 85, marketSeason: 'Mar - Jun' },
  Muskmelon: { crop: 'Muskmelon', defaultYieldKgPerHa: 22000, defaultPricePerQuintal: 1600, defaultCostPerHa: 36000, durationDays: 80, marketSeason: 'Mar - May' },
  Papaya: { crop: 'Papaya', defaultYieldKgPerHa: 50000, defaultPricePerQuintal: 1800, defaultCostPerHa: 75000, durationDays: 270, marketSeason: 'Year-Round' },
  Pomegranate: { crop: 'Pomegranate', defaultYieldKgPerHa: 14000, defaultPricePerQuintal: 7500, defaultCostPerHa: 85000, durationDays: 180, marketSeason: 'Aug - Jan' },
  Orange: { crop: 'Orange', defaultYieldKgPerHa: 15000, defaultPricePerQuintal: 4500, defaultCostPerHa: 60000, durationDays: 210, marketSeason: 'Oct - Feb' },
  Coconut: { crop: 'Coconut', defaultYieldKgPerHa: 10000, defaultPricePerQuintal: 3500, defaultCostPerHa: 40000, durationDays: 365, marketSeason: 'Year-Round' },
};

export function getCropFinancialBenchmark(cropName: string): CropFinancialBenchmark {
  if (CROP_FINANCIAL_BENCHMARKS[cropName]) {
    return CROP_FINANCIAL_BENCHMARKS[cropName];
  }
  return {
    crop: cropName,
    defaultYieldKgPerHa: 2800,
    defaultPricePerQuintal: 3200,
    defaultCostPerHa: 28000,
    durationDays: 110,
    marketSeason: 'Post-Harvest',
  };
}
