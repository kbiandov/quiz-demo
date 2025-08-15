import React, { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { Home, Settings, BookOpen, ListChecks, CheckCircle, BarChart3, Play } from "lucide-react";

const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
};

const STORAGE_KEYS = { profile:"mathapp_profile_v1", results:"mathapp_results_v1", settings:"mathapp_settings_v1" };
const normalizeId = v => (v==null? null : String(v).trim());
const groupBy = (arr, fn) => arr.reduce((a,x)=>{ const k=fn(x); (a[k]=a[k]||[]).push(x); return a; }, {});

function useLocalStorage(key, initial){
  const [val,setVal] = useState(()=>{ try{ const raw=localStorage.getItem(key); return raw? JSON.parse(raw): initial; }catch{ return initial; } });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(val)); }catch{} },[key,val]);
  return [val,setVal];
}

function fetchCSV(url){
  return new Promise((resolve,reject)=>{
    Papa.parse(url,{download:true, header:true, skipEmptyLines:true, complete:r=>resolve(r.data), error:reject});
  });
}
function useSheetsData(){
  const [data,setData] = useState({classes:[], subjects:[], lessons:[], questions:[]});
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  useEffect(()=>{ let cancel=false; (async()=>{
    setLoading(true); setError(null);
    try{
      const [classes,subjects,lessons,questions] = await Promise.all([
        fetchCSV(SHEETS.classes), fetchCSV(SHEETS.subjects), fetchCSV(SHEETS.lessons), fetchCSV(SHEETS.questions)
      ]);
      if(!cancel) setData({classes,subjects,lessons,questions});
    }catch(e){ if(!cancel) setError(e?.message||"Грешка при зареждане"); }
    finally{ if(!cancel) setLoading(false); }
  })(); return ()=>{cancel=true}; },[]);
  return { ...data, loading, error };
}

function SquareTile({icon:Icon, label, onClick}){
  return (<button type="button" onClick={onClick} className="group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full aspect-square">
    <Icon className="h-10 w-10 mb-3" /><span className="text-sm font-medium">{label}</span>
  </button>);
}

function Modal({open, onClose, children, title}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl w-[min(560px,92vw)] p-4 z-[61]">
        {title && <div className="text-lg font-semibold mb-2">{title}</div>}
        {children}
        <div className="mt-3 text-right"><button type="button" className="px-4 py-2 rounded-lg border" onClick={onClose}>Затвори</button></div>
      </div>
    </div>
  );
}

function Header({title, profile, onHome, onLogout, onOpenSettings}){
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onHome} className="p-2 rounded-lg hover:bg-slate-100"><Home className="h-5 w-5" /></button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span>{profile?.name || "Гост"} · {profile?.classId ? `Клас: ${profile.classId}` : "Без клас"}</span>
          <button type="button" onClick={onLogout} className="px-3 py-1.5 rounded-lg border hover:bg-slate-50">Смени профил</button>
          <button type="button" aria-label="Настройки" onClick={onOpenSettings} className="p-2 rounded-lg hover:bg-slate-100 focus:ring-2 focus:ring-blue-400">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Onboarding({classes, onDone}){
  const [name,setName] = useState(""); const [classId,setClassId] = useState("");
  const canContinue = name.trim().length>=2 && classId;
  return (<div className="min-h-screen">
    <div className="mx-auto max-w-md px-4 py-10">
      <h2 className="text-2xl font-bold mb-2">Добре дошъл! 🎓</h2>
      <p className="text-slate-600 mb-6">Въведи име и избери клас.</p>
      <div className="space-y-4">
        <div><label className="block text-sm mb-1">Име / прякор</label>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="напр. Алекс" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><label className="block text-sm mb-1">Кой клас си?</label>
          <select className="w-full rounded-lg border px-3 py-2" value={classId} onChange={e=>setClassId(e.target.value)}>
            <option value="">Избери клас</option>
            {classes.map(c=>(<option key={normalizeId(c.id)||c.name} value={normalizeId(c.id)||c.name}>{c.name||c.title||c.class||c.id}</option>))}
          </select></div>
        <button type="button" className="w-full px-4 py-2 rounded-lg bg-slate-200 border hover:bg-slate-300" disabled={!canContinue} onClick={()=>onDone({name:name.trim(), classId})}>Продължи</button>
      </div>
    </div>
  </div>);
}

