import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("stayoraUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("stayoraToken") || null;
  });

  const login = (userData, jwtToken) => {
    localStorage.setItem("stayoraUser", JSON.stringify(userData));
    localStorage.setItem("stayoraToken", jwtToken);

    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("stayoraUser");
    localStorage.removeItem("stayoraToken");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}