import { z } from "zod"

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
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
})

export const AuthValidation = {
  loginValidationSchema,
  sendOtpValidationSchema,
  forgotPasswordValidationSchema,
  verifyForgotPasswordValidationSchema,
  resetPasswordValidationSchema,
}
