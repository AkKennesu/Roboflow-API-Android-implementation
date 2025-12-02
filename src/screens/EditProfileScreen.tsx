import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

import { useSettings } from '../context/SettingsContext';

export const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { userData, updateUserData } = useAuth();
    const [name, setName] = useState(userData?.name || '');
    const [username, setUsername] = useState(userData?.username || '');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const { darkMode } = useSettings();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images' as any,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = `profile_pictures/${userData?.uid || 'unknown'}_${Date.now()}.jpg`;
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let avatar = userData?.avatar;

            if (image) {
                avatar = await uploadImage(image);
            }

            await updateUserData({ name, avatar });
            navigation.goBack();
        } catch (error) {
            console.error(error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Edit Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* Avatar Edit */}
                <View className="items-center mb-10">
                    <TouchableOpacity onPress={pickImage} className={`w-32 h-32 rounded-full items-center justify-center mb-4 shadow-lg border-4 relative overflow-hidden ${darkMode ? "bg-green-700 border-gray-800" : "bg-green-500 border-white"}`}>
                        {image || userData?.avatar ? (
                            <Image source={{ uri: image || userData?.avatar }} className="w-full h-full" />
                        ) : (
                            <Text className="text-white text-5xl font-bold">{name.charAt(0).toUpperCase() || 'U'}</Text>
                        )}
                        <View className={`absolute bottom-0 right-0 left-0 h-8 items-center justify-center bg-black/30`}>
                            <Ionicons name="camera" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Tap circle to change photo</Text>
                </View>

                {/* Form Fields */}
                <View className="gap-5">
                    <View>
                        <View className={`p-4 rounded-2xl border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                <Ionicons name="at" size={20} color={darkMode ? "#9ca3af" : "#6b7280"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Username</Text>
                                <TextInput
                                    value={username}
                                    editable={false}
                                    className={`font-semibold text-base p-0 mt-1 ${darkMode ? "text-gray-300" : "text-gray-800"}`}
                                />
                            </View>
                            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                        </View>
                    </View>

                    <View>
                        <View className={`p-4 rounded-2xl border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                                <Ionicons name="person-outline" size={20} color={darkMode ? "#4ade80" : "#22c55e"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Full Name</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    className={`font-semibold text-base p-0 mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    className={`py-4 rounded-2xl mt-10 shadow-lg items-center ${darkMode ? "bg-green-600 shadow-green-900/20" : "bg-green-500 shadow-green-200"}`}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Saving...' : 'Save Changes'}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};
