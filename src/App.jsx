import React, { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";

const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
};

const STORAGE_KEYS = {
  profile: "mathapp_profile_v1",
  results: "mathapp_results_v1",
  settings: "mathapp_settings_v1",
};

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initialValue; } catch { return initialValue; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

async function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (res.errors && res.errors.length > 0) {
          reject(res.errors[0]);
        } else {
          resolve(res.data);
        }
      },
      error: (err) => reject(err)
    });
  });
}

function useSheetsData() {
  const [data, setData] = useState({ classes: [], subjects: [], lessons: [], questions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const [classes, subjects, lessons, questions] = await Promise.all([
          fetchCSV(SHEETS.classes), fetchCSV(SHEETS.subjects), fetchCSV(SHEETS.lessons), fetchCSV(SHEETS.questions)
        ]);
        if (!cancelled) setData({ classes, subjects, lessons, questions });
      } catch (e) { if (!cancelled) setError(e?.message || "Грешка при зареждане"); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);
  return { ...data, loading, error };
}

const normalizeId = (v) => (v == null ? null : String(v).trim());
function groupBy(arr, keyFn) { return arr.reduce((acc, x) => { const k = keyFn(x); (acc[k] = acc[k] || []).push(x); return acc; }, {}); }

function SquareButton({ label, onClick, icon = "🔹" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="square group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function HeaderBar({ title, onHome, onLogout, onOpenSettings }) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" className="btn" onClick={onHome}>🏠</button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button type="button" className="btn" onClick={onLogout}>Смени профил</button>
          <button type="button" className="btn" onClick={onOpenSettings} title="Настройки">⚙️</button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ profile, onGo }) {
  const tiles = [
    { key: "theory", label: "Теория", icon: "📘" },
    { key: "tests", label: "Тестове", icon: "📝" },
    { key: "results", label: "Резултати", icon: "✅" },
    { key: "stats", label: "Статистика", icon: "📊" }
  ];

  return (
    <>
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-4">
          Здравей, <span className="font-medium">👤 {profile?.name || "Гост"} · Клас: {profile?.classId || "—"}</span>
        </div>
      </div>
      <div className="mx-auto max-w-4xl p-6">
        <div className="grid-tiles">
          {tiles.map(tile => (
            <SquareButton
              key={tile.key}
              icon={tile.icon}
              label={tile.label}
              onClick={() => onGo(tile.key)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Останалите компоненти (TheoryScreen, TestsScreen, ResultsScreen, StatsScreen, Quiz, SettingsModal, Onboarding)
// остават същите като в предишния пълен код

export default function MathApp() {
  const { classes, subjects, lessons, questions, loading, error } = useSheetsData();
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [results, setResults] = useLocalStorage(STORAGE_KEYS.results, []);
  const [route, setRoute] = useState("home");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lastQuiz, setLastQuiz] = useState(null);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, {
    showExplanation: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    timeLimitMin: 8,
    instantNext: false,
    instantDelaySec: 4
  });

  useEffect(() => {
    if (!profile && !loading) setRoute("onboarding");
  }, [profile, loading]);

  function handleFinishQuiz(summary) {
    setResults([summary, ...results]);
    setLastQuiz({ lesson: summary.lesson, questions: activeQuiz?.questions || [] });
    setActiveQuiz(null);
    setRoute("results");
  }

  function resetProfile() {
    setProfile(null);
    setRoute("onboarding");
  }

  if (loading) return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="animate-pulse text-2xl font-semibold">Зареждаме данните…</div>
        <div className="text-sm text-slate-500 mt-2">Google Sheets CSV</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md text-center">
        <div className="text-xl font-semibold mb-2">Възникна грешка</div>
        <div className="text-slate-600 mb-4">{String(error)}</div>
        <button type="button" className="btn" onClick={() => location.reload()}>
          Презареди
        </button>
      </div>
    </div>
  );

  if (route === "onboarding" || !profile) {
    return <Onboarding classes={classes} onDone={(p) => { setProfile(p); setRoute("home"); }} />;
  }

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Quiz
          lesson={activeQuiz.lesson}
          questions={activeQuiz.questions}
          onFinish={handleFinishQuiz}
          settings={settings}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <HeaderBar
        title={route === "home" ? "Начало" : 
              route === "theory" ? "Теория" : 
              route === "tests" ? "Тестове" : 
              route === "results" ? "Резултати" : 
              route === "stats" ? "Статистика" : ""}
        onHome={() => setRoute("home")}
        onLogout={resetProfile}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {route === "home" && <HomeScreen profile={profile} onGo={setRoute} />}
      {route === "theory" && <TheoryScreen />}
      {route === "tests" && (
        <TestsScreen
          profile={profile}
          lessons={lessons}
          classes={classes}
          questions={questions}
          onStartQuiz={(lesson, qs) => setActiveQuiz({ lesson, questions: qs })}
        />
      )}
      {route === "results" && (
        <ResultsScreen
          results={results}
          lessons={lessons}
          canRestart={!!lastQuiz}
          onRestart={() => lastQuiz && setActiveQuiz({ lesson: lastQuiz.lesson, questions: lastQuiz.questions })}
        />
      )}
      {route === "stats" && <StatsScreen results={results} />}

      {settingsOpen && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={setSettings}
        />
      )}
    </div>
  );
}