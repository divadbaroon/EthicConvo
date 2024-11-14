import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// @ts-ignore
import { GoogleSpeechRecognition } from 'google-cloud-speech-webaudio';
import { supabaseClient } from '@/lib/database/supabase/client';

interface AudioChatInputProps {
  onMessageSubmit: (message: string) => Promise<void>;
  googleApiKey: string;
  googleEndpoint?: string;
  userId: string; 
  sessionId: string; 
}

const AudioChatInput: React.FC<AudioChatInputProps> = ({
  onMessageSubmit,
  googleApiKey,
  googleEndpoint,
  userId,
  sessionId
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<GoogleSpeechRecognition | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const pitchShiftAudio = async (audioBlob: Blob, pitchFactor: number = 0.8): Promise<Blob> => {
    const audioContext = new AudioContext();
    const audioBuffer = await audioBlob.arrayBuffer()
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
    
    // Create offline context for processing
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Create source and pitch shifter
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = pitchFactor; // Lower pitch by reducing playback rate
    
    // Connect and start
    source.connect(offlineContext.destination);
    source.start();
    
    // Render and convert back to blob
    const renderedBuffer = await offlineContext.startRendering();
    const mediaDest = new MediaStreamAudioDestinationNode(audioContext);
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = renderedBuffer;
    bufferSource.connect(mediaDest);
    bufferSource.start();

    // Create a new MediaRecorder to capture the processed audio
    const processedRecorder = new MediaRecorder(mediaDest.stream);
    const processedChunks: Blob[] = [];

    return new Promise((resolve) => {
      processedRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          processedChunks.push(e.data);
        }
      };

      processedRecorder.onstop = () => {
        const processedBlob = new Blob(processedChunks, { type: 'audio/webm' });
        resolve(processedBlob);
      };

      processedRecorder.start();
      setTimeout(() => processedRecorder.stop(), renderedBuffer.duration * 1000 + 100);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);

      // Initialize speech recognition
      const newRecognition = new GoogleSpeechRecognition(googleApiKey, googleEndpoint);
      await newRecognition.startListening();
      setRecognition(newRecognition);
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    return new Promise<Blob>((resolve) => {
      if (mediaRecorder) {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
        };
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    });
  };

  const uploadToSupabase = async (audioBlob: Blob) => {
    try {
      const timestamp = new Date().toISOString();
      const filename = `recordings/${sessionId}/${userId}_${timestamp}.webm`;
      
      const { data, error } = await supabaseClient.storage
        .from('audio-recordings')
        .upload(filename, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600'
        });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabaseClient.storage
        .from('audio-recordings')
        .getPublicUrl(filename);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  };

  const handleMicClick = async () => {
    try {
      if (isListening && recognition) {
        setIsListening(false);
        setIsProcessing(true);
        
        // Stop recording and get audio blob
        const audioBlob = await stopRecording();
        
        // Get transcription immediately
        const result = await recognition.stopListening();
        const transcript = result.results[0].alternatives[0].transcript;
        
        if (transcript) {
          // Show message immediately
          await onMessageSubmit(transcript);
          
          // Process audio in the background
          (async () => {
            try {
              // Pitch shift the audio
              const pitchedAudioBlob = await pitchShiftAudio(audioBlob);
              
              // Upload pitched audio
              const audioUrl = await uploadToSupabase(pitchedAudioBlob);
              
              // Update the message with the audio URL
              await supabaseClient
                .from('messages')
                .update({ audio_url: audioUrl })
                .eq('content', transcript)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1);
            } catch (error) {
              console.error('Error processing audio:', error);
            }
          })();
        }
        
        setRecognition(null);
        setMediaRecorder(null);
        setAudioChunks([]);
      } else {
        await startRecording();
      }
    } catch (error) {
      console.error('Error in handleMicClick:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleMicClick}
      variant={isListening ? "destructive" : "secondary"}
      size="icon"
      className="flex-shrink-0"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default AudioChatInput;