function SimpleTabs({tabs, value, onChange}){
  return (
    <div>
      <div className="flex gap-2 border-b">
        {tabs.map(t=>(
          <button key={t.value} type="button" onClick={()=>onChange(t.value)}
            className={`px-3 py-2 rounded-t-md border ${value===t.value?'bg-blue-50 border-blue-300 -mb-px':'bg-white border-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Quiz({ lesson, questions, onFinish, settings }){
  const [index,setIndex] = useState(0);
  const [answers,setAnswers] = useState({});
  const [showConfirm,setShowConfirm] = useState(false);
  const [timeLeft,setTimeLeft] = useState(()=> (settings?.timeLimitMin||0)*60);
  const autoTimerRef = useRef(null);
  const AD_SECONDS=5; const [adLeft,setAdLeft] = useState(AD_SECONDS);

  const qlist = useMemo(()=>{
    const base=[...questions]; if(settings?.shuffleQuestions) base.sort(()=>Math.random()-0.5);
    return base.map(q=>{
      const options=[{key:'A',text:q.A??q.a},{key:'B',text:q.B??q.b},{key:'C',text:q.C??q.c},{key:'D',text:q.D??q.d}].filter(o=>o.text!=null && String(o.text).trim()!=='');
      const correctKey=String(q.correct||q.correct_option||q.answer||'').toUpperCase();
      const correctText={A:q.A,B:q.B,C:q.C,D:q.D}[correctKey];
      const shuffled = settings?.shuffleOptions ? [...options].sort(()=>Math.random()-0.5) : options;
      const newCorrectKey=(shuffled.find(o=>o.text===correctText)||{}).key||correctKey;
      return {...q, __options:shuffled, __correctKey:newCorrectKey};
    });
  },[questions,settings?.shuffleQuestions,settings?.shuffleOptions]);

  const current=qlist[index]; const total=qlist.length; const progress = total? Math.round((index/total)*100):0;

  useEffect(()=>()=>{ if(autoTimerRef.current){ clearTimeout(autoTimerRef.current); autoTimerRef.current=null; }},[index]);
  useEffect(()=>{ if(!settings?.timeLimitMin) return; if(timeLeft<=0){ submit(); return; } const t=setTimeout(()=>setTimeLeft(timeLeft-1),1000); return ()=>clearTimeout(t); },[timeLeft,settings?.timeLimitMin]);
  useEffect(()=>{ if(!showConfirm) return; setAdLeft(AD_SECONDS); const tick=setInterval(()=>{ setAdLeft(s=>{ if(s<=1){ clearInterval(tick); return 0; } return s-1; }); },1000); return ()=>clearInterval(tick); },[showConfirm]);

  function choose(key){ setAnswers(a=>({...a,[current.id]:key})); if(settings?.instantNext){ if(autoTimerRef.current){clearTimeout(autoTimerRef.current);autoTimerRef.current=null;} const delayMs=Math.max(1,Number(settings.instantDelaySec||4))*1000; autoTimerRef.current=setTimeout(()=>{ autoTimerRef.current=null; if(index<total-1){setIndex(index+1)} else {setShowConfirm(true)} },delayMs);} }
  function computeScore(){ let correct=0; for(const q of qlist){ if((answers[q.id]||'').toUpperCase()===(q.__correctKey||'').toUpperCase()) correct++; } return {correct,total}; }
  function submit(){ const {correct,total}=computeScore(); onFinish({ lesson, correct, total, answers, at:new Date().toISOString(), timeLimitMin:settings?.timeLimitMin }); }
  if(!current) return <div className="p-6 text-center">Няма въпроси за този урок.</div>;
  const opts=current.__options; const hms=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; const chosen=answers[current.id]; const showExplain=settings?.showExplanation && chosen; const isCorrect=chosen && chosen.toUpperCase()===current.__correctKey; const adProgress=((AD_SECONDS-adLeft)/AD_SECONDS)*100;

  return (<div className="max-w-3xl mx-auto p-4">
    <div className="mb-4"><div className="flex items-center justify_between mb-2">
      <div className="text-sm text-slate-600">Урок: <span className="font-medium text-slate-800">{lesson.title||lesson.name}</span></div>
      <div className="flex items-center gap-4 text-sm text-slate-600"><div>Въпрос {index+1} от {total}</div>{settings?.timeLimitMin ? (<div className={`font-semibold ${timeLeft<=10?'text-red-600':''}`}>{hms(timeLeft)}</div>):null}</div>
    </div><div className="h-2 bg-slate-200 rounded-full"><div className="h-full rounded-full bg-blue-400" style={{width:`${progress}%`}}/></div></div>
    <div className="bg-white rounded-2xl border p-6 mb-4">
      <div className="text-lg font-medium mb-4">{current.text || current.question || current.title}</div>
      {current.image ? <img src={current.image} alt="Илюстрация" className="mb-4 rounded-lg border" /> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opts.map(o=>(<button key={o.key} type="button" onClick={()=>choose(o.key)} className={`h-auto py-3 px-4 rounded-lg text-left border ${chosen===o.key?(isCorrect?'bg-slate-200':'bg-red-50 border-red-200'):'bg-white hover:bg-slate-50'}`}>
          <span className="font-semibold w-6 inline-block">{o.key}.</span><span className="ml-2">{o.text}</span></button>))}
      </div>
      {showExplain ? (<div className={`mt-4 text-sm ${isCorrect?'text-green-700':'text-red-700'}`}>{isCorrect?'Вярно! ':'Грешно. '}<span className="text-slate-700">Обяснение: {current.explanation || '—'}</span></div>) : null}
    </div>
    <div className="flex items-center justify-between"><button type="button" onClick={()=> index<total-1? setIndex(index+1): setShowConfirm(true)} className="px-4 py-2 rounded-lg border bg-slate-200 hover:bg-slate-300">{index<total-1?'Следващ въпрос':'Приключи'}</button>
      <div className="text-sm text-slate-500">Избран отговор: <span className="font-medium">{answers[current.id] || "—"}</span></div></div>
    <Modal open={showConfirm} onClose={()=>setShowConfirm(false)} title="Готов ли си да предадеш теста?">
      <div className="mb-3 p-3 rounded-lg border bg-slate-50 text-sm">Място за реклама или банер</div>
      <div className="mb-2 text-xs text-slate-500">Рекламна пауза: остава {adLeft} сек.</div>
      <div className="h-2 bg-slate-200 rounded-full mb-3"><div className="h-full rounded-full bg-blue-400" style={{width:`${adProgress}%`}}/></div>
      <div className="mt-2 mb-4 text-sm text-slate-700">Отговорени: <b>{Object.keys(answers).length}</b> · Пропуснати: <b>{total - Object.keys(answers).length}</b> · Общо: <b>{total}</b></div>
      <div className="text-right"><button type="button" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={submit}>Предай</button></div>
    </Modal>
  </div>);
}

function TestsScreen({ profile, lessons, classes, questions, onStartQuiz }){
  const lessonsByClass = useMemo(()=> groupBy(lessons, l=> normalizeId(l.class_id||l.classId||l.class||l.grade)), [lessons]);
  const classList = useMemo(()=> classes.map(c=>({ id: normalizeId(c.id)||c.name, name: c.name||c.title||c.id })), [classes]);
  const currentClassId = profile?.classId; const currentLessons = lessonsByClass[currentClassId] || [];
  function listQuestionsForLesson(lessonId){ const lid = normalizeId(lessonId); return questions.filter(q=> normalizeId(q.lesson_id||q.lessonId||q.lesson)===lid); }
  return (<div className="max-w-4xl mx-auto p-4">
    <SimpleTabs tabs={[{value:'by-lesson',label:'По тема / уроци'},{value:'by-class',label:'По класове'}]} value={'by-lesson'} onChange={()=>{}} />
    <h3 className="text-lg font-semibold mb-3">{`Уроци за ${classList.find(c=>c.id===currentClassId)?.name || "избрания клас"}`}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{currentLessons.map(l=>{ const qs=listQuestionsForLesson(l.id);
      return (<div key={normalizeId(l.id)} className="bg-white rounded-2xl border p-4 flex items-center justify-between">
        <div><div className="font-medium">{l.title||l.name}</div><div className="text-xs text-slate-500">Въпроси: {qs.length}</div></div>
        <button type="button" className="px-3 py-1.5 rounded-lg border hover:bg-slate-50" onClick={()=>onStartQuiz(l,qs)} disabled={!qs.length}><Play className="inline h-4 w-4 mr-1" />Старт</button>
      </div>); })}</div>
  </div>);
}

export default function App(){
  const { classes, subjects, lessons, questions, loading, error } = useSheetsData();
  const [profile,setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [results,setResults] = useLocalStorage(STORAGE_KEYS.results, []);
  const [route,setRoute] = useState("home");
  const [activeQuiz,setActiveQuiz] = useState(null);
  const [settingsOpen,setSettingsOpen] = useState(false);
  const [settings,setSettings] = useLocalStorage(STORAGE_KEYS.settings, { showExplanation:true, shuffleQuestions:true, shuffleOptions:true, timeLimitMin:8, instantNext:false, instantDelaySec:4 });

  // ensure Settings button works: explicit open function
  const openSettings = ()=> setSettingsOpen(true);
  const closeSettings = ()=> setSettingsOpen(false);

  useEffect(()=>{ if(!profile && !loading){ setRoute("onboarding"); }},[profile,loading]);

  const header = (<Header title={routeTitle(route)} profile={profile} onHome={()=>setRoute("home")} onLogout={()=>{setProfile(null); setRoute("onboarding");}} onOpenSettings={openSettings} />);

  if(loading) return <div className="min-h-screen grid place-items-center"><div className="text-center"><div className="animate-pulse text-2xl font-semibold">Зареждаме данните…</div><div className="text-sm text-slate-500 mt-2">Google Sheets CSV</div></div></div>;
  if(error) return <div className="min-h-screen grid place-items-center p-6"><div className="max-w-md text-center"><div className="text-xl font-semibold mb-2">Възникна грешка</div><div className="text-slate-600 mb-4">{String(error)}</div><button type="button" className="px-4 py-2 rounded-lg border" onClick={()=>location.reload()}>Презареди</button></div></div>;

  if(route==="onboarding" || !profile) return (<div className="min-h-screen bg-gradient-to-b from-white to-slate-50">{header}<Onboarding classes={classes} onDone={(p)=>{ setProfile(p); setRoute("home"); }} /></div>);
  if(activeQuiz) return (<div className="min-h-screen bg-slate-50">{header}<Quiz lesson={activeQuiz.lesson} questions={questions.filter(q=> normalizeId(q.lesson_id||q.lessonId||q.lesson)===normalizeId(activeQuiz.lesson.id))} onFinish={(summary)=>{ setResults([summary, ...results]); setActiveQuiz(null); setRoute('results'); }} settings={settings} /></div>);

  return (<div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
    {header}
    {route==="home" && (<div className="mx-auto max-w-4xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <SquareTile icon={BookOpen} label="Теория" onClick={()=>setRoute('theory')} />
      <SquareTile icon={ListChecks} label="Тестове" onClick={()=>setRoute('tests')} />
      <SquareTile icon={CheckCircle} label="Резултати" onClick={()=>setRoute('results')} />
      <SquareTile icon={BarChart3} label="Статистика" onClick={()=>setRoute('stats')} />
    </div>)}
    {route==="theory" && (<div className="max-w-3xl mx-auto p-6 text-slate-700"><h2 className="text-xl font-semibold mb-3">Теория</h2><p>Раздел в разработка.</p></div>)}
    {route==="tests" && (<TestsScreen profile={profile} lessons={lessons} classes={classes} questions={questions} onStartQuiz={(l,qs)=> setActiveQuiz({lesson:l, questions:qs})} />)}
    {route==="results" && (<div className="max-w-3xl mx-auto p-6 text-slate-700">История на резултатите ще добавим след Firestore/Local export.</div>)}
    {route==="stats" && (<div className="max-w-3xl mx-auto p-6 text-slate-700">Статистика ще добавим скоро.</div>)}

    <Modal open={settingsOpen} onClose={closeSettings} title="Настройки">
      <div className="space-y-3">
        <label className="flex items-center justify-between"><span>Показвай обяснение след отговор</span><input type="checkbox" checked={!!settings.showExplanation} onChange={e=>setSettings({...settings, showExplanation:e.target.checked})} /></label>
        <label className="flex items-center justify-between"><span>Разбърквай въпросите</span><input type="checkbox" checked={!!settings.shuffleQuestions} onChange={e=>setSettings({...settings, shuffleQuestions:e.target.checked})} /></label>
        <label className="flex items-center justify-between"><span>Разбърквай отговорите</span><input type="checkbox" checked={!!settings.shuffleOptions} onChange={e=>setSettings({...settings, shuffleOptions:e.target.checked})} /></label>
        <div className="flex items-center justify-between gap-2"><span>Лимит от време (минути, 0 = без)</span><input type="number" min="0" className="w-24 rounded-lg border px-3 py-1.5" value={settings.timeLimitMin} onChange={e=>setSettings({...settings, timeLimitMin: Math.max(0, parseInt(e.target.value||'0'))})} /></div>
        <label className="flex items-center justify-between"><span>Автоматично към следващия въпрос</span><input type="checkbox" checked={!!settings.instantNext} onChange={e=>setSettings({...settings, instantNext:e.target.checked})} /></label>
        <div className="flex items-center justify-between gap-2"><span>Време до преминаване (сек.)</span>
          <select className="w-28 rounded-lg border px-3 py-1.5" disabled={!settings.instantNext} value={String(settings.instantDelaySec||4)} onChange={e=>setSettings({...settings, instantDelaySec: parseInt(e.target.value,10)})}>
            {[2,3,4,5,6,8,10].map(s=> <option key={s} value={String(s)}>{s} сек.</option>)}
          </select>
        </div>
      </div>
    </Modal>

    {/* Debug widget */}
    <div className="fixed bottom-3 right-3 z-[70] bg-white/90 border rounded-xl shadow px-2 py-1 text-xs">
      route: <b>{route}</b>
      <div className="mt-1 flex gap-1">
        {['home','theory','tests','results','stats'].map(r=>(<button key={r} type="button" onClick={()=>setRoute(r)} className={`px-2 py-0.5 rounded border ${route===r?'bg-slate-200':''}`}>{r}</button>))}
        <button type="button" onClick={()=>setSettingsOpen(true)} className="px-2 py-0.5 rounded border">⚙</button>
      </div>
    </div>
  </div>);
}

function routeTitle(r){ switch(r){ case 'home': return 'Начало'; case 'theory': return 'Теория'; case 'tests': return 'Тестове'; case 'results': return 'Резултати'; case 'stats': return 'Статистика'; default: return 'Math App'; } }
