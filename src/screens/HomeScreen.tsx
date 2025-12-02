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

    const features = [
        {
            title: t.ricePlantDiseases,
            subtitle: t.dictionary,
            icon: 'book',
            screen: 'Diseases',
            color: 'bg-orange-400',
            iconColor: 'text-orange-400',
        },
        {
            title: t.camera,
            subtitle: t.scan,
            icon: 'camera',
            screen: 'Detection',
            color: 'bg-green-500',
            iconColor: 'text-green-500',
        },
        {
            title: t.weatherInfo,
            subtitle: t.checkWeather,
            icon: 'cloud-outline',
            screen: 'Weather',
            color: 'bg-blue-400',
            iconColor: 'text-blue-400',
        },
        {
            title: t.myLocation,
            subtitle: t.viewNearbyScans,
            icon: 'location',
            screen: 'Location',
            color: 'bg-pink-500',
            iconColor: 'text-pink-500',
        },
        {
            title: t.diseasesHistory,
            subtitle: t.viewPastScans,
            icon: 'time',
            screen: 'History',
            color: 'bg-purple-500',
            iconColor: 'text-purple-500',
        },
    ];

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
                <View className="flex-row flex-wrap justify-between gap-4">
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`w-[47%] aspect-square rounded-3xl ${feature.color} p-5 justify-between shadow-lg`}
                            onPress={() => navigation.navigate(feature.screen)}
                        >
                            <View className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center backdrop-blur-md">
                                <View className="bg-white w-10 h-10 rounded-xl items-center justify-center">
                                    <Ionicons name={feature.icon as any} size={24} className={feature.iconColor} />
                                </View>
                            </View>
                            <View>
                                <Text className="text-white text-lg font-bold leading-tight">{feature.title}</Text>
                                <Text className="text-white/80 text-xs mt-1">{feature.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <ProfileSidebar visible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
        </SafeAreaView>
    );
};
