import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';

// Components
import { AuthForm } from '../components/auth/AuthForm';
import { SocialAuth } from '../components/auth/SocialAuth';

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
    const { darkMode } = useSettings();

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
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#ffffff' }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    {/* Header */}
                    <View className="items-center mb-6">
                        <View className={`w-20 h-20 rounded-3xl items-center justify-center mb-4 rotate-3 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                            <Ionicons name="leaf" size={40} color={darkMode ? "#4ade80" : "#22c55e"} />
                        </View>
                        <Text className={`text-3xl font-bold text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </Text>
                        <Text className={`text-center mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {isLogin ? 'Sign in to continue your farming journey' : 'Join us and start detecting rice diseases'}
                        </Text>
                    </View>

                    <AuthForm
                        isLogin={isLogin}
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                        handleAuth={handleAuth}
                        darkMode={darkMode}
                    />

                    <SocialAuth
                        handleGoogleAuth={handleGoogleAuth}
                        darkMode={darkMode}
                    />

                    {/* Toggle */}
                    <View className="flex-row justify-center mt-8">
                        <Text className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </Text>
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text className={`font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
