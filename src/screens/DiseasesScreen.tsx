import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { diseases } from '../data/diseases';
import { ProfileAvatarButton } from '../components/ProfileAvatarButton';
import { DiseaseCard } from '../components/DiseaseCard';
import { useSettings } from '../context/SettingsContext';

export const DiseasesScreen = () => {
    const navigation = useNavigation<any>();
    const { darkMode, translations: t } = useSettings();
    const [selectedCrop, setSelectedCrop] = useState<'rice' | 'mango' | 'soil' | 'corn'>('rice');

    const filteredDiseases = diseases.filter(d => d.crop === selectedCrop);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-center mb-2 relative">
                <View className="absolute left-6 z-10">
                    <ProfileAvatarButton />
                </View>
                <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{t.ricePlantDiseases}</Text>
            </View>

            {/* Filter Tabs */}
            <View className="px-6 mb-4">
                <View className="flex-row bg-gray-100 rounded-lg p-1" style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}>
                    <TouchableOpacity
                        onPress={() => setSelectedCrop('rice')}
                        className={`flex-1 py-2 rounded-md items-center justify-center ${selectedCrop === 'rice' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`font-semibold ${selectedCrop === 'rice' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Rice Plant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedCrop('mango')}
                        className={`flex-1 py-2 rounded-md items-center justify-center ${selectedCrop === 'mango' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`font-semibold ${selectedCrop === 'mango' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Mango</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedCrop('corn')}
                        className={`flex-1 py-2 rounded-md items-center justify-center ${selectedCrop === 'corn' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`font-semibold ${selectedCrop === 'corn' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Corn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedCrop('soil')}
                        className={`flex-1 py-2 rounded-md items-center justify-center ${selectedCrop === 'soil' ? (darkMode ? 'bg-gray-600' : 'bg-white shadow-sm') : ''}`}
                    >
                        <Text className={`font-semibold ${selectedCrop === 'soil' ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-500'}`}>Soil</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                {filteredDiseases.map((disease) => (
                    <DiseaseCard
                        key={disease.id}
                        disease={disease}
                        darkMode={darkMode}
                        onPress={() => navigation.navigate('DiseaseDetail', { disease })}
                    />
                ))}
                {filteredDiseases.length === 0 && (
                    <Text className={`text-center mt-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No diseases found.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
