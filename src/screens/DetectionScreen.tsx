import React from 'react';
import { Text, View, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageSelector } from '../components/ImageSelector';
import { ResultDisplay } from '../components/ResultDisplay';
import { useSettings } from '../context/SettingsContext';
import { ProfileAvatarButton } from '../components/ProfileAvatarButton';
import { useDetection } from '../hooks/useDetection';

export const DetectionScreen = () => {
    const { confidenceThreshold, darkMode, translations: t } = useSettings();
    const {
        selectedImage,
        predictions,
        loading,
        error,
        handleImageSelected
    } = useDetection(confidenceThreshold, t);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-center mb-2 relative">
                <View className="absolute left-6 z-10">
                    <ProfileAvatarButton />
                </View>
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.detectorTitle}</Text>
            </View>

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ padding: 20, paddingBottom: 100, alignItems: 'center', flexGrow: 1 }}>
                <View className={`rounded-2xl p-5 w-full shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Text className={`text-base text-center mb-5 ${darkMode ? "text-white" : "text-gray-600"}`}>
                        {t.selectPhoto}
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
            </ScrollView>
        </SafeAreaView>
    );
};
