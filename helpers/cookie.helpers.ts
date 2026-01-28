import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Cookie helper functions for token management
 */

export const cookieHelpers = {
  /**
   * Set access token in cookie
   */
  setAccessToken: (token: string): void => {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  /**
   * Set refresh token in cookie
   */
  setRefreshToken: (token: string): void => {
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  /**
   * Get access token from cookie
   */
  getAccessToken: (): string | undefined => {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from cookie
   */
  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  /**
   * Remove access token from cookie
   */
  removeAccessToken: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
  },

  /**
   * Remove refresh token from cookie
   */
  removeRefreshToken: (): void => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  /**
   * Remove all auth tokens from cookies
   */
  clearAuthTokens: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if user has access token (is authenticated)
   */
  hasAccessToken: (): boolean => {
    return !!Cookies.get(ACCESS_TOKEN_KEY);
  },
};
