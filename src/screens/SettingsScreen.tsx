import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useSettings } from '../context/SettingsContext';

// Components
import { PhotoStorageSection } from '../components/settings/PhotoStorageSection';
import { ConfidenceSection } from '../components/settings/ConfidenceSection';
import { TipsSection } from '../components/settings/TipsSection';
import { TipModal } from '../components/settings/TipModal';
import { TemperatureSection } from '../components/settings/TemperatureSection';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const { confidenceThresholds, setConfidenceThreshold, autoSavePhotos, setAutoSavePhotos, darkMode, temperatureUnit, setTemperatureUnit } = useSettings();
    const [selectedTip, setSelectedTip] = useState<{ title: string; type: 'list' | 'text'; content: string | string[] } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const tipsData = {
        howToScan: {
            title: 'How to Scan',
            type: 'list' as const,
            content: [
                'Focus on the Leaf: Ensure the rice leaf is the main subject and is in sharp focus.',
                'Fill the Frame: Move closer so the leaf occupies most of the screen.',
                'Steady Hands: Hold the phone steady to avoid blur.',
                'One Leaf at a Time: For best results, scan one affected leaf at a time.'
            ]
        },
        photographyTips: {
            title: 'Photography Tips',
            type: 'list' as const,
            content: [
                'Good Lighting: Use natural daylight or bright indoor lighting. Avoid flash if possible to prevent glare.',
                'Plain Background: Try to isolate the leaf against a simple background (like your hand or the sky) to avoid confusion.',
                'Clean Lens: Wipe your camera lens before scanning.',
                'Avoid Shadows: Make sure your own shadow doesn\'t cover the leaf.'
            ]
        },
        appInfo: {
            title: 'About Leaf-Detective',
            type: 'text' as const,
            content: `Dear User,

Welcome to Leaf-Detective.

I am AkKennesu, the developer of this application. This project uses advanced AI to help you identify rice plant diseases quickly and accurately.

I hope this tool helps you protect your crops and improve your harvest.

Best regards,
AkKennesu`
        }
    };

    const openTip = (tip: { title: string; type: 'list' | 'text'; content: string | string[] }) => {
        setSelectedTip(tip);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>

                <PhotoStorageSection
                    autoSavePhotos={autoSavePhotos}
                    setAutoSavePhotos={setAutoSavePhotos}
                    darkMode={darkMode}
                />

                <ConfidenceSection
                    confidenceThresholds={confidenceThresholds}
                    setConfidenceThreshold={setConfidenceThreshold}
                    darkMode={darkMode}
                />

                <TemperatureSection
                    temperatureUnit={temperatureUnit}
                    setTemperatureUnit={setTemperatureUnit}
                    darkMode={darkMode}
                />

                <TipsSection
                    tipsData={tipsData}
                    openTip={openTip}
                    darkMode={darkMode}
                />

            </ScrollView>

            <TipModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                selectedTip={selectedTip}
                darkMode={darkMode}
            />
        </SafeAreaView>
    );
};
