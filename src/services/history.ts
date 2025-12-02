import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Prediction } from './api';

export interface HistoryItem {
    id: string;
    userId: string;
    imageUrl: string; // We might need to upload the image to storage first, or store base64 (not recommended for large scale)
    // For now, let's assume we store the local URI or a placeholder if not uploaded. 
    // Ideally, we should upload to Firebase Storage.
    predictions: Prediction[];
    timestamp: number;
    date: string;
}

export const saveDetectionResult = async (userId: string, imageUri: string, predictions: Prediction[]) => {
    try {
        // In a real app, upload image to Firebase Storage here and get the URL.
        // For this demo, we'll just save the metadata. 
        // Note: Local URIs won't work across devices or after app reinstall.

        const docRef = await addDoc(collection(db, 'history'), {
            userId,
            imageUrl: imageUri,
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
