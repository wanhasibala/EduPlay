import React, { createContext, useContext } from "react";
import { useAuth as useAuthHook, AuthState, User } from "./useAuth";

interface AuthContextType extends AuthState {
  login: (loginResponse: any) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => Promise<any>;
  doRefreshToken: () => Promise<any>;
  signIn: (loginResponse: any) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuthHook();

  return (
    <AuthContext.Provider value={auth as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
