import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import { HomeScreen } from '../screens/HomeScreen';
import { DetectionScreen } from '../screens/DetectionScreen';
import { DiseasesScreen } from '../screens/DiseasesScreen';
import { WeatherScreen } from '../screens/WeatherScreen';
import { LocationScreen } from '../screens/LocationScreen';
import { DiseaseDetailScreen } from '../screens/DiseaseDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { VerificationScreen } from '../screens/VerificationScreen';
import { HistoryScreen } from '../screens/HistoryScreen';

import { HistoryDetailScreen } from '../screens/HistoryDetailScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                user.emailVerified ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Detection" component={DetectionScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Diseases" component={DiseasesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Weather" component={WeatherScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Location" component={LocationScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <Stack.Screen name="Verification" component={VerificationScreen} />
                )
            ) : (
                <Stack.Screen name="Auth" component={AuthScreen} />
            )}
        </Stack.Navigator>
    );
};
