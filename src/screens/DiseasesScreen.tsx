import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { diseases } from '../data/diseases';

import { useSettings } from '../context/SettingsContext';

export const DiseasesScreen = () => {
    const navigation = useNavigation<any>();
    const { darkMode } = useSettings();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Rice Plant Diseases</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>

                {diseases.map((disease, index) => (
                    <TouchableOpacity
                        key={index}
                        className={`p-4 rounded-xl mb-4 shadow-sm border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                        onPress={() => navigation.navigate('DiseaseDetail', { disease })}
                    >
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${disease.type === 'Fungal' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-100') :
                            disease.type === 'Bacterial' ? (darkMode ? 'bg-green-900/30' : 'bg-green-100') :
                                disease.type === 'Healthy' ? (darkMode ? 'bg-green-900/30' : 'bg-green-100') :
                                    (darkMode ? 'bg-red-900/30' : 'bg-red-100')
                            }`}>
                            <Ionicons
                                name={
                                    disease.type === 'Fungal' ? 'leaf' :
                                        disease.type === 'Bacterial' ? 'water' :
                                            disease.type === 'Healthy' ? 'happy-outline' : 'bug'
                                }
                                size={24}
                                color={
                                    disease.type === 'Fungal' ? '#3b82f6' :
                                        disease.type === 'Bacterial' ? '#22c55e' :
                                            disease.type === 'Healthy' ? '#22c55e' : '#ef4444'
                                }
                            />
                        </View>
                        <View className="flex-1">
                            <Text className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{disease.name}</Text>
                            <Text className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{disease.scientificName}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={darkMode ? "#9ca3af" : "#9ca3af"} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
