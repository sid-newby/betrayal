
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface MicrophoneButtonProps {
  onTranscription: (text: string) => void;
  onSpeech: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const MicrophoneButton = ({ 
  onTranscription, 
  onSpeech, 
  isListening, 
  setIsListening 
}: MicrophoneButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          onTranscription(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onTranscription, setIsListening]);

  const toggleMicrophone = async () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsListening(false);
    } else {
      // Start recording
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsRecording(true);
          setIsListening(true);
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && text) {
      synthRef.current.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
      onSpeech(text);
    }
  };

  // Expose speakText function
  useEffect(() => {
    (window as any).speakText = speakText;
  }, []);

  return (
    <Button
      onClick={toggleMicrophone}
      disabled={isListening}
      className="bg-accent hover:bg-accent/90 border border-white squish-button"
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
