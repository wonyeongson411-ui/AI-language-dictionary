import { useState, useRef, useEffect } from 'react';
import { LANGUAGES, fetchDefinition, fetchChatResponse } from '../utils';
import { DefinitionResult, SavedWord } from '../types';
import { AudioButton } from './AudioButton';
import { Bookmark, BookmarkCheck, Search, Loader2, Sparkles, MessageCircle, Send, AlertTriangle, Lightbulb, BookOpen, Repeat, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function DictionarySearch({
  onSaveWord,
  savedWords
}: {
  onSaveWord: (word: SavedWord) => void;
  savedWords: SavedWord[];
}) {
  const [native, setNative] = useState(LANGUAGES[0]);
  const [target, setTarget] = useState(LANGUAGES[3]); // Default Korean
  const [query, setQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DefinitionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setErrorMessage('');
    setIsChatOpen(false);
    setChatHistory([]);
    try {
      const def = await fetchDefinition(query, native, target);
      setResult({ ...def });
    } catch (e) {
      console.error(e);
      setErrorMessage('这个词暂时还没有收录在演示词库中，你可以先试试：설렘、눈치、답답하다、트렌드、분위기。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !result) return;

    const message = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: message }]);
    setIsChatLoading(true);

    try {
      const res = await fetchChatResponse(message, result.wordInTarget, native, target, chatHistory);
      setChatHistory(prev => [...prev, { role: 'model', text: res.text }]);
    } catch (e) {
      console.error('Chat error', e);
      alert('Failed to get chat response.');
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const isSaved = result && savedWords.some(w => w.wordInTarget === result.wordInTarget && w.targetLanguage === target);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-32">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-500/5">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">母语</label>
              <select 
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:ring-0 outline-none transition-colors text-lg font-medium text-gray-700"
                value={native}
                onChange={e => setNative(e.target.value)}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">学习语言</label>
              <select 
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-pink-500 focus:ring-0 outline-none transition-colors text-lg font-medium text-gray-700"
                value={target}
                onChange={e => setTarget(e.target.value)}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="你想查询什么词？(试试: 설렘, 눈치)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-6 pr-16 py-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 outline-none text-xl transition-all shadow-inner placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className="absolute right-3 top-3 bottom-3 aspect-square bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </div>
          {errorMessage && (
            <div className="text-red-500 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg font-medium">
              {errorMessage}
            </div>
          )}
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Left Col: Main Rich Content */}
            <div className="flex-1 space-y-8">
              
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 leading-tight">
                      {result.wordInTarget}
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed bg-blue-50 px-4 py-2 rounded-xl inline-block">
                      {result.coreExplanation}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <AudioButton text={result.wordInTarget} className="w-12 h-12 flex items-center justify-center" />
                    <button 
                      onClick={() => {
                        if (!isSaved) {
                          onSaveWord({ ...result, nativeLanguage: native, targetLanguage: target, savedAt: Date.now() });
                        }
                      }}
                      disabled={isSaved}
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isSaved ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                      title={isSaved ? "已保存" : "保存到笔记本"}
                    >
                      {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-bold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> 语气: {result.usageContext.tone}
                  </span>
                  {result.usageContext.scenarios.map((sc, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold">
                      {sc}
                    </span>
                  ))}
                </div>

                {result.pronunciationTip && (
                  <div className="mt-4 text-gray-500 text-sm font-medium bg-gray-50 p-3 rounded-xl">
                    🗣️ 发音提示: {result.pronunciationTip}
                  </div>
                )}
              </div>

              {/* Examples Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> 例句展示
                </h3>
                <div className="grid gap-4">
                  {result.examples.map((ex, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3 relative group">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AudioButton text={ex.target} className="scale-90" />
                      </div>
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold uppercase rounded-md ${
                        ex.type === 'simple' ? 'bg-green-100 text-green-700' : 
                        ex.type === 'natural' ? 'bg-blue-100 text-blue-700' : 
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {ex.type}
                      </span>
                      <p className="text-xl font-medium text-gray-900 pr-10">{ex.target}</p>
                      <p className="text-gray-500">{ex.native}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collocations */}
              {result.collocations && result.collocations.length > 0 && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-orange-500" /> 常用搭配
                  </h3>
                  <div className="space-y-4">
                    {result.collocations.map((col, i) => (
                      <div key={i} className="border-l-4 border-orange-200 pl-4 py-1">
                        <p className="font-bold text-gray-900 text-lg flex justify-between items-center">
                          {col.phrase}
                          <AudioButton text={col.phrase} className="bg-transparent text-gray-400 hover:text-blue-500 scale-75 -mr-2" />
                        </p>
                        <p className="text-gray-600 font-medium text-sm my-1">{col.explanation}</p>
                        <p className="text-gray-500 text-sm italic">"{col.example}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confusing Words & Synonyms */}
              {result.synonyms && result.synonyms.length > 0 && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Repeat className="w-5 h-5 text-purple-500" /> 相近词区别
                  </h3>
                  <div className="space-y-3">
                    {result.synonyms.map((syn, i) => (
                      <div key={i} className="flex gap-4 items-start bg-gray-50 p-3 rounded-xl">
                        <span className="font-bold text-purple-700 text-lg whitespace-nowrap">{syn.word}</span>
                        <span className="text-gray-600 mt-0.5">{syn.difference}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col: Cautions, Memory, Chat */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              
              {/* Memory Aid */}
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-3xl border border-pink-100">
                <h3 className="text-pink-800 font-bold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" /> 记忆辅助
                </h3>
                <p className="text-pink-900/80 leading-relaxed font-medium">{result.memoryAid}</p>
              </div>

              {/* Common Mistake */}
              {result.commonMistake && (
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                  <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> 错用提醒
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-red-900"><span className="line-through opacity-70">不要说: {result.commonMistake.wrong}</span></p>
                    <p className="text-green-700 font-bold bg-green-100/50 p-2 rounded-lg">建议说: {result.commonMistake.right}</p>
                    <p className="text-red-800/80 mt-2">{result.commonMistake.reason}</p>
                  </div>
                </div>
              )}

              {/* Practice Chat Trigger / Panel */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[400px]">
                <div 
                  className="bg-blue-500 p-4 text-white font-bold flex items-center justify-between cursor-pointer"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <span className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> AI 聊天练习</span>
                  <span className="text-blue-200 text-sm">{isChatOpen ? '收起' : '展开'}</span>
                </div>
                
                {isChatOpen && (
                  <div className="flex-1 flex flex-col bg-gray-50 h-full">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-700 text-sm border border-gray-100 max-w-[90%]">
                        你好！想练习用 "{result.wordInTarget}" 吗？你可以问我它和别的词的区别，或者试着用它造句！
                      </div>
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-2xl shadow-sm text-sm max-w-[90%] ${
                            msg.role === 'user' 
                              ? 'bg-blue-500 text-white rounded-tr-none' 
                              : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-500 text-sm border border-gray-100">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleChat} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="输入内容..."
                        className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-500 text-white p-2 rounded-xl disabled:opacity-50">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
