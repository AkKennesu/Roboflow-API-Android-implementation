import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { userData, updateUserData } = useAuth();
    const [name, setName] = useState(userData?.name || '');
    const [username, setUsername] = useState(userData?.username || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserData({ name });
            navigation.goBack();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-gray-50" edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-white p-2 rounded-full shadow-sm">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">Edit Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* Avatar Edit */}
                <View className="items-center mb-10">
                    <View className="w-32 h-32 bg-green-500 rounded-full items-center justify-center mb-4 shadow-lg border-4 border-white relative">
                        <Text className="text-white text-5xl font-bold">{name.charAt(0).toUpperCase() || 'U'}</Text>
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100">
                            <Ionicons name="camera" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-500 text-sm">Tap circle to change photo</Text>
                </View>

                {/* Form Fields */}
                <View className="gap-5">
                    <View>
                        <View className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center">
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="at" size={20} color="#6b7280" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 font-medium">Username</Text>
                                <TextInput
                                    value={username}
                                    editable={false}
                                    className="text-gray-800 font-semibold text-base p-0 mt-1"
                                />
                            </View>
                            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                        </View>
                    </View>

                    <View>
                        <View className="bg-white p-4 rounded-2xl border border-gray-200 flex-row items-center">
                            <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
                                <Ionicons name="person-outline" size={20} color="#22c55e" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 font-medium">Full Name</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    className="text-gray-800 font-semibold text-base p-0 mt-1"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    className="bg-green-500 py-4 rounded-2xl mt-10 shadow-lg shadow-green-200 items-center"
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Saving...' : 'Save Changes'}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};
