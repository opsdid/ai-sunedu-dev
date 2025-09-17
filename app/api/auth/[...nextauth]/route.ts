import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  // It's crucial to specify the session strategy as 'jwt' for credentials provider
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign-in page.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      // This is where you put your logic to verify the user
      async authorize(credentials, req) {
        // You can connect to your database here to find the user.
        // For this demo, we'll use a simple hardcoded user list.
        
        const users = [
          { id: "1", username: "admin", password: "password123", name: "Admin User", email: "admin@example.com" },
          { id: "2", username: "user", password: "password", name: "Regular User", email: "user@example.com" },
        ];
        
        // Find the user with the matching username
        const user = users.find((user) => user.username === credentials?.username);

        // If user is found AND the password matches, return the user object
        if (user && user.password === credentials?.password) {
          // Any object returned will be saved in the `user` property of the JWT
          // Omit the password from the returned object for security
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } else {
          // If you return null then an error will be displayed to the user
          console.log('Invalid credentials');
          return null;
        }
      },
    }),
  ],
  // Optional: define custom pages if you want a dedicated /login route
  pages: {
    signIn: '/', // We will render the form on the home page if not logged in
    error: '/',   // Redirect to home page on error
  }
});

export { handler as GET, handler as POST };