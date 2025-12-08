export interface Disease {
    id: string;
    name: string;
    scientificName: string;
    type: 'Fungal' | 'Viral' | 'Bacterial' | 'Healthy' | 'Other' | 'Infestation' | 'Ripeness' | 'Soil';
    severity: 'High' | 'Moderate' | 'Low';
    description: string;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    prevention: string[];
    earlyDetection: string;
    image: any; // Placeholder for now
    crop: 'rice' | 'mango' | 'soil' | 'corn';
}

export const diseases: Disease[] = [
    // --- RICE DISEASES ---
    {
        id: '1',
        name: 'Rice-Blast',
        scientificName: 'Magnaporthe oryzae',
        type: 'Fungal',
        severity: 'High',
        description: 'Rice blast is one of the most destructive diseases of rice. It can affect all above-ground parts of the rice plant.',
        symptoms: [
            'Characteristic spindle-shaped lesions on leaves with gray-white centers and dark, reddish-brown borders.',
            'Lesions can enlarge and merge, potentially killing the entire leaf.',
            'Black or brown lesions on the nodes and neck of the panicle, causing stem breakage.',
            'Infection before grain filling can result in empty grains.'
        ],
        causes: [
            'Blast can occur wherever blast spores are present.',
            'Occurs in areas with low soil moisture, frequent and prolonged periods of rain shower, and cool temperature in the daytime.',
            'High nitrogen fertilization.',
            'Aerobic soil conditions.'
        ],
        treatment: [
            'Apply Tricyclazole fungicide.',
            'Use systemic fungicides early.',
            'Remove infected plant parts.',
            'Improve air circulation.',
            'Apply fungicides at key growth stages.'
        ],
        prevention: [
            'Plant resistant varieties.',
            'Use balanced fertilization (avoid excessive Nitrogen).',
            'Maintain proper spacing between plants.',
            'Avoid overhead irrigation.',
            'Remove infected plant debris.',
            'Practice crop rotation.'
        ],
        earlyDetection: 'Rice blast can spread rapidly under favorable conditions. Early detection and immediate fungicide application are essential to prevent severe yield loss.',
        image: null,
        crop: 'rice'
    },
    {
        id: '2',
        name: 'Bacterial-leaf-Blight',
        scientificName: 'Xanthomonas oryzae pv. oryzae',
        type: 'Bacterial',
        severity: 'High',
        description: 'Bacterial leaf blight is a vascular disease that results in systemic infection.',
        symptoms: [
            'Water-soaked lesions on leaf edges that turn yellow and dry up.',
            'Lesions start at the leaf tip and enlarge in length and width.',
            'Bacterial ooze (milky or opaque dew drops) on young lesions early in the morning.',
            'Leaves turn yellow to white and wilt (Kresek phase) in seedlings.'
        ],
        causes: [
            'High temperature (25-34°C) and high humidity.',
            'Heavy rainfall and strong winds.',
            'Excessive nitrogen application.',
            'Close planting density.'
        ],
        treatment: [
            'Drain the field to reduce humidity.',
            'Apply copper-based bactericides.',
            'Use antibiotics like Streptocycline.',
            'Avoid nitrogen application during outbreaks.'
        ],
        prevention: [
            'Use resistant varieties.',
            'Practice clean cultivation.',
            'Use balanced fertilization.',
            'Control weeds that host the bacteria.',
            'Plow under rice stubble and straw.'
        ],
        earlyDetection: 'Look for bacterial ooze on leaf lesions in the early morning. The "Kresek" or wilting symptom is the most destructive phase.',
        image: null,
        crop: 'rice'
    },
    {
        id: '3',
        name: 'Brown spot',
        scientificName: 'Bipolaris oryzae',
        type: 'Fungal',
        severity: 'Moderate',
        description: 'Brown spot is a fungal disease that infects the coleoptile, leaves, leaf sheath, panicle branches, glumes, and spikelets.',
        symptoms: [
            'Oval-shaped brown spots with a yellow halo on leaves.',
            'Spots are sesame-like in shape and size.',
            'Infected grains become discolored and shriveled.',
            'Seedling blight can occur in severe cases.'
        ],
        causes: [
            'Poor soil fertility (deficiency in Potassium, Manganese, Magnesium, Silicon, Iron, or Calcium).',
            'Water stress (drought).',
            'Continuous cropping of rice.'
        ],
        treatment: [
            'Apply fungicides like Iprodione, Propiconazole, or Azoxystrobin.',
            'Correct soil nutrient deficiencies.',
            'Seed treatment with fungicides.'
        ],
        prevention: [
            'Improve soil fertility through balanced fertilization.',
            'Use resistant varieties.',
            'Practice good water management.',
            'Use certified disease-free seeds.',
            'Burn or plow under infected crop residues.'
        ],
        earlyDetection: 'Monitor fields with poor soil fertility. Spots appear first on older leaves.',
        image: null,
        crop: 'rice'
    },
    {
        id: '4',
        name: 'Sheath blight',
        scientificName: 'Rhizoctonia solani',
        type: 'Fungal',
        severity: 'Moderate',
        description: 'Sheath blight is a fungal disease that causes lesions on the leaf sheaths.',
        symptoms: [
            'Oval-shaped or irregular greenish-gray lesions on leaf sheaths near the water line.',
            'Lesions enlarge and coalesce, causing the death of the upper leaves.',
            'Sclerotia (hard, brown fungal structures) may be seen on lesions.',
            'Lodging of plants due to weakened stems.'
        ],
        causes: [
            'High temperature and high humidity.',
            'High nitrogen application.',
            'Dense planting.',
            'Presence of sclerotia in the soil or floating in water.'
        ],
        treatment: [
            'Apply fungicides like Azoxystrobin or Validamycin.',
            'Drain the field to reduce humidity.',
            'Remove weeds.'
        ],
        prevention: [
            'Avoid excessive nitrogen application.',
            'Use optimal plant spacing.',
            'Practice crop rotation.',
            'Remove weeds and infected debris.',
            'Drain fields mid-season.'
        ],
        earlyDetection: 'Inspect plants near the water line for initial lesions, especially in dense canopies with high nitrogen.',
        image: null,
        crop: 'rice'
    },
    {
        id: '5',
        name: 'Healthy rice',
        scientificName: 'Oryza sativa',
        type: 'Healthy',
        severity: 'Low',
        description: 'The rice plant appears healthy with no visible signs of disease.',
        symptoms: ['No symptoms detected.', 'Leaves are green and vibrant.'],
        causes: ['Good agricultural practices.', 'Favorable weather conditions.'],
        treatment: ['Continue monitoring.', 'Maintain good water and nutrient management.'],
        prevention: ['Continue current best practices.'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'rice'
    },
    {
        id: '6',
        name: 'No rice',
        scientificName: 'N/A',
        type: 'Other',
        severity: 'Low',
        description: 'No rice plant detected in the image.',
        symptoms: ['N/A'],
        causes: ['Camera not focused on rice plant.', 'Image does not contain rice.'],
        treatment: ['Retake photo focusing on the rice plant.'],
        prevention: ['Ensure rice plant is in frame.'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'rice'
    },

    // --- MANGO RIPENESS ---
    {
        id: 'm1',
        name: 'Unripe',
        scientificName: 'Mangifera indica (Unripe)',
        type: 'Ripeness',
        severity: 'Low',
        description: 'The mango is hard and green. It is not ready for eating as a sweet fruit but can be used for salads or pickling.',
        symptoms: [
            'Green skin color.',
            'Hard texture.',
            'Sour taste.'
        ],
        causes: ['Fruit has not yet reached maturity.'],
        treatment: ['Store at room temperature to ripen.', 'Use for green mango recipes.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'mango'
    },
    {
        id: 'm2',
        name: 'Half-Ripe',
        scientificName: 'Mangifera indica (Half-Ripe)',
        type: 'Ripeness',
        severity: 'Low',
        description: 'The mango is transitioning from green to yellow. It is firm and slightly sweet.',
        symptoms: [
            'Yellowish-green skin.',
            'Firm texture yielding slightly to pressure.',
            'Semi-sweet taste.'
        ],
        causes: ['Natural ripening process.'],
        treatment: ['Can be eaten or left to ripen further.', 'Good for salads or chutneys.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'mango'
    },
    {
        id: 'm3',
        name: 'Ripe',
        scientificName: 'Mangifera indica (Ripe)',
        type: 'Ripeness',
        severity: 'Low',
        description: 'The mango is fully ripe, yellow/orange, soft, and sweet. Ready to eat.',
        symptoms: [
            'Golden yellow or orange skin.',
            'Soft to touch.',
            'Sweet aroma and taste.'
        ],
        causes: ['Optimal maturity reached.'],
        treatment: ['Eat immediately.', 'Refrigerate to extend shelf life for a few days.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'mango'
    },
    {
        id: 'm4',
        name: 'OverRipe',
        scientificName: 'Mangifera indica (Over-Ripe)',
        type: 'Ripeness',
        severity: 'Moderate',
        description: 'The mango is very soft, may have bruises or dark spots, and might be fermenting.',
        symptoms: [
            'Dark spots or wrinkly skin.',
            'Mushy texture.',
            'Strong, fermented smell.'
        ],
        causes: ['Left too long after ripening.', 'Improper storage.'],
        treatment: ['Check for spoilage like mold.', 'Use for smoothies or baking if not spoiled.', 'Discard if fermented smell is strong.'],
        prevention: ['Consume ripe mangoes promptly.', 'Store in refrigerator once ripe.'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'mango'
    },
    {
        id: 'm5',
        name: 'Not_Mango',
        scientificName: 'N/A',
        type: 'Other',
        severity: 'Low',
        description: 'The object detected is not recognized as a mango.',
        symptoms: ['N/A'],
        causes: ['Camera not focused on a mango.', 'Image quality issues.'],
        treatment: ['Retake photo focusing on the mango fruit.'],
        prevention: ['Ensure good lighting and focus.'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'mango'
    },

    // --- SOIL TYPES ---
    {
        id: 's1',
        name: 'Black Soil',
        scientificName: 'Regur Soil',
        type: 'Soil',
        severity: 'Low',
        description: 'Rich in clay and holds moisture well. Ideal for growing cotton, sugarcane, and groundnuts.',
        symptoms: [
            'Dark black or grey color.',
            'Clayey texture.',
            'Cracks when dry.'
        ],
        causes: ['Weathering of solidified lava and volcanic rocks.'],
        treatment: ['Suitable for irrigation.', 'Add organic matter to improve aeration.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'soil'
    },
    {
        id: 's2',
        name: 'Cinder Soil',
        scientificName: 'Scoria',
        type: 'Soil',
        severity: 'Low',
        description: 'A coarse, bubbly volcanic soil often used for drainage or lightweight fill. Low nutrient content.',
        symptoms: [
            'Reddish-brown or black color.',
            'Very porous and lightweight.',
            'Coarse texture.'
        ],
        causes: ['Volcanic eruptions (pyroclastic rock).'],
        treatment: ['Mix with compost for gardening.', 'Use as mulch or drainage layer.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'soil'
    },
    {
        id: 's3',
        name: 'Laterite Soil',
        scientificName: 'Ferralsols',
        type: 'Soil',
        severity: 'Low',
        description: 'Rich in iron and aluminum, formed in hot and wet tropical areas. Generally acidic and low in fertility.',
        symptoms: [
            'Rusty-red color due to iron oxide.',
            'Hardens like brick when exposed to air.',
            'Leached of nutrients.'
        ],
        causes: ['Intense weathering in tropical climates.'],
        treatment: ['Add lime to correct acidity.', 'Apply fertilizers and organic manure.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'soil'
    },
    {
        id: 's4',
        name: 'Peat Soil',
        scientificName: 'Histosols',
        type: 'Soil',
        severity: 'Low',
        description: 'High in organic matter and retains a lot of water. Dark, spongy, and acidic.',
        symptoms: [
            'Dark brown to black color.',
            'Spongy texture.',
            'High moisture content.'
        ],
        causes: ['Accumulation of decayed vegetation in waterlogged areas.'],
        treatment: ['Drainage improvements.', 'Liming to reduce acidity.', 'Good for root crops if managed.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'soil'
    },
    {
        id: 's5',
        name: 'Yellow Soil',
        scientificName: 'Xanthic Ferralsols',
        type: 'Soil',
        severity: 'Low',
        description: 'Similar to red soil but more hydrated. Color ranges from yellow to yellowish-brown.',
        symptoms: [
            'Yellowish color.',
            'Often sandy to loamy.',
            'Moderate fertility.'
        ],
        causes: ['Hydration of iron oxides (turn red soil yellow).'],
        treatment: ['Regular watering and fertilization.', 'Suitable for various crops with proper care.'],
        prevention: ['N/A'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'soil'
    },

    // --- CORN DISEASES ---
    {
        id: 'c1',
        name: 'Corn Common Rust',
        scientificName: 'Puccinia sorghi',
        type: 'Fungal',
        severity: 'Moderate',
        description: 'Common rust is a fungal disease that causes pustules on corn leaves.',
        symptoms: [
            'Small, circular to elongated brown pustules on leaves.',
            'Pustules appear on both upper and lower leaf surfaces.',
            'Leaves may yellow and die in severe cases.'
        ],
        causes: ['Cool, moist weather conditions.', 'Airborne spores from infected plants.'],
        treatment: ['Apply fungicides.', 'Plant resistant hybrids.'],
        prevention: ['Crop rotation.', 'Remove infected residues.'],
        earlyDetection: 'Monitor lower leaves for pustules.',
        image: null,
        crop: 'corn'
    },
    {
        id: 'c2',
        name: 'Gray Leaf Spot',
        scientificName: 'Cercospora zeae-maydis',
        type: 'Fungal',
        severity: 'High',
        description: 'Gray leaf spot is a major yield-limiting disease of corn worldwide.',
        symptoms: [
            'Rectangular lesions on leaves that run parallel to veins.',
            'Lesions turn gray to tan.',
            'Blighted leaves may die completely.'
        ],
        causes: ['Warm, humid weather.', 'No-till farming practices leaving residue.'],
        treatment: ['Foliar fungicides.', 'Use resistant corn varieties.'],
        prevention: ['Deep plowing of crop residues.', 'Crop rotation with non-host crops.'],
        earlyDetection: 'Check lower leaves for small, tan spots.',
        image: null,
        crop: 'corn'
    },
    {
        id: 'c3',
        name: 'Northern Corn Leaf Blight',
        scientificName: 'Exserohilum turcicum',
        type: 'Fungal',
        severity: 'Moderate',
        description: 'A fungal disease causing large lesions on corn leaves.',
        symptoms: [
            'Cigar-shaped lesions on leaves.',
            'Lesions are gray-green to tan.',
            'Severe infection causes growing leaves to die like frost damage.'
        ],
        causes: ['Moderate temperatures and high humidity.', 'Dew on leaves.'],
        treatment: ['Fungicides applied at tassel stage.', 'Resistant hybrids.'],
        prevention: ['Crop rotation.', 'Tillage to bury residue.'],
        earlyDetection: 'Look for cigar-shaped lesions on lower leaves.',
        image: null,
        crop: 'corn'
    },
    {
        id: 'c4',
        name: 'Healthy Corn',
        scientificName: 'Zea mays',
        type: 'Healthy',
        severity: 'Low',
        description: 'The corn plant is healthy and vigorous.',
        symptoms: ['Green, vibrant leaves.', 'No lesions or spots.'],
        causes: ['Good management.', 'Favorable weather.'],
        treatment: ['N/A'],
        prevention: ['Continue good agricultural practices.'],
        earlyDetection: 'N/A',
        image: null,
        crop: 'corn'
    }
];
