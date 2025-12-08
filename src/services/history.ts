import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { db } from '../config/firebase';
import { Prediction } from './api';

export interface HistoryItem {
    id: string;
    userId: string;
    imageUrl: string;
    predictions: Prediction[];
    timestamp: number;
    date: string;
}

export const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
        const manipResult = await manipulateAsync(
            uri,
            [{ resize: { width: 600 } }], // Smaller width for Firestore limit
            { compress: 0.5, format: SaveFormat.JPEG, base64: true }
        );
        return `data:image/jpeg;base64,${manipResult.base64}`;
    } catch (error) {
        console.error("Error converting image to base64:", error);
        throw error;
    }
};

export const saveDetectionResult = async (userId: string, imageUri: string, predictions: Prediction[]) => {
    try {
        let finalImageUrl = imageUri;

        // Convert image to Base64 if it's a local file
        if (!imageUri.startsWith('http')) {
            try {
                finalImageUrl = await convertImageToBase64(imageUri);
            } catch (uploadError) {
                console.warn("Failed to convert image, falling back to local URI:", uploadError);
                // Continue with local URI if conversion fails
            }
        }

        const docRef = await addDoc(collection(db, 'history'), {
            userId,
            imageUrl: finalImageUrl,
            predictions,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getUserHistory = async (userId: string): Promise<HistoryItem[]> => {
    try {
        const q = query(
            collection(db, 'history'),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const history: HistoryItem[] = [];
        querySnapshot.forEach((doc) => {
            history.push({ id: doc.id, ...doc.data() } as HistoryItem);
        });

        // Sort by timestamp desc (newest first)
        return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
        console.error("Error fetching history: ", e);
        throw e;
    }
};

export const deleteHistoryItem = async (itemId: string) => {
    try {
        await deleteDoc(doc(db, 'history', itemId));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
};
