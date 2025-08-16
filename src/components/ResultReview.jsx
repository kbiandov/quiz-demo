import React from 'react';

export default function ResultReview({ result, onRetakeTest }) {
  if (!result) return null;

  const lesson = result.lesson;
  const correct = result.correct;
  const total = result.total;
  const answers = result.answers;
  const at = result.at;
  const questions = result.questions;
  const percentage = Math.round((correct / total) * 100);
  const date = new Date(at).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Debug logging
  console.log('ResultReview render:', { 
    result, 
    questions: result.questions, 
    questionsType: typeof result.questions,
    questionsLength: result.questions?.length,
    answers,
    hasQuestions 
  });

  // Helper function to get option text
  const getOptionText = (question, optionKey) => {
    const optionMap = {
      'A': question.A || question.a,
      'B': question.B || question.b,
      'C': question.C || question.c,
      'D': question.D || question.d
    };
    return optionMap[optionKey] || '';
  };

  // Helper function to check if option is correct
  const isCorrectOption = (question, optionKey) => {
    const correctKey = String(question.correct || question.correct_option || question.answer || '').toUpperCase();
    return optionKey === correctKey;
  };

  // Helper function to check if option was selected
  const wasSelected = (questionId, optionKey) => {
    return answers[questionId] === optionKey;
  };

  // Helper function to get question options
  const getQuestionOptions = (question) => {
    const options = [];
    ['A', 'B', 'C', 'D'].forEach(key => {
      const text = getOptionText(question, key);
      if (text && text.trim() !== '') {
        options.push({ key, text });
      }
    });
    return options;
  };

  // Check if we have questions data
  const hasQuestions = questions && Array.isArray(questions) && questions.length > 0;

  return (
    <div className="p-6">
      {/* Header with Score */}
      <div className="mb-6 text-center" aria-live="polite">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {lesson?.title || lesson?.name || 'Урок'}
        </h3>
        <p className="text-slate-600 mb-4">{date}</p>
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full">
          <div className="text-center">
            <div className="text-2xl font-bold">{correct}</div>
            <div className="text-sm opacity-90">Правилни</div>
          </div>
          <div className="text-white/60">|</div>
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-sm opacity-90">Общо</div>
          </div>
          <div className="text-white/60">|</div>
          <div className="text-center">
            <div className="text-2xl font-bold">{percentage}%</div>
            <div className="text-sm opacity-90">Резултат</div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Преглед на въпросите</h4>
        
        {!hasQuestions ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-yellow-800">
              <p className="font-medium mb-2">Въпросите не са налични за преглед</p>
              <p className="text-sm">Това може да се дължи на по-стара версия на приложението</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-6 max-h-[60vh] overflow-y-auto">
            {questions.map((question, index) => {
              const options = getQuestionOptions(question);
              const selectedAnswer = answers[question.id];
              const correctAnswer = String(question.correct || question.correct_option || question.answer || '').toUpperCase();
              
              return (
                <li key={question.id || index} className="bg-slate-50 rounded-lg p-4">
                  {/* Question */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-slate-800 mb-2">
                      Въпрос {index + 1}: {question.text || question.question || question.title}
                    </h5>
                    {question.image && (
                      <img 
                        src={question.image} 
                        alt="Илюстрация" 
                        className="max-w-full max-h-48 object-contain rounded-lg border mb-3"
                      />
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {options.map((option) => {
                      const isCorrect = isCorrectOption(question, option.key);
                      const isSelected = wasSelected(question.id, option.key);
                      const isCorrectAnswer = option.key === correctAnswer;
                      
                      let optionClasses = "p-3 rounded-lg border text-left transition-all";
                      
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
                        optionClasses += " bg-white border-slate-200 text-slate-700";
                      }

                      return (
                        <div key={option.key} className={optionClasses}>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-6 text-center">{option.key}.</span>
                            <span className="flex-1">{option.text}</span>
                            {isCorrectAnswer && (
                              <span className="text-green-600 font-bold">✓</span>
                            )}
                            {isSelected && !isCorrectAnswer && (
                              <span className="text-red-600 font-bold">✗</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-800">
                        <strong>Обяснение:</strong> {question.explanation}
                      </div>
                    </div>
                  )}

                  {/* Result Summary for this question */}
                  <div className="mt-3 text-sm">
                    {selectedAnswer ? (
                      wasSelected(question.id, correctAnswer) ? (
                        <span className="text-green-600 font-medium">✓ Правилен отговор</span>
                      ) : (
                        <span className="text-red-600 font-medium">✗ Грешен отговор</span>
                      )
                    ) : (
                      <span className="text-slate-500">Пропуснат въпрос</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
        <button
          onClick={onRetakeTest}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Направи теста отново
        </button>
      </div>
    </div>
  );
}
