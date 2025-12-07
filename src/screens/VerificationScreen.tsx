import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const VerificationScreen = () => {
    const { user, verifyEmailWithOtp, resendOtp, logout } = useAuth();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const { darkMode } = useSettings();

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleVerify = async () => {
        if (!otp || otp.trim().length === 0) {
            Alert.alert('Error', 'Please enter the verification code.');
            return;
        }

        setLoading(true);
        try {
            await verifyEmailWithOtp(otp.trim());
            // Context handles the state update which triggers navigation
        } catch (error: any) {
            Alert.alert('Verification Failed', error.message || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            await resendOtp();
            setResendTimer(15);
            Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to resend code. Please try again later.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#ffffff' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                    <View className={`w-full p-6 rounded-3xl ${darkMode ? "bg-gray-800" : "bg-white shadow-xl shadow-gray-200"}`}>
                        <View className="items-center mb-6">
                            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                <Ionicons name="shield-checkmark-outline" size={40} color={darkMode ? "#4ade80" : "#22c55e"} />
                            </View>
                            <Text className={`text-2xl font-bold text-center mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                                Enter Verification Code
                            </Text>
                            <Text className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                We've sent a code to:
                            </Text>
                            <Text className={`text-center font-semibold mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                {user?.email}
                            </Text>
                        </View>

                        <View className="mb-6">
                            <TextInput
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="Enter code"
                                placeholderTextColor={darkMode ? "#6b7280" : "#9ca3af"}
                                className={`w-full px-4 py-3 rounded-xl border text-center text-lg tracking-widest font-bold ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity
                            className={`w-full py-3.5 rounded-xl shadow-sm items-center mb-3 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}
                            onPress={handleVerify}
                            disabled={loading}
                        >
                            <Text className={`font-bold text-base ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full py-3 items-center mb-6"
                            onPress={handleResend}
                            disabled={resendTimer > 0}
                        >
                            <Text className={`font-semibold ${darkMode ? (resendTimer > 0 ? "text-gray-500" : "text-blue-400") : (resendTimer > 0 ? "text-gray-400" : "text-blue-600")}`}>
                                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend Code"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`w-full py-3 rounded-xl border items-center ${darkMode ? "border-red-900/50" : "border-red-100"}`}
                            onPress={logout}
                        >
                            <Text className={`font-bold ${darkMode ? "text-red-400" : "text-red-500"}`}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
