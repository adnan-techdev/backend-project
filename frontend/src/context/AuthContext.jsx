import {
  createContext,
  useContext,
  useState,
} from "react";

import { api } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  const login = async (email, password) => {
    const result = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      result.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(result.user)
    );

    setToken(result.token);
    setUser(result.user);

    return result;
  };


  const register = async (
    name,
    email,
    password
  ) => {
    const result = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      result.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(result.user)
    );

    setToken(result.token);
    setUser(result.user);

    return result;
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
        token,
        user,
        login,
        register,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};