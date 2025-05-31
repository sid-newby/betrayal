import { CartesiaClient, WebPlayer } from '@cartesia/cartesia-js';
import { processTextForTTS } from '../utils/textProcessing';

/**
 * Speech Synthesis Service using Cartesia TTS
 *
 * This service provides a function to speak text using the Cartesia API via WebSockets
 * and plays the audio in the browser using Cartesia's WebPlayer.
 */

// Instantiate the Cartesia client.
// It expects CARTESIA_API_KEY to be in process.env (e.g., from .env file loaded by Vite)
const cartesiaApiKey = import.meta.env.VITE_CARTESIA_API_KEY;
let client: CartesiaClient | null = null;

if (cartesiaApiKey) {
  client = new CartesiaClient({ apiKey: cartesiaApiKey });
} else {
  console.warn('VITE_CARTESIA_API_KEY not found in environment variables. Speech synthesis will be disabled.');
}

// WebPlayer only supports raw PCM format with fp32le encoding.
const OUTPUT_FORMAT = {
  container: 'raw' as const,
  encoding: 'pcm_f32le' as const,
  sampleRate: 44100, // Common sample rate, ensure your voice model supports it or adjust as needed
};

/**
 * Speaks the provided text using the Cartesia TTS API and WebPlayer.
 * @param text The text to be spoken.
 * @returns Promise<void> A promise that resolves when speaking has completed or an error occurs.
 */
export const speakAssistantMessage = async (text: string, maxChars?: number): Promise<void> => {
  if (!client) {
    console.warn('Cartesia client not initialized. Cannot speak message.');
    return;
  }
  if (!text) {
    console.warn('No text provided to speak.');
    return;
  }

  // Process text to strip code and symbols
  const processed = processTextForTTS(text, maxChars);
  const spokenText = processed.spokenText;

  if (!spokenText) {
    console.warn('No speakable text after processing.');
    return;
  }

  let websocket;
  try {
    websocket = client.tts.websocket(OUTPUT_FORMAT);
    await websocket.connect();
  } catch (error) {
    console.error('Failed to connect to Cartesia WebSocket:', error);
    return;
  }

  try {
    // TODO: Make modelId and voice.id configurable (e.g., via .env or app settings)
    // Using example values from cartesia-js documentation for now.
    const modelId = import.meta.env.VITE_CARTESIA_MODEL_ID || 'sonic-2';
    const voiceId = import.meta.env.VITE_CARTESIA_VOICE_ID || '33fdfe6e-4f35-4779-9563-700dee55a43a';

    const ttsResponse = await websocket.send({
      modelId: modelId,
      voice: {
        mode: 'id' as const,
        id: voiceId,
      },
      transcript: spokenText,
    });

    const player = new WebPlayer({ bufferDuration: 1000 });
    console.log('Playing Cartesia TTS stream...');
    await player.play(ttsResponse.source);
    console.log('Cartesia TTS playback finished.');

  } catch (error) {
    console.error('Error during Cartesia TTS streaming or playback:', error);
    // The Cartesia SDK and WebPlayer likely handle stream and WebSocket closure internally
    // once playback is complete or if an error occurs during streaming.
    // Removing manual closure to avoid conflicts and rely on SDK's design.
  }
};
