import { z } from "zod";

// Phone or Email validation
const phoneOrEmailSchema = z
  .string()
  .min(1, "ফোন নম্বর বা ইমেইল আবশ্যক")
  .refine(
    (value) => {
      const isEmail = /\S+@\S+\.\S+/.test(value);
      const isPhone = /^[0-9]{10,11}$/.test(value.replace(/\s+/g, ""));
      return isEmail || isPhone;
    },
    {
      message: "বৈধ ইমেইল বা ফোন নম্বর দিন",
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
  emailOrPhone: phoneOrEmailSchema,
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

// Registration Schema
export const registrationSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক").trim(),
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

