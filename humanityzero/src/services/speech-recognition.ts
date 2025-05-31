import { createClient, LiveTranscriptionEvents, LiveClient } from '@deepgram/sdk';

let mediaRecorder: MediaRecorder | null = null;
let dgConnection: LiveClient | null = null;

const DEEPGRAM_API_KEY = process.env.REACT_APP_DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error(
    'Deepgram API Key not found. Please set REACT_APP_DEEPGRAM_API_KEY or VITE_DEEPGRAM_API_KEY in your environment variables.'
  );
}

const deepgram = DEEPGRAM_API_KEY ? createClient(DEEPGRAM_API_KEY) : null;

interface SpeechRecognitionHandlers {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStatus: (status: string) => void; // e.g., 'connecting', 'connected', 'listening', 'stopped', 'error'
}

export const initializeSpeechRecognition = async (handlers: SpeechRecognitionHandlers): Promise<void> => {
  if (!deepgram) {
    handlers.onError('Deepgram client not initialized. API Key missing.');
    handlers.onStatus('error');
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    handlers.onError('getUserMedia not supported on your browser!');
    handlers.onStatus('error');
    return;
  }

  try {
    handlers.onStatus('requesting_mic');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // Or other supported mime types

    dgConnection = deepgram.listen.live({
      model: 'nova-2', // Or your preferred model
      language: 'en-US',
      smart_format: true,
      interim_results: true,
      utterance_end_ms: 1000,
      vad_events: true,
    });

    dgConnection.on(LiveTranscriptionEvents.Open, () => {
      handlers.onStatus('connected_dg');
      mediaRecorder?.start(250); // Start recording and emit data every 250ms
    });

    dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel.alternatives[0].transcript;
      if (transcript) {
        handlers.onTranscript(transcript, data.is_final);
      }
    });

    dgConnection.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
      if (data.is_final && data.speech_final) {
        // You might want to handle utterance end specifically if needed
      }
    });

    dgConnection.on(LiveTranscriptionEvents.Close, () => {
      handlers.onStatus('disconnected_dg');
    });

    dgConnection.on(LiveTranscriptionEvents.Error, (error) => {
      console.error('Deepgram error:', error);
      handlers.onError(`Deepgram connection error: ${error.message || error}`);
      handlers.onStatus('error_dg');
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && dgConnection?.getReadyState() === WebSocket.OPEN) {
        dgConnection.send(event.data);
      }
    };

    mediaRecorder.onstart = () => {
      handlers.onStatus('listening');
    };

    mediaRecorder.onstop = () => {
      handlers.onStatus('stopped_mic');
      // Clean up microphone stream tracks
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      handlers.onError(`MediaRecorder error: ${(event as any).error?.message || 'Unknown MediaRecorder error'}`);
      handlers.onStatus('error_mic');
    };

  } catch (err) {
    console.error('Error initializing speech recognition:', err);
    handlers.onError(`Initialization error: ${(err as Error).message || err}`);
    handlers.onStatus('error');
  }
};

export const startTranscription = (): void => {
  if (dgConnection && dgConnection.getReadyState() !== WebSocket.OPEN) {
    // Attempt to reconnect or re-initialize if connection is not open.
    // For simplicity, we assume it's ready or will be handled by Open event.
    // A more robust solution might involve explicit connect/reconnect logic here.
    console.warn('Deepgram connection not open. Attempting to proceed, but may fail.');
  }
  // MediaRecorder is started when dgConnection opens.
  // If it's already open and recorder stopped, this might need explicit mediaRecorder.start()
  // but current logic ties recorder start to dgConnection.Open event.
};

export const stopTranscription = async (): Promise<void> => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  if (dgConnection) {
    if (dgConnection.getReadyState() === WebSocket.OPEN) {
      await dgConnection.finish();
    }
    dgConnection = null; // Allow re-initialization
  }
  mediaRecorder = null; // Allow re-initialization
};
