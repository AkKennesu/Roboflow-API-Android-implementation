import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TipsSectionProps {
    tipsData: any;
    openTip: (tip: any) => void;
    darkMode: boolean;
}

export const TipsSection = ({ tipsData, openTip, darkMode }: TipsSectionProps) => {
    return (
        <>
            <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Scan Tips</Text>
            <View className="gap-3 mb-6">
                <TouchableOpacity
                    className={`p-4 rounded-2xl flex-row items-center shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                    onPress={() => openTip(tipsData.howToScan)}
                >
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <Ionicons name="scan-outline" size={22} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                        <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>How to Scan</Text>
                        <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Best practices for accurate results</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    className={`p-4 rounded-2xl flex-row items-center shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                    onPress={() => openTip(tipsData.photographyTips)}
                >
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <Ionicons name="bulb-outline" size={22} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                        <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>Photography Tips</Text>
                        <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Get better scan quality</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            {/* App Info */}
            <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>App Info</Text>
            <TouchableOpacity
                className={`p-4 rounded-2xl flex-row items-center shadow-sm border mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                onPress={() => openTip(tipsData.appInfo)}
            >
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                    <Ionicons name="information-circle-outline" size={22} color="#22c55e" />
                </View>
                <View className="flex-1">
                    <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>About Leaf-Detective</Text>
                    <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Version 1.0.0</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
        </>
    );
};
