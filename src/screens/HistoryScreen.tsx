import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, HistoryItem } from '../services/history';
import { Spinner } from 'heroui-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
import { ProfileAvatarButton } from '../components/ProfileAvatarButton';
import { HistoryItemCard } from '../components/history/HistoryItemCard';

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-center mb-2 relative">
                <View className="absolute left-6 z-10">
                    <ProfileAvatarButton />
                </View>
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.diseasesHistoryTitle}</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <Spinner size="lg" color="primary" />
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={({ item }) => (
                        <HistoryItemCard
                            item={item}
                            darkMode={darkMode}
                            language={language}
                            t={t}
                            onPress={() => navigation.navigate('HistoryDetail', { item })}
                        />
                    )}
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
