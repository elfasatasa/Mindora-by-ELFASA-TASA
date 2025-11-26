import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { test_id, user_email } = await req.json();


if (!test_id) {
  return NextResponse.json({ success: false, message: "test_id is required" }, { status: 400 });
}

if (!user_email) {
  return NextResponse.json({ success: false, message: "user_email is required" }, { status: 400 });
}

const result = await sql`
  SELECT * FROM tests WHERE test_id = ${test_id};
`;

if (result.length === 0) {
  return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
}

const test = result[0];

// Если тест уже принадлежит пользователю
if (test.user_email === user_email) {
  return NextResponse.json({ success: false, message: "Its your test o my god -_-" }, { status: 403 });
}

// Если тест не принадлежит — возвращаем
return NextResponse.json({ success: true, test });


} catch  {
console.error("Get test error:");
return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
}
}
