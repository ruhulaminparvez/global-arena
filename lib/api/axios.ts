import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookieHelpers } from "@/helpers/cookie.helpers";
import type { RefreshTokenResponse } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to track if we're currently refreshing the token
let isRefreshing = false;
// Queue to store failed requests while refreshing
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - token expired or invalid
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = cookieHelpers.getRefreshToken();

      // If no refresh token, clear everything and redirect to login
      if (!refreshToken) {
        cookieHelpers.clearAuthTokens();
        processQueue(error, null);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        const { access, refresh } = response.data;

        // Update tokens in cookies
        cookieHelpers.setAccessToken(access);
        cookieHelpers.setRefreshToken(refresh);

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        // Process queued requests
        processQueue(null, access);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        // Clear tokens and redirect to login
        cookieHelpers.clearAuthTokens();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors without page reload
    // Errors are handled in the component/callback
    return Promise.reject(error);
  },
);
