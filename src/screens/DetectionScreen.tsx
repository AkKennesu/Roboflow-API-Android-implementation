import React, { useState, useCallback } from 'react';
import { Text, View, StatusBar, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ImageSelector } from '../components/ImageSelector';
import { ResultDisplay } from '../components/ResultDisplay';
import { useSettings } from '../context/SettingsContext';
import { ProfileAvatarButton } from '../components/ProfileAvatarButton';
import { useDetection } from '../hooks/useDetection';

export const DetectionScreen = () => {
    const { confidenceThresholds, darkMode, translations: t } = useSettings();
    const [selectedCrop, setSelectedCrop] = useState<'rice' | 'mango' | 'soil' | 'corn' | null>(null);

    // Dynamic threshold selection
    // Dynamic threshold selection
    const activeThreshold = (selectedCrop && confidenceThresholds[selectedCrop]) ?? 0.70;

    const {
        selectedImage,
        predictions,
        loading,
        error,
        handleImageSelected,
        setSelectedImage,
        setPredictions,
        setError
    } = useDetection(activeThreshold, t, selectedCrop || 'rice');

    const resetSelection = () => {
        setSelectedCrop(null);
        setSelectedImage(null);
        setPredictions(null);
        setError(null);
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (selectedCrop) {
                    resetSelection();
                    return true;
                }
                return false;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove();
        }, [selectedCrop])
    );

    const CropCard = ({ type, label, icon }: { type: 'rice' | 'mango' | 'soil' | 'corn', label: string, icon: string }) => (
        <TouchableOpacity
            onPress={() => setSelectedCrop(type)}
            className={`w-full p-6 rounded-2xl mb-4 flex-row items-center border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
        >
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
                <Text className="text-2xl">{icon}</Text>
            </View>
            <View>
                <Text className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{label}</Text>
                <Text className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tap to scan {label.toLowerCase()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={darkMode ? "#9ca3af" : "#cbd5e1"} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
    );

    const getTitle = () => {
        if (!selectedCrop) return t.detectorTitle;
        if (selectedCrop === 'rice') return 'Rice Detector';
        if (selectedCrop === 'mango') return 'Mango Detector';
        if (selectedCrop === 'soil') return 'Soil Detector';
        if (selectedCrop === 'corn') return 'Corn Detector';
        return t.detectorTitle;
    };

    const getInstruction = () => {
        if (selectedCrop === 'rice') return t.selectPhoto;
        if (selectedCrop === 'mango') return 'Select a photo of a mango leaf/fruit.';
        if (selectedCrop === 'soil') return 'Select a photo of soil to identify its type.';
        if (selectedCrop === 'corn') return 'Select a photo of a corn leaf/fruit.';
        return '';
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-center mb-2 relative">
                <View className="absolute left-6 z-10">
                    {selectedCrop ? (
                        <TouchableOpacity onPress={resetSelection}>
                            <Ionicons name="arrow-back" size={24} color={darkMode ? "white" : "black"} />
                        </TouchableOpacity>
                    ) : (
                        <ProfileAvatarButton />
                    )}
                </View>
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {getTitle()}
                </Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ padding: 20, paddingBottom: 100, flexGrow: 1 }}>

                {!selectedCrop ? (
                    <View className="flex-1 justify-center">
                        <Text className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Choose your detector
                        </Text>
                        <CropCard type="rice" label="Rice Plant" icon="🌾" />
                        <CropCard type="mango" label="Mango" icon="🥭" />
                        <CropCard type="soil" label="Soil" icon="🟤" />
                        <CropCard type="corn" label="Corn" icon="🌽" />
                    </View>
                ) : (
                    <View className={`rounded-2xl p-5 w-full shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <Text className={`text-base text-center mb-5 ${darkMode ? "text-white" : "text-gray-600"}`}>
                            {getInstruction()}
                        </Text>

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
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
