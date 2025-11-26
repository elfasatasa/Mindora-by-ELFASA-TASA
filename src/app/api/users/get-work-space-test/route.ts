import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";
import { ITest, IQuestions } from "@/types/tests";

export async function POST(req: Request) {
  try {
    const { email }: { email?: string } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Получаем все тесты пользователя по email
    const rows = await sql`
      SELECT *, COALESCE(questions, '[]'::json) AS questions
      FROM tests
      WHERE user_email = ${email};
    `;

    // Явно приводим к ITest[]
    const user_tests: ITest[] = (rows as any[]).map(r => ({
      id: r.id,
      test_id: r.test_id,
      test_name: r.test_name,
      user_email: r.user_email,
      status: r.status,
      expire: r.expire,
      user_connection: r.user_connection ?? undefined,
      password: r.password ?? undefined,
      questions: r.questions as IQuestions[]
    }));

    return NextResponse.json({ data: user_tests });
  } catch  {
    console.error("Error fetching user tests:");
    return NextResponse.json(
    
      { status: 500 }
    );
  }
}
