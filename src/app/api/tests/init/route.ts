import { sql } from "@/lib/neon";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
     
      );
    `;
    return Response.json({ success: true, message: "tests table ready" });
  } catch  {
    return Response.json( "smth is error");
  }
}
