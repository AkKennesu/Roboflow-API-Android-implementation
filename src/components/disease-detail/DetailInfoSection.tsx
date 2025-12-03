import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailInfoSectionProps {
    title: string;
    items: string[];
    icon: any;
    iconColor: string;
    bgColor: string;
    bulletColor: string;
    darkMode: boolean;
}

export const DetailInfoSection = ({ title, items, icon, iconColor, bgColor, bulletColor, darkMode }: DetailInfoSectionProps) => {
    return (
        <View className="mb-8">
            <View className="flex-row items-center mb-4">
                <View className={`p-2 rounded-lg mr-3 ${bgColor}`}>
                    <Ionicons name={icon} size={24} color={iconColor} />
                </View>
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{title}</Text>
            </View>
            <View className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                {items.map((item, index) => (
                    <View key={index} className="flex-row mb-3 items-start">
                        <View className={`w-2 h-2 ${bulletColor} rounded-full mt-2 mr-3`} />
                        <Text className={`flex-1 leading-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{item}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
