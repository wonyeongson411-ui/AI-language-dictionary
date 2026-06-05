/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SavedWord } from './types';
import { DictionarySearch } from './components/DictionarySearch';
import { Notebook } from './components/Notebook';
import { StudyMode } from './components/StudyMode';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'notebook' | 'study'>('search');
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);

  // Simple local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem('lingolens_words');
    if (saved) {
      try {
        setSavedWords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved words', e);
      }
    }
  }, []);

  const handleSaveWord = (word: SavedWord) => {
    const newWords = [...savedWords, word];
    setSavedWords(newWords);
    localStorage.setItem('lingolens_words', JSON.stringify(newWords));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-pink-200">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">LingoLens</h1>
          </div>
          
          {activeTab !== 'study' && (
            <div className="flex bg-neutral-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button 
                onClick={() => setActiveTab('notebook')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'notebook' ? 'bg-white text-pink-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Notebook</span>
                {savedWords.length > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === 'notebook' ? 'bg-pink-100' : 'bg-neutral-200'}`}>
                    {savedWords.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DictionarySearch onSaveWord={handleSaveWord} savedWords={savedWords} />
            </motion.div>
          )}
          {activeTab === 'notebook' && (
            <motion.div
              key="notebook"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Notebook savedWords={savedWords} onStartStudy={() => setActiveTab('study')} />
            </motion.div>
          )}
          {activeTab === 'study' && (
            <motion.div
              key="study"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <StudyMode words={savedWords} onExit={() => setActiveTab('notebook')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
