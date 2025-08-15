import React, { useMemo } from "react";

export default function StatsScreen({ results }){
  const totals = useMemo(()=>{
    const attempts=results?.length||0;
    const solved=results?.reduce((s,r)=>s+(r.correct||0),0)||0;
    const totalQs=results?.reduce((s,r)=>s+(r.total||0),0)||0;
    const accuracy=totalQs?Math.round((solved/totalQs)*100):0;
    return { attempts, solved, totalQs, accuracy };
  },[results]);

  if (!results?.length) {
    return <div className="max-w-3xl mx-auto p-6 text-slate-600">Няма достатъчно данни за статистика.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6"><h2 className="text-xl font-semibold mb-4">Статистика</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card"><div className="card-content text-center"><div className="text-2xl font-bold">{totals.attempts}</div><div className="text-xs text-slate-500">Опити</div></div></div>
        <div className="card"><div className="card-content text-center"><div className="text-2xl font-bold">{totals.solved}</div><div className="text-xs text-slate-500">Вярни</div></div></div>
        <div className="card"><div className="card-content text-center"><div className="text-2xl font-bold">{totals.totalQs}</div><div className="text-xs text-slate-500">Въпроси</div></div></div>
        <div className="card"><div className="card-content text-center"><div className="text-2xl font-bold">{totals.accuracy}%</div><div className="text-xs text-slate-500">Точност</div></div></div>
      </div>
    </div>
  );
}