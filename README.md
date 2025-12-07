# Rice Disease Detector

A React Native application powered by Roboflow for detecting diseases in rice plants. This app allows users to scan rice plant leaves, detect diseases, view detailed treatment recommendations, and track their scan history. It also features real-time weather updates, AI-driven disease advice, and multi-language support (English/Tagalog).

## 🛠️ Technologies & Frameworks

### Core
- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 52)
- **Language**: TypeScript
- **Build Tool**: Expo Prebuild (CNG)

### UI & UX
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Components**: [HeroUI Native](https://www.heroui.com/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Icons**: Expo Vector Icons (Ionicons)
- **Custom UI**: `react-native-curved-bottom-bar`, `react-native-svg`

### Backend & Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth & Google Sign-In
- **Storage**: Firebase Storage

## 🤖 API Integration

### 1. Roboflow Inference API (Disease Detection)
Used to analyze images of rice leaves and detect diseases like *Rice Blast* and *Brown Spot*.
- **Endpoint**: `https://serverless.roboflow.com`
- **Purpose**: Computer Vision & Image Classification.

### 2. Open-Meteo API (Weather)
Fetches real-time weather data for the user's current location.
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Data**: Temperature, humidity, wind speed, and 7-day forecast.

### 3. TimeAPI.io (Time Sync)
Provides accurate local time information to sync the home screen widget.
- **Endpoint**: `https://timeapi.io/api/Time/current/coordinate`
- **Purpose**: Real-time clock synchronization.

### 4. Saurav Hathi OTP Service (Verification)
Handles secure email verification via alphanumeric One-Time Passwords (OTP).
- **Service**: [OTP Service](https://github.com/sauravhathi/otp-service)
- **Purpose**: verifying user email addresses during signup.

### 5. Google Sign-In (OAuth)
Native Google authentication integration.
- **Service**: Google Identity Services
- **Library**: `@react-native-google-signin/google-signin` v13.2.0

### 6. Google Translate (Dynamic Translation)
Provides on-the-fly translation for dynamic content into Tagalog.
- **Endpoint**: `https://translate.googleapis.com/translate_a/single`

### 7. Expo Modules
- **Location**: Geolocation for weather data.
- **ImagePicker**: Camera and gallery access.
- **MediaLibrary**: Saving results.
- **FileSystem**: File management.

### 8. Maps & Location
- **Expo Location**: Device GPS coordinates.
- **Leaflet (WebView)**: Interactive map interface.
- **OpenStreetMap**: Map tiles and data.

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

## 🎨 UI & Code Repositories
This project builds upon these excellent open-source repositories:

- **Saurav Hathi OTP Service**: [otp-service](https://github.com/sauravhathi/otp-service)
- **Curved Bottom Bar**: [react-native-curved-bottom-bar](https://github.com/hoaphantn7604/react-native-curved-bottom-bar)
- **HeroUI**: [heroui-inc/heroui](https://github.com/heroui-inc/heroui)
- **NativeWind**: [nativewind/nativewind](https://github.com/nativewind/nativewind)
- **React Native Reanimated**: [software-mansion/react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)

## 📄 License

This project is open-source and available under the MIT License.
