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
  ],
  'Odisha': [
    'Bhubaneswar (Khurda)', 'Cuttack', 'Ganjam', 'Balasore', 'Sambalpur', 'Bhadrak', 'Puri', 'Bargarh', 'Mayurbhanj', 'Kalahandi', 'Koraput', 'Jajpur', 'Angul', 'Bolangir', 'Kendrapara'
  ],
  'Assam': [
    'Guwahati (Kamrup Metro)', 'Kamrup', 'Nagaon', 'Sonitpur', 'Barpeta', 'Dhubri', 'Cachar', 'Dibrugarh', 'Jorhat', 'Golaghat', 'Tinsukia', 'Sivasagar', 'Goalpara', 'Karimganj'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Bastar', 'Korba', 'Janjgir-Champa', 'Raigarh', 'Dhamtari', 'Mahasamund', 'Kanker', 'Surguja', 'Kabirdham', 'Balod'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur (East Singhbhum)', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Palamu', 'Dumka', 'West Singhbhum', 'Ramgarh', 'Koderma'
  ],
  'Goa': [
    'North Goa', 'South Goa'
  ],
  'Arunachal Pradesh': [
    'Itanagar (Papum Pare)', 'Tawang', 'West Kameng', 'East Kameng', 'Lower Subansiri', 'Changlang', 'Tirap', 'Lohit', 'Namsai'
  ],
  'Manipur': [
    'Imphal East', 'Imphal West', 'Bishnupur', 'Thoubal', 'Churachandpur', 'Senapati', 'Ukhrul', 'Kakching'
  ],
  'Meghalaya': [
    'East Khasi Hills (Shillong)', 'West Garo Hills', 'Ri-Bhoi', 'West Khasi Hills', 'East Jaintia Hills', 'South Garo Hills'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Mon', 'Wokha', 'Zunheboto', 'Phek', 'Tuensang'
  ],
  'Sikkim': [
    'Gangtok (East Sikkim)', 'Namchi (South Sikkim)', 'Gyalshing (West Sikkim)', 'Mangan (North Sikkim)', 'Pakyong', 'Soreng'
  ],
  'Tripura': [
    'West Tripura (Agartala)', 'Gomati', 'South Tripura', 'North Tripura', 'Dhalai', 'Khowai', 'Sepahijala', 'Unakoti'
  ]
};

