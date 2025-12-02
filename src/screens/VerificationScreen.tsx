import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export const VerificationScreen = () => {
    const { user, reloadUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);

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
        <SafeAreaView style={{ flex: 1 }} className="bg-white items-center justify-center p-6">
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8">
                <Ionicons name="mail-open-outline" size={48} color="#22c55e" />
            </View>

            <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
                Verify your Email
            </Text>

            <Text className="text-gray-500 text-center mb-8 text-base">
                We sent a verification link to:
                {'\n'}
                <Text className="font-bold text-gray-800">{user?.email}</Text>
            </Text>

            <Text className="text-gray-400 text-center mb-8 text-sm">
                Please check your inbox and click the link to activate your account.
            </Text>

            <TouchableOpacity
                className="bg-green-500 w-full py-4 rounded-2xl shadow-lg shadow-green-200 items-center mb-4"
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
                <Text className="text-gray-500 font-medium">Sign Out / Change Email</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};
