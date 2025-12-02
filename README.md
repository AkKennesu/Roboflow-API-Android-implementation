# Rice Disease Detector

A React Native application powered by Roboflow for detecting diseases in rice plants. This app allows users to scan rice plant leaves, detect diseases, view detailed treatment recommendations, and track their scan history. It also features real-time weather updates, AI-driven disease advice, and multi-language support (English/Tagalog).

## 🛠️ Tools Used

- **Framework**: [React Native](https://reactnative.dev/) (Expo)
- **Language**: TypeScript
- **UI Library**: [HeroUI](https://www.heroui.com/) (Native), Tailwind CSS (NativeWind)
- **Backend/Database**: Firebase (Auth, Firestore, Storage)
- **AI/ML**: [Roboflow](https://roboflow.com/) (Computer Vision API)
- **Navigation**: React Navigation
- **Icons**: Expo Vector Icons (Ionicons)
- **Maps**: Leaflet (via `react-native-webview`)

## 🤖 API Integration

### 1. Roboflow Inference API (Disease Detection)
Used to analyze images of rice leaves and detect diseases like Rice Blast, Brown Spot, etc.
- **Endpoint**: `https://serverless.roboflow.com`
- **Configuration**: Requires API Key and Model ID in `src/config.ts`.

### 2. Open-Meteo API (Weather)
Fetches real-time weather data to provide agricultural insights.
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Features**: Current temperature, humidity, wind speed, cloud cover, and 7-day forecast.
- **No API Key required.**

### 3. Google Translate (Dynamic Translation)
Provides on-the-fly translation for dynamic content (like weather descriptions and disease advice) into Tagalog.
- **Endpoint**: `https://translate.googleapis.com/translate_a/single` (Free endpoint)
- **Usage**: Translates API responses that are returned in English.

### 4. Expo Modules
- **Expo Location**: Fetches user coordinates for local weather and mapping.
- **Expo Image Picker**: Accesses camera and gallery for scanning leaves.
- **Expo Media Library**: Saves scanned images and results to the device gallery.

## 🚀 How to Use

### Prerequisites
- Node.js installed
- Expo Go app on your mobile device (or Android Emulator)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AkKennesu/Roboflow-Integration-in-Android.git
    cd Roboflow-Integration-in-Android
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    - Ensure `src/config.ts` has valid Roboflow credentials.
    - Ensure `google-services.json` is present for Firebase configuration.

4.  **Run the App**
    ```bash
    npx expo start
    ```
    - Scan the QR code with the **Expo Go** app on your Android/iOS device.
    - Or press `a` to run on an Android Emulator.

## 📱 Features

- **Disease Detection**: Real-time detection of Rice Blast, Bacterial Leaf Blight, Brown Spot, etc.
- **AI Disease Adviser**: Provides advice based on current weather conditions to prevent disease outbreaks.
- **Multi-Language Support**: Full support for English and Tagalog (UI and Dynamic Content).
- **Detailed Info**: View causes, treatments, and prevention tips for detected diseases.
- **History**: Save and view past detection results.
- **Weather**: Check local weather conditions (requires location permission).
- **Authentication**: Secure login, signup, and profile management using Firebase.
- **Dark Mode**: Fully supported dark theme for low-light usage.

## 📄 License

This project is open-source and available under the MIT License.
