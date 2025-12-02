import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import { useSettings } from '../context/SettingsContext';

export const VerificationScreen = () => {
    const { user, reloadUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const { darkMode } = useSettings();

    const handleCheckVerification = async () => {
        setLoading(true);
        try {
            await reloadUser();
            if (user?.emailVerified) {
                // AppNavigator will automatically switch to Home
            } else {
                alert('Email not verified yet. Please check your inbox (and spam folder).');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#ffffff' }} className="items-center justify-center p-6">
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                <Ionicons name="mail-open-outline" size={48} color={darkMode ? "#4ade80" : "#22c55e"} />
            </View>

            <Text className={`text-2xl font-bold text-center mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Verify your Email
            </Text>

            <Text className={`text-center mb-8 text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                We sent a verification link to:
                {'\n'}
                <Text className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{user?.email}</Text>
            </Text>

            <Text className={`text-center mb-8 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Please check your inbox and click the link to activate your account.
            </Text>

            <TouchableOpacity
                className={`w-full py-4 rounded-2xl shadow-lg items-center mb-4 ${darkMode ? "bg-green-600 shadow-green-900/20" : "bg-green-500 shadow-green-200"}`}
                onPress={handleCheckVerification}
                disabled={loading}
            >
                <Text className="text-white font-bold text-lg">
                    {loading ? 'Checking...' : "I've Verified My Email"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="py-4"
                onPress={logout}
            >
                <Text className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sign Out / Change Email</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
