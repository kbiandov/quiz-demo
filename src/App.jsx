import React, { useState } from "react";
import QuizDemo from "./QuizDemo";
import StartScreen from "./StartScreen";
import TopicDetail from "./TopicDetail";

export default function App() {
  const [view, setView] = useState("start"); // start | topic | quiz
  const [startParams, setStartParams] = useState(null);

  const goToTopic = (topic) => {
    setStartParams(topic);
    setView("topic");
  };

  const startQuiz = (params) => {
    setStartParams(params);
    setView("quiz");
  };

  const goHome = () => {
    setView("start");
    setStartParams(null);
  };

  return (
    <>
      {view === "start" && <StartScreen onSelectTopic={goToTopic} />}
      {view === "topic" && (
        <TopicDetail
          topic={startParams}
          onBack={goHome}
          onStartQuiz={startQuiz}
        />
      )}
      {view === "quiz" && (
        <QuizDemo
          autoStart
          initialFilters={{
            classId: startParams?.classId,
            lessonName: startParams?.topicName,
            difficulty: startParams?.difficulty,
            questionCount: startParams?.questionCount,
            perQuestionSeconds: startParams?.perQuestionSeconds,
          }}
          onExit={goHome}
        />
      )}
    </>
  );
}
