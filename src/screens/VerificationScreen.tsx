import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// Components
import { VerificationMessage } from '../components/auth/VerificationMessage';
import { VerificationAction } from '../components/auth/VerificationAction';

export const VerificationScreen = () => {
    const { user, reloadUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const { darkMode } = useSettings();

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
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#ffffff' }} className="items-center justify-center p-6">
            <VerificationMessage
                email={user?.email || ''}
                darkMode={darkMode}
            />

            <VerificationAction
                loading={loading}
                onCheckVerification={handleCheckVerification}
                onLogout={logout}
                darkMode={darkMode}
            />
        </SafeAreaView>
    );
};
