import React, { useEffect, useMemo, useState } from "react"1;

/**
 * QuizDemo – BG UI + Google Sheets + AutoStart + Settings
 * Props:
 *  - initialFilters?: { classId, lessonName, difficulty, questionCount, perQuestionSeconds }
 *  - autoStart?: boolean      -> ако е true, прескача формата и стартира когато има въпроси
 *  - forceOpenSettings?: bool -> ако е true, отваря веднага панела "Настройки"
 *  - onExit?: () => void      -> извиква се при "Начален екран"
 */

const STORAGE_KEY = "quiz.csvUrls";

// ЗАДАЙ тук твоите дефолтни публични CSV линкове (по ред: classes, subjects, lessons, questions)
const DEFAULT_CSV_URLS = {
  classes:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
};

// Фолбек данни (ако CSV не се заредят)
const MOCK = {
  classes: [{ id: 6, name: "6 клас" }],
  subjects: [{ id: 1, class_id: 6, name: "Математика" }],
  lessons: [
    { id: 101, subject_id: 1, name: "Линейни уравнения" },
    { id: 102, subject_id: 1, name: "Пропорции" },
  ],
  questions: [
    { lesson_id: 101, difficulty: "easy", q: "2x = 10. x = ?", options: ["2","3","5","10"], answer: 2, explain: "x=10/2=5." },
    { lesson_id: 101, difficulty: "easy", q: "x + 7 = 12. x = ?", options: ["3","4","5","6"], answer: 2, explain: "12-7=5." },
  ],
};

/* ---------- Лек UI ---------- */
const Chip = ({ children }) => (
  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 border border-gray-200">{children}</span>
);
const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-2xl h-3 overflow-hidden">
    <div className="h-full rounded-2xl" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
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

/* ---------- CSV helpers ---------- */
async function fetchCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseCsv(await res.text());
}
function parseCsv(text) {
  const rows = []; let cur = "", inQ = false, row = [];
  const pushCell = () => { row.push(cur); cur = ""; };
  const pushRow  = () => { rows.push(row); row = []; };
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i=0;i<s.length;i++){
    const ch = s[i];
    if (inQ) {
      if (ch === '"'){ if (s[i+1] === '"'){ cur += '"'; i++; } else inQ = false; }
      else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") pushCell();
      else if (ch === "\n") { pushCell(); pushRow(); }
      else cur += ch;
    }
  }
  if (cur.length > 0 || row.length > 0) { pushCell(); pushRow(); }
  if (!rows.length) return [];
  const header = rows[0].map(h => h.trim());
  return rows.slice(1)
    .filter(r => r && r.some(c => (c ?? "").trim().length))
    .map(cols => {
      const o = {}; header.forEach((h,i)=> o[h] = (cols[i] ?? "").trim()); return o;
    });
}

/* ---------- Нормализация ---------- */
const normClasses  = rs => rs.map(c => ({ id: Number(c.id), name: c.name })).filter(x => Number.isFinite(x.id) && x.name);
const normSubjects = rs => rs.map(s => ({ id: Number(s.id), class_id: Number(s.class_id), name: s.name }))
                             .filter(x => Number.isFinite(x.id) && Number.isFinite(x.class_id) && x.name);
const normLessons  = rs => rs.map(l => ({ id: Number(l.id), subject_id: Number(l.subject_id), name: l.name }))
                             .filter(x => Number.isFinite(x.id) && Number.isFinite(x.subject_id) && x.name);
function normQuestions(rs){
  return rs.map(q=>{
    const opts = [q.option_1, q.option_2, q.option_3, q.option_4].filter(Boolean);
    let ans = Number(q.correct_index); if (!Number.isFinite(ans) || ans<0 || ans>=opts.length) ans = 0;
    return { lesson_id: Number(q.lesson_id), difficulty: (q.difficulty||"easy").toLowerCase(), q: q.question_text, options: opts, answer: ans, explain: q.explanation || "" };
  }).filter(x => Number.isFinite(x.lesson_id) && x.q && x.options.length>=2);
}

