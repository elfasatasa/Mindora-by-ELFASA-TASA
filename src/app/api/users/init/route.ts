import { sql } from "@/lib/neon";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        draft INTEGER DEFAULT 4,
        local INTEGER DEFAULT 4,
        public INTEGER DEFAULT 0,
        private INTEGER DEFAULT 0,
        expire INTEGER DEFAULT 0,
        users_connect INTEGER DEFAULT 0,
        user_tests JSONB DEFAULT '[]',
      user_favourite_tests TEXT[] DEFAULT '{}' NOT NULL
      );
    `;
    return Response.json({ success: true, message: "users table ready" });
  } catch  {
    console.error("Error creating users table:");
    return Response.json({ success: false }, { status: 500 });
  }
}
