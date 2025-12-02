import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { useSettings } from '../context/SettingsContext';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const { confidenceThreshold, setConfidenceThreshold, autoSavePhotos, setAutoSavePhotos, darkMode, setDarkMode } = useSettings();
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



                {/* Photo Storage Section */}
                <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Photo Storage</Text>
                <View className={`rounded-3xl p-5 mb-6 shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center flex-1 mr-4">
                            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                                <Ionicons name="save-outline" size={22} color="#22c55e" />
                            </View>
                            <View className="flex-1">
                                <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>Auto-Save Photos</Text>
                                <Text className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Save captured photos to gallery automatically</Text>
                            </View>
                        </View>
                        <Switch
                            value={autoSavePhotos}
                            onValueChange={setAutoSavePhotos}
                            trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
                            thumbColor={autoSavePhotos ? '#22c55e' : '#f4f4f5'}
                        />
                    </View>

                    <View className={`h-[1px] mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                                <Ionicons name="images-outline" size={22} color="#3b82f6" />
                            </View>
                            <View>
                                <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Storage Used</Text>
                                <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>10.44 MB</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className={`font-bold text-sm mb-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>4 photos</Text>
                            <TouchableOpacity>
                                <Text className="text-red-500 font-bold text-xs">Clear All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Confidence Threshold Section */}
                <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Confidence Threshold</Text>
                <View className={`rounded-3xl p-5 mb-6 shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    <View className="flex-row items-center mb-4">
                        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                            <Ionicons name="bulb-outline" size={22} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                            <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>AI Detection Confidence</Text>
                            <Text className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Minimum confidence level for disease detection</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mb-2">
                        <Text className={`font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Threshold: {Math.round(confidenceThreshold * 100)}%</Text>
                        <View className={`px-3 py-1 rounded-full ${darkMode ? "bg-orange-900/30" : "bg-orange-100"}`}>
                            <Text className={`text-xs font-bold ${darkMode ? "text-orange-400" : "text-orange-600"}`}>Balanced</Text>
                        </View>
                    </View>

                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={confidenceThreshold}
                        onValueChange={setConfidenceThreshold}
                        minimumTrackTintColor="#22c55e"
                        maximumTrackTintColor="#e5e7eb"
                        thumbTintColor="#22c55e"
                    />
                    <View className="flex-row justify-between px-1">
                        <Text className="text-gray-400 text-xs">0%</Text>
                        <Text className="text-gray-400 text-xs">100%</Text>
                    </View>

                    <View className={`p-3 rounded-xl mt-4 flex-row items-start ${darkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                        <Ionicons name="information-circle-outline" size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                        <Text className={`text-xs ml-2 flex-1 leading-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                            This affects AI disease detection accuracy. Higher = fewer but more accurate results.
                        </Text>
                    </View>
                </View>

                {/* Scan Tips Section */}
                <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Scan Tips</Text>
                <View className="gap-3 mb-6">
                    <TouchableOpacity
                        className={`p-4 rounded-2xl flex-row items-center shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                        onPress={() => openTip(tipsData.howToScan)}
                    >
                        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                            <Ionicons name="scan-outline" size={22} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                            <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>How to Scan</Text>
                            <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Best practices for accurate results</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`p-4 rounded-2xl flex-row items-center shadow-sm border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                        onPress={() => openTip(tipsData.photographyTips)}
                    >
                        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                            <Ionicons name="bulb-outline" size={22} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                            <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>Photography Tips</Text>
                            <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Get better scan quality</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>App Info</Text>
                <TouchableOpacity
                    className={`p-4 rounded-2xl flex-row items-center shadow-sm border mb-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                    onPress={() => openTip(tipsData.appInfo)}
                >
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <Ionicons name="information-circle-outline" size={22} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                        <Text className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>About Leaf-Detective</Text>
                        <Text className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Version 1.0.0</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>

            </ScrollView>

            {/* Tip Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 p-5">
                    <View className={`w-full max-w-sm rounded-3xl p-6 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                                {selectedTip?.title}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={darkMode ? "#9ca3af" : "#6b7280"} />
                            </TouchableOpacity>
                        </View>

                        <View className="gap-4">
                            {selectedTip?.type === 'list' ? (
                                (selectedTip.content as string[]).map((step, index) => (
                                    <View key={index} className="flex-row items-start">
                                        <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                            <Text className={`text-xs font-bold ${darkMode ? "text-green-400" : "text-green-700"}`}>{index + 1}</Text>
                                        </View>
                                        <Text className={`flex-1 text-base leading-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            {step}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text className={`text-base leading-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {selectedTip?.content as string}
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            className={`mt-6 py-3 rounded-xl items-center ${darkMode ? "bg-green-600" : "bg-green-500"}`}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-white font-bold">Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
