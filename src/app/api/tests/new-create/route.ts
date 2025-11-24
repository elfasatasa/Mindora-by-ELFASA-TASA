import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { test_name, email } = await req.json();

    if (!test_name || !email) {
      return NextResponse.json({
        data: {
          success: false,
          message: "Missing fields"
        }
      });
    }

    const test_id = randomUUID();
    const status = "draft";

    // 1. Найти пользователя
    const userResult = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if (userResult.length === 0) {
      return NextResponse.json({
        data: {
          success: false,
          message: "User not found"
        }
      });
    }

    const user = userResult[0];

    if (user.draft <= 0) {
      return NextResponse.json({
        data: {
          success: false,
          message: "You have no draft tests left"
        }
      });
    }

    // 2. Создать тест
    await sql`
      INSERT INTO tests (
        test_id, test_name, user_email, status, expire, questions
      ) VALUES (
        ${test_id}, ${test_name}, ${email}, ${status}, 'never', '[]'::jsonb
      );
    `;

    // 3. Обновить юзера
    const updatedUserTests = [
      ...user.user_tests,
      { test_id, test_name }
    ];

    await sql`
      UPDATE users
      SET 
        draft = draft - 1,
        user_tests = ${JSON.stringify(updatedUserTests)}::jsonb
      WHERE email = ${email};
    `;

    return NextResponse.json({
      data: {
        success: true,
        message: "Test created successfully",
        test_id
      }
    });

  } catch  {
    console.error("Create test error:");
    return NextResponse.json({
      data: {
        success: false,
        message: "Server error"
      }
    });
  }
}
