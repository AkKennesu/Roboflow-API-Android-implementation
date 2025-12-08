import { useState } from 'react';
import { detectDisease, Prediction } from '../services/api';

export const useDetection = (confidenceThreshold: number, t: any, crop: 'rice' | 'mango' | 'soil' | 'corn' = 'rice') => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<Prediction[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelected = async (uri: string) => {
        setSelectedImage(uri);
        setPredictions(null);
        setError(null);
        setLoading(true);

        try {
            // Convert decimal threshold (e.g. 0.75) to percentage (75) for API
            const results = await detectDisease(uri, Math.round(confidenceThreshold * 100), crop);
            setPredictions(results);
        } catch (err) {
            setError(t.failedToAnalyze);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        selectedImage,
        predictions,
        loading,
        error,
        handleImageSelected,
        setSelectedImage,
        setPredictions,
        setError,
        setLoading
    };
};
