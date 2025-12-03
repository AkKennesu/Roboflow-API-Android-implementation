import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions, Modal, TouchableWithoutFeedback, Easing, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface ProfileSidebarProps {
    visible: boolean;
    onClose: () => void;
}

// --- Sub-components ---

const SidebarHeader = ({ darkMode, insets, onClose, userData }: any) => (
    <LinearGradient
        colors={darkMode ? ['#064e3b', '#111827'] : ['#dcfce7', '#ffffff']}
        style={{ paddingTop: insets.top + 20, paddingBottom: 30 }}
        className="px-6"
    >
        <View className="flex-row justify-end mb-4">
            <TouchableOpacity onPress={onClose} className={`p-2 rounded-full ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
                <Ionicons name="close" size={24} color={darkMode ? '#fff' : '#000'} />
            </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
            <View className={`w-16 h-16 rounded-full items-center justify-center shadow-lg border-2 overflow-hidden mr-4 ${darkMode ? "bg-green-700 border-green-500" : "bg-green-500 border-white"}`}>
                {userData?.avatar ? (
                    <Image source={{ uri: userData.avatar }} className="w-full h-full" />
                ) : (
                    <Text className="text-white text-2xl font-bold">{userData?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                )}
            </View>
            <View className="flex-1 justify-center">
                <Text
                    className={`font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                    style={{ fontSize: 14 }}
                    numberOfLines={2}
                >
                    {userData?.name || 'User'}
                </Text>
                <Text className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-500"}`} numberOfLines={1}>{userData?.username || '@user'}</Text>
            </View>
        </View>
    </LinearGradient>
);

const SidebarMenuItem = ({ item, darkMode, onPress, expanded, language }: any) => {
    if (item.isLanguage) {
        return (
            <>
                <TouchableOpacity
                    className={`flex-row items-center py-3`}
                    onPress={onPress}
                >
                    <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                        <Ionicons name={item.icon as any} size={20} color={darkMode ? "#fff" : "#374151"} />
                    </View>
                    <Text className={`flex-1 text-base font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.label}</Text>
                    <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={16} color={darkMode ? "#4b5563" : "#9ca3af"} />
                </TouchableOpacity>

                {expanded && (
                    <View className="pl-14 gap-2 mb-2">
                        <LanguageOption lang="en" label="English" currentLanguage={language} darkMode={darkMode} onPress={() => item.setLanguage('en')} />
                        <LanguageOption lang="tl" label="Tagalog" currentLanguage={language} darkMode={darkMode} onPress={() => item.setLanguage('tl')} />
                    </View>
                )}
            </>
        );
    }

    if (item.isDarkMode) {
        return (
            <TouchableOpacity
                className={`flex-row items-center py-3`}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <Ionicons name="moon-outline" size={20} color={darkMode ? "#fff" : "#374151"} />
                </View>
                <Text className={`text-base font-medium mr-20 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.label}</Text>
                <View pointerEvents="none">
                    <Switch
                        value={darkMode}
                        onValueChange={() => { }}
                        trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
                        thumbColor={darkMode ? '#fff' : '#f4f4f5'}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            className={`flex-row items-center py-3`}
            onPress={onPress}
        >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <Ionicons name={item.icon as any} size={20} color={darkMode ? "#fff" : "#374151"} />
            </View>
            <Text className={`flex-1 text-base font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={darkMode ? "#4b5563" : "#9ca3af"} />
        </TouchableOpacity>
    );
};

const LanguageOption = ({ lang, label, currentLanguage, darkMode, onPress }: any) => (
    <TouchableOpacity
        className={`flex-row items-center py-2 ${currentLanguage === lang ? (darkMode ? 'bg-green-900/30' : 'bg-green-50') : ''} rounded-lg px-2`}
        onPress={onPress}
    >
        <Text className={`flex-1 ${currentLanguage === lang ? 'text-green-500 font-bold' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>{label}</Text>
        {currentLanguage === lang && <Ionicons name="checkmark" size={16} color="#22c55e" />}
    </TouchableOpacity>
);

const SidebarFooter = ({ insets, darkMode, handleLogout, t }: any) => (
    <View
        className="absolute bottom-0 w-full items-center"
        style={{ paddingBottom: insets.bottom + 20 }}
    >
        <TouchableOpacity
            className={`flex-row items-center justify-center py-2 px-15 rounded-full ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}
            onPress={handleLogout}
        >
            <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 6 }} />
            <Text className="text-red-500 font-bold text-sm">{t.logOut}</Text>
        </TouchableOpacity>
        <Text className={`text-center text-[10px] mt-3 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
            {t.version} 1.0.0 • Leaf-Detective
        </Text>
    </View>
);

// --- Main Component ---

export const ProfileSidebar = ({ visible, onClose }: ProfileSidebarProps) => {
    const navigation = useNavigation<any>();
    const { userData, logout } = useAuth();
    const { darkMode, setDarkMode, language, setLanguage, translations: t } = useSettings();
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(-width)).current;

    const [showModal, setShowModal] = React.useState(visible);
    const [expandedLanguage, setExpandedLanguage] = React.useState(false);

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setShowModal(false);
                }
            });
        }
    }, [visible]);

    const handleLogout = async () => {
        await logout();
        onClose();
        navigation.replace('Auth');
    };

    const menuItems = [
        { icon: 'person-outline', label: t.editProfile, screen: 'EditProfile' },
        { icon: 'globe-outline', label: t.language, isLanguage: true, setLanguage },
        { icon: 'settings-outline', label: t.settings, screen: 'Settings' },
        { icon: 'moon-outline', label: t.darkMode, isDarkMode: true },
    ];

    if (!showModal) return null;

    return (
        <Modal transparent visible={showModal} animationType="none" onRequestClose={onClose}>
            <View className="flex-1 flex-row">
                {/* Backdrop */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View
                        className="flex-1 bg-black/40"
                        style={{
                            opacity: slideAnim.interpolate({
                                inputRange: [-width, 0],
                                outputRange: [0, 1],
                            })
                        }}
                    />
                </TouchableWithoutFeedback>

                {/* Sidebar */}
                <Animated.View
                    style={{
                        transform: [{ translateX: slideAnim }],
                        width: SIDEBAR_WIDTH,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                    className={`h-full shadow-2xl rounded-r-[40px] overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
                >
                    <SidebarHeader darkMode={darkMode} insets={insets} onClose={onClose} userData={userData} />

                    {/* Menu Items */}
                    <View className="flex-1 px-6 pt-8">
                        <Text className={`text-xs font-bold mb-4 uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{t.menu}</Text>
                        <View className="gap-4">
                            {menuItems.map((item, index) => (
                                <SidebarMenuItem
                                    key={index}
                                    item={item}
                                    darkMode={darkMode}
                                    language={language}
                                    expanded={expandedLanguage}
                                    onPress={() => {
                                        if (item.isLanguage) {
                                            setExpandedLanguage(!expandedLanguage);
                                        } else if (item.isDarkMode) {
                                            setDarkMode(!darkMode);
                                        } else if (item.screen) {
                                            onClose();
                                            navigation.navigate(item.screen);
                                        }
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    <SidebarFooter insets={insets} darkMode={darkMode} handleLogout={handleLogout} t={t} />
                </Animated.View>
            </View>
        </Modal>
    );
};
