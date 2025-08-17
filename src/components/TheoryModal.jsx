import React, { useState } from "react";

export default function TheoryModal({ isOpen, onClose, theoryItem, onStartTest, lesson }) {
  const [selectedTimer, setSelectedTimer] = useState(60); // Default to 1 minute
  
  if (!isOpen || !theoryItem) return null;

  const handleStartTest = () => {
    if (onStartTest && lesson) {
      // Create quiz settings with the selected timer
      const quizSettings = {
        timeLimitMin: selectedTimer,
        showExplanation: true,
        shuffleQuestions: true,
        shuffleOptions: true,
        instantNext: false,
        instantDelaySec: 4
      };
      
      // Pass the quiz settings along with the lesson
      onStartTest(lesson, quizSettings);
    }
  };

  const handleStartTestAndClose = () => {
    handleStartTest();
    onClose();
  };

  const handleTimerChange = (e) => {
    setSelectedTimer(parseInt(e.target.value));
  };

  // Helper function to format timer display
  const formatTimerDisplay = (seconds) => {
    if (seconds < 60) return `${seconds} сек.`;
    if (seconds === 60) return '1 мин.';
    if (seconds === 120) return '2 мин.';
    if (seconds === 180) return '3 мин.';
    return `${Math.floor(seconds / 60)} мин.`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{theoryItem.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Image */}
          {theoryItem.image && (
            <div className="mb-6 text-center">
              <img
                src={theoryItem.image}
                alt={theoryItem.title}
                className="max-w-full max-h-64 object-contain rounded-lg border shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Theory Content */}
          <div className="prose prose-slate max-w-none mb-6">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
              {theoryItem.content}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            {theoryItem.classId && (
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                Клас {theoryItem.classId}
              </span>
            )}
            {theoryItem.lessonId && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Урок {theoryItem.lessonId}
              </span>
            )}
          </div>
        </div>

        {/* Footer with Timer Selection and Start Test Button */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Готови ли сте да тествате знанията си?
            </div>
            
            {/* Timer Selection */}
            <div className="flex items-center gap-2">
              {/* Timer Icon */}
              <svg 
                className="w-4 h-4 text-slate-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              
              <select
                value={selectedTimer}
                onChange={handleTimerChange}
                className="text-sm border border-slate-300 rounded px-3 py-1 bg-white"
              >
                <option value="15">15 сек.</option>
                <option value="30">30 сек.</option>
                <option value="45">45 сек.</option>
                <option value="60">1 мин.</option>
                <option value="120">2 мин.</option>
                <option value="180">3 мин.</option>
              </select>
              <span className="text-sm text-slate-500">
                ({formatTimerDisplay(selectedTimer)})
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Затвори
            </button>
            <button
              onClick={handleStartTestAndClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Започни тест
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
