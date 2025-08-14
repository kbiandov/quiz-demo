import React, { useEffect, useMemo, useState } from "react";

/**
 * QUIZ DEMO — BG UI + Settings (gear) — stable
 */

const STORAGE_KEY = "quiz.csvUrls";

const DEFAULT_CSV_URLS = {
  classes:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=1450893758&single=true&output=csv",
  subjects:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=1804178952&single=true&output=csv",
  lessons:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=636509497&single=true&output=csv",
  questions:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=1301560227&single=true&output=csv",
};

const MOCK_SHEETS = {
  classes: [{ id: 6, name: "6 клас" }],
  subjects: [{ id: 1, class_id: 6, name: "Математика" }],
  lessons: [{ id: 101, subject_id: 1, name: "Линейни уравнения" }],
  questions: [
    {
      lesson_id: 101,
      difficulty: "easy",
      q: "Колко е 2x = 10?",
      options: ["x = 2", "x = 3", "x = 5", "x = 10"],
      answer: 2,
      explain: "2x=10 ⇒ x=5.",
    },
  ],
};

const Chip = ({ children }) => (
  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 border border-gray-200">{children}</span>
);

const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-2xl h-3 overflow-hidden shadow-inner">
    <div className="h-full rounded-2xl transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

const BannerAd = () => (
  <div className="w-full border rounded-xl p-3 text-center text-xs text-gray-500 bg-gray-50">Реклама (банер)</div>
);

function InterstitialAd({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <div className="text-sm text-gray-500">Реклама (междинна)</div>
        <div className="h-40 border rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">Ad slot</div>
        <button onClick={onClose} className="w-full rounded-xl px-4 py-2 bg-black text-white">Затвори</button>
      </div>
    </div>
  );
}

async function fetchCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return parseCsv(text);
}

function parseCsv(text) {
  const rows = [];
  let cur = "";
  let inQuotes = false;
  let row = [];
  const pushCell = () => { row.push(cur); cur = ""; };
  const pushRow = () => { rows.push(row); row = []; };
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else { cur += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { pushCell(); }
      else if (ch === '\n') { pushCell(); pushRow(); }
      else { cur += ch; }
    }
  }
  if (cur.length > 0 || row.length > 0) { pushCell(); pushRow(); }
  if (!rows.length) return [];
  const header = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r && r.some(c => (c ?? '').trim().length))
    .map(cols => {
      const obj = {};
      header.forEach((h, i) => obj[h] = (cols[i] ?? '').trim());
      return obj;
    });
}

const normClasses = rows => rows.map(c => ({ id: Number(c.id), name: c.name })).filter(x => Number.isFinite(x.id) && x.name);
const normSubjects = rows => rows.map(s => ({ id: Number(s.id), class_id: Number(s.class_id), name: s.name })).filter(x => Number.isFinite(x.id) && Number.isFinite(x.class_id) && x.name);
const normLessons  = rows => rows.map(l => ({ id: Number(l.id), subject_id: Number(l.subject_id), name: l.name })).filter(x => Number.isFinite(x.id) && Number.isFinite(x.subject_id) && x.name);
function normQuestions(rows) {
  return rows.map(q => {
    const opts = [q.option_1, q.option_2, q.option_3, q.option_4].filter(v => v && v.length);
    let ans = Number(q.correct_index);
    if (!Number.isFinite(ans) || ans < 0 || ans >= opts.length) ans = 0;
    return {
      lesson_id: Number(q.lesson_id),
      difficulty: (q.difficulty || 'easy').toLowerCase(),
      q: q.question_text,
      options: opts,
      answer: ans,
      explain: q.explanation || '',
    };
  }).filter(x => Number.isFinite(x.lesson_id) && x.q && x.options.length >= 2);
}

