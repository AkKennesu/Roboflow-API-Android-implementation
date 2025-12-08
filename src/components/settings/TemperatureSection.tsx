import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TemperatureSectionProps {
    temperatureUnit: 'celsius' | 'fahrenheit';
    setTemperatureUnit: (value: 'celsius' | 'fahrenheit') => void;
    darkMode: boolean;
}

export const TemperatureSection = ({ temperatureUnit, setTemperatureUnit, darkMode }: TemperatureSectionProps) => {
    return (
        <View className="mb-8">
            <Text className={`font-bold mb-3 ml-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Temperature Unit</Text>
            <View className={`p-4 rounded-2xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className={`p-3 rounded-xl mr-3 ${darkMode ? "bg-orange-900/30" : "bg-orange-100"}`}>
                            <Ionicons name="thermometer-outline" size={24} color={darkMode ? "#fb923c" : "#f97316"} />
                        </View>
                        <View>
                            <Text className={`font-semibold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>
                                Enable Fahrenheit (°F)
                            </Text>
                            <Text className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Switch from Celsius (°C)
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={temperatureUnit === 'fahrenheit'}
                        onValueChange={(value) => setTemperatureUnit(value ? 'fahrenheit' : 'celsius')}
                        trackColor={{ false: darkMode ? '#374151' : '#e5e7eb', true: '#f97316' }}
                        thumbColor={'#ffffff'}
                    />
                </View>
            </View>
        </View>
    );
};
