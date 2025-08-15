import React, { useMemo } from "react";
import { normalizeId } from "../utils";

export default function ResultsScreen({ results, classes, lessons, canRestart, onRestart }){
  const byLessonId = useMemo(()=>{ const map = new Map(lessons.map(l=>[normalizeId(l.id),l])); return id=> map.get(normalizeId(id)); },[lessons]);
  if (!results?.length) return <div className="p-6 text-slate-600">Все още няма предадени тестове.</div>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Резултати</h2>
      <div className="space-y-3">{results.map((r,i)=>{ const l=byLessonId(r.lesson?.id); const title=l?.title||l?.name||r.lesson?.title||"Урок"; const pct=r.total?Math.round((r.correct/r.total)*100):0;
        return (
          <div key={i} className="card"><div className="card-content flex items-center justify-between"><div><div className="font-medium">{title}</div><div className="text-xs text-slate-500">{new Date(r.at).toLocaleString()}</div></div>
            <div className="text-right"><div className="text-lg font-semibold">{r.correct} / {r.total}</div><div className="text-xs text-slate-500">{pct}%</div></div></div></div>
        ); })}</div>
      <div className="mt-6"><button type="button" className="btn" onClick={onRestart} disabled={!canRestart}>Започни отначало</button></div>
    </div>
  );
}