import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { diseases } from '../data/diseases';

export const DiseasesScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-2xl font-bold text-gray-800 mb-5">Palay Diseases Library</Text>

                {diseases.map((disease, index) => (
                    <TouchableOpacity
                        key={index}
                        className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100 flex-row items-center"
                        onPress={() => navigation.navigate('DiseaseDetail', { disease })}
                    >
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${disease.type === 'Fungal' ? 'bg-blue-100' :
                                disease.type === 'Bacterial' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            <Ionicons
                                name={
                                    disease.type === 'Fungal' ? 'leaf' :
                                        disease.type === 'Bacterial' ? 'water' : 'bug'
                                }
                                size={24}
                                color={
                                    disease.type === 'Fungal' ? '#3b82f6' :
                                        disease.type === 'Bacterial' ? '#22c55e' : '#ef4444'
                                }
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800">{disease.name}</Text>
                            <Text className="text-gray-500 text-sm italic">{disease.scientificName}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
