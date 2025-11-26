import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";

interface IQuestion {
id: number;
question: string;
variants: string[];
correct: string;
}

interface RequestBody {
test_id: string;
questions: IQuestion[];
}

export async function POST(req: Request) {
try {
const { test_id, questions }: RequestBody = await req.json();


if (!test_id) {
  return NextResponse.json({ success: false, message: "test_id is required" }, { status: 400 });
}

if (!Array.isArray(questions)) {
  return NextResponse.json({ success: false, message: "questions must be an array" }, { status: 400 });
}

// Проверка валидности
if (questions.some(q => !q.question || !Array.isArray(q.variants) || !q.correct || q.variants.some(v => v == null))) {
  return NextResponse.json({ success: false, message: "Invalid question format" }, { status: 400 });
}

// Обновляем колонку questions с явным преобразованием в jsonb
const result = await sql`
  UPDATE tests
  SET questions = ${JSON.stringify(questions)}::jsonb
  WHERE test_id = ${test_id}
  RETURNING test_id;
`;

if (result.length === 0) {
  return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
}

return NextResponse.json({ success: true, message: "Questions updated successfully" });


} catch (err) {
console.error("Update questions error:", err);
return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
}
}
