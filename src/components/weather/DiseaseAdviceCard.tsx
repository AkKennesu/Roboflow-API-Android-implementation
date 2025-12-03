import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DiseaseAdviceCardProps {
    adviceBase: any;
    translatedAdvice: { risk: string, advice: string } | null;
    darkMode: boolean;
    t: any;
}

export const DiseaseAdviceCard = ({ adviceBase, translatedAdvice, darkMode, t }: DiseaseAdviceCardProps) => {
    if (!adviceBase) return null;

    return (
        <View className={`p-5 rounded-2xl mb-6 border shadow-sm ${adviceBase.color} ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
            <View className="flex-row items-center mb-2">
                <Ionicons name={adviceBase.icon as any} size={24} className={adviceBase.textColor} />
                <Text className={`font-bold text-lg ml-2 ${adviceBase.textColor}`}>{t.diseaseAdviser}</Text>
            </View>
            <Text className={`font-bold text-base mb-1 ${adviceBase.textColor}`}>
                {translatedAdvice?.risk || adviceBase.risk}
            </Text>
            <Text className={`leading-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {translatedAdvice?.advice || adviceBase.advice}
            </Text>
        </View>
    );
};
