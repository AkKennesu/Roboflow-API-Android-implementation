import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeatherHeroProps {
    weather: any;
    weatherDescription: string;
    darkMode: boolean;
    t: any;
}

export const WeatherHero = ({ weather, weatherDescription, darkMode, t }: WeatherHeroProps) => {
    const getWeatherIcon = (code: number) => {
        if (code <= 3) return 'sunny';
        if (code <= 48) return 'cloudy';
        if (code <= 67) return 'rainy';
        if (code <= 77) return 'snow';
        return 'thunderstorm';
    };

    return (
        <View className="items-center mb-8">
            <Ionicons name={getWeatherIcon(weather.current.weather_code) as any} size={100} color="#f59e0b" />
            <Text className={`text-7xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                {Math.round(weather.current.temperature_2m)}°
            </Text>
            <Text className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t.feelsLike} {Math.round(weather.current.apparent_temperature)}°
            </Text>
            <View className={`px-4 py-1 rounded-full mt-3 ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                <Text className={`font-medium ${darkMode ? "text-blue-400" : "text-blue-700"}`}>
                    {weatherDescription || '...'}
                </Text>
            </View>
        </View>
    );
};
