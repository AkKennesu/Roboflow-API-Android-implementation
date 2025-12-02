import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

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

interface AirQualityData {
    us_aqi: number;
}

export const WeatherScreen = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [aqi, setAqi] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string>('Your Location');

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

            // Fetch Weather (Updated API call for more metrics)
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
            setError('Failed to fetch weather data');
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                color: 'bg-red-100',
                textColor: 'text-red-700',
                icon: 'warning'
            };
        }
        if (relative_humidity_2m > 85 && temperature_2m > 28) {
            return {
                risk: 'High Risk: Sheath Blight',
                advice: 'Hot and humid conditions favor Sheath Blight. Monitor lower leaf sheaths and improve air circulation.',
                color: 'bg-orange-100',
                textColor: 'text-orange-700',
                icon: 'thermometer'
            };
        }
        if (relative_humidity_2m > 90 && temperature_2m < 26) {
            return {
                risk: 'Moderate Risk: Rice Blast',
                advice: 'Cool and humid weather favors Blast. Check for leaf lesions and avoid water stress.',
                color: 'bg-yellow-100',
                textColor: 'text-yellow-700',
                icon: 'water'
            };
        }
        return {
            risk: 'Low Disease Risk',
            advice: 'Current conditions are favorable for crop growth. Good time for routine maintenance.',
            color: 'bg-green-100',
            textColor: 'text-green-700',
            icon: 'checkmark-circle'
        };
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1 }} className="bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#006FEE" />
                <Text className="text-gray-500 mt-2">Analyzing weather conditions...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1 }} className="bg-gray-50 items-center justify-center p-5">
                <Ionicons name="alert-circle" size={50} color="#f31260" />
                <Text className="text-red-500 text-lg text-center mt-2">{error}</Text>
                <Text className="text-blue-500 mt-4" onPress={fetchData}>Tap to Retry</Text>
            </SafeAreaView>
        );
    }

    const advice = weather ? getDiseaseAdvice(weather) : null;

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            <ScrollView
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View className="items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">{locationName}</Text>
                    <Text className="text-gray-500">{new Date().toDateString()}</Text>
                </View>

                {weather && (
                    <>
                        {/* Hero Section */}
                        <View className="items-center mb-8">
                            <Ionicons name={getWeatherIcon(weather.current.weather_code) as any} size={100} color="#f59e0b" />
                            <Text className="text-7xl font-bold text-gray-800 mt-2">
                                {Math.round(weather.current.temperature_2m)}°
                            </Text>
                            <Text className="text-gray-500 text-lg">
                                Feels like {Math.round(weather.current.apparent_temperature)}°
                            </Text>
                            <View className="bg-blue-100 px-4 py-1 rounded-full mt-3">
                                <Text className="text-blue-700 font-medium">
                                    {weather.current.weather_code <= 3 ? 'Clear Sky' :
                                        weather.current.weather_code <= 48 ? 'Cloudy' :
                                            weather.current.weather_code <= 67 ? 'Rainy' : 'Stormy'}
                                </Text>
                            </View>
                        </View>

                        {/* AI Disease Adviser */}
                        {advice && (
                            <View className={`p-5 rounded-2xl mb-6 border border-gray-100 shadow-sm ${advice.color}`}>
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name={advice.icon as any} size={24} className={advice.textColor} />
                                    <Text className={`font-bold text-lg ml-2 ${advice.textColor}`}>AI Disease Adviser</Text>
                                </View>
                                <Text className={`font-bold text-base mb-1 ${advice.textColor}`}>{advice.risk}</Text>
                                <Text className="text-gray-700 leading-5">{advice.advice}</Text>
                            </View>
                        )}

                        {/* Detailed Grid */}
                        <Text className="text-xl font-bold text-gray-800 mb-4">Current Conditions</Text>
                        <View className="flex-row flex-wrap justify-between gap-3 mb-8">
                            <WeatherCard icon="water-outline" title="Humidity" value={`${weather.current.relative_humidity_2m}%`} color="text-blue-500" />
                            <WeatherCard icon="eye-outline" title="Visibility" value={`${(weather.current.visibility / 1000).toFixed(1)} km`} color="text-gray-500" />
                            <WeatherCard icon="speedometer-outline" title="Pressure" value={`${weather.current.surface_pressure} hPa`} color="text-purple-500" />
                            <WeatherCard icon="cloud-outline" title="Clouds" value={`${weather.current.cloud_cover}%`} color="text-gray-500" />
                            <WeatherCard icon="flag-outline" title="Wind" value={`${weather.current.wind_speed_10m} km/h`} color="text-teal-500" />
                            <WeatherCard icon="leaf-outline" title="Air Quality" value={aqi ? `${aqi} AQI` : '--'} color="text-green-500" />
                        </View>

                        {/* 7-Day Forecast */}
                        <Text className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</Text>
                        {weather.daily.time.map((time, index) => (
                            <View key={index} className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-2 border border-gray-100 shadow-sm">
                                <Text className="text-gray-600 font-medium w-24">
                                    {new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </Text>
                                <View className="flex-row items-center gap-4">
                                    <Text className="text-gray-800 font-bold">
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

const WeatherCard = ({ icon, title, value, color }: { icon: any, title: string, value: string, color: string }) => (
    <View className="w-[31%] bg-white p-3 rounded-xl items-center border border-gray-100 shadow-sm">
        <Ionicons name={icon} size={24} className={color} />
        <Text className="text-gray-400 text-xs mt-1 mb-1">{title}</Text>
        <Text className="text-gray-800 font-bold text-sm">{value}</Text>
    </View>
);
