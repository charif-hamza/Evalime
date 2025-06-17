// src/services/gemini.js
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Allow overriding the model via env. Default to a stable public model.
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export async function getExplanation(prompt) {
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY environment variable.");
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected API response structure:', data);
      return 'No explanation available.';
    }
  } catch (error) {
    console.error('Failed to fetch explanation from Gemini API:', error);
    throw error;
  }
} 