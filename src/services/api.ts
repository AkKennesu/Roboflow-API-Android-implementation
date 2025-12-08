import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import { CONFIG } from '../config';

const BASE_URL = CONFIG.ROBOFLOW_API_URL;


export interface Prediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ApiResponse {
  predictions: Prediction[];
}

export const detectDisease = async (imageUri: string, confidence: number = 40, crop: 'rice' | 'mango' | 'soil' | 'corn' = 'rice'): Promise<Prediction[]> => {
  // Guard against NaN
  const safeConfidence = isNaN(confidence) ? 40 : confidence;
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Select settings based on crop
    let API_KEY, MODEL_ID;
    switch (crop) {
      case 'mango':
        API_KEY = CONFIG.MANGO_API_KEY;
        MODEL_ID = CONFIG.MANGO_MODEL_ID;
        break;
      case 'soil':
        API_KEY = CONFIG.SOIL_API_KEY;
        MODEL_ID = CONFIG.SOIL_MODEL_ID;
        break;
      case 'corn':
        API_KEY = CONFIG.CORN_API_KEY;
        MODEL_ID = CONFIG.CORN_MODEL_ID;
        break;
      case 'rice':
      default:
        API_KEY = CONFIG.RICE_API_KEY;
        MODEL_ID = CONFIG.RICE_MODEL_ID;
        break;
    }

    // Construct the URL
    // Format: https://serverless.roboflow.com/[model]/[version]
    const url = `${BASE_URL}/${MODEL_ID}`;

    console.log(`[API] Sending request to: ${url}`);
    console.log(`[API] Params: confidence=${confidence}, crop=${crop}`);

    const response = await axios({
      method: "POST",
      url: url,
      params: {
        api_key: API_KEY,
        confidence: safeConfidence, // Pass the confidence threshold
        overlap: 30, // Default overlap
      },
      data: base64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // Let's assume it returns { predictions: [...] } or just [...]
    console.log("Roboflow Response:", JSON.stringify(response.data, null, 2));

    if (response.data.predictions) {
      return response.data.predictions;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      // Fallback or specific handling if needed
      console.log("Unexpected API response structure:", response.data);
      return [];
    }

  } catch (error) {
    console.error("Error detecting disease:", error);
    throw error;
  }
};
