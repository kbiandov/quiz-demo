import React, { useMemo } from 'react';

export default function ResultReview({ result, onRetakeTest, onRetry }) {
  // Early return with null check
  if (!result) return null;

  // All variable declarations at the top to avoid temporal dead zone
  const lesson = result.lesson;
  const correct = result.correct || 0;
  const total = result.total || 0;
  const answers = result.answers || {};
  const at = result.at;
  const questions = result.questions || [];
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  // Check if we have questions data - declared before any usage
  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  
  // Safe date formatting
  const date = at ? new Date(at).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Неизвестна дата';

  // Safe retake handler with fallback
  const handleRetake = () => {
    if (onRetakeTest && typeof onRetakeTest === 'function') {
      onRetakeTest();
    } else if (onRetry && typeof onRetry === 'function') {
      onRetry();
    } else {
      // Fallback: dispatch custom event
      const event = new CustomEvent('retakeTest', { 
        detail: { result, lesson: lesson?.id || lesson?.name } 
      });
      window.dispatchEvent(event);
    }
  };

  // Helper function to get option text safely
  const getOptionText = (question, optionKey) => {
    if (!question || !optionKey) return '';
    
    const optionMap = {
      'A': question.A || question.a,
      'B': question.B || question.b,
      'C': question.C || question.c,
      'D': question.D || question.d
    };
    return optionMap[optionKey] || '';
  };

  // Helper function to get correct answer safely
  const getCorrectAnswer = (question) => {
    if (!question) return '';
    return String(question.correct || question.correct_option || question.answer || '').toUpperCase();
  };

  // Helper function to check if option was selected
  const wasSelected = (questionId, optionKey) => {
    if (!questionId || !optionKey || !answers) return false;
    return answers[questionId] === optionKey;
  };

  // Helper function to get question options safely
  const getQuestionOptions = (question) => {
    if (!question) return [];
    
    const options = [];
    ['A', 'B', 'C', 'D'].forEach(key => {
      const text = getOptionText(question, key);
      if (text && text.trim() !== '') {
        options.push({ key, text });
      }
    });
    return options;
  };

  // Helper function to render question result status
  const renderQuestionStatus = (question, selectedAnswer) => {
    if (!question) return null;
    
    const correctAnswer = getCorrectAnswer(question);
    const isCorrect = selectedAnswer && wasSelected(question.id, correctAnswer);
    
    if (!selectedAnswer) {
      return (
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-lg">⏭️</span>
          <span className="font-medium">Пропуснат въпрос</span>
        </div>
      );
    }
    
    if (isCorrect) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-lg">✅</span>
          <span className="font-medium">Правилен отговор</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span className="text-lg">❌</span>
        <span className="font-medium">Грешен отговор</span>
        <span className="text-sm text-slate-500">
          (Правилно: {correctAnswer})
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with Score */}
      <div className="mb-8 text-center" aria-live="polite">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">
          {lesson?.title || lesson?.name || 'Урок'}
        </h3>
        <p className="text-slate-600 mb-6 text-lg">{date}</p>
        
        {/* Score Display */}
        <div className="inline-flex items-center gap-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{correct}</div>
            <div className="text-sm opacity-90">Правилни</div>
          </div>
          <div className="text-white/60 text-2xl">|</div>
          <div className="text-center">
            <div className="text-3xl font-bold">{total}</div>
            <div className="text-sm opacity-90">Общо</div>
          </div>
          <div className="text-white/60 text-2xl">|</div>
          <div className="text-center">
            <div className="text-3xl font-bold">{percentage}%</div>
            <div className="text-sm opacity-90">Резултат</div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        <h4 className="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">
          Преглед на въпросите ({hasQuestions ? questions.length : 0})
        </h4>
        
        {!hasQuestions ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-800">
              <p className="font-medium mb-2 text-lg">Въпросите не са налични за преглед</p>
              <p className="text-sm mb-4">Това може да се дължи на по-стара версия на приложението</p>
              <div className="text-xs text-yellow-700 bg-yellow-100 p-3 rounded border">
                <p><strong>Детайли за отстраняване на проблема:</strong></p>
                <p>• Проверете дали имате интернет връзка</p>
                <p>• Опитайте да презаредите страницата</p>
                <p>• Проверете дали данните са заредени правилно</p>
              </div>
            </div>
          </div>
        ) : (
          <ul className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {questions.map((question, index) => {
              const questionId = question.id || `q${index}`;
              const options = getQuestionOptions(question);
              const selectedAnswer = answers[questionId];
              const correctAnswer = getCorrectAnswer(question);
              
              return (
                <li key={questionId} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  {/* Question Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-slate-800 text-lg flex-1">
                        Въпрос {index + 1}: {question.text || question.question || question.title || 'Без текст'}
                      </h5>
                      <span className="ml-3 text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        #{questionId}
                      </span>
                    </div>
                    
                    {/* Question Image */}
                    {question.image && (
                      <img 
                        src={question.image} 
                        alt="Илюстрация към въпроса" 
                        className="max-w-full max-h-48 object-contain rounded-lg border border-slate-200 mb-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-4">
                    {options.map((option) => {
                      const isCorrectAnswer = option.key === correctAnswer;
                      const isSelected = wasSelected(questionId, option.key);
                      
                      let optionClasses = "p-4 rounded-lg border-2 text-left transition-all duration-200";
                      
                      if (isCorrectAnswer) {
                        // Correct answer - always green
                        optionClasses += " bg-green-50 border-green-300 text-green-800";
                      } else if (isSelected && !isCorrectAnswer) {
                        // Selected but wrong - red
                        optionClasses += " bg-red-50 border-red-300 text-red-800";
                      } else if (isSelected && isCorrectAnswer) {
                        // Selected and correct - green
                        optionClasses += " bg-green-100 border-green-400 text-green-900";
                      } else {
                        // Not selected - neutral
                        optionClasses += " bg-slate-50 border-slate-200 text-slate-700";
                      }

                      return (
                        <div key={option.key} className={optionClasses}>
                          <div className="flex items-center gap-4">
                            <span className="font-bold w-8 text-center text-lg">{option.key}.</span>
                            <span className="flex-1 text-base">{option.text}</span>
                            
                            {/* Status Icons */}
                            {isCorrectAnswer && (
                              <span className="text-green-600 text-xl font-bold">✅</span>
                            )}
                            {isSelected && !isCorrectAnswer && (
                              <span className="text-red-600 text-xl font-bold">❌</span>
                            )}
                            {isSelected && isCorrectAnswer && (
                              <span className="text-green-600 text-xl font-bold">✅</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Question Result Status */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {renderQuestionStatus(question, selectedAnswer)}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm text-blue-800">
                        <strong className="text-blue-900">💡 Обяснение:</strong>
                        <p className="mt-2 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleRetake}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          🔄 Направи теста отново
        </button>
      </div>
    </div>
  );
}
