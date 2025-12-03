import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

interface LocationNoteInputProps {
    location: any;
    note: string;
    setNote: (note: string) => void;
    handleSaveLocation: () => void;
    isSaving: boolean;
    darkMode: boolean;
}

export const LocationNoteInput = ({ location, note, setNote, handleSaveLocation, isSaving, darkMode }: LocationNoteInputProps) => {
    return (
        <View className={`p-4 rounded-t-3xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ paddingBottom: 130 }}>
            <Text className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Save Location Note
            </Text>

            <Text className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Lat: {location.coords.latitude.toFixed(4)}, Long: {location.coords.longitude.toFixed(4)}
            </Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        color: darkMode ? '#fff' : '#000',
                        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                        backgroundColor: darkMode ? '#374151' : '#f9fafb'
                    }
                ]}
                placeholder="Add a note about this location..."
                placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={2}
            />

            <TouchableOpacity
                onPress={handleSaveLocation}
                disabled={isSaving}
                className={`mt-3 py-3 rounded-xl items-center justify-center ${isSaving ? 'bg-green-500/50' : 'bg-green-500'}`}
            >
                {isSaving ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text className="text-white font-bold text-base">Save Location</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        textAlignVertical: 'top',
        minHeight: 60,
    },
});
