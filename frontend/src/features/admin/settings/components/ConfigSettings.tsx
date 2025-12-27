import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/PageLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { adminAPI } from "@/services/admin.api";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/types/types";
import type { AxiosError } from "axios";
import { Settings } from "lucide-react";

interface ConfigItem {
  variable: string;
  value: number | string;
  label: string;
  description: string;
  type: "number" | "text";
}

const CONFIG_ITEMS: ConfigItem[] = [
  {
    variable: "HIGHLIGHT_MINUTES",
    value: 0,
    label: "Thời gian nổi bật (phút)",
    description: "Số phút sản phẩm được đánh dấu nổi bật sau khi đăng",
    type: "number",
  },
  // Add more config items here as needed
];

export function ConfigSettings() {
  const [configs, setConfigs] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const results: Record<string, number | string> = {};

      for (const item of CONFIG_ITEMS) {
        try {
          const resp = await adminAPI.getConfig(item.variable);
          results[item.variable] = resp.data.value;
        } catch (error) {
          console.error(`Failed to load ${item.variable}`, error);
          results[item.variable] = item.value; // Use default value
        }
      }

      setConfigs(results);
    } catch (error) {
      console.error("Failed to load configs", error);
      toast.error("Không thể tải cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (variable: string) => {
    try {
      setSaving(variable);
      const value = configs[variable];

      await adminAPI.updateConfig({ variable, value });
      toast.success(`Đã cập nhật ${variable}`);
    } catch (error) {
      console.error("Failed to save config", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || "Không thể cập nhật cấu hình"
      );
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (variable: string, value: string, type: string) => {
    setConfigs((prev) => ({
      ...prev,
      [variable]: type === "number" ? Number(value) : value,
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <PageLoader message="Đang tải cấu hình..." className="py-12" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Cấu hình hệ thống
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {CONFIG_ITEMS.map((item) => (
            <div key={item.variable} className="space-y-2">
              <Label htmlFor={item.variable}>
                {item.label}
                <span className="ml-2 text-xs text-slate-500 font-normal">
                  ({item.variable})
                </span>
              </Label>
              <p className="text-sm text-slate-600">{item.description}</p>
              <div className="flex gap-2">
                <Input
                  id={item.variable}
                  type={item.type}
                  value={configs[item.variable] ?? item.value}
                  onChange={(e) =>
                    handleChange(item.variable, e.target.value, item.type)
                  }
                  className="max-w-xs"
                />
                <Button
                  onClick={() => handleSave(item.variable)}
                  disabled={saving === item.variable}
                >
                  {saving === item.variable ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
