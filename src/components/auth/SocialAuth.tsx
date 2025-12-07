import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialAuthProps {
    handleGoogleAuth: () => void;
    darkMode: boolean;
}

export const SocialAuth = ({ handleGoogleAuth, darkMode }: SocialAuthProps) => {
    return (
        <View className="items-center">
            <View className="flex-row items-center my-6 w-full">
                <View className={`flex-1 h-[1px] ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                <Text className={`mx-4 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Or social login</Text>
                <View className={`flex-1 h-[1px] ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            </View>

            <TouchableOpacity
                className={`w-12 h-12 rounded-full items-center justify-center border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                onPress={handleGoogleAuth}
            >
                <Ionicons name="logo-google" size={20} color="#ea4335" />
            </TouchableOpacity>
        </View>
    );
};
