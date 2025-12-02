import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { userData, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigation.replace('Auth');
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', screen: 'EditProfile', color: 'bg-green-50', iconColor: '#22c55e' },
        { icon: 'globe-outline', label: 'Language', screen: null, color: 'bg-purple-50', iconColor: '#a855f7' },
        { icon: 'settings-outline', label: 'Settings', screen: 'Settings', color: 'bg-blue-50', iconColor: '#3b82f6' },
        { icon: 'log-out-outline', label: 'Logout', screen: 'Logout', color: 'bg-red-50', iconColor: '#ef4444', action: handleLogout },
    ];

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-2 rounded-full shadow-sm">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                {/* Avatar Section */}
                <View className="items-center mb-8">
                    <View className="w-28 h-28 bg-green-500 rounded-full items-center justify-center mb-4 shadow-lg border-4 border-white">
                        <Text className="text-white text-4xl font-bold">{userData?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">{userData?.name || 'User'}</Text>
                    <Text className="text-gray-500 text-lg">{userData?.username || '@user'}</Text>
                </View>

                {/* Menu Items */}
                <View className="w-full gap-4">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm border border-gray-100"
                            onPress={() => item.action ? item.action() : (item.screen ? navigation.navigate(item.screen) : null)}
                        >
                            <View className={`w-12 h-12 ${item.color} rounded-xl items-center justify-center mr-4`}>
                                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                            </View>
                            <Text className="flex-1 text-lg font-medium text-gray-700">{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
