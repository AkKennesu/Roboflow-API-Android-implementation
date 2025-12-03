import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerificationMessageProps {
    email: string | undefined;
    darkMode: boolean;
}

export const VerificationMessage = ({ email, darkMode }: VerificationMessageProps) => {
    return (
        <>
            <View className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                <Ionicons name="mail-open-outline" size={48} color={darkMode ? "#4ade80" : "#22c55e"} />
            </View>

            <Text className={`text-2xl font-bold text-center mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Verify your Email
            </Text>

            <Text className={`text-center mb-8 text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                We sent a verification link to:
                {'\n'}
                <Text className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{email}</Text>
            </Text>

            <Text className={`text-center mb-8 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Please check your inbox and click the link to activate your account.
            </Text>
        </>
    );
};
