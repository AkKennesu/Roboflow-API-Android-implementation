import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Components
import { VerificationAction } from '../components/auth/VerificationAction';

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
            <View className={`w-full max-w-sm p-6 rounded-3xl ${darkMode ? "bg-gray-800" : "bg-white shadow-xl shadow-gray-200"}`}>
                <View className="items-center mb-6">
                    <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                        <Ionicons name="mail-open-outline" size={40} color={darkMode ? "#4ade80" : "#22c55e"} />
                    </View>
                    <Text className={`text-2xl font-bold text-center mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Verify Your Email
                    </Text>
                    <Text className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        We've sent a verification link to:
                    </Text>
                    <Text className={`text-center font-semibold mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                        {user?.email}
                    </Text>
                </View>

                <VerificationAction
                    loading={loading}
                    onCheckVerification={handleCheckVerification}
                    onLogout={logout}
                    darkMode={darkMode}
                />
            </View>


        </SafeAreaView>
    );
};
