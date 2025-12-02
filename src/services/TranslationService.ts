import axios from 'axios';

// Using the free Google Translate endpoint (similar to what deep-translator uses internally)
const BASE_URL = 'https://translate.googleapis.com/translate_a/single';

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
        // client=gtx is the free endpoint used by many scrapers
        const response = await axios.get(BASE_URL, {
            params: {
                client: 'gtx',
                sl: 'auto', // source language
                tl: targetLanguage, // target language
                dt: 't', // data type: translation
                q: text
            }
        });

        // The response structure for 'gtx' is an array of arrays.
        // response.data[0][0][0] usually contains the translated text.
        if (response.data && response.data[0] && response.data[0][0] && response.data[0][0][0]) {
            // Sometimes the translation is split across multiple chunks if it's long
            return response.data[0].map((chunk: any) => chunk[0]).join('');
        }
        return text;
    } catch (error) {
        console.error('Free Translation API Error:', error);
        return text; // Fallback to original text
    }
};

export const translateBatch = async (texts: string[], targetLanguage: string): Promise<string[]> => {
    try {
        // The free endpoint doesn't support batching in the same way as the Cloud API.
        // We must make parallel requests.
        const promises = texts.map(text => translateText(text, targetLanguage));
        return await Promise.all(promises);
    } catch (error) {
        console.error('Batch Translation Error:', error);
        return texts;
    }
};
