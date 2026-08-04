import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { deleteItem, getItem, setItem } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, try to restore a previously saved session so the user
  // doesn't have to log in again every time they open the app.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [token, userId, name, email] = await Promise.all([
          getItem("userToken"),
          getItem("userId"),
          getItem("userName"),
          getItem("userEmail"),
        ]);

        if (token && userId) {
          setUser({ id: userId, name: name || "", email: email || "", token });
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = useCallback(async ({ token, user: signedInUser }) => {
    const id = String(signedInUser?.id ?? "");
    const name = signedInUser?.name || "";
    const email = signedInUser?.email || "";

    await Promise.all([
      setItem("userToken", token || ""),
      setItem("userId", id),
      setItem("userName", name),
      setItem("userEmail", email),
    ]);

    setUser({ id, name, email, token });
  }, []);

  // Clears the saved session completely and signs the user out. Any
  // screen guarded by isSignedIn will automatically redirect to Login.
  const signOut = useCallback(async () => {
    await Promise.all([
      deleteItem("userToken"),
      deleteItem("userId"),
      deleteItem("userName"),
      deleteItem("userEmail"),
    ]);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isSignedIn: !!user,
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
