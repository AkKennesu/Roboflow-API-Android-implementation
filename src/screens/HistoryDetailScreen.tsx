import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResultDisplay } from '../components/ResultDisplay';
import { HistoryItem } from '../services/history';

import { useSettings } from '../context/SettingsContext';

export const HistoryDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params as { item: HistoryItem };
    const { darkMode, translations: t } = useSettings();

    const date = new Date(item.timestamp).toLocaleDateString();
    const time = new Date(item.timestamp).toLocaleTimeString();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.scanDetails}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Image */}
                <View className={`w-full h-64 rounded-3xl overflow-hidden mb-6 shadow-sm ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                    <Image
                        source={{ uri: item.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>

                {/* Date Info */}
                <View className="flex-row items-center justify-center mb-2">
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 ml-2">{t.scannedOn} {date} • {time}</Text>
                </View>

                {/* Result Display (Reused) */}
                <ResultDisplay
                    predictions={item.predictions}
                    loading={false}
                    error={null}
                    imageUri={item.imageUrl}
                    showSaveButton={false} // Hide save button since it's already saved
                />
            </ScrollView>
        </SafeAreaView>
    );
};
