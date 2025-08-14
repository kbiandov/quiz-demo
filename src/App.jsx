import React, { useEffect, useState, useMemo } from "react";
import QuizDemo from "./QuizDemo.jsx";
import "./index.css";

const PROFILE_KEY = "quiz.profile";

function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  function saveProfile(p) {
    setProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }
  return { profile, saveProfile };
}

export default function App() {
  const { profile, saveProfile } = useProfile();
  const [view, setView] = useState(profile ? "home" : "onboarding");

  // Параметри за стартиране на тест (клас/урок/тема)
  const [startParams, setStartParams] = useState(null);

  useEffect(() => {
    if (!profile) setView("onboarding");
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {view === "onboarding" && (
        <Onboarding
          onDone={(p) => {
            saveProfile(p);
            setView("home");
          }}
        />
      )}

      {view === "home" && (
        <Home
          profile={profile}
          onOpen={(section) => setView(section)}
        />
      )}

      {view === "tests" && (
        <Tests
          profile={profile}
          onBack={() => setView("home")}
          onStart={(params) => {
            setStartParams(params);
            setView("quiz");
          }}
        />
      )}

      {view === "quiz" && (
        <QuizShell
          onBack={() => setView("home")}
          startParams={startParams}
        />
      )}

      {view === "theory" && <ComingSoon title="Теория" onBack={() => setView("home")} />}
      {view === "results" && <ComingSoon title="Резултати" onBack={() => setView("home")} />}
      {view === "stats" && <ComingSoon title="Статистика" onBack={() => setView("home")} />}
    </div>
  );
}

/* ---------------- Onboarding ---------------- */
function Onboarding({ onDone }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(6);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Моля, въведи име или прякор.");
    onDone({ name: name.trim(), grade: Number(grade) });
  }

  return (
    <div className="max-w-md mx-auto p-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Добре дошъл! 👋</h1>
      <p className="text-gray-600 mb-6">
        Нека персонализираме приложението за теб.
      </p>
      <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Име / Прякор</label>
          <input
            className="border rounded-xl px-3 py-2 w-full"
            placeholder="например: Иво / Ivo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Кой клас си?</label>
          <select
            className="border rounded-xl px-3 py-2 w-full"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            {Array.from({ length: 9 }, (_, i) => i + 4).map((g) => (
              <option key={g} value={g}>
                {g} клас
              </option>
            ))}
          </select>
        </div>

        <button className="w-full rounded-xl px-4 py-3 bg-black text-white">
          Започни
        </button>
      </form>
    </div>
  );
}

/* ---------------- Home ---------------- */
function Home({ profile, onOpen }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Здрасти, {profile?.name}!</h1>
          <div className="text-gray-600">Математика • {profile?.grade} клас</div>
        </div>
        <span className="text-2xl">🧮</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HomeTile icon="📘" label="Теория" onClick={() => onOpen("theory")} />
        <HomeTile icon="📝" label="Тестове" onClick={() => onOpen("tests")} />
        <HomeTile icon="📊" label="Резултати" onClick={() => onOpen("results")} />
        <HomeTile icon="📈" label="Статистика" onClick={() => onOpen("stats")} />
      </div>
    </div>
  );
}
function HomeTile({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-2xl border bg-white shadow-sm hover:shadow-md active:scale-[0.99] flex flex-col items-center justify-center gap-2"
    >
      <div className="text-4xl">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </button>
  );
}

/* ---------------- Tests (tabs) ---------------- */
function Tests({ profile, onBack, onStart }) {
  const [tab, setTab] = useState("topic"); // 'topic' | 'grade'

  // ТЕМП: Темите са демонстрационни. По-късно ще идват от Sheets/CSV.
  const topics = [
    { id: 101, name: "Линейни уравнения" },
    { id: 102, name: "Пропорции и проценти" },
    { id: 103, name: "Геометрични фигури" },
  ];

  const grades = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 4), []);
  const currentGrade = profile?.grade ?? 6;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="rounded-xl border px-3 py-2 hover:bg-gray-50">← Назад</button>
        <h1 className="text-xl font-semibold">Тестове</h1>
        <div />
      </div>

      <div className="flex gap-2">
        <TabButton active={tab === "topic"} onClick={() => setTab("topic")}>По тема</TabButton>
        <TabButton active={tab === "grade"} onClick={() => setTab("grade")}>По класове</TabButton>
      </div>

      {tab === "topic" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map(t => (
            <button
              key={t.id}
              className="rounded-xl border bg-white p-4 text-left hover:bg-gray-50"
              onClick={() => onStart({ mode: "topic", topicId: t.id, grade: currentGrade })}
            >
              <div className="text-sm text-gray-500">Тема</div>
              <div className="text-base font-medium">{t.name}</div>
            </button>
          ))}
        </div>
      )}

      {tab === "grade" && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {grades.map(g => (
            <button
              key={g}
              className={`rounded-xl border bg-white p-4 hover:bg-gray-50 ${g === currentGrade ? "ring-2 ring-black" : ""}`}
              onClick={() => onStart({ mode: "grade", grade: g })}
            >
              <div className="text-center font-medium">{g} клас</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 border ${active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"}`}
    >
      {children}
    </button>
  );
}

/* ---------------- Quiz shell ---------------- */
/* Тук само „обвиваме“ съществуващия QuizDemo. По-късно ще му подадем filters. */
function QuizShell({ onBack, startParams }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="rounded-xl border px-3 py-2 hover:bg-gray-50">← Начален екран</button>
        <div className="text-sm text-gray-500">Режим: {startParams?.mode === "topic" ? "По тема" : "По клас"}</div>
      </div>
      <QuizDemo />
    </div>
  );
}

/* ---------------- Coming soon placeholder ---------------- */
function ComingSoon({ title, onBack }) {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="mb-4">
        <button onClick={onBack} className="rounded-xl border px-3 py-2 hover:bg-gray-50">← Назад</button>
      </div>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-600">Тази секция ще бъде добавена скоро.</p>
    </div>
  );
}
