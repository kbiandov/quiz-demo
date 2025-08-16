import { r as reactExports, a as reactDomExports } from "./vendor-BGmjLziz.js";
import { P as Papa } from "./utils-Bhom5Y7W.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
function useLocalStorage(key, initialValue) {
  const [value, setValue] = reactExports.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }, [key, value]);
  return [value, setValue];
}
const SHEETS = {
  classes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1460999158&single=true&output=csv",
  subjects: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=567850345&single=true&output=csv",
  lessons: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1551143625&single=true&output=csv",
  questions: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=560252204&single=true&output=csv",
  theory: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=1818357835&single=true&output=csv"
};
const STORAGE_KEYS = {
  profile: "math-app-profile",
  results: "math-app-results",
  settings: "math-app-settings",
  points: "math-app-points"
};
function usePoints() {
  const [points, setPoints] = useLocalStorage(STORAGE_KEYS.points, 0);
  const level = Math.floor(points / 100) + 1;
  const progressToNextLevel = points % 100;
  const pointsToNextLevel = 100 - progressToNextLevel;
  const progressPercentage = progressToNextLevel / 100 * 100;
  const addPoints = reactExports.useCallback((amount) => {
    setPoints((prevPoints) => prevPoints + amount);
  }, [setPoints]);
  const resetPoints = reactExports.useCallback(() => setPoints(0), [setPoints]);
  return {
    points,
    level,
    progressToNextLevel,
    pointsToNextLevel,
    progressPercentage,
    addPoints,
    resetPoints
  };
}
function HeaderBar({ title, profile, onHome, onLogout, onOpenSettings }) {
  const { points, level } = usePoints();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white border-b border-slate-200 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onHome,
          className: "text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-slate-800", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-600", children: "⭐" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700", children: [
          points,
          " т."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700", children: [
          "Ниво ",
          level
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onOpenSettings,
          className: "text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onLogout,
          className: "text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }) })
        }
      )
    ] })
  ] }) });
}
const normalizeId = (v) => v == null ? null : String(v).trim();
function routeTitle(route) {
  switch (route) {
    case "home":
      return "Начало";
    case "theory":
      return "Теория";
    case "tests":
      return "Тестове";
    case "results":
      return "Резултати";
    case "stats":
      return "Статистика";
    default:
      return "Math App";
  }
}
function Onboarding({ classes, onDone }) {
  const [name, setName] = reactExports.useState("");
  const [classId, setClassId] = reactExports.useState("");
  const canContinue = name.trim().length >= 2 && classId;
  const handleContinue = () => onDone({ name: name.trim(), classId });
  const handleNameChange = (e) => setName(e.target.value);
  const handleClassChange = (e) => setClassId(e.target.value);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-white to-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-2", children: "Добре дошъл! 🎓" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-6", children: "Нека те опознаем, за да ти подберем правилните тестове." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1", children: "Име / прякор" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full rounded-lg border border-slate-300 px-3 py-2",
            placeholder: "напр. Алекс",
            value: name,
            onChange: handleNameChange
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Клас" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "w-full rounded-lg border border-slate-300 px-3 py-2",
            value: classId,
            onChange: handleClassChange,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Избери клас" }),
              classes.map((c) => {
                const key = normalizeId(c.id) || c.name;
                const value = normalizeId(c.id) || c.name;
                const label = c.name || c.title || c.class || c.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: label }, key);
              })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "btn w-full",
          onClick: handleContinue,
          disabled: !canContinue,
          children: "Продължи"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-6", children: "* Запазваме само име/прякор и клас на устройството ти." })
  ] }) });
}
function Quiz({ lesson, questions, onFinish, settings }) {
  const { addPoints, points, level } = usePoints();
  const [index, setIndex] = reactExports.useState(0);
  const [answers, setAnswers] = reactExports.useState({});
  const [startTime, setStartTime] = reactExports.useState(Date.now());
  const [showExplanation, setShowExplanation] = reactExports.useState(false);
  const [explanationTimer, setExplanationTimer] = reactExports.useState(null);
  reactExports.useRef(null);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [timeLeft, setTimeLeft] = reactExports.useState((settings == null ? void 0 : settings.timeLimitMin) ? settings.timeLimitMin * 60 : 0);
  const [adLeft, setAdLeft] = reactExports.useState(0);
  const autoTimerRef = reactExports.useRef(null);
  const AD_SECONDS = 5;
  const qlist = reactExports.useMemo(() => {
    const base = [...questions];
    if (settings == null ? void 0 : settings.shuffleQuestions) {
      base.sort(() => Math.random() - 0.5);
    }
    return base.map((q2) => {
      const options2 = [
        { key: "A", text: q2.A ?? q2.a },
        { key: "B", text: q2.B ?? q2.b },
        { key: "C", text: q2.C ?? q2.c },
        { key: "D", text: q2.D ?? q2.d }
      ].filter((o) => o.text != null && String(o.text).trim() !== "");
      const correctKey = String(q2.correct || q2.correct_option || q2.answer || "").toUpperCase();
      const correctText = { A: q2.A, B: q2.B, C: q2.C, D: q2.D }[correctKey];
      const shuffled = (settings == null ? void 0 : settings.shuffleOptions) ? [...options2].sort(() => Math.random() - 0.5) : options2;
      const newCorrectKey = (shuffled.find((o) => o.text === correctText) || {}).key || correctKey;
      return { ...q2, __options: shuffled, __correctKey: newCorrectKey };
    });
  }, [questions, settings == null ? void 0 : settings.shuffleQuestions, settings == null ? void 0 : settings.shuffleOptions]);
  const current = qlist[index];
  const total = qlist.length;
  const progress = total ? Math.round(index / total * 100) : 0;
  const isNearEnd = progress >= 80;
  const isLastQuestion = index === total - 1;
  reactExports.useMemo(() => {
    if (!current) return [];
    const opts2 = [
      { key: "A", text: current.A || current.a },
      { key: "B", text: current.B || current.b },
      { key: "C", text: current.C || current.c },
      { key: "D", text: current.D || current.d }
    ].filter((o) => o.text != null && String(o.text).trim() !== "");
    const shuffled = (settings == null ? void 0 : settings.shuffleOptions) ? [...opts2].sort(() => Math.random() - 0.5) : opts2;
    return shuffled;
  }, [current, settings == null ? void 0 : settings.shuffleOptions]);
  reactExports.useEffect(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, [index]);
  reactExports.useEffect(() => {
    if (!(settings == null ? void 0 : settings.timeLimitMin)) return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1e3);
    return () => clearTimeout(t);
  }, [timeLeft, settings == null ? void 0 : settings.timeLimitMin]);
  reactExports.useEffect(() => {
    if (!showConfirm) return;
    setAdLeft(AD_SECONDS);
    const tick = setInterval(() => {
      setAdLeft((s) => {
        if (s <= 1) {
          clearInterval(tick);
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(tick);
  }, [showConfirm]);
  function choose(optKey) {
    if (answers[current.id]) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [current.id]: optKey }));
    if (optKey === current.__correctKey) {
      addPoints(10);
    }
    if (settings == null ? void 0 : settings.showExplanation) {
      setShowExplanation(true);
      if (settings == null ? void 0 : settings.instantNext) {
        const timer = setTimeout(() => next(), ((settings == null ? void 0 : settings.instantDelaySec) || 4) * 1e3);
        setExplanationTimer(timer);
      }
    } else {
      setTimeout(next, 1e3);
    }
  }
  function next() {
    if (index < total - 1) {
      setIndex(index + 1);
      setShowExplanation(false);
      if (explanationTimer) {
        clearTimeout(explanationTimer);
        setExplanationTimer(null);
      }
    } else {
      setShowConfirm(true);
    }
  }
  function computeScore() {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    for (const q2 of qlist) {
      if (answers[q2.id]) {
        if ((answers[q2.id] || "").toUpperCase() === (q2.__correctKey || "").toUpperCase()) {
          correct++;
        } else {
          wrong++;
        }
      } else {
        unanswered++;
      }
    }
    return { correct, wrong, unanswered, total };
  }
  function submit() {
    const { correct, total: total2 } = computeScore();
    onFinish({
      lesson,
      questions: qlist,
      // Include questions for review
      correct,
      total: total2,
      answers,
      at: (/* @__PURE__ */ new Date()).toISOString(),
      timeLimitMin: settings == null ? void 0 : settings.timeLimitMin
    });
  }
  if (!current) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center", children: "Няма въпроси за този урок." });
  const opts = current.__options;
  const hms = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const chosen = answers[current.id];
  const showExplain = (settings == null ? void 0 : settings.showExplanation) && chosen;
  const isCorrect = chosen && chosen.toUpperCase() === current.__correctKey;
  const adProgress = (AD_SECONDS - adLeft) / AD_SECONDS * 100;
  const handleNext = () => {
    setIndex(index + 1);
    if (explanationTimer) {
      clearTimeout(explanationTimer);
      setExplanationTimer(null);
    }
    setShowExplanation(false);
  };
  const handleShowConfirm = () => setShowConfirm(true);
  const handleHideConfirm = () => setShowConfirm(false);
  const handleFinishQuiz = () => {
    const score = computeScore();
    const correct = score.correct;
    const wrong = score.wrong;
    const unanswered = score.unanswered;
    const total2 = score.total;
    onFinish({ lesson, correct, wrong, unanswered, total: total2, answers, at: (/* @__PURE__ */ new Date()).toISOString(), timeLimitMin: settings == null ? void 0 : settings.timeLimitMin, qlist });
  };
  const handleDotClick = (i) => setIndex(i);
  const handleAnswerClick = (optKey) => choose(optKey);
  const renderScoreSummary = () => {
    const score = computeScore();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-green-50 border border-green-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-green-700", children: score.correct }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-green-600", children: "Правилни" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-red-50 border border-red-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-red-700", children: score.wrong }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-red-600", children: "Грешни" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center p-2 rounded-lg bg-slate-50 border border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-600", children: [
        "Отговорени: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: score.correct + score.wrong }),
        " · Пропуснати: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: score.unanswered }),
        " · Общо: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: score.total })
      ] }) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-3 text-white text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        "⭐ ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          points,
          " т."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/80", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
        "Ниво ",
        level
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-600", children: [
          "Урок: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800", children: lesson.title || lesson.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
            "Въпрос ",
            index + 1,
            " от ",
            total
          ] }),
          (settings == null ? void 0 : settings.timeLimitMin) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-semibold ${timeLeft <= 10 ? "text-red-600" : ""}`, children: hms(timeLeft) }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress h-3 bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full transition-all duration-300 ease-out ${isNearEnd ? "bg-orange-500" : "bg-blue-500"} ${isLastQuestion ? "bg-green-500" : ""}`,
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-white drop-shadow-sm", children: [
          progress,
          "%"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", children: index === 0 ? "Започваме!" : isLastQuestion ? "Последен въпрос!" : `Остават ${total - index - 1} въпроса` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-1", children: Array.from({ length: total }, (unused, i) => {
        var _a;
        const isAnswered = answers[(_a = qlist[i]) == null ? void 0 : _a.id];
        const isCurrent = i === index;
        const dotClasses = `w-3 h-3 rounded-full transition-all ${isCurrent ? "bg-blue-600 scale-125" : isAnswered ? "bg-green-500" : "bg-slate-300 hover:bg-slate-400"}`;
        const dotTitle = `Въпрос ${i + 1}${isAnswered ? " - Отговорен" : ""}`;
        const handleClick = () => handleDotClick(i);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: dotClasses,
            title: dotTitle,
            onClick: handleClick
          },
          i
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-medium mb-4", children: current.text || current.question || current.title }),
      current.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: current.image, alt: "Илюстрация", className: "mb-4 rounded-lg border" }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: opts.map((o) => {
        const buttonClasses = `btn h-auto py-3 text-left transition-all ${chosen === o.key ? isCorrect ? "bg-green-100 border-green-300 text-green-800" : "btn-danger" : "hover:bg-slate-50"} ${answers[current.id] ? "cursor-default" : ""}`;
        const handleClick = () => handleAnswerClick(o.key);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: buttonClasses,
            onClick: handleClick,
            disabled: answers[current.id] !== void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold w-6 inline-block", children: [
                o.key,
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: o.text }),
              chosen === o.key && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-sm", children: isCorrect ? "✓" : "✗" })
            ]
          },
          o.key
        );
      }) }),
      showExplain ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-4 text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`, children: [
        isCorrect ? "Вярно! " : "Грешно. ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-700", children: [
          "Обяснение: ",
          current.explanation || "—"
        ] })
      ] }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      index < total - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn", onClick: handleNext, children: "Следващ въпрос" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn", onClick: handleShowConfirm, children: "Приключи" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-500", children: [
        "Избран отговор: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: answers[current.id] || "—" })
      ] })
    ] }),
    showConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: handleHideConfirm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-semibold text-lg", children: "Готов ли си да предадеш теста?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-2", children: 'Провери обобщението по-долу и натисни „Предай".' }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 p-3 rounded-lg border bg-slate-50 text-sm", children: "Място за реклама или банер" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-xs text-slate-500", children: [
        "Рекламна пауза: остава ",
        adLeft,
        " сек."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${adProgress}%` } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 mb-4 text-sm text-slate-700", children: renderScoreSummary() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn", onClick: handleFinishQuiz, children: "Предай" }) })
    ] }) })
  ] });
}
const SquareButton = ({ label, onClick, icon = "🔹" }) => {
  if (!onClick) {
    console.warn("SquareButton: onClick prop is required");
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: "square group flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition w-full",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-2", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label })
      ]
    }
  );
};
function HomeScreen({ onGo, profile }) {
  const { points, level } = usePoints();
  console.log("HomeScreen render:", { onGo, profile, SquareButton: typeof SquareButton });
  if (typeof onGo !== "function") {
    console.error("HomeScreen: onGo prop is not a function:", onGo);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Error: Invalid navigation function" });
  }
  if (typeof SquareButton !== "function") {
    console.error("HomeScreen: SquareButton is not a function:", SquareButton);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Error: SquareButton component not available" });
  }
  const tiles = [
    { key: "theory", icon: "📖", label: "Теория" },
    { key: "tests", icon: "✏️", label: "Тестове" },
    { key: "results", icon: "📊", label: "Резултати" },
    { key: "stats", icon: "📈", label: "Статистики" }
  ];
  const handleTileClick = (key) => onGo(key);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 bg-white rounded-xl p-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl sm:text-3xl font-bold text-slate-800 mb-2", children: [
          "Здравей, ",
          (profile == null ? void 0 : profile.name) || "Ученик",
          " · Клас ",
          (profile == null ? void 0 : profile.classId) || "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-lg text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            "⭐ ",
            points,
            " т."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Ниво ",
            level
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Ниво" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl", children: level })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: tiles.map((t) => {
      const handleClick = () => handleTileClick(t.key);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SquareButton, { icon: t.icon, label: t.label, onClick: handleClick }, t.key);
    }) })
  ] }) });
}
function TheoryModal({ isOpen, onClose, theoryItem, onStartTest, lesson }) {
  if (!isOpen || !theoryItem) return null;
  const handleStartTestAndClose = () => {
    onStartTest(lesson);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-800", children: theoryItem.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-slate-600 text-2xl font-bold p-2 hover:bg-slate-100 rounded-lg transition-colors",
          children: "×"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-140px)]", children: [
      theoryItem.image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: theoryItem.image,
          alt: theoryItem.title,
          className: "max-w-full max-h-64 object-contain rounded-lg border shadow-sm",
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-slate max-w-none mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap text-slate-700 leading-relaxed text-base", children: theoryItem.content }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-4 border-t border-slate-200", children: [
        theoryItem.classId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium", children: [
          "Клас ",
          theoryItem.classId
        ] }),
        theoryItem.lessonId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium", children: [
          "Урок ",
          theoryItem.lessonId
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-600", children: "Готови ли сте да тествате знанията си?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors",
            children: "Затвори"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleStartTestAndClose,
            className: "px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors",
            children: "Започни тест"
          }
        )
      ] })
    ] })
  ] }) });
}
function useURLParams() {
  const [params, setParams] = reactExports.useState(new URLSearchParams(window.location.search));
  const updateParams = reactExports.useCallback((newParams) => {
    const search = newParams.toString();
    const newURL = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.pushState({}, "", newURL);
    setParams(newParams);
  }, []);
  return [params, updateParams];
}
function TheoryScreen(props) {
  const {
    profile,
    theory = [],
    classes = [],
    lessons = [],
    questions = [],
    onStartQuiz
  } = props;
  console.log("TheoryScreen render - theory data:", theory);
  console.log("TheoryScreen render - theory length:", theory == null ? void 0 : theory.length);
  console.log("TheoryScreen render - profile:", profile);
  const [searchParams, setSearchParams] = useURLParams();
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  searchParams.get("class");
  const urlLessonId = searchParams.get("lesson");
  const [activeClassId, setActiveClassId] = reactExports.useState((profile == null ? void 0 : profile.classId) ? Number(profile.classId) : null);
  const [activeLessonId, setActiveLessonId] = reactExports.useState(urlLessonId || "");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = reactExports.useState("");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [selectedTheoryItem, setSelectedTheoryItem] = reactExports.useState(null);
  const [selectedLesson, setSelectedLesson] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  reactExports.useEffect(() => {
    const params = new URLSearchParams();
    if (activeClassId) params.set("class", activeClassId.toString());
    if (activeLessonId) params.set("lesson", activeLessonId);
    setSearchParams(params);
  }, [activeClassId, activeLessonId, setSearchParams]);
  const filteredTheory = reactExports.useMemo(() => {
    let filtered = theory;
    if (activeClassId) {
      filtered = filtered.filter((item) => item.classId === activeClassId);
    }
    if (activeLessonId) {
      filtered = filtered.filter((item) => item.lessonId === activeLessonId);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [theory, activeClassId, activeLessonId, searchQuery]);
  const availableClasses = reactExports.useMemo(() => {
    const classIds = [...new Set(theory.map((item) => item.classId).filter(Boolean))];
    return classIds.map((classId) => {
      const classInfo = classes.find((c) => normalizeId(c.id) === classId.toString() || c.id === classId);
      const name = (classInfo == null ? void 0 : classInfo.name) || (classInfo == null ? void 0 : classInfo.title) || `Клас ${classId}`;
      return { id: classId, name };
    }).sort((a, b) => a.id - b.id);
  }, [theory, classes]);
  const availableLessons = reactExports.useMemo(() => {
    if (!activeClassId) return [];
    const lessonIds = [...new Set(
      theory.filter((item) => item.classId === activeClassId && item.lessonId).map((item) => item.lessonId)
    )];
    return lessonIds.map((lessonId) => {
      const lessonInfo = lessons.find((l2) => normalizeId(l2.id) === lessonId);
      const name = (lessonInfo == null ? void 0 : lessonInfo.title) || (lessonInfo == null ? void 0 : lessonInfo.name) || `Урок ${lessonId}`;
      return { id: lessonId, name };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [theory, lessons, activeClassId]);
  const handleClassChange = (classId) => {
    setActiveClassId(classId);
    setActiveLessonId(null);
    setSelectedTheoryItem(null);
  };
  const handleLessonChange = (lessonId) => {
    setActiveLessonId(lessonId);
    setSelectedTheoryItem(null);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleTheoryClick = reactExports.useCallback((theoryItem) => {
    const lesson = lessons.find((l2) => normalizeId(l2.id) === theoryItem.lessonId);
    setSelectedTheoryItem(theoryItem);
    setSelectedLesson(lesson);
    setModalOpen(true);
  }, [lessons]);
  const handleStartTest = reactExports.useCallback((lesson) => {
    if (lesson && onStartQuiz) {
      const lessonQuestions = questions.filter((q2) => {
        const questionLessonId = q2.lesson_id || q2.lessonId;
        const lessonId = lesson.id || lesson.lesson_id;
        return normalizeId(questionLessonId) === normalizeId(lessonId);
      });
      if (lessonQuestions.length > 0) {
        console.log("Starting test for lesson:", lesson, "with", lessonQuestions.length, "questions");
        onStartQuiz(lesson, lessonQuestions);
      } else {
        console.warn("No questions found for lesson:", lesson);
      }
    }
  }, [onStartQuiz, questions]);
  const handleGoToOnboarding = () => window.location.href = "/onboarding";
  const handleReload = () => window.location.reload();
  const handleClearClassFilter = () => setActiveClassId(null);
  const handleTheoryItemClick = (item) => handleTheoryClick(item);
  const handleClassSelectChange = (e) => handleClassChange(e.target.value);
  const handleLessonSelectChange = (e) => handleLessonChange(e.target.value);
  const handleCloseModal = () => setModalOpen(false);
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "👤" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold mb-4 text-slate-800", children: "Профилът е задължителен" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-6 text-lg", children: "Моля, въведете профил/клас в настройките за да видите теорията" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",
          onClick: handleGoToOnboarding,
          children: "Въведи профил"
        }
      )
    ] }) }) });
  }
  if (!theory || theory.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "⏳" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold mb-4 text-slate-800", children: "Зареждаме теорията" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse text-lg text-slate-600 mb-4", children: "Моля, изчакайте..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Ако зареждането продължава дълго, може да има проблем с достъпа до данните." })
    ] }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "❌" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold mb-4 text-slate-800", children: "Възникна грешка" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-600 mb-6 p-4 bg-red-50 rounded-lg border border-red-200", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",
          onClick: handleReload,
          children: "Опитай отново"
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 bg-white rounded-xl p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-slate-800 mb-6", children: "Теория" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-700", children: "Клас" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: activeClassId || "",
                onChange: handleClassSelectChange,
                className: "w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Всички класове" }),
                  availableClasses.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cls.id, children: cls.name }, cls.id))
                ]
              }
            )
          ] }),
          activeClassId && availableLessons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-700", children: "Урок" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: activeLessonId,
                onChange: handleLessonSelectChange,
                className: "w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Всички уроци" }),
                  availableLessons.map((lesson) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: lesson.id, children: lesson.name }, lesson.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-2 ${activeClassId && availableLessons.length > 0 ? "sm:col-span-2" : "sm:col-span-3"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-700", children: "Търсене" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: searchQuery,
                onChange: handleSearchChange,
                placeholder: "Търси в заглавие и съдържание...",
                className: "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              }
            )
          ] })
        ] })
      ] }),
      filteredTheory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-12 text-center shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "📚" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-slate-800 mb-2", children: "Няма налична теория" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-4", children: activeClassId ? `Няма налична теория за клас ${activeClassId}. Опитайте да промените филтъра за клас или да използвате търсенето.` : "Няма налична теория за избрания филтър." }),
        activeClassId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleClearClassFilter,
            className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors",
            children: "Покажи всички класове"
          }
        ) }),
        theory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Налична теория за класове: ",
          [...new Set(theory.map((item) => item.classId))].sort().join(", ")
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold text-slate-800 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📖" }),
          "Уроци с теория (",
          filteredTheory.length,
          ")"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-200", children: filteredTheory.map((item) => {
          const handleClick = () => handleTheoryItemClick(item);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-6 hover:bg-slate-50 cursor-pointer transition-colors",
              onClick: handleClick,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-800 mb-3", children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    item.classId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium", children: [
                      "Клас ",
                      item.classId
                    ] }),
                    item.lessonId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium", children: [
                      "Урок ",
                      item.lessonId
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })
              ] })
            },
            item.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TheoryModal,
      {
        isOpen: modalOpen,
        onClose: handleCloseModal,
        theoryItem: selectedTheoryItem,
        lesson: selectedLesson,
        onStartTest: handleStartTest
      }
    )
  ] });
}
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true
}) {
  const modalRef = reactExports.useRef(null);
  const previousFocusRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      previousFocusRef.current = document.activeElement;
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);
  reactExports.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
        onClick: onClose,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "modal-title",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: modalRef,
            className: `bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`,
            onClick: (e) => e.stopPropagation(),
            tabIndex: -1,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-slate-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "modal-title", className: "text-xl font-semibold text-slate-800", children: title }),
                showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "text-slate-400 hover:text-slate-600 text-2xl font-bold p-2 hover:bg-slate-100 rounded-lg transition-colors",
                    "aria-label": "Затвори модал",
                    children: "×"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto max-h-[calc(90vh-140px)]", children })
            ]
          }
        )
      }
    ),
    document.body
  );
}
function ResultReview({ result, onRetakeTest }) {
  var _a;
  if (!result) return null;
  const lesson = result.lesson;
  const correct = result.correct;
  const total = result.total;
  const answers = result.answers;
  const at = result.at;
  const questions = result.questions;
  const percentage = Math.round(correct / total * 100);
  const date = new Date(at).toLocaleDateString("bg-BG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  console.log("ResultReview render:", {
    result,
    questions: result.questions,
    questionsType: typeof result.questions,
    questionsLength: (_a = result.questions) == null ? void 0 : _a.length,
    answers,
    hasQuestions
  });
  const getOptionText = (question, optionKey) => {
    const optionMap = {
      "A": question.A || question.a,
      "B": question.B || question.b,
      "C": question.C || question.c,
      "D": question.D || question.d
    };
    return optionMap[optionKey] || "";
  };
  const isCorrectOption = (question, optionKey) => {
    const correctKey = String(question.correct || question.correct_option || question.answer || "").toUpperCase();
    return optionKey === correctKey;
  };
  const wasSelected = (questionId, optionKey) => {
    return answers[questionId] === optionKey;
  };
  const getQuestionOptions = (question) => {
    const options = [];
    ["A", "B", "C", "D"].forEach((key) => {
      const text = getOptionText(question, key);
      if (text && text.trim() !== "") {
        options.push({ key, text });
      }
    });
    return options;
  };
  const hasQuestions = questions && Array.isArray(questions) && questions.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-slate-800 mb-2", children: (lesson == null ? void 0 : lesson.title) || (lesson == null ? void 0 : lesson.name) || "Урок" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-4", children: date }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: correct }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Правилни" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Общо" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold", children: [
            percentage,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: "Резултат" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-slate-800 mb-4", children: "Преглед на въпросите" }),
      !hasQuestions ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-yellow-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-2", children: "Въпросите не са налични за преглед" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Това може да се дължи на по-стара версия на приложението" })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-6 max-h-[60vh] overflow-y-auto", children: questions.map((question, index) => {
        const options = getQuestionOptions(question);
        const selectedAnswer = answers[question.id];
        const correctAnswer = String(question.correct || question.correct_option || question.answer || "").toUpperCase();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "bg-slate-50 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h5", { className: "font-semibold text-slate-800 mb-2", children: [
              "Въпрос ",
              index + 1,
              ": ",
              question.text || question.question || question.title
            ] }),
            question.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: question.image,
                alt: "Илюстрация",
                className: "max-w-full max-h-48 object-contain rounded-lg border mb-3"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: options.map((option) => {
            isCorrectOption(question, option.key);
            const isSelected = wasSelected(question.id, option.key);
            const isCorrectAnswer = option.key === correctAnswer;
            let optionClasses = "p-3 rounded-lg border text-left transition-all";
            if (isCorrectAnswer) {
              optionClasses += " bg-green-50 border-green-300 text-green-800";
            } else if (isSelected && !isCorrectAnswer) {
              optionClasses += " bg-red-50 border-red-300 text-red-800";
            } else if (isSelected && isCorrectAnswer) {
              optionClasses += " bg-green-100 border-green-400 text-green-900";
            } else {
              optionClasses += " bg-white border-slate-200 text-slate-700";
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: optionClasses, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold w-6 text-center", children: [
                option.key,
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: option.text }),
              isCorrectAnswer && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-bold", children: "✓" }),
              isSelected && !isCorrectAnswer && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-bold", children: "✗" })
            ] }) }, option.key);
          }) }),
          question.explanation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-blue-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Обяснение:" }),
            " ",
            question.explanation
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-sm", children: selectedAnswer ? wasSelected(question.id, correctAnswer) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "✓ Правилен отговор" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-medium", children: "✗ Грешен отговор" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Пропуснат въпрос" }) })
        ] }, question.id || index);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onRetakeTest,
        className: "px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors",
        children: "Направи теста отново"
      }
    ) })
  ] });
}
function ResultsScreen(props) {
  const {
    results = [],
    classes = [],
    lessons = [],
    canRestart = false,
    onRestart
  } = props;
  const [activeResult, setActiveResult] = reactExports.useState(null);
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const handleResultClick = (result) => {
    setActiveResult(result);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveResult(null);
  };
  const handleRetakeTest = () => {
    if (activeResult && onRestart) {
      handleCloseModal();
      const resultQuestions = activeResult.questions || [];
      if (resultQuestions.length > 0) {
        onRestart(activeResult.lesson, resultQuestions);
      } else {
        console.warn("No questions found in result data for retake");
      }
    }
  };
  if (!results || results.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "📊" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold mb-4 text-slate-800", children: "Няма резултати" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-6 text-lg", children: "Направете първия си тест за да видите резултатите тук" }),
      canRestart && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onRestart,
          className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",
          children: "Направи тест отново"
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-slate-800 mb-8", children: "Резултати" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: results.map((result) => {
        var _a, _b;
        const handleClick = () => handleResultClick(result);
        const percentage = Math.round(result.correct / result.total * 100);
        const date = new Date(result.at).toLocaleDateString("bg-BG", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-white rounded-lg border p-4 hover:bg-slate-50 cursor-pointer transition-colors",
            onClick: handleClick,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-800 mb-2", children: ((_a = result.lesson) == null ? void 0 : _a.title) || ((_b = result.lesson) == null ? void 0 : _b.name) || "Урок" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600 mb-3", children: [
                    date,
                    " · ",
                    result.correct,
                    "/",
                    result.total,
                    " правилни отговора"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500", children: result.timeLimitMin ? `Време: ${result.timeLimitMin} мин` : "Без време" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right ml-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-2xl font-bold ${percentage >= 80 ? "text-green-600" : percentage >= 60 ? "text-yellow-600" : "text-red-600"}`, children: [
                    percentage,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "Резултат" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-200 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-2 rounded-full transition-all duration-300 ${percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500"}`,
                  style: { width: `${percentage}%` }
                }
              ) }) })
            ] })
          },
          result.at
        );
      }) }),
      canRestart && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onRestart,
          className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",
          children: "Направи последния тест отново"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: handleCloseModal,
        title: "Преглед на резултата",
        size: "xl",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ResultReview,
          {
            result: activeResult,
            onRetakeTest: handleRetakeTest
          }
        )
      }
    )
  ] });
}
function StatsScreen(props) {
  const { results = [] } = props;
  const { points, level, progressToNextLevel, pointsToNextLevel, progressPercentage, resetPoints } = usePoints();
  const totalTests = results.length;
  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const averageScore = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-slate-800 mb-8", children: "Статистики" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-bold mb-2", children: [
            "⭐ ",
            points
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg opacity-90", children: "Общо точки" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold mb-2", children: level }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg opacity-90", children: "Текущо ниво" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold mb-2", children: pointsToNextLevel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg opacity-90", children: "До следващото ниво" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Ниво ",
            level
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Ниво ",
            level + 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-white bg-opacity-20 rounded-full h-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-white h-3 rounded-full transition-all duration-500 ease-out",
            style: { width: `${progressPercentage}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-2 text-sm opacity-90", children: `${progressToNextLevel} / 100 точки` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: resetPoints,
          className: "bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm transition-all",
          children: "Нулирай точки (за тестване)"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-6 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-blue-600 mb-2", children: totalTests }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600", children: "Общо тестове" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-6 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-green-600 mb-2", children: totalQuestions }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600", children: "Общо въпроси" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-6 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-purple-600 mb-2", children: totalCorrect }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600", children: "Правилни отговори" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-6 shadow-sm text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-orange-600 mb-2", children: [
          averageScore,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600", children: "Среден резултат" })
      ] })
    ] }),
    results.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-slate-800", children: "Последни резултати" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-200", children: results.slice(0, 10).map((result, index) => {
        var _a, _b;
        const lessonTitle = ((_a = result.lesson) == null ? void 0 : _a.title) || ((_b = result.lesson) == null ? void 0 : _b.name) || "Урок";
        const date = new Date(result.at).toLocaleDateString("bg-BG");
        const percentage = Math.round(result.correct / result.total * 100);
        const points2 = result.correct * 10;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-800", children: lessonTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
              date,
              " · ",
              result.correct,
              "/",
              result.total,
              " правилни"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-bold text-slate-800", children: [
              percentage,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-500", children: [
              "+",
              points2,
              " точки"
            ] })
          ] })
        ] }) }, index);
      }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-12 text-center shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-4", children: "📊" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-slate-800 mb-2", children: "Няма резултати" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600", children: "Направете първия си тест за да видите статистиките тук" })
    ] })
  ] }) });
}
function SimpleTabs({ defaultValue, tabs }) {
  var _a;
  const [val, setVal] = reactExports.useState(defaultValue || tabs[0] && tabs[0].value);
  const handleTabClick = (tabValue) => setVal(tabValue);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 w-full gap-2", children: tabs.map((t) => {
      const handleClick = () => handleTabClick(t.value);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleClick,
          className: `btn ${val === t.value ? "bg-blue-50 border-blue-300" : ""}`,
          children: t.label
        },
        t.value
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4", children: (_a = tabs.find((t) => t.value === val)) == null ? void 0 : _a.content })
  ] });
}
function TestsScreen({ profile, lessons, classes, questions, onStartQuiz }) {
  var _a;
  const [questionCounts, setQuestionCounts] = reactExports.useState({});
  const lessonsByClass = reactExports.useMemo(() => {
    const grouped = {};
    lessons.forEach((lesson) => {
      const classId = normalizeId(lesson.class_id || lesson.classId);
      if (classId) {
        if (!grouped[classId]) grouped[classId] = [];
        grouped[classId].push(lesson);
      }
    });
    return grouped;
  }, [lessons]);
  const classList = reactExports.useMemo(() => {
    return classes.map((c) => {
      const id = normalizeId(c.id) || c.name;
      const name = c.name || c.title || c.id;
      return { id, name };
    });
  }, [classes]);
  const currentClassId = profile == null ? void 0 : profile.classId;
  const currentLessons = lessonsByClass[currentClassId] || [];
  function listQuestionsForLesson(lessonId) {
    const lid = normalizeId(lessonId);
    return questions.filter((q2) => normalizeId(q2.lesson_id || q2.lessonId || q2.lesson) === lid);
  }
  const handleQuestionCountChange = (lessonId, value) => {
    setQuestionCounts((prev) => ({
      ...prev,
      [lessonId]: value === "all" ? null : parseInt(value)
    }));
  };
  const handleStartQuiz2 = (lesson, allQuestions) => {
    const lessonId = lesson.id || lesson.lesson_id;
    const selectedCount = questionCounts[lessonId] || allQuestions.length;
    let limitedQs = allQuestions;
    if (selectedCount < allQuestions.length) {
      const shuffleFunction = () => Math.random() - 0.5;
      const shuffled = [...allQuestions].sort(shuffleFunction);
      limitedQs = shuffled.slice(0, selectedCount);
    }
    onStartQuiz(lesson, limitedQs);
  };
  function renderLessonCard(lesson, isCurrentClass = false) {
    const qs = listQuestionsForLesson(lesson.id);
    const lessonId = normalizeId(lesson.id);
    const currentCount = questionCounts[lessonId] || qs.length;
    const handleStartClick = () => handleStartQuiz2(lesson, qs);
    const handleCountChange = (e) => handleQuestionCountChange(lessonId, parseInt(e.target.value));
    if (!qs.length) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card hover:shadow-md transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-content flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: lesson.title || lesson.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: "Няма въпроси" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-primary", disabled: true, children: "Старт" })
      ] }) }, lessonId);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card hover:shadow-md transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: lesson.title || lesson.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            onClick: handleStartClick,
            disabled: !qs.length,
            children: "Старт"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
          "Въпроси: ",
          currentCount,
          " / ",
          qs.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-600", children: "Брой:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: currentCount,
              onChange: handleCountChange,
              className: "text-xs border border-slate-300 rounded px-2 py-1 bg-white",
              children: qs.length <= 5 ? Array.from({ length: qs.length }, (unused, i) => i + 1).map((count) => {
                return /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: count, children: count }, count);
              }) : (
                // If more than 5 questions, show common options + "All"
                /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: qs.length, children: [
                    "Всички (",
                    qs.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 5, children: "5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 10, children: "10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 15, children: "15" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 20, children: "20" }),
                  qs.length > 25 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 25, children: "25" }),
                  qs.length > 30 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 30, children: "30" })
                ] })
              )
            }
          )
        ] })
      ] })
    ] }) }, lessonId);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleTabs, { defaultValue: "by-lesson", tabs: [
    { value: "by-lesson", label: "По тема / уроци", content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-3", children: `Уроци за ${((_a = classList.find((c) => c.id === currentClassId)) == null ? void 0 : _a.name) || "избрания клас"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: currentLessons.map((l2) => {
        return renderLessonCard(l2, true);
      }) })
    ] }) },
    { value: "by-class", label: "По класове", content: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: classList.map((cls) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-2", children: cls.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: (lessonsByClass[cls.id] || []).map((l2) => {
          return renderLessonCard(l2);
        }) })
      ] }, cls.id);
    }) }) }
  ] }) });
}
function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [localSettings, setLocalSettings] = reactExports.useState(settings);
  if (!isOpen) return null;
  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };
  const handleShowExplanationChange = (e) => setLocalSettings((s) => ({ ...s, showExplanation: e.target.checked }));
  const handleShuffleQuestionsChange = (e) => setLocalSettings((s) => ({ ...s, shuffleQuestions: e.target.checked }));
  const handleShuffleOptionsChange = (e) => setLocalSettings((s) => ({ ...s, shuffleOptions: e.target.checked }));
  const handleInstantNextChange = (e) => setLocalSettings((s) => ({ ...s, instantNext: e.target.checked }));
  const handleInstantDelayChange = (e) => setLocalSettings((s) => ({ ...s, instantDelaySec: Number(e.target.value) }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Настройки" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: localSettings.showExplanation,
            onChange: handleShowExplanationChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Показвай обяснения след отговор" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: localSettings.shuffleQuestions,
            onChange: handleShuffleQuestionsChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Разбърквай въпроси" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: localSettings.shuffleOptions,
            onChange: handleShuffleOptionsChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Разбърквай отговори" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: localSettings.instantNext,
            onChange: handleInstantNextChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Автоматично следващ въпрос" })
      ] }),
      localSettings.instantNext && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Забавяне (секунди):" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "1",
            max: "10",
            value: localSettings.instantDelaySec,
            onChange: handleInstantDelayChange,
            className: "w-16 border rounded px-2 py-1"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn", onClick: onClose, children: "Отказ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            onClick: handleSave,
            children: "Запази"
          }
        )
      ] })
    ] })
  ] }) });
}
async function fetchCSV(url) {
  console.log("fetchCSV called with URL:", url);
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      // Trim whitespace from headers
      complete: (res) => {
        var _a, _b, _c;
        console.log("Papa.parse complete for URL:", url);
        console.log("Result:", res);
        console.log("Data length:", (_a = res.data) == null ? void 0 : _a.length);
        console.log("Errors:", res.errors);
        console.log("Meta:", res.meta);
        console.log("First row:", (_b = res.data) == null ? void 0 : _b[0]);
        console.log("Column names:", (_c = res.meta) == null ? void 0 : _c.fields);
        if (res.errors && res.errors.length > 0) {
          console.error("CSV parsing errors:", res.errors);
          reject(res.errors[0]);
        } else if (!res.data || res.data.length === 0) {
          console.error("CSV returned no data");
          reject(new Error("CSV returned no data"));
        } else {
          resolve(res.data);
        }
      },
      error: (err) => {
        console.error("Papa.parse error for URL:", url, err);
        reject(err);
      }
    });
  });
}
function useSheetsData() {
  const [data, setData] = reactExports.useState({ classes: [], subjects: [], lessons: [], questions: [], theory: [] });
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Starting to fetch theory data from:", SHEETS.theory);
        const [classes, subjects, lessons, questions, theory] = await Promise.all([
          fetchCSV(SHEETS.classes),
          fetchCSV(SHEETS.subjects),
          fetchCSV(SHEETS.lessons),
          fetchCSV(SHEETS.questions),
          fetchCSV(SHEETS.theory)
        ]);
        const transformedTheory = theory.map((item) => {
          const classId = item.class_id ? Number(item.class_id) : void 0;
          const lessonId = item.lesson_id ? String(item.lesson_id) : void 0;
          return {
            id: item.id,
            classId,
            lessonId,
            title: item.title,
            content: item.content,
            image: item.image
          };
        });
        console.log("Theory data loaded:", theory);
        console.log("Transformed theory data:", transformedTheory);
        console.log("Theory data length:", theory == null ? void 0 : theory.length);
        console.log("Theory data type:", typeof theory);
        console.log("Theory data structure:", theory == null ? void 0 : theory[0]);
        console.log("All data keys:", Object.keys({ classes, subjects, lessons, questions, theory }));
        if (!cancelled) setData({ classes, subjects, lessons, questions, theory: transformedTheory });
      } catch (e) {
        if (!cancelled) {
          console.error("Error loading sheets data:", e);
          console.error("Full error object:", e);
          setError((e == null ? void 0 : e.message) || "Грешка при зареждане на данните");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { ...data, loading, error };
}
function MathApp() {
  const { classes, lessons, questions, theory, loading, error } = useSheetsData();
  const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, null);
  const [results, setResults] = useLocalStorage(STORAGE_KEYS.results, []);
  const [route, setRoute] = reactExports.useState("home");
  const [activeQuiz, setActiveQuiz] = reactExports.useState(null);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const [lastQuiz, setLastQuiz] = reactExports.useState(null);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, { showExplanation: true, shuffleQuestions: true, shuffleOptions: true, timeLimitMin: 8, instantNext: false, instantDelaySec: 4 });
  reactExports.useEffect(() => {
    if (!profile && !loading) setRoute("onboarding");
  }, [profile, loading]);
  function handleFinishQuiz(summary) {
    setResults([summary, ...results]);
    setLastQuiz({ lesson: summary.lesson, questions: summary.questions || [] });
    setActiveQuiz(null);
    setRoute("results");
  }
  function handleRetakeTest(lesson, questions2) {
    setActiveQuiz({ lesson, questions: questions2 });
    setRoute("quiz");
  }
  function resetProfile() {
    setProfile(null);
    setRoute("onboarding");
  }
  const handleTheoryStartQuiz = (lesson, questions2) => setActiveQuiz({ lesson, questions: questions2 });
  const handleTestsStartQuiz = (lesson, qs) => setActiveQuiz({ lesson, questions: qs });
  const handleResultsRestart = () => lastQuiz && handleRetakeTest(lastQuiz.lesson, lastQuiz.questions);
  const handleQuizHome = () => setActiveQuiz(null);
  const handleRouteHome = () => setRoute("home");
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleOnboardingDone = (p2) => {
    setProfile(p2);
    setRoute("home");
  };
  const handleReload = () => location.reload();
  const handleCloseSettings = () => setSettingsOpen(false);
  if (route === "onboarding" || !profile) return /* @__PURE__ */ jsxRuntimeExports.jsx(Onboarding, { classes, onDone: handleOnboardingDone });
  if (activeQuiz) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderBar, { title: "Тест", profile, onHome: handleQuizHome, onLogout: resetProfile, onOpenSettings: handleOpenSettings }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Quiz, { lesson: activeQuiz.lesson, questions: activeQuiz.questions, onFinish: handleFinishQuiz, settings })
  ] });
  if (route === "quiz" && activeQuiz) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderBar, { title: "Тест", profile, onHome: handleRouteHome, onLogout: resetProfile, onOpenSettings: handleOpenSettings }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Quiz, { lesson: activeQuiz.lesson, questions: activeQuiz.questions, onFinish: handleFinishQuiz, settings })
  ] });
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-pulse text-2xl font-semibold", children: "Зареждаме данните…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500 mt-2", children: "Google Sheets CSV" })
  ] }) });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold mb-2", children: "Възникна грешка" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600 mb-4", children: String(error) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn", onClick: handleReload, children: "Презареди" })
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderBar, { title: routeTitle(route), profile, onHome: handleRouteHome, onLogout: resetProfile, onOpenSettings: handleOpenSettings }),
    route === "home" && /* @__PURE__ */ jsxRuntimeExports.jsx(HomeScreen, { onGo: setRoute, profile }),
    route === "theory" && /* @__PURE__ */ jsxRuntimeExports.jsx(TheoryScreen, { profile, theory, classes, lessons, questions, onStartQuiz: handleTheoryStartQuiz }),
    route === "tests" && /* @__PURE__ */ jsxRuntimeExports.jsx(TestsScreen, { profile, lessons, classes, questions, onStartQuiz: handleTestsStartQuiz }),
    route === "results" && /* @__PURE__ */ jsxRuntimeExports.jsx(ResultsScreen, { results, classes, lessons, questions, canRestart: !!lastQuiz, onRestart: handleResultsRestart }),
    route === "stats" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsScreen, { results }),
    settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsModal,
      {
        isOpen: settingsOpen,
        onClose: handleCloseSettings,
        settings,
        onSave: setSettings
      }
    )
  ] });
}
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxRuntimeExports.jsx(MathApp, {}));
//# sourceMappingURL=index-DenVxODa.js.map
