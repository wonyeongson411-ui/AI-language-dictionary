export const LANGUAGES = [
  'English',
  'Mandarin Chinese',
  'Japanese',
  'Korean',
  'Spanish',
  'French',
  'German',
  'Russian',
  'Arabic',
  'Portuguese',
];

export async function fetchDefinition(text: string, nativeLanguage: string, targetLanguage: string) {
  const res = await fetch('/api/dictionary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, nativeLanguage, targetLanguage }),
  });
  if (!res.ok) throw new Error('Failed to fetch definition');
  return res.json();
}

export async function fetchImage(text: string, coreExplanation: string) {
  const res = await fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, coreExplanation }),
  });
  if (!res.ok) throw new Error('Failed to fetch image');
  return res.json();
}

export async function fetchTTS(text: string) {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to fetch audio');
  return res.json();
}

export async function fetchStory(words: string[], nativeLanguage: string, targetLanguage: string) {
  const res = await fetch('/api/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words, nativeLanguage, targetLanguage }),
  });
  if (!res.ok) throw new Error('Failed to fetch story');
  return res.json();
}

export async function fetchChatResponse(message: string, contextWord: string, nativeLanguage: string, targetLanguage: string, history: any[]) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, contextWord, nativeLanguage, targetLanguage, history }),
  });
  if (!res.ok) throw new Error('Failed to fetch chat response');
  return res.json();
}

export async function fetchQuiz(words: any[]) {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words }),
  });
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}
