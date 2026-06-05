export type ExampleType = 'simple' | 'natural' | 'advanced';

export type Example = {
  type: ExampleType;
  target: string;
  native: string;
};

export type DefinitionResult = {
  wordInTarget: string;
  coreExplanation: string;
  usageContext: {
    scenarios: string[];
    tone: string;
  };
  examples: Example[];
  synonyms: { word: string; difference: string }[];
  collocations: { phrase: string; explanation: string; example: string }[];
  commonMistake: { wrong: string; right: string; reason: string } | null;
  memoryAid: string;
  pronunciationTip: string;
};

export type SavedWord = DefinitionResult & {
  nativeLanguage: string;
  targetLanguage: string;
  savedAt: number;
};
