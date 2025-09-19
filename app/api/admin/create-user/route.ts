import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { hash } from "bcrypt";
import db from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Security Check: Ensure user is an authenticated admin
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { username, email, password, firstname, lastname, roleid } = await req.json();

    // --- Data Validation ---
    if (!username || !email || !password || !firstname || !lastname || !roleid) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    if (roleid !== 1 && roleid !== 2) {
        return NextResponse.json({ message: "Invalid role specified." }, { status: 400 });
    }

    // --- Check for existing user ---
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if ((existingUser as any[]).length > 0) {
      return NextResponse.json({ message: "Username or email already exists." }, { status: 409 });
    }

    // --- Create new user ---
    const hashedPassword = await hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password, firstname, lastname, roleid) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, firstname, lastname, roleid]
    );

    return NextResponse.json({ message: "User created successfully." }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_CREATE_USER_ERROR", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}