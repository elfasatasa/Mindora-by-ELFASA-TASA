'use client'

import { useState, useEffect } from "react";

interface IQuestion {
id: number;
question: string;
variants: string[];
correct: string;
}

export default function MobileTest() {
const [started, setStarted] = useState(false);
const [numQuestions, setNumQuestions] = useState(20);
const [timeMinutes, setTimeMinutes] = useState(10);

const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState<Record<number, string>>({});
const [timeLeft, setTimeLeft] = useState(0);

const questions: IQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
id: i + 1,
question: `Question ${i + 1}?`,
variants: ["Option A", "Option B", "Option C", "Option D"],
correct: "Option A"
}));

const totalQuestions = questions.length;
const question = questions[currentQuestion];

// Таймер
useEffect(() => {
if (!started) return;
const interval = setInterval(() => {
setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
}, 1000);
return () => clearInterval(interval);
}, [started]);

const formatTime = (sec: number) => {
const m = Math.floor(sec / 60).toString().padStart(2, "0");
const s = (sec % 60).toString().padStart(2, "0");
return `${m}:${s}`;
};

const handleSelect = (option: string) => {
setAnswers(prev => ({ ...prev, [question.id]: option }));
};

const handlePrev = () => setCurrentQuestion(prev => Math.max(prev - 1, 0));
const handleNext = () => setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions - 1));

const handleStart = () => {
setTimeLeft(timeMinutes * 60);
setCurrentQuestion(0);
setAnswers({});
setStarted(true);
};

if (!started) {
// Экран настройки перед началом теста
return (
<div style={{  }}>
<h1 style={{ marginBottom: 24 }}>ID : d5671625-e200-4b3e-842a-3942111a7f4c</h1>

    <label style={{ marginBottom: 12 }}>
      Number of Questions: &nbsp;
      <input type="number" value={numQuestions} min={1} max={50} onChange={e => setNumQuestions(Number(e.target.value))} style={{ marginLeft: 8, padding: 4, width: 60 }} />
    </label>
    <br />
    <br />

    <div style={{ marginBottom: 24 }}>
      Timer (minutes): &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <input type="number" value={timeMinutes} min={1} max={120} onChange={e => setTimeMinutes(Number(e.target.value))} style={{ marginLeft: 8, padding: 4, width: 60 }} />
    </div>

    <button onClick={handleStart} style={{  fontSize: 16,  border: "none", borderRadius: 8, cursor: "pointer" }}>
      Start
    </button>
  </div>
);

}

// Экран теста
return (
<div style={{ backgroundColor: "#000", minHeight: "100vh", padding: 16, color: "#fff", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
{/* Таймер */}
<div style={{ textAlign: "center", marginBottom: 16, fontSize: 18 }}>
Time left: {formatTime(timeLeft)} </div>


  {/* Вопрос */}
  <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "" }}>
    <div style={{ fontSize: 20, marginBottom: 0 }}>
      {question.id}. {question.question}
    </div>
    <br />
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {question.variants.map(v => (
        <button
          key={v}
          onClick={() => handleSelect(v)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #fff",
            backgroundColor: "transparent",
            color: answers[question.id] === v ? "#4caf50" : "#fff",
            fontSize: 16,
            textAlign: "left",
            cursor: "pointer"
          }}
        >
          {v}
        </button>
      ))}
    </div>
  </div>

  {/* Пагинация */}
  <div style={{ display: "flex", justifyContent: "space-between"}}>
    <button
      onClick={handlePrev}
      disabled={currentQuestion === 0}
      style={{
        padding: "10px 20px",
   
        backgroundColor: "transparent",
        color: currentQuestion === 0 ? "#555" : "#fff",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Back
    </button>

    <span style={{ alignSelf: "center" }}>Question {currentQuestion + 1} / {totalQuestions}</span>

    <button
      onClick={handleNext}
      disabled={currentQuestion === totalQuestions - 1}
      style={{
        padding: "10px 20px",
        
        backgroundColor: "transparent",
        color: currentQuestion === totalQuestions - 1 ? "#555" : "#fff",
        fontWeight: "bold",
        cursor: "pointer"
      }}
    >
      Next
    </button>
  </div>
  <br />
  <br />
  <b>
    <br />
  </b>
</div>


);
}
