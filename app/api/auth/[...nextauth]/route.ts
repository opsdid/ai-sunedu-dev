import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "@/lib/db"; // Make sure this path is correct for your structure

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
        console.log("--- Authorize function started ---");
        console.log("Credentials received:", credentials);

        if (!credentials?.username || !credentials?.password) {
          console.log("Missing username or password");
          return null;
        }

        try {
          const user = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [credentials.username]
          );

          console.log("User found in DB:", user[0] || "No user found");

          // Check if a user was found and has a password
          if (user.length > 0 && user[0].password) {
            const currentUser = user[0];

            // Compare the provided password with the hashed password from the database
            const passwordsMatch = await compare(
              credentials.password,
              currentUser.password
            );
            
            console.log("Password match result:", passwordsMatch);

            if (passwordsMatch) {
              console.log("Authentication successful. Returning user.");
              // Omit the password from the returned object for security
              return {
                id: currentUser.id.toString(),
                username: currentUser.username,
                name: currentUser.name,
                email: currentUser.email,
              };
            } else {
              console.log("Passwords do not match.");
              return null;
            }
          } else {
            console.log("User not found with that username.");
            return null;
          }
        } catch (error) {
          console.error("Error during database query or password comparison:", error);
          return null;
        }
      },
    }),
  ],
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