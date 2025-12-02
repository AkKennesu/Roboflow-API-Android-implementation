import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, HistoryItem } from '../services/history';
import { Spinner } from 'heroui-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { translateText } from '../services/TranslationService';

type RootStackParamList = {
    HistoryDetail: { item: HistoryItem };
    [key: string]: any;
};

export const HistoryScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuth();
    const { darkMode, language, translations: t } = useSettings();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            const data = await getUserHistory(user.uid);
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    // Component to render individual history items with translation
    const HistoryItemCard = ({ item }: { item: HistoryItem }) => {
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
                onPress={() => navigation.navigate('HistoryDetail', { item })}
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.diseasesHistoryTitle}</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <Spinner size="lg" color="primary" />
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={({ item }) => <HistoryItemCard item={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkMode ? "#ffffff" : "#000000"} />
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20">
                            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                                <Ionicons name="time-outline" size={40} color="#9ca3af" />
                            </View>
                            <Text className={`text-lg font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.noHistory}</Text>
                            <Text className="text-gray-400 text-center mt-2 px-10">
                                {t.scanToSave}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};
