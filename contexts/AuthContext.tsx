"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Register a new user
   */
  const register = async (data: RegistrationFormData): Promise<RegistrationResponse> => {
    try {
      setIsLoading(true);

      // Convert files to base64
      const photoBase64 = await fileToBase64(data.photo);
      const nomineePhotoBase64 = await fileToBase64(data.nomineePhoto);

      // Determine if phoneOrEmail is email or phone
      const isEmailValue = isEmail(data.phoneOrEmail);
      const email = isEmailValue ? data.phoneOrEmail : "";
      const mobile = !isEmailValue ? data.phoneOrEmail : "";

      // Prepare payload
      const payload = {
        role: "USER", // Default role, can be made configurable
        username: data.name,
        nid: data.nid,
        photo: photoBase64,
        mobile: mobile,
        email: email,
        reference: 0, // TODO: Get reference ID from referenceName if needed
        reference_username: data.referenceName,
        nominee_name: data.nomineeName,
        nominee_nid: data.nomineeNid,
        nominee_photo: nomineePhotoBase64,
      };

      // Make API call
      const response = await apiClient.post<RegistrationResponse>(
        "/api/accounts/profiles/",
        payload
      );

      const profileData = response.data;

      // Update auth state (no localStorage storage)
      const authToken = response.headers.authorization?.replace("Bearer ", "") || "";
      if (authToken) {
        setToken(authToken);
      }
      setUser(profileData);
      setIsAuthenticated(true);

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
