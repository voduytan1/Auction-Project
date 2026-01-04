import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { UserProfile, UpdateProfileData } from "@/features/profile/types";

const profileSchema = z.object({
  hoVaTen: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  diaChi: z.string().optional(),
  soDienThoai: z
    .string()
    .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .optional()
    .or(z.literal("")),
  ngaySinh: z.string().optional(),
});

interface EditProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  isLoading: boolean;
}

export function EditProfileForm({
  profile,
  onSubmit,
  isLoading,
}: EditProfileFormProps) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      hoVaTen: profile.hoVaTen || "",
      email: profile.email || "",
      diaChi: profile.diaChi || "",
      soDienThoai: profile.soDienThoai || "",
      ngaySinh: profile.ngaySinh || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="hoVaTen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diaChi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="soDienThoai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại (10 chữ số)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ngaySinh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật thông tin"
          )}
        </Button>
      </form>
    </Form>
  );
}
