// AuthContext.js
import React, { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold user info

  const login = (userData) => {
    setUser(userData); // Function to log in the user
  };

  const logout = () => {
    setUser(null); // Function to log out the user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
