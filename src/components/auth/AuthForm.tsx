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
                <View>
                    <Text className={`font-medium mb-2 ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</Text>
                    <View className={`p-4 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                        <TextInput
                            placeholder="Enter your full name"
                            placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                            value={name}
                            onChangeText={setName}
                            className={`text-base ${darkMode ? "text-white" : "text-gray-800"}`}
                        />
                    </View>
                </View>
            )}

            <View>
                <Text className={`font-medium mb-2 ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email Address</Text>
                <View className={`p-4 rounded-2xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className={`text-base ${darkMode ? "text-white" : "text-gray-800"}`}
                    />
                </View>
            </View>

            <View>
                <Text className={`font-medium mb-2 ml-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Password</Text>
                <View className={`p-4 rounded-2xl border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
                    <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={darkMode ? "#9ca3af" : "#9ca3af"}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        className={`text-base flex-1 ${darkMode ? "text-white" : "text-gray-800"}`}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
                    </TouchableOpacity>
                </View>
            </View>

            {isLogin && (
                <TouchableOpacity className="items-end">
                    <Text className={`font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>Forgot Password?</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                className={`py-4 rounded-2xl shadow-lg items-center mt-4 ${darkMode ? "bg-green-600 shadow-green-900/20" : "bg-green-500 shadow-green-200"}`}
                onPress={handleAuth}
                disabled={loading}
            >
                <Text className="text-white font-bold text-lg">
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
