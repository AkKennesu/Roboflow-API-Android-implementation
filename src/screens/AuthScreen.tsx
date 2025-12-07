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
            const errorCode = error.code;
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
                Alert.alert(
                    'Account Not Found',
                    'It looks like you don\'t have an account yet. Would you like to sign up?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign Up', onPress: () => setIsLogin(false) }
                    ]
                );
            } else {
                Alert.alert('Authentication Failed', getFriendlyErrorMessage(error));
            }
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
        <View style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#ffffff' }}>
            {/* Top Background Section (40%) */}
            <View
                className={`absolute top-0 left-0 right-0 h-[40%] ${darkMode ? "bg-green-900/20" : "bg-green-50"}`}
                style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, justifyContent: 'flex-start', paddingTop: 60 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Logo & Title */}
                        <View className="items-center mb-6">
                            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 shadow-lg ${darkMode ? "bg-green-600 shadow-green-900/30" : "bg-green-500 shadow-green-200"}`}>
                                <Ionicons name="leaf" size={32} color="white" />
                            </View>
                            <Text
                                className={`text-xl font-bold text-center ${darkMode ? "text-green-400" : "text-green-600"}`}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {isLogin ? 'Welcome Back' : 'Sign Up'}
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

                        {/* Footer Toggle */}
                        <View className="flex-row justify-center mt-6">
                            <Text className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </Text>
                            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                <Text className={`font-bold underline ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terms */}
                        <View className="mt-auto mb-6">
                            <Text className={`text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                I accept App's <Text className="underline">Terms of User</Text> and <Text className="underline">Privacy Policy</Text>.
                            </Text>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};
