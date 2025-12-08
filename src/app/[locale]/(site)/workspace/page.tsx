'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import $api from "@/hooks/api";

interface IUserTest {
  test_id: string;
  test_name: string;
}

export default function WorkspacePage() {

  const { data: session } = useSession();

  const [myTests, setMyTests] = useState<IUserTest[]>([]);
  const [favoriteTests, setFavoriteTests] = useState<IUserTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    async function load() {
      try {
        const body = { email: session?.user.email };

        const my = await $api.post("/tests/my", body);
        const fav = await $api.post("/tests/favorites", body);

        setMyTests(my.data);
        setFavoriteTests(fav.data);
      } 
      finally {
        setLoading(false);
      }
    }

    load();
  }, [session]);

  if (!session) return <div>You are not authenticated.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>

      {/* My Tests */}
      <h3 style={{fontWeight:700}}>Your Tests</h3>
      <br />
      {myTests.length === 0 && <div>No tests yet.</div>}
      {myTests.map(test => (
        <div key={test.test_id} style={{ display:"flex", justifyContent:"space-between" ,marginBottom:"10px" }}>
          {test.test_name}
          <Link href={`/workspace/${test.test_id}`}>
            <button>Open</button>
          </Link>
        </div>
      ))}
<br />
      <hr style={{ margin: "20px auto" ,width:"80%",display:"flex", justifyContent:"center"}}   />
<br />
      {/* Favourite */}
      <h3 style={{fontWeight:700}}>Favorite Tests</h3>
      <br />
      {favoriteTests.length === 0 && <div>No favourite tests yet.</div>}
      {favoriteTests.map(test => (
        <div key={test.test_id} style={{ display:"flex", justifyContent:"space-between" ,marginBottom:"10px" }}>
          {test.test_name}
          <Link href={`/workspace/${test.test_id}`}>
            <button>Open</button>
          </Link>
        </div>
      ))}

    </div>
  );
}
