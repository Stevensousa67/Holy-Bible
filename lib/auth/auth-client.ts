import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { APIError } from "better-auth/api";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Export the properly typed session type from the auth instance
export type Session = typeof auth.$Infer.Session;

export const loginWithSocial = async (provider: string) => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/login",
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw new Error(`Failed to log in with ${provider}: ${error.message}`);
    }
  }
};
