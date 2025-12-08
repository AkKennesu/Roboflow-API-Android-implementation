import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';

import { useNavigation } from '@react-navigation/native';

// Components
import { LocationHeader } from '../components/location/LocationHeader';
import { LocationSearchBar } from '../components/location/LocationSearchBar';
import { LocationMap } from '../components/location/LocationMap';
import { LocationNoteInput } from '../components/location/LocationNoteInput';
import { SavedNotesModal } from '../components/location/SavedNotesModal';

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

  const handleNotePress = (savedNote: any) => {
    setNotesModalVisible(false); // Close modal

    // Update local location state to reflect the selected note
    const newLocation = {
      ...location,
      coords: {
        ...location?.coords,
        latitude: savedNote.latitude,
        longitude: savedNote.longitude,
      }
    } as Location.LocationObject;

    setLocation(newLocation);

    // Update Map View via WebView Injection
    const injectScript = `
      map.setView([${savedNote.latitude}, ${savedNote.longitude}], 15);
      if (typeof marker !== 'undefined') {
        marker.setLatLng([${savedNote.latitude}, ${savedNote.longitude}])
          .bindPopup('${savedNote.note}')
          .openPopup();
      } else {
        marker = L.marker([${savedNote.latitude}, ${savedNote.longitude}]).addTo(map)
          .bindPopup('${savedNote.note}')
          .openPopup();
      }
    `;
    webViewRef.current?.injectJavaScript(injectScript);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#111827' : '#f9fafb' }} edges={['top', 'left', 'right']}>
      <LocationHeader
        darkMode={darkMode}
        onOpenNotes={() => {
          setNotesModalVisible(true);
          fetchSavedNotes();
        }}
      />

      <LocationSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isSearching={isSearching}
        darkMode={darkMode}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        {location ? (
          <LocationMap
            location={location}
            webViewRef={webViewRef}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Getting location...</Text>
          </View>
        )}

        {location && (
          <LocationNoteInput
            location={location}
            note={note}
            setNote={setNote}
            handleSaveLocation={handleSaveLocation}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        )}
      </KeyboardAvoidingView>

      <SavedNotesModal
        visible={notesModalVisible}
        onClose={() => setNotesModalVisible(false)}
        savedNotes={savedNotes}
        isLoadingNotes={isLoadingNotes}
        handleDeleteNote={handleDeleteNote}
        onNotePress={handleNotePress}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
};
