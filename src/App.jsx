import React, { useEffect, useMemo, useRef, useState } from "react";
import { Settings, Home, Play, CheckCircle, BarChart3, BookOpen, ListChecks } from "lucide-react";
import Papa from "papaparse";

// Google Sheets
const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
};

// Storage
const STORAGE_KEYS = {
  profile: "mathapp_profile_v1",
  results: "mathapp_results_v1",
  settings: "mathapp_settings_v1",
};

function useLocalStorage(key, initialValue){
  const [value,setValue] = useState(()=>{
    try{ const raw = localStorage.getItem(key); return raw? JSON.parse(raw): initialValue; }catch{ return initialValue; }
  });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(value)); }catch{} },[key,value]);
  return [value,setValue];
}

async function fetchCSV(url){
  return new Promise((resolve,reject)=>{
    Papa.parse(url, { download:true, header:true, skipEmptyLines:true,
      complete:(res)=>resolve(res.data), error:(err)=>reject(err) });
  });
}

function useSheetsData(){
  const [data,setData] = useState({ classes:[], subjects:[], lessons:[], questions:[] });
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  useEffect(()=>{
    let dead=false;
    (async()=>{
      try{
        const [classes,subjects,lessons,questions] = await Promise.all([
          fetchCSV(SHEETS.classes), fetchCSV(SHEETS.subjects),
          fetchCSV(SHEETS.lessons), fetchCSV(SHEETS.questions)
        ]);
        if(!dead) setData({classes,subjects,lessons,questions});
      }catch(e){ if(!dead) setError(e?.message || 'Грешка при зареждане'); }
      finally{ if(!dead) setLoading(false); }
    })();
    return ()=>{ dead=true; }
  },[]);
  return { ...data, loading, error };
}

const norm = v => v==null? null: String(v).trim();
const groupBy = (arr, fn) => arr.reduce((a,x)=>{ const k=fn(x); (a[k]=a[k]||[]).push(x); return a; },{});

function Header({ title, profile, goHome, openSettings }){
  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur border-b z-10">
      <div className="mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button type="button" onClick={goHome} className="p-2 rounded-lg hover:bg-slate-100"><Home className="w-5 h-5"/></button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{profile?.name || 'Гост'} · {profile?.classId? `Клас: ${profile.classId}`:'Без клас'}</span>
          <button type="button" onClick={openSettings} className="p-2 rounded-lg hover:bg-slate-100" title="Настройки"><Settings className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
}

function Onboarding({ classes, onDone }){
  const [name,setName] = useState('');
  const [classId,setClassId] = useState('');
  const canGo = name.trim().length>=2 && classId;
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-md px-4 py-10">
        <h2 className="text-2xl font-bold mb-2">Добре дошъл! 🎓</h2>
        <p className="text-slate-600 mb-6">Нека те опознаем, за да ти подберем правилните тестове.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Име / прякор</label>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={e=>setName(e.target.value)} placeholder="напр. Алекс"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Кой клас си?</label>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2" value={classId} onChange={e=>setClassId(e.target.value)}>
              <option value="">Избери клас</option>
              {classes.map(c=> <option key={norm(c.id)||c.name} value={norm(c.id)||c.name}>{c.name || c.title || c.id}</option>)}
            </select>
          </div>
          <button type="button" disabled={!canGo} onClick={()=>onDone({name:name.trim(), classId})} className="w-full rounded-lg bg-slate-800 text-white py-2 disabled:opacity-50">Продължи</button>
        </div>
      </div>
    </div>
  );
}

function SquareTile({ icon:Icon, label, onClick }){
  return <button type="button" onClick={onClick} className="aspect-square w-full rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center">
    <Icon className="w-10 h-10 mb-2"/><span className="text-sm font-medium">{label}</span>
  </button>;
}

function Progress({ value=0 }){
  return <div className="h-2 bg-slate-200 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width:`${value}%`}}/></div>;
}