export default function QuizDemo() {
  const [csvUrls, setCsvUrls] = useState(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : DEFAULT_CSV_URLS; }
    catch { return DEFAULT_CSV_URLS; }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [db, setDb] = useState({ classes: [], subjects: [], lessons: [], questions: [] });

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [questionCount, setQuestionCount] = useState(6);
  const [perQuestionSeconds, setPerQuestionSeconds] = useState(20);

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplain, setShowExplain] = useState(false);

  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingAdAction, setPendingAdAction] = useState(null);

  const [showSettings, setShowSettings] = useState(false);
  const [draftUrls, setDraftUrls] = useState(csvUrls);

  useEffect(() => { loadFromGoogleSheets(); }, []);

  async function loadFromGoogleSheets() {
    setLoading(true);
    setError("");
    try {
      const required = [csvUrls.classes, csvUrls.subjects, csvUrls.lessons, csvUrls.questions];
      if (required.some(u => !u)) throw new Error("Липсват CSV линкове. Попълни всички полета.");
      const [classes, subjects, lessons, questions] = await Promise.all([
        fetchCsv(csvUrls.classes),
        fetchCsv(csvUrls.subjects),
        fetchCsv(csvUrls.lessons),
        fetchCsv(csvUrls.questions),
      ]);
      const data = {
        classes: normClasses(classes),
        subjects: normSubjects(subjects),
        lessons: normLessons(lessons),
        questions: normQuestions(questions),
      };
      if (!data.classes.length) throw new Error("Липсва таблица „Класове“");
      if (!data.subjects.length) throw new Error("Липсва таблица „Предмети“");
      if (!data.lessons.length) throw new Error("Липсва таблица „Уроци“");
      if (!data.questions.length) throw new Error("Липсва таблица „Въпроси“");
      setDb(data);
      const cid = data.classes[0]?.id ?? null;
      const sid = data.subjects.find(s => s.class_id === cid)?.id ?? null;
      const lid = data.lessons.find(l => l.subject_id === sid)?.id ?? null;
      setSelectedClassId(cid); setSelectedSubjectId(sid); setSelectedLessonId(lid);
      setStarted(false); setIdx(0); setAnswers([]); setShowExplain(false);
    } catch (e) {
      console.error(e);
      setError("Грешка при зареждане на CSV: " + (e.message || e.toString()));
      setDb(MOCK_SHEETS);
      setSelectedClassId(6); setSelectedSubjectId(1); setSelectedLessonId(101);
    } finally { setLoading(false); }
  }

  const subjectsForClass  = useMemo(() => db.subjects.filter(s => s.class_id === selectedClassId), [db.subjects, selectedClassId]);
  const lessonsForSubject = useMemo(() => db.lessons.filter(l => l.subject_id === selectedSubjectId), [db.lessons, selectedSubjectId]);

  const filteredQuestions = useMemo(() => {
    let list = db.questions.filter(q => q.lesson_id === selectedLessonId);
    if (difficulty !== "all") list = list.filter(q => q.difficulty === difficulty);
    return [...list].sort(() => Math.random() - 0.5).slice(0, questionCount);
  }, [db.questions, selectedLessonId, difficulty, questionCount]);

  const total = filteredQuestions.length;
  const current = filteredQuestions[idx];
  const progress = (idx / Math.max(1, total)) * 100;
  const score = answers.filter(a => a.isCorrect).length;
  const timeLeft = useCountdown(perQuestionSeconds, started && !showExplain && idx < total, () => handleAnswer(-1));

  function handleStart() { setStarted(true); }
  function handleAnswer(selectedIndex) {
    if (!current) return;
    const isCorrect = selectedIndex === current.answer;
    setAnswers(prev => [...prev, { selected: selectedIndex, correctIndex: current.answer, isCorrect, q: current.q, options: current.options, explain: current.explain }]);
    setShowExplain(true);
  }
  function nextQuestion() { setShowExplain(false); if (idx + 1 < total) setIdx(v => v + 1); else { setPendingAdAction("end"); setShowInterstitial(true); } }
  function restart() { setIdx(0); setAnswers([]); setShowExplain(false); setStarted(false); }
  function abortTest() {
    const ok = window.confirm("Сигурни ли сте, че искате да прекратите теста и да се върнете в началото?");
    if (!ok) return;
    setPendingAdAction("abort");
    setShowInterstitial(true);
  }
  function handleInterstitialClose() {
    setShowInterstitial(false);
    if (pendingAdAction === "abort") restart();
    setPendingAdAction(null);
  }

  // Settings actions
  function openSettings() { setDraftUrls(csvUrls); setShowSettings(true); }
  function restoreDefaults() { setDraftUrls(DEFAULT_CSV_URLS); }
  function saveSettings() { setCsvUrls(draftUrls); localStorage.setItem(STORAGE_KEY, JSON.stringify(draftUrls)); }
  function saveAndReload() { saveSettings(); loadFromGoogleSheets(); setShowSettings(false); }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="bg-white rounded-2xl shadow p-6">Зареждане…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <InterstitialAd show={showInterstitial} onClose={handleInterstitialClose} />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 lg:p-8 space-y-6 relative">
        <button title="Настройки" onClick={openSettings} className="absolute right-4 top-4 rounded-full border p-2 hover:bg-gray-50">
          <span aria-hidden>⚙️</span>
        </button>

        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Викторина — Google Sheets</h1>
            <p className="text-gray-600 mt-1">Отвори ⚙️ „Настройки“, за да управляваш CSV линковете и да заредиш съдържание.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Chip>Въпроси: {questionCount}</Chip>
            <Chip>Време/въпрос: {perQuestionSeconds}s</Chip>
          </div>
        </header>

        <BannerAd />

        {!started && db.questions.length > 0 && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Клас</label>
                <select className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full" value={selectedClassId ?? ""} onChange={(e) => {
                  const v = Number(e.target.value) || null;
                  setSelectedClassId(v);
                  const s = db.subjects.find(x => x.class_id === v)?.id ?? null;
                  setSelectedSubjectId(s);
                  const les = db.lessons.find(x => x.subject_id === s)?.id ?? null;
                  setSelectedLessonId(les);
                }}>
                  {db.classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Предмет</label>
                <select className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full" value={selectedSubjectId ?? ""} onChange={(e) => {
                  const v = Number(e.target.value) || null;
                  setSelectedSubjectId(v);
                  const les = db.lessons.find(x => x.subject_id === v)?.id ?? null;
                  setSelectedLessonId(les);
                }}>
                  {subjectsForClass.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Урок</label>
                <select className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full" value={selectedLessonId ?? ""} onChange={(e) => setSelectedLessonId(Number(e.target.value) || null)}>
                  {lessonsForSubject.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Трудност</label>
                <select className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="all">Всички</option>
                  <option value="easy">Лесни</option>
                  <option value="medium">Средни</option>
                  <option value="hard">Трудни</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Брой въпроси</label>
                <input type="number" min={3} value={questionCount} onChange={(e) => setQuestionCount(Math.max(3, Number(e.target.value) || 6))} className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Време за въпрос (секунди)</label>
                <input type="number" min={5} max={90} value={perQuestionSeconds} onChange={(e) => setPerQuestionSeconds(Math.max(5, Math.min(90, Number(e.target.value) || 20)))} className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Класове: <span className="font-semibold">{db.classes.length}</span></div>
              <div>Предмети: <span className="font-semibold">{db.subjects.length}</span></div>
              <div>Уроци: <span className="font-semibold">{db.lessons.length}</span></div>
              <div>Въпроси: <span className="font-semibold">{db.questions.length}</span></div>
            </div>

            <div className="flex gap-3 items-center">
              <button onClick={handleStart} className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 bg-black text-white hover:opacity-90 active:scale-[0.99] shadow" disabled={db.questions.length === 0}>▶ Стартирай теста</button>
              {db.questions.length === 0 && (<span className="text-xs text-red-600">Няма въпроси — отвори ⚙️ Настройки и зареди от Sheets.</span>)}
            </div>
          </section>
        )}

        {started && total > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">Въпрос {idx + 1} от {total}</div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Точки: <span className="font-semibold">{score}</span></div>
                <button onClick={abortTest} className="text-xs px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50">Прекрати теста</button>
              </div>
            </div>

            <ProgressBar value={progress} />

            <div className="flex items-center justify_between bg-gray-50 border rounded-xl p-3">
              <div className="text-sm text-gray-700">Оставащо време</div>
              <div className="text-lg font-semibold">{timeLeft}s</div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-medium">{current?.q}</h2>
              <div className="grid grid-cols-1 gap-3">
                {current?.options.map((opt, i) => {
                  const isSelected = answers[idx]?.selected === i;
                  const isCorrectOpt = showExplain && i === current.answer;
                  const isWrongSelected = showExplain && isSelected && i !== current.answer;
                  return (
                    <button key={i} disabled={showExplain} onClick={() => handleAnswer(i)} className={["text-left border rounded-xl px-4 py-3 transition shadow-sm", !showExplain && "hover:bg-gray-50", isCorrectOpt && "bg-green-50 border-green-300", isWrongSelected && "bg-red-50 border-red-300"].filter(Boolean).join(" ")}>
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {showExplain && (
              <div className="space-y-3">
                <div className="p-3 border rounded-xl bg_white">
                  <div className="text-sm text-gray-700">Обяснение</div>
                  <div className="mt-1">{current?.explain}</div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <button onClick={nextQuestion} className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 bg-black text-white hover:opacity-90">{idx + 1 === total ? "Завърши" : "Следващ въпрос"}</button>
                </div>
              </div>
            )}
          </section>
        )}

        {started && total === 0 && (<div className="text-sm text-red-600">Няма въпроси за избраните филтри. Пробвай с друга тема/трудност.</div>)}

        {started && answers.length === total && total > 0 && (
          <section className="space-y-5">
            <div className="text-center">
              <div className="text-4xl font-bold">{score} / {total}</div>
              <p className="text-gray-600 mt-1">Твоят резултат</p>
            </div>

            <div className="space-y-3">
              {answers.map((a, i) => (
                <div key={i} className="border rounded-xl p-3 bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">Въпрос {i + 1}</div>
                  <div className="font-medium mb-2">{a.q}</div>
                  <div className="text-sm mb-1">Твой отговор: {a.selected >= 0 ? `${String.fromCharCode(65 + a.selected)}. ${a.options[a.selected]}` : "(пропуснат)"}</div>
                  <div className="text-sm">Верен отговор: {String.fromCharCode(65 + a.correctIndex)}. {a.options[a.correctIndex]}</div>
                  {a.explain && <div className="text_sm mt-2 text-gray-700">Обяснение: {a.explain}</div>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={restart} className="rounded-2xl px-5 py-2.5 border hover:bg-gray-50">Начален екран</button>
              <button onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ class: selectedClassId, subject: selectedSubjectId, lesson: selectedLessonId, difficulty, perQuestionSeconds, answers }, null, 2));
                const a = document.createElement("a"); a.setAttribute("href", dataStr); a.setAttribute("download", "quiz-results.json"); a.click();
              }} className="rounded-2xl px-5 py-2.5 border hover:bg-gray-50">Експортирай резултатите</button>
            </div>
          </section>
        )}

        <footer className="pt-2 border-t text-xs text-gray-500 flex items-center justify-between">
          <div>Интеграция със Sheets • Плейсхолдър реклами • Диагностика</div>
          <div>© Викторина</div>
        </footer>
      </div>

      {/* Настройки */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Настройки</div>
              <button onClick={() => setShowSettings(false)} className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50">Затвори</button>
            </div>
            <div className="text-sm text-gray-600">Линковете се пазят локално в браузъра (localStorage).</div>

            <div className="space-y-2">
              <label className="text-sm">Classes CSV URL</label>
              <input className="border rounded-xl px-3 py-2 w-full" value={draftUrls.classes} onChange={(e) => setDraftUrls({ ...draftUrls, classes: e.target.value })} />
              <label className="text-sm">Subjects CSV URL</label>
              <input className="border rounded-xl px-3 py-2 w-full" value={draftUrls.subjects} onChange={(e) => setDraftUrls({ ...draftUrls, subjects: e.target.value })} />
              <label className="text-sm">Lessons CSV URL</label>
              <input className="border rounded-xl px-3 py-2 w-full" value={draftUrls.lessons} onChange={(e) => setDraftUrls({ ...draftUrls, lessons: e.target.value })} />
              <label className="text-sm">Questions CSV URL</label>
              <input className="border rounded-xl px-3 py-2 w-full" value={draftUrls.questions} onChange={(e) => setDraftUrls({ ...draftUrls, questions: e.target.value })} />
            </div>

            {error && (<div className="text-xs text-red-600">Грешка: {error}</div>)}

            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={restoreDefaults} className="rounded-xl px-4 py-2 border hover:bg-gray-50">Възстанови стандартните линкове</button>
              <button onClick={saveSettings} className="rounded-xl px-4 py-2 border hover:bg-gray-50">Запази</button>
              <button onClick={saveAndReload} className="rounded-xl px-4 py-2 bg-black text-white">Запази и зареди</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useCountdown(seconds, isRunning, onFinish) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => { if (!isRunning) return; setLeft(seconds); }, [seconds, isRunning]);
  useEffect(() => {
    if (!isRunning) return;
    if (left <= 0) { onFinish?.(); return; }
    const t = setTimeout(() => setLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left, isRunning, onFinish]);
  return left;
}
