import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePoints } from "../hooks/usePoints";

export default function Quiz({ lesson, questions, onFinish, settings }){
  const { addPoints, points, level } = usePoints();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationTimer, setExplanationTimer] = useState(null);
  const timeoutRef = useRef(null);
  const [showConfirm,setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    return (settings?.timeLimitMin || 0) * 60;
  });
  
  const autoTimerRef = useRef(null);
  const AD_SECONDS = 5;
  
  const qlist = useMemo(() => {
    const base = [...questions];
    if (settings?.shuffleQuestions) {
      base.sort(() => Math.random() - 0.5);
    }
    return base.map(q => {
      const options = [
        { key: 'A', text: q.A ?? q.a },
        { key: 'B', text: q.B ?? q.b },
        { key: 'C', text: q.C ?? q.c },
        { key: 'D', text: q.D ?? q.d }
      ].filter(o => o.text != null && String(o.text).trim() !== '');
      
      const correctKey = String(q.correct || q.correct_option || q.answer || '').toUpperCase();
      const correctText = { A: q.A, B: q.B, C: q.C, D: q.D }[correctKey];
      const shuffled = settings?.shuffleOptions ? [...options].sort(() => Math.random() - 0.5) : options;
      const newCorrectKey = (shuffled.find(o => o.text === correctText) || {}).key || correctKey;
      
      return { ...q, __options: shuffled, __correctKey: newCorrectKey };
    });
  }, [questions, settings?.shuffleQuestions, settings?.shuffleOptions]);
  
  const current = qlist[index];
  const total = qlist.length;
  const progress = total ? Math.round((index / total) * 100) : 0;
  const isNearEnd = progress >= 80;
  const isLastQuestion = index === total - 1;
  
  const options = useMemo(() => {
    if (!current) return [];
    const opts = [
      { key: 'A', text: current.A || current.a },
      { key: 'B', text: current.B || current.b },
      { key: 'C', text: current.C || current.c },
      { key: 'D', text: current.D || current.d }
    ].filter(o => o.text != null && String(o.text).trim() !== '');
    
    const shuffled = settings?.shuffleOptions ? [...opts].sort(() => Math.random() - 0.5) : opts;
    return shuffled;
  }, [current, settings?.shuffleOptions]);

  useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, [index]);

  useEffect(() => {
    if (!settings?.timeLimitMin) return;
    
    if (timeLeft <= 0) {
      submit();
      return;
    }
    
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, settings?.timeLimitMin]);

  useEffect(() => {
    if (!showConfirm) return;
    
    setAdLeft(AD_SECONDS);
    const tick = setInterval(() => {
      setAdLeft(s => {
        if (s <= 1) {
          clearInterval(tick);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    
    return () => clearInterval(tick);
  }, [showConfirm]);

  function choose(optKey) {
    if (answers[current.id]) { return; }
    
    setAnswers(prev => ({ ...prev, [current.id]: optKey }));
    
    if (optKey === current.__correctKey) {
      addPoints(10);
    }
    
    if (settings?.showExplanation) {
      setShowExplanation(true);
      if (settings?.instantNext) {
        const timer = setTimeout(() => {
          next();
        }, (settings?.instantDelaySec || 4) * 1000);
        setExplanationTimer(timer);
      }
    } else {
      setTimeout(next, 1000);
    }
  }
  
  function next() {
    if (index < total - 1) {
      setIndex(index + 1);
      setShowExplanation(false);
      if (explanationTimer) {
        clearTimeout(explanationTimer);
        setExplanationTimer(null);
      }
    } else {
      setShowConfirm(true);
    }
  }

  function computeScore(){ 
    let correct=0; 
    let wrong=0;
    let unanswered=0;
    
    for(const q of qlist){ 
      if(answers[q.id]){
        if((answers[q.id]||'').toUpperCase()===(q.__correctKey||'').toUpperCase()) {
          correct++;
        } else {
          wrong++;
        }
      } else {
        unanswered++;
      }
    } 
    return {correct, wrong, unanswered, total}; 
  }
  function submit(){ 
    const {correct, wrong, unanswered, total} = computeScore(); 
    onFinish({ 
      lesson, 
      questions: qlist, // Include questions for review
      correct, 
      total, 
      answers, 
      at: new Date().toISOString(), 
      timeLimitMin: settings?.timeLimitMin 
    }); 
  }
  if (!current) return <div className="p-6 text-center">Няма въпроси за този урок.</div>;

  const opts = current.__options;
  const hms = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const chosen = answers[current.id];
  const showExplain = settings?.showExplanation && chosen;
  const isCorrect = chosen && chosen.toUpperCase() === current.__correctKey;
  const adProgress = ((AD_SECONDS - adLeft) / AD_SECONDS) * 100;

  const handleNext = () => {
    setIndex(index + 1);
    if (explanationTimer) {
      clearTimeout(explanationTimer);
      setExplanationTimer(null);
    }
    setShowExplanation(false);
  };

  const handleShowConfirm = () => setShowConfirm(true);
  const handleHideConfirm = () => setShowConfirm(false);
  
  const handleFinishQuiz = () => {
    const {correct, wrong, unanswered, total} = computeScore();
    onFinish({ lesson, correct, wrong, unanswered, total, answers, at: new Date().toISOString(), timeLimitMin: settings?.timeLimitMin, qlist });
  };

  const handleDotClick = (i) => setIndex(i);
  const handleAnswerClick = (optKey) => choose(optKey);

  return (<div className="max-w-3xl mx-auto p-4">
    {/* Points Indicator */}
    <div className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-3 text-white text-center">
      <div className="flex items-center justify-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          ⭐ <span className="font-semibold">{points} т.</span>
        </span>
        <span className="text-white/80">|</span>
        <span className="font-semibold">Ниво {level}</span>
      </div>
    </div>
    
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-600">Урок: <span className="font-medium text-slate-800">{lesson.title || lesson.name}</span></div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="font-medium">Въпрос {index + 1} от {total}</div>
          {settings?.timeLimitMin ? (
            <div className={`font-semibold ${timeLeft<=10?'text-red-600':''}`}>{hms(timeLeft)}</div>
          ) : null}
        </div>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="relative">
        <div className="progress h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out ${
              isNearEnd ? 'bg-orange-500' : 'bg-blue-500'
            } ${isLastQuestion ? 'bg-green-500' : ''}`}
            style={{width: `${progress}%`}}
          />
        </div>
        {/* Progress Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow-sm">
            {progress}%
          </span>
        </div>
      </div>
      
      {/* Progress Text */}
      <div className="text-center mt-2">
        <span className="text-sm text-slate-600">
          {index === 0 ? 'Започваме!' : 
           isLastQuestion ? 'Последен въпрос!' : 
           `Остават ${total - index - 1} въпроса`}
        </span>
      </div>
      
      {/* Question Progress Indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex space-x-1">
          {Array.from({ length: total }, (_, i) => {
            const isAnswered = answers[qlist[i]?.id];
            const dotClasses = `w-3 h-3 rounded-full transition-all ${
              i === index 
                ? 'bg-blue-600 scale-125' 
                : isAnswered 
                  ? 'bg-green-500' 
                  : 'bg-slate-300 hover:bg-slate-400'
            }`;
            
            const dotTitle = `Въпрос ${i + 1}${isAnswered ? ' - Отговорен' : ''}`;
            
            const handleClick = () => handleDotClick(i);
            
            return (
              <button
                key={i}
                className={dotClasses}
                title={dotTitle}
                onClick={handleClick}
              />
            );
          })}
        </div>
      </div>
    </div>
    
    <div className="card mb-4"><div className="card-content">
      <div className="text-lg font-medium mb-4">{current.text || current.question || current.title}</div>
      {current.image ? <img src={current.image} alt="Илюстрация" className="mb-4 rounded-lg border" /> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opts.map(o => {
          const buttonClasses = `btn h-auto py-3 text-left transition-all ${
            chosen === o.key 
              ? (isCorrect ? 'bg-green-100 border-green-300 text-green-800' : 'btn-danger') 
              : 'hover:bg-slate-50'
          } ${answers[current.id] ? 'cursor-default' : ''}`;
          
          const handleClick = () => handleAnswerClick(o.key);
          
          return (
            <button 
              type="button" 
              key={o.key} 
              className={buttonClasses}
              onClick={handleClick}
              disabled={answers[current.id] !== undefined}
            >
              <span className="font-semibold w-6 inline-block">{o.key}.</span>
              <span className="ml-2">{o.text}</span>
              {chosen === o.key && (
                <span className="ml-2 text-sm">
                  {isCorrect ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {showExplain ? (<div className={`mt-4 text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>{isCorrect ? "Вярно! " : "Грешно. "}<span className="text-slate-700">Обяснение: {current.explanation || "—"}</span></div>) : null}
    </div></div>
    <div className="flex items-center justify-between">
      {index < total - 1 ? (
        <button type="button" className="btn" onClick={handleNext}>
          Следващ въпрос
        </button>
      ) : (
        <button type="button" className="btn" onClick={handleShowConfirm}>
          Приключи
        </button>
      )}
      <div className="text-sm text-slate-500">
        Избран отговор: <span className="font-medium">{answers[current.id] || "—"}</span>
      </div>
    </div>
    {showConfirm && (
      <div className="modal-backdrop" onClick={handleHideConfirm}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="mb-2 font-semibold text-lg">Готов ли си да предадеш теста?</div>
          <div className="text-xs text-slate-500 mb-2">Провери обобщението по-долу и натисни „Предай".</div>
          <div className="mb-3 p-3 rounded-lg border bg-slate-50 text-sm">Място за реклама или банер</div>
          <div className="mb-2 text-xs text-slate-500">Рекламна пауза: остава {adLeft} сек.</div>
          <div className="progress mb-3">
            <div style={{width: `${adProgress}%`}}/>
          </div>
          <div className="mt-1 mb-4 text-sm text-slate-700">
            {(() => {
              const {correct, wrong, unanswered} = computeScore();
              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-lg font-bold text-green-700">{correct}</div>
                      <div className="text-xs text-green-600">Правилни</div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="text-lg font-bold text-red-700">{wrong}</div>
                      <div className="text-xs text-red-600">Грешни</div>
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-sm text-slate-600">
                      Отговорени: <b>{correct + wrong}</b> · 
                      Пропуснати: <b>{unanswered}</b> · 
                      Общо: <b>{total}</b>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={handleFinishQuiz}>
              Предай
            </button>
          </div>
        </div>
      </div>
    )}
  </div>);
}