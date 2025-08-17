import React, { useState } from "react";

export default function TheoryModal({ isOpen, onClose, theoryItem, onStartTest, lesson }) {
  const [selectedTimer, setSelectedTimer] = useState(8); // Default to 8 minutes
  
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
    setSelectedTimer(e.target.value === 'no-limit' ? null : parseInt(e.target.value));
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
              <label className="text-sm text-slate-600">Време за теста:</label>
              <select
                value={selectedTimer || 'no-limit'}
                onChange={handleTimerChange}
                className="text-sm border border-slate-300 rounded px-3 py-1 bg-white"
              >
                <option value="no-limit">Без ограничение</option>
                <option value="5">5 минути</option>
                <option value="10">10 минути</option>
                <option value="15">15 минути</option>
                <option value="20">20 минути</option>
                <option value="30">30 минути</option>
                <option value="45">45 минути</option>
                <option value="60">1 час</option>
              </select>
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
