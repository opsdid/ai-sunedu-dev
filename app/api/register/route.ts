import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import db from "@/lib/db";

export async function POST(req: Request) {
  console.log("--- Register API endpoint hit ---");
  try {
    const body = await req.json();
    console.log("Request body received:", body);
    const { firstName, lastName, username, email, password } = body;

    if (!username || !email || !password || !firstName || !lastName) {
      console.log("Validation failed: Missing fields.");
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("Checking for existing user with username:", username, "or email:", email);
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    console.log("Existing user check result:", existingUser);
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      console.log("User already exists.");
      return NextResponse.json(
        { message: "Username or email already exists." },
        { status: 409 }
      );
    }

    // Hash the password
    console.log("Hashing password...");
    const hashedPassword = await hash(password, 10);
    console.log("Password hashed successfully.");

    // Insert the new user into the database
    console.log("Inserting new user into database...");
    const result = await db.query(
      "INSERT INTO users (username, email, password, firstname, lastname, roleid) VALUES (?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, firstName, lastName, 2]
    );
    console.log("Database insert result:", result);

    console.log("User registration successful.");
    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("!!! REGISTRATION_ERROR !!!", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}