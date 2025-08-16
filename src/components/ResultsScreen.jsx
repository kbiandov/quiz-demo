import React, { useState } from "react";
import Modal from "./Modal";
import ResultReview from "./ResultReview";

export default function ResultsScreen(props) {
  const { 
    results = [], 
    classes = [], 
    lessons = [], 
    canRestart = false, 
    onRestart 
  } = props;
  const [activeResult, setActiveResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResultClick = (result) => {
    setActiveResult(result);
    setIsModalOpen(true);
  };

  const handleResultRowClick = (result) => handleResultClick(result);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveResult(null);
  };

  const handleRetakeTest = () => {
    if (activeResult && onRestart) {
      handleCloseModal();
      // Use questions from the result data
      const resultQuestions = activeResult.questions || [];
      if (resultQuestions.length > 0) {
        onRestart(activeResult.lesson, resultQuestions);
      } else {
        console.warn('No questions found in result data for retake');
      }
    }
  };

  if (!results || results.length === 0) {
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
          {results.map(result => {
            const handleClick = () => handleResultClick(result);
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
                onClick={handleClick}
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
                          {(() => {
                            if (result.timeLimitMin) {
                              return `Време: ${result.timeLimitMin} мин`;
                            }
                            return 'Без време';
                          })()}
                        </span>
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
        />
      </Modal>
    </div>
  );
}