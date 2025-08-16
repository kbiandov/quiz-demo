import React from "react";
import { usePoints } from "../hooks/usePoints";

export default function StatsScreen({ results = [] }) {
  const { points, level, progressToNextLevel, pointsToNextLevel, progressPercentage, resetPoints } = usePoints();
  
  const totalTests = results.length;
  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Статистики</h1>
        
        {/* Points and Level Section */}
        <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">⭐ {points}</div>
              <div className="text-lg opacity-90">Общо точки</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{level}</div>
              <div className="text-lg opacity-90">Текущо ниво</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{pointsToNextLevel}</div>
              <div className="text-lg opacity-90">До следващото ниво</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Ниво {level}</span>
              <span>Ниво {level + 1}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-center mt-2 text-sm opacity-90">
              {progressToNextLevel} / 100 точки
            </div>
          </div>
          
          {/* Reset Button for Testing */}
          <div className="mt-4 text-center">
            <button
              onClick={resetPoints}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              Нулирай точки (за тестване)
            </button>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalTests}</div>
            <div className="text-slate-600">Общо тестове</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{totalQuestions}</div>
            <div className="text-slate-600">Общо въпроси</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalCorrect}</div>
            <div className="text-slate-600">Правилни отговори</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{averageScore}%</div>
            <div className="text-slate-600">Среден резултат</div>
          </div>
        </div>

        {/* Recent Results */}
        {results.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">Последни резултати</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {results.slice(0, 10).map((result, index) => {
                const lessonTitle = result.lesson?.title || result.lesson?.name || 'Урок';
                const date = new Date(result.at).toLocaleDateString('bg-BG');
                const percentage = Math.round((result.correct / result.total) * 100);
                const points = result.correct * 10;
                
                return (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {lessonTitle}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {date} · {result.correct}/{result.total} правилни
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">
                          {percentage}%
                        </div>
                        <div className="text-sm text-slate-500">
                          +{points} точки
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Няма резултати</h3>
            <p className="text-slate-600">
              Направете първия си тест за да видите статистиките тук
            </p>
          </div>
        )}
      </div>
    </div>
  );
}