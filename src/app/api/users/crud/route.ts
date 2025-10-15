import { sql } from "@/lib/neon";

export async function GET() {
  try {
    const data = await sql`SELECT * FROM users`;
    return Response.json({ data }, { status: 200 });
  } catch {
    console.error("GET /crud error");
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...fields } = data;

    if (!id) {
      return Response.json({ success: false, message: "User id is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE users
      SET 
        name = COALESCE(${fields.name}, name),
        email = COALESCE(${fields.email}, email),
        draft = COALESCE(${fields.draft}, draft),
        local = COALESCE(${fields.local}, local),
        public = COALESCE(${fields.public}, public),
        private = COALESCE(${fields.private}, private),
        expire = COALESCE(${fields.expire}, expire),
        users_connect = COALESCE(${fields.users_connect}, users_connect),
        user_tests = COALESCE(${fields.user_tests}, user_tests)
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, user: result[0] }, { status: 200 });
  } catch (err) {
    console.error("PUT /crud error", err);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { id } = data;

    if (!id) {
      return Response.json({ success: false, message: "User id is required" }, { status: 400 });
    }

    await sql`DELETE FROM users WHERE id = ${id}`;
    return Response.json({ success: true, message: "User deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /crud error", err);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
