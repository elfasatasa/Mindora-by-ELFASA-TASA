import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

 
    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

 
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if (existingUser.length > 0) {
     
      return NextResponse.json({
        success: true,
        message: "User already exists",
        user: existingUser[0],
      });
    }


    const newUser = await sql`
      INSERT INTO users (name, email)
      VALUES (${name}, ${email})
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "New user created",
      user: newUser[0],
    });
  } catch (error) {
    console.error("POST /users/new-or-old-check error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
