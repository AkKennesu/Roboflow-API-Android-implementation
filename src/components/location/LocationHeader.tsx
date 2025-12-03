import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileAvatarButton } from '../ProfileAvatarButton';

interface LocationHeaderProps {
    darkMode: boolean;
    onOpenNotes: () => void;
}

export const LocationHeader = ({ darkMode, onOpenNotes }: LocationHeaderProps) => {
    return (
        <View className="px-6 py-4 flex-row items-center justify-center mb-2 relative">
            <View className="absolute left-6 z-10">
                <ProfileAvatarButton />
            </View>
            <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>My Location</Text>

            <View className="absolute right-6 z-10">
                <TouchableOpacity
                    onPress={onOpenNotes}
                    className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                    <Ionicons name="list" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
