import { z } from "zod";

// Login Schema - Sử dụng username theo Backend
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(30, "Username tối đa 30 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  // recaptchaToken is generated at runtime, not validated in form
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema - Phù hợp với Backend RegisterRequest
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .max(30, "Username tối đa 30 ký tự"),
    email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    hoVaTen: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên tối đa 50 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    otp: z
      .string()
      .min(6, "Mã OTP phải có 6 ký tự")
      .max(6, "Mã OTP phải có 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
