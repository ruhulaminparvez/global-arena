import axios from "axios";
import { cookieHelpers } from "@/helpers/cookie.helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from cookies to all requests
    const accessToken = cookieHelpers.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      cookieHelpers.clearAuthTokens();
      
      // Only redirect if we're in the browser (client-side)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    
    // Handle common errors without page reload
    // Errors are handled in the component/callback
    return Promise.reject(error);
  }
);
