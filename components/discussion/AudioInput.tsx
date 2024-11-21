import React, { useState, useEffect, useRef } from 'react';
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
  disabled?: boolean;
}

const AudioChatInput: React.FC<AudioChatInputProps> = ({
  onMessageSubmit,
  googleApiKey,
  googleEndpoint,
  userId,
  sessionId,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<GoogleSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const processingLoopRef = useRef<boolean>(false);
  
  const startRecording = async () => {
    try {
      // Clean up any existing resources
      await cleanup();

      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('Got audio chunk of size:', e.data.size);
          audioChunksRef.current.push(e.data);
        }
      };

      // Initialize speech recognition first
      console.log('Initializing speech recognition...');
      const newRecognition = new GoogleSpeechRecognition(googleApiKey, googleEndpoint);
      const started = await newRecognition.startListening();
      console.log('Speech recognition started:', started);
      recognitionRef.current = newRecognition;

      // Then start recording
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      console.log('MediaRecorder started');

      setIsListening(true);
      
      // Start processing loop
      startProcessingLoop();
    } catch (error) {
      console.error('Error starting recording:', error);
      cleanup();
    }
  };

  const startProcessingLoop = async () => {
    processingLoopRef.current = true;
    
    while (processingLoopRef.current) {
      try {
        if (!isProcessing && mediaRecorderRef.current && recognitionRef.current) {
          console.log('Processing cycle starting...');
          await processCurrentAudio();
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error('Error in processing loop:', error);
      }
    }
  };

  const processCurrentAudio = async () => {
    if (!recognitionRef.current || !mediaRecorderRef.current) {
      console.log('Missing refs:', { 
        recognition: !!recognitionRef.current, 
        recorder: !!mediaRecorderRef.current 
      });
      return;
    }
  
    try {
      setIsProcessing(true);
  
      // Get current audio chunks
      const currentChunks = [...audioChunksRef.current];
      if (currentChunks.length === 0) {
        console.log('No audio chunks to process');
        return;
      }
  
      audioChunksRef.current = []; // Clear for next batch
      
      // Create blob from current chunks
      const audioBlob = new Blob(currentChunks, { type: 'audio/webm' });
      console.log('Processing audio blob of size:', audioBlob.size);
  
      // Get transcription with retry
      let transcript = null;
      let retryCount = 0;
      const maxRetries = 2;
  
      while (retryCount <= maxRetries) {
        try {
          const result = await recognitionRef.current.stopListening();
          console.log('Transcription result:', result);
          
          transcript = result?.results?.[0]?.alternatives?.[0]?.transcript;
          if (transcript) break;
          
          retryCount++;
          if (retryCount <= maxRetries) {
            console.log(`Retrying transcription, attempt ${retryCount + 1}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error('Error getting transcription:', error);
          retryCount++;
        }
      }
  
      console.log('Final transcript:', transcript);
  
      if (transcript) {
        console.log('Submitting transcript:', transcript);
        await onMessageSubmit(transcript);
  
        // Only try pitch shifting and uploading if we have a valid transcript
        try {
          // Store the audio blob directly first
          const timestamp = new Date().toISOString();
          const filename = `recordings/${sessionId}/${userId}_${timestamp}.webm`;
          
          const { error: uploadError } = await supabaseClient.storage
            .from('audio-recordings')
            .upload(filename, audioBlob, {
              contentType: 'audio/webm',
              cacheControl: '3600'
            });
  
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabaseClient.storage
            .from('audio-recordings')
            .getPublicUrl(filename);
  
          // Update the message with the audio URL
          const { error: updateError } = await supabaseClient
            .from('messages')
            .update({ audio_url: publicUrl })
            .eq('content', transcript)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);
  
          if (updateError) throw updateError;
          
          console.log('Message updated with audio URL:', publicUrl);
  
          // Try pitch shifting in the background, but don't block on it
          (async () => {
            try {
              const pitchedAudioBlob = await pitchShiftAudio(audioBlob);
              const pitchedFilename = `recordings/${sessionId}/${userId}_${timestamp}_pitched.webm`;
              
              await supabaseClient.storage
                .from('audio-recordings')
                .upload(pitchedFilename, pitchedAudioBlob, {
                  contentType: 'audio/webm',
                  cacheControl: '3600'
                });
  
              console.log('Pitched audio uploaded successfully');
            } catch (pitchError) {
              console.error('Error processing pitched audio:', pitchError);
              // Continue even if pitch shifting fails
            }
          })();
        } catch (error) {
          console.error('Error uploading audio:', error);
        }
      }
  
      // Start new recognition session
      console.log('Starting new recognition session...');
      const newRecognition = new GoogleSpeechRecognition(googleApiKey, googleEndpoint);
      await newRecognition.startListening();
      recognitionRef.current = newRecognition;
      console.log('New recognition session started');
  
    } catch (error) {
      console.error('Error in processCurrentAudio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanup = async () => {
    console.log('Cleaning up...');
    processingLoopRef.current = false;
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      await recognitionRef.current.stopListening();
    }
    
    mediaRecorderRef.current = null;
    recognitionRef.current = null;
    audioChunksRef.current = [];
    setIsListening(false);
    setIsProcessing(false);
  };

  // ... (keep uploadToSupabase and pitchShiftAudio the same)

  const handleMicClick = async () => {
    if (disabled) return;
    
    try {
      if (isListening) {
        await cleanup();
      } else {
        await startRecording();
      }
    } catch (error) {
      console.error('Error in handleMicClick:', error);
      cleanup();
    }
  };

  useEffect(() => {
    if (!disabled) {
      console.log('Component mounted, starting recording...');
      startRecording();
    }
    
    return () => {
      cleanup();
    };
  }, [disabled]);

  const pitchShiftAudio = async (audioBlob: Blob, pitchFactor: number = 0.8): Promise<Blob> => {
    const audioContext = new AudioContext();
    const audioBuffer = await audioBlob.arrayBuffer()
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
    
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = pitchFactor;
    
    source.connect(offlineContext.destination);
    source.start();
    
    const renderedBuffer = await offlineContext.startRendering();
    const mediaDest = new MediaStreamAudioDestinationNode(audioContext);
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = renderedBuffer;
    bufferSource.connect(mediaDest);
    bufferSource.start();

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


  return (
    <Button
      onClick={handleMicClick}
      variant={isListening ? "destructive" : "secondary"}
      size="icon"
      className={`flex-shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || isProcessing}
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