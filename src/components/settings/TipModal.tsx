import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TipModalProps {
    visible: boolean;
    onClose: () => void;
    selectedTip: { title: string; type: 'list' | 'text'; content: string | string[] } | null;
    darkMode: boolean;
}

export const TipModal = ({ visible, onClose, selectedTip, darkMode }: TipModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 p-5">
                <View className={`w-full max-w-sm rounded-3xl p-6 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {selectedTip?.title}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={darkMode ? "#9ca3af" : "#6b7280"} />
                        </TouchableOpacity>
                    </View>

                    <View className="gap-4">
                        {selectedTip?.type === 'list' ? (
                            (selectedTip.content as string[]).map((step, index) => (
                                <View key={index} className="flex-row items-start">
                                    <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5 ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                                        <Text className={`text-xs font-bold ${darkMode ? "text-green-400" : "text-green-700"}`}>{index + 1}</Text>
                                    </View>
                                    <Text className={`flex-1 text-base leading-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        {step}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text className={`text-base leading-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {selectedTip?.content as string}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        className={`mt-6 py-3 rounded-xl items-center ${darkMode ? "bg-green-600" : "bg-green-500"}`}
                        onPress={onClose}
                    >
                        <Text className="text-white font-bold">Got it</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
