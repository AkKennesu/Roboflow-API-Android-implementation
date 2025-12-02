import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const getFriendlyErrorMessage = (error: any) => {
    const code = error.code;
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        return 'Invalid email or password. Please check your details or sign up if you don\'t have an account.';
    }
    if (code === 'auth/email-already-in-use') {
        return 'This email is already registered. Please sign in instead.';
    }
    if (code === 'auth/invalid-email') {
        return 'Please enter a valid email address.';
    }
    if (code === 'auth/weak-password') {
        return 'Password should be at least 6 characters.';
    }
    return error.message; // Fallback
};

export const AuthScreen = () => {
    const navigation = useNavigation<any>();
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password, name);
            }
            // Navigation is handled automatically
        } catch (error: any) {
            Alert.alert('Authentication Failed', getFriendlyErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (error: any) {
            if (error.message.includes('DEVELOPER_ERROR') || error.code === '10') {
                Alert.alert(
                    'Configuration Error',
                    "Google Sign In requires additional setup.\n\n1. Run 'eas credentials' to get SHA-1.\n2. Add it to Firebase Console.\n3. Download new google-services.json."
                );
            } else {
                Alert.alert('Google Sign In Failed', getFriendlyErrorMessage(error));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-white">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>

                    {/* Header */}
                    <View className="items-center mb-10">
                        <View className="w-20 h-20 bg-green-100 rounded-3xl items-center justify-center mb-4 rotate-3">
                            <Ionicons name="leaf" size={40} color="#22c55e" />
                        </View>
                        <Text className="text-3xl font-bold text-gray-800 text-center">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            {isLogin ? 'Sign in to continue your farming journey' : 'Join us and start detecting rice diseases'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="gap-4">
                        {!isLogin && (
                            <View>
                                <Text className="text-gray-700 font-medium mb-2 ml-1">Full Name</Text>
                                <View className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                                    <TextInput
                                        placeholder="Enter your full name"
                                        placeholderTextColor="#9ca3af"
                                        value={name}
                                        onChangeText={setName}
                                        className="text-gray-800 text-base"
                                    />
                                </View>
                            </View>
                        )}

                        <View>
                            <Text className="text-gray-700 font-medium mb-2 ml-1">Email Address</Text>
                            <View className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                                <TextInput
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9ca3af"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="text-gray-800 text-base"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-2 ml-1">Password</Text>
                            <View className="bg-gray-100 p-4 rounded-2xl border border-gray-200 flex-row items-center">
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9ca3af"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    className="text-gray-800 text-base flex-1"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isLogin && (
                            <TouchableOpacity className="items-end">
                                <Text className="text-green-600 font-bold">Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className="bg-green-500 py-4 rounded-2xl shadow-lg shadow-green-200 items-center mt-4"
                            onPress={handleAuth}
                            disabled={loading}
                        >
                            <Text className="text-white font-bold text-lg">
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-gray-200" />
                        <Text className="text-gray-400 mx-4">Or continue with</Text>
                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    {/* Social Auth */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white border border-gray-200 py-4 rounded-2xl gap-3"
                        onPress={handleGoogleAuth}
                    >
                        <Ionicons name="logo-google" size={24} color="#ea4335" />
                        <Text className="text-gray-700 font-bold text-base">Google</Text>
                    </TouchableOpacity>

                    {/* Toggle */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </Text>
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text className="text-green-600 font-bold">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
