import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { fetchTTS } from '../utils';

export function AudioButton({ text, className = '' }: { text: string; className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = async () => {
    if (isPlaying || isLoading) return;
    
    try {
      setIsLoading(true);
      const { audio } = await fetchTTS(text);
      
      const binary = atob(audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'audio/pcm;rate=24000' });
      const url = URL.createObjectURL(blob);
      const audioEl = new Audio(url);
      
      setIsPlaying(true);
      
      audioEl.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      
      audioEl.play();
    } catch (e) {
      console.error(e);
      // Fallback to web speech api on error if we want? 
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      synthesis.speak(utterance);
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={playAudio}
      disabled={isLoading || isPlaying}
      className={`p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ${className}`}
      title="Play Pronunciation"
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}
