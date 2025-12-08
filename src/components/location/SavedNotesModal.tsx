import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SavedNotesModalProps {
    visible: boolean;
    onClose: () => void;
    savedNotes: any[];
    isLoadingNotes: boolean;
    handleDeleteNote: (id: string) => void;
    onNotePress: (note: any) => void;
    darkMode: boolean;
}

export const SavedNotesModal = ({ visible, onClose, savedNotes, isLoadingNotes, handleDeleteNote, onNotePress, darkMode }: SavedNotesModalProps) => {
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: darkMode ? '#1f2937' : 'white' }]}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Notes</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={darkMode ? '#9ca3af' : '#6b7280'} />
                        </TouchableOpacity>
                    </View>

                    {isLoadingNotes ? (
                        <ActivityIndicator size="large" color="#006FEE" className="my-8" />
                    ) : (
                        <FlatList
                            data={savedNotes}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={
                                <Text className={`text-center mt-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No saved notes yet.
                                </Text>
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`mb-3 p-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
                                    onPress={() => onNotePress(item)}
                                >
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 mr-2">
                                            <Text className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                {item.note}
                                            </Text>
                                            <Text className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {formatDate(item.timestamp)}
                                            </Text>
                                            <Text className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => handleDeleteNote(item.id)}
                                            className="p-2"
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalView: {
        width: '100%',
        maxHeight: '80%',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
