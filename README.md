# Rice Disease Detector

A React Native application powered by Roboflow for detecting diseases in rice plants. This app allows users to scan rice plant leaves, detect diseases, view detailed treatment recommendations, and track their scan history.

## 🛠️ Tools Used

- **Framework**: [React Native](https://reactnative.dev/) (Expo)
- **Language**: TypeScript
- **UI Library**: [HeroUI](https://www.heroui.com/) (Native), Tailwind CSS (NativeWind)
- **Backend/Database**: Firebase (Auth, Firestore)
- **AI/ML**: [Roboflow](https://roboflow.com/) (Computer Vision API)
- **Navigation**: React Navigation
- **Icons**: Expo Vector Icons (Ionicons)

## 🤖 API Integration

This project uses the **Roboflow Inference API** to detect diseases.

### Configuration
The API configuration is located in `src/config.ts`. You need a Roboflow API Key and Model ID.

```typescript
export const CONFIG = {
    ROBOFLOW_API_KEY: "YOUR_API_KEY",
    ROBOFLOW_MODEL_ID: "agri-scan-2-vrp1u/1", // Example Model ID
    ROBOFLOW_API_URL: "https://serverless.roboflow.com",
};
```

### How it works
1.  **Image Capture**: The user selects an image from the gallery or camera.
2.  **Base64 Conversion**: The image is converted to a Base64 string.
3.  **API Request**: A POST request is sent to the Roboflow API with the image data and confidence threshold.

**Sample Code (`src/services/api.ts`):**

```typescript
const detectDisease = async (imageUri: string, confidence: number) => {
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
    
    const url = `${CONFIG.ROBOFLOW_API_URL}/${CONFIG.ROBOFLOW_MODEL_ID}`;
    
    const response = await axios({
        method: "POST",
        url: url,
        params: {
            api_key: CONFIG.ROBOFLOW_API_KEY,
            confidence: confidence,
        },
        data: base64,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    return response.data.predictions;
};
```

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
- **Detailed Info**: View causes, treatments, and prevention tips for detected diseases.
- **History**: Save and view past detection results.
- **Weather**: Check local weather conditions (requires location permission).
- **Authentication**: Secure login and signup using Firebase.

## 📄 License

This project is open-source and available under the MIT License.
