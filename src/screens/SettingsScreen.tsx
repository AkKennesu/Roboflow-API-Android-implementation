import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { useSettings } from '../context/SettingsContext';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const { confidenceThreshold, setConfidenceThreshold, autoSavePhotos, setAutoSavePhotos } = useSettings();

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-2 rounded-full shadow-sm">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>

                {/* Photo Storage Section */}
                <Text className="text-gray-500 font-bold mb-3 ml-1">Photo Storage</Text>
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center flex-1 mr-4">
                            <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                                <Ionicons name="save-outline" size={22} color="#22c55e" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-800 font-bold text-base">Auto-Save Photos</Text>
                                <Text className="text-gray-500 text-xs mt-1">Save captured photos to gallery automatically</Text>
                            </View>
                        </View>
                        <Switch
                            value={autoSavePhotos}
                            onValueChange={setAutoSavePhotos}
                            trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
                            thumbColor={autoSavePhotos ? '#22c55e' : '#f4f4f5'}
                        />
                    </View>

                    <View className="h-[1px] bg-gray-100 mb-4" />

                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
                                <Ionicons name="images-outline" size={22} color="#3b82f6" />
                            </View>
                            <View>
                                <Text className="text-gray-500 text-xs">Storage Used</Text>
                                <Text className="text-gray-800 font-bold text-base">10.44 MB</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-green-600 font-bold text-sm mb-1">4 photos</Text>
                            <TouchableOpacity>
                                <Text className="text-red-500 text-xs font-bold">Clear All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Confidence Threshold Section */}
                <Text className="text-gray-500 font-bold mb-3 ml-1">Confidence Threshold</Text>
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="bulb-outline" size={22} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-bold text-base">AI Detection Confidence</Text>
                            <Text className="text-gray-500 text-xs mt-1">Minimum confidence level for disease detection</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-gray-600 font-bold">Threshold: {Math.round(confidenceThreshold * 100)}%</Text>
                        <View className="bg-orange-100 px-3 py-1 rounded-full">
                            <Text className="text-orange-600 text-xs font-bold">Balanced</Text>
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

                    <View className="bg-blue-50 p-3 rounded-xl mt-4 flex-row items-start">
                        <Ionicons name="information-circle-outline" size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                        <Text className="text-blue-600 text-xs ml-2 flex-1 leading-4">
                            This affects AI disease detection accuracy. Higher = fewer but more accurate results.
                        </Text>
                    </View>
                </View>

                {/* Scan Tips Section */}
                <Text className="text-gray-500 font-bold mb-3 ml-1">Scan Tips</Text>
                <View className="gap-3 mb-6">
                    <TouchableOpacity className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm border border-gray-100">
                        <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="scan-outline" size={22} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-bold text-base">How to Scan</Text>
                            <Text className="text-gray-500 text-xs">Best practices for accurate results</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm border border-gray-100">
                        <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="bulb-outline" size={22} color="#22c55e" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-bold text-base">Photography Tips</Text>
                            <Text className="text-gray-500 text-xs">Get better scan quality</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <Text className="text-gray-500 font-bold mb-3 ml-1">App Info</Text>
                <View className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm border border-gray-100 mb-8">
                    <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                        <Ionicons name="information-circle-outline" size={22} color="#22c55e" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-800 font-bold text-base">About Agri-Scan</Text>
                        <Text className="text-gray-500 text-xs">Version 1.0.0</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};
