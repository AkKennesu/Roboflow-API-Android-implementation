import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spinner } from 'heroui-native';
import { Prediction } from '../services/api';
import { diseases } from '../data/diseases';
import { saveDetectionResult } from '../services/history';
import { useAuth } from '../context/AuthContext';

interface ResultDisplayProps {
    predictions: Prediction[] | null;
    loading: boolean;
    error: string | null;
    imageUri?: string | null; // Added imageUri prop
    showSaveButton?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ predictions, loading, error, imageUri, showSaveButton = true }) => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user || !predictions || !imageUri) return;

        setSaving(true);
        try {
            await saveDetectionResult(user.uid, imageUri, predictions);
            Alert.alert('Success', 'Result saved to history!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save result.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="p-5 items-center justify-center w-full">
                <Spinner size="lg" color="primary" />
                <Text className="text-lg text-primary font-bold mt-3">Analyzing image...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="p-5 items-center justify-center w-full bg-danger/10 rounded-xl">
                <Ionicons name="alert-circle-outline" size={40} className="text-danger" />
                <Text className="text-base text-danger text-center mt-2">{error}</Text>
            </View>
        );
    }

    if (!predictions) {
        return null;
    }

    if (predictions.length === 0) {
        return (
            <View className="p-5 items-center justify-center w-full bg-success/10 rounded-xl">
                <Ionicons name="checkmark-circle-outline" size={40} className="text-success" />
                <Text className="text-base text-success font-bold mt-2">No diseases detected.</Text>
            </View>
        );
    }

    // Get the top prediction
    const topPrediction = predictions[0];
    const diseaseInfo = diseases.find(d => d.name.toLowerCase() === topPrediction.class.toLowerCase());

    return (
        <View className="w-full mt-4 pb-10">
            <View className="flex-row items-center justify-center mb-4">
                <Ionicons name="analytics-outline" size={24} className="text-default-700 mr-2" />
                <Text className="text-xl font-bold text-default-700">Detection Results</Text>
            </View>

            {/* Main Result Card */}
            <View className="mb-6 w-full border border-default-200 bg-white rounded-2xl p-5 shadow-sm">
                <View className="flex-row justify-between items-start mb-4">
                    <View>
                        <Text className="text-2xl font-bold text-default-900 capitalize mb-1">{topPrediction.class}</Text>
                        <View className="bg-green-100 px-3 py-1 rounded-full self-start">
                            <Text className="text-green-700 text-xs font-bold">
                                {(topPrediction.confidence * 100).toFixed(1)}% Confidence
                            </Text>
                        </View>
                    </View>
                    <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center">
                        <Ionicons name="leaf" size={24} color="#22c55e" />
                    </View>
                </View>

                {diseaseInfo ? (
                    <>
                        {/* Poor Health / Causes */}
                        <View className="mt-4">
                            <Text className="text-base font-bold text-red-500 mb-2 flex-row items-center">
                                <Ionicons name="warning-outline" size={18} /> Poor Health (Causes)
                            </Text>
                            <View className="bg-red-50 p-3 rounded-xl">
                                {diseaseInfo.causes.map((cause, idx) => (
                                    <Text key={idx} className="text-gray-700 text-sm mb-1">• {cause}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Recommendation / Treatment */}
                        <View className="mt-4">
                            <Text className="text-base font-bold text-blue-500 mb-2 flex-row items-center">
                                <Ionicons name="medkit-outline" size={18} /> Recommendation (Treatment)
                            </Text>
                            <View className="bg-blue-50 p-3 rounded-xl">
                                {diseaseInfo.treatment.map((item, idx) => (
                                    <Text key={idx} className="text-gray-700 text-sm mb-1">• {item}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Suggestions / Prevention */}
                        <View className="mt-4">
                            <Text className="text-base font-bold text-green-600 mb-2 flex-row items-center">
                                <Ionicons name="shield-checkmark-outline" size={18} /> Suggestions (Prevention)
                            </Text>
                            <View className="bg-green-50 p-3 rounded-xl">
                                {diseaseInfo.prevention.map((item, idx) => (
                                    <Text key={idx} className="text-gray-700 text-sm mb-1">• {item}</Text>
                                ))}
                            </View>
                        </View>
                    </>
                ) : (
                    <Text className="text-gray-500 italic mt-4">Detailed information not available for this disease.</Text>
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
                            <Text className="text-white font-bold text-lg">Save Result</Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};
