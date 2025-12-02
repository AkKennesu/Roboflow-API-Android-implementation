import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spinner } from 'heroui-native';
import { Prediction } from '../services/api';
import { diseases, Disease } from '../data/diseases';
import { saveDetectionResult } from '../services/history';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { translateText, translateBatch } from '../services/TranslationService';

interface ResultDisplayProps {
    predictions: Prediction[] | null;
    loading: boolean;
    error: string | null;
    imageUri?: string | null;
    showSaveButton?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ predictions, loading, error, imageUri, showSaveButton = true }) => {
    const { user } = useAuth();
    const { darkMode, language, translations: t } = useSettings();
    const [saving, setSaving] = useState(false);

    // Translated content state
    const [translatedDisease, setTranslatedDisease] = useState<Disease | null>(null);
    const [translatedClassName, setTranslatedClassName] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState(false);

    const topPrediction = predictions ? predictions[0] : null;
    const diseaseInfo = topPrediction ? diseases.find(d => d.name.toLowerCase() === topPrediction.class.toLowerCase()) : null;

    useEffect(() => {
        const translateContent = async () => {
            if (!topPrediction) return;

            if (language === 'en') {
                setTranslatedClassName(topPrediction.class);
                setTranslatedDisease(diseaseInfo || null);
                return;
            }

            setIsTranslating(true);
            try {
                // Translate Class Name
                const className = await translateText(topPrediction.class, 'tl');
                setTranslatedClassName(className);

                // Translate Disease Info if available
                if (diseaseInfo) {
                    const causes = await translateBatch(diseaseInfo.causes, 'tl');
                    const treatment = await translateBatch(diseaseInfo.treatment, 'tl');
                    const prevention = await translateBatch(diseaseInfo.prevention, 'tl');

                    setTranslatedDisease({
                        ...diseaseInfo,
                        causes,
                        treatment,
                        prevention
                    });
                } else {
                    setTranslatedDisease(null);
                }
            } catch (err) {
                console.error('Translation error:', err);
                setTranslatedClassName(topPrediction.class);
                setTranslatedDisease(diseaseInfo || null);
            } finally {
                setIsTranslating(false);
            }
        };

        translateContent();
    }, [topPrediction, language]);


    const handleSave = async () => {
        if (!user || !predictions || !imageUri) return;

        setSaving(true);
        try {
            await saveDetectionResult(user.uid, imageUri, predictions);
            Alert.alert('Success', t.savedSuccess);
        } catch (error) {
            Alert.alert('Error', t.saveError);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="p-5 items-center justify-center w-full">
                <Spinner size="lg" color="primary" />
                <Text className={`text-lg font-bold mt-3 ${darkMode ? "text-blue-400" : "text-primary"}`}>{t.analyzing}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className={`p-5 items-center justify-center w-full rounded-xl ${darkMode ? "bg-red-900/20" : "bg-danger/10"}`}>
                <Ionicons name="alert-circle-outline" size={40} className="text-danger" color={darkMode ? "#f87171" : "#ef4444"} />
                <Text className={`text-base text-center mt-2 ${darkMode ? "text-red-400" : "text-danger"}`}>{error}</Text>
            </View>
        );
    }

    if (!predictions) {
        return null;
    }

    if (predictions.length === 0) {
        return (
            <View className={`p-5 items-center justify-center w-full rounded-xl ${darkMode ? "bg-green-900/20" : "bg-success/10"}`}>
                <Ionicons name="checkmark-circle-outline" size={40} className="text-success" color={darkMode ? "#4ade80" : "#22c55e"} />
                <Text className={`text-base font-bold mt-2 ${darkMode ? "text-green-400" : "text-success"}`}>{t.noDiseases}</Text>
            </View>
        );
    }

    return (
        <View className="w-full mt-4 pb-10">
            <View className="flex-row items-center justify-center mb-4">
                <Ionicons name="analytics-outline" size={24} color={darkMode ? "#9ca3af" : "#374151"} style={{ marginRight: 8 }} />
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-700"}`}>{t.detectionResults}</Text>
            </View>

            {/* Main Result Card */}
            <View className={`mb-6 w-full border rounded-2xl p-5 shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <View className="flex-row justify-between items-start mb-4">
                    <View>
                        <Text className={`text-2xl font-bold capitalize mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {translatedClassName || topPrediction?.class}
                        </Text>
                        <View className={`px-3 py-1 rounded-full self-start ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                            <Text className={`text-xs font-bold ${darkMode ? "text-green-400" : "text-green-700"}`}>
                                {topPrediction ? (topPrediction.confidence * 100).toFixed(1) : 0}% {t.confidence}
                            </Text>
                        </View>
                    </View>
                    <View className={`w-12 h-12 rounded-full items-center justify-center ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <Ionicons name="leaf" size={24} color="#22c55e" />
                    </View>
                </View>

                {isTranslating ? (
                    <View className="py-5 items-center">
                        <ActivityIndicator size="small" color="#22c55e" />
                        <Text className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Translating details...</Text>
                    </View>
                ) : translatedDisease ? (
                    <>
                        {/* Poor Health / Causes */}
                        <View className="mt-4">
                            <Text className="text-base font-bold text-red-500 mb-2 flex-row items-center">
                                <Ionicons name="warning-outline" size={18} /> {t.poorHealth}
                            </Text>
                            <View className={`p-3 rounded-xl ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}>
                                {translatedDisease.causes.map((cause, idx) => (
                                    <Text key={idx} className={`text-sm mb-1 ${darkMode ? "text-white" : "text-gray-700"}`}>• {cause}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Recommendation / Treatment */}
                        <View className="mt-4">
                            <Text className="text-base font-bold text-blue-500 mb-2 flex-row items-center">
                                <Ionicons name="medkit-outline" size={18} /> {t.recommendation}
                            </Text>
                            <View className={`p-3 rounded-xl ${darkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                                {translatedDisease.treatment.map((item, idx) => (
                                    <Text key={idx} className={`text-sm mb-1 ${darkMode ? "text-white" : "text-gray-700"}`}>• {item}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Suggestions / Prevention */}
                        <View className="mt-4">
                            <Text className="text-base font-bold text-green-600 mb-2 flex-row items-center">
                                <Ionicons name="shield-checkmark-outline" size={18} /> {t.suggestions}
                            </Text>
                            <View className={`p-3 rounded-xl ${darkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                                {translatedDisease.prevention.map((item, idx) => (
                                    <Text key={idx} className={`text-sm mb-1 ${darkMode ? "text-white" : "text-gray-700"}`}>• {item}</Text>
                                ))}
                            </View>
                        </View>
                    </>
                ) : (
                    <Text className="text-gray-500 italic mt-4">{t.noInfo}</Text>
                )}
            </View>

            {/* Save Button */}
            {user && showSaveButton && (
                <TouchableOpacity
                    className={`w-full py-4 rounded-xl flex-row items-center justify-center shadow-md ${saving ? 'bg-gray-400' : 'bg-green-600'}`}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <Spinner size="sm" color="white" />
                    ) : (
                        <>
                            <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-lg">{t.saveResult}</Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};
