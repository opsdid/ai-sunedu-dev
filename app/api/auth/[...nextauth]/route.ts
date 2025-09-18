import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db"; // Import the database connection pool
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        let dbConnection;
        try {
          // Get a connection from the pool
          dbConnection = await pool.getConnection();

          // Find the user with the matching username
          const [rows] = await dbConnection.execute(
            'SELECT id, username, password, name, email FROM users WHERE username = ?',
            [credentials.username]
          );

          // The result of a SELECT query is an array of rows.
          // We need to cast it to the expected type.
          const users = rows as any[];

          if (users.length === 0) {
            console.log('No user found with that username.');
            return null; // No user found
          }

          const user = users[0];

          // Use bcrypt to compare the provided password with the stored hash
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (passwordMatch) {
            // Passwords match. Return the user object without the password hash.
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              username: user.username
            };
          } else {
            // Passwords do not match
            console.log('Invalid password.');
            return null;
          }
        } catch (error) {
          console.error('Database error during authorization:', error);
          return null; // Return null on any database error
        } finally {
          // ALWAYS release the connection back to the pool
          if (dbConnection) {
            dbConnection.release();
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  // Add callbacks to include custom user properties in the session JWT
  callbacks: {
    async jwt({ token, user }) {
      // The `user` object is only available on the first sign-in
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the custom properties to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };