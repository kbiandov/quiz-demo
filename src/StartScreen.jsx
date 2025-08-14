import React from "react";

export default function StartScreen({ onSelectTopic, onOpenSettings }) {
  return (
    <div className="p-4 md:p-6">
      {/* Заглавие и бутон Настройки */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Здрасти, Кало!</h1>
          <div className="text-gray-600">Математика • 6 клас</div>
        </div>

        <button
          title="Настройки"
          onClick={onOpenSettings}
          className="rounded-full border p-2 hover:bg-gray-50"
          aria-label="Настройки"
        >
          <span style={{ fontSize: 20 }}>⚙️</span>
        </button>
      </div>

      {/* Основни бутони */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button
          onClick={() => alert("Теория – тук ще се показват уроците.")}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <img src="/icons/book.png" alt="Теория" className="w-12 h-12 mb-2" />
          <span className="font-medium">Теория</span>
        </button>

        <button
          onClick={() => onSelectTopic({ topicName: "Линейни уравнения", classId: "6" })}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <img src="/icons/test.png" alt="Тестове" className="w-12 h-12 mb-2" />
          <span className="font-medium">Тестове</span>
        </button>

        <button
          onClick={() => alert("Резултати – ще показваме предишни тестове.")}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <img src="/icons/results.png" alt="Резултати" className="w-12 h-12 mb-2" />
          <span className="font-medium">Резултати</span>
        </button>

        <button
          onClick={() => alert("Статистика – ще визуализираме напредъка.")}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <img src="/icons/stats.png" alt="Статистика" className="w-12 h-12 mb-2" />
          <span className="font-medium">Статистика</span>
        </button>
      </div>
    </div>
  );
}
