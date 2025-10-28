import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { AuthContext } from "./authing";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount and validate session
    const validateSession = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Set initial user state from localStorage
          setUser(JSON.parse(savedUser));

          // Verify the token is still valid by making a request to getProfile
          const response = await authAPI.getProfile();
          if (response.data?.data?.user) {
            // Update user data if it's changed
            const userData = response.data.data.user;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (error) {
          console.error("Session validation failed:", error);
          // Only clear session on 401 errors
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    validateSession();

    // Set up periodic session validation (every 5 minutes)
    const intervalId = setInterval(validateSession, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const login = async (email, password, recaptchaToken) => {
    try {
      const response = await authAPI.login({ email, password, recaptchaToken });
      const { token, data } = response.data;
      const userData = data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("Setting user:", userData);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await authAPI.register({ name, email, password, phone });
      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData.data.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
