import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthFormProps {
    isLogin: boolean;
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    loading: boolean;
    handleAuth: () => void;
    darkMode: boolean;
}

export const AuthForm = ({
    isLogin,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleAuth,
    darkMode
}: AuthFormProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="gap-4">
            {!isLogin && (
                <View className={`px-4 py-1.5 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-green-200"}`}>
                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                        value={name}
                        onChangeText={setName}
                        className={`text-sm ${darkMode ? "text-white" : "text-gray-800"}`}
                    />
                </View>
            )}

            <View className={`px-4 py-1.5 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-green-200"}`}>
                <TextInput
                    placeholder="Your Email"
                    placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`text-sm ${darkMode ? "text-white" : "text-gray-800"}`}
                />
            </View>

            <View className={`px-4 py-1.5 rounded-xl border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-green-200"}`}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className={`text-sm flex-1 ${darkMode ? "text-white" : "text-gray-800"}`}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={18} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className={`py-3.5 rounded-full shadow-lg items-center mt-2 ${darkMode ? "bg-green-600 shadow-green-900/20" : "bg-green-500 shadow-green-200"}`}
                onPress={handleAuth}
                disabled={loading}
            >
                <Text className="text-white font-bold text-sm">
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create account')}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
