import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeatherGridProps {
    weather: any;
    aqi: number | null;
    darkMode: boolean;
    t: any;
}

const WeatherCard = ({ icon, title, value, color, darkMode }: { icon: any, title: string, value: string, color: string, darkMode: boolean }) => (
    <View className={`w-[31%] p-3 rounded-xl items-center border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <Ionicons name={icon} size={24} className={color} />
        <Text className={`text-xs mt-1 mb-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{title}</Text>
        <Text className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>{value}</Text>
    </View>
);

export const WeatherGrid = ({ weather, aqi, darkMode, t }: WeatherGridProps) => {
    return (
        <>
            <Text className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.currentConditions}</Text>
            <View className="flex-row flex-wrap justify-between gap-3 mb-8">
                <WeatherCard darkMode={darkMode} icon="water-outline" title={t.humidity} value={`${weather.current.relative_humidity_2m}%`} color="text-blue-500" />
                <WeatherCard darkMode={darkMode} icon="eye-outline" title={t.visibility} value={`${(weather.current.visibility / 1000).toFixed(1)} km`} color="text-gray-500" />
                <WeatherCard darkMode={darkMode} icon="speedometer-outline" title={t.pressure} value={`${weather.current.surface_pressure} hPa`} color="text-purple-500" />
                <WeatherCard darkMode={darkMode} icon="cloud-outline" title={t.clouds} value={`${weather.current.cloud_cover}%`} color="text-gray-500" />
                <WeatherCard darkMode={darkMode} icon="flag-outline" title={t.wind} value={`${weather.current.wind_speed_10m} km/h`} color="text-teal-500" />
                <WeatherCard darkMode={darkMode} icon="leaf-outline" title={t.airQuality} value={aqi ? `${aqi} AQI` : '--'} color="text-green-500" />
            </View>
        </>
    );
};
