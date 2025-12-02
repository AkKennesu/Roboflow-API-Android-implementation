import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import { useSettings } from '../context/SettingsContext';

export const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { userData, logout } = useAuth();
    const { darkMode } = useSettings();

    const handleLogout = async () => {
        await logout();
        navigation.replace('Auth');
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', screen: 'EditProfile', color: darkMode ? 'bg-green-900/30' : 'bg-green-50', iconColor: darkMode ? '#4ade80' : '#22c55e' },
        { icon: 'globe-outline', label: 'Language', screen: null, color: darkMode ? 'bg-purple-900/30' : 'bg-purple-50', iconColor: darkMode ? '#c084fc' : '#a855f7' },
        { icon: 'settings-outline', label: 'Settings', screen: 'Settings', color: darkMode ? 'bg-blue-900/30' : 'bg-blue-50', iconColor: darkMode ? '#60a5fa' : '#3b82f6' },
        { icon: 'log-out-outline', label: 'Logout', screen: 'Logout', color: darkMode ? 'bg-red-900/30' : 'bg-red-50', iconColor: darkMode ? '#f87171' : '#ef4444', action: handleLogout },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                {/* Avatar Section */}
                <View className="items-center mb-8">
                    <View className={`w-28 h-28 rounded-full items-center justify-center mb-4 shadow-lg border-4 overflow-hidden ${darkMode ? "bg-green-700 border-gray-800" : "bg-green-500 border-white"}`}>
                        {userData?.avatar ? (
                            <Image source={{ uri: userData.avatar }} className="w-full h-full" />
                        ) : (
                            <Text className="text-white text-4xl font-bold">{userData?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                        )}
                    </View>
                    <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{userData?.name || 'User'}</Text>
                    <Text className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{userData?.username || '@user'}</Text>
                </View>

                {/* Menu Items */}
                <View className="w-full gap-4">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`p-4 rounded-2xl flex-row items-center shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                            onPress={() => item.action ? item.action() : (item.screen ? navigation.navigate(item.screen) : null)}
                        >
                            <View className={`w-12 h-12 ${item.color} rounded-xl items-center justify-center mr-4`}>
                                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                            </View>
                            <Text className={`flex-1 text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color={darkMode ? "#9ca3af" : "#9ca3af"} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
