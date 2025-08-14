import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_CSV_URLS = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=1450893758&single=true&output=csv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=1804178952&single=true&output=csv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=636509497&single=true&output=csv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlZCfq5-YCPGLE0DpGyKKsiJAqtPVbrSRaO0Msmf65lH5EJE8sGhGjUnsGARq9cHN1ulCTkc-qmvzR/pub?gid=1301560227&single=true&output=csv",
];

export default function QuizDemo({ initialFilters, autoStart, onExit } = {}) {
  const [csvUrls, setCsvUrls] = useState(DEFAULT_CSV_URLS);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [db, setDb] = useState({ questions: [], lessons: [], classes: [] });

  const [difficulty, setDifficulty] = useState(initialFilters?.difficulty || "all");
  const [questionCount, setQuestionCount] = useState(initialFilters?.questionCount || 5);
  const [perQuestionSeconds, setPerQuestionSeconds] = useState(initialFilters?.perQuestionSeconds || 20);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // ЗАРЕЖДАНЕ НА CSV
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allQuestions = [];
        for (const url of csvUrls) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`CSV load error: ${res.status}`);
          const text = await res.text();
          const rows = text.split("\n").map((r) => r.split(","));
          // TODO: парсване на данните по твоята структура
          // allQuestions.push(...parsedRows);
        }
        setDb({ ...db, questions: allQuestions });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [csvUrls]);

  const filteredQuestions = useMemo(() => {
    let list = db.questions.filter((q) => q.lesson_id === selectedLessonId);
    if (difficulty !== "all") {
      list = list.filter((q) => q.difficulty === difficulty);
    }
    return [...list].sort(() => Math.random() - 0.5).slice(0, questionCount);
  }, [db.questions, selectedLessonId, difficulty, questionCount]);

  // Автоматичен старт
  useEffect(() => {
    if (!autoStart) return;
    if (loading) return;
    if (started) return;
    if (filteredQuestions.length > 0) {
      setStarted(true);
    }
  }, [autoStart, loading, started, filteredQuestions.length]);

  if (!started) {
    return (
      <div>
        <h2>Подготовка за тест</h2>
        <button onClick={() => setStarted(true)}>▶ Стартирай теста</button>
        {onExit && <button onClick={onExit}>Назад</button>}
      </div>
    );
  }

  return (
    <div>
      <h2>Тестът стартира!</h2>
      {/* Тук логиката за въпросите */}
      {onExit && <button onClick={onExit}>Край на теста</button>}
    </div>
  );
}
