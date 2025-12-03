import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarUploaderProps {
    image: string | null;
    currentAvatar: string | undefined;
    name: string;
    onPickImage: () => void;
    darkMode: boolean;
}

export const AvatarUploader = ({ image, currentAvatar, name, onPickImage, darkMode }: AvatarUploaderProps) => {
    return (
        <View className="items-center mb-10">
            <TouchableOpacity onPress={onPickImage} className={`w-32 h-32 rounded-full items-center justify-center mb-4 shadow-lg border-4 relative overflow-hidden ${darkMode ? "bg-green-700 border-gray-800" : "bg-green-500 border-white"}`}>
                {image || currentAvatar ? (
                    <Image source={{ uri: image || currentAvatar }} className="w-full h-full" />
                ) : (
                    <Text className="text-white text-5xl font-bold">{name.charAt(0).toUpperCase() || 'U'}</Text>
                )}
                <View className={`absolute bottom-0 right-0 left-0 h-8 items-center justify-center bg-black/30`}>
                    <Ionicons name="camera" size={16} color="white" />
                </View>
            </TouchableOpacity>
            <Text className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tap circle to change photo</Text>
        </View>
    );
};
