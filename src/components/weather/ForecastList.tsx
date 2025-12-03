import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ForecastListProps {
    weather: any;
    darkMode: boolean;
    t: any;
}

export const ForecastList = ({ weather, darkMode, t }: ForecastListProps) => {
    return (
        <>
            <Text className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.forecast}</Text>
            {weather.daily.time.map((time: string, index: number) => (
                <View key={index} className={`flex-row justify-between items-center p-4 rounded-xl mb-2 border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    <Text className={`font-medium w-24 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <View className="flex-row items-center gap-4">
                        <Text className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {Math.round(weather.daily.temperature_2m_max[index])}°
                        </Text>
                        <Text className="text-gray-400">
                            {Math.round(weather.daily.temperature_2m_min[index])}°
                        </Text>
                    </View>
                    <View className="flex-row items-center w-16 justify-end">
                        <Ionicons name="water-outline" size={14} color="#3b82f6" />
                        <Text className="text-blue-500 text-xs ml-1">{weather.daily.precipitation_sum[index]}mm</Text>
                    </View>
                </View>
            ))}
        </>
    );
};
