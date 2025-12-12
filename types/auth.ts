import { z } from "zod";
import { loginSchema, registrationSchema } from "@/schema/auth.schema";

/**
 * Login related types
 */
export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

/**
 * Registration related types
 */
export type RegistrationFormData = z.infer<typeof registrationSchema>;

export interface RegistrationRequest {
  name: string;
  nid: string;
  photo: File;
  nomineeName: string;
  nomineeNid: string;
  nomineePhoto: File;
  referenceName: string;
  referenceIdCard: File;
  phoneOrEmail: string;
  termsAccepted: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  user?: User;
}

/**
 * User type (used across authentication and dashboard)
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  nid: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth state types
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

