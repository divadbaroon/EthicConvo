import * as Tone from 'tone';

export class AudioAnonymizer {
  private context: Tone.BaseContext;
  
  constructor() {
    this.context = Tone.getContext();
  }

  async anonymizeAudio(audioBlob: Blob): Promise<Blob> {
    const decodeContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await decodeContext.decodeAudioData(arrayBuffer);
    
    // Create Tone.js nodes
    const player = new Tone.Player().toDestination();
    const pitchShift = new Tone.PitchShift({
      pitch: -8, // Shifts voice down significantly but keeps intelligibility
      windowSize: 0.1,
      delayTime: 0
    });
    
    // Simple chain: player -> pitch shift -> output
    player.chain(pitchShift, Tone.Destination);
    
    const outputContext = new AudioContext();
    const dest = outputContext.createMediaStreamDestination();
    const recorder = new MediaRecorder(dest.stream);
    const chunks: Blob[] = [];
    
    const gainNode = outputContext.createGain();
    Tone.connect(pitchShift, gainNode);
    gainNode.connect(dest);
    
    return new Promise((resolve) => {
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = async () => {
        const anonymizedBlob = new Blob(chunks, { type: 'audio/webm' });
        
        // Cleanup
        player.dispose();
        pitchShift.dispose();
        gainNode.disconnect();
        await outputContext.close();
        await decodeContext.close();
        
        resolve(anonymizedBlob);
      };
      
      recorder.start();
      player.buffer = new Tone.ToneAudioBuffer(audioBuffer);
      player.start();
      
      player.onstop = () => {
        recorder.stop();
      };
    });
  }
}