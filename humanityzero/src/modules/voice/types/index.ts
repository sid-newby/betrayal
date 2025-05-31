export interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

export interface VoiceSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export interface VoiceState {
  isListening: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
}
