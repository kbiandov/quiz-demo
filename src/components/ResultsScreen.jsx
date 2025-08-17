import React, { useState, useMemo, useCallback } from "react";
import Modal from "./Modal";
import ResultReview from "./ResultReview";

export default function ResultsScreen(props) {
  const { 
    results = [], 
    classes = [], 
    lessons = [], 
    questions = [],
    questionsByLessonId = {},
    canRestart = false, 
    onRestart 
  } = props;
  
  const [activeResult, setActiveResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized data processing
  const processedResults = useMemo(() => {
    return results.map(result => ({
      ...result,
      // Ensure questions are always available
      questions: result.questions || result.qlist || [],
      // Normalize lesson data
      lesson: {
        id: result.lesson?.id || result.lesson?.lesson_id || '',
        title: result.lesson?.title || result.lesson?.name || 'Урок',
        name: result.lesson?.name || result.lesson?.title || 'Урок'
      }
    }));
  }, [results]);

  const handleResultClick = useCallback((result) => {
    setActiveResult(result);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveResult(null);
  }, []);

  // Implement proper retake functionality
  const handleRetakeTest = useCallback(() => {
    if (!activeResult || !onRestart) return;

    const lessonId = activeResult.lesson?.id || activeResult.lesson?.lesson_id;
    
    if (!lessonId) {
      console.error('[ResultsScreen] No lesson ID found for retake');
      return;
    }

    // Try to get questions from the result first
    let retakeQuestions = activeResult.questions || activeResult.qlist || [];
    
    // If no questions in result, try to get from questionsByLessonId
    if (retakeQuestions.length === 0 && questionsByLessonId[lessonId]) {
      retakeQuestions = questionsByLessonId[lessonId];
    }
    
    // If still no questions, try to filter from questions array
    if (retakeQuestions.length === 0 && questions.length > 0) {
      retakeQuestions = questions.filter(q => {
        const questionLessonId = q.lesson_id || q.lessonId;
        return questionLessonId && questionLessonId.toString() === lessonId.toString();
      });
    }

    if (retakeQuestions.length > 0) {
      console.log(`[ResultsScreen] Retaking test for lesson ${lessonId} with ${retakeQuestions.length} questions`);
      handleCloseModal();
      onRestart(activeResult.lesson, retakeQuestions);
    } else {
      console.error(`[ResultsScreen] No questions found for lesson ${lessonId}`);
      // Show user-friendly error
      alert('Неуспешно зареждане на въпросите за този урок. Моля, опитайте отново или изберете друг тест.');
    }
  }, [activeResult, onRestart, questionsByLessonId, questions, handleCloseModal]);

  // Early return for empty results
  if (!processedResults || processedResults.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Няма резултати</h2>
            <p className="text-slate-600 mb-6 text-lg">
              Направете първия си тест за да видите резултатите тук
            </p>
            {canRestart && (
              <button 
                type="button"
                onClick={onRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Направи тест отново
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Резултати</h1>
        
        {/* Results List */}
        <div className="space-y-4">
          {processedResults.map(result => {
            const percentage = Math.round((result.correct / result.total) * 100);
            const date = new Date(result.at).toLocaleDateString('bg-BG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={result.at}
                className="bg-white rounded-lg border p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {result.lesson?.title || result.lesson?.name || 'Урок'}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {date} · {result.correct}/{result.total} правилни отговора
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">
                          {result.timeLimitMin ? (
                            (() => {
                              const seconds = result.timeLimitMin;
                              if (seconds < 60) return `Време: ${seconds} сек`;
                              if (seconds === 60) return 'Време: 1 мин';
                              return `Време: ${Math.floor(seconds / 60)} мин`;
                            })()
                          ) : 'Без време'}
                        </span>
                        {result.questions && result.questions.length > 0 && (
                          <span className="text-sm text-slate-500">
                            · {result.questions.length} въпроса
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${
                        percentage >= 80 ? 'text-green-600' :
                        percentage >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {percentage}%
                      </div>
                      <div className="text-sm text-slate-500">Резултат</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 80 ? 'bg-green-500' :
                          percentage >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Restart Button */}
        {canRestart && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Направи последния тест отново
            </button>
          </div>
        )}
      </div>

      {/* Answer Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Преглед на резултата"
        size="xl"
      >
        <ResultReview
          result={activeResult}
          onRetakeTest={handleRetakeTest}
          onRetry={handleRetakeTest}
        />
      </Modal>
    </div>
  );
}