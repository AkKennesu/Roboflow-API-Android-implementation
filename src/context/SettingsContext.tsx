import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
    confidenceThreshold: number;
    setConfidenceThreshold: (value: number) => void;
    autoSavePhotos: boolean;
    setAutoSavePhotos: (value: boolean) => void;
    language: 'en' | 'tl';
    setLanguage: (value: 'en' | 'tl') => void;
    translations: typeof defaultTranslations.en;
    isLoadingTranslations: boolean;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

import { translations as defaultTranslations } from '../constants/translations';
import { translateBatch } from '../services/TranslationService';

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [confidenceThreshold, setConfidenceThresholdState] = useState(0.50);
    const [autoSavePhotos, setAutoSavePhotosState] = useState(true);
    const [darkMode, setDarkModeState] = useState(false);
    const [language, setLanguageState] = useState<'en' | 'tl'>('en');

    // State to hold the current translations
    const [currentTranslations, setCurrentTranslations] = useState(defaultTranslations.en);
    const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

    // Cache for loaded languages to avoid re-fetching
    const [loadedTranslations, setLoadedTranslations] = useState({
        en: defaultTranslations.en,
        tl: defaultTranslations.tl // Pre-load static if available, or empty object to force fetch
    });

    // Load settings from storage on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedConfidence = await AsyncStorage.getItem('confidenceThreshold');
                const storedAutoSave = await AsyncStorage.getItem('autoSavePhotos');
                const storedDarkMode = await AsyncStorage.getItem('darkMode');
                const storedLanguage = await AsyncStorage.getItem('language');

                if (storedConfidence !== null) setConfidenceThresholdState(parseFloat(storedConfidence));
                if (storedAutoSave !== null) setAutoSavePhotosState(storedAutoSave === 'true');
                if (storedDarkMode !== null) setDarkModeState(storedDarkMode === 'true');

                if (storedLanguage !== null) {
                    const lang = storedLanguage as 'en' | 'tl';
                    setLanguageState(lang);
                    // Set initial translations based on stored language
                    // For now, we use the static ones. If we want to fetch fresh ones on boot, we could.
                    if (lang === 'tl') {
                        setCurrentTranslations(defaultTranslations.tl);
                    }
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        loadSettings();
    }, []);

    // ... setters for other settings ...

    const setConfidenceThreshold = async (value: number) => {
        setConfidenceThresholdState(value);
        try { await AsyncStorage.setItem('confidenceThreshold', value.toString()); } catch (e) { console.error(e); }
    };

    const setAutoSavePhotos = async (value: boolean) => {
        setAutoSavePhotosState(value);
        try { await AsyncStorage.setItem('autoSavePhotos', value.toString()); } catch (e) { console.error(e); }
    };

    const setDarkMode = async (value: boolean) => {
        setDarkModeState(value);
        try { await AsyncStorage.setItem('darkMode', value.toString()); } catch (e) { console.error(e); }
    };

    const setLanguage = async (value: 'en' | 'tl') => {
        setLanguageState(value);
        try {
            await AsyncStorage.setItem('language', value);

            // If switching to English, use default
            if (value === 'en') {
                setCurrentTranslations(defaultTranslations.en);
                return;
            }

            // If switching to Tagalog
            if (value === 'tl') {
                // If we want to force API usage as requested:
                setIsLoadingTranslations(true);

                // Get all values from English to translate
                const keys = Object.keys(defaultTranslations.en) as Array<keyof typeof defaultTranslations.en>;
                const textsToTranslate = keys.map(key => defaultTranslations.en[key]);

                // Call API
                const translatedTexts = await translateBatch(textsToTranslate, 'tl');

                // Reconstruct object
                const newTranslations = { ...defaultTranslations.en }; // Start with structure
                keys.forEach((key, index) => {
                    newTranslations[key] = translatedTexts[index];
                });

                setCurrentTranslations(newTranslations);
                setIsLoadingTranslations(false);
            }

        } catch (error) {
            console.error('Failed to save language setting or translate:', error);
            setIsLoadingTranslations(false);
            // Fallback to static if API fails
            if (value === 'tl') setCurrentTranslations(defaultTranslations.tl);
        }
    };

    return (
        <SettingsContext.Provider value={{
            confidenceThreshold,
            setConfidenceThreshold,
            autoSavePhotos,
            setAutoSavePhotos,
            darkMode,
            setDarkMode,
            language,
            setLanguage,
            translations: currentTranslations,
            isLoadingTranslations
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
