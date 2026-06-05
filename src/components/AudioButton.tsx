import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';

export function AudioButton({ text, className = '' }: { text: string; className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = async () => {
    if (isPlaying || isLoading) return;
    
    setIsLoading(true);
    try {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: Set lang to Korean (or detect format) since mock is entirely Korean.
      // utterance.lang = 'ko-KR'; 
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      synthesis.speak(utterance);
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); playAudio(); }}
      disabled={isLoading || isPlaying}
      className={`p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ${className}`}
      title="Play Pronunciation"
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}
