import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface MicrophoneButtonProps {
  onTranscription: (text: string) => void;
  onSpeech: (text: string) => void;
}

export const MicrophoneButton = ({ 
  onTranscription, 
  onSpeech
}: MicrophoneButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const shouldKeepRecording = useRef(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        // Only process final results to avoid duplication
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            console.log('Final transcript:', transcript);
            
            // Immediately send the transcript
            if (transcript.trim()) {
              onTranscription(transcript.trim());
            }
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        // If we should keep recording, restart it automatically
        if (shouldKeepRecording.current) {
          console.log('Restarting speech recognition...');
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
            shouldKeepRecording.current = false;
            setIsRecording(false);
          }
        } else {
          setIsRecording(false);
        }
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
  }, [onTranscription]);

  const toggleMicrophone = () => {
    if (isRecording) {
      // Stop recording
      console.log('Stopping recording...');
      shouldKeepRecording.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      console.log('Starting recording...');
      shouldKeepRecording.current = true;
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        } else {
          alert('Speech recognition is not available in your browser');
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Error: ' + error.message);
        shouldKeepRecording.current = false;
        setIsRecording(false);
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
      className={`border border-white squish-button ${
        isRecording 
          ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
          : 'bg-accent hover:bg-accent/90'
      }`}
    >
      {isRecording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
