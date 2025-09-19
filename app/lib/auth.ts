import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Define an interface for the user data from the database
interface DbUser extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  firstname: string;
  lastname: string;
  rolename: string;
}

export const authOptions: AuthOptions = {
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
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const [rows] = await db.query<DbUser[]>(
            `SELECT u.*, r.name as rolename 
             FROM users u 
             JOIN roles r ON u.roleid = r.id 
             WHERE u.username = ?`,
            [credentials.username]
          );

          if (rows.length > 0) {
            const user = rows[0];
            const passwordsMatch = await compare(
              credentials.password,
              user.password
            );

            if (passwordsMatch) {
              return {
                id: user.id.toString(),
                username: user.username,
                email: user.email,
                name: `${user.firstname} ${user.lastname}`,
                role: user.rolename,
              };
            }
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
}