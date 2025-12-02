import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import { CONFIG } from '../config';

const API_KEY = CONFIG.ROBOFLOW_API_KEY;
const MODEL_ID = CONFIG.ROBOFLOW_MODEL_ID;
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

export const detectDisease = async (imageUri: string, confidence: number = 40): Promise<Prediction[]> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Construct the URL
    // Format: https://serverless.roboflow.com/[model]/[version]
    const url = `${BASE_URL}/${MODEL_ID}`;

    console.log(`[API] Sending request to: ${url}`);
    console.log(`[API] Params: confidence=${confidence}, overlap=30`);

    const response = await axios({
      method: "POST",
      url: url,
      params: {
        api_key: API_KEY,
        confidence: confidence, // Pass the confidence threshold
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
