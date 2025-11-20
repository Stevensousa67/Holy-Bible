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

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
      rememberMe: true,
    });
    
    // Verify that sign-in was actually successful by checking the session
    const session = await authClient.getSession();
    if (!session?.data?.session) {
      return { errorMessage: "Invalid credentials." };
    }
    
    // Success - redirect will happen via callbackURL
    return { errorMessage: null };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return { errorMessage: "Invalid credentials." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email." };
        default:
          return { errorMessage: "Something went wrong." };
      }
    }
    // Catch any other errors that might not be APIError instances
    console.error("Login error:", error);
    return { errorMessage: "Invalid credentials." };
  }
};

export const signUpWithEmail = async (name: string, email: string, password: string) => {
  try {
    await authClient.signUp.email({
      name,
      email,
      password,
      isAdmin: false,
      countryCode: "",
      phoneNumber: "",
      gender: "",
      accountStatus: "active",
      callbackURL: "/",
    } as any);
    // Success - redirect will happen via callbackURL
    return { errorMessage: null };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "User already exists." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email." };
        default:
          return { errorMessage: "Something went wrong." };
      }
    }
    console.error(error);
    return { errorMessage: "Something went wrong." };
  }
};