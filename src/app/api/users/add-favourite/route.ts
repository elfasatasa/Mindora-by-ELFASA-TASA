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

// Получаем тест
const testResult = await sql`
  SELECT * FROM tests WHERE test_id = ${test_id};
`;

if (testResult.length === 0) {
  return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
}

const test = testResult[0];

if (test.status === "local") {
  return NextResponse.json({ success: false, message: "Тест не активный" }, { status: 403 });
}

// Получаем пользователя
const userResult = await sql`
  SELECT * FROM users WHERE email = ${user_email};
`;

if (userResult.length === 0) {
  return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
}

const user = userResult[0];
const favourites = user.user_favourite_tests || [];

// Проверяем, есть ли уже test_id
if (favourites.includes(test_id)) {
  return NextResponse.json({ success: false, message: "Тест уже в избранном" });
}

favourites.push(test_id);

await sql`
  UPDATE users
  SET user_favourite_tests = ${favourites}::text[]
  WHERE email = ${user_email};
`;

return NextResponse.json({ success: true, message: "Test add seccuss" });


} catch  {
console.error("Add favourite error:");
return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
}
}
