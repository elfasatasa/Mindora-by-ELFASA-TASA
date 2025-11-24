import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        data: {
          success: false,
          message: "Email is required"
        }
      });
    }

    // Получаем все тесты пользователя с полными данными
    const tests = await sql`
      SELECT *
      FROM tests
      WHERE user_email = ${email}
      ORDER BY id DESC;
    `;

    return NextResponse.json({
      data: {
        success: true,
        tests
      }
    });

  } catch  {
  
    return NextResponse.json({
      data: {
        success: false,
        message: "Server error"
      }
    });
  }
}
