import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Disease } from '../data/diseases';
import { useSettings } from '../context/SettingsContext';
import { translateText, translateBatch } from '../services/TranslationService';

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
                {/* Hero Image Placeholder */}
                <View className={`w-full h-72 ${darkMode ? "bg-gray-800" : "bg-gray-300"}`}>
                    {/* Image would go here */}
                    <Image
                        source={{ uri: 'https://placehold.co/600x400/png' }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>

                {/* Content Container */}
                <View className={`-mt-10 rounded-t-3xl px-6 pt-8 pb-6 shadow-lg min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>

                    {isTranslating ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="large" color="#22c55e" />
                            <Text className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Translating...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Title Section */}
                            <View className="mb-6">
                                <Text className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{translatedDisease.name}</Text>
                                <Text className={`italic text-lg mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{disease.scientificName}</Text>

                                <View className="flex-row mt-4 gap-3">
                                    <View className={`px-3 py-1 rounded-full flex-row items-center ${disease.type === 'Fungal' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-100') :
                                        disease.type === 'Bacterial' ? (darkMode ? 'bg-green-900/30' : 'bg-green-100') :
                                            disease.type === 'Healthy' ? (darkMode ? 'bg-green-900/30' : 'bg-green-100') :
                                                (darkMode ? 'bg-red-900/30' : 'bg-red-100')
                                        }`}>
                                        <Ionicons name={
                                            disease.type === 'Fungal' ? 'leaf' :
                                                disease.type === 'Bacterial' ? 'water' :
                                                    disease.type === 'Healthy' ? 'happy-outline' : 'bug'
                                        } size={14} color={
                                            disease.type === 'Fungal' ? '#3b82f6' :
                                                disease.type === 'Bacterial' ? '#22c55e' :
                                                    disease.type === 'Healthy' ? '#22c55e' : '#ef4444'
                                        } />
                                        <Text className={`text-xs font-bold ml-1 uppercase ${disease.type === 'Fungal' ? 'text-blue-600' :
                                            disease.type === 'Bacterial' ? 'text-green-600' :
                                                disease.type === 'Healthy' ? 'text-green-600' : 'text-red-600'
                                            }`}>{translatedDisease.type}</Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full flex-row items-center ${darkMode ? "bg-orange-900/30" : "bg-orange-100"}`}>
                                        <Ionicons name="warning-outline" size={14} color="#f97316" />
                                        <Text className="text-orange-600 text-xs font-bold ml-1 uppercase">{translatedDisease.severity} {t.severity}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Description */}
                            <Text className={`leading-6 mb-8 text-base ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {translatedDisease.description}
                            </Text>

                            {/* Symptoms Section */}
                            <View className="mb-8">
                                <View className="flex-row items-center mb-4">
                                    <View className={`p-2 rounded-lg mr-3 ${darkMode ? "bg-orange-900/30" : "bg-orange-100"}`}>
                                        <Ionicons name="bug-outline" size={24} color="#f97316" />
                                    </View>
                                    <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.symptoms}</Text>
                                </View>
                                <View className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                    {translatedDisease.symptoms.map((symptom, index) => (
                                        <View key={index} className="flex-row mb-3 items-start">
                                            <View className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />
                                            <Text className={`flex-1 leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{symptom}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Causes Section */}
                            <View className="mb-8">
                                <View className="flex-row items-center mb-4">
                                    <View className={`p-2 rounded-lg mr-3 ${darkMode ? "bg-yellow-900/30" : "bg-yellow-100"}`}>
                                        <Ionicons name="help-circle-outline" size={24} color="#eab308" />
                                    </View>
                                    <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.causes}</Text>
                                </View>
                                <View className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                    {translatedDisease.causes.map((cause, index) => (
                                        <View key={index} className="flex-row mb-3 items-start">
                                            <View className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3" />
                                            <Text className={`flex-1 leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{cause}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Treatment Section */}
                            <View className="mb-8">
                                <View className="flex-row items-center mb-4">
                                    <View className={`p-2 rounded-lg mr-3 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}>
                                        <Ionicons name="medkit-outline" size={24} color="#ef4444" />
                                    </View>
                                    <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.treatment}</Text>
                                </View>
                                <View className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                    {translatedDisease.treatment.map((item, index) => (
                                        <View key={index} className="flex-row mb-3 items-start">
                                            <View className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3" />
                                            <Text className={`flex-1 leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Prevention Section */}
                            <View className="mb-8">
                                <View className="flex-row items-center mb-4">
                                    <View className={`p-2 rounded-lg mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                        <Ionicons name="shield-checkmark-outline" size={24} color="#22c55e" />
                                    </View>
                                    <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.prevention}</Text>
                                </View>
                                <View className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                    {translatedDisease.prevention.map((item, index) => (
                                        <View key={index} className="flex-row mb-3 items-start">
                                            <View className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3" />
                                            <Text className={`flex-1 leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

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
