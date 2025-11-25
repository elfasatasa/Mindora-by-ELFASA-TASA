"use client";

import ChangeStatus from "@/components/Edit/ChangeStatus/ChangeStatus";
import CorsQuestions from "@/components/Edit/CorsQuestions/CorsQuestions";
import { ITest } from "@/types/tests";
import { use, useEffect, useState } from "react";

import styles from "./Test.module.scss"

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {

  // Получаем test_id через use()
  const [state,setState] = useState<boolean>(true)
  const { id: test_id } = use(params);

  const [test, setTest] = useState<ITest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const res = await fetch("/api/tests/get-selected-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test_id }),
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Error loading test");
        } else {
          setTest(data.data);
        }
      } catch  {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [test_id]);

  if (loading) return <div>Loading test...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!test) return <div>Test not found</div>;

  
  return (
    <div className={styles.container}>
   
      <div style={{display:"flex",justifyContent:"space-between"}}><p> <b>Name : </b> {test.test_name}</p>
      <p><b>Status :</b> {test.status}</p></div>

 <div style={{display:"flex",justifyContent:"space-between"}}>
      <p><b>Quantity questions : {test.questions.length}</b></p>
 <p><b>Expire :</b> {test.expire}</p>
      </div>

            <br />
          <div style={{display:"flex",justifyContent:"space-between",marginBottom: 10}}>  <button onClick={() => setState(false)}>Revise Status</button>
            <button onClick={() => setState(true)}>Rescript Questions</button></div>
     {
      state ? <CorsQuestions /> : <ChangeStatus test_id={test_id}/>
     }


    </div>
  );
}