function Quiz({ lesson, questions, onFinish, settings }){
  const [i,setI] = useState(0);
  const [answers,setAnswers] = useState({});
  const [show,setShow] = useState(false);
  const [timeLeft,setTimeLeft] = useState(()=>(settings?.timeLimitMin||0)*60);
  const autoRef = useRef(null);
  const AD = 5; const [adLeft,setAdLeft] = useState(AD);

  const prepared = useMemo(()=>{
    const base=[...questions];
    if (settings?.shuffleQuestions) base.sort(()=>Math.random()-0.5);
    return base.map(q=>{
      const opts=[{k:'A',t:q.A??q.a},{k:'B',t:q.B??q.b},{k:'C',t:q.C??q.c},{k:'D',t:q.D??q.d}].filter(o=>o.t!=null && String(o.t).trim()!=='');
      const correctKey=String(q.correct||q.correct_option||q.answer||'').toUpperCase();
      const correctText={A:q.A,B:q.B,C:q.C,D:q.D}[correctKey];
      const shuffled = settings?.shuffleOptions ? [...opts].sort(()=>Math.random()-0.5) : opts;
      const newKey = (shuffled.find(o=>o.t===correctText)||{}).k || correctKey;
      return {...q, __opts:shuffled, __key:newKey};
    });
  },[questions, settings?.shuffleQuestions, settings?.shuffleOptions]);

  const cur = prepared[i]; const total=prepared.length; const progress = total? Math.round((i/total)*100):0;
  useEffect(()=>()=>{ if(autoRef.current){ clearTimeout(autoRef.current); autoRef.current=null; }},[i]);
  useEffect(()=>{ if (!settings?.timeLimitMin) return; if (timeLeft<=0){ submit(); return; } const t=setTimeout(()=>setTimeLeft(timeLeft-1),1000); return ()=>clearTimeout(t); },[timeLeft, settings?.timeLimitMin]);
  useEffect(()=>{ if(!show) return; setAdLeft(AD); const tick=setInterval(()=>{ setAdLeft(s=>{ if(s<=1){ clearInterval(tick); return 0;} return s-1; }); },1000); return ()=>clearInterval(tick); },[show]);

  if (!cur) return <div className="p-6 text-center">Няма въпроси за този урок.</div>;

  const chosen = answers[cur.id];
  const isCorrect = chosen && chosen.toUpperCase()===cur.__key;
  const showExp = settings?.showExplanation && chosen;

  function choose(k){
    setAnswers(a=>({...a, [cur.id]:k}));
    if (settings?.instantNext){
      if (autoRef.current){ clearTimeout(autoRef.current); autoRef.current=null; }
      const delay = Math.max(1, Number(settings.instantDelaySec||4))*1000;
      autoRef.current = setTimeout(()=>{
        autoRef.current=null;
        if (i<total-1) setI(i+1); else setShow(true);
      }, delay);
    }
  }
  function compute(){ let c=0; for(const q of prepared){ if ((answers[q.id]||'').toUpperCase()===(q.__key||'')) c++; } return {c, total}; }
  function submit(){ const {c, total} = compute(); onFinish({ lesson, correct:c, total, answers, at:new Date().toISOString(), timeLimitMin: settings?.timeLimitMin }); }

  const adProgress = ((AD - adLeft)/AD)*100;

  return <div className="max-w-3xl mx-auto p-4">
    <div className="mb-4">
      <div className="flex justify-between mb-2 text-sm text-slate-600">
        <div>Урок: <span className="font-medium text-slate-800">{lesson.title || lesson.name}</span></div>
        <div className="flex items-center gap-4"><div>Въпрос {i+1} от {total}</div>{settings?.timeLimitMin? <div className={`${timeLeft<=10?'text-red-600':''} font-semibold`}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>:null}</div>
      </div>
      <Progress value={progress}/>
    </div>

    <div className="bg-white border rounded-2xl p-6 mb-4">
      <div className="text-lg font-medium mb-4">{cur.text || cur.question || cur.title}</div>
      {cur.image ? <img src={cur.image} alt="Илюстрация" className="mb-4 rounded-lg border" /> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cur.__opts.map(o=>(
          <button type="button" key={o.k} onClick={()=>choose(o.k)} className={`h-auto py-3 px-4 text-left border rounded-lg ${chosen===o.k?(isCorrect?'bg-green-50 border-green-300':'bg-red-50 border-red-300'):'bg-white hover:bg-slate-50 border-slate-300'}`}>
            <span className="font-semibold w-6 inline-block">{o.k}.</span><span className="ml-2">{o.t}</span>
          </button>
        ))}
      </div>
      {showExp && <div className={`mt-4 text-sm ${isCorrect?'text-green-700':'text-red-700'}`}>{isCorrect?'Вярно! ':'Грешно. '}<span className="text-slate-700">Обяснение: {cur.explanation || '—'}</span></div>}
    </div>

    <div className="flex items-center justify-between">
      {i<total-1? <button type="button" onClick={()=>setI(i+1)} className="rounded-lg border px-4 py-2">Следващ въпрос</button> : <button type="button" onClick={()=>setShow(true)} className="rounded-lg border px-4 py-2">Приключи</button>}
      <div className="text-sm text-slate-500">Избран отговор: <b>{answers[cur.id] || '—'}</b></div>
    </div>

    {show && <div className="fixed inset-0 bg-black/40 grid place-items-center z-50" onClick={()=>setShow(false)}>
      <div className="bg-white rounded-2xl p-4 min-w-[320px] max-w-[560px]" onClick={(e)=>e.stopPropagation()}>
        <div className="font-semibold text-lg mb-1">Готов ли си да предадеш теста?</div>
        <div className="text-xs text-slate-500 mb-3">Провери обобщението по-долу и натисни „Предай“.</div>
        <div className="mb-3 p-3 rounded-lg border bg-slate-50 text-sm">Място за реклама или банер</div>
        <div className="mb-2 text-xs text-slate-500">Рекламна пауза: остава {adLeft} сек.</div>
        <Progress value={adProgress}/>
        <div className="mt-4 mb-4 text-sm text-slate-700">Отговорени: <b>{Object.keys(answers).length}</b> · Пропуснати: <b>{total-Object.keys(answers).length}</b> · Общо: <b>{total}</b></div>
        <div className="flex justify-end gap-2"><button type="button" className="border px-4 py-2 rounded-lg" onClick={submit}>Предай</button></div>
      </div>
    </div>}
  </div>;
}

