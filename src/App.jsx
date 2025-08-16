import React, { useEffect, useState } from "react";
import HeaderBar from "./components/HeaderBar";
import Onboarding from "./components/Onboarding";
import Quiz from "./components/Quiz";
import HomeScreen from "./components/HomeScreen";
import TheoryScreen from "./components/TheoryScreen";
import ResultsScreen from "./components/ResultsScreen";
import StatsScreen from "./components/StatsScreen";
import TestsScreen from "./components/TestsScreen";
import SettingsModal from "./components/SettingsModal";
import { routeTitle } from "./utils";
import useLocalStorage from "./hooks/useLocalStorage";
import { STORAGE_KEYS } from "./constants";
import { useSheetsData } from "./api/useSheetsData";

export default function MathApp(){
  const { classes, subjects, lessons, questions, theory, loading, error } = useSheetsData();
  const [profile,setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [results,setResults] = useLocalStorage(STORAGE_KEYS.results, []);
  const [route,setRoute] = useState("home");
  const [activeQuiz,setActiveQuiz] = useState(null);
  const [settingsOpen,setSettingsOpen] = useState(false);
  const [lastQuiz,setLastQuiz] = useState(null);
  const [settings,setSettings] = useLocalStorage(STORAGE_KEYS.settings, { showExplanation:true, shuffleQuestions:true, shuffleOptions:true, timeLimitMin:8, instantNext:false, instantDelaySec:4 });

  useEffect(()=>{ if(!profile && !loading) setRoute("onboarding"); },[profile,loading]);

  function handleFinishQuiz(summary){ setResults([summary,...results]); setLastQuiz({ lesson: summary.lesson, questions: activeQuiz?.questions || [] }); setActiveQuiz(null); setRoute("results"); }
  function resetProfile(){ setProfile(null); setRoute("onboarding"); }

  if (loading) return (<div className="min-h-screen grid place-items-center"><div className="text-center"><div className="animate-pulse text-2xl font-semibold">Зареждаме данните…</div><div className="text-sm text-slate-500 mt-2">Google Sheets CSV</div></div></div>);
  if (error) return (<div className="min-h-screen grid place-items-center p-6"><div className="max-w-md text-center"><div className="text-xl font-semibold mb-2">Възникна грешка</div><div className="text-slate-600 mb-4">{String(error)}</div><button type="button" className="btn" onClick={()=>location.reload()}>Презареди</button></div></div>);

  if (route==="onboarding" || !profile) return <Onboarding classes={classes} onDone={(p)=>{ setProfile(p); setRoute("home"); }} />;
  if (activeQuiz) return (<div className="min-h-screen bg-slate-50">
    <HeaderBar title="Тест" profile={profile} onHome={()=>setActiveQuiz(null)} onLogout={resetProfile} onOpenSettings={()=>setSettingsOpen(true)} />
    <Quiz lesson={activeQuiz.lesson} questions={activeQuiz.questions} onFinish={handleFinishQuiz} settings={settings} />
  </div>);

  return (<div className="min-h-screen">
    <HeaderBar title={routeTitle(route)} profile={profile} onHome={()=>setRoute("home")} onLogout={resetProfile} onOpenSettings={()=>setSettingsOpen(true)} />
    {route==="home" && <HomeScreen onGo={setRoute} profile={profile} />}
    {route==="theory" && <TheoryScreen profile={profile} theory={theory} classes={classes} lessons={lessons} questions={questions} onStartQuiz={(lesson, questions) => setActiveQuiz({ lesson, questions })} />}
    {route==="tests" && (<TestsScreen profile={profile} lessons={lessons} classes={classes} questions={questions} onStartQuiz={(lesson,qs)=> setActiveQuiz({ lesson, questions: qs })} />)}
    {route==="results" && (<ResultsScreen results={results} classes={classes} lessons={lessons} questions={questions} canRestart={!!lastQuiz} onRestart={()=> lastQuiz && setActiveQuiz({ lesson: lastQuiz.lesson, questions: lastQuiz.questions })} />)}
    {route==="stats" && <StatsScreen results={results} />}
    {settingsOpen && (
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    )}
  </div>);
}
