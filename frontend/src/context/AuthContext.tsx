import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authApi from "../api/authApi";

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  useEffect(() => {

    const savedToken =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (savedToken) {

      setToken(savedToken);

    }

    if (savedUser) {

      setUser(JSON.parse(savedUser));

    }

  }, []);

  const login = async (
    username: string,
    password: string
  ) => {

    const response =
      await authApi.login(
        username,
        password
      );

    const data =
      response.data.data;

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.admin)
    );

    setToken(data.token);

    setUser(data.admin);

  };

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated:
          !!token,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>
  useContext(AuthContext);