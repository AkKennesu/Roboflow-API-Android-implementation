import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { db, storage } from '../config/firebase';
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

// export const uploadImage = async (uri: string, userId: string): Promise<string> => {
//     try {
//         // 1. Resize and Compress
//         const manipResult = await manipulateAsync(
//             uri,
//             [{ resize: { width: 800 } }], // Resize to max width 800px
//             { compress: 0.7, format: SaveFormat.JPEG }
//         );
// 
//         // 2. Fetch blob
//         console.log("Fetching blob from:", manipResult.uri);
//         const response = await fetch(manipResult.uri);
//         const blob = await response.blob();
//         console.log("Blob created, size:", blob.size);
// 
//         // 3. Upload to Firebase Storage
//         const filename = `${userId}/${Date.now()}.jpg`;
//         const storageRef = ref(storage, `history_images/${filename}`);
// 
//         console.log("Starting upload to:", storageRef.fullPath);
//         const result = await uploadBytes(storageRef, blob);
//         console.log("Upload complete, metadata:", result.metadata);
// 
//         // 4. Get Download URL
//         const downloadURL = await getDownloadURL(storageRef);
//         return downloadURL;
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         throw error;
//     }
// };

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
