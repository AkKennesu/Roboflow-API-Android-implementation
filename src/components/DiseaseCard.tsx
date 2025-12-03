import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DiseaseCardProps {
    disease: any;
    darkMode: boolean;
    onPress: () => void;
}

export const DiseaseCard = ({ disease, darkMode, onPress }: DiseaseCardProps) => {
    const getIconName = (type: string) => {
        switch (type) {
            case 'Fungal': return 'leaf';
            case 'Bacterial': return 'water';
            case 'Healthy': return 'happy-outline';
            default: return 'bug';
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'Fungal': return '#3b82f6';
            case 'Bacterial': return '#22c55e';
            case 'Healthy': return '#22c55e';
            default: return '#ef4444';
        }
    };

    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'Fungal': return darkMode ? 'bg-blue-900/30' : 'bg-blue-100';
            case 'Bacterial': return darkMode ? 'bg-green-900/30' : 'bg-green-100';
            case 'Healthy': return darkMode ? 'bg-green-900/30' : 'bg-green-100';
            default: return darkMode ? 'bg-red-900/30' : 'bg-red-100';
        }
    };

    return (
        <TouchableOpacity
            className={`p-4 rounded-xl mb-4 shadow-sm border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
            onPress={onPress}
        >
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${getBackgroundColor(disease.type)}`}>
                <Ionicons
                    name={getIconName(disease.type) as any}
                    size={24}
                    color={getIconColor(disease.type)}
                />
            </View>
            <View className="flex-1">
                <Text className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{disease.name}</Text>
                <Text className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{disease.scientificName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={darkMode ? "#9ca3af" : "#9ca3af"} />
        </TouchableOpacity>
    );
};
