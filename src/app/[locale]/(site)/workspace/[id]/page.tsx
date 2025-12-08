"use client";

import { use, useEffect, useState } from "react";
import $api from "@/hooks/api";
import type { ITest, IQuestions } from "@/types/tests";

type ShuffledQuestion = IQuestions & {
  shuffledVariants: string[];
  correctIndex: number;
  selected?: number | null;
  isCorrect?: boolean;
};

function shuffleArray<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [test, setTest] = useState<ITest | null>(null);
  const [loading, setLoading] = useState(true);

  const [minCount, setMinCount] = useState<number>(1);
  const [maxCount, setMaxCount] = useState<number>(1);

  const [questionsRun, setQuestionsRun] = useState<ShuffledQuestion[] | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerShown, setAnswerShown] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await $api.post("/tests/one", { id });
        setTest(res.data);
        const total = res.data?.questions?.length ?? 0;
        setMinCount(1);
        setMaxCount(Math.min(10, total));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params, id]);

  if (loading) return <div>Loading test...</div>;
  if (!test) return <div>Test not found</div>;

  const totalQuestions = test.questions?.length ?? 0;

  function resolveCorrectText(q: IQuestions) {
    const c = q.correct;
    if (typeof c === "string" && /^[0-9]+$/.test(c)) {
      const idx = parseInt(c, 10) - 1;
      if (idx >= 0 && idx < q.variants.length) return q.variants[idx];
    }
    return c;
  }

  function startTest() {
    const count = Math.min(maxCount, totalQuestions);

    const shuffled = shuffleArray(test?.questions || []).slice(0, count);

    const prepared: ShuffledQuestion[] = shuffled.map((q) => {
      const correctText = resolveCorrectText(q);
      const shuffledVariants = shuffleArray(q.variants);
      let correctIndex = shuffledVariants.findIndex((v) => v === correctText);
      if (correctIndex === -1) correctIndex = 0;
      return { ...q, shuffledVariants, correctIndex, selected: null, isCorrect: false };
    });

    setQuestionsRun(prepared);
    setCurrentIdx(0);
    setAnswerShown(false);
    setScore(0);
  }

  function selectOption(idx: number) {
    if (!questionsRun) return;
    const q = questionsRun[currentIdx];
    if (q.selected !== null) return;

    const correct = idx === q.correctIndex;
    if (correct) setScore((s) => s + 1);

    const updated = [...questionsRun];
    updated[currentIdx] = { ...q, selected: idx, isCorrect: correct };
    setQuestionsRun(updated);
  }

  function exitTest() {
    setQuestionsRun(null);
    setAnswerShown(false);
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={exitTest} style={{ padding: "5px 10px" }}>Reset</button>
        <h2>{test?.test_name}</h2>
        {questionsRun && <strong>Score: {score}</strong>}
      </div>

   {!questionsRun && (
  <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginTop: 16 }}>
    <span>Questions Count {test.questions?.length ?? 0}</span>
    <br />
    <br />
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <input
        type="number"
        style={{ width: 70, marginRight: 8 }}
        value={minCount}
        onChange={(e) => setMinCount(Number(e.target.value))}
      />
      <span>Min</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <input
        type="number"
        style={{ width: 70, marginRight: 8 }}
        value={maxCount}
        onChange={(e) => setMaxCount(Number(e.target.value))}
      />
      <span>Max</span>
    </div>
    <button onClick={startTest} style={{ marginTop: 10 }}>Start Test</button>
  </div>
)}


      {questionsRun && (
        <div>
          <br />
          <h4>Question {currentIdx + 1} / {questionsRun.length}</h4>
<br />
          <div style={{  }}>
            <p style={{ fontWeight: 600 }}>{questionsRun[currentIdx].question}</p>
            <br />
            {questionsRun[currentIdx].shuffledVariants.map((v, idx) => {
              const q = questionsRun[currentIdx];

              const isSelected = q.selected === idx;
              const isCorrect = idx === q.correctIndex;

              let background = "#f5f5f5";
              let border = "1px solid #dcdcdc";

              if (!answerShown && isSelected) {
                background = "#dcdcdc"; // выбранный — серый до show answer
              }

              if (answerShown) {
                if (isCorrect) {
                  background = "#c6f9c6"; // правильный — зелёный
                  border = "1px solid green";
                } else if (isSelected && !isCorrect) {
                  background = "#ffd1d1"; // выбранный неправильный — красный
                  border = "1px solid red";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={q.selected !== null}
                  onClick={() => selectOption(idx)}
                  style={{
                    width: "100%",
                    marginBottom: 6,
                    textAlign: "left",
                    padding: 8,
                    background,
                    border,
                    borderRadius: 6,
                    cursor: q.selected !== null ? "not-allowed" : "pointer",
                  }}
                >
                  <b>{String.fromCharCode(65 + idx)}.</b> {v}
                </button>
              );
            })}

            <button
              onClick={() => setAnswerShown((prev) => !prev)}
              style={{ marginTop: 10, padding: "6px 14px" }}
            >
              {answerShown ? "Hide answer" : "Show answer"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <button
              disabled={currentIdx === 0}
              onClick={() => { setCurrentIdx(i => i - 1); setAnswerShown(false); }}
            >
              {"<"}
            </button>
            <button
              disabled={currentIdx === questionsRun.length - 1}
              onClick={() => { setCurrentIdx(i => i + 1); setAnswerShown(false); }}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
