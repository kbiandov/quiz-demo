import React, { useMemo, useState } from "react";
import { groupBy, normalizeId } from "../utils";

function SimpleTabs({ defaultValue, tabs }){
  const [val, setVal] = useState(defaultValue || (tabs[0] && tabs[0].value));
  
  const handleTabClick = (tabValue) => setVal(tabValue);
  const handleStartQuizClick = (lesson, qs) => handleStartQuiz(lesson, qs);
  
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

export default function TestsScreen({ profile, lessons, classes, questions, onStartQuiz }){
  const [questionCounts, setQuestionCounts] = useState({});
  
  const lessonsByClass = useMemo(() => {
    return groupBy(lessons, (l) => normalizeId(l.class_id || l.classId || l.class || l.grade));
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
  
  function listQuestionsForLesson(lessonId){ const lid=normalizeId(lessonId); return questions.filter(q=> normalizeId(q.lesson_id||q.lessonId||q.lesson)===lid); }
  
  const handleQuestionCountChange = (lessonId, value) => {
    setQuestionCounts(prev => ({
      ...prev,
      [lessonId]: value === 'all' ? null : parseInt(value)
    }));
  };
  
  const handleStartQuiz = (lesson, allQuestions) => {
    const lessonId = lesson.id || lesson.lesson_id;
    const selectedCount = questionCounts[lessonId] || allQuestions.length;
    
    if (selectedCount === 'all' || selectedCount >= allQuestions.length) {
      onStartQuiz(lesson, allQuestions);
    } else {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const limitedQuestions = shuffled.slice(0, selectedCount);
      onStartQuiz(lesson, limitedQuestions);
    }
  };
  
  function renderLessonCard(lesson, isCurrentClass = false) {
    const qs = listQuestionsForLesson(lesson.id);
    const lessonId = normalizeId(lesson.id);
    const currentCount = questionCounts[lessonId] || qs.length;
    
    const handleStartClick = () => handleStartQuiz(lesson, qs);
    const handleCountChange = (e) => handleQuestionCountChange(lessonId, parseInt(e.target.value));
    
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
      <div key={lessonId} className="card hover:shadow-md transition">
        <div className="card-content">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">{lesson.title || lesson.name}</div>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleStartClick}
              disabled={!qs.length}
            >
              Старт
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Въпроси: {currentCount} / {qs.length}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">Брой:</label>
              <select
                value={currentCount}
                onChange={handleCountChange}
                className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
              >
                {qs.length <= 5 ? (
                  // If 5 or fewer questions, show individual options
                  Array.from({ length: qs.length }, (_, i) => i + 1).map(count => {
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
        </div>
      </div>
    );
  }
  
  return (<div className="max-w-4xl mx-auto p-4">
    <SimpleTabs defaultValue="by-lesson" tabs={[
      {value:'by-lesson', label:'По тема / уроци', content:(
        <div>
          <h3 className="text-lg font-semibold mb-3">{`Уроци за ${classList.find(c=>c.id===currentClassId)?.name || "избрания клас"}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentLessons.map(l => {
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
                {(lessonsByClass[cls.id]||[]).map(l => {
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