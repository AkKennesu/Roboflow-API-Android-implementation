import React from 'react';
import { View, Image } from 'react-native';

interface DiseaseHeroProps {
    darkMode: boolean;
    imageUrl?: string;
}

export const DiseaseHero = ({ darkMode, imageUrl }: DiseaseHeroProps) => {
    return (
        <View className={`w-full h-72 ${darkMode ? "bg-gray-800" : "bg-gray-300"}`}>
            <Image
                source={{ uri: imageUrl || 'https://placehold.co/600x400/png' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
            />
        </View>
    );
};
