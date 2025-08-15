import React, { useMemo, useState } from "react";
import { groupBy, normalizeId } from "../utils";

function SimpleTabs({ defaultValue, tabs }){
  const [val,setVal] = useState(defaultValue || (tabs[0] && tabs[0].value));
  return (<div>
    <div className="grid grid-cols-2 w-full gap-2">
      {tabs.map(t=>(<button type="button" key={t.value} onClick={()=>setVal(t.value)} className={`btn ${val===t.value? 'bg-blue-50 border-blue-300':''}`}>{t.label}</button>))}
    </div>
    <div className="pt-4">{tabs.find(t=>t.value===val)?.content}</div>
  </div>);
}

export default function TestsScreen({ profile, lessons, classes, questions, onStartQuiz }){
  const lessonsByClass = useMemo(()=> groupBy(lessons, (l)=> normalizeId(l.class_id || l.classId || l.class || l.grade)), [lessons]);
  const classList = useMemo(()=> classes.map(c=> ({ id: normalizeId(c.id)||c.name, name: c.name||c.title||c.id })), [classes]);
  const currentClassId = profile?.classId; const currentLessons = lessonsByClass[currentClassId] || [];
  function listQuestionsForLesson(lessonId){ const lid=normalizeId(lessonId); return questions.filter(q=> normalizeId(q.lesson_id||q.lessonId||q.lesson)===lid); }
  return (<div className="max-w-4xl mx-auto p-4">
    <SimpleTabs defaultValue="by-lesson" tabs={[
      {value:'by-lesson', label:'По тема / уроци', content:(
        <div>
          <h3 className="text-lg font-semibold mb-3">{`Уроци за ${classList.find(c=>c.id===currentClassId)?.name || "избрания клас"}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{currentLessons.map(l=>{ const qs=listQuestionsForLesson(l.id);
            return (<div key={normalizeId(l.id)} className="card hover:shadow-md transition"><div className="card-content flex items-center justify-between">
              <div><div className="font-medium">{l.title || l.name}</div><div className="text-xs text-slate-500">Въпроси: {qs.length}</div></div>
              <button type="button" className="btn" onClick={()=>onStartQuiz(l, qs)} disabled={!qs.length}>Старт</button></div></div>); })}</div>
        </div>
      )},
      {value:'by-class', label:'По класове', content:(
        <div className="space-y-4">{classList.map(cls=>(<div key={cls.id}>
          <div className="text-sm font-semibold mb-2">{cls.name}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{(lessonsByClass[cls.id]||[]).map(l=>{ const qs=listQuestionsForLesson(l.id);
            return (<div key={normalizeId(l.id)} className="card"><div className="card-content flex items-center justify-between">
              <div><div className="font-medium">{l.title || l.name}</div><div className="text-xs text-slate-500">Въпроси: {qs.length}</div></div>
              <button type="button" className="btn" onClick={()=>onStartQuiz(l, qs)} disabled={!qs.length}>Старт</button></div></div>); })}</div>
        </div>))}</div>
      )}
    ]}/>
  </div>);
}