// Comprehensive mapping of District -> Authentic Villages / Taluks / Tehsils
export const DISTRICT_VILLAGES: Record<string, string[]> = {
  // Karnataka
  'Belgaum': ['All Villages / District Central', 'Gokak', 'Athani', 'Chikkodi', 'Bailhongal', 'Hukkeri', 'Khanapur', 'Mudalagi', 'Nipani', 'Ramdurg', 'Raybag', 'Saundatti', 'Kagwad', 'Yadwad', 'Sankeshwar'],
  'Hassan': ['All Villages / District Central', 'Channarayapatna', 'Arsikere', 'Holenarasipura', 'Sakleshpur', 'Arkalgud', 'Belur', 'Alur', 'Shravanabelagola'],
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
  'West Godavari': ['All Villages / District Central', 'Bhimavaram', 'Tadepalligudem', 'Tanuku', 'Palakollu', 'Narasapuram', 'Akividu', 'Undi', 'Achanta', 'Jangareddigudem'],
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

// Authoritative 37-Crop Risk Intelligence Directory
export const CROP_RISK_PROFILES: Record<string, CropRiskProfile> = {
  'Rice': {
    crop: 'Rice',
    risk_rating: 'Low',
    climate_threats: "Severe dry spells during panicle initiation cause spikelet sterility; unseasonal cyclonic rain during harvest leads to lodging.",
    major_pests_diseases: [
      "Rice blast (Magnaporthe/Pyricularia oryzae)",
      "Bacterial leaf blight (Xanthomonas oryzae pv. oryzae)",
      "Sheath blight (Rhizoctonia solani)",
      "Brown spot (Bipolaris oryzae)",
      "Yellow stem borer (Scirpophaga incertulas)",
      "Brown planthopper (Nilaparvata lugens)",
      "White-backed planthopper (Sogatella furcifera)",
      "Rice leaf folder (Cnaphalocrocis medinalis)",
      "Rice gall midge (Orseolia oryzae)"
],
    soil_water_fit: "Requires 1200-1500mm seasonal water; clayey and alluvial soils with high water holding capacity are ideal.",
    critical_vulnerable_stage: "Panicle initiation, Booting, Flowering, and Milk dough stage.",
    preventive_measures: [
      "Maintain 3-5 cm standing water layer during reproductive phase",
      "Apply bio-fungicide Tricyclazole 75% WP at boot leaf emergence against blast",
      "Practice alternate wetting and drying (AWD) to curb Brown Planthopper build-up",
      "Install pheromone traps (5/acre) for yellow stem borer monitoring and clip seedling tips before transplanting"
]
  },
  'Wheat': {
    crop: 'Wheat',
    risk_rating: 'Low',
    climate_threats: "Terminal heat stress (>32\u00b0C in February/March) causes premature grain shrivelling; unseasonal hail causes shattering.",
    major_pests_diseases: [
      "Stripe/yellow rust (Puccinia striiformis)",
      "Leaf/brown rust (Puccinia triticina)",
      "Powdery mildew (Blumeria graminis)",
      "Karnal bunt (Tilletia indica)",
      "Wheat aphids (Sitobion avenae / Rhopalosiphum padi)",
      "Termites (Odontotermes obesus)",
      "Armyworms (Mythimna separata)",
      "Shoot fly (Atherigona spp.)"
],
    soil_water_fit: "Well-drained fertile Alluvial or Loamy soils with neutral pH (6.5-7.5).",
    critical_vulnerable_stage: "Crown Root Initiation (CRI: 21 DAS), Heading, and Grain filling.",
    preventive_measures: [
      "Compulsory first irrigation at CRI (21 days after sowing) to guarantee tillering",
      "Spray Propiconazole 25% EC (Tilt @ 1 ml/L) at first sign of stripe rust pustules",
      "Seed treatment with Carboxin + Thiram (2.5 g/kg) and Chlorpyrifos against termites",
      "Spray Dimethoate or Thiamethoxam if aphid population exceeds 10-15 per tiller"
]
  },
  'Maize': {
    crop: 'Maize',
    risk_rating: 'Low',
    climate_threats: "Waterlogging in the first 30 days causes root asphyxiation; drought during tasseling results in poor pollination.",
    major_pests_diseases: [
      "Turcicum leaf blight (Exserohilum turcicum)",
      "Maydis leaf blight (Bipolaris maydis)",
      "Downy mildew (Peronosclerospora sorghi)",
      "Stalk rot (Fusarium verticillioides / Macrophomina)",
      "Fall armyworm (Spodoptera frugiperda)",
      "Maize stem borer (Chilo partellus)",
      "Shoot fly (Atherigona soccata)",
      "Maize aphids (Rhopalosiphum maidis)"
],
    soil_water_fit: "Medium textured deep loamy soils rich in organic matter with pH 6.0-7.2.",
    critical_vulnerable_stage: "Knee-high vegetative phase, Tasseling & Silking, and Grain filling.",
    preventive_measures: [
      "Whorl application of Emamectin Benzoate 5% SG or Chlorantraniliprole against Fall Armyworm",
      "Apply Mancozeb 75% WP (2 g/L) at first symptom of leaf blight",
      "Apply split Nitrogen doses: 1/3 basal, 1/3 knee-high, and 1/3 tasseling",
      "Ensure effective surface drainage furrows to avoid water stagnation exceeding 12 hours"
]
  },
  'Cotton': {
    crop: 'Cotton',
    risk_rating: 'Moderate',
    climate_threats: "Excessive waterlogging causes square and boll shedding; night frost retards vegetative canopy.",
    major_pests_diseases: [
      "Bacterial blight/black arm (Xanthomonas citri pv. malvacearum)",
      "Grey mildew (Ramularia areola)",
      "Alternaria leaf spot (Alternaria macrospora)",
      "Fusarium wilt (Fusarium oxysporum f. sp. vasinfectum)",
      "Boll rot complex",
      "Pink bollworm (Pectinophora gossypiella)",
      "American bollworm (Helicoverpa armigera)",
      "Whitefly (Bemisia tabaci)",
      "Jassids (Amrasca biguttula biguttula)",
      "Thrips (Thrips tabaci)",
      "Cotton aphid (Aphis gossypii)"
],
    soil_water_fit: "Thrives on deep Black soils (Regur); strictly intolerant to standing water stagnation.",
    critical_vulnerable_stage: "Square initiation, Flowering, and Active Boll formation.",
    preventive_measures: [
      "Install 5-8 pheromone traps per acre for early Pink Bollworm monitoring",
      "Spray Copper Oxychloride (2.5 g/L) + Streptocycline (0.1 g/L) against bacterial blight",
      "Use yellow sticky traps (15/acre) and spray Diafenthiuron or Flonicamid against whitefly/jassids",
      "Foliar spray of 1% DAP + 1% Potassium Nitrate during peak boll filling stage"
]
  },
  'Sugarcane': {
    crop: 'Sugarcane',
    risk_rating: 'Moderate',
    climate_threats: "Severe summer moisture stress limits tillering; winter frost in North India causes bud killing.",
    major_pests_diseases: [
      "Red rot (Colletotrichum falcatum)",
      "Smut (Sporisorium scitamineum)",
      "Wilt (Fusarium sacchari)",
      "Grassy shoot disease (Phytoplasma)",
      "Yellow leaf disease (Sugarcane yellow leaf virus)",
      "Early shoot borer (Chilo infuscatellus)",
      "Top shoot borer (Scirpophaga excerptalis)",
      "Sugarcane leaf hopper (Pyrilla perpusilla)",
      "Sugarcane whitefly (Aleurolobus barodensis)",
      "Sugarcane woolly aphid (Ceratovacuna lanigera)",
      "Termites (Odontotermes obesus)"
],
    soil_water_fit: "Deep alluvial and black soils with good drainage; requires 1500-2200mm annual water.",
    critical_vulnerable_stage: "Germination phase, Formative tillering phase, and Grand growth period.",
    preventive_measures: [
      "Use certified disease-free 2-budded or 3-budded setts treated with Carbendazim (1 g/L)",
      "Trash mulching between rows to conserve moisture and suppress early shoot borers",
      "Conserve Epiricania melanoleuca for biological control of Pyrilla leaf hoppers",
      "Timely earthing-up at 90 and 120 days after planting to prevent stalk lodging"
]
  },
  'Soybean': {
    crop: 'Soybean',
    risk_rating: 'Low',
    climate_threats: "Mid-season dry spells during pod filling reduce grain size; water stagnation during harvest causes seed deterioration.",
    major_pests_diseases: [
      "Soybean rust (Phakopsora pachyrhizi)",
      "Alternaria leaf spot (Alternaria alternata)",
      "Bacterial pustule (Xanthomonas axonopodis pv. glycines)",
      "Charcoal rot (Macrophomina phaseolina)",
      "Pod blight (Colletotrichum truncatum)",
      "Girdle beetle (Obereopsis brevis)",
      "Stem fly (Melanagromyza sojae)",
      "Spodoptera / Tobacco caterpillar (Spodoptera litura)",
      "Semilooper (Chrysodeixis acuta)",
      "Hairy caterpillar (Spilosoma obliqua)",
      "Whitefly (Bemisia tabaci)"
],
    soil_water_fit: "Well-drained fertile black and loamy soils with pH 6.5-7.5.",
    critical_vulnerable_stage: "Flowering, Pod initiation, and Seed filling.",
    preventive_measures: [
      "Seed treatment with Thiamethoxam 30 FS (3 ml/kg) + Carbendazim + Mancozeb (2 g/kg)",
      "Spray Chlorantraniliprole 18.5% SC (0.3 ml/L) for girdle beetle and semilooper control",
      "Construct broad bed and furrow (BBF) layout to prevent water stagnation",
      "Spray Hexaconazole or Tebuconazole (1 ml/L) at first symptom of rust"
]
  },
  'Chickpea': {
    crop: 'Chickpea',
    risk_rating: 'Low',
    climate_threats: "Cloudy, damp weather promotes pod borer infestation; unseasonal heavy rains trigger collar and root rot.",
    major_pests_diseases: [
      "Fusarium wilt (Fusarium oxysporum f. sp. ciceris)",
      "Ascochyta blight (Ascochyta rabiei)",
      "Dry root rot (Rhizoctonia bataticola)",
      "Botrytis grey mould (Botrytis cinerea)",
      "Gram pod borer (Helicoverpa armigera)",
      "Cutworm (Agrotis ipsilon)",
      "Aphids (Aphis craccivora)",
      "Termites (Odontotermes obesus)"
],
    soil_water_fit: "Medium to deep black soils and alluvial soils with pH 6.0-8.0; strictly intolerant to waterlogging.",
    critical_vulnerable_stage: "Branching, Pre-flowering, and Early Pod development.",
    preventive_measures: [
      "Seed treatment with Rhizobium + Trichoderma viride (5 g/kg) before sowing",
      "Install 4-5 pheromone traps per acre to monitor Helicoverpa moth activity",
      "Spray Emamectin Benzoate 5% SG (0.4 g/L) when young larvae appear on tender pods",
      "Adopt deep summer ploughing and avoid chickpea monoculture"
]
  },
  'Pigeonpeas': {
    crop: 'Pigeonpeas',
    risk_rating: 'Moderate',
    climate_threats: "Waterlogging during early vegetative phase causes Phytophthora stem rot; excessive cloudy humid spells induce flower drop.",
    major_pests_diseases: [
      "Fusarium wilt (Fusarium udum)",
      "Sterility mosaic disease (SMD / Pigeonpea sterility mosaic virus)",
      "Phytophthora blight (Phytophthora cajani)",
      "Alternaria blight (Alternaria alternata)",
      "Gram pod borer (Helicoverpa armigera)",
      "Pod fly (Melanagromyza obtusa)",
      "Pod bug (Clavigralla gibbosa)",
      "Plume moth (Exelastis atomosa)",
      "Blister beetle (Mylabris phalerata)"
],
    soil_water_fit: "Deep well-drained loamy and medium black soils with pH 6.5-7.8.",
    critical_vulnerable_stage: "Branching, Flower bud initiation, and Pod development.",
    preventive_measures: [
      "Grow wilt- and sterility mosaic-resistant varieties like Asha (ICPL 87119) or Maruti (ICP 8863)",
      "Spray Fenazaquin or Propargite against eriophyid mite vector of sterility mosaic",
      "Spray Monocrotophos / Chlorantraniliprole at 50% flowering for pod borer and pod fly protection",
      "Plant on ridges with intercrops like sorghum or pearl millet"
]
  },
  'Blackgram': {
    crop: 'Blackgram',
    risk_rating: 'Low',
    climate_threats: "Continuous rainfall during ripening causes grain sprouting inside pods; hot dry spells accelerate whitefly viral transmission.",
    major_pests_diseases: [
      "Yellow mosaic disease (Mungbean yellow mosaic virus)",
      "Powdery mildew (Erysiphe polygoni)",
      "Cercospora leaf spot (Cercospora canescens)",
      "Anthracnose (Colletotrichum lindemuthianum)",
      "Whitefly (Bemisia tabaci)",
      "Aphid (Aphis craccivora)",
      "Thrips (Caliothrips indicus)",
      "Pod borer (Helicoverpa armigera / Maruca vitrata)",
      "Bihar hairy caterpillar (Spilosoma obliqua)"
],
    soil_water_fit: "Well-drained loam or clay loam with neutral pH (6.5-7.5).",
    critical_vulnerable_stage: "Vegetative branching, Peak flowering, and Pod filling.",
    preventive_measures: [
      "Seed treatment with Imidacloprid 70% WS (5 g/kg) and Carbendazim (2 g/kg)",
      "Install yellow sticky traps (15/acre) to suppress whitefly vectors",
      "Spray Wettable Sulphur 80% WP (2.5 g/L) at first sign of powdery mildew",
      "Apply Chlorantraniliprole 18.5% SC (0.3 ml/L) at early pod borer infestation"
]
  },
  'Mungbean': {
    crop: 'Mungbean',
    risk_rating: 'Low',
    climate_threats: "Excess moisture during maturity induces pod shattering and mold; dry hot spells promote whitefly-borne viral spread.",
    major_pests_diseases: [
      "Yellow mosaic disease (MYMV)",
      "Powdery mildew (Erysiphe polygoni)",
      "Cercospora leaf spot (Cercospora canescens)",
      "Anthracnose (Colletotrichum lindemuthianum)",
      "Whitefly (Bemisia tabaci)",
      "Thrips (Caliothrips indicus)",
      "Aphid (Aphis craccivora)",
      "Pod borer (Maruca vitrata / Helicoverpa)",
      "Stem fly (Ophiomyia phaseoli)"
],
    soil_water_fit: "Fertile alluvial, red, or medium black sandy loam with good drainage; pH 6.2-7.2.",
    critical_vulnerable_stage: "Early seedling (stem fly), Flowering, and Pod development.",
    preventive_measures: [
      "Grow MYMV-resistant cultivars such as IPM 02-3 or Samrat",
      "Seed treatment with Thiamethoxam 30 FS to ward off early stem fly and whitefly",
      "Spray Hexaconazole 5% EC (1.0 ml/L) for powdery mildew and Cercospora",
      "Harvest mature pods in pickings to minimize shattering loss"
]
  },
  'Lentil': {
    crop: 'Lentil',
    risk_rating: 'Low',
    climate_threats: "Severe frost at flowering causes blossom drop; high humidity combined with temperatures above 22\u00b0C promotes blight.",
    major_pests_diseases: [
      "Lentil rust (Uromyces viciae-fabae)",
      "Fusarium wilt (Fusarium oxysporum f. sp. lentis)",
      "Ascochyta blight (Ascochyta lentis)",
      "Stemphylium blight (Stemphylium botryosum)",
      "Aphids (Aphis craccivora)",
      "Pod borer (Helicoverpa armigera)",
      "Cutworm (Agrotis ipsilon)",
      "Thrips (Caliothrips indicus)"
],
    soil_water_fit: "Can grow on light loams to heavy clay soils; intolerant of saline-alkali or waterlogged soils.",
    critical_vulnerable_stage: "Branching, Flowering, and Pod filling.",
    preventive_measures: [
      "Seed treatment with Trichoderma viride (4 g/kg) + Carboxin (2 g/kg)",
      "Foliar spray of Mancozeb (2 g/L) or Chlorothalonil (2 g/L) for rust and blight",
      "Spray Dimethoate 30% EC (1.5 ml/L) or Neem oil (3 ml/L) when aphids colonize shoots",
      "Ensure shallow sowing (3-4 cm) in firm moist seedbed"
]
  },
  'Kidneybeans': {
    crop: 'Kidneybeans',
    risk_rating: 'Moderate',
    climate_threats: "Highly sensitive to frost and prolonged waterlogging; extreme summer heat (>30\u00b0C) triggers flower abortion.",
    major_pests_diseases: [
      "Anthracnose (Colletotrichum lindemuthianum)",
      "Common bacterial blight (Xanthomonas axonopodis pv. phaseoli)",
      "Angular leaf spot (Phaeoisariopsis griseola)",
      "Rust (Uromyces appendiculatus)",
      "Bean aphid (Aphis fabae)",
      "Bean fly / Stem miner (Ophiomyia phaseoli)",
      "Thrips (Thrips tabaci)",
      "Pod borer (Helicoverpa armigera)"
],
    soil_water_fit: "Light, well-aerated fertile loamy soil rich in organic matter; pH 5.5-6.5.",
    critical_vulnerable_stage: "Emergence, Pre-flowering, Pod setting, and Grain filling.",
    preventive_measures: [
      "Use certified disease-free western/hill seeds; avoid overhead sprinkler watering",
      "Spray Copper Oxychloride 50 WP (2.5 g/L) + Streptocycline (0.1 g/L) for bacterial blight",
      "Apply Mancozeb 75 WP (2 g/L) or Carbendazim (1 g/L) at first spot appearance",
      "Spray Imidacloprid (0.4 ml/L) to prevent bean fly stem mining in early weeks"
]
  },
  'Mothbeans': {
    crop: 'Mothbeans',
    risk_rating: 'Low',
    climate_threats: "Exceptionally drought-tolerant but susceptible to fungal collar rot during rare waterlogging.",
    major_pests_diseases: [
      "Yellow mosaic disease (Mungbean yellow mosaic virus)",
      "Powdery mildew (Erysiphe polygoni)",
      "Root rot / Macrophomina wilt (Macrophomina phaseolina)",
      "Bacterial leaf spot (Xanthomonas phaseoli)",
      "Mungbean / Legume aphid (Aphis craccivora)",
      "Whitefly (Bemisia tabaci)",
      "Pod borer (Cydia ptychora)",
      "Thrips (Caliothrips indicus)"
],
    soil_water_fit: "Adapted to arid, sandy desert soils; requires minimum rainfall (200-400mm).",
    critical_vulnerable_stage: "Seedling emergence, Flowering, and Pod filling.",
    preventive_measures: [
      "Treat seed with Carbendazim (2 g/kg) + Thiamethoxam (3 g/kg)",
      "Spray Wettable Sulphur (2.5 g/L) or Dinocap (1 ml/L) for powdery mildew control",
      "Install yellow sticky boards (10/acre) to suppress virus-carrying whiteflies",
      "Maintain wide spacing to allow air circulation in dryland canopies"
]
  },
  'Groundnut': {
    crop: 'Groundnut',
    risk_rating: 'Moderate',
    climate_threats: "Dry spell during pegging and pod development prevents gynophore soil entry; unseasonal rains at maturity cause seed sprouting.",
    major_pests_diseases: [
      "Tikka / Early leaf spot (Cercospora arachidicola)",
      "Late leaf spot (Phaeoisariopsis personata)",
      "Groundnut rust (Puccinia arachidis)",
      "Stem / Root rot (Sclerotium rolfsii)",
      "Collar rot / Crown rot (Aspergillus niger)",
      "Groundnut leaf miner (Aproaerema modicella)",
      "White grub (Holotrichia consanguinea)",
      "Groundnut aphid (Aphis craccivora)",
      "Thrips (Scirtothrips dorsalis / Frankliniella schultzei)",
      "Red hairy caterpillar (Amsacta albistriga)"
],
    soil_water_fit: "Well-drained light sandy loam with friable texture for peg penetration; pH 6.0-7.5.",
    critical_vulnerable_stage: "Flowering, Peg penetration (35-50 DAS), and Pod filling.",
    preventive_measures: [
      "Seed treatment with Trichoderma viride (5 g/kg) or Mancozeb + Carbendazim (Saaf @ 2 g/kg)",
      "Spray Tebuconazole 25.9% EC (1.0 ml/L) or Chlorothalonil (2 g/L) for Tikka leaf spot and rust",
      "Apply Phorate 10G or Chlorpyrifos 20 EC into soil furrow before sowing against white grubs",
      "Gypsum application @ 200 kg/acre at 40-45 DAS to provide Calcium for pod filling"
]
  },
  'Mustard': {
    crop: 'Mustard',
    risk_rating: 'Moderate',
    climate_threats: "Cloudy, warm weather in January promotes explosive mustard aphid outbreaks; frost at pod stage shrivels seeds.",
    major_pests_diseases: [
      "Alternaria blight (Alternaria brassicae)",
      "White rust (Albugo candida)",
      "Downy mildew (Hyaloperonospora brassicae)",
      "Powdery mildew (Erysiphe cruciferarum)",
      "Sclerotinia stem rot (Sclerotinia sclerotiorum)",
      "Mustard aphid (Lipaphis erysimi)",
      "Painted bug (Bagrada hilaris)",
      "Mustard sawfly (Athalia lugens proxima)",
      "Diamondback moth (Plutella xylostella)"
],
    soil_water_fit: "Alluvial, light to heavy loams with good subsoil drainage; pH 6.0-7.5.",
    critical_vulnerable_stage: "Branching, Flowering, and Siliqua (pod) formation.",
    preventive_measures: [
      "Early sowing in first fortnight of October to escape aphid explosion in January",
      "Spray Dimethoate 30% EC (1.5 ml/L) or Thiamethoxam 25% WG (0.3 g/L) when aphid colony reaches 25 aphids/plant",
      "Spray Mancozeb 75% WP (2 g/L) or Ridomil MZ (2 g/L) for white rust and Alternaria blight",
      "Practice clean weeding and destroy brassica weed hosts like wild radish"
]
  },
  'Tomato': {
    crop: 'Tomato',
    risk_rating: 'High',
    climate_threats: "High humidity (>85%) triggers sudden Late Blight epidemics; summer heat above 35\u00b0C induces flower drop.",
    major_pests_diseases: [
      "Early blight (Alternaria solani)",
      "Late blight (Phytophthora infestans)",
      "Bacterial wilt (Ralstonia solanacearum)",
      "Bacterial spot (Xanthomonas vesicatoria)",
      "Tomato leaf curl virus (ToLCV)",
      "Fruit borer (Helicoverpa armigera)",
      "Whitefly (Bemisia tabaci)",
      "Leaf miner (Liriomyza trifolii)",
      "Aphids (Myzus persicae)",
      "Thrips (Frankliniella occidentalis)",
      "Tomato pinworm / Tuta absoluta"
],
    soil_water_fit: "Sandy loam to clay loam soils with high organic matter, pH 6.0-7.0.",
    critical_vulnerable_stage: "Transplanting, Peak Flowering, Fruit Setting, and Color break.",
    preventive_measures: [
      "Install yellow sticky traps (15/acre) and pheromone traps for Helicoverpa and Tuta absoluta",
      "Prophylactic spray of Metalaxyl + Mancozeb (Ridomil MZ @ 2 g/L) before cloudy wet spells",
      "Drench nursery bed with Copper Oxychloride (3 g/L) to prevent bacterial wilt and damping-off",
      "Erect vertical trellising or bamboo staking to keep heavy fruit clusters off damp soil"
]
  },
  'Potato': {
    crop: 'Potato',
    risk_rating: 'Moderate',
    climate_threats: "Night frost in Northern plains damages foliage; cloudy humid weather spurs devastating late blight.",
    major_pests_diseases: [
      "Late blight (Phytophthora infestans)",
      "Early blight (Alternaria solani)",
      "Bacterial wilt / Brown rot (Ralstonia solanacearum)",
      "Black scurf (Rhizoctonia solani)",
      "Common scab (Streptomyces scabies)",
      "Potato tuber moth (Phthorimaea operculella)",
      "Aphids (Myzus persicae - virus vector)",
      "Cutworm (Agrotis ipsilon)",
      "Whitefly (Bemisia tabaci)"
],
    soil_water_fit: "Friable, loose sandy loam rich in organic carbon; pH 5.2-6.5.",
    critical_vulnerable_stage: "Sprouting, Stolon formation, Tuber initiation, and Tuber bulking.",
    preventive_measures: [
      "Use certified disease-free seed tubers treated with Trichoderma viride or boric acid (3%)",
      "Spray Cymoxanil + Mancozeb or Dimethomorph + Mancozeb on national blight advisory alerts",
      "Cover exposed tubers thoroughly during earthing up to prevent tuber moth oviposition",
      "Dehaulm (cut foliage) 10-15 days prior to harvest to harden tuber skins"
]
  },
  'Onion': {
    crop: 'Onion',
    risk_rating: 'Moderate',
    climate_threats: "Waterlogging causes rapid root rot and bulb decay; hot dry spells induce severe thrips attack.",
    major_pests_diseases: [
      "Purple blotch (Alternaria porri)",
      "Downy mildew (Peronospora destructor)",
      "Stemphylium blight (Stemphylium vesicarium)",
      "Basal rot (Fusarium oxysporum f. sp. cepae)",
      "Onion smut (Urocystis cepulae)",
      "Onion thrips (Thrips tabaci)",
      "Onion maggot / fly (Delia antiqua)",
      "Tobacco caterpillar (Spodoptera litura)",
      "Cutworm (Agrotis ipsilon)"
],
    soil_water_fit: "Well-drained sandy loam or alluvial soil with pH 6.5-7.5. Avoid heavy cracking clay.",
    critical_vulnerable_stage: "Seedling establishment, Bulb initiation, and Bulb enlargement.",
    preventive_measures: [
      "Spray Spinosad 45% SC (0.3 ml/L) or Fipronil 5% SC (1.5 ml/L) with sticker for thrips control",
      "Spray Mancozeb 75% WP (2.5 g/L) + sticker (Triton) at first sign of purple blotch",
      "Cease irrigation 10-14 days before harvest to prevent post-harvest neck rotting",
      "Cure harvested bulbs in shade for 7-10 days to seal outer skin tissues"
]
  },
  'Banana': {
    crop: 'Banana',
    risk_rating: 'Moderate',
    climate_threats: "Strong gales or cyclonic winds cause pseudostem snapping; temperatures below 14\u00b0C induce choke throat.",
    major_pests_diseases: [
      "Panama disease / Fusarium wilt (Fusarium oxysporum f. sp. cubense TR4)",
      "Sigatoka leaf spot (Mycosphaerella musicola / fijiensis)",
      "Bacterial soft rot / Head rot (Dickeya dadantii / Pectobacterium)",
      "Banana bunchy top disease (BBTV)",
      "Rhizome weevil (Cosmopolites sordidus)",
      "Banana pseudostem borer (Odoiporus longicollis)",
      "Banana aphid (Pentalonia nigronervosa - BBTV vector)",
      "Banana thrips (Chaetanaphothrips signipennis)"
],
    soil_water_fit: "Rich, well-drained loamy soil with high organic matter, pH 6.0-7.5; requires 1800-2200mm water.",
    critical_vulnerable_stage: "Shooting (inflorescence emergence), Bunch development, and Finger filling.",
    preventive_measures: [
      "Plant certified disease-free tissue culture plantlets (Grand Naine)",
      "Inject pseudostem with Monocrotophos (1:4 with water) for stem borer management",
      "Bamboo prop or rope staking for shooting bunches to avoid wind lodging",
      "Mineral oil + Propiconazole (1 ml/L) foliar spray for Sigatoka leaf spot control"
]
  },
  'Mango': {
    crop: 'Mango',
    risk_rating: 'Low',
    climate_threats: "Untimely winter rain or cloudy weather during flowering causes severe blossom blight and anthracnose.",
    major_pests_diseases: [
      "Powdery mildew (Oidium mangiferae)",
      "Anthracnose (Colletotrichum gloeosporioides)",
      "Bacterial canker (Xanthomonas citri pv. mangiferaeindicae)",
      "Mango malformation (Fusarium moniliforme var. subglutinans)",
      "Dieback (Lasiodiplodia theobromae)",
      "Mango hopper (Idioscopus clypealis / Amritodus atkinsoni)",
      "Mango giant mealybug (Drosicha mangiferae)",
      "Inflorescence midge (Erosomyia mangiferae)",
      "Fruit fly (Bactrocera dorsalis)",
      "Stone weevil (Sternochetus mangiferae)",
      "Shoot gall maker (Apsylla cistellata)"
],
    soil_water_fit: "Deep alluvial or red loamy soils with good drainage; pH 5.5-7.5.",
    critical_vulnerable_stage: "Panicle emergence, Blossom flowering, and Pea-size fruit stage.",
    preventive_measures: [
      "Sulfur 80% WP (2 g/L) or Dinocap spray at panicle emergence to safeguard against powdery mildew",
      "Imidacloprid (0.3 ml/L) spray during pre-bloom stage to control destructive mango hoppers",
      "Install methyl eugenol pheromone traps (6/acre) for fruit fly control",
      "Prune overcrowded interior criss-cross twigs after harvest to ensure sunlight penetration"
]
  },
  'Papaya': {
    crop: 'Papaya',
    risk_rating: 'Moderate',
    climate_threats: "Excess moisture or flooding exceeding 24 hours induces fatal collar and root rot; frost halts latex flow.",
    major_pests_diseases: [
      "Papaya ringspot virus (PRSV)",
      "Powdery mildew (Oidium caricae)",
      "Anthracnose (Colletotrichum gloeosporioides)",
      "Damping-off (Pythium aphanidermatum)",
      "Foot rot / Root rot (Phytophthora palmivora)",
      "Papaya mealybug (Paracoccus marginatus)",
      "Papaya whitefly (Bemisia tabaci)",
      "Aphid vector complex (Aphis gossypii / Myzus persicae)",
      "Red spider mite (Tetranychus cinnabarinus)",
      "Fruit fly (Bactrocera papayae)"
],
    soil_water_fit: "Deep, well-drained rich sandy loam with top-tier surface drainage; strictly cannot tolerate wet feet.",
    critical_vulnerable_stage: "Transplanting, Early flowering, and Fruit maturation.",
    preventive_measures: [
      "Release exotic parasitoid Acerophagus papayae for biological control of papaya mealybug",
      "Plant border rows of maize or sorghum to trap aphid vectors before entering orchard",
      "Drench stem collar with Metalaxyl + Mancozeb (2 g/L) to prevent Phytophthora foot rot",
      "Spray Wettable Sulphur (2 g/L) for powdery mildew and spider mites"
]
  },
  'Apple': {
    crop: 'Apple',
    risk_rating: 'Moderate',
    climate_threats: "Insufficient winter chilling (<800 hours below 7\u00b0C) causes delayed foliation; spring frost or hailstorms destroy blossoms.",
    major_pests_diseases: [
      "Apple scab (Venturia inaequalis)",
      "Powdery mildew (Podosphaera leucotricha)",
      "Fire blight (Erwinia amylovora)",
      "Alternaria blotch (Alternaria mali)",
      "Canker (Valsa ceratosperma / Botryosphaeria)",
      "Codling moth (Cydia pomonella)",
      "Woolly apple aphid (Eriosoma lanigerum)",
      "San Jose scale (Quadraspidiotus perniciosus)",
      "Apple aphid (Aphis pomi)",
      "European red mite (Panonychus ulmi)"
],
    soil_water_fit: "Deep, well-drained loamy hillside soils, pH 5.5-6.5.",
    critical_vulnerable_stage: "Silver tip, Pink bud, Blossom petal fall, and Fruit expansion.",
    preventive_measures: [
      "Erect anti-hail net structures over orchards to protect fruit skin",
      "Apply Tree Spray Oil (TSO @ 2%) during dormant stage against San Jose scale and mite eggs",
      "Spray Difenoconazole 25% EC (0.5 ml/L) or Captan (2 g/L) during primary scab ascospore discharge",
      "Conserve parasitoid wasp Aphelinus mali for biological control of woolly apple aphid"
]
  },
  'Grapes': {
    crop: 'Grapes',
    risk_rating: 'High',
    climate_threats: "Unseasonal rains during berry softening cause bunch splitting and Botrytis rot; cold cloudy weather triggers downy mildew.",
    major_pests_diseases: [
      "Downy mildew (Plasmopara viticola)",
      "Powdery mildew (Uncinula necator)",
      "Anthracnose / Bird's eye rot (Elsinoe ampelina)",
      "Bacterial leaf spot (Xanthomonas ampelina)",
      "Botrytis bunch rot (Botrytis cinerea)",
      "Grapevine mealybug (Maconellicoccus hirsutus)",
      "Thrips (Rhipiphorothrips cruentatus / Scirtothrips)",
      "Flea beetle / Udhadya (Scelodonta strigicollis)",
      "Grape leafhopper (Arboridia vinifera)",
      "Fruit fly (Drosophila melanogaster)"
],
    soil_water_fit: "Well-drained sandy loam to gravelly soil with pH 6.5-8.0; strictly avoid high water table.",
    critical_vulnerable_stage: "Bud burst, 5-leaf stage, Pre-bloom, Berry set, and Veraison (berry softening).",
    preventive_measures: [
      "Prophylactic sprays of Bordeaux mixture (1%) or Copper Oxychloride for downy mildew",
      "Foliar spray of Azoxystrobin (1 ml/L) or Tebuconazole (0.7 ml/L) at pea-size berry stage",
      "Release predatory ladybird Cryptolaemus montrouzieri against mealybugs",
      "Canopy management: shoot thinning and leaf defoliation around bunch zone to improve aeration"
]
  },
  'Pomegranate': {
    crop: 'Pomegranate',
    risk_rating: 'Moderate',
    climate_threats: "Excess rain or sudden irrigation fluctuation causes severe fruit cracking; humid warm spells spur bacterial blight.",
    major_pests_diseases: [
      "Bacterial blight / Telya (Xanthomonas axonopodis pv. punicae)",
      "Anthracnose (Colletotrichum gloeosporioides)",
      "Pomegranate wilt (Ceratocystis fimbriata)",
      "Fruit rot (Phomopsis / Cercospora / Alternaria)",
      "Anar butterfly / Fruit borer (Deudorix isocrates)",
      "Pomegranate thrips (Scirtothrips dorsalis)",
      "Pomegranate aphids (Aphis punicae)",
      "Whitefly (Siphoninus phillyreae)",
      "Fruit fly (Bactrocera zonata)"
],
    soil_water_fit: "Light to medium well-drained loams, deep alluvial or sandy loam with pH 6.5-7.5.",
    critical_vulnerable_stage: "Bahar treatment (flowering), Fruit set, and Fruit enlargement.",
    preventive_measures: [
      "Strict sanitation: collect and burn all fallen leaves, blighted twigs, and mummified fruits",
      "Spray Streptocycline (0.5 g/L) + Copper Oxychloride (2.5 g/L) + sticker against Telya bacterial blight",
      "Bag young fruits with non-woven polypropylene bags to prevent Anar butterfly oviposition",
      "Drench soil with Carbendazim (2 g/L) or Propiconazole (1.5 ml/L) to arrest Ceratocystis wilt foci"
]
  },
  'Watermelon': {
    crop: 'Watermelon',
    risk_rating: 'Moderate',
    climate_threats: "Cold temperature (<18\u00b0C) retards seed germination and vine growth; excessive soil moisture at maturity dilutes fruit sugar content.",
    major_pests_diseases: [
      "Downy mildew (Pseudoperonospora cubensis)",
      "Powdery mildew (Podosphaera xanthii)",
      "Anthracnose (Colletotrichum orbiculare)",
      "Fusarium wilt (Fusarium oxysporum f. sp. niveum)",
      "Gummy stem blight (Didymella bryoniae)",
      "Melon aphid (Aphis gossypii)",
      "Melon fruit fly (Bactrocera cucurbitae)",
      "Red pumpkin beetle (Aulacophora foveicollis)",
      "Whitefly (Bemisia tabaci)",
      "Thrips (Thrips palmi)"
],
    soil_water_fit: "Sandy loam or riverbed silty soils with rich organic matter, pH 6.0-7.0; excellent internal drainage.",
    critical_vulnerable_stage: "Vine elongation, Flowering, Fruit setting, and Fruit sweetening.",
    preventive_measures: [
      "Install cue-lure pheromone traps (6/acre) to control destructive melon fruit flies",
      "Spray Cymoxanil + Mancozeb (2 g/L) at first sign of downy mildew angular foliar lesions",
      "Seed treatment with Carbendazim (2 g/kg) and follow drip fertigation on raised mulch beds",
      "Dust wood ash mixed with fine sand on cotyledon leaves to repel red pumpkin beetles"
]
  },
  'Muskmelon': {
    crop: 'Muskmelon',
    risk_rating: 'Moderate',
    climate_threats: "High relative humidity combined with high heat causes explosive powdery/downy mildew; rain at harvest causes fruit cracking.",
    major_pests_diseases: [
      "Powdery mildew (Podosphaera xanthii)",
      "Downy mildew (Pseudoperonospora cubensis)",
      "Fusarium wilt (Fusarium oxysporum f. sp. melonis)",
      "Anthracnose (Colletotrichum orbiculare)",
      "Gummy stem blight (Didymella bryoniae)",
      "Melon fruit fly (Bactrocera cucurbitae)",
      "Aphid (Aphis gossypii)",
      "Whitefly (Bemisia tabaci)",
      "Red pumpkin beetle (Aulacophora foveicollis)",
      "Spider mites (Tetranychus urticae)"
],
    soil_water_fit: "Sandy loam, loose well-aerated fertile soils with good drainage; pH 6.0-7.2.",
    critical_vulnerable_stage: "Early vegetative growth, Flowering, and Fruit ripening.",
    preventive_measures: [
      "Grow cultivars on silver-black plastic mulch to suppress weeds, retain moisture, and repel thrips/aphids",
      "Foliar spray of Dinocap 48% EC (1 ml/L) or Wettable Sulphur (2 g/L) for powdery mildew",
      "Install methyl eugenol/cue-lure traps for fruit fly control",
      "Cease heavy irrigation 7-10 days prior to harvest to maximize sweetness and TSS"
]
  },
  'Orange': {
    crop: 'Orange',
    risk_rating: 'Moderate',
    climate_threats: "Waterlogging triggers Phytophthora root rot; extreme temperature spikes during fruit set cause massive fruit drop.",
    major_pests_diseases: [
      "Citrus canker (Xanthomonas citri pv. citri)",
      "Citrus greening / HLB (Candidatus Liberibacter asiaticus)",
      "Citrus tristeza virus (CTV)",
      "Citrus gummosis / Phytophthora foot rot (Phytophthora nicotianae)",
      "Citrus anthracnose (Colletotrichum gloeosporioides)",
      "Citrus psylla (Diaphorina citri - HLB vector)",
      "Citrus leaf miner (Phyllocnistis citrella)",
      "Citrus aphid (Toxoptera citricida - CTV vector)",
      "Citrus blackfly / Whitefly (Aleurocanthus woglumi)",
      "Citrus scale insects (Aonidiella aurantii)",
      "Citrus mealybug (Planococcus citri)"
],
    soil_water_fit: "Deep, well-drained loamy to sandy loam soils with pH 5.5-7.5; strictly avoid alkaline soils with impermeable hardpan.",
    critical_vulnerable_stage: "Ambe bahar (flowering), Fruit set (marble size), and Fruit color turn.",
    preventive_measures: [
      "Foliar spray of Imidacloprid (0.5 ml/L) or Thiamethoxam (0.3 g/L) at new flush to control psylla and leaf miner",
      "Spray Streptocycline (1 g/10 L) + Copper Oxychloride (2.5 g/L) after pruning against canker",
      "Paint tree trunk collar up to 45 cm with Bordeaux paste (1:1:10) to prevent gummosis",
      "Use certified disease-free budwood grafted on Phytophthora-tolerant rootstocks (Rangpur lime / Rough lemon)"
]
  },
  'Coconut': {
    crop: 'Coconut',
    risk_rating: 'Low',
    climate_threats: "Severe moisture stress reduces female flower production and button size; cyclone winds damage crown canopy.",
    major_pests_diseases: [
      "Bud rot (Phytophthora palmivora)",
      "Basal stem rot / Tanjore wilt (Ganoderma lucidum)",
      "Leaf blight / Grey blight (Pestalotiopsis palmarum)",
      "Stem bleeding (Thielaviopsis paradoxa)",
      "Root (wilt) disease (Phytoplasma)",
      "Rhinoceros beetle (Oryctes rhinoceros)",
      "Red palm weevil (Rhynchophorus ferrugineus)",
      "Coconut eriophyid mite (Aceria guerreronis)",
      "Coconut black-headed caterpillar (Opisina arenosella)",
      "Slug caterpillar (Contheyla rotunda)"
],
    soil_water_fit: "Coastal sandy, red sandy loam, and alluvial soils with pH 5.2-8.0; requires 1500-2500mm rainfall or drip irrigation.",
    critical_vulnerable_stage: "Inflorescence emergence, Button setting, and Nut development.",
    preventive_measures: [
      "Hook out Rhinoceros beetles from crown with beetle hooks and place naphthalene balls (3-4 balls) in leaf axils",
      "Place pheromone traps (Ferrolure+) @ 1 trap/2 hectares for Red Palm Weevil detection and mass trapping",
      "Spray 1% Bordeaux mixture on spindle leaf and crown before southwest monsoon to prevent bud rot",
      "Root feeding with Hexaconazole (2 ml + 100 ml water) for Ganoderma basal stem rot control"
]
  },
  'Jute': {
    crop: 'Jute',
    risk_rating: 'Moderate',
    climate_threats: "Severe drought in pre-monsoon stage causes stunted fibre growth; premature flood submergence damages bark quality.",
    major_pests_diseases: [
      "Stem rot (Macrophomina phaseolina)",
      "Root rot (Rhizoctonia bataticola)",
      "Anthracnose (Colletotrichum corchori)",
      "Leaf spot (Cercospora corchori)",
      "Black band disease (Diplodia corchori)",
      "Jute hairy caterpillar (Spilosoma obliqua)",
      "Jute semilooper (Anomis sabulifera)",
      "Jute stem weevil / Apion (Apion corchori)",
      "Jute mealybug (Phenacoccus hirsutus)"
],
    soil_water_fit: "Rich alluvial, sandy loam to clayey soils of river delta plains; pH 6.0-7.5.",
    critical_vulnerable_stage: "Seedling emergence, Active vegetative fiber development (35-70 DAS), and Harvesting.",
    preventive_measures: [
      "Seed treatment with Carbendazim (2 g/kg) to suppress seed-borne Macrophomina stem rot",
      "Spray Chlorpyrifos 20% EC (2 ml/L) or Quinalphos 25% EC (2 ml/L) for semilooper and hairy caterpillar control",
      "Provide light drainage channels across plots to discharge stagnant rain pools",
      "Harvest at small pod stage (120 DAS) for highest quality golden fiber recovery"
]
  },
  'Coffee': {
    crop: 'Coffee',
    risk_rating: 'Moderate',
    climate_threats: "Failure of blossom showers in March/April causes blossom abortion; continuous monsoonal overcast fosters black rot.",
    major_pests_diseases: [
      "Coffee leaf rust (Hemileia vastatrix)",
      "Cercospora leaf spot / Berry blotch (Cercospora coffeicola)",
      "Black rot / Koleroga (Pellicularia koleroga)",
      "Root diseases (Fusarium / Rosellinia / Fomes)",
      "Coffee berry borer (Hypothenemus hampei)",
      "White stem borer (Xylotrechus quadripes)",
      "Coffee green scale (Coccus viridis)",
      "Coffee mealybug (Planococcus lilacinus)"
],
    soil_water_fit: "Deep, well-drained porous rich virgin forest loam, pH 6.0-6.5; requires dense two-tier shade trees.",
    critical_vulnerable_stage: "Blossom shower & backing shower, Berry pinhead stage, and Berry expansion.",
    preventive_measures: [
      "Foliar spray of 0.5% Bordeaux mixture pre-monsoon and post-monsoon against coffee leaf rust",
      "Install broca pheromone traps (Hypothenemus traps @ 20/ha) and carry out timely gleaning to remove left-over berries",
      "Swab main stems with Chlorpyrifos 20% EC (2.5 ml/L) or bark tracing for White Stem Borer management",
      "Maintain optimal two-tier canopy shade regulation prior to monsoon arrival"
]
  },
  'Chilli': {
    crop: 'Chilli',
    risk_rating: 'High',
    climate_threats: "Extended damp cloudy weather causes severe fruit rot and blossom drop; dry warm winds accelerate thrips and mite multiplication.",
    major_pests_diseases: [
      "Anthracnose / Fruit rot / Dieback (Colletotrichum capsici)",
      "Bacterial leaf spot (Xanthomonas campestris pv. vesicatoria)",
      "Chilli powdery mildew (Leveillula taurica)",
      "Damping-off (Pythium debaryanum)",
      "Chilli leaf curl virus (ChiLCV)",
      "Chilli thrips / Murda disease (Scirtothrips dorsalis)",
      "Chilli yellow mite (Polyphagotarsonemus latus)",
      "Aphids (Aphis gossypii)",
      "Whitefly (Bemisia tabaci - ChiLCV vector)",
      "Fruit borer (Helicoverpa armigera / Spodoptera litura)"
],
    soil_water_fit: "Well-drained sandy loam, black cotton, or red loamy soils with pH 6.5-7.5.",
    critical_vulnerable_stage: "Nursery stage, Transplanting, Peak Flowering, and Fruit ripening.",
    preventive_measures: [
      "Install blue sticky traps (15/acre) for thrips and yellow traps for whiteflies",
      "Spray Fipronil 5% SC (1.5 ml/L) or Spinetoram 11.7% SC (0.8 ml/L) for severe thrips infestation",
      "Spray Fenazaquin 10% EC (2 ml/L) or Spiromesifen 22.9% SC (1 ml/L) against yellow mites",
      "Spray Azoxystrobin + Difenoconazole (1 ml/L) or Mancozeb (2.5 g/L) for fruit rot and dieback"
]
  },
  'Turmeric': {
    crop: 'Turmeric',
    risk_rating: 'Moderate',
    climate_threats: "Waterlogging in beds during monsoon causes destructive rhizome rot; drought during rhizome bulking reduces curcumin yield.",
    major_pests_diseases: [
      "Rhizome rot / Soft rot (Pythium aphanidermatum)",
      "Leaf blotch (Taphrina maculans)",
      "Leaf spot (Colletotrichum capsici)",
      "Bacterial soft rot (Ralstonia solanacearum)",
      "Turmeric shoot borer (Conogethes punctiferalis)",
      "Rhizome scale (Aspidiella hartii)",
      "Lacewing bug (Stephanitis typicus)",
      "Turmeric leaf roller (Udaspes folus)"
],
    soil_water_fit: "Well-drained loose, friable, rich red loamy or alluvial soil, pH 5.5-7.5; requires raised bed planting.",
    critical_vulnerable_stage: "Sprouting, Tillering, and Rhizome development/bulking.",
    preventive_measures: [
      "Seed rhizome treatment before planting: Metalaxyl + Mancozeb (2 g/L) dip for 30 minutes",
      "Drench affected rhizome clumps with Copper Oxychloride (3 g/L) or Metalaxyl (2 g/L) at first symptom of yellowing",
      "Spray Chlorantraniliprole 18.5% SC (0.3 ml/L) or Dimethoate (1.5 ml/L) when shoot borer bore holes appear",
      "Apply thick green leaf mulch (12-15 tonnes/ha) immediately after planting to retain moisture and suppress weeds"
]
  },
  'Sunflower': {
    crop: 'Sunflower',
    risk_rating: 'Low',
    climate_threats: "Continuous rain during head flowering prevents pollinator bee activity and induces head rot; terminal drought reduces seed oil content.",
    major_pests_diseases: [
      "Alternaria blight (Alternaria helianthi)",
      "Downy mildew (Plasmopara halstedii)",
      "Sunflower rust (Puccinia helianthi)",
      "Charcoal rot (Macrophomina phaseolina)",
      "Sunflower necrosis disease (Tobacco streak virus - TSV)",
      "Head / Capitulum borer (Helicoverpa armigera)",
      "Sunflower moth (Homoeosoma electellum)",
      "Sunflower aphid (Aphis gossypii)",
      "Sunflower thrips (Thrips palmi - TSV vector)",
      "Bihar hairy caterpillar (Spilarctia obliqua)"
],
    soil_water_fit: "Versatile; thrives in fertile loam, sandy loam, and medium to heavy black soils with pH 6.5-8.0.",
    critical_vulnerable_stage: "Button stage, Head flowering, and Seed filling.",
    preventive_measures: [
      "Spray Mancozeb 75% WP (2 g/L) or Propiconazole 25% EC (1 ml/L) for Alternaria leaf and head blight",
      "Spray Imidacloprid (0.3 ml/L) at vegetative stage to suppress thrips vectors transmitting necrosis disease",
      "Spray HaNPV (250 LE/acre) or Chlorantraniliprole (0.3 ml/L) at ray floret opening for head borer control",
      "Place beehives (2-3 hives/acre) to dramatically improve cross-pollination and seed set"
]
  },
  'Sorghum': {
    crop: 'Sorghum',
    risk_rating: 'Low',
    climate_threats: "Wet cloudy weather during grain ripening causes disastrous grain mold; dry spell in first 30 days promotes shoot fly attack.",
    major_pests_diseases: [
      "Anthracnose (Colletotrichum graminicola)",
      "Grain mold complex (Fusarium / Curvularia)",
      "Downy mildew (Peronosclerospora sorghi)",
      "Ergot / Sugary disease (Claviceps sorghi)",
      "Sorghum rust (Puccinia purpurea)",
      "Sorghum shoot fly (Atherigona soccata)",
      "Sorghum stem borer (Chilo partellus)",
      "Sorghum midge (Stenodiplosis sorghicola)",
      "Armyworm (Mythimna separata)",
      "Corn leaf aphid / Sugarcane aphid (Melanaphis sacchari)"
],
    soil_water_fit: "Clay loams to heavy black cotton soils; remarkably drought-hardy with deep fibrous root system.",
    critical_vulnerable_stage: "Seedling emergence (shoot fly), Booting, and Grain dough stage.",
    preventive_measures: [
      "Seed treatment with Imidacloprid 70% WS (5 g/kg seed) to guarantee shoot fly protection up to 30 DAS",
      "Early synchronized sowing with monsoon onset to escape shoot fly and midge peak periods",
      "Spray Mancozeb 75% WP (2 g/L) at boot leaf stage against grain mold and anthracnose",
      "Spray Chlorpyrifos 20% EC (2 ml/L) at earhead emergence if midge flies are observed"
]
  },
  'Pearl Millet': {
    crop: 'Pearl Millet',
    risk_rating: 'Low',
    climate_threats: "Extremely heat- and drought-hardy; cloudy rain during protogyny induces ergot sugary drip.",
    major_pests_diseases: [
      "Downy mildew / Green ear (Sclerospora graminicola)",
      "Bajra blast (Pyricularia grisea)",
      "Bajra smut (Moesziomyces penicillariae)",
      "Bajra ergot (Claviceps fusiformis)",
      "Bajra shoot fly (Atherigona soccata)",
      "Millet stem borer (Chilo partellus)",
      "Earhead worm / Borer (Helicoverpa armigera)",
      "Grasshopper (Hieroglyphus nigrorepletus)",
      "Corn leaf aphid (Rhopalosiphum maidis)"
],
    soil_water_fit: "Sandy loam to light arid soils; thrives even under poor soil fertility and low moisture (250-450mm).",
    critical_vulnerable_stage: "Tillering, Boot leaf, Earhead flowering, and Grain dough stage.",
    preventive_measures: [
      "Seed treatment with Metalaxyl 35% WS (Apron @ 6 g/kg seed) against downy mildew",
      "Rogue out and bury downy mildew 'green ear' malformed tillers to stop secondary oospore build-up",
      "Soak seeds in 10% brine solution; skim off floating sclerotia of ergot before sowing",
      "Dust Malathion 5% dust @ 10 kg/acre at early earhead stage against earhead worms and grasshoppers"
]
  },
  'Barley': {
    crop: 'Barley',
    risk_rating: 'Low',
    climate_threats: "Tolerates high salinity and drought better than wheat; late winter warm spells cause rapid powdery mildew and rust pustule spread.",
    major_pests_diseases: [
      "Stripe rust / Yellow rust (Puccinia striiformis f. sp. hordei)",
      "Leaf rust / Brown rust (Puccinia hordei)",
      "Powdery mildew (Blumeria graminis f. sp. hordei)",
      "Spot blotch (Bipolaris sorokiniana)",
      "Net blotch (Pyrenophora teres)",
      "Barley foliar aphids (Rhopalosiphum padi / Sitobion avenae)",
      "Armyworm (Mythimna separata)",
      "Termites (Odontotermes obesus)",
      "Shoot fly (Atherigona naqvii)"
],
    soil_water_fit: "Well-drained light to medium loamy soils; tolerant of marginal, saline, and alkaline soils with pH up to 8.5.",
    critical_vulnerable_stage: "Tillering, Flag leaf emergence, Heading, and Grain milk stage.",
    preventive_measures: [
      "Seed treatment before sowing with Carboxin + Thiram (2.5 g/kg seed) for blotch and smuts",
      "Spray Propiconazole 25% EC (1 ml/L) at first detection of stripe rust or powdery mildew patches",
      "Apply Chlorpyrifos 20% EC (1.5 L/acre) with irrigation water for termite protection",
      "Conserve ladybird beetles and spray Dimethoate (1.5 ml/L) if aphid colony exceeds ETL"
]
  },
  'Finger Millet': {
    crop: 'Finger Millet',
    risk_rating: 'Low',
    climate_threats: "High resilience to dry spells; continuous torrential rains during flowering lead to severe neck and finger blast.",
    major_pests_diseases: [
      "Finger millet blast - Leaf, Neck, and Finger blast (Magnaporthe grisea)",
      "Brown leaf spot (Bipolaris nodulosa)",
      "Foot rot / Sclerotial wilt (Sclerotium rolfsii)",
      "Finger millet smut (Melanopsichium eleusinis)",
      "Ragi shoot fly (Atherigona milliaceae)",
      "Finger millet aphid (Rhopalosiphum maidis)",
      "Finger millet midge (Contarinia sorghicola)",
      "Ragi stem borer / Pink borer (Sesamia inferens)"
],
    soil_water_fit: "Adapted to red, light black, and lateritic gravelly soils with good drainage; pH 5.0-8.2.",
    critical_vulnerable_stage: "Tillering, Earhead emergence, and Grain development.",
    preventive_measures: [
      "Seed treatment with Pseudomonas fluorescens (10 g/kg seed) or Carbendazim (2 g/kg)",
      "Spray Tricyclazole 75% WP (0.6 g/L) or Kitazin 48% EC (1 ml/L) at 50% earhead emergence for neck and finger blast control",
      "Grow blast-tolerant varieties like GPU 28, GPU 45, ML 365, or Indaf 9",
      "Apply Carbofuran 3G or Fipronil 0.3G in nursery to curb shoot fly and pink borer damage"
]
  },
  'Pigeonpea': {
    crop: 'Pigeonpea',
    risk_rating: 'Moderate',
    climate_threats: "Waterlogging during early vegetative phase causes Phytophthora stem rot; excessive cloudy humid spells induce flower drop.",
    major_pests_diseases: [
      "Fusarium wilt (Fusarium udum)",
      "Sterility mosaic disease (SMD / Pigeonpea sterility mosaic virus)",
      "Phytophthora blight (Phytophthora cajani)",
      "Alternaria blight (Alternaria alternata)",
      "Gram pod borer (Helicoverpa armigera)",
      "Pod fly (Melanagromyza obtusa)",
      "Pod bug (Clavigralla gibbosa)",
      "Plume moth (Exelastis atomosa)",
      "Blister beetle (Mylabris phalerata)"
],
    soil_water_fit: "Deep well-drained loamy and medium black soils with pH 6.5-7.8.",
    critical_vulnerable_stage: "Branching, Flower bud initiation, and Pod development.",
    preventive_measures: [
      "Grow wilt- and sterility mosaic-resistant varieties like Asha (ICPL 87119) or Maruti (ICP 8863)",
      "Spray Fenazaquin or Propargite against eriophyid mite vector of sterility mosaic",
      "Spray Monocrotophos / Chlorantraniliprole at 50% flowering for pod borer and pod fly protection",
      "Plant on ridges with intercrops like sorghum or pearl millet"
]
  },
  'Kidney Beans': {
    crop: 'Kidney Beans',
    risk_rating: 'Moderate',
    climate_threats: "Highly sensitive to frost and prolonged waterlogging; extreme summer heat (>30\u00b0C) triggers flower abortion.",
    major_pests_diseases: [
      "Anthracnose (Colletotrichum lindemuthianum)",
      "Common bacterial blight (Xanthomonas axonopodis pv. phaseoli)",
      "Angular leaf spot (Phaeoisariopsis griseola)",
      "Rust (Uromyces appendiculatus)",
      "Bean aphid (Aphis fabae)",
      "Bean fly / Stem miner (Ophiomyia phaseoli)",
      "Thrips (Thrips tabaci)",
      "Pod borer (Helicoverpa armigera)"
],
    soil_water_fit: "Light, well-aerated fertile loamy soil rich in organic matter; pH 5.5-6.5.",
    critical_vulnerable_stage: "Emergence, Pre-flowering, Pod setting, and Grain filling.",
    preventive_measures: [
      "Use certified disease-free western/hill seeds; avoid overhead sprinkler watering",
      "Spray Copper Oxychloride 50 WP (2.5 g/L) + Streptocycline (0.1 g/L) for bacterial blight",
      "Apply Mancozeb 75 WP (2 g/L) or Carbendazim (1 g/L) at first spot appearance",
      "Spray Imidacloprid (0.4 ml/L) to prevent bean fly stem mining in early weeks"
]
  },
  'Moth Beans': {
    crop: 'Moth Beans',
    risk_rating: 'Low',
    climate_threats: "Exceptionally drought-tolerant but susceptible to fungal collar rot during rare waterlogging.",
    major_pests_diseases: [
      "Yellow mosaic disease (Mungbean yellow mosaic virus)",
      "Powdery mildew (Erysiphe polygoni)",
      "Root rot / Macrophomina wilt (Macrophomina phaseolina)",
      "Bacterial leaf spot (Xanthomonas phaseoli)",
      "Mungbean / Legume aphid (Aphis craccivora)",
      "Whitefly (Bemisia tabaci)",
      "Pod borer (Cydia ptychora)",
      "Thrips (Caliothrips indicus)"
],
    soil_water_fit: "Adapted to arid, sandy desert soils; requires minimum rainfall (200-400mm).",
    critical_vulnerable_stage: "Seedling emergence, Flowering, and Pod filling.",
    preventive_measures: [
      "Treat seed with Carbendazim (2 g/kg) + Thiamethoxam (3 g/kg)",
      "Spray Wettable Sulphur (2.5 g/L) or Dinocap (1 ml/L) for powdery mildew control",
      "Install yellow sticky boards (10/acre) to suppress virus-carrying whiteflies",
      "Maintain wide spacing to allow air circulation in dryland canopies"
]
  },
  'Pearl millet': {
    crop: 'Pearl millet',
    risk_rating: 'Low',
    climate_threats: "Extremely heat- and drought-hardy; cloudy rain during protogyny induces ergot sugary drip.",
    major_pests_diseases: [
      "Downy mildew / Green ear (Sclerospora graminicola)",
      "Bajra blast (Pyricularia grisea)",
      "Bajra smut (Moesziomyces penicillariae)",
      "Bajra ergot (Claviceps fusiformis)",
      "Bajra shoot fly (Atherigona soccata)",
      "Millet stem borer (Chilo partellus)",
      "Earhead worm / Borer (Helicoverpa armigera)",
      "Grasshopper (Hieroglyphus nigrorepletus)",
      "Corn leaf aphid (Rhopalosiphum maidis)"
],
    soil_water_fit: "Sandy loam to light arid soils; thrives even under poor soil fertility and low moisture (250-450mm).",
    critical_vulnerable_stage: "Tillering, Boot leaf, Earhead flowering, and Grain dough stage.",
    preventive_measures: [
      "Seed treatment with Metalaxyl 35% WS (Apron @ 6 g/kg seed) against downy mildew",
      "Rogue out and bury downy mildew 'green ear' malformed tillers to stop secondary oospore build-up",
      "Soak seeds in 10% brine solution; skim off floating sclerotia of ergot before sowing",
      "Dust Malathion 5% dust @ 10 kg/acre at early earhead stage against earhead worms and grasshoppers"
]
  },
  'Bajra': {
    crop: 'Bajra',
    risk_rating: 'Low',
    climate_threats: "Extremely heat- and drought-hardy; cloudy rain during protogyny induces ergot sugary drip.",
    major_pests_diseases: [
      "Downy mildew / Green ear (Sclerospora graminicola)",
      "Bajra blast (Pyricularia grisea)",
      "Bajra smut (Moesziomyces penicillariae)",
      "Bajra ergot (Claviceps fusiformis)",
      "Bajra shoot fly (Atherigona soccata)",
      "Millet stem borer (Chilo partellus)",
      "Earhead worm / Borer (Helicoverpa armigera)",
      "Grasshopper (Hieroglyphus nigrorepletus)",
      "Corn leaf aphid (Rhopalosiphum maidis)"
],
    soil_water_fit: "Sandy loam to light arid soils; thrives even under poor soil fertility and low moisture (250-450mm).",
    critical_vulnerable_stage: "Tillering, Boot leaf, Earhead flowering, and Grain dough stage.",
    preventive_measures: [
      "Seed treatment with Metalaxyl 35% WS (Apron @ 6 g/kg seed) against downy mildew",
      "Rogue out and bury downy mildew 'green ear' malformed tillers to stop secondary oospore build-up",
      "Soak seeds in 10% brine solution; skim off floating sclerotia of ergot before sowing",
      "Dust Malathion 5% dust @ 10 kg/acre at early earhead stage against earhead worms and grasshoppers"
]
  },
  'Finger millet': {
    crop: 'Finger millet',
    risk_rating: 'Low',
    climate_threats: "High resilience to dry spells; continuous torrential rains during flowering lead to severe neck and finger blast.",
    major_pests_diseases: [
      "Finger millet blast - Leaf, Neck, and Finger blast (Magnaporthe grisea)",
      "Brown leaf spot (Bipolaris nodulosa)",
      "Foot rot / Sclerotial wilt (Sclerotium rolfsii)",
      "Finger millet smut (Melanopsichium eleusinis)",
      "Ragi shoot fly (Atherigona milliaceae)",
      "Finger millet aphid (Rhopalosiphum maidis)",
      "Finger millet midge (Contarinia sorghicola)",
      "Ragi stem borer / Pink borer (Sesamia inferens)"
],
    soil_water_fit: "Adapted to red, light black, and lateritic gravelly soils with good drainage; pH 5.0-8.2.",
    critical_vulnerable_stage: "Tillering, Earhead emergence, and Grain development.",
    preventive_measures: [
      "Seed treatment with Pseudomonas fluorescens (10 g/kg seed) or Carbendazim (2 g/kg)",
      "Spray Tricyclazole 75% WP (0.6 g/L) or Kitazin 48% EC (1 ml/L) at 50% earhead emergence for neck and finger blast control",
      "Grow blast-tolerant varieties like GPU 28, GPU 45, ML 365, or Indaf 9",
      "Apply Carbofuran 3G or Fipronil 0.3G in nursery to curb shoot fly and pink borer damage"
]
  },
  'Ragi': {
    crop: 'Ragi',
    risk_rating: 'Low',
    climate_threats: "High resilience to dry spells; continuous torrential rains during flowering lead to severe neck and finger blast.",
    major_pests_diseases: [
      "Finger millet blast - Leaf, Neck, and Finger blast (Magnaporthe grisea)",
      "Brown leaf spot (Bipolaris nodulosa)",
      "Foot rot / Sclerotial wilt (Sclerotium rolfsii)",
      "Finger millet smut (Melanopsichium eleusinis)",
      "Ragi shoot fly (Atherigona milliaceae)",
      "Finger millet aphid (Rhopalosiphum maidis)",
      "Finger millet midge (Contarinia sorghicola)",
      "Ragi stem borer / Pink borer (Sesamia inferens)"
],
    soil_water_fit: "Adapted to red, light black, and lateritic gravelly soils with good drainage; pH 5.0-8.2.",
    critical_vulnerable_stage: "Tillering, Earhead emergence, and Grain development.",
    preventive_measures: [
      "Seed treatment with Pseudomonas fluorescens (10 g/kg seed) or Carbendazim (2 g/kg)",
      "Spray Tricyclazole 75% WP (0.6 g/L) or Kitazin 48% EC (1 ml/L) at 50% earhead emergence for neck and finger blast control",
      "Grow blast-tolerant varieties like GPU 28, GPU 45, ML 365, or Indaf 9",
      "Apply Carbofuran 3G or Fipronil 0.3G in nursery to curb shoot fly and pink borer damage"
]
  },
  'Chili': {
    crop: 'Chili',
    risk_rating: 'High',
    climate_threats: "Extended damp cloudy weather causes severe fruit rot and blossom drop; dry warm winds accelerate thrips and mite multiplication.",
    major_pests_diseases: [
      "Anthracnose / Fruit rot / Dieback (Colletotrichum capsici)",
      "Bacterial leaf spot (Xanthomonas campestris pv. vesicatoria)",
      "Chilli powdery mildew (Leveillula taurica)",
      "Damping-off (Pythium debaryanum)",
      "Chilli leaf curl virus (ChiLCV)",
      "Chilli thrips / Murda disease (Scirtothrips dorsalis)",
      "Chilli yellow mite (Polyphagotarsonemus latus)",
      "Aphids (Aphis gossypii)",
      "Whitefly (Bemisia tabaci - ChiLCV vector)",
      "Fruit borer (Helicoverpa armigera / Spodoptera litura)"
],
    soil_water_fit: "Well-drained sandy loam, black cotton, or red loamy soils with pH 6.5-7.5.",
    critical_vulnerable_stage: "Nursery stage, Transplanting, Peak Flowering, and Fruit ripening.",
    preventive_measures: [
      "Install blue sticky traps (15/acre) for thrips and yellow traps for whiteflies",
      "Spray Fipronil 5% SC (1.5 ml/L) or Spinetoram 11.7% SC (0.8 ml/L) for severe thrips infestation",
      "Spray Fenazaquin 10% EC (2 ml/L) or Spiromesifen 22.9% SC (1 ml/L) against yellow mites",
      "Spray Azoxystrobin + Difenoconazole (1 ml/L) or Mancozeb (2.5 g/L) for fruit rot and dieback"
]
  },
};

export function getCropRiskProfile(cropName: string): CropRiskProfile {
  const clean = (cropName || '').trim();
  if (CROP_RISK_PROFILES[clean]) {
    return CROP_RISK_PROFILES[clean];
  }
  const cleanLower = clean.toLowerCase();
  for (const [key, val] of Object.entries(CROP_RISK_PROFILES)) {
    if (key.toLowerCase() === cleanLower || key.toLowerCase().replace(/[\s_-]/g, '') === cleanLower.replace(/[\s_-]/g, '')) {
      return val;
    }
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
  Chilli: { crop: 'Chilli', defaultYieldKgPerHa: 2200, defaultPricePerQuintal: 18000, defaultCostPerHa: 55000, durationDays: 150, marketSeason: 'Jan - May' },
  Turmeric: { crop: 'Turmeric', defaultYieldKgPerHa: 6000, defaultPricePerQuintal: 8200, defaultCostPerHa: 68000, durationDays: 240, marketSeason: 'Feb - May' },
  Sunflower: { crop: 'Sunflower', defaultYieldKgPerHa: 1800, defaultPricePerQuintal: 6400, defaultCostPerHa: 21000, durationDays: 95, marketSeason: 'Oct - Dec' },
  Sorghum: { crop: 'Sorghum', defaultYieldKgPerHa: 2400, defaultPricePerQuintal: 3180, defaultCostPerHa: 20000, durationDays: 105, marketSeason: 'Oct - Dec' },
  'Pearl Millet': { crop: 'Pearl Millet', defaultYieldKgPerHa: 2200, defaultPricePerQuintal: 2500, defaultCostPerHa: 18000, durationDays: 85, marketSeason: 'Sep - Nov' },
  Barley: { crop: 'Barley', defaultYieldKgPerHa: 3200, defaultPricePerQuintal: 1850, defaultCostPerHa: 22000, durationDays: 115, marketSeason: 'Mar - May' },
  'Finger Millet': { crop: 'Finger Millet', defaultYieldKgPerHa: 2000, defaultPricePerQuintal: 3846, defaultCostPerHa: 19000, durationDays: 110, marketSeason: 'Nov - Jan' },
  Kidneybeans: { crop: 'Kidneybeans', defaultYieldKgPerHa: 1200, defaultPricePerQuintal: 9500, defaultCostPerHa: 26000, durationDays: 90, marketSeason: 'Oct - Dec' },
  Mothbeans: { crop: 'Mothbeans', defaultYieldKgPerHa: 600, defaultPricePerQuintal: 7200, defaultCostPerHa: 14000, durationDays: 75, marketSeason: 'Oct - Nov' },
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
