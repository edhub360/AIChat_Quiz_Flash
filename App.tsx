
import React, { useState, useEffect } from 'react';
import { Module } from './types';
import Header from './components/Header';
import AIChat from './components/AIChat';
import QuizGenerator from './components/QuizGenerator';
import FlashcardGenerator from './components/FlashcardGenerator';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Module>(Module.AI_CHAT);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.theme === 'dark') {
      return true;
    }
    if (localStorage.theme === 'light') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };


  const renderModule = () => {
    switch (activeModule) {
      case Module.QUIZ:
        return <QuizGenerator />;
      case Module.FLASHCARD:
        return <FlashcardGenerator />;
      case Module.AI_CHAT:
      default:
        return <AIChat />;
    }
  };

  return (
    <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <Header
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto h-full">
            {renderModule()}
        </div>
      </main>
    </div>
  );
};

export default App;
