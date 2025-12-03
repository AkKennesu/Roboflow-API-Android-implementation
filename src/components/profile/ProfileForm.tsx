import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileFormProps {
    name: string;
    setName: (name: string) => void;
    username: string;
    darkMode: boolean;
}

export const ProfileForm = ({ name, setName, username, darkMode }: ProfileFormProps) => {
    return (
        <View className="gap-5">
            <View>
                <View className={`p-4 rounded-2xl border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <Ionicons name="at" size={20} color={darkMode ? "#9ca3af" : "#6b7280"} />
                    </View>
                    <View className="flex-1">
                        <Text className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Username</Text>
                        <TextInput
                            value={username}
                            editable={false}
                            className={`font-semibold text-base p-0 mt-1 ${darkMode ? "text-gray-300" : "text-gray-800"}`}
                        />
                    </View>
                    <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                </View>
            </View>

            <View>
                <View className={`p-4 rounded-2xl border flex-row items-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <Ionicons name="person-outline" size={20} color={darkMode ? "#4ade80" : "#22c55e"} />
                    </View>
                    <View className="flex-1">
                        <Text className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            className={`font-semibold text-base p-0 mt-1 ${darkMode ? "text-white" : "text-gray-800"}`}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
