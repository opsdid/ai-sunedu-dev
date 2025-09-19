import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Corrected import path
import db from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Cast the user object to access custom properties
  const userSession = session.user as { role?: string };

  if (userSession.role !== "admin") {
    return new NextResponse(
      JSON.stringify({ message: "Forbidden: Access is denied" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const [users] = await db.query(`
      SELECT u.id, u.username, u.email, u.firstname, u.lastname, r.name as rolename
      FROM users u
      JOIN roles r ON u.roleid = r.id
      ORDER BY u.id ASC
    `);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}