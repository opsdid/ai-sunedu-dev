import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Define a type for the user object retrieved from the database
interface DbUser extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  roleid: number;
  rolename: string;
}

// Export the auth configuration so it can be used in other API routes
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
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Query user and join with roles table to get the role name
          const [rows] = await db.query<DbUser[]>(
            `SELECT u.*, r.name as rolename 
             FROM users u 
             JOIN roles r ON u.roleid = r.id 
             WHERE u.username = ?`,
            [credentials.username]
          );

          if (rows.length > 0) {
            const currentUser = rows[0];
            const passwordsMatch = await compare(
              credentials.password,
              currentUser.password
            );

            if (passwordsMatch) {
              return {
                id: currentUser.id.toString(),
                username: currentUser.username,
                name: `${currentUser.firstname} ${currentUser.lastname}`,
                email: currentUser.email,
                role: currentUser.rolename,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

