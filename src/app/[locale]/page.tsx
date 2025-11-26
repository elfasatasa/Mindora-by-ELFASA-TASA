'use client'

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
const { data: session } = useSession();
const [testId, setTestId] = useState("");
const [test, setTest] = useState<any>(null);
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [favMessage, setFavMessage] = useState<string | null>(null);
const [favLoading, setFavLoading] = useState(false);

const handleSearch = async () => {
if (!testId.trim()) return;
setLoading(true);
setError(null);
setTest(null);
setFavMessage(null);


try {
  const res = await fetch("/api/tests/get-test-with-test-id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test_id: testId, user_email: session?.user?.email }),
  });
  const data = await res.json();

  if (data.success) {
    setTest(data.test);
  } else {
    setError(data.message || "Test not found");
  }
} catch  {
  
  setError("Server error");
} finally {
  setLoading(false);
}


};

const handleAddFavourite = async () => {
if (!test || !session?.user?.email) return;
setFavMessage(null);


if (test.status === "local") {
  setFavMessage("Тест не активный");
  return;
}

setFavLoading(true);
try {
  const res = await fetch("/api/users/add-favourite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test_id: test.test_id, user_email: session.user.email }),
  });
  const data = await res.json();
  setFavMessage(data.message);
} catch {
 
  setFavMessage("Ошибка сервера");
} finally {
  setFavLoading(false);
  window.location.reload(); 
}


};

return (
<div style={{ maxWidth: 576, margin: "0 auto" }}>
<div style={{ display: "flex", gap: 8 }}>
<input
type="text"
placeholder="Enter test_id"
value={testId}
onChange={(e) => setTestId(e.target.value)}
/> <button onClick={handleSearch} disabled={loading}>
{loading ? "Searching..." : "Search"} </button> </div>

  {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

  {test && (
    <div style={{ marginTop: 20, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>{test.test_name}</h3>
      <p><strong>Test Name:</strong> {test.test_name}</p>
      <p><strong>User Email:</strong> {test.user_email}</p>
      <p><strong>Expire:</strong> {test.expire}</p>

      <button onClick={handleAddFavourite} disabled={favLoading} style={{ marginTop: 10 }}>
        {favLoading ? "Adding..." : "Add favourite"}
      </button>
      {favMessage && (
        <div style={{ marginTop: 8, color: test.status === "local" ? "red" : "green" }}>
          {favMessage}
        </div>
      )}
    </div>
  )}
</div>


);
}
