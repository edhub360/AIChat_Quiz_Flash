
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setSubmitted(false);
    setUserAnswers([]);
    
    try {
      const generatedQuiz = await generateQuiz(topic);
      setQuiz(generatedQuiz);
      setUserAnswers(new Array(generatedQuiz.length).fill(''));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };
  
  const handleSubmitQuiz = () => {
    let currentScore = 0;
    quiz?.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };
  
  const getOptionClass = (question: QuizQuestion, option: string, index: number) => {
    if (!submitted) return 'hover:bg-indigo-100 dark:hover:bg-gray-600';
    if (option === question.correctAnswer) return 'bg-green-200 dark:bg-green-800 border-green-500';
    if (option === userAnswers[index] && option !== question.correctAnswer) return 'bg-red-200 dark:bg-red-800 border-red-500';
    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Generator</h2>
      <form onSubmit={handleGenerateQuiz} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., 'Roman History')"
          className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="px-6 py-2 rounded-md bg-indigo-500 text-white font-semibold hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </form>

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {quiz && !submitted && (
        <div className="space-y-6">
          {quiz.map((q, qIndex) => (
            <div key={qIndex} className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <label key={oIndex} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-colors hover:bg-indigo-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={option}
                      checked={userAnswers[qIndex] === option}
                      onChange={() => handleAnswerChange(qIndex, option)}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-3">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmitQuiz} className="w-full mt-6 py-3 rounded-md bg-green-500 text-white font-bold hover:bg-green-600 transition-colors">Submit Quiz</button>
        </div>
      )}

      {submitted && quiz && (
        <div>
          <h3 className="text-xl font-bold text-center mb-4">Quiz Results: You scored {score} out of {quiz.length}</h3>
           <div className="space-y-6">
            {quiz.map((q, qIndex) => (
              <div key={qIndex} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <div key={option} className={`p-3 border rounded-lg ${getOptionClass(q, option, qIndex)}`}>
                      {option}
                      {submitted && option === userAnswers[qIndex] && option !== q.correctAnswer && <span className="ml-2 font-bold text-red-700 dark:text-red-300">(Your Answer)</span>}
                      {submitted && option === q.correctAnswer && <span className="ml-2 font-bold text-green-700 dark:text-green-300">(Correct Answer)</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setQuiz(null); setSubmitted(false); setTopic(''); }} className="w-full mt-8 py-3 rounded-md bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors">Create Another Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
