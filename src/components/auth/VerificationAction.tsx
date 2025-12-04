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
                className={`w-full py-3 rounded-xl shadow-sm items-center ${darkMode ? "bg-green-600 shadow-green-900/20" : "bg-green-500 shadow-green-200"}`}
                onPress={onCheckVerification}
                disabled={loading}
            >
                <Text className="text-white font-bold text-base">
                    {loading ? 'Checking...' : "I've Verified My Email"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className={`w-full py-3 rounded-xl shadow-sm items-center mt-3 bg-red-500 shadow-red-200`}
                onPress={onLogout}
            >
                <Text className="text-white font-bold text-base">Sign Out</Text>
            </TouchableOpacity>
        </>
    );
};
