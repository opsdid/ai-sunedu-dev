import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // We need to export authOptions from the auth route
import db from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and is an admin
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Access is restricted to administrators." },
      { status: 403 }
    );
  }

  try {
    const [users] = await db.query(
      `SELECT u.id, u.username, u.email, u.firstname, u.lastname, r.name as rolename 
       FROM users u 
       JOIN roles r ON u.roleid = r.id`
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching users." },
      { status: 500 }
    );
  }
}