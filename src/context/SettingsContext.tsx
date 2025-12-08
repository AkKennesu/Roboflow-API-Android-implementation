import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations as defaultTranslations } from '../constants/translations';
import { translateBatch } from '../services/TranslationService';

interface SettingsContextType {
    confidenceThresholds: { rice: number; mango: number; soil: number; corn: number };
    setConfidenceThreshold: (type: 'rice' | 'mango' | 'soil' | 'corn', value: number) => void;
    autoSavePhotos: boolean;
    setAutoSavePhotos: (value: boolean) => void;
    language: 'en' | 'tl';
    setLanguage: (value: 'en' | 'tl') => void;
    translations: typeof defaultTranslations.en;
    isLoadingTranslations: boolean;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    temperatureUnit: 'celsius' | 'fahrenheit';
    setTemperatureUnit: (value: 'celsius' | 'fahrenheit') => void;
}

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [confidenceThresholds, setConfidenceThresholdsState] = useState({ rice: 0.70, mango: 0.70, soil: 0.70, corn: 0.70 });
    const [autoSavePhotos, setAutoSavePhotosState] = useState(true);
    const [darkMode, setDarkModeState] = useState(false);
    const [temperatureUnit, setTemperatureUnitState] = useState<'celsius' | 'fahrenheit'>('celsius');
    const [language, setLanguageState] = useState<'en' | 'tl'>('en');

    // State to hold the current translations
    const [currentTranslations, setCurrentTranslations] = useState(defaultTranslations.en);
    const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

    // Load settings from storage on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Load Thresholds
                const savedRiceThreshold = await AsyncStorage.getItem('confidenceThreshold_rice');
                const savedMangoThreshold = await AsyncStorage.getItem('confidenceThreshold_mango');
                const savedSoilThreshold = await AsyncStorage.getItem('confidenceThreshold_soil');
                const savedCornThreshold = await AsyncStorage.getItem('confidenceThreshold_corn');

                // Backwards compatibility / Migration
                const legacyThreshold = await AsyncStorage.getItem('confidenceThreshold');

                let newThresholds = { rice: 0.70, mango: 0.70, soil: 0.70, corn: 0.70 };

                // Migration: If no specific rice/mango settings, use legacy if exists
                if (!savedRiceThreshold && !savedMangoThreshold && legacyThreshold) {
                    const val = parseFloat(legacyThreshold);
                    newThresholds.rice = val;
                    newThresholds.mango = val;
                } else {
                    if (savedRiceThreshold) newThresholds.rice = parseFloat(savedRiceThreshold);
                    if (savedMangoThreshold) newThresholds.mango = parseFloat(savedMangoThreshold);
                }

                if (savedSoilThreshold) newThresholds.soil = parseFloat(savedSoilThreshold);
                if (savedCornThreshold) newThresholds.corn = parseFloat(savedCornThreshold);

                setConfidenceThresholdsState(newThresholds);

                // Load other settings
                const savedAutoSave = await AsyncStorage.getItem('autoSavePhotos');
                if (savedAutoSave !== null) setAutoSavePhotosState(savedAutoSave === 'true');

                const savedDarkMode = await AsyncStorage.getItem('darkMode');
                if (savedDarkMode !== null) setDarkModeState(savedDarkMode === 'true');

                const savedTempUnit = await AsyncStorage.getItem('temperatureUnit');
                if (savedTempUnit !== null) setTemperatureUnitState(savedTempUnit as 'celsius' | 'fahrenheit');

                const savedLang = await AsyncStorage.getItem('language');
                if (savedLang !== null) {
                    const lang = savedLang as 'en' | 'tl';
                    setLanguageState(lang);
                    if (lang === 'tl') {
                        // Simplify: Load default TL for now to avoid complexity in this recovery, 
                        // ignoring the complex translation logic momentarily to ensure stability, 
                        // or we can reuse the logic below.
                        // Let's rely on setLanguage to handle dynamic translation if called, 
                        // but for initial load, maybe just load default TL to be safe and fast.
                        setCurrentTranslations(defaultTranslations.tl);
                    }
                }
            } catch (error) {
                console.error('Failed to load settings', error);
            }
        };
        loadSettings();
    }, []);

    const setConfidenceThreshold = async (type: 'rice' | 'mango' | 'soil' | 'corn', value: number) => {
        setConfidenceThresholdsState(prev => ({
            ...prev,
            [type]: value
        }));
        await AsyncStorage.setItem(`confidenceThreshold_${type}`, value.toString());
    };

    const setAutoSavePhotos = async (value: boolean) => {
        setAutoSavePhotosState(value);
        await AsyncStorage.setItem('autoSavePhotos', value.toString());
    };

    const setDarkMode = async (value: boolean) => {
        setDarkModeState(value);
        await AsyncStorage.setItem('darkMode', value.toString());
    };

    const setTemperatureUnit = async (value: 'celsius' | 'fahrenheit') => {
        setTemperatureUnitState(value);
        await AsyncStorage.setItem('temperatureUnit', value);
    };

    const setLanguage = async (value: 'en' | 'tl') => {
        setLanguageState(value);
        try {
            await AsyncStorage.setItem('language', value);

            if (value === 'en') {
                setCurrentTranslations(defaultTranslations.en);
                return;
            }

            if (value === 'tl') {
                setIsLoadingTranslations(true);
                // Attempt dynamic translation
                try {
                    const keys = Object.keys(defaultTranslations.en) as Array<keyof typeof defaultTranslations.en>;
                    const textsToTranslate = keys.map(key => defaultTranslations.en[key]);
                    const translatedTexts = await translateBatch(textsToTranslate, 'tl');

                    const newTranslations = { ...defaultTranslations.en };
                    keys.forEach((key, index) => {
                        newTranslations[key] = translatedTexts[index];
                    });
                    setCurrentTranslations(newTranslations);
                } catch (err) {
                    console.error("Translation API failed, falling back to static", err);
                    setCurrentTranslations(defaultTranslations.tl);
                } finally {
                    setIsLoadingTranslations(false);
                }
            }
        } catch (error) {
            console.error('Failed to save language setting:', error);
            setIsLoadingTranslations(false);
        }
    };

    return (
        <SettingsContext.Provider value={{
            confidenceThresholds,
            setConfidenceThreshold,
            autoSavePhotos,
            setAutoSavePhotos,
            darkMode,
            setDarkMode,
            temperatureUnit,
            setTemperatureUnit,
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
