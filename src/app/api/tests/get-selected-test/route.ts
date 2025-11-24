import { sql } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { test_id } = await req.json();

    if (!test_id) {
      return NextResponse.json({
        success: false,
        message: "test_id is required"
      });
    }

    // Получаем один тест
    const result = await sql`
      SELECT *
      FROM tests
      WHERE test_id = ${test_id}
      LIMIT 1;
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Test not found"
      });
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });

  } catch {
    return NextResponse.json({
      success: false,
      message: "Server error"
    });
  }
}
