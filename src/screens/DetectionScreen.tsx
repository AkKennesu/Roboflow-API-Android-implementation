import React, { useState } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Slider removed
import { ImageSelector } from '../components/ImageSelector';
import { ResultDisplay } from '../components/ResultDisplay';
import { detectDisease, Prediction } from '../services/api';

import { useSettings } from '../context/SettingsContext';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const DetectionScreen = () => {
    const navigation = useNavigation();
    const { confidenceThreshold, darkMode, translations: t } = useSettings();
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
            setError(t.failedToAnalyze);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.detectorTitle}</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ padding: 20, alignItems: 'center', flexGrow: 1 }}>
                <View className={`rounded-2xl p-5 w-full shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Text className={`text-base text-center mb-5 ${darkMode ? "text-white" : "text-gray-600"}`}>
                        {t.selectPhoto}
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
