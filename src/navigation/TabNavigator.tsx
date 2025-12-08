import React from 'react';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useSidebar } from '../context/SidebarContext';
import { ProfileSidebar } from '../components/ProfileSidebar';

// Screens
import { DiseasesScreen } from '../screens/DiseasesScreen';
import { DetectionScreen } from '../screens/DetectionScreen';
import { WeatherScreen } from '../screens/WeatherScreen';
import { LocationScreen } from '../screens/LocationScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// --- Sub-components ---

const TabBarItem = ({ routeName, selectedTab, navigate, t, darkMode }: any) => {
    const isFocused = routeName === selectedTab;
    const translateY = useSharedValue(0);

    React.useEffect(() => {
        translateY.value = withSpring(isFocused ? -10 : 0, { mass: 0.5, damping: 12, stiffness: 250 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    let icon = '';
    let label = '';

    switch (routeName) {
        case 'DiseasesTab':
            icon = 'book-outline';
            label = t.navDisease;
            break;
        case 'WeatherTab':
            icon = 'cloud-outline';
            label = t.navWeather;
            break;
        case 'LocationTab':
            icon = 'location-outline';
            label = t.navLocation;
            break;
        case 'HistoryTab':
            icon = 'time-outline';
            label = t.navHistory;
            break;
    }

    return (
        <TouchableOpacity
            onPress={() => navigate(routeName)}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
                <Ionicons
                    name={icon as any}
                    size={24}
                    color={isFocused ? '#22c55e' : (darkMode ? '#9ca3af' : '#6b7280')}
                />
                {isFocused && (
                    <Text
                        style={{
                            fontSize: 10,
                            marginTop: 4,
                            fontWeight: '600',
                            color: '#22c55e'
                        }}
                    >
                        {label}
                    </Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const FloatingCameraButton = ({ navigate }: { navigate: (route: string) => void }) => (
    <Animated.View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22c55e',
        bottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 5,
    }}>
        <TouchableOpacity
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
            onPress={() => navigate('CameraTab')}
        >
            <Ionicons name={'camera'} color="white" size={32} />
        </TouchableOpacity>
    </Animated.View>
);

// --- Main Component ---

export const TabNavigator = () => {
    const { darkMode, translations: t } = useSettings();
    const { isSidebarVisible, closeSidebar } = useSidebar();

    const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
        return (
            <TabBarItem
                routeName={routeName}
                selectedTab={selectedTab}
                navigate={navigate}
                t={t}
                darkMode={darkMode}
            />
        );
    };

    return (
        <>
            <CurvedBottomBarExpo.Navigator
                type="DOWN"
                style={{}}
                shadowStyle={{
                    shadowColor: '#DDDDDD',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 5,
                }}
                height={75}
                circleWidth={60}
                bgColor={darkMode ? '#020617' : '#dcfce7'}
                initialRouteName="CameraTab"
                borderTopLeftRight
                renderCircle={({ navigate }: any) => (
                    <FloatingCameraButton navigate={navigate} />
                )}
                tabBar={renderTabBar}
                screenOptions={{
                    headerShown: false,
                }}
                width={width}
                borderColor="transparent"
                borderWidth={0}
                id="main-tab-navigator"
                circlePosition="CENTER"
                screenListeners={() => ({})}
                defaultScreenOptions={{}}
                backBehavior="history"
            >
                <CurvedBottomBarExpo.Screen
                    name="DiseasesTab"
                    position="LEFT"
                    component={DiseasesScreen}
                />
                <CurvedBottomBarExpo.Screen
                    name="WeatherTab"
                    position="LEFT"
                    component={WeatherScreen}
                />
                <CurvedBottomBarExpo.Screen
                    name="CameraTab"
                    component={DetectionScreen}
                    position="CENTER"
                />
                <CurvedBottomBarExpo.Screen
                    name="LocationTab"
                    component={LocationScreen}
                    position="RIGHT"
                />
                <CurvedBottomBarExpo.Screen
                    name="HistoryTab"
                    component={HistoryScreen}
                    position="RIGHT"
                />
            </CurvedBottomBarExpo.Navigator>

            {/* Global Sidebar */}
            <ProfileSidebar visible={isSidebarVisible} onClose={closeSidebar} />
        </>
    );
};
