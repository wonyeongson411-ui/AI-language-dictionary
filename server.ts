import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/dictionary', async (req, res) => {
    try {
      const { text, nativeLanguage, targetLanguage } = req.body;
      
      const systemInstruction = 
        `You are a fun, lively language tutor speaking in ${nativeLanguage}. ` +
        `Your tone should be casual, like talking to a friend. Be concise. ` +
        `No greetings or fillers, get straight to the point. ` +
        `The user will give you a word, phrase, sentence, or text in ${targetLanguage} or ${nativeLanguage}. You need to figure out if they want to look up a word, understand a sentence, etc. ` +
        `Provide the result in the requested JSON format. Core explanation should be natural and not like a raw encyclopedia. Provide exactly 3 examples ('simple', 'natural', 'advanced'). Explain confusing words directly like "this one is more...". Provide collocations, common mistakes to avoid ("don't say X, say Y"), a memory aid (mnemonic/story), and pronunciation tips if applicable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Analyze and explain "${text}" (from ${targetLanguage} perspective for a ${nativeLanguage} speaker)`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              wordInTarget: { type: Type.STRING },
              coreExplanation: { type: Type.STRING },
              usageContext: {
                type: Type.OBJECT,
                properties: {
                  scenarios: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tone: { type: Type.STRING }
                },
                required: ["scenarios", "tone"]
              },
              examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ['simple', 'natural', 'advanced'] },
                    target: { type: Type.STRING },
                    native: { type: Type.STRING }
                  },
                  required: ["type", "target", "native"]
                }
              },
              synonyms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    difference: { type: Type.STRING }
                  },
                  required: ["word", "difference"]
                }
              },
              collocations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phrase: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    example: { type: Type.STRING }
                  },
                  required: ["phrase", "explanation", "example"]
                }
              },
              commonMistake: {
                type: Type.OBJECT,
                properties: {
                  wrong: { type: Type.STRING },
                  right: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                nullable: true
              },
              memoryAid: { type: Type.STRING },
              pronunciationTip: { type: Type.STRING }
            },
            required: ["wordInTarget", "coreExplanation", "usageContext", "examples", "synonyms", "collocations", "memoryAid", "pronunciationTip"]
          }
        }
      });
      
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error('Dictionary logic error:', error);
      res.status(500).json({ error: 'Failed to generate definition' });
    }
  });

  app.post('/api/image', async (req, res) => {
    try {
      const { text, coreExplanation } = req.body;
      
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A vibrant, pop-art style colorful illustration visually representing the concept of the word "${text}", which means "${coreExplanation}". Bright colors, rounded shapes, highly expressive, clean minimalist background.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        }
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64EncodeString = response.generatedImages[0].image.imageBytes;
        return res.json({ imageUrl: `data:image/jpeg;base64,${base64EncodeString}` });
      }
      throw new Error('No image found');
    } catch (error) {
      console.error('Image logic error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, contextWord, nativeLanguage, targetLanguage, history } = req.body;
      
      const systemInstruction = `You are a friendly language tutor helping the user understand the word "${contextWord}" in ${targetLanguage}. The user's native language is ${nativeLanguage}. Respond to their questions in ${nativeLanguage}. Keep it conversational, short, and to the point. No markdown headings. Provide target language audio pronunciations using TTS if you give examples, but since this is text only, just give the text and the user can press the audio button on the UI if they want. Answer the user's specific context question clearly.`;

      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: { systemInstruction }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error('Chat logic error:', error);
      res.status(500).json({ error: 'Failed to generate chat response' });
    }
  });

  app.post('/api/quiz', async (req, res) => {
    try {
      const { words } = req.body;
      const wordsList = words.map((w: any) => `${w.wordInTarget} (${w.coreExplanation})`).join(', ');

      const systemInstruction = 
        `You are a quiz master. Create a diverse quiz using these words: ${wordsList}. Generate 4 questions.
        Question types include:
        - "multiple_choice": provide a native phrase, ask for the target translation.
        - "fill_blank": provide a target language sentence with a blank.
        - "listening": provide the target word as the 'answer' so the frontend can play TTS.
        - "sentence_completion": provide a native scenario, ask which target word fits best.
        Always provide exactly 4 options for choices if applicable, and clearly indicate the correct answer.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: 'Generate the quiz now.',
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ['multiple_choice', 'fill_blank', 'listening', 'sentence_completion'] },
                    questionText: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["type", "questionText", "options", "correctAnswer"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error('Quiz logic error:', error);
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  });

  app.post('/api/tts', async (req, res) => {
    try {
      const { text } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audio: base64Audio });
      }
      throw new Error('No audio found');
    } catch (error) {
      console.error('TTS logic error:', error);
      res.status(500).json({ error: 'Failed to generate speech' });
    }
  });

  app.post('/api/story', async (req, res) => {
    try {
      const { words, nativeLanguage, targetLanguage } = req.body;
      
      const wordsList = words.join(', ');
      const systemInstruction = `You are a fun storyteller in ${nativeLanguage}. Make up a short, engaging, casual story incorporating these ${targetLanguage} words: ${wordsList}. Highlight the ${targetLanguage} words in the story text (e.g. using **bold**). Keep it concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Create a story to help me memorize: ${wordsList}`,
        config: {
          systemInstruction,
        }
      });
      
      res.json({ story: response.text });
    } catch (error) {
      console.error('Story logic error:', error);
      res.status(500).json({ error: 'Failed to generate story' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
