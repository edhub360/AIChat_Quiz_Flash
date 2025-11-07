import React, { useState, useEffect } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard, SavedFlashcardSet } from '../types';
import { TrashIcon } from './icons/Icons';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

const FLASHCARD_SETS_STORAGE_KEY = 'geminiStudyBuddy_flashcardSets';

const FlashcardGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [savedSets, setSavedSets] = useState<SavedFlashcardSet[]>([]);

  useEffect(() => {
    try {
      const storedSets = localStorage.getItem(FLASHCARD_SETS_STORAGE_KEY);
      if (storedSets) {
        setSavedSets(JSON.parse(storedSets));
      }
    } catch (error) {
      console.error("Failed to load flashcard sets from local storage:", error);
    }
  }, []);

  const handleGenerateFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setFlashcards(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    
    try {
      const generatedFlashcards = await generateFlashcards(topic);
      setFlashcards(generatedFlashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSet = () => {
    if (!flashcards || !topic) return;

    const name = prompt("Enter a name for this flashcard set:");
    if (!name || !name.trim()) {
      alert("Please enter a valid name.");
      return;
    }

    if (savedSets.some(set => set.name.toLowerCase() === name.trim().toLowerCase())) {
      alert("A set with this name already exists. Please choose a different name.");
      return;
    }

    const newSet: SavedFlashcardSet = { name: name.trim(), topic, flashcards };
    const updatedSets = [...savedSets, newSet];
    setSavedSets(updatedSets);
    localStorage.setItem(FLASHCARD_SETS_STORAGE_KEY, JSON.stringify(updatedSets));
    alert(`Set "${name.trim()}" saved successfully!`);
  };

  const handleLoadSet = (setName: string) => {
    const setToLoad = savedSets.find(set => set.name === setName);
    if (setToLoad) {
      setTopic(setToLoad.topic);
      setFlashcards(setToLoad.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setError(null);
    }
  };

  const handleDeleteSet = (setName: string) => {
    if (!confirm(`Are you sure you want to delete the set "${setName}"? This action cannot be undone.`)) {
      return;
    }
    const updatedSets = savedSets.filter(set => set.name !== setName);
    setSavedSets(updatedSets);
    localStorage.setItem(FLASHCARD_SETS_STORAGE_KEY, JSON.stringify(updatedSets));
  };
  
  const handleNext = () => {
    if (flashcards && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Flashcard Generator</h2>
      {!flashcards && (
        <>
          <form onSubmit={handleGenerateFlashcards} className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'JavaScript Concepts')"
              className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="px-6 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Flashcards'}
            </button>
          </form>
          {savedSets.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-bold mb-4 text-center">My Saved Sets</h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {savedSets.map((set) => (
                  <li key={set.name} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
                    <div>
                      <p className="font-semibold">{set.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Topic: {set.topic}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleLoadSet(set.name)} 
                        className="px-4 py-1 text-sm rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => handleDeleteSet(set.name)} 
                        className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        aria-label={`Delete ${set.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {flashcards && flashcards.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg h-80 perspective-1000">
            <div
              className={`flashcard w-full h-full relative cursor-pointer ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-inner w-full h-full">
                {/* Front of card */}
                <div className="flashcard-front absolute w-full h-full bg-indigo-400 dark:bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center p-6">
                  <p className="text-white text-2xl font-bold text-center">{flashcards[currentIndex].term}</p>
                </div>
                {/* Back of card */}
                <div className="flashcard-back absolute w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg flex items-center justify-center p-6">
                  <p className="text-gray-800 dark:text-gray-200 text-lg text-center">{flashcards[currentIndex].definition}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {flashcards.length}
          </div>

          <div className="flex justify-between w-full max-w-lg mt-4">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-2 rounded-md bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} className="px-6 py-2 rounded-md bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
           
           <button 
             onClick={handleSaveSet} 
             className="w-full max-w-lg mt-8 py-3 rounded-md bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">
              Save This Set
            </button>
           <button onClick={() => { setFlashcards(null); setTopic(''); }} className="w-full max-w-lg mt-4 py-3 rounded-md bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors">
              Create New Set
            </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;