import { sql } from "@/lib/neon"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return Response.json(
        { success: false, message: "Email is required" }, 
        { status: 400 }
      )
    }

    // Ищем пользователя по email
    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${email}
      LIMIT 1
    `

    if (result.length === 0) {
      return Response.json(
        { success: false, message: "User not found" }, 
        { status: 404 }
      )
    }

    const user = result[0]
    
    return Response.json(
      
    {data:user}
      
   
    )

  } catch {
    console.error("POST /api/users error:")
    return Response.json(
      { success: false, message: "Internal server error" }, 
      { status: 500 }
    )
  }
}