"use client";

import React, { useEffect, useState } from "react";
import $api from "@/hooks/api";
import { IQuestions } from "@/types/tests";

interface CorsQuestionsProps {
  questions: IQuestions[];
  test_id: string;
  onSaved?: (questions: IQuestions[]) => void;
}

function makeEmptyQuestion(nextId: number): IQuestions {
  return {
    id: nextId,
    question: "",
    variants: ["", "", "", ""],
    correct: ""
  };
}

export default function CorsQuestions({ questions: initialQuestions = [], test_id, onSaved }: CorsQuestionsProps) {
  const [mode, setMode] = useState<"list" | "edit" | "add" | "select">("list");
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const copy = (initialQuestions || []).map(q => ({ ...q, variants: [...q.variants] }));
    renumberIds(copy);
    setQuestions(copy);
  }, [initialQuestions]);

  const renumberIds = (arr: IQuestions[]) => {
    for (let i = 0; i < arr.length; i++) arr[i].id = i + 1;
  };

  const validateQuestions = (arr: IQuestions[]) => {
    if (!Array.isArray(arr)) return "Questions must be an array";
    if (arr.length === 0) return null;
    for (let i = 0; i < arr.length; i++) {
      const q = arr[i];
      if (!q.question?.trim()) return `Question #${i + 1}: text is empty`;
      if (!Array.isArray(q.variants)) return `Question #${i + 1}: variants must be an array`;
      if (q.variants.length < 4) return `Question #${i + 1}: need at least 4 variants`;
      if (q.variants.length > 7) return `Question #${i + 1}: max 7 variants allowed`;
    for (const v of q.variants) if (!v?.trim()) return `Question #${i + 1}: all variants must be non-empty`;

      if (!q.correct?.trim()) return `Question #${i + 1}: correct answer is empty`;
      const matchCount = q.variants.filter(v => v === q.correct).length;
      if (matchCount === 0) return `Question #${i + 1}: correct answer must match one of the variants`;
      if (matchCount > 1) return `Question #${i + 1}: correct matches multiple variants (make variants unique)`;
    }
    return null;
  };

  const openEdit = (index: number) => { 
    setSelectedIndex(index); 
    setMode("edit"); 
    setError(null); 
  };
  
  const saveEditedQuestion = (index: number, updated: IQuestions) => {
    const copy = [...questions]; 
    copy[index] = { ...updated, variants: [...updated.variants] };
    renumberIds(copy); 
    setQuestions(copy); 
    setMode("list"); 
    setSelectedIndex(null);
  };
  
  const deleteQuestion = (index: number) => {
    if (!confirm("Delete this question?")) return;
    const copy = [...questions]; 
    copy.splice(index, 1); 
    renumberIds(copy); 
    setQuestions(copy); 
    setMode("list"); 
    setSelectedIndex(null);
  };
  
  const addQuestion = (q: IQuestions) => { 
    const copy = [...questions, { ...q, variants: [...q.variants] }]; 
    renumberIds(copy); 
    setQuestions(copy); 
    setMode("list"); 
  };

  const handleSaveAll = async () => {
    setError(null);
    const vErr = validateQuestions(questions);
    if (vErr) { setError(vErr); return; }
    setSaving(true);
    try {
      const res = await $api.post("tests/update-questions", { test_id, questions });
      if (res.data?.success) { alert("Questions saved"); onSaved?.(questions); }
      else { setError(res.data?.message || "Server error"); }
    } catch { setError("Server error"); } finally { setSaving(false); }
  };

  function EditForm({ idx, q, onCancel, onSave }: { idx: number; q: IQuestions; onCancel: () => void; onSave: (q: IQuestions) => void; }) {
    const [localQ, setLocalQ] = useState<IQuestions>({ ...q, variants: [...q.variants] });
    useEffect(() => setLocalQ({ ...q, variants: [...q.variants] }), [q]);

    const updateVariant = (i: number, value: string) => { 
      const copy = [...localQ.variants]; 
      copy[i] = value; 
      setLocalQ({ ...localQ, variants: copy }); 
    };
    
    const addVariant = () => { 
      if (localQ.variants.length >= 7) return; 
      setLocalQ({ ...localQ, variants: [...localQ.variants, ""] }); 
    };
    
    const removeVariant = (i: number) => {
      if (localQ.variants.length <= 4) return alert("Minimum 4 variants"); 
      const copy = [...localQ.variants]; 
      copy.splice(i, 1);
      const newCorrect = copy.includes(localQ.correct) ? localQ.correct : "";
      setLocalQ({ ...localQ, variants: copy, correct: newCorrect });
    };
    
    const trySave = () => { 
      const vErr = validateQuestions([localQ]); 
      if (vErr) return alert(vErr); 
      onSave(localQ); 
    };

    return (
      <div style={{ padding: 10 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Question</label>
          <textarea value={localQ.question} onChange={(e) => setLocalQ({ ...localQ, question: e.target.value })} style={{ width: "100%", padding: 8, minHeight: 64, borderRadius: 6 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Answers</label>
          {localQ.variants.map((v, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input value={v} onChange={(e) => updateVariant(i, e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6 }} />
              <button onClick={() => removeVariant(i)}>Del</button>
            </div>
          ))}
          <button onClick={addVariant} disabled={localQ.variants.length >= 7}>Add answer</button>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Correct Answer</label>
          <input value={localQ.correct} onChange={(e) => setLocalQ({ ...localQ, correct: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6 }} placeholder="Enter correct answer exactly" />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={trySave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => { if (confirm("Delete question?")) deleteQuestion(idx); }} style={{ marginLeft: "auto", color: "red" }}>Delete question</button>
        </div>
      </div>
    );
  }

  function AddForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (q: IQuestions) => void; }) {
    const nextId = questions.length + 1;
    const [localQ, setLocalQ] = useState<IQuestions>(makeEmptyQuestion(nextId));
    
    const updateVariant = (i: number, value: string) => { 
      const copy = [...localQ.variants]; 
      copy[i] = value; 
      setLocalQ({ ...localQ, variants: copy }); 
    };
    
    const addVariant = () => { 
      if (localQ.variants.length >= 7) return; 
      setLocalQ({ ...localQ, variants: [...localQ.variants, ""] }); 
    };
    
    const removeVariant = (i: number) => { 
      if (localQ.variants.length <= 4) return alert("Minimum 4 variants required"); 
      const copy = [...localQ.variants]; 
      copy.splice(i, 1); 
      const newCorrect = copy.includes(localQ.correct) ? localQ.correct : ""; 
      setLocalQ({ ...localQ, variants: copy, correct: newCorrect }); 
    };
    
    const tryAdd = () => { 
      const vErr = validateQuestions([localQ]); 
      if (vErr) return alert(vErr); 
      onAdd(localQ); 
    };

    console.log(questions)
    return (
      <div style={{ padding: 10 }}>
        <div style={{ marginBottom: 8 }}>
          <label>Question</label>
          <textarea value={localQ.question} onChange={(e) => setLocalQ({ ...localQ, question: e.target.value })} style={{ width: "100%", padding: 8, minHeight: 64, borderRadius: 6 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Answers</label>
          {localQ.variants.map((v, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input value={v} onChange={(e) => updateVariant(i, e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6 }} />
              <button onClick={() => removeVariant(i)}>Del</button>
            </div>
          ))}
          <button onClick={addVariant} disabled={localQ.variants.length >= 7}>Add answer</button>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Correct Answer</label>
          <input value={localQ.correct} onChange={(e) => setLocalQ({ ...localQ, correct: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6 }} placeholder="Enter correct answer exactly" />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={tryAdd}>Add question</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 576, margin: "0 auto", padding: 10 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => { setMode("select"); setError(null); }}>Edit Question</button>
        <button onClick={() => { setMode("add"); setError(null); }}>Add Question</button>
        <div style={{ marginLeft: "auto" }}> 
          <button onClick={handleSaveAll} disabled={saving}>{saving ? "Saving..." : "Save all"}</button> 
        </div> 
      </div>

      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      {mode === "list" && (
        <>
          {questions.length === 0 ? <div>No questions yet</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd",  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{i + 1}. {q.question}</div>
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                        {q.variants.map((v, idx) => (
                          <div key={idx} style={{ fontSize: 14, padding: 6, borderRadius: 6, border: "1px solid #eee",  }}>{v}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === "select" && (
        <div>
          <h3>Select a question to edit:</h3>
          {questions.length === 0 ? (
            <div>No questions yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, i) => (
                <div 
                  key={q.id} 
                  style={{ 
                    padding: 10, 
                    borderRadius: 8, 
                    border: "1px solid #ddd", 
                  
                    cursor: "pointer"
                  }}
                  onClick={() => openEdit(i)}
                >
                  <div style={{ fontWeight: 600 }}>{i + 1}. {q.question}</div>
                  <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                    {q.variants.map((v, idx) => (
                      <div key={idx} style={{ fontSize: 14, padding: 6, borderRadius: 6, border: "1px solid #eee",  }}>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setMode("list")}>Back to List</button>
          </div>
        </div>
      )}

      {mode === "edit" && selectedIndex !== null && selectedIndex >= 0 && selectedIndex < questions.length && (
        <EditForm 
          idx={selectedIndex} 
          q={questions[selectedIndex]} 
          onCancel={() => { setMode("select"); setSelectedIndex(null); }} 
          onSave={(q) => saveEditedQuestion(selectedIndex, q)} 
        />
      )}

      {mode === "add" && (
        <AddForm onCancel={() => setMode("list")} onAdd={(q) => addQuestion(q)} />
      )}
      <br />
      <br />
      <br />
    </div>
  );
}