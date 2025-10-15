import { sql } from "@/lib/neon";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return Response.json({ error: "Missing name or email" }, { status: 400 });
    }



    await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      ON CONFLICT (email) DO NOTHING;
    `;

    return Response.json({ success: true }, { status: 200 });
  } catch  {
    console.error("POST /users error:");
    return Response.json({ success: false }, { status: 500 });
  }
}
