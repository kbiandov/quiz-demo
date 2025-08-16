import React from "react";
import SquareButton from './SquareButton';
import { usePoints } from '../hooks/usePoints';

export default function HomeScreen({ onGo, profile }){
  const { points, level } = usePoints();
  
  // Debug logging
  console.log('HomeScreen render:', { onGo, profile, SquareButton: typeof SquareButton });
  
  if (typeof onGo !== 'function') {
    console.error('HomeScreen: onGo prop is not a function:', onGo);
    return <div>Error: Invalid navigation function</div>;
  }
  
  if (typeof SquareButton !== 'function') {
    console.error('HomeScreen: SquareButton is not a function:', SquareButton);
    return <div>Error: SquareButton component not available</div>;
  }

  const tiles = [
    { key: "theory", icon: "📖", label: "Теория" },
    { key: "tests", icon: "✏️", label: "Тестове" },
    { key: "results", icon: "📊", label: "Резултати" },
    { key: "stats", icon: "📈", label: "Статистики" }
  ];

  const handleTileClick = (key) => onGo(key);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Profile and Points Section */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                Здравей, {profile?.name || 'Ученик'} · Клас {profile?.classId || '?'}
              </h1>
              <div className="flex items-center gap-3 text-lg text-slate-600">
                <span className="flex items-center gap-2">
                  ⭐ {points} т.
                </span>
                <span className="text-slate-400">|</span>
                <span>Ниво {level}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold text-center">
                <div className="text-sm">Ниво</div>
                <div className="text-xl">{level}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map(t => (
            <SquareButton key={t.key} icon={t.icon} label={t.label} onClick={() => handleTileClick(t.key)} />
          ))}
        </div>
      </div>
    </div>
  );
}