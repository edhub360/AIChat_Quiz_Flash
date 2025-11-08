
import React from 'react';
import { Module } from '../types';
import { ChatIcon, QuizIcon, FlashcardIcon, SunIcon, MoonIcon } from './icons/Icons';

interface HeaderProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeModule, setActiveModule, isDarkMode, onThemeToggle }) => {
  const navItems = [
    { id: Module.AI_CHAT, label: 'AI Chat', icon: <ChatIcon /> },
    { id: Module.QUIZ, label: 'Quiz', icon: <QuizIcon /> },
    { id: Module.FLASHCARD, label: 'Flashcards', icon: <FlashcardIcon /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex items-center justify-center h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V15c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5zm3-5.5c-.83 0-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5c0 .83-.67 1.5-1.5 1.5zm3 5.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V15c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5z"/></svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Study Buddy</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-colors duration-200 ${
              activeModule === item.id
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
            onClick={onThemeToggle}
            className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Header;
