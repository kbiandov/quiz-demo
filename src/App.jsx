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

  function handleFinishQuiz(summary){ 
    console.log('Quiz finished, summary received:', summary);
    console.log('Summary keys:', Object.keys(summary));
    console.log('Summary qlist:', summary.qlist);
    console.log('Summary questions:', summary.questions);
    
    // Store the complete result including questions for retaking
    const resultWithQuestions = {
      ...summary,
      questions: summary.qlist || summary.questions || [] // Use qlist if available, fallback to questions
    };
    
    console.log('Result with questions to be saved:', resultWithQuestions);
    console.log('Questions field in result:', resultWithQuestions.questions);
    
    setResults([resultWithQuestions, ...results]); 
    
    // Store last quiz with questions for retaking
    setLastQuiz({ 
      lesson: summary.lesson, 
      questions: resultWithQuestions.questions 
    }); 
    
    console.log('Last quiz stored:', { 
      lesson: summary.lesson, 
      questions: resultWithQuestions.questions 
    });
    
    setActiveQuiz(null); 
    setRoute("results"); 
  }
  
  function handleRetakeTest(lesson, questions) {
    // Ensure questions is an array and has content
    if (questions && Array.isArray(questions) && questions.length > 0) {
      setActiveQuiz({ lesson, questions });
      setRoute("quiz");
    } else {
      console.warn('No questions provided for retake, falling back to last quiz');
      // Fallback to last quiz if no questions provided
      if (lastQuiz && lastQuiz.questions && lastQuiz.questions.length > 0) {
        setActiveQuiz({ lesson: lastQuiz.lesson, questions: lastQuiz.questions });
        setRoute("quiz");
      } else {
        console.error('Cannot retake test: no questions available');
        // Redirect to tests screen to select a new test
        setRoute("tests");
      }
    }
  }
  function resetProfile(){ setProfile(null); setRoute("onboarding"); }

  const handleTheoryStartQuiz = (lesson, questions) => setActiveQuiz({ lesson, questions });
  const handleTestsStartQuiz = (lesson, qs) => setActiveQuiz({ lesson, questions: qs });
  const handleResultsRestart = () => lastQuiz && handleRetakeTest(lastQuiz.lesson, lastQuiz.questions);
  const handleQuizHome = () => setActiveQuiz(null);
  const handleRouteHome = () => setRoute("home");
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleOnboardingDone = (p) => { setProfile(p); setRoute("home"); };
  const handleReload = () => location.reload();
  const handleCloseSettings = () => setSettingsOpen(false);
  
  if (route==="onboarding" || !profile) return <Onboarding classes={classes} onDone={handleOnboardingDone} />;
  if (activeQuiz) return (<div className="min-h-screen bg-slate-50">
    <HeaderBar title="Тест" profile={profile} onHome={handleQuizHome} onLogout={resetProfile} onOpenSettings={handleOpenSettings} />
    <Quiz lesson={activeQuiz.lesson} questions={activeQuiz.questions} onFinish={handleFinishQuiz} settings={settings} />
  </div>);
  if (route==="quiz" && activeQuiz) return (<div className="min-h-screen bg-slate-50">
    <HeaderBar title="Тест" profile={profile} onHome={handleRouteHome} onLogout={resetProfile} onOpenSettings={handleOpenSettings} />
    <Quiz lesson={activeQuiz.lesson} questions={activeQuiz.questions} onFinish={handleFinishQuiz} settings={settings} />
  </div>);

  if (loading) return (<div className="min-h-screen grid place-items-center"><div className="text-center"><div className="animate-pulse text-2xl font-semibold">Зареждаме данните…</div><div className="text-sm text-slate-500 mt-2">Google Sheets CSV</div></div></div>);
  if (error) return (<div className="min-h-screen grid place-items-center p-6"><div className="max-w-md text-center"><div className="text-xl font-semibold mb-2">Възникна грешка</div><div className="text-slate-600 mb-4">{String(error)}</div><button type="button" className="btn" onClick={handleReload}>
           Презареди
         </button></div></div>);

  return (<div className="min-h-screen">
    <HeaderBar title={routeTitle(route)} profile={profile} onHome={handleRouteHome} onLogout={resetProfile} onOpenSettings={handleOpenSettings} />
    {route==="home" && <HomeScreen onGo={setRoute} profile={profile} />}
    {route==="theory" && <TheoryScreen profile={profile} theory={theory} classes={classes} lessons={lessons} questions={questions} onStartQuiz={handleTheoryStartQuiz} />}
    {route==="tests" && (<TestsScreen profile={profile} lessons={lessons} classes={classes} questions={questions} onStartQuiz={handleTestsStartQuiz} />)}
    {route==="results" && (<ResultsScreen results={results} classes={classes} lessons={lessons} questions={questions} canRestart={!!lastQuiz} onRestart={handleResultsRestart} />)}
    {route==="stats" && <StatsScreen results={results} />}
    {settingsOpen && (
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSave={setSettings}
      />
    )}
  </div>);
}
