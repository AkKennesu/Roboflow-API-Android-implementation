import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';

import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const LocationScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { darkMode } = useSettings();
  const { userData } = useAuth();

  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Saved Notes State
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const webViewRef = React.useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    Keyboard.dismiss();

    try {
      const results = await Location.geocodeAsync(searchQuery);

      if (results.length > 0) {
        const { latitude, longitude } = results[0];

        // Update local location state
        const newLocation = {
          ...location,
          coords: {
            ...location?.coords,
            latitude,
            longitude,
          }
        } as Location.LocationObject;

        setLocation(newLocation);

        // Update Map via WebView
        const injectScript = `
          map.setView([${latitude}, ${longitude}], 15);
          if (typeof marker !== 'undefined') {
            marker.setLatLng([${latitude}, ${longitude}])
              .bindPopup('Searched Location')
              .openPopup();
          } else {
            marker = L.marker([${latitude}, ${longitude}]).addTo(map)
              .bindPopup('Searched Location')
              .openPopup();
          }
        `;
        webViewRef.current?.injectJavaScript(injectScript);
      } else {
        Alert.alert('Not Found', 'Could not find that location.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search location.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available yet.');
      return;
    }

    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note.');
      return;
    }

    setIsSaving(true);

    try {
      await addDoc(collection(db, 'location_notes'), {
        userId: userData?.uid || 'anonymous',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        note: note.trim(),
        timestamp: serverTimestamp(),
      });

      Alert.alert('Success', 'Location and note saved successfully!');
      setNote('');
    } catch (error) {
      console.error('Error saving location note:', error);
      Alert.alert('Error', 'Failed to save location note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchSavedNotes = async () => {
    if (!userData?.uid) return;

    setIsLoadingNotes(true);
    try {
      const q = query(
        collection(db, 'location_notes'),
        where('userId', '==', userData.uid)
      );

      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      });

      setSavedNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      Alert.alert('Error', 'Failed to load saved notes.');
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'location_notes', noteId));
              setSavedNotes(prev => prev.filter(n => n.id !== noteId));
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (!location) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} className="items-center justify-center">
        <ActivityIndicator size="large" color="#006FEE" />
        <Text className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Locating you...</Text>
        {errorMsg && <Text className="text-danger mt-2">{errorMsg}</Text>}
      </SafeAreaView>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${location.coords.latitude}, ${location.coords.longitude}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          var marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map)
            .bindPopup('You are here')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <Ionicons name="arrow-back" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ml-4 ${darkMode ? "text-white" : "text-gray-800"}`}>My Location</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setNotesModalVisible(true);
            fetchSavedNotes();
          }}
          className={`p-2 rounded-full shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <Ionicons name="list" size={24} color={darkMode ? "#e5e7eb" : "#374151"} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ flex: 1 }}
          />
        </View>

        {/* Bottom Input Section */}
        <View className={`p-4 rounded-t-3xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
      </KeyboardAvoidingView>

      {/* Saved Notes Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={notesModalVisible}
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: darkMode ? '#1f2937' : 'white' }]}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Notes</Text>
              <TouchableOpacity onPress={() => setNotesModalVisible(false)}>
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
                  <View className={`mb-3 p-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
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
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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

