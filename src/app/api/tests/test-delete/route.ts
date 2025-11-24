import { sql } from "@/lib/neon";
import { ITest } from "@/types/tests";
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

    // 1️⃣ Проверяем что тест принадлежит пользователю
    const testResultRaw = await sql`
      SELECT * FROM tests 
      WHERE test_id = ${test_id} AND user_email = ${email};
    `;
    const testResult = testResultRaw as ITest[];

    if (testResult.length === 0) {
      return NextResponse.json({
        data: {
          success: false,
          message: "Test not found for this user"
        }
      });
    }

    // 2️⃣ Удаляем тест из таблицы tests
    await sql`
      DELETE FROM tests WHERE test_id = ${test_id};
    `;

    // 3️⃣ Получаем пользователя
    const userResultRaw = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;
    const userResult = userResultRaw as { draft: number; user_tests: ITest[] }[];
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({
        data: {
          success: false,
          message: "User not found"
        }
      });
    }

    // 4️⃣ Убираем тест из user_tests
    const updatedUserTests = user.user_tests.filter(
      (t: ITest) => t.test_id !== test_id
    );

    // 5️⃣ Увеличиваем draft на 1
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

  } catch (err) {
    console.error("Delete test error:", err);
    return NextResponse.json({
      data: {
        success: false,
        message: "Server error"
      }
    });
  }
}
