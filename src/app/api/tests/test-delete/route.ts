import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { test_id, email } = await req.json();

    if (!test_id || !email) {
      return NextResponse.json({
        data: {
          success: false,
          message: "Missing fields"
        }
      });
    }

    // 1️⃣ Проверяем что тест принадлежит юзеру
    const testResult = await sql`
      SELECT * FROM tests 
      WHERE test_id = ${test_id} AND user_email = ${email};
    `;

    if (testResult.length === 0) {
      return NextResponse.json({
        data: {
          success: false,
          message: "Test not found"
        }
      });
    }

    // 2️⃣ Удаляем тест
    await sql`
      DELETE FROM tests WHERE test_id = ${test_id};
    `;

    // 3️⃣ Получаем юзера
    const userResult = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    const user = userResult[0];

    // 4️⃣ Обновляем user_tests (убираем удалённый тест)
    const updatedUserTests = user.user_tests.filter(
      (t: any) => t.test_id !== test_id
    );

    // 5️⃣ Возвращаем draft +1
    await sql`
      UPDATE users
      SET 
        draft = draft + 1,
        user_tests = ${JSON.stringify(updatedUserTests)}::jsonb
      WHERE email = ${email};
    `;

    return NextResponse.json({
      data: {
        success: true,
        message: "Test deleted successfully"
      }
    });

  } catch  {
    console.error("Delete test error:");
    return NextResponse.json({
      data: {
        success: false,
        message: "Server error"
      }
    });
  }
}
