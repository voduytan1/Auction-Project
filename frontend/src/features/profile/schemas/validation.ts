import { z } from "zod";

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu tối đa 50 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Profile Info Schema
export const profileInfoSchema = z.object({
  hoVaTen: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  diaChi: z
    .string()
    .max(200, "Địa chỉ tối đa 200 ký tự")
    .optional()
    .or(z.literal("")),
  soDienThoai: z
    .string()
    .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .optional()
    .or(z.literal("")),
  ngaySinh: z.string().optional().or(z.literal("")),
});

export type ProfileInfoFormData = z.infer<typeof profileInfoSchema>;

// Forgot Password - Email Step Schema
export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
});

export type ForgotPasswordEmailFormData = z.infer<
  typeof forgotPasswordEmailSchema
>;

// Forgot Password - Reset Step Schema
export const forgotPasswordResetSchema = z
  .object({
    otp: z
      .string()
      .min(6, "Mã OTP phải có 6 ký tự")
      .max(6, "Mã OTP phải có 6 ký tự"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .max(50, "Mật khẩu tối đa 50 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ForgotPasswordResetFormData = z.infer<
  typeof forgotPasswordResetSchema
>;
