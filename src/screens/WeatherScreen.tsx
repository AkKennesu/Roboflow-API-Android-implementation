import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { translateText } from '../services/TranslationService';

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        weather_code: number;
        cloud_cover: number;
        surface_pressure: number;
        wind_speed_10m: number;
        visibility: number;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        time: string[];
    };
}

export const WeatherScreen = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [aqi, setAqi] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string>('Your Location');

    // Translated states
    const [translatedAdvice, setTranslatedAdvice] = useState<{ risk: string, advice: string } | null>(null);
    const [weatherDescription, setWeatherDescription] = useState<string>('');

    const { darkMode, language, translations: t } = useSettings();
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                setLoading(false);
                setRefreshing(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Fetch Weather
            const weatherResponse = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,visibility&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
            );
            setWeather(weatherResponse.data);

            // Fetch Air Quality
            const aqiResponse = await axios.get(
                `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
            );
            setAqi(aqiResponse.data.current.us_aqi);

            // Reverse Geocoding
            let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (reverseGeocode.length > 0) {
                const { city, region } = reverseGeocode[0];
                setLocationName(`${city}, ${region}`);
            }
            setError(null);

        } catch (err) {
            setError(t.failedWeather);
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Effect to handle translations when weather or language changes
    useEffect(() => {
        const translateContent = async () => {
            if (!weather) return;

            // 1. Translate Weather Description
            let desc = 'Clear Sky';
            if (weather.current.weather_code > 3) desc = 'Cloudy';
            if (weather.current.weather_code > 48) desc = 'Rainy';
            if (weather.current.weather_code > 67) desc = 'Stormy';

            if (language === 'tl') {
                const translatedDesc = await translateText(desc, 'tl');
                setWeatherDescription(translatedDesc);
            } else {
                setWeatherDescription(desc);
            }

            // 2. Translate Advice
            const adviceData = getDiseaseAdvice(weather);
            if (language === 'tl') {
                const [risk, adv] = await Promise.all([
                    translateText(adviceData.risk, 'tl'),
                    translateText(adviceData.advice, 'tl')
                ]);
                setTranslatedAdvice({ risk, advice: adv });
            } else {
                setTranslatedAdvice({ risk: adviceData.risk, advice: adviceData.advice });
            }
        };

        translateContent();
    }, [weather, language]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getWeatherIcon = (code: number) => {
        if (code <= 3) return 'sunny';
        if (code <= 48) return 'cloudy';
        if (code <= 67) return 'rainy';
        if (code <= 77) return 'snow';
        return 'thunderstorm';
    };

    const getDiseaseAdvice = (w: WeatherData) => {
        const { relative_humidity_2m, temperature_2m, precipitation, wind_speed_10m } = w.current;

        if (precipitation > 5 && wind_speed_10m > 15) {
            return {
                risk: 'High Risk: Bacterial Leaf Blight',
                advice: 'Strong winds and rain favor bacterial spread. Avoid nitrogen application and ensure proper drainage.',
                color: darkMode ? 'bg-red-900/30' : 'bg-red-100',
                textColor: darkMode ? 'text-red-400' : 'text-red-700',
                icon: 'warning'
            };
        }
        if (relative_humidity_2m > 85 && temperature_2m > 28) {
            return {
                risk: 'High Risk: Sheath Blight',
                advice: 'Hot and humid conditions favor Sheath Blight. Monitor lower leaf sheaths and improve air circulation.',
                color: darkMode ? 'bg-orange-900/30' : 'bg-orange-100',
                textColor: darkMode ? 'text-orange-400' : 'text-orange-700',
                icon: 'thermometer'
            };
        }
        if (relative_humidity_2m > 90 && temperature_2m < 26) {
            return {
                risk: 'Moderate Risk: Rice Blast',
                advice: 'Cool and humid weather favors Blast. Check for leaf lesions and avoid water stress.',
                color: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100',
                textColor: darkMode ? 'text-yellow-400' : 'text-yellow-700',
                icon: 'water'
            };
        }
        return {
            risk: 'Low Disease Risk',
            advice: 'Current conditions are favorable for crop growth. Good time for routine maintenance.',
            color: darkMode ? 'bg-green-900/30' : 'bg-green-100',
            textColor: darkMode ? 'text-green-400' : 'text-green-700',
            icon: 'checkmark-circle'
        };
    };

    const adviceBase = weather ? getDiseaseAdvice(weather) : null;

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} className="items-center justify-center">
                <ActivityIndicator size="large" color="#006FEE" />
                <Text className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.analyzingWeather}</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} className="items-center justify-center p-5">
                <Ionicons name="alert-circle" size={50} color="#f31260" />
                <Text className="text-red-500 text-lg text-center mt-2">{error}</Text>
                <Text className="text-blue-500 mt-4" onPress={fetchData}>{t.retry}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.weatherTitle}</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkMode ? "#ffffff" : "#000000"} />}
            >
                <View className="items-center mb-6">
                    <Text className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{locationName}</Text>
                    <Text className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>{new Date().toDateString()}</Text>
                </View>

                {weather && (
                    <>
                        {/* Hero Section */}
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

                        {/* AI Disease Adviser */}
                        {adviceBase && (
                            <View className={`p-5 rounded-2xl mb-6 border shadow-sm ${adviceBase.color} ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name={adviceBase.icon as any} size={24} className={adviceBase.textColor} />
                                    <Text className={`font-bold text-lg ml-2 ${adviceBase.textColor}`}>{t.diseaseAdviser}</Text>
                                </View>
                                <Text className={`font-bold text-base mb-1 ${adviceBase.textColor}`}>
                                    {translatedAdvice?.risk || adviceBase.risk}
                                </Text>
                                <Text className={`leading-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    {translatedAdvice?.advice || adviceBase.advice}
                                </Text>
                            </View>
                        )}

                        {/* Detailed Grid */}
                        <Text className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.currentConditions}</Text>
                        <View className="flex-row flex-wrap justify-between gap-3 mb-8">
                            <WeatherCard darkMode={darkMode} icon="water-outline" title={t.humidity} value={`${weather.current.relative_humidity_2m}%`} color="text-blue-500" />
                            <WeatherCard darkMode={darkMode} icon="eye-outline" title={t.visibility} value={`${(weather.current.visibility / 1000).toFixed(1)} km`} color="text-gray-500" />
                            <WeatherCard darkMode={darkMode} icon="speedometer-outline" title={t.pressure} value={`${weather.current.surface_pressure} hPa`} color="text-purple-500" />
                            <WeatherCard darkMode={darkMode} icon="cloud-outline" title={t.clouds} value={`${weather.current.cloud_cover}%`} color="text-gray-500" />
                            <WeatherCard darkMode={darkMode} icon="flag-outline" title={t.wind} value={`${weather.current.wind_speed_10m} km/h`} color="text-teal-500" />
                            <WeatherCard darkMode={darkMode} icon="leaf-outline" title={t.airQuality} value={aqi ? `${aqi} AQI` : '--'} color="text-green-500" />
                        </View>

                        {/* 7-Day Forecast */}
                        <Text className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>{t.forecast}</Text>
                        {weather.daily.time.map((time, index) => (
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
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const WeatherCard = ({ icon, title, value, color, darkMode }: { icon: any, title: string, value: string, color: string, darkMode: boolean }) => (
    <View className={`w-[31%] p-3 rounded-xl items-center border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <Ionicons name={icon} size={24} className={color} />
        <Text className={`text-xs mt-1 mb-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{title}</Text>
        <Text className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>{value}</Text>
    </View>
);
