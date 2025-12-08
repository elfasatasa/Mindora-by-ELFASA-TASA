import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await sql`
      SELECT user_tests 
      FROM users
      WHERE email = ${email}
    `;

    if (!user.length) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const tests = user[0].user_tests; // <-- уже массив IUserTest

    // Возвращаем как массив
    return NextResponse.json({
        data:tests
    });

  } catch {
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
