import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, HistoryItem } from '../services/history';
import { Spinner } from 'heroui-native';

export const HistoryScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
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

    const renderItem = ({ item }: { item: HistoryItem }) => {
        const topPrediction = item.predictions[0];
        const date = new Date(item.timestamp).toLocaleDateString();
        const time = new Date(item.timestamp).toLocaleTimeString();

        return (
            <TouchableOpacity
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex-row"
                onPress={() => navigation.navigate('HistoryDetail' as never, { item } as never)}
            >
                <Image
                    source={{ uri: item.imageUrl }}
                    className="w-20 h-20 rounded-xl bg-gray-200"
                    resizeMode="cover"
                />
                <View className="flex-1 ml-4 justify-center">
                    <Text className="text-lg font-bold text-gray-800 capitalize">{topPrediction.class}</Text>
                    <Text className="text-green-600 font-bold text-sm mb-1">
                        {(topPrediction.confidence * 100).toFixed(1)}% Confidence
                    </Text>
                    <Text className="text-gray-400 text-xs">{date} • {time}</Text>
                </View>
                <View className="justify-center">
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-2 rounded-full shadow-sm">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">Diseases History</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <Spinner size="lg" color="primary" />
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20">
                            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Ionicons name="time-outline" size={40} color="#9ca3af" />
                            </View>
                            <Text className="text-gray-500 text-lg font-bold">No history yet</Text>
                            <Text className="text-gray-400 text-center mt-2 px-10">
                                Scan your plants to detect diseases and save them here.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};
