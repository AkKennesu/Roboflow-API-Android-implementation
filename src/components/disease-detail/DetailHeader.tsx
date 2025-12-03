import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailHeaderProps {
    disease: any;
    translatedDisease: any;
    darkMode: boolean;
    t: any;
}

export const DetailHeader = ({ disease, translatedDisease, darkMode, t }: DetailHeaderProps) => {
    return (
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
    );
};