function Home({ goto }){
  const tiles=[
    {key:'theory', label:'Теория', icon:BookOpen},
    {key:'tests', label:'Тестове', icon:ListChecks},
    {key:'results', label:'Резултати', icon:CheckCircle},
    {key:'stats', label:'Статистика', icon:BarChart3},
  ];
  return <div className="mx-auto max-w-4xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
    {tiles.map(t=><SquareTile key={t.key} icon={t.icon} label={t.label} onClick={()=>goto(t.key)}/>)}
  </div>;
}

function Results({ results, lessons }){
  const byId = useMemo(()=>{
    const m = new Map(lessons.map(l=>[norm(l.id), l]));
    return (id)=> m.get(norm(id));
  },[lessons]);

  if (!results?.length){
    return <div className="p-6 text-slate-600">
      Все още няма предадени тестове.
      <div className="mt-3">
        <button type="button" className="border px-3 py-2 rounded-lg" onClick={()=>{
          // demo result for testing UX
          const demo = { lesson:{id:'demo'}, correct: 7, total: 10, at: new Date().toISOString() };
          const arr = JSON.parse(localStorage.getItem(STORAGE_KEYS.results)||'[]');
          arr.unshift(demo); localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(arr));
          location.reload();
        }}>Добави демо резултат</button>
      </div>
    </div>;
  }

  return <div className="max-w-3xl mx-auto p-6 space-y-3">
    <h2 className="text-xl font-semibold mb-2">Резултати</h2>
    {results.map((r,idx)=>{
      const l = byId(r.lesson?.id);
      const title = l?.title || l?.name || r.lesson?.title || 'Урок';
      const pct = r.total? Math.round((r.correct/r.total)*100):0;
      return <div key={idx} className="bg-white border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-slate-500">{new Date(r.at).toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{r.correct} / {r.total}</div>
          <div className="text-xs text-slate-500">{pct}%</div>
        </div>
      </div>;
    })}
  </div>;
}

