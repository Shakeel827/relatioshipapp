/**
 * USEAUTH HOOK
 *
 * State management for authentication
 * - Handles login/signup
 * - Manages user session
 * - Persists auth state
 *
 * Note: This is a mock implementation for development.
 * In production, connect to a real authentication service.
 */

import { useState, useCallback, useEffect } from "react";
import { apiLogin, apiMe, apiRegister, clearToken } from "../services/api";

export interface User {
  id: string;
  email: string;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = "@relastin_auth_user";

/**
 * Hook for managing authentication state
 *
 * In production:
 * - Replace mock storage with real API calls
 * - Implement JWT token management
 * - Add refresh token logic
 * - Use secure storage for sensitive data
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load persisted auth state on mount
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const me = await apiMe();
      if (me) setUser(me);
    } catch (err) {
      // silently ignore
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setIsLoading(true);

        // Validation
        if (!email.includes("@")) {
          throw new Error("Please enter a valid email");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        await apiRegister(email, password);
        const me = await apiMe();
        if (!me) throw new Error("Could not load user");
        setUser(me);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Sign up failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setIsLoading(true);

        // Validation
        if (!email.includes("@")) {
          throw new Error("Please enter a valid email");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        await apiLogin(email, password);
        const me = await apiMe();
        if (!me) throw new Error("Could not load user");
        setUser(me);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Sign in failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      await clearToken();
      setUser(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign out failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isSignedIn: !!user,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
  };
}
