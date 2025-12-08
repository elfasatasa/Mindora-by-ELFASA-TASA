import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export async function POST(req: Request) {
  try {
    const { id } = await req.json(); // ожидаем объект { id }

    if (!id) {
      return NextResponse.json({ success: false, message: "id is required" });
    }

    const test = await sql`
      SELECT *
      FROM tests
      WHERE test_id = ${id}
    `;

    if (!test.length) {
      return NextResponse.json({ success: false, message: "Test not found" });
    }

    return NextResponse.json({ success: true, data: test[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Server error"
    });
  }
}