function Stats({ results }){
  const totals = useMemo(()=>{
    const attempts = results?.length || 0;
    const solved = results?.reduce((s,r)=>s+(r.correct||0),0) || 0;
    const totalQs = results?.reduce((s,r)=>s+(r.total||0),0) || 0;
    const accuracy = totalQs ? Math.round((solved/totalQs)*100) : 0;
    return { attempts, solved, totalQs, accuracy };
  },[results]);

  return <div className="max-w-3xl mx-auto p-6">
    <h2 className="text-xl font-semibold mb-4">Статистика</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border rounded-2xl p-4 text-center"><div className="text-2xl font-bold">{totals.attempts}</div><div className="text-xs text-slate-500">Опити</div></div>
      <div className="bg-white border rounded-2xl p-4 text-center"><div className="text-2xl font-bold">{totals.solved}</div><div className="text-xs text-slate-500">Вярни</div></div>
      <div className="bg-white border rounded-2xl p-4 text-center"><div className="text-2xl font-bold">{totals.totalQs}</div><div className="text-xs text-slate-500">Въпроси</div></div>
      <div className="bg-white border rounded-2xl p-4 text-center"><div className="text-2xl font-bold">{totals.accuracy}%</div><div className="text-xs text-slate-500">Точност</div></div>
    </div>
  </div>;
}

