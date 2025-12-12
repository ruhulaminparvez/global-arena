/**
 * Central export file for all types
 * Import types from this file to use across the application
 */

// Auth types
export type {
  LoginFormData,
  LoginRequest,
  LoginResponse,
  RegistrationFormData,
  RegistrationRequest,
  RegistrationResponse,
  User,
  AuthState,
} from "./auth";

// Dashboard types
export type {
  MonthlySavingsData,
  UserDashboardData,
  MenuItem,
  DashboardStats,
  TransactionType,
  Transaction,
  ScheduleHistory,
  CompanyHistory,
  ContactInfo,
} from "./dashboard";

