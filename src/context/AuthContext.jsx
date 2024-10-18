// AuthContext.js
import React, { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // State to hold user info

  const isAuthenticated = Boolean(token);

  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
