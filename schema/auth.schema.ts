import { z } from "zod";

// Phone number validation (Bangladesh: 10–11 digits, optional 0 or +880 prefix)
const phoneOrEmailSchema = z
  .string()
  .min(1, "ফোন নম্বর আবশ্যক")
  .refine(
    (value) => {
      const digits = value.replace(/\s+/g, "").replace(/^\+88/, "").replace(/^88/, "").replace(/^0/, "");
      return /^[0-9]{10,11}$/.test(digits);
    },
    {
      message: "বৈধ ফোন নম্বর দিন (১০–১১ সংখ্যা)",
    }
  );

// File validation schema
const fileSchema: z.ZodType<File> = z
  .instanceof(File, {
    message: "ছবি আবশ্যক",
  })
  .refine(
    (file) => file.type.startsWith("image/"),
    {
      message: "শুধুমাত্র ছবি ফাইল গ্রহণযোগ্য",
    }
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    {
      message: "ফাইল সাইজ ৫ এমবি এর বেশি হতে পারবে না",
    }
  );

// Login Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "ইউজারনেম আবশ্যক")
    .trim(),
  password: z
    .string()
    .min(1, "পাসওয়ার্ড আবশ্যক")
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// NID validation - must be exactly 10 digits
const nidSchema = z
  .string()
  .min(1, "এনআইডি আবশ্যক")
  .trim()
  .refine(
    (value) => /^[0-9]{10}$/.test(value),
    {
      message: "এনআইডি অবশ্যই ১০ সংখ্যার হতে হবে",
    }
  );

// Username validation - only letters, numbers, and @/./+/-/_ characters
const usernameSchema = z
  .string()
  .min(1, "ইউজারনেম আবশ্যক")
  .trim()
  .refine(
    (value) => /^[a-zA-Z0-9@.+\-_]+$/.test(value),
    {
      message: "ইউজারনেমে শুধুমাত্র অক্ষর, সংখ্যা এবং @/./+/-/_ ব্যবহার করা যাবে",
    }
  );

// Password validation
const passwordSchema = z
  .string()
  .min(1, "পাসওয়ার্ড আবশ্যক")
  .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");

// Registration Schema
export const registrationSchema = z.object({
  firstName: z.string().min(1, "ফর্মের প্রথম নাম আবশ্যক").trim(),
  lastName: z.string().min(1, "ফর্মের শেষ নাম আবশ্যক").trim(),
  username: usernameSchema,
  password: passwordSchema,
  nid: nidSchema,
  photo: fileSchema,
  nomineeName: z.string().min(1, "নমিনির নাম আবশ্যক").trim(),
  nomineeNid: nidSchema,
  nomineePhoto: fileSchema,
  referenceName: z.string().min(1, "রেফারেন্সের নাম আবশ্যক").trim(),
  phoneOrEmail: phoneOrEmailSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "শর্তাবলী এবং গোপনীয়তা নীতির সাথে সম্মত হতে হবে",
  }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

