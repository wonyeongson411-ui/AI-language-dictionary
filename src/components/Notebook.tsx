import { useState } from 'react';
import { SavedWord } from '../types';
import { fetchStory } from '../utils';
import { AudioButton } from './AudioButton';
import { BookOpen, Sparkles, Wand2, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Notebook({
  savedWords,
  onStartStudy
}: {
  savedWords: SavedWord[];
  onStartStudy: () => void;
}) {
  const [story, setStory] = useState<{ text: string, isLoading: boolean } | null>(null);

  const generateStory = async () => {
    if (savedWords.length === 0) return;
    
    const recentWords = savedWords.slice(-10);
    const nativeLanguage = recentWords[0].nativeLanguage;
    const targetLanguage = recentWords[0].targetLanguage;
    const wordsList = recentWords.map(w => w.wordInTarget);

    try {
      setStory({ text: '', isLoading: true });
      const res = await fetchStory(wordsList, nativeLanguage, targetLanguage);
      setStory({ text: res.story, isLoading: false });
    } catch (e) {
      console.error(e);
      setStory(null);
      alert('Failed to generate story.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-32">
      
      {/* Daily Streak Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl">🔥</span>
          </div>
          <div>
            <h3 className="text-2xl font-black">2 Day Streak!</h3>
            <p className="text-pink-100 font-medium">Keep it going. Review {Math.max(5, savedWords.length)} words today.</p>
          </div>
        </div>
        <button 
          onClick={onStartStudy}
          disabled={savedWords.length === 0}
          className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold hover:bg-pink-50 transition-colors shadow-lg disabled:opacity-50 w-full md:w-auto"
        >
          Review Now
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <BookOpen className="w-8 h-8 text-blue-500" />
            My Notebook
          </h2>
          <p className="text-gray-500 mt-2 font-medium">{savedWords.length} words saved for review</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={generateStory}
            disabled={savedWords.length === 0 || story?.isLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-pink-100 text-pink-700 px-6 py-3 rounded-2xl font-bold hover:bg-pink-200 transition-colors disabled:opacity-50"
          >
            {story?.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            Make a Story
          </button>
          <button 
            onClick={onStartStudy}
            disabled={savedWords.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            <Play className="w-5 h-5 fill-current" />
            Study Mode
          </button>
        </div>
      </div>

      <AnimatePresence>
        {story && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-100 p-6 md:p-8 rounded-3xl relative">
              <Sparkles className="absolute top-6 right-6 text-pink-300 w-8 h-8" />
              <h3 className="text-xl font-bold text-pink-900 mb-4">Memory Story</h3>
              {story.isLoading ? (
                <div className="flex items-center gap-3 text-pink-600 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" /> Weaving your words into a tale...
                </div>
              ) : (
                <div className="prose prose-pink max-w-none">
                   <p className="whitespace-pre-wrap text-pink-950 font-medium leading-relaxed text-lg" dangerouslySetInnerHTML={{__html: story.text.replace(/\*\*(.*?)\*\*/g, '<span class="bg-pink-200 px-1 rounded text-pink-900 font-bold">$1</span>')}} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedWords.slice().reverse().map(word => (
          <motion.div 
            key={word.savedAt}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100 flex flex-col"
          >
            {word.imageUrl && (
              <div className="h-40 w-full overflow-hidden shrink-0 border-b border-gray-100">
                <img src={word.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" crossOrigin="anonymous"/>
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{word.wordInTarget}</h3>
                <AudioButton text={word.wordInTarget} className="scale-75 -mt-2 -mr-2 bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500" />
              </div>
              <p className="text-gray-600 font-medium line-clamp-3 text-sm">{word.coreExplanation}</p>
              
              <div className="mt-auto pt-4 flex gap-2 flex-wrap">
                <span className="inline-block px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-wider">
                  {word.targetLanguage}
                </span>
                {word.examples && word.examples.length > 0 && (
                  <span className="inline-block px-2 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded uppercase tracking-wider">
                    {word.examples.length} Ex
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {savedWords.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">
            No words saved yet. Go search for some cool concepts!
          </div>
        )}
      </div>
    </div>
  );
}
