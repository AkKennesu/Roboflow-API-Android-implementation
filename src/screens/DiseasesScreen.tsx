import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { diseases } from '../data/diseases';
import { ProfileAvatarButton } from '../components/ProfileAvatarButton';
import { DiseaseCard } from '../components/DiseaseCard';
import { useSettings } from '../context/SettingsContext';

export const DiseasesScreen = () => {
    const navigation = useNavigation<any>();
    const { darkMode } = useSettings();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-center mb-2 relative">
                <View className="absolute left-6 z-10">
                    <ProfileAvatarButton />
                </View>
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Rice Plant Diseases</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {diseases.map((disease, index) => (
                    <DiseaseCard
                        key={index}
                        disease={disease}
                        darkMode={darkMode}
                        onPress={() => navigation.navigate('DiseaseDetail', { disease })}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
