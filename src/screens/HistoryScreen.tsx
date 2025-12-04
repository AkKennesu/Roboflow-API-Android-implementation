import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, HistoryItem, deleteHistoryItem } from '../services/history';
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
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

    const handleDelete = async (itemId: string) => {
        Alert.alert(
            t.deleteTitle || "Delete Item",
            t.deleteConfirm || "Are you sure you want to delete this item?",
            [
                { text: t.cancel || "Cancel", style: "cancel" },
                {
                    text: t.delete || "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteHistoryItem(itemId);
                            setHistory(prev => prev.filter(item => item.id !== itemId));
                            if (isSelectionMode) {
                                setSelectedItems(prev => {
                                    const next = new Set(prev);
                                    next.delete(itemId);
                                    return next;
                                });
                            }
                        } catch (error) {
                            console.error("Failed to delete item:", error);
                            alert("Failed to delete item.");
                        }
                    }
                }
            ]
        );
    };

    const handleBatchDelete = async () => {
        if (selectedItems.size === 0) return;

        Alert.alert(
            t.deleteTitle || "Delete Items",
            `Are you sure you want to delete ${selectedItems.size} items?`,
            [
                { text: t.cancel || "Cancel", style: "cancel" },
                {
                    text: t.delete || "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const promises = Array.from(selectedItems).map(id => deleteHistoryItem(id));
                            await Promise.all(promises);

                            setHistory(prev => prev.filter(item => !selectedItems.has(item.id)));
                            setSelectedItems(new Set());
                            setIsSelectionMode(false);
                        } catch (error) {
                            console.error("Failed to batch delete:", error);
                            alert("Failed to delete some items.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedItems(new Set());
    };

    const toggleItemSelection = (itemId: string) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    };

    const handleItemPress = (item: HistoryItem) => {
        if (isSelectionMode) {
            toggleItemSelection(item.id);
        } else {
            navigation.navigate('HistoryDetail', { item });
        }
    };

    const handleItemLongPress = (item: HistoryItem) => {
        if (isSelectionMode) {
            toggleItemSelection(item.id);
        } else {
            // Enter selection mode and select this item
            setIsSelectionMode(true);
            const newSet = new Set<string>();
            newSet.add(item.id);
            setSelectedItems(newSet);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between mb-2 relative">
                <View className="flex-row items-center">
                    {!isSelectionMode && <ProfileAvatarButton />}
                    {isSelectionMode && (
                        <TouchableOpacity onPress={toggleSelectionMode}>
                            <Text className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {t.cancel || "Cancel"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text className={`text-xl font-bold absolute left-0 right-0 text-center -z-10 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {isSelectionMode ? `${selectedItems.size} Selected` : t.diseasesHistoryTitle}
                </Text>

                <TouchableOpacity
                    onPress={isSelectionMode ? handleBatchDelete : toggleSelectionMode}
                    disabled={isSelectionMode && selectedItems.size === 0}
                >
                    {isSelectionMode ? (
                        <Text className={`text-lg font-bold ${selectedItems.size > 0 ? "text-red-500" : "text-gray-400"
                            }`}>
                            {t.delete || "Delete"} {selectedItems.size > 0 ? `(${selectedItems.size})` : ""}
                        </Text>
                    ) : (
                        <View className={`p-2 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                            <Ionicons name="trash-outline" size={22} color={darkMode ? "#ef4444" : "#ef4444"} />
                        </View>
                    )}
                </TouchableOpacity>
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
                            onPress={() => handleItemPress(item)}
                            onLongPress={() => handleItemLongPress(item)}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedItems.has(item.id)}
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
