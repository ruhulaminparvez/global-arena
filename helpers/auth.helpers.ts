/**
 * Convert File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Check if string is email or phone
 */
export const isEmail = (value: string): boolean => {
  return /\S+@\S+\.\S+/.test(value);
};

/**
 * Validate password match
 * @param password - First password value
 * @param password2 - Confirm password value
 * @returns Error message if passwords don't match, null if they match
 */
export const validatePasswordMatch = (
  password: string,
  password2: string
): string | null => {
  if (!password2) {
    return "পাসওয়ার্ড নিশ্চিতকরণ আবশ্যক";
  }
  
  if (password !== password2) {
    return "পাসওয়ার্ড মিলছে না। দয়া করে একই পাসওয়ার্ড দিন।";
  }
  
  return null;
};
