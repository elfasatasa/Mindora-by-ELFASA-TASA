import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";
import { IUser } from "@/types/users";
import { ITest } from "@/types/tests";

interface Body {
  test_id: string;
  status: "local" | "public";
  email: string;
}

// простая функция для expire в формате DD.MM.YYYY
function getExpireString(days: number) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  const d = String(today.getDate()).padStart(2, "0");
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const y = today.getFullYear();
  return `${d}.${m}.${y}`;
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { test_id, status, email } = body;

    if (!test_id || !status || !email) {
      return NextResponse.json({
        success: false,
        message: "test_id, status, and email are required",
      });
    }

    const allowed = ["local", "public"];
    if (!allowed.includes(status)) {
      return NextResponse.json({
        success: false,
        message: "Invalid status",
      });
    }

    // 1️⃣ Найти тест
    const testResult = await sql`
      SELECT id, test_id, user_email, status, expire
      FROM tests
      WHERE test_id = ${test_id}
    ` as ITest[];

    if (testResult.length === 0) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }

    const test = testResult[0];

    if (test.user_email !== email) {
      return NextResponse.json({
        success: false,
        message: "This test does not belong to this user",
      });
    }

    // 2️⃣ Обновить статус теста и expire (30 дней)
    const expireStr = getExpireString(30);
    await sql`
      UPDATE tests
      SET status = ${status},
          expire = ${expireStr}
      WHERE test_id = ${test_id}
    `;

    // 3️⃣ Найти пользователя
    const userResult = await sql`
      SELECT id, email, local, public
      FROM users
      WHERE email = ${email}
    ` as IUser[];

    if (userResult.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const user = userResult[0];

    // 4️⃣ Уменьшить количество local/public у пользователя
    if (status === "local") {
      await sql`
        UPDATE users
        SET local = ${user.local - 1}
        WHERE email = ${email}
      `;
    } else {
      await sql`
        UPDATE users
        SET public = ${user.public - 1}
        WHERE email = ${email}
      `;
    }

    return NextResponse.json({
      success: true,
      message: "Status updated",
      expire: expireStr,
    });

  } catch  {
    
    return NextResponse.json({
      success: false,
      message: "seccues",
    });
  }
}
