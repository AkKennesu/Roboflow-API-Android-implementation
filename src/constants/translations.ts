export const translations = {
    en: {
        // Sidebar
        menu: 'Menu',
        editProfile: 'Edit Profile',
        language: 'Language',
        settings: 'Settings',
        darkMode: 'Dark Mode',
        logOut: 'Log Out',
        version: 'Version',

        // Navigation
        navDisease: 'Disease',
        navWeather: 'Weather',
        navLocation: 'Location',
        navHistory: 'History',

        // Home
        home: 'Home',
        ricePlantDiseases: 'Rice Plant Diseases',
        dictionary: 'Dictionary',
        camera: 'Camera',
        scan: 'Scan',
        weatherInfo: 'Weather Info',
        checkWeather: 'Check weather',
        myLocation: 'My Location',
        viewNearbyScans: 'View nearby scans',
        diseasesHistory: 'Diseases History',
        viewPastScans: 'View past scans',

        // Weather
        weatherTitle: 'Weather Info',
        analyzingWeather: 'Analyzing weather conditions...',
        failedWeather: 'Failed to fetch weather data',
        retry: 'Tap to Retry',
        feelsLike: 'Feels like',
        diseaseAdviser: 'Disease Adviser',
        currentConditions: 'Current Conditions',
        forecast: '7-Day Forecast',
        humidity: 'Humidity',
        visibility: 'Visibility',
        pressure: 'Pressure',
        clouds: 'Clouds',
        wind: 'Wind',
        airQuality: 'Air Quality',

        // History & Camera
        diseasesHistoryTitle: 'Diseases History',
        noHistory: 'No history yet',
        scanToSave: 'Scan your plants to detect diseases and save them here.',
        confidence: 'Confidence',
        scannedOn: 'Scanned on',
        scanDetails: 'Scan Details',

        // Detection
        detectorTitle: 'Rice Disease Detector',
        selectPhoto: 'Select a photo of a rice plant leaf to detect diseases.',
        failedToAnalyze: 'Failed to analyze image. Please check your internet connection and try again.',
        analyzing: 'Analyzing image...',
        noDiseases: 'No diseases detected.',
        detectionResults: 'Detection Results',
        poorHealth: 'Poor Health (Causes)',
        recommendation: 'Recommendation (Treatment)',
        suggestions: 'Suggestions (Prevention)',
        noInfo: 'Detailed information not available for this disease.',
        saveResult: 'Save Result',
        savedSuccess: 'Result saved to history!',
        saveError: 'Failed to save result.',

        // Disease Details
        severity: 'Severity',
        symptoms: 'Symptoms',
        causes: 'Causes',
        treatment: 'Treatment',
        prevention: 'Prevention',
        earlyDetection: 'Early Detection',

        // Image Selector
        saveToGallery: 'Save photo to gallery',
        gallery: 'Gallery',
        noImageSelected: 'No Image Selected',
        permissionDenied: 'Permission denied',
        permissionMessage: 'Sorry, we need camera permissions to make this work!',
        savedToGallery: 'Photo saved to gallery!',
        errorSaving: 'Failed to save photo to gallery.',
    },
    tl: {
        // Sidebar
        menu: 'Menu',
        editProfile: 'I-edit ang Profile',
        language: 'Wika',
        settings: 'Mga Setting',
        darkMode: 'Dark Mode',
        logOut: 'Mag-log Out',
        version: 'Bersyon',

        // Navigation
        navDisease: 'Sakit',
        navWeather: 'Panahon',
        navLocation: 'Lokasyon',
        navHistory: 'Kasaysayan',

        // Home
        home: 'Tahanan',
        ricePlantDiseases: 'Sakit ng Palay',
        dictionary: 'Diksyunaryo',
        camera: 'Kamera',
        scan: 'I-scan',
        weatherInfo: 'Panahon',
        checkWeather: 'Tingnan ang panahon',
        myLocation: 'Aking Lokasyon',
        viewNearbyScans: 'Tingnan ang mga scan',
        diseasesHistory: 'Kasaysayan',
        viewPastScans: 'Nakaraang mga scan',

        // Weather
        weatherTitle: 'Impormasyon sa Panahon',
        analyzingWeather: 'Sinusuri ang panahon...',
        failedWeather: 'Nabigong kunin ang datos',
        retry: 'I-tap para Ulitin',
        feelsLike: 'Pakiramdam ay',
        diseaseAdviser: 'Payo sa Sakit',
        currentConditions: 'Kasalukuyang Kondisyon',
        forecast: 'Pagtataya sa 7 Araw',
        humidity: 'Halumigmig',
        visibility: 'Bisibilidad',
        pressure: 'Presyon',
        clouds: 'Ulap',
        wind: 'Hangin',
        airQuality: 'Kalidad ng Hangin',

        // History & Camera
        diseasesHistoryTitle: 'Kasaysayan ng Sakit',
        noHistory: 'Wala pang kasaysayan',
        scanToSave: 'I-scan ang iyong mga halaman upang matukoy ang mga sakit at i-save dito.',
        confidence: 'Kumpiyansa',
        scannedOn: 'Na-scan noong',
        scanDetails: 'Detalye ng Scan',

        // Detection
        detectorTitle: 'Detektor ng Sakit sa Palay',
        selectPhoto: 'Pumili ng larawan ng dahon ng palay upang matukoy ang sakit.',
        failedToAnalyze: 'Nabigong suriin ang larawan. Pakisuri ang iyong koneksyon sa internet at subukang muli.',
        analyzing: 'Sinusuri ang larawan...',
        noDiseases: 'Walang nakitang sakit.',
        detectionResults: 'Resulta ng Pagsusuri',
        poorHealth: 'Mahinang Kalusugan (Mga Sanhi)',
        recommendation: 'Rekomendasyon (Paggamot)',
        suggestions: 'Mungkahi (Pag-iwas)',
        noInfo: 'Walang detalyadong impormasyon para sa sakit na ito.',
        saveResult: 'I-save ang Resulta',
        savedSuccess: 'Na-save na sa kasaysayan!',
        saveError: 'Nabigong i-save ang resulta.',

        // Disease Details
        severity: 'Kalubhaan',
        symptoms: 'Mga Sintomas',
        causes: 'Mga Sanhi',
        treatment: 'Paggamot',
        prevention: 'Pag-iwas',
        earlyDetection: 'Maagang Pagtuklas',

        // Image Selector
        saveToGallery: 'I-save sa gallery',
        gallery: 'Gallery',
        noImageSelected: 'Walang Napiling Larawan',
        permissionDenied: 'Tinanggihan ang pahintulot',
        permissionMessage: 'Paumanhin, kailangan namin ng pahintulot sa camera upang gumana ito!',
        savedToGallery: 'Na-save na sa gallery!',
        errorSaving: 'Nabigong i-save sa gallery.',
    }
};

export type TranslationKey = keyof typeof translations.en;
