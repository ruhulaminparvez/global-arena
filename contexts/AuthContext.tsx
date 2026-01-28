"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "@/lib/api/axios";
import { isEmail } from "@/helpers/auth.helpers";
import { cookieHelpers } from "@/helpers/cookie.helpers";
import type {
  AuthContextType,
  RegistrationFormData,
  LoginFormData,
  RegistrationResponse,
  LoginResponse,
  User,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check cookies

  // Check for existing token in cookies on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = cookieHelpers.getAccessToken();
      if (accessToken) {
        setToken(accessToken);
        setIsAuthenticated(true);
        // Optionally fetch user data here if you have a /me endpoint
        // try {
        //   const response = await apiClient.get<User>("/api/accounts/users/me/");
        //   setUser(response.data);
        // } catch (error) {
        //   // Token might be invalid, clear it
        //   cookieHelpers.clearAuthTokens();
        //   setIsAuthenticated(false);
        //   setToken(null);
        // }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = async (data: RegistrationFormData): Promise<RegistrationResponse> => {
    try {
      setIsLoading(true);

      // Determine if phoneOrEmail is email or phone
      const isEmailValue = isEmail(data.phoneOrEmail);
      const email = isEmailValue ? data.phoneOrEmail : "";
      const mobile = !isEmailValue ? data.phoneOrEmail : "";

      // Create FormData for file uploads
      const formData = new FormData();

      // Append text fields
      formData.append("role", "USER");
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("password2", data.password2);
      formData.append("nid", data.nid);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("reference", "0"); // TODO: Get reference ID from referenceName if needed
      formData.append("reference_username", data.referenceName);
      formData.append("nominee_name", data.nomineeName);
      formData.append("nominee_nid", data.nomineeNid);

      // Append files directly (not base64)
      formData.append("photo", data.photo);
      formData.append("nominee_photo", data.nomineePhoto);

      // Make API call with FormData
      // Content-Type will be set automatically by browser with boundary
      const response = await apiClient.post<RegistrationResponse>(
        "/api/accounts/users/",
        formData
      );

      const profileData = response.data;
      setUser(profileData);
      return profileData;
    } catch (error: any) {
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

      // Prepare payload
      const payload = {
        username: data.username,
        password: data.password,
      };

      // Make API call
      const response = await apiClient.post<LoginResponse>(
        "/api/token/",
        payload
      );

      const { access, refresh } = response.data;

      // Store tokens in cookies
      cookieHelpers.setAccessToken(access);
      cookieHelpers.setRefreshToken(refresh);

      // Update auth state
      setToken(access);
      setIsAuthenticated(true);

      // Optionally fetch user data if you have a /me endpoint
      // try {
      //   const userResponse = await apiClient.get<User>("/api/accounts/users/me/");
      //   setUser(userResponse.data);
      // } catch (error) {
      //   console.error("Failed to fetch user data:", error);
      // }
    } catch (error: any) {
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
    // Clear tokens from cookies
    cookieHelpers.clearAuthTokens();

    // Clear auth state
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
