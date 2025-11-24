// app/api/init-tests/route.ts
import { sql } from "@/lib/neon";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tests (
        id SERIAL PRIMARY KEY,
        test_id TEXT UNIQUE NOT NULL,
        test_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        status TEXT NOT NULL,
        expire TEXT NOT NULL,
        user_connection INTEGER,
        password TEXT[],
        questions JSONB NOT NULL
      );
    `;

    return Response.json({data : {
      success: true,
      message: "✅ Table 'tests' created or already exists."
    }});

  } catch  {
    console.error("DB Init Error:");
    return Response.json({
      success: false,
      message: "❌ Error creating table"
    });
  }
}
