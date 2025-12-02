import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Disease } from '../data/diseases';

export const DiseaseDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { disease } = route.params as { disease: Disease };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            {/* Header with Back Button */}
            <View className="absolute top-12 left-5 z-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-white p-2 rounded-full shadow-sm"
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Hero Image Placeholder */}
                <View className="w-full h-72 bg-gray-300">
                    {/* Image would go here */}
                    <Image
                        source={{ uri: 'https://placehold.co/600x400/png' }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>

                {/* Content Container */}
                <View className="-mt-10 bg-white rounded-t-3xl px-6 pt-8 pb-6 shadow-lg min-h-screen">

                    {/* Title Section */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-800">{disease.name}</Text>
                        <Text className="text-gray-500 italic text-lg mt-1">{disease.scientificName}</Text>

                        <View className="flex-row mt-4 gap-3">
                            <View className="bg-blue-100 px-3 py-1 rounded-full flex-row items-center">
                                <Ionicons name="flask-outline" size={14} color="#3b82f6" />
                                <Text className="text-blue-600 text-xs font-bold ml-1 uppercase">{disease.type}</Text>
                            </View>
                            <View className="bg-orange-100 px-3 py-1 rounded-full flex-row items-center">
                                <Ionicons name="warning-outline" size={14} color="#f97316" />
                                <Text className="text-orange-600 text-xs font-bold ml-1 uppercase">{disease.severity} Severity</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <Text className="text-gray-600 leading-6 mb-8 text-base">
                        {disease.description}
                    </Text>

                    {/* Symptoms Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-orange-100 p-2 rounded-lg mr-3">
                                <Ionicons name="bug-outline" size={24} color="#f97316" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Symptoms</Text>
                        </View>
                        <View className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            {disease.symptoms.map((symptom, index) => (
                                <View key={index} className="flex-row mb-3 items-start">
                                    <View className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3" />
                                    <Text className="text-gray-600 flex-1 leading-5">{symptom}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Causes Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-yellow-100 p-2 rounded-lg mr-3">
                                <Ionicons name="help-circle-outline" size={24} color="#eab308" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Causes</Text>
                        </View>
                        <View className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            {disease.causes.map((cause, index) => (
                                <View key={index} className="flex-row mb-3 items-start">
                                    <View className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3" />
                                    <Text className="text-gray-600 flex-1 leading-5">{cause}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Treatment Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-red-100 p-2 rounded-lg mr-3">
                                <Ionicons name="medkit-outline" size={24} color="#ef4444" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Treatment</Text>
                        </View>
                        <View className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            {disease.treatment.map((item, index) => (
                                <View key={index} className="flex-row mb-3 items-start">
                                    <View className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3" />
                                    <Text className="text-gray-600 flex-1 leading-5">{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Prevention Section */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-green-100 p-2 rounded-lg mr-3">
                                <Ionicons name="shield-checkmark-outline" size={24} color="#22c55e" />
                            </View>
                            <Text className="text-xl font-bold text-gray-800">Prevention</Text>
                        </View>
                        <View className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            {disease.prevention.map((item, index) => (
                                <View key={index} className="flex-row mb-3 items-start">
                                    <View className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3" />
                                    <Text className="text-gray-600 flex-1 leading-5">{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Early Detection Tip */}
                    <View className="bg-orange-50 p-5 rounded-2xl border border-orange-100 mb-8">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="bulb-outline" size={24} color="#f97316" />
                            <Text className="text-orange-600 font-bold text-lg ml-2">Early Detection is Crucial</Text>
                        </View>
                        <Text className="text-gray-600 leading-5">
                            {disease.earlyDetection}
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
