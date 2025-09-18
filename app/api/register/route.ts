import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

// The number of salt rounds to use for hashing
const saltRounds = 10;

export async function POST(req: Request) {
  let dbConnection;
  try {
    const { username, password, name, email } = await req.json();

    // Basic validation
    if (!username || !password || !email) {
      return NextResponse.json({ message: 'Username, password, and email are required.' }, { status: 400 });
    }

    dbConnection = await pool.getConnection();

    // Check if user already exists
    const [existingUsers] = await dbConnection.execute('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json({ message: 'Username or email already exists.' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const [result] = await dbConnection.execute(
      'INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, name, email]
    );

    const insertResult = result as any;

    if (insertResult.affectedRows === 1) {
      return NextResponse.json({ message: 'User created successfully.', userId: insertResult.insertId }, { status: 201 });
    } else {
      throw new Error('User creation failed.');
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration.' }, { status: 500 });
  } finally {
    if (dbConnection) {
      dbConnection.release();
    }
  }
}