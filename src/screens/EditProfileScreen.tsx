import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Removed
// import { storage } from '../config/firebase'; // Removed
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// Components
import { AvatarUploader } from '../components/profile/AvatarUploader';
import { ProfileForm } from '../components/profile/ProfileForm';

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const convertAvatarToBase64 = async (uri: string): Promise<string> => {
        try {
            const manipResult = await manipulateAsync(
                uri,
                [{ resize: { width: 300, height: 300 } }], // Resize for avatar usage
                { compress: 0.5, format: SaveFormat.JPEG, base64: true }
            );
            return `data:image/jpeg;base64,${manipResult.base64}`;
        } catch (error) {
            console.error("Error converting avatar to base64:", error);
            throw error;
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let avatar = userData?.avatar;

            if (image) {
                avatar = await convertAvatarToBase64(image);
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
                <AvatarUploader
                    image={image}
                    currentAvatar={userData?.avatar}
                    name={name}
                    onPickImage={pickImage}
                    darkMode={darkMode}
                />

                <ProfileForm
                    name={name}
                    setName={setName}
                    username={username}
                    darkMode={darkMode}
                />

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
