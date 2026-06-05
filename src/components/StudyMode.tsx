import { useState } from 'react';
import { SavedWord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, RotateCcw, Volume2, LayoutGrid, BrainCircuit, Loader2, Repeat } from 'lucide-react';
import { fetchQuiz } from '../utils';

type StudyState = 'menu' | 'flashcards' | 'quiz';

export function StudyMode({
  words,
  onExit
}: {
  words: SavedWord[];
  onExit: () => void;
}) {
  const [mode, setMode] = useState<StudyState>('menu');

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardDone, setFlashcardDone] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = async () => {
    setMode('quiz');
    setQuizLoading(true);
    try {
      const { questions } = await fetchQuiz({ words: words.slice(-10) }); // Send up to 10 recent words
      setQuizQuestions(questions);
    } catch (e) {
      console.error(e);
      alert('Failed to generate quiz.');
      setMode('menu');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (cardIndex < words.length - 1) {
        setCardIndex(prev => prev + 1);
      } else {
        setFlashcardDone(true);
      }
    }, 150);
  };

  const playAudio = async (text: string) => {
    try {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuizAnswer = (opt: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(opt);
    setShowExplanation(true);
    if (opt === quizQuestions[quizIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setQuizDone(true);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8 pt-10">
        <button onClick={onExit} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-gray-900 mb-8 inline-block">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-black text-gray-900 text-center mb-10">准备好练习了吗？</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => setMode('flashcards')}
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group active:scale-95"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">生成闪卡</h3>
            <p className="text-gray-500 font-medium">翻转卡片，加深记忆。</p>
          </div>
          <div 
            onClick={startQuiz}
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 flex flex-col items-center text-center group active:scale-95"
          >
            <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">智能测验</h3>
            <p className="text-gray-500 font-medium">AI 根据你保存的词汇生成的测试。</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    if (quizLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
          <p className="text-gray-500 font-medium text-lg">AI 正在生成考卷...</p>
        </div>
      );
    }
    if (quizDone) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900">测验完成！</h2>
          <p className="text-2xl font-bold text-gray-500">得分: <span className="text-blue-500">{score}</span> / {quizQuestions.length}</p>
          <div className="flex gap-4 pt-8">
            <button onClick={() => { setMode('menu'); setQuizIndex(0); setQuizDone(false); setScore(0); }} className="px-6 py-3 bg-gray-100 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
              返回菜单
            </button>
            <button onClick={onExit} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors">
              返回笔记本
            </button>
          </div>
        </div>
      );
    }

    const q = quizQuestions[quizIndex];

    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => { setMode('menu'); setQuizIndex(0); setScore(0); }} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-400">得分: {score}</span>
          <span className="font-bold text-gray-400 font-mono text-sm">
            第 {quizIndex + 1} / {quizQuestions.length} 题
          </span>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              {q.questionText}
            </h3>
            {q.type === 'listening' && (
              <button onClick={() => playAudio(q.correctAnswer)} className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 shrink-0">
                <Volume2 className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => {
              let btnClass = "w-full text-left p-4 rounded-2xl font-medium text-lg border-2 transition-all ";
              if (selectedAnswer === null) {
                btnClass += "bg-white border-gray-100 hover:border-blue-500 hover:bg-blue-50";
              } else {
                if (opt === q.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-900";
                } else if (opt === selectedAnswer) {
                  btnClass += "bg-red-50 border-red-500 text-red-900 line-through opacity-70";
                } else {
                  btnClass += "bg-gray-50 border-gray-100 opacity-50";
                }
              }

              return (
                <button 
                  key={i} 
                  disabled={selectedAnswer !== null}
                  onClick={() => handleQuizAnswer(opt)}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 border-t border-gray-100 space-y-4">
              <p className="text-gray-700 font-medium bg-blue-50 p-4 rounded-xl">{q.explanation}</p>
              <button onClick={nextQuizQuestion} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
                下一题
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Flashcards mode
  const word = words[cardIndex];

  if (flashcardDone) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">恭喜！</h2>
        <p className="text-gray-500 font-medium">复习了 {words.length} 个词汇。</p>
        <div className="flex gap-4">
          <button onClick={() => { setMode('menu'); setCardIndex(0); setFlashcardDone(false); setIsFlipped(false); }} className="px-6 py-3 bg-gray-100 font-bold rounded-2xl hover:bg-gray-200 transition-colors flex items-center gap-2">
            返回菜单
          </button>
          <button onClick={onExit} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors">
            返回笔记本
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setMode('menu')} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5 h-2 bg-gray-100 rounded-full flex-1 mx-6 overflow-hidden">
          {words.map((_, i) => (
            <div key={i} className={`h-full flex-1 rounded-full transition-colors duration-300 ${i <= cardIndex ? 'bg-blue-500' : 'bg-transparent'}`} />
          ))}
        </div>
        <span className="font-bold text-gray-400 font-mono text-sm">
          {cardIndex + 1} / {words.length}
        </span>
      </div>

      <div className="relative w-full aspect-[3/4] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-8 flex items-center justify-center text-center relative z-10 bg-white h-full">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">{word.wordInTarget}</h2>
            </div>
            <div className="absolute bottom-6 w-full text-center text-gray-400 font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2">
               <Repeat className="w-4 h-4" /> 点击翻转
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-xl text-white p-8 md:p-12 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] overflow-y-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 shrink-0">{word.wordInTarget}</h2>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full mb-8 shrink-0">
              <p className="text-xl md:text-2xl font-medium">{word.coreExplanation}</p>
            </div>
            
            {word.examples && word.examples[0] && (
              <div className="w-full text-left space-y-2 mb-8 bg-black/20 p-6 rounded-2xl shrink-0 relative">
                <div className="flex justify-between items-start gap-4 pr-12">
                  <p className="text-lg md:text-xl font-medium italic opacity-90">"{word.examples[0].target}"</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); playAudio(word.examples[0].target); }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0 absolute right-4 top-4"
                >
                  <Volume2 className="w-5 h-5 fill-current" />
                </button>
                <p className="text-blue-200 mt-2">{word.examples[0].native}</p>
              </div>
            )}

            <div className="mt-auto pt-8 shrink-0 w-full flex justify-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCard();
                }}
                className="bg-white text-indigo-700 px-10 py-5 rounded-2xl w-full max-w-xs font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                {cardIndex < words.length - 1 ? '懂了，下一个' : '完成'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
