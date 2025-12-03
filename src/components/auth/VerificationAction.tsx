import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface VerificationActionProps {
    loading: boolean;
    onCheckVerification: () => void;
    onLogout: () => void;
    darkMode: boolean;
}

export const VerificationAction = ({ loading, onCheckVerification, onLogout, darkMode }: VerificationActionProps) => {
    return (
        <>
            <TouchableOpacity
                className={`w-full py-4 rounded-2xl shadow-lg items-center mb-4 ${darkMode ? "bg-green-600 shadow-green-900/20" : "bg-green-500 shadow-green-200"}`}
                onPress={onCheckVerification}
                disabled={loading}
            >
                <Text className="text-white font-bold text-lg">
                    {loading ? 'Checking...' : "I've Verified My Email"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="py-4"
                onPress={onLogout}
            >
                <Text className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sign Out / Change Email</Text>
            </TouchableOpacity>
        </>
    );
};
