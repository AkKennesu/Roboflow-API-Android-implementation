import React, { useState } from 'react';
import { View, Image, Alert, Text, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions, MediaType } from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'heroui-native';

interface ImageSelectorProps {
    onImageSelected: (uri: string) => void;
    selectedImage: string | null;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected, selectedImage }) => {
    const [saveToGallery, setSaveToGallery] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images' as any,
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
            Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images' as any,
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
                    Alert.alert('Saved', 'Photo saved to gallery!');
                } catch (error) {
                    console.error('Error saving photo:', error);
                    Alert.alert('Error', 'Failed to save photo to gallery.');
                }
            }
        }
    };

    return (
        <View className="items-center justify-center w-full my-5">
            <View className="w-72 h-72 rounded-2xl overflow-hidden bg-default-100 mb-5 border border-default-200 justify-center items-center">
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} className="w-full h-full" />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Ionicons name="image-outline" size={60} className="text-default-400" />
                        <Text className="text-default-400 text-base mt-2">No Image Selected</Text>
                    </View>
                )}
            </View>

            <View className="flex-row items-center justify-between w-full px-4 mb-4">
                <Text className="text-default-600 font-medium">Save photo to gallery</Text>
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
                    <Text className="text-white font-medium">Gallery</Text>
                </Button>

                <Button
                    onPress={takePhoto}
                    className="flex-1 bg-green-500 flex-row items-center justify-center gap-2"
                >
                    <Ionicons name="camera" size={20} color="white" />
                    <Text className="text-white font-medium">Camera</Text>
                </Button>
            </View>
        </View>
    );
};
