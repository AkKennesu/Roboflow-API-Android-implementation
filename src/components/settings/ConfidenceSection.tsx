import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface ConfidenceSectionProps {
    confidenceThreshold: number;
    setConfidenceThreshold: (value: number) => void;
    darkMode: boolean;
}

export const ConfidenceSection = ({ confidenceThreshold, setConfidenceThreshold, darkMode }: ConfidenceSectionProps) => {
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

                <View className="flex-row justify-between items-center mb-2">
                    <Text className={`font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Threshold: {Math.round(confidenceThreshold * 100)}%</Text>
                    <View className={`px-3 py-1 rounded-full ${darkMode ? "bg-orange-900/30" : "bg-orange-100"}`}>
                        <Text className={`text-xs font-bold ${darkMode ? "text-orange-400" : "text-orange-600"}`}>Balanced</Text>
                    </View>
                </View>

                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    minimumTrackTintColor="#22c55e"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#22c55e"
                />
                <View className="flex-row justify-between px-1">
                    <Text className="text-gray-400 text-xs">0%</Text>
                    <Text className="text-gray-400 text-xs">100%</Text>
                </View>

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
