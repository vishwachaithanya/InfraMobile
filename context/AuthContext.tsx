import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  consumerName: string | null;
  userId: number | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, consumerName: string, userId: number) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    consumerName: null,
    userId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const consumerName = await AsyncStorage.getItem("consumer_name");
        const userIdStr = await AsyncStorage.getItem("user_id");
        if (token) {
          setState({
            token,
            consumerName,
            userId: userIdStr ? parseInt(userIdStr) : null,
          });
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (token: string, consumerName: string, userId: number) => {
    await AsyncStorage.setItem("auth_token", token);
    await AsyncStorage.setItem("consumer_name", consumerName);
    await AsyncStorage.setItem("user_id", String(userId));
    setState({ token, consumerName, userId });
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("consumer_name");
    await AsyncStorage.removeItem("user_id");
    setState({ token: null, consumerName: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
