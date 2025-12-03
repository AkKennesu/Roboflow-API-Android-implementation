import React from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigation } from '@react-navigation/native';

export const ProfileAvatarButton = () => {
    const { user, userData } = useAuth();
    const { darkMode } = useSettings();
    const { openSidebar } = useSidebar();
    const navigation = useNavigation<any>();

    const handlePress = () => {
        if (user) {
            openSidebar();
        } else {
            navigation.navigate('Auth');
        }
    };

    return (
        <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center overflow-hidden shadow-sm ${darkMode ? "bg-green-900" : "bg-green-100"}`}
            onPress={handlePress}
        >
            {userData?.avatar ? (
                <Image source={{ uri: userData.avatar }} className="w-full h-full" />
            ) : (
                <Ionicons name="person" size={20} color={darkMode ? "#4ade80" : "#16a34a"} />
            )}
        </TouchableOpacity>
    );
};
