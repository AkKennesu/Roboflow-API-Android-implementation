import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhotoStorageSectionProps {
    autoSavePhotos: boolean;
    setAutoSavePhotos: (value: boolean) => void;
    darkMode: boolean;
}

export const PhotoStorageSection = ({ autoSavePhotos, setAutoSavePhotos, darkMode }: PhotoStorageSectionProps) => {
    return (
        <>
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
        </>
    );
};
