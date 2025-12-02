import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
    confidenceThreshold: number;
    setConfidenceThreshold: (value: number) => void;
    autoSavePhotos: boolean;
    setAutoSavePhotos: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [confidenceThreshold, setConfidenceThresholdState] = useState(0.50); // Default 50%
    const [autoSavePhotos, setAutoSavePhotosState] = useState(true);

    // Load settings from storage on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedConfidence = await AsyncStorage.getItem('confidenceThreshold');
                const storedAutoSave = await AsyncStorage.getItem('autoSavePhotos');

                if (storedConfidence !== null) {
                    setConfidenceThresholdState(parseFloat(storedConfidence));
                }
                if (storedAutoSave !== null) {
                    setAutoSavePhotosState(storedAutoSave === 'true');
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        loadSettings();
    }, []);

    const setConfidenceThreshold = async (value: number) => {
        setConfidenceThresholdState(value);
        try {
            await AsyncStorage.setItem('confidenceThreshold', value.toString());
        } catch (error) {
            console.error('Failed to save confidence threshold:', error);
        }
    };

    const setAutoSavePhotos = async (value: boolean) => {
        setAutoSavePhotosState(value);
        try {
            await AsyncStorage.setItem('autoSavePhotos', value.toString());
        } catch (error) {
            console.error('Failed to save auto save setting:', error);
        }
    };

    return (
        <SettingsContext.Provider value={{
            confidenceThreshold,
            setConfidenceThreshold,
            autoSavePhotos,
            setAutoSavePhotos
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
