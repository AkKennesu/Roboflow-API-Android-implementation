export interface Disease {
    id: string;
    name: string;
    scientificName: string;
    type: 'Fungal' | 'Viral' | 'Bacterial' | 'Healthy' | 'Other';
    severity: 'High' | 'Moderate' | 'Low';
    description: string;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    prevention: string[];
    earlyDetection: string;
    image: any; // Placeholder for now
}

export const diseases: Disease[] = [
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
        image: null
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
        image: null
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
        image: null
    },
    {
        id: '4',
        name: 'Sheath blight',
        scientificName: 'Rhizoctonia solani',
        type: 'Fungal',
        severity: 'Moderate',
        description: 'Sheath blight is a fungal disease that causes lesions on the leaf sheaths.',
        symptoms: [
            'Oval or irregular greenish-gray lesions on leaf sheaths near the water line.',
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
        image: null
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
        image: null
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
        image: null
    }
];
