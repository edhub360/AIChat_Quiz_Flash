
import { GoogleGenAI, Type } from '@google/genai';
import { QuizQuestion, Flashcard } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a 5-question multiple-choice quiz about ${topic}. Provide 4 options for each question. Indicate the correct answer for each.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "The quiz question."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 possible answers."
              },
              correctAnswer: {
                type: Type.STRING,
                description: "The correct answer from the options array."
              }
            },
            required: ["question", "options", "correctAnswer"]
          }
        },
      }
    });

    const jsonText = response.text;
    const quizData = JSON.parse(jsonText);
    return quizData as QuizQuestion[];

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. Please check the topic and try again.");
  }
};


export const generateFlashcards = async (topic: string): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 10 flashcards for the topic: ${topic}. Each flashcard should have a term and a concise definition.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: {
                type: Type.STRING,
                description: "The term or question for the front of the flashcard."
              },
              definition: {
                type: Type.STRING,
                description: "The definition or answer for the back of the flashcard."
              }
            },
            required: ["term", "definition"]
          }
        },
      }
    });
    
    const jsonText = response.text;
    const flashcardData = JSON.parse(jsonText);
    return flashcardData as Flashcard[];

  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. Please check the topic and try again.");
  }
};
