import "next-auth";
import "next-auth/jwt";

/**
 * Augments the default NextAuth types to include the custom properties
 * we are adding to the session, user, and JWT objects.
 */

// Extend the built-in User model
declare module "next-auth" {
  /**
   * Returned by the `authorize` callback and needs to match
   * the properties you are returning from your database.
   */
  interface User {
    id: string;
    username: string;
  }

  /**
   * The shape of the session object returned by `useSession` or `getSession`.
   * We need to add our custom properties to the `user` object here.
   */
  interface Session {
    user: User & {
      id: string;
      username: string;
    };
  }
}

// Extend the built-in JWT model
declare module "next-auth/jwt" {
  /**
   * The shape of the JWT token returned by the `jwt` callback.
   * We need to add our custom properties here.
   */
  interface JWT {
    id: string;
    username: string;
  }
}