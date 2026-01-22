"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/lib/api/axios";
import { fileToBase64, isEmail } from "@/helpers/auth.helpers";
import type {
  AuthContextType,
  RegistrationFormData,
  LoginFormData,
  RegistrationResponse,
  Profile,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user
   */
  const register = async (data: RegistrationFormData): Promise<RegistrationResponse> => {
    try {
      setIsLoading(true);

      // Convert files to base64
      const photoBase64 = await fileToBase64(data.photo);

      // Determine if phoneOrEmail is email or phone
      const isEmailValue = isEmail(data.phoneOrEmail);
      const email = isEmailValue ? data.phoneOrEmail : "";
      const mobile = !isEmailValue ? data.phoneOrEmail : "";

      // Prepare payload
      const payload = {
        role: "ADMIN", // Default role, can be made configurable
        nid: data.nid,
        photo: photoBase64,
        mobile: mobile,
        email: email,
        reference: 0, // TODO: Get reference ID from referenceName if needed
        reference_username: data.referenceName,
        registration_fee_paid: false, // TODO: Handle registration fee payment
        registration_fee_amount: "0", // TODO: Set actual registration fee amount
      };

      // Make API call
      const response = await apiClient.post<RegistrationResponse>(
        "/api/accounts/profiles/",
        payload
      );

      const profileData = response.data;

      // Store auth data
      if (typeof window !== "undefined") {
        // Store token if provided in response (adjust based on actual API response)
        const authToken = response.headers.authorization?.replace("Bearer ", "") || "";
        if (authToken) {
          localStorage.setItem("auth_token", authToken);
          setToken(authToken);
        }

        localStorage.setItem("auth_user", JSON.stringify(profileData));
        setUser(profileData);
        setIsAuthenticated(true);
      }

      return profileData;
    } catch (error: any) {
      console.error("Registration error:", error);

      // Extract error message from response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Registration failed. Please try again.";

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
      // TODO: Implement login API call when endpoint is available
      // For now, this is a placeholder
      throw new Error("Login endpoint not yet implemented");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Login failed. Please try again.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    isLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
