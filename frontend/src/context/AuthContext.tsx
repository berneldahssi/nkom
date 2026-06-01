"use client";

import "@/lib/amplify";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  signIn,
  signUp,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  signInWithRedirect,
  type SignUpOutput,
} from "aws-amplify/auth";

export interface NkomUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextType {
  user: NkomUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<SignUpOutput>;
  confirmEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NkomUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadSession(); }, []);

  const provision = async (token: string) => {
    try {
      await fetch("/api/v1/auth/provision", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Non-fatal — provision will retry on next login
    }
  };

  const loadSession = async (isNewLogin = false) => {
    try {
      const cognitoUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString() ?? null;
      const idPayload = session.tokens?.idToken?.payload;

      setUser({
        id: cognitoUser.userId,
        email: (idPayload?.email as string) ?? cognitoUser.username,
        firstName: (idPayload?.given_name as string) ?? undefined,
        lastName: (idPayload?.family_name as string) ?? undefined,
      });
      setAccessToken(token);

      // Signal to middleware that user is authenticated
      document.cookie = "nkom_authed=1; path=/; SameSite=Lax";

      if (isNewLogin && token) {
        await provision(token);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      document.cookie = "nkom_authed=; path=/; max-age=0";
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signIn({ username: email, password });
    if (result.isSignedIn) {
      await loadSession(true);
    } else if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
      throw new Error("CONFIRM_EMAIL:" + email);
    }
  };

  const loginWithGoogle = async () => {
    await signInWithRedirect({ provider: "Google" });
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<SignUpOutput> => {
    return signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          ...(firstName && { given_name: firstName }),
          ...(lastName && { family_name: lastName }),
        },
        autoSignIn: true,
      },
    });
  };

  const confirmEmail = async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
    await loadSession(true);
  };

  const resendCode = async (email: string) => {
    await resendSignUpCode({ username: email });
  };

  const forgotPassword = async (email: string) => {
    await resetPassword({ username: email });
  };

  const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  };

  const logout = async () => {
    await amplifySignOut();
    setUser(null);
    setAccessToken(null);
    document.cookie = "nkom_authed=; path=/; max-age=0";
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const token = session.tokens?.accessToken?.toString() ?? null;
      setAccessToken(token);
      return token;
    } catch {
      await logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        accessToken,
        login,
        loginWithGoogle,
        register,
        confirmEmail,
        resendCode,
        forgotPassword,
        confirmForgotPassword,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
