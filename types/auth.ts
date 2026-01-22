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
  id: number;
  user: User;
  role: string;
  profile_id: string;
  nid: string;
  photo: string;
  mobile: string;
  email: string;
  reference: number;
  registration_fee_paid: boolean;
  registration_fee_amount: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationPayload {
  role: string;
  nid: string;
  photo: string;
  mobile: string;
  email: string;
  reference: number;
  reference_username: string;
  registration_fee_paid: boolean;
  registration_fee_amount: string;
}

/**
 * User type (used across authentication and dashboard)
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Profile {
  id: number;
  user: User;
  role: string;
  profile_id: string;
  nid: string;
  photo: string;
  mobile: string;
  email: string;
  reference: number;
  registration_fee_paid: boolean;
  registration_fee_amount: string;
  created_at: string;
  updated_at: string;
}

/**
 * Auth state types
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: Profile | null;
  token: string | null;
  isLoading: boolean;
}

/**
 * Auth Context types
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  user: Profile | null;
  token: string | null;
  isLoading: boolean;
  register: (data: RegistrationFormData) => Promise<RegistrationResponse>;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
}

