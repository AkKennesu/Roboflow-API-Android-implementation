import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HistoryItem } from '../../services/history';
import { translateText } from '../../services/TranslationService';

interface HistoryItemCardProps {
    item: HistoryItem;
    darkMode: boolean;
    language: string;
    t: any;
    onPress: () => void;
}

export const HistoryItemCard = ({ item, darkMode, language, t, onPress }: HistoryItemCardProps) => {
    const topPrediction = item.predictions[0];
    const date = new Date(item.timestamp).toLocaleDateString();
    const time = new Date(item.timestamp).toLocaleTimeString();
    const [translatedClass, setTranslatedClass] = useState(topPrediction.class);

    useEffect(() => {
        const translate = async () => {
            if (language === 'tl') {
                const translated = await translateText(topPrediction.class, 'tl');
                setTranslatedClass(translated);
            } else {
                setTranslatedClass(topPrediction.class);
            }
        };
        translate();
    }, [topPrediction.class, language]);

    return (
        <TouchableOpacity
            className={`rounded-2xl p-4 mb-4 shadow-sm border flex-row ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
            onPress={onPress}
        >
            <Image
                source={{ uri: item.imageUrl }}
                className={`w-20 h-20 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                resizeMode="cover"
            />
            <View className="flex-1 ml-4 justify-center">
                <Text className={`text-lg font-bold capitalize ${darkMode ? "text-white" : "text-gray-800"}`}>{translatedClass}</Text>
                <Text className={`font-bold text-sm mb-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    {(topPrediction.confidence * 100).toFixed(1)}% {t.confidence}
                </Text>
                <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{date} • {time}</Text>
            </View>
            <View className="justify-center">
                <Ionicons name="chevron-forward" size={20} color={darkMode ? "#9ca3af" : "#9ca3af"} />
            </View>
        </TouchableOpacity>
    );
};