/* ---------- Главен компонент ---------- */
export default function QuizDemo({ initialFilters, autoStart, forceOpenSettings, onExit } = {}) {
  // CSV URL-и от localStorage (или дефолт)
  const [csvUrls, setCsvUrls] = useState(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : DEFAULT_CSV_URLS; }
    catch { return DEFAULT_CSV_URLS; }
  });

  const debug = useMemo(() => {
    try { return new URLSearchParams(window.location.search).has("debug"); } catch { return false; }
  }, []);

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
  const [pendingAdAction, setPendingAdAction] = useState(null); // 'end'|'abort'|null

  // ⚙️ Настройки
  const [showSettings, setShowSettings] = useState(false);
  const [draftUrls, setDraftUrls] = useState(csvUrls);

  // От началния екран – отвори директно настройките
  useEffect(() => { if (forceOpenSettings) setShowSettings(true); }, [forceOpenSettings]);

  // Зареждане от Sheets
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function load(){
    setLoading(true); setError("");
    try{
      const [c,s,l,q] = await Promise.all([
        fetchCsv(csvUrls.classes),
        fetchCsv(csvUrls.subjects),
        fetchCsv(csvUrls.lessons),
        fetchCsv(csvUrls.questions),
      ]);
      const data = {
        classes:  normClasses(c),
        subjects: normSubjects(s),
        lessons:  normLessons(l),
        questions:normQuestions(q),
      };
      if (!data.classes.length || !data.subjects.length || !data.lessons.length || !data.questions.length)
        throw new Error("Някоя от таблиците е празна.");

      setDb(data);

      // Автоизбор
      let cid = data.classes[0]?.id ?? null;
      let sid = data.subjects.find(x => x.class_id === cid)?.id ?? null;
      let lid = data.lessons.find(x => x.subject_id === sid)?.id ?? null;

      // Прилагане на входни филтри
      if (initialFilters){
        if (Number.isFinite(initialFilters.classId)) cid = initialFilters.classId;

        if (initialFilters.lessonName){
          const norm = s => (s||"").toLowerCase().trim();
          const target = norm(initialFilters.lessonName);
          const byName =
            data.lessons.find(x => norm(x.name) === target) ||
            data.lessons.find(x => norm(x.name).includes(target));
          if (byName){
            lid = byName.id;
            const subj = data.subjects.find(t => t.id === byName.subject_id);
            if (subj){ sid = subj.id; cid = subj.class_id; }
          }
        }

        if (initialFilters.difficulty) setDifficulty(initialFilters.difficulty);
        if (Number.isFinite(initialFilters.questionCount)) setQuestionCount(Math.max(3, initialFilters.questionCount));
        if (Number.isFinite(initialFilters.perQuestionSeconds)) setPerQuestionSeconds(Math.max(5, Math.min(120, initialFilters.perQuestionSeconds)));
      }

      setSelectedClassId(cid); setSelectedSubjectId(sid); setSelectedLessonId(lid);

      setStarted(false); setIdx(0); setAnswers([]); setShowExplain(false);
    }catch(e){
      console.error(e);
      setError("Грешка при зареждане на CSV: " + (e.message || e.toString()));
      setDb(MOCK); setSelectedClassId(6); setSelectedSubjectId(1); setSelectedLessonId(101);
    }finally{ setLoading(false); }
  }

  // Деривати
  const subjectsForClass = useMemo(() => db.subjects.filter(s => s.class_id === selectedClassId), [db.subjects, selectedClassId]);
  const lessonsForSubject = useMemo(() => db.lessons.filter(l => l.subject_id === selectedSubjectId), [db.lessons, selectedSubjectId]);

  const filteredQuestions = useMemo(() => {
    let list = db.questions.filter(q => q.lesson_id === selectedLessonId);
    if (difficulty !== "all") list = list.filter(q => q.difficulty === difficulty);
    return [...list].sort(() => Math.random() - 0.5).slice(0, questionCount);
  }, [db.questions, selectedLessonId, difficulty, questionCount]);

  // По-агресивен автостарт (+ fallback на трудност)
  useEffect(() => {
    if (!autoStart) return;
    if (loading) return;
    if (started) return;
    if (!Number.isFinite(selectedLessonId)) return;

    const forLesson = db.questions.filter(q => q.lesson_id === selectedLessonId);
    if (difficulty !== "all" && !forLesson.some(q => q.difficulty === difficulty)) {
      setDifficulty("all"); // ако няма за избраната трудност — падни на всички
      return;
    }
    let list = forLesson;
    if (difficulty !== "all") list = list.filter(q => q.difficulty === difficulty);
    if (list.length > 0) setStarted(true);
  }, [autoStart, loading, started, selectedLessonId, db.questions, difficulty]);

  // Debug панел
  const debugPanel = debug ? (
    <pre style={{fontSize:12, background:'#fff', padding:12, borderRadius:10, marginBottom:12, maxWidth:900, overflow:'auto'}}>
      {JSON.stringify({
        autoStart, loading, started,
        selectedClassId, selectedSubjectId, selectedLessonId,
        difficulty, questionCount, perQuestionSeconds,
        counts: {
          classes: db.classes.length, subjects: db.subjects.length,
          lessons: db.lessons.length, questions: db.questions.length,
          forLesson: db.questions.filter(q=>q.lesson_id===selectedLessonId).length,
          filtered: filteredQuestions.length,
        },
        initialFilters,
      }, null, 2)}
    </pre>
  ) : null;

  // Логика на играта
  const total = filteredQuestions.length;
  const current = filteredQuestions[idx];
  const progress = (idx / Math.max(1, total)) * 100;
  const score = answers.filter(a => a.isCorrect).length;
  const timeLeft = useCountdown(perQuestionSeconds, started && !showExplain && idx < total, () => handleAnswer(-1));

  function handleStart(){ setStarted(true); }
  function handleAnswer(sel){
    if (!current) return;
    const isCorrect = sel === current.answer;
    setAnswers(prev => [...prev, { selected: sel, correctIndex: current.answer, isCorrect, q: current.q, options: current.options, explain: current.explain }]);
    setShowExplain(true);
  }
  function nextQuestion(){ setShowExplain(false); if (idx + 1 < total) setIdx(v => v + 1); else { setPendingAdAction("end"); setShowInterstitial(true); } }
  function restart(){ setIdx(0); setAnswers([]); setShowExplain(false); setStarted(false); }
  function abortTest(){ if (!window.confirm("Прекратяване на теста?")) return; setPendingAdAction("abort"); setShowInterstitial(true); }
  function closeAd(){ setShowInterstitial(false); if (pendingAdAction === "abort") restart(); setPendingAdAction(null); }

  // Настройки
  function openSettings(){ setDraftUrls(csvUrls); setShowSettings(true); }
  function saveSettings(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(draftUrls)); setCsvUrls(draftUrls); }
  function saveAndReload(){ saveSettings(); setShowSettings(false); load(); }
  function restoreDefaults(){ setDraftUrls(DEFAULT_CSV_URLS); }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="bg-white rounded-2xl shadow p-6">Зареждане…</div>
      </div>
    );
  }

  const showConfigScreen = !autoStart && !started;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      {debugPanel}
      <InterstitialAd show={showInterstitial} onClose={closeAd} />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 lg:p-8 space-y-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <button onClick={onExit} className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50">← Начален екран</button>
          <button title="Настройки" onClick={openSettings} className="rounded-full border p-2 hover:bg-gray-50">⚙️</button>
        </div>

        {/* Preparing (autoStart) */}
        {autoStart && !started && (
          <div className="space-y-1">
            <div className="text-lg font-semibold">Подготвяме теста…</div>
            <div className="text-sm text-gray-600">Зареждаме въпросите за избраната тема.</div>
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
        )}

        {/* Конфигурация – само ако НЕ е autoStart */}
        {showConfigScreen && (
          <section className="space-y-4">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">Викторина — Google Sheets</h1>
                <p className="text-gray-600 mt-1">Избери тема, трудност и започни.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Chip>Въпроси: {questionCount}</Chip>
                <Chip>Време/въпрос: {perQuestionSeconds}s</Chip>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Клас</label>
                <select className="border rounded-xl px-3 py-2" value={selectedClassId ?? ""} onChange={(e)=>{
                  const v = Number(e.target.value) || null;
                  setSelectedClassId(v);
                  const s = db.subjects.find(x => x.class_id === v)?.id ?? null;
                  setSelectedSubjectId(s);
                  const l = db.lessons.find(x => x.subject_id === s)?.id ?? null;
                  setSelectedLessonId(l);
                }}>
                  {db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Предмет</label>
                <select className="border rounded-xl px-3 py-2" value={selectedSubjectId ?? ""} onChange={(e)=>{
                  const v = Number(e.target.value) || null; setSelectedSubjectId(v);
                  const l = db.lessons.find(x => x.subject_id === v)?.id ?? null; setSelectedLessonId(l);
                }}>
                  {subjectsForClass.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Урок / Тема</label>
                <select className="border rounded-xl px-3 py-2" value={selectedLessonId ?? ""} onChange={(e)=>setSelectedLessonId(Number(e.target.value)||null)}>
                  {lessonsForSubject.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Трудност</label>
                <select className="border rounded-xl px-3 py-2" value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
                  <option value="all">Всички</option>
                  <option value="easy">Лесни</option>
                  <option value="medium">Средни</option>
                  <option value="hard">Трудни</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Брой въпроси</label>
                <input type="number" min={3} className="border rounded-xl px-3 py-2" value={questionCount} onChange={(e)=>setQuestionCount(Math.max(3, Number(e.target.value)||6))}/>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-700">Време за въпрос (секунди)</label>
                <input type="number" min={5} max={120} className="border rounded-xl px-3 py-2" value={perQuestionSeconds} onChange={(e)=>setPerQuestionSeconds(Math.max(5, Math.min(120, Number(e.target.value)||20)))}/>
              </div>
            </div>

            <button onClick={handleStart} className="w-full md:w-auto rounded-2xl px-6 py-3 bg-black text-white" disabled={filteredQuestions.length===0}>▶ Стартирай теста</button>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Класове: <b>{db.classes.length}</b></div>
              <div>Предмети: <b>{db.subjects.length}</b></div>
              <div>Уроци:   <b>{db.lessons.length}</b></div>
              <div>Въпроси: <b>{db.questions.length}</b></div>
            </div>

            {error && <div className="text-xs text-red-600">{error}</div>}
          </section>
        )}

        {/* Игра */}
        {started && filteredQuestions.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Въпрос {idx+1} от {total}</div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Точки: <b>{score}</b></div>
                <button onClick={abortTest} className="text-xs px-3 py-1.5 rounded-lg border">Прекрати теста</button>
              </div>
            </div>

            <ProgressBar value={progress} />

            <div className="flex items-center justify-between bg-gray-50 border rounded-xl p-3">
              <div className="text-sm text-gray-700">Оставащо време</div>
              <div className="text-lg font-semibold">{timeLeft}s</div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-medium">{current?.q}</h2>
              <div className="grid grid-cols-1 gap-3">
                {current?.options.map((opt, i) => {
                  const isSel = answers[idx]?.selected === i;
                  const isCorrect = showExplain && i === current.answer;
                  const isWrong = showExplain && isSel && i !== current.answer;
                  return (
                    <button key={i} disabled={showExplain} onClick={()=>handleAnswer(i)}
                      className={[
                        "text-left border rounded-xl px-4 py-3 transition",
                        !showExplain && "hover:bg-gray-50",
                        isCorrect && "bg-green-50 border-green-300",
                        isWrong && "bg-red-50 border-red-300",
                      ].filter(Boolean).join(" ")}>
                      <span className="font-medium mr-2">{String.fromCharCode(65+i)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {showExplain && (
              <div className="space-y-3">
                <div className="p-3 border rounded-xl bg-white">
                  <div className="text-sm text-gray-700">Обяснение</div>
                  <div className="mt-1">{current?.explain}</div>
                </div>
                <button onClick={nextQuestion} className="rounded-2xl px-5 py-2.5 bg-black text-white">
                  {idx+1===total ? "Завърши" : "Следващ въпрос"}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Празно/финал */}
        {started && filteredQuestions.length === 0 && (
          <div className="text-sm text-red-600">Няма въпроси за тази тема/трудност.</div>
        )}

        {started && answers.length === filteredQuestions.length && filteredQuestions.length > 0 && (
          <section className="space-y-5">
            <div className="text-center">
              <div className="text-4xl font-bold">{score} / {filteredQuestions.length}</div>
              <p className="text-gray-600 mt-1">Твоят резултат</p>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={restart} className="rounded-2xl px-5 py-2.5 border">Играй отново</button>
              <button onClick={onExit} className="rounded-2xl px-5 py-2.5 border">Начален екран</button>
            </div>
          </section>
        )}
      </div>

      {/* ⚙️ Настройки */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Настройки</div>
              <button onClick={()=>setShowSettings(false)} className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50">Затвори</button>
            </div>
            <div className="text-sm text-gray-600">Постави публичните CSV линкове от Google Sheets. Пазим ги локално (localStorage).</div>

            {["classes","subjects","lessons","questions"].map(k=>(
              <div key={k} className="space-y-1">
                <label className="text-sm">{k[0].toUpperCase()+k.slice(1)} CSV URL</label>
                <input className="border rounded-xl px-3 py-2 w-full" value={draftUrls[k]} onChange={(e)=>setDraftUrls({...draftUrls, [k]: e.target.value})}/>
              </div>
            ))}

            {error && <div className="text-xs text-red-600">Грешка: {error}</div>}

            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={restoreDefaults} className="rounded-xl px-4 py-2 border">Възстанови стандартните</button>
              <button onClick={saveSettings} className="rounded-xl px-4 py-2 border">Запази</button>
              <button onClick={saveAndReload} className="rounded-xl px-4 py-2 bg-black text-white">Запази и зареди</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Таймер ---------- */
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
