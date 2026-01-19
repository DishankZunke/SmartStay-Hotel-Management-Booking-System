import { createContext, useContext, useState, useEffect } from "react";
import { getUserFromToken } from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getUserFromToken();
    if (u) setUser(u);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const u = getUserFromToken();
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
