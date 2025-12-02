import React, { useState } from 'react';
import { Text, View, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Slider removed
import { ImageSelector } from '../components/ImageSelector';
import { ResultDisplay } from '../components/ResultDisplay';
import { detectDisease, Prediction } from '../services/api';

import { useSettings } from '../context/SettingsContext';

export const DetectionScreen = () => {
    const { confidenceThreshold } = useSettings();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<Prediction[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelected = async (uri: string) => {
        setSelectedImage(uri);
        setPredictions(null);
        setError(null);
        setLoading(true);

        try {
            // Convert decimal threshold (e.g. 0.75) to percentage (75) for API
            const results = await detectDisease(uri, Math.round(confidenceThreshold * 100));
            setPredictions(results);
        } catch (err) {
            setError('Failed to analyze image. Please check your internet connection and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-background" edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header removed completely */}

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ padding: 20, alignItems: 'center', flexGrow: 1 }}>
                <View className="bg-content1 rounded-2xl p-5 w-full shadow-md">
                    <Text className="text-base text-default-600 text-center mb-5">
                        Select a photo of a rice plant leaf to detect diseases.
                    </Text>

                    {/* Confidence Threshold Slider removed as per request */}

                    <ImageSelector
                        onImageSelected={handleImageSelected}
                        selectedImage={selectedImage}
                    />

                    <ResultDisplay
                        predictions={predictions}
                        loading={loading}
                        error={error}
                        imageUri={selectedImage}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
