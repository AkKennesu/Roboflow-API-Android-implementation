import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import { useSettings } from '../context/SettingsContext';
import { ProfileSidebar } from '../components/ProfileSidebar';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user, userData } = useAuth();
    const { darkMode, language, translations: t } = useSettings();



    const [isSidebarVisible, setSidebarVisible] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Top Header */}
            <View className="flex-row items-center justify-center px-6 py-4 relative">
                <TouchableOpacity
                    className={`absolute left-6 z-10 w-10 h-10 rounded-full items-center justify-center overflow-hidden ${darkMode ? "bg-green-900" : "bg-green-100"}`}
                    onPress={() => user ? setSidebarVisible(true) : navigation.navigate('Auth')}
                >
                    {userData?.avatar ? (
                        <Image source={{ uri: userData.avatar }} className="w-full h-full" />
                    ) : (
                        <Ionicons name="person" size={20} color={darkMode ? "#4ade80" : "#16a34a"} />
                    )}
                </TouchableOpacity>

                <View className="flex-row items-center gap-2">
                    <Ionicons name="home" size={28} color={darkMode ? "#ffffff" : "#1f2937"} />
                    <Text className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.home}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Grid */}
                {/* Content Placeholder */}
                <View className="flex-1 items-center justify-center mt-20">
                    <Ionicons name="home-outline" size={64} color={darkMode ? "#374151" : "#e5e7eb"} />
                    <Text className={`mt-4 text-lg ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {t.home}
                    </Text>
                </View>
            </ScrollView>

            <ProfileSidebar visible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
        </SafeAreaView>
    );
};
