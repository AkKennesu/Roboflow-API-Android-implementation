import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface ConfidenceSectionProps {
    confidenceThresholds: { rice: number; mango: number; soil: number };
    setConfidenceThreshold: (type: 'rice' | 'mango' | 'soil', value: number) => void;
    darkMode: boolean;
}

export const ConfidenceSection = ({ confidenceThresholds, setConfidenceThreshold, darkMode }: ConfidenceSectionProps) => {
    const [selectedTab, setSelectedTab] = useState<'rice' | 'mango' | 'soil'>('rice');

    const renderSlider = (type: 'rice' | 'mango' | 'soil', label: string) => (
        <>
            <View className="flex-row justify-between items-center mb-2 mt-4">
                <Text className={`font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{label} Threshold: {Math.round(confidenceThresholds[type] * 100)}%</Text>
                <View className={`px-3 py-1 rounded-full ${darkMode ? "bg-orange-900/30" : "bg-orange-100"}`}>
                    <Text className={`text-xs font-bold ${darkMode ? "text-orange-400" : "text-orange-600"}`}>Balanced</Text>
                </View>
            </View>

            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={confidenceThresholds[type]}
                onValueChange={(val) => setConfidenceThreshold(type, val)}
                minimumTrackTintColor="#22c55e"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#22c55e"
            />
            <View className="flex-row justify-between px-1">
                <Text className="text-gray-400 text-xs">0%</Text>
                <Text className="text-gray-400 text-xs">100%</Text>
            </View>
        </>
    );

    const getLabel = () => {
        if (selectedTab === 'rice') return 'Rice';
        if (selectedTab === 'mango') return 'Mango';
        return 'Soil';
    };

    return (
        <>
            <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Confidence Threshold</Text>
            <View className={`rounded-3xl p-5 mb-6 shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                <View className="flex-row items-center mb-4">
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <Ionicons name="bulb-outline" size={22} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                        <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>AI Detection Confidence</Text>
                        <Text className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Minimum confidence level for disease detection</Text>
                    </View>
                </View>

                {/* Tabs for switching between Rice, Mango, Soil */}
                <View className="flex-row mb-2 bg-gray-100 rounded-lg p-1" style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}>
                    <TouchableOpacity
                        onPress={() => setSelectedTab('rice')}
                        className={`flex-1 py-1.5 rounded-md items-center justify-center ${selectedTab === 'rice' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`text-xs sm:text-sm font-semibold ${selectedTab === 'rice' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Rice Plant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedTab('mango')}
                        className={`flex-1 py-1.5 rounded-md items-center justify-center ${selectedTab === 'mango' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`text-xs sm:text-sm font-semibold ${selectedTab === 'mango' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Mango</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedTab('soil')}
                        className={`flex-1 py-1.5 rounded-md items-center justify-center ${selectedTab === 'soil' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`text-xs sm:text-sm font-semibold ${selectedTab === 'soil' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Soil</Text>
                    </TouchableOpacity>
                </View>

                {renderSlider(selectedTab, getLabel())}

                <View className={`p-3 rounded-xl mt-4 flex-row items-start ${darkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                    <Ionicons name="information-circle-outline" size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                    <Text className={`text-xs ml-2 flex-1 leading-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        This affects AI disease detection accuracy. Higher = fewer but more accurate results.
                    </Text>
                </View>
            </View>
        </>
    );
};
