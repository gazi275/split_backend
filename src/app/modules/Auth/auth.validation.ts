import { z } from "zod"

const strongPasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/\d/, "Password must include at least one number")
  .regex(/[^A-Za-z\d]/, "Password must include at least one special character")

const loginValidationSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const sendOtpValidationSchema = z.object({
  email: z.string().email("Valid email is required"),
})

const forgotPasswordValidationSchema = z.object({
  email: z.string().email("Valid email is required"),
})

const verifyForgotPasswordValidationSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6 digit number"),
})

const resetPasswordValidationSchema = z.object({
  email: z.string().email("Valid email is required"),
  newPassword: strongPasswordSchema,
})

export const AuthValidation = {
  loginValidationSchema,
  sendOtpValidationSchema,
  forgotPasswordValidationSchema,
  verifyForgotPasswordValidationSchema,
  resetPasswordValidationSchema,
}