export default function App(){
  const { classes, lessons, questions, loading, error } = useSheetsData();
  const [profile,setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [results,setResults] = useLocalStorage(STORAGE_KEYS.results, []);
  const [settings,setSettings] = useLocalStorage(STORAGE_KEYS.settings, { showExplanation:true, shuffleQuestions:true, shuffleOptions:true, timeLimitMin:8, instantNext:false, instantDelaySec:4 });
  const [route,setRoute] = useState('home');
  const [activeQuiz,setActiveQuiz] = useState(null);
  const [settingsOpen,setSettingsOpen] = useState(false);
  const [lastQuiz,setLastQuiz] = useState(null);

  useEffect(()=>{ if (!profile && !loading) setRoute('onboarding'); },[profile,loading]);

  function finish(summary){
    const newResults=[summary, ...results];
    setResults(newResults);
    setLastQuiz({ lesson: summary.lesson, questions: activeQuiz?.questions || [] });
    setActiveQuiz(null);
    setRoute('results'); // ensure we land on Results
  }

  if (loading) return <div className="min-h-screen grid place-items-center"><div className="text-center"><div className="animate-pulse text-2xl font-semibold">Зареждаме данните…</div><div className="text-sm text-slate-500">Google Sheets CSV</div></div></div>;
  if (error) return <div className="min-h-screen grid place-items-center p-6"><div className="text-center"><div className="text-xl font-semibold">Възникна грешка</div><div className="text-slate-600">{String(error)}</div><button className="mt-3 border px-3 py-2 rounded-lg" onClick={()=>location.reload()}>Презареди</button></div></div>;

  if (route==='onboarding' || !profile) return <Onboarding classes={classes} onDone={(p)=>{ setProfile(p); setRoute('home'); }}/>
  if (activeQuiz) return <div className="min-h-screen bg-slate-50">
    <Header title="Тест" profile={profile} goHome={()=>setActiveQuiz(null)} openSettings={()=>setSettingsOpen(true)}/>
    <Quiz lesson={activeQuiz.lesson} questions={activeQuiz.questions} onFinish={finish} settings={settings}/>
    {settingsOpen && <SettingsModal settings={settings} setSettings={setSettings} onClose={()=>setSettingsOpen(false)} />}
  </div>;

  return <div className="min-h-screen">
    <Header title={titleOf(route)} profile={profile} goHome={()=>setRoute('home')} openSettings={()=>setSettingsOpen(true)} />
    {route==='home' && <Home goto={setRoute}/>}
    {route==='theory' && <div className="max-w-3xl mx-auto p-6 text-slate-700"><h2 className="text-xl font-semibold mb-3">Теория</h2><p>Placeholder.</p></div>}
    {route==='tests' && <Tests profile={profile} lessons={lessons} questions={questions} onStart={(lesson,qs)=> setActiveQuiz({ lesson, questions: qs })}/>}
    {route==='results' && <Results results={results} lessons={lessons}/>}
    {route==='stats' && <Stats results={results}/>}
    {settingsOpen && <SettingsModal settings={settings} setSettings={setSettings} onClose={()=>setSettingsOpen(false)} />}

    {/* Debug widget */}
    <div className="fixed bottom-3 right-3 bg-white/90 backdrop-blur border rounded-lg shadow p-2 text-xs space-y-1 z-40">
      <div>route: <b>{route}</b></div>
      <div>results: <b>{results.length}</b></div>
      <div className="flex gap-1">
        <button type="button" className="border px-2 py-1 rounded" onClick={()=>setRoute('home')}>Начало</button>
        <button type="button" className="border px-2 py-1 rounded" onClick={()=>setRoute('tests')}>Тестове</button>
        <button type="button" className="border px-2 py-1 rounded" onClick={()=>setRoute('results')}>Резултати</button>
        <button type="button" className="border px-2 py-1 rounded" onClick={()=>setRoute('stats')}>Статистика</button>
      </div>
    </div>
  </div>;
}

function SettingsModal({ settings, setSettings, onClose }){
  return <div className="fixed inset-0 bg-black/40 grid place-items-center z-50" onClick={onClose}>
    <div className="bg-white rounded-2xl p-4 w-[480px] max-w-[92vw]" onClick={e=>e.stopPropagation()}>
      <div className="text-lg font-semibold mb-1">Настройки</div>
      <div className="text-xs text-slate-500 mb-3">Персонализирай тестовете според предпочитанията си.</div>
      <div className="space-y-3">
        <label className="flex justify-between items-center text-sm"><span>Показвай обяснение след отговор</span><input type="checkbox" checked={!!settings.showExplanation} onChange={e=>setSettings({...settings, showExplanation:e.target.checked})}/></label>
        <label className="flex justify-between items-center text-sm"><span>Разбърквай въпросите</span><input type="checkbox" checked={!!settings.shuffleQuestions} onChange={e=>setSettings({...settings, shuffleQuestions:e.target.checked})}/></label>
        <label className="flex justify-between items-center text-sm"><span>Разбърквай отговорите</span><input type="checkbox" checked={!!settings.shuffleOptions} onChange={e=>setSettings({...settings, shuffleOptions:e.target.checked})}/></label>
        <div className="flex justify-between items-center text-sm gap-2"><span>Лимит от време (минути, 0 = без)</span><input type="number" min="0" className="w-24 border rounded-lg px-2 py-1" value={settings.timeLimitMin} onChange={e=>setSettings({...settings, timeLimitMin: Math.max(0, parseInt(e.target.value||'0'))})}/></div>
        <label className="flex justify-between items-center text-sm"><span>Автоматично към следващия въпрос</span><input type="checkbox" checked={!!settings.instantNext} onChange={e=>setSettings({...settings, instantNext:e.target.checked})}/></label>
        <div className="flex justify-between items-center text-sm gap-2">
          <span>Време до преминаване (сек.)</span>
          <select className="w-28 border rounded-lg px-2 py-1" disabled={!settings.instantNext} value={String(settings.instantDelaySec || 4)} onChange={(e)=>setSettings({...settings, instantDelaySec: parseInt(e.target.value,10)})}>
            {[2,3,4,5,6,8,10].map(s=> <option key={s} value={String(s)}>{s} сек.</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3"><button type="button" className="border px-3 py-2 rounded-lg" onClick={onClose}>Готово</button></div>
    </div>
  </div>;
}

function Tests({ profile, lessons, questions, onStart }){
  const lessonsByClass = useMemo(()=> groupBy(lessons, l=> norm(l.class_id || l.classId || l.class || l.grade)), [lessons]);
  const currentClassId = profile?.classId;
  const list = lessonsByClass[currentClassId] || [];
  function qsFor(lessonId){ const id = norm(lessonId); return questions.filter(q=> norm(q.lesson_id || q.lessonId || q.lesson)===id); }
  return <div className="max-w-4xl mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {list.map(l=>{
        const qs = qsFor(l.id);
        return <div key={norm(l.id)} className="bg-white border rounded-2xl p-4 flex items-center justify-between">
          <div><div className="font-medium">{l.title || l.name}</div><div className="text-xs text-slate-500">Въпроси: {qs.length}</div></div>
          <button type="button" className="border px-3 py-2 rounded-lg disabled:opacity-50" onClick={()=>onStart(l,qs)} disabled={!qs.length}><Play className="w-4 h-4 inline -mt-1 mr-1"/>Старт</button>
        </div>;
      })}
      {!list.length && <div className="text-slate-600">Няма уроци за избрания клас.</div>}
    </div>
  </div>;
}

function titleOf(route){
  switch(route){
    case 'home': return 'Начало';
    case 'theory': return 'Теория';
    case 'tests': return 'Тестове';
    case 'results': return 'Резултати';
    case 'stats': return 'Статистика';
    default: return 'Math App';
  }
}
