import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" });
    }

    // Получаем список избранных ID
    const user = await sql`
      SELECT user_favourite_tests
      FROM users
      WHERE email = ${email}
    `;

    if (!user.length) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const ids: string[] = user[0].user_favourite_tests;

    if (!ids || ids.length === 0) {
      return NextResponse.json({ data: [] }); // возвращаем пустой
    }

    // Получаем test_name + test_id из таблицы tests
    const favorites = await sql`
      SELECT test_id, test_name
      FROM tests
      WHERE test_id = ANY(${ids})
    `;

    return NextResponse.json({
      data: favorites
    });

  } catch {
    return NextResponse.json({
      success: false,
      message: "Server error"
    });
  }
}
