import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Disease } from '../data/diseases';
import { useSettings } from '../context/SettingsContext';
import { translateText, translateBatch } from '../services/TranslationService';

// Components
import { DiseaseHero } from '../components/disease-detail/DiseaseHero';
import { DetailHeader } from '../components/disease-detail/DetailHeader';
import { DetailInfoSection } from '../components/disease-detail/DetailInfoSection';

export const DiseaseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { disease } = route.params as { disease: Disease };
    const { darkMode, language, translations: t } = useSettings();

    const [translatedDisease, setTranslatedDisease] = useState<Disease>(disease);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        const translateContent = async () => {
            if (language === 'en') {
                setTranslatedDisease(disease);
                return;
            }

            setIsTranslating(true);
            try {
                // Translate simple fields
                const [name, description, type, severity, earlyDetection] = await Promise.all([
                    translateText(disease.name, 'tl'),
                    translateText(disease.description, 'tl'),
                    translateText(disease.type, 'tl'),
                    translateText(disease.severity, 'tl'),
                    translateText(disease.earlyDetection, 'tl')
                ]);

                // Translate arrays
                const symptoms = await translateBatch(disease.symptoms, 'tl');
                const causes = await translateBatch(disease.causes, 'tl');
                const treatment = await translateBatch(disease.treatment, 'tl');
                const prevention = await translateBatch(disease.prevention, 'tl');

                setTranslatedDisease({
                    ...disease,
                    name,
                    description,
                    type: type as any, // Type assertion as string might change
                    severity: severity as any,
                    earlyDetection,
                    symptoms,
                    causes,
                    treatment,
                    prevention
                });
            } catch (error) {
                console.error('Translation failed:', error);
                // Fallback to original
                setTranslatedDisease(disease);
            } finally {
                setIsTranslating(false);
            }
        };

        translateContent();
    }, [disease, language]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header with Back Button */}
            <View className="absolute top-12 left-5 z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#333"} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <DiseaseHero darkMode={darkMode} />

                {/* Content Container */}
                <View className={`-mt-10 rounded-t-3xl px-6 pt-8 pb-6 shadow-lg min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>

                    {isTranslating ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="large" color="#22c55e" />
                            <Text className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Translating...</Text>
                        </View>
                    ) : (
                        <>
                            <DetailHeader
                                disease={disease}
                                translatedDisease={translatedDisease}
                                darkMode={darkMode}
                                t={t}
                            />

                            {/* Description */}
                            <Text className={`leading-6 mb-8 text-base ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {translatedDisease.description}
                            </Text>

                            <DetailInfoSection
                                title={t.symptoms}
                                items={translatedDisease.symptoms}
                                icon="bug-outline"
                                iconColor="#f97316"
                                bgColor={darkMode ? "bg-orange-900/30" : "bg-orange-100"}
                                bulletColor="bg-orange-400"
                                darkMode={darkMode}
                            />

                            <DetailInfoSection
                                title={t.causes}
                                items={translatedDisease.causes}
                                icon="help-circle-outline"
                                iconColor="#eab308"
                                bgColor={darkMode ? "bg-yellow-900/30" : "bg-yellow-100"}
                                bulletColor="bg-yellow-400"
                                darkMode={darkMode}
                            />

                            <DetailInfoSection
                                title={t.treatment}
                                items={translatedDisease.treatment}
                                icon="medkit-outline"
                                iconColor="#ef4444"
                                bgColor={darkMode ? "bg-red-900/30" : "bg-red-100"}
                                bulletColor="bg-red-400"
                                darkMode={darkMode}
                            />

                            <DetailInfoSection
                                title={t.prevention}
                                items={translatedDisease.prevention}
                                icon="shield-checkmark-outline"
                                iconColor="#22c55e"
                                bgColor={darkMode ? "bg-green-900/30" : "bg-green-100"}
                                bulletColor="bg-green-400"
                                darkMode={darkMode}
                            />

                            {/* Early Detection Tip */}
                            <View className={`p-5 rounded-2xl border mb-8 ${darkMode ? "bg-orange-900/20 border-orange-900/30" : "bg-orange-50 border-orange-100"}`}>
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="bulb-outline" size={24} color="#f97316" />
                                    <Text className="text-orange-600 font-bold text-lg ml-2">{t.earlyDetection}</Text>
                                </View>
                                <Text className={`leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {translatedDisease.earlyDetection}
                                </Text>
                            </View>
                        </>
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
