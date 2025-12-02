import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();

    const features = [
        {
            title: 'Rice Plant Diseases',
            subtitle: 'Dictionary',
            icon: 'book',
            screen: 'Diseases',
            color: 'bg-orange-400',
            iconColor: 'text-orange-400',
        },
        {
            title: 'Camera',
            subtitle: 'Scan',
            icon: 'camera',
            screen: 'Detection',
            color: 'bg-green-500',
            iconColor: 'text-green-500',
        },
        {
            title: 'Weather Info',
            subtitle: 'Check weather',
            icon: 'cloud-outline',
            screen: 'Weather',
            color: 'bg-blue-400',
            iconColor: 'text-blue-400',
        },
        {
            title: 'My Location',
            subtitle: 'View nearby scans',
            icon: 'location',
            screen: 'Location',
            color: 'bg-pink-500',
            iconColor: 'text-pink-500',
        },
        {
            title: 'Diseases History',
            subtitle: 'View past scans',
            icon: 'time',
            screen: 'History',
            color: 'bg-purple-500',
            iconColor: 'text-purple-500',
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            {/* Top Header */}
            <View className="flex-row justify-between items-center px-6 py-4">
                <View className="flex-row items-center gap-2">
                    <Ionicons name="home" size={28} color="#1f2937" />
                    <Text className="text-3xl font-bold text-gray-800">Home</Text>
                </View>
                <TouchableOpacity
                    className="w-10 h-10 bg-green-100 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate(user ? 'Profile' : 'Auth')}
                >
                    <Ionicons name="person" size={20} color="#22c55e" />
                </TouchableOpacity>
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
        </SafeAreaView>
    );
};
