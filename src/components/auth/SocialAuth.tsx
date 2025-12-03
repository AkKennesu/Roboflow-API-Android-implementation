import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialAuthProps {
    handleGoogleAuth: () => void;
    darkMode: boolean;
}

export const SocialAuth = ({ handleGoogleAuth, darkMode }: SocialAuthProps) => {
    return (
        <>
            <View className="flex-row items-center my-8">
                <View className={`flex-1 h-[1px] ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                <Text className={`mx-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Or continue with</Text>
                <View className={`flex-1 h-[1px] ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            </View>

            <TouchableOpacity
                className={`flex-row items-center justify-center border py-4 rounded-2xl gap-3 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                onPress={handleGoogleAuth}
            >
                <Ionicons name="logo-google" size={24} color="#ea4335" />
                <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-700"}`}>Google</Text>
            </TouchableOpacity>
        </>
    );
};
