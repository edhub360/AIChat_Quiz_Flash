export enum Module {
  AI_CHAT,
  QUIZ,
  FLASHCARD,
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface SavedFlashcardSet {
  name: string;
  topic: string;
  flashcards: Flashcard[];
}
