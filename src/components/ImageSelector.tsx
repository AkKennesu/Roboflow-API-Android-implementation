import React, { useState } from 'react';
import { View, Image, Alert, Text, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'heroui-native';
import { useSettings } from '../context/SettingsContext';

interface ImageSelectorProps {
    onImageSelected: (uri: string) => void;
    selectedImage: string | null;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected, selectedImage }) => {
    const [saveToGallery, setSaveToGallery] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const { darkMode, translations: t } = useSettings();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            onImageSelected(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t.permissionDenied, t.permissionMessage);
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            onImageSelected(result.assets[0].uri);

            if (saveToGallery) {
                try {
                    if (permissionResponse?.status !== 'granted') {
                        const { status } = await requestPermission();
                        if (status !== 'granted') {
                            Alert.alert('Permission needed', 'Please grant permission to save photos to your gallery.');
                            return;
                        }
                    }
                    await MediaLibrary.createAssetAsync(result.assets[0].uri);
                    Alert.alert('Saved', t.savedToGallery);
                } catch (error) {
                    console.error('Error saving photo:', error);
                    Alert.alert('Error', t.errorSaving);
                }
            }
        }
    };

    return (
        <View className="items-center justify-center w-full my-5">
            <View className={`w-72 h-72 rounded-2xl overflow-hidden mb-5 border justify-center items-center ${darkMode ? "bg-gray-700 border-gray-600" : "bg-default-100 border-default-200"}`}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} className="w-full h-full" />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Ionicons name="image-outline" size={60} color={darkMode ? "#9ca3af" : "#a1a1aa"} />
                        <Text className={`text-base mt-2 ${darkMode ? "text-gray-400" : "text-default-400"}`}>{t.noImageSelected}</Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-center justify-between w-full px-4 mb-4">
                <Text className={`font-medium ${darkMode ? "text-white" : "text-default-600"}`}>{t.saveToGallery}</Text>
                <Switch
                    value={saveToGallery}
                    onValueChange={setSaveToGallery}
                    trackColor={{ false: '#767577', true: '#006FEE' }}
                    thumbColor={saveToGallery ? '#ffffff' : '#f4f3f4'}
                />
            </View>

            <View className="flex-row justify-around w-full gap-4">
                <Button
                    onPress={pickImage}
                    className="flex-1 bg-blue-500 flex-row items-center justify-center gap-2"
                >
                    <Ionicons name="images" size={20} color="white" />
                    <Text className="text-white font-medium">{t.gallery}</Text>
                </Button>

                <Button
                    onPress={takePhoto}
                    className="flex-1 bg-green-500 flex-row items-center justify-center gap-2"
                >
                    <Ionicons name="camera" size={20} color="white" />
                    <Text className="text-white font-medium">{t.camera}</Text>
                </Button>
            </View>
        </View>
    );
};
