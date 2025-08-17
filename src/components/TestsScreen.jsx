import React, { useMemo, useState } from "react";
import { groupBy, normalizeId } from "../utils";

function SimpleTabs({ defaultValue, tabs }){
  const [val, setVal] = useState(defaultValue || (tabs[0] && tabs[0].value));
  
  const handleTabClick = (tabValue) => setVal(tabValue);
  
  return (<div>
    <div className="grid grid-cols-2 w-full gap-2">
      {tabs.map(t => {
        const handleClick = () => handleTabClick(t.value);
        return (
          <button
            type="button"
            key={t.value}
            onClick={handleClick}
            className={`btn ${val === t.value ? 'bg-blue-50 border-blue-300' : ''}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
    <div className="pt-4">{tabs.find(t => t.value === val)?.content}</div>
  </div>);
}

export default function TestsScreen({ profile, lessons, classes, questions, onStartQuiz, completedTests }){
  const [questionCounts, setQuestionCounts] = useState({});
  const [timerDurations, setTimerDurations] = useState({});
  const [showCompletedTests, setShowCompletedTests] = useState(true);
  
  const lessonsByClass = useMemo(() => {
    const grouped = {};
    lessons.forEach(lesson => {
      const classId = normalizeId(lesson.class_id || lesson.classId);
      if (classId) {
        if (!grouped[classId]) grouped[classId] = [];
        grouped[classId].push(lesson);
      }
    });
    return grouped;
  }, [lessons]);
  
  const classList = useMemo(() => {
    return classes.map(c => {
      const id = normalizeId(c.id) || c.name;
      const name = c.name || c.title || c.id;
      return { id, name };
    });
  }, [classes]);
  
  const currentClassId = profile?.classId;
  const currentLessons = lessonsByClass[currentClassId] || [];
  
  // Helper function to check if a test is completed
  const isTestCompleted = (lessonId) => {
    const normalizedLessonId = normalizeId(lessonId);
    return completedTests?.some(completedId => normalizeId(completedId) === normalizedLessonId) || false;
  };
  
  function listQuestionsForLesson(lessonId){ 
    const lid = normalizeId(lessonId); 
    return questions.filter(q => normalizeId(q.lesson_id || q.lessonId || q.lesson) === lid); 
  }
  
  const handleQuestionCountChange = (lessonId, value) => {
    setQuestionCounts(prev => ({
      ...prev,
      [lessonId]: value === 'all' ? null : parseInt(value)
    }));
  };
  
  const handleTimerDurationChange = (lessonId, value) => {
    setTimerDurations(prev => ({
      ...prev,
      [lessonId]: parseInt(value)
    }));
  };
  
  const handleStartQuiz = (lesson, allQuestions) => {
    const lessonId = lesson.id || lesson.lesson_id;
    const selectedCount = questionCounts[lessonId] || allQuestions.length;
    const selectedTimer = timerDurations[lessonId] || 60; // Default to 1 minute if not selected
    
    let limitedQs = allQuestions;
    if (selectedCount < allQuestions.length) {
      const shuffleFunction = () => Math.random() - 0.5;
      const shuffled = [...allQuestions].sort(shuffleFunction);
      limitedQs = shuffled.slice(0, selectedCount);
    }
    
    // Pass the selected timer duration along with the quiz data
    const quizSettings = {
      timeLimitMin: selectedTimer,
      showExplanation: true,
      shuffleQuestions: true,
      shuffleOptions: true,
      instantNext: false,
      instantDelaySec: 4
    };
    
    onStartQuiz(lesson, limitedQs, quizSettings);
  };
  
  function renderLessonCard(lesson, isCurrentClass = false) {
    const qs = listQuestionsForLesson(lesson.id);
    const lessonId = normalizeId(lesson.id);
    const currentCount = questionCounts[lessonId] || qs.length;
    const currentTimer = timerDurations[lessonId] || 60; // Default to 1 minute
    const isCompleted = isTestCompleted(lesson.id);
    
    const handleStartClick = () => handleStartQuiz(lesson, qs);
    const handleCountChange = (e) => handleQuestionCountChange(lessonId, parseInt(e.target.value));
    const handleTimerChange = (e) => handleTimerDurationChange(lessonId, e.target.value);
    
    // Helper function to format timer display
    const formatTimerDisplay = (seconds) => {
      if (seconds < 60) return `${seconds} сек.`;
      if (seconds === 60) return '1 мин.';
      if (seconds === 120) return '2 мин.';
      if (seconds === 180) return '3 мин.';
      return `${Math.floor(seconds / 60)} мин.`;
    };
    
    if (!qs.length) {
      return (
        <div key={lessonId} className="card hover:shadow-md transition">
          <div className="card-content flex items-center justify-between">
            <div>
              <div className="font-medium">{lesson.title || lesson.name}</div>
              <div className="text-xs text-slate-500">Няма въпроси</div>
            </div>
            <button type="button" className="btn btn-primary" disabled>Старт</button>
          </div>
        </div>
      );
    }
    
    return (
      <article key={lessonId} className={`card hover:shadow-md transition ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
        <div className="card-content">
          {/* Header */}
          <header className="test-card__header mb-3">
            <h3 className="test-card__title text-lg font-semibold text-slate-800 mb-2">
              {lesson.title || lesson.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="test-card__meta text-sm text-slate-600">
                Въпроси: {currentCount} / {qs.length}
              </div>
              {isCompleted && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <span className="text-lg">✓</span>
                  <span>Решаван</span>
                </div>
              )}
            </div>
          </header>
          
          {/* Controls */}
          <div className="test-card__controls flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Timer Section */}
            <div className="test-card__timer inline-flex items-center gap-2 min-w-0 flex-shrink-0 order-1">
              {/* Timer Icon */}
              <svg 
                className="w-4 h-4 text-slate-500 flex-shrink-0" 
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
              
              {/* Timer Dropdown */}
              <select
                value={currentTimer}
                onChange={handleTimerChange}
                className="text-sm border border-slate-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                aria-label="Таймер"
              >
                <option value="15">15 сек.</option>
                <option value="30">30 сек.</option>
                <option value="45">45 сек.</option>
                <option value="60">1 мин.</option>
                <option value="120">2 мин.</option>
                <option value="180">3 мин.</option>
              </select>
              
              {/* Timer Hint */}
              <span className="test-card__timer-hint text-sm text-slate-500 flex-shrink-0">
                ({formatTimerDisplay(currentTimer)})
              </span>
            </div>
            
            {/* Question Count Section */}
            <div className="test-card__count inline-flex items-center gap-2 min-w-0 flex-shrink-0 order-2">
              <label className="test-card__count-label text-sm text-slate-600 font-medium flex-shrink-0">
                Брой:
              </label>
              <select
                value={currentCount}
                onChange={handleCountChange}
                className="text-sm border border-slate-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0"
                aria-label="Брой въпроси"
              >
                {qs.length <= 5 ? (
                  Array.from({ length: qs.length }, (unused, i) => i + 1).map(count => {
                    return <option key={count} value={count}>{count}</option>;
                  })
                ) : (
                  // If more than 5 questions, show common options + "All"
                  <>
                    <option value={qs.length}>Всички ({qs.length})</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    {qs.length > 25 && <option value={25}>25</option>}
                    {qs.length > 30 && <option value={30}>30</option>}
                  </>
                )}
              </select>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="test-card__footer mt-4">
            <button 
              type="button" 
              className={`btn w-full ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleStartClick}
              disabled={!qs.length}
            >
              {isCompleted ? 'Повтори теста' : 'Започни теста'}
            </button>
          </footer>
        </div>
      </article>
    );
  }
  
  return (<div className="max-w-4xl mx-auto p-4">
    {/* Completion Summary */}
    <div className="mb-6 bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Прогрес на тестовете</h2>
          <p className="text-sm text-slate-600">
            {(() => {
              const totalTests = currentLessons.length;
              const completedCount = currentLessons.filter(lesson => isTestCompleted(lesson.id)).length;
              const percentage = totalTests > 0 ? Math.round((completedCount / totalTests) * 100) : 0;
              return `${completedCount} от ${totalTests} теста завършени (${percentage}%)`;
            })()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {currentLessons.filter(lesson => isTestCompleted(lesson.id)).length}
          </div>
          <div className="text-sm text-slate-500">Завършени</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="h-2 bg-green-500 rounded-full transition-all duration-300"
            style={{ 
              width: `${(() => {
                const totalTests = currentLessons.length;
                const completedCount = currentLessons.filter(lesson => isTestCompleted(lesson.id)).length;
                return totalTests > 0 ? (completedCount / totalTests) * 100 : 0;
              })()}%` 
            }}
          />
        </div>
      </div>
    </div>
    
    {/* Filter Controls */}
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input 
            type="checkbox" 
            checked={showCompletedTests}
            onChange={(e) => setShowCompletedTests(e.target.checked)}
            className="rounded border-slate-300 text-green-600 focus:ring-green-500"
          />
          <span>Покажи завършени тестове</span>
        </label>
        
        {/* Reset completed tests button (for testing) */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Сигурни ли сте, че искате да нулирате всички завършени тестове? Това ще изтрие прогреса.')) {
              localStorage.removeItem('math-app-completed-tests');
              window.location.reload();
            }
          }}
          className="text-xs text-red-600 hover:text-red-800 underline"
          title="Нулирай завършените тестове (за тестване)"
        >
          Нулирай прогреса
        </button>
      </div>
      <div className="text-sm text-slate-500">
        {(() => {
          const visibleTests = currentLessons.filter(lesson => 
            showCompletedTests || !isTestCompleted(lesson.id)
          ).length;
          return `Показва се: ${visibleTests} теста`;
        })()}
      </div>
    </div>
    
    <SimpleTabs defaultValue="by-lesson" tabs={[
      {value:'by-lesson', label:'По тема / уроци', content:(
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {`Уроци за ${classList.find(c => c.id === currentClassId)?.name || "избрания клас"}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentLessons
              .filter(lesson => showCompletedTests || !isTestCompleted(lesson.id))
              .map(l => {
                return renderLessonCard(l, true);
              })}
          </div>
        </div>
      )},
      {value:'by-class', label:'По класове', content:(
        <div className="space-y-4">{classList.map(cls => {
          return (
            <div key={cls.id}>
              <div className="text-sm font-semibold mb-2">{cls.name}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(lessonsByClass[cls.id]||[])
                  .filter(lesson => showCompletedTests || !isTestCompleted(lesson.id))
                  .map(l => {
                    return renderLessonCard(l);
                  })}
              </div>
            </div>
          );
        })}</div>
      )}
    ]}/>
  </div>);
}