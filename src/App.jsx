
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, Play, BarChart3, BookOpen, ListChecks, Home, LogOut, User, Settings } from "lucide-react";
import Papa from "papaparse";

const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
};

const STORAGE_KEYS = { profile: "mathapp_profile_v1", results: "mathapp_results_v1", settings: "mathapp_settings_v1" };

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initialValue; } catch { return initialValue; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

async function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, { download: true, header: true, skipEmptyLines: true, complete: (res) => resolve(res.data), error: (err) => reject(err) });
  });
}

function useSheetsData() {
  const [data, setData] = useState({ classes: [], subjects: [], lessons: [], questions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diag, setDiag] = useState({});

  const load = async () => {
    setLoading(true); setError(null);
    const keys = Object.keys(SHEETS);
    const startTimes = {}; keys.forEach(k => startTimes[k] = performance.now());
    setDiag(Object.fromEntries(keys.map(k => [k, {status:'loading', ms:0, message:''}])));
    async function runOne(key){
      try{
        const res = await fetchCSV(SHEETS[key]);
        const ms = Math.round(performance.now()-startTimes[key]);
        setDiag(prev=>({...prev,[key]:{status:'ok', ms, message:''}}));
        return [key, res];
      }catch(e){
        const ms = Math.round(performance.now()-startTimes[key]);
        const message = e?.message || 'Неизвестна грешка';
        console.error('[Diag]', key, 'error:', e);
        setDiag(prev=>({...prev,[key]:{status:'error', ms, message}}));
        return [key, null];
      }
    }
    const results = await Promise.all([runOne('classes'),runOne('subjects'),runOne('lessons'),runOne('questions')]);
    const map = Object.fromEntries(results.map(([k,v])=>[k,v]));
    if (results.some(([,v])=>!v)) setError('Някои данни не се заредиха. Виж диагностиката.');
    setData({ classes: map.classes||[], subjects: map.subjects||[], lessons: map.lessons||[], questions: map.questions||[] });
    setLoading(false);
  };
  useEffect(()=>{ load(); }, []);
  return { ...data, loading, error, diag, reload: load };
}

const normalizeId = (v) => (v == null ? null : String(v).trim());
function groupBy(arr, keyFn){ return arr.reduce((acc,x)=>{ const k = keyFn(x); (acc[k]=acc[k]||[]).push(x); return acc; },{}); }

function SquareButton({ icon: Icon, label, onClick }){ return (<button onClick={onClick} className="group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full aspect-square"><Icon className="h-10 w-10 mb-3" /><span className="text-sm font-medium">{label}</span></button>); }

function HeaderBar({ title, profile, onHome, onLogout, onOpenSettings }){
  return (<div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b"><div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2"><Button variant="ghost" size="icon" onClick={onHome}><Home className="h-5 w-5" /></Button><h1 className="text-lg font-semibold">{title}</h1></div>
    <div className="flex items-center gap-2 text-sm text-slate-600"><User className="h-4 w-4" /><span>{profile?.name || "Гост"} · {profile?.classId ? `Клас: ${profile.classId}` : "Без клас"}</span>
      <Button variant="outline" size="sm" onClick={onLogout} className="ml-2"><LogOut className="h-4 w-4 mr-2" />Смени профил</Button>
      <Button variant="ghost" size="icon" onClick={onOpenSettings} title="Настройки" className="group"><Settings className="h-6 w-6 text-gray-700 transition-transform group-hover:rotate-90 group-hover:text-blue-500" /></Button>
    </div></div></div>);
}

function Onboarding({ classes, onDone }){
  const [name, setName] = useState(""); const [classId, setClassId] = useState("");
  const canContinue = name.trim().length >= 2 && classId;
  return (<div className="min-h-screen"><div className="mx-auto max-w-md px-4 py-10">
    <h1 className="text-2xl font-bold mb-2">Добре дошъл! 🎓</h1>
    <p className="text-slate-600 mb-6">Нека те опознаем, за да ти подберем правилните тестове.</p>
    <div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Име / прякор</label><Input placeholder="напр. Алекс" value={name} onChange={(e)=>setName(e.target.value)} /></div>
      <div><label className="block text-sm font-medium mb-1">Кой клас си?</label><Select onValueChange={setClassId} value={classId}><SelectTrigger><SelectValue placeholder="Избери клас" /></SelectTrigger>
        <SelectContent>{classes.map((c)=>(<SelectItem key={normalizeId(c.id) || c.name} value={normalizeId(c.id) || c.name}>{c.name || c.title || c.class || c.id}</SelectItem>))}</SelectContent></Select></div>
      <Button className="w-full" onClick={()=>onDone({ name: name.trim(), classId })} disabled={!canContinue}>Продължи</Button>
    </div><p className="text-xs text-slate-500 mt-6">* Запазваме само име/прякор и клас на устройството ти.</p></div></div>);
}

function Quiz({ lesson, questions, onFinish, settings }){
  const [index,setIndex]=useState(0); const [answers,setAnswers]=useState({}); const [showConfirm,setShowConfirm]=useState(false);
  const [timeLeft,setTimeLeft]=useState(()=> (settings?.timeLimitMin||0)*60); const autoTimerRef=useRef(null);
  const AD_SECONDS=5; const [adLeft,setAdLeft]=useState(AD_SECONDS);

  const qlist = useMemo(()=>{
    const base=[...questions]; if (settings?.shuffleQuestions) base.sort(()=>Math.random()-0.5);
    return base.map(q=>{
      const options=[{key:'A',text:q.A??q.a},{key:'B',text:q.B??q.b},{key:'C',text:q.C??q.c},{key:'D',text:q.D??q.d}].filter(o=>o.text!=null && String(o.text).trim()!=='')
      const correctKey=String(q.correct||q.correct_option||q.answer||'').toUpperCase();
      const correctText = {A:q.A,B:q.B,C:q.C,D:q.D}[correctKey];
      const shuffled = settings?.shuffleOptions ? [...options].sort(()=>Math.random()-0.5) : options;
      const newCorrectKey=(shuffled.find(o=>o.text===correctText)||{}).key || correctKey;
      return {...q, __options:shuffled, __correctKey:newCorrectKey};
    });
  },[questions,settings?.shuffleQuestions,settings?.shuffleOptions]);

  const current=qlist[index]; const total=qlist.length; const progress = total? Math.round((index/total)*100):0;
  useEffect(()=>()=>{ if(autoTimerRef.current){ clearTimeout(autoTimerRef.current); autoTimerRef.current=null; }},[index]);
  useEffect(()=>{ if(!settings?.timeLimitMin) return; if(timeLeft<=0){ submit(); return; } const t=setTimeout(()=>setTimeLeft(timeLeft-1),1000); return ()=>clearTimeout(t); },[timeLeft, settings?.timeLimitMin]);
  useEffect(()=>{ if(!showConfirm) return; setAdLeft(AD_SECONDS); const tick=setInterval(()=>{ setAdLeft(s=>{ if(s<=1){ clearInterval(tick); return 0; } return s-1; }); },1000); return ()=>clearInterval(tick); },[showConfirm]);

  function choose(optKey){ setAnswers(a=>({...a,[current.id]:optKey})); if(settings?.instantNext){ if(autoTimerRef.current){ clearTimeout(autoTimerRef.current); autoTimerRef.current=null; } const delayMs=Math.max(1,Number(settings.instantDelaySec||4))*1000; autoTimerRef.current=setTimeout(()=>{ autoTimerRef.current=null; if(index<total-1){ setIndex(index+1);} else { setShowConfirm(true);} },delayMs);} }
  function computeScore(){ let correct=0; for(const q of qlist){ if((answers[q.id]||'').toUpperCase()===(q.__correctKey||'').toUpperCase()) correct++; } return {correct,total}; }
  function submit(){ const {correct,total}=computeScore(); onFinish({ lesson, correct, total, answers, at:new Date().toISOString(), timeLimitMin: settings?.timeLimitMin }); }
  if(!current) return <div className="p-6 text-center">Няма въпроси за този урок.</div>;

  const opts=current.__options; const hms=(s)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const chosen=answers[current.id]; const showExplain=settings?.showExplanation && chosen; const isCorrect=chosen && chosen.toUpperCase()===current.__correctKey; const adProgress=((AD_SECONDS-adLeft)/AD_SECONDS)*100;

  return (<div className="max-w-3xl mx-auto p-4">
    <div className="mb-4"><div className="flex items-center justify-between mb-2">
      <div className="text-sm text-slate-600">Урок: <span className="font-medium text-slate-800">{lesson.title || lesson.name}</span></div>
      <div className="flex items-center gap-4 text-sm text-slate-600"><div>Въпрос {index+1} от {total}</div>{settings?.timeLimitMin ? (<div className={`font-semibold ${timeLeft<=10?'text-red-600':''}`}>{hms(timeLeft)}</div>) : null}</div></div><Progress value={progress} /></div>
    <Card className="mb-4"><CardContent className="p-6">
      <div className="text-lg font-medium mb-4">{current.text || current.question || current.title}</div>
      {current.image ? <img src={current.image} alt="Илюстрация" className="mb-4 rounded-lg border" /> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opts.map((o)=>(<Button key={o.key} variant={chosen===o.key?(isCorrect?'default':'destructive'):'outline'} className="h-auto py-3 justify-start" onClick={()=>choose(o.key)}>
          <span className="font-semibold w-6">{o.key}.</span><span className="ml-2 text-left">{o.text}</span></Button>))}
      </div>
      {showExplain ? (<div className={`mt-4 text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>{isCorrect ? "Вярно! " : "Грешно. "}<span className="text-slate-700">Обяснение: {current.explanation || "—"}</span></div>) : null}
    </CardContent></Card>
    <div className="flex items-center justify-between">{index<total-1 ? (<Button onClick={()=>setIndex(index+1)}>Следващ въпрос</Button>) : (<Button onClick={()=>setShowConfirm(true)}>Приключи</Button>)}
      <div className="text-sm text-slate-500">Избран отговор: <span className="font-medium">{answers[current.id] || "—"}</span></div></div>
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}><DialogContent><DialogHeader><DialogTitle>Готов ли си да предадеш теста?</DialogTitle><DialogDescription>Провери обобщението по-долу и натисни „Предай“.</DialogDescription></DialogHeader>
      <div className="mb-3 p-3 rounded-lg border bg-slate-50 text-sm">Място за реклама или банер</div>
      <div className="mb-2 text-xs text-slate-500">Рекламна пауза: остава {adLeft} сек.</div>
      <Progress value={adProgress} />
      <div className="mt-4 mb-4 text-sm text-slate-700">Отговорени: <b>{Object.keys(answers).length}</b> · Пропуснати: <b>{total - Object.keys(answers).length}</b> · Общо: <b>{total}</b></div>
      <DialogFooter><Button onClick={submit}>Предай</Button></DialogFooter></DialogContent></Dialog>
  </div>);
}

function HomeScreen({ onGo }){
  const tiles=[{key:"theory",label:"Теория",icon:BookOpen},{key:"tests",label:"Тестове",icon:ListChecks},{key:"results",label:"Резултати",icon:CheckCircle},{key:"stats",label:"Статистика",icon:BarChart3}];
  return (<div className="mx-auto max-w-4xl p-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{tiles.map((t)=>(<SquareButton key={t.key} icon={t.icon} label={t.label} onClick={()=>onGo(t.key)} />))}</div></div>);
}

function TheoryScreen(){ return (<div className="max-w-3xl mx-auto p-6 text-slate-700"><h2 className="text-xl font-semibold mb-3">Теория</h2><p>Тук може да показваме резюмета по уроци или да вградим външни материали. В момента е placeholder.</p></div>); }

function ResultsScreen({ results, classes, lessons, canRestart, onRestart }){
  const byLessonId = useMemo(()=>{ const map=new Map(lessons.map((l)=>[normalizeId(l.id),l])); return (id)=> map.get(normalizeId(id)); },[lessons]);
  if (!results?.length) return <div className="p-6 text-slate-600">Все още няма предадени тестове.</div>;
  return (<div className="max-w-3xl mx-auto p-6"><h2 className="text-xl font-semibold mb-4">Резултати</h2>
    <div className="space-y-3">{results.map((r,i)=>{ const l=byLessonId(r.lesson?.id); const title=l?.title||l?.name||r.lesson?.title||"Урок"; const pct=r.total?Math.round((r.correct/r.total)*100):0;
      return (<Card key={i}><CardContent className="p-4 flex items-center justify-between"><div><div className="font-medium">{title}</div><div className="text-xs text-slate-500">{new Date(r.at).toLocaleString()}</div></div>
        <div className="text-right"><div className="text-lg font-semibold">{r.correct} / {r.total}</div><div className="text-xs text-slate-500">{pct}%</div></div></CardContent></Card>); })}</div>
    <div className="mt-6"><Button onClick={onRestart} disabled={!canRestart}>Започни отначало</Button></div></div>);
}

function StatsScreen({ results }){
  const totals = useMemo(()=>{ const attempts=results?.length||0; const solved=results?.reduce((s,r)=>s+(r.correct||0),0)||0; const totalQs=results?.reduce((s,r)=>s+(r.total||0),0)||0; const accuracy=totalQs?Math.round((solved/totalQs)*100):0; return { attempts, solved, totalQs, accuracy }; },[results]);
  return (<div className="max-w-3xl mx-auto p-6"><h2 className="text-xl font-semibold mb-4">Статистика</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><StatCard label="Опити" value={totals.attempts} /><StatCard label="Вярни" value={totals.solved} /><StatCard label="Въпроси" value={totals.totalQs} /><StatCard label="Точност" value={`${totals.accuracy}%`} /></div></div>);
}
function StatCard({ label, value }){ return (<Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{value}</div><div className="text-xs text-slate-500">{label}</div></CardContent></Card>); }

function TestsScreen({ profile, lessons, classes, questions, onStartQuiz }){
  const lessonsByClass = useMemo(()=> groupBy(lessons, (l)=> normalizeId(l.class_id || l.classId || l.class || l.grade)), [lessons]);
  const classList = useMemo(()=> classes.map((c)=> ({ id: normalizeId(c.id) || c.name, name: c.name || c.title || c.id })), [classes]);
  const currentClassId = profile?.classId; const currentLessons = lessonsByClass[currentClassId] || [];
  function listQuestionsForLesson(lessonId){ const lid = normalizeId(lessonId); return questions.filter((q)=> normalizeId(q.lesson_id || q.lessonId || q.lesson) === lid); }
  return (<div className="max-w-4xl mx-auto p-4"><Tabs defaultValue="by-lesson" className="w-full">
    <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="by-lesson">По тема / уроци</TabsTrigger><TabsTrigger value="by-class">По класове</TabsTrigger></TabsList>
    <TabsContent value="by-lesson" className="pt-4"><h3 className="text-lg font-semibold mb-3">{`Уроци за ${classList.find((c)=>c.id===currentClassId)?.name || "избрания клас"}`}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{currentLessons.map((l)=>{ const qs=listQuestionsForLesson(l.id);
        return (<Card key={normalizeId(l.id)} className="hover:shadow-md transition"><CardContent className="p-4 flex items-center justify-between"><div><div className="font-medium">{l.title || l.name}</div><div className="text-xs text-slate-500">Въпроси: {qs.length}</div></div>
          <Button size="sm" onClick={()=>onStartQuiz(l, qs)} disabled={!qs.length}><Play className="h-4 w-4 mr-2" />Старт</Button></CardContent></Card>); })}</div>
    </TabsContent>
    <TabsContent value="by-class" className="pt-4"><div className="space-y-4">{classList.map((cls)=>(<div key={cls.id}><div className="text-sm font-semibold mb-2">{cls.name}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{(lessonsByClass[cls.id] || []).map((l)=>{ const qs=listQuestionsForLesson(l.id);
        return (<Card key={normalizeId(l.id)}><CardContent className="p-4 flex items-center justify-between"><div><div className="font-medium">{l.title || l.name}</div><div className="text-xs text-slate-500">Въпроси: {qs.length}</div></div>
          <Button size="sm" onClick={()=>onStartQuiz(l, qs)} disabled={!qs.length}><Play className="h-4 w-4 mr-2" />Старт</Button></CardContent></Card>); })}</div>
    </div>))}</div></TabsContent></Tabs></div>);
}

function SettingsDialog({ open, onOpenChange, settings, setSettings }){
  const delayOptions=[2,3,4,5,6,8,10];
  return (<Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Настройки</DialogTitle><DialogDescription>Персонализирай тестовете според предпочитанията си.</DialogDescription></DialogHeader>
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between"><span className="text-sm">Показвай обяснение след отговор</span><input type="checkbox" checked={!!settings.showExplanation} onChange={(e)=>setSettings({...settings, showExplanation: e.target.checked})} /></div>
      <div className="flex items-center justify-between"><span className="text-sm">Разбърквай въпросите</span><input type="checkbox" checked={!!settings.shuffleQuestions} onChange={(e)=>setSettings({...settings, shuffleQuestions: e.target.checked})} /></div>
      <div className="flex items-center justify-between"><span className="text-sm">Разбърквай отговорите</span><input type="checkbox" checked={!!settings.shuffleOptions} onChange={(e)=>setSettings({...settings, shuffleOptions: e.target.checked})} /></div>
      <div className="flex items-center justify-between gap-2"><span className="text-sm">Лимит от време (минути, 0 = без)</span><Input type="number" min={0} value={settings.timeLimitMin} onChange={(e)=>setSettings({...settings, timeLimitMin: Math.max(0, parseInt(e.target.value||"0"))})} className="w-24" /></div>
      <div className="flex items-center justify-between"><span className="text-sm">Автоматично към следващия въпрос</span><input type="checkbox" checked={!!settings.instantNext} onChange={(e)=>setSettings({...settings, instantNext: e.target.checked})} /></div>
      <div className="flex items-center justify-between gap-2"><span className="text-sm">Време до преминаване (сек.)</span>
        <Select disabled={!settings.instantNext} value={String(settings.instantDelaySec || 4)} onValueChange={(v)=>setSettings({...settings, instantDelaySec: parseInt(v,10)})}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Избери" /></SelectTrigger>
          <SelectContent>{delayOptions.map((s)=>(<SelectItem key={s} value={String(s)}>{s} сек.</SelectItem>))}</SelectContent>
        </Select>
      </div>
    </div>
    <DialogFooter><Button onClick={()=>onOpenChange(false)}>Готово</Button></DialogFooter></DialogContent></Dialog>);
}

function LoaderDiag({ diag, onRetry }){
  const order=['classes','subjects','lessons','questions']; const labels={classes:'Classes', subjects:'Subjects', lessons:'Lessons', questions:'Questions'};
  return (<div className="min-h-screen grid place-items-center p-6"><div className="max-w-lg w-full">
    <div className="text-2xl font-semibold mb-2">Зареждаме данните…</div><div className="text-sm text-slate-500 mb-4">Google Sheets CSV — статус на заявките</div>
    <div className="space-y-2">{order.map(k=>{ const d=diag[k]||{status:'loading',ms:0,message:''};
      return (<div key={k} className="flex items-center justify-between rounded-lg border p-2 bg-white"><div className="text-sm">{labels[k]}</div><div className="text-sm">
        {d.status==='ok' && <span className="text-green-600">OK</span>}{d.status==='loading' && <span className="text-slate-500">Loading…</span>}{d.status==='error' && <span className="text-red-600">Error</span>}{d.ms ? <span className="ml-2 text-slate-500">{d.ms} ms</span> : null}
      </div></div>); })}</div>
    <div className="mt-4 flex items-center gap-3"><Button onClick={onRetry}>Опитай отново</Button></div></div></div>);
}

export default function MathApp(){
  const { classes, subjects, lessons, questions, loading, error, diag, reload } = useSheetsData();
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [results, setResults] = useLocalStorage(STORAGE_KEYS.results, []);
  const [route, setRoute] = useState("home");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lastQuiz, setLastQuiz] = useState(null);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, { showExplanation:true, shuffleQuestions:true, shuffleOptions:true, timeLimitMin:8, instantNext:false, instantDelaySec:4 });

  useEffect(()=>{ if(!profile && !loading) setRoute("onboarding"); },[profile,loading]);

  function handleFinishQuiz(summary){ setResults([summary, ...results]); setLastQuiz({ lesson: summary.lesson, questions: activeQuiz?.questions || [] }); setActiveQuiz(null); setRoute("results"); }
  function resetProfile(){ setProfile(null); setRoute("onboarding"); }

  if (loading) return <LoaderDiag diag={diag} onRetry={reload} />;
  if (error) return (<div className="min-h-screen grid place-items-center p-6"><div className="max-w-md text-center"><div className="text-xl font-semibold mb-2">Възникна грешка</div><div className="text-slate-600 mb-4">{String(error)}</div><Button onClick={reload}>Опитай отново</Button></div></div>);

  if (route==="onboarding" || !profile) return <Onboarding classes={classes} onDone={(p)=>{ setProfile(p); setRoute("home"); }} />;
  if (activeQuiz) return (<div className="min-h-screen bg-slate-50"><HeaderBar title="Тест" profile={profile} onHome={()=>setActiveQuiz(null)} onLogout={resetProfile} onOpenSettings={()=>setSettingsOpen(true)} /><Quiz lesson={activeQuiz.lesson} questions={activeQuiz.questions} onFinish={handleFinishQuiz} settings={settings} /><SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} settings={settings} setSettings={setSettings} /></div>);

  return (<div className="min-h-screen"><HeaderBar title={routeTitle(route)} profile={profile} onHome={()=>setRoute("home")} onLogout={resetProfile} onOpenSettings={()=>setSettingsOpen(true)} />
    {route==="home" && <HomeScreen onGo={setRoute} />}{route==="theory" && <TheoryScreen />}{route==="tests" && (<TestsScreen profile={profile} lessons={lessons} classes={classes} questions={questions} onStartQuiz={(lesson,qs)=> setActiveQuiz({ lesson, questions: qs })} />)}{route==="results" && (<ResultsScreen results={results} classes={classes} lessons={lessons} canRestart={!!lastQuiz} onRestart={()=> lastQuiz && setActiveQuiz({ lesson: lastQuiz.lesson, questions: lastQuiz.questions })} />)}{route==="stats" && <StatsScreen results={results} />}<SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} settings={settings} setSettings={setSettings} /></div>);
}

function routeTitle(route){ switch(route){ case "home": return "Начало"; case "theory": return "Теория"; case "tests": return "Тестове"; case "results": return "Резултати"; case "stats": return "Статистика"; default: return "Math App"; } }
