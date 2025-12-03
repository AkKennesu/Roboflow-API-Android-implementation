import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
    isSearching: boolean;
    darkMode: boolean;
}

export const LocationSearchBar = ({ searchQuery, setSearchQuery, handleSearch, isSearching, darkMode }: LocationSearchBarProps) => {
    return (
        <View className="px-6 mb-2 flex-row gap-2">
            <TextInput
                style={[
                    styles.input,
                    {
                        flex: 1,
                        minHeight: 45,
                        paddingVertical: 8,
                        color: darkMode ? '#fff' : '#000',
                        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
                        backgroundColor: darkMode ? '#374151' : '#fff'
                    }
                ]}
                placeholder="Search location..."
                placeholderTextColor={darkMode ? '#9ca3af' : '#6b7280'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
                onPress={handleSearch}
                disabled={isSearching}
                className={`w-12 items-center justify-center rounded-xl ${isSearching ? 'bg-blue-500/50' : 'bg-blue-500'}`}
            >
                {isSearching ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Ionicons name="search" size={24} color="white" />
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
