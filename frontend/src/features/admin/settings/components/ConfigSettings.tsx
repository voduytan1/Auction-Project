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
import {
  Settings,
  Clock,
  Sparkles,
  Timer,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConfigItem {
  variable: string;
  value: number | string;
  label: string;
  description: string;
  type: "number" | "text";
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const CONFIG_ITEMS: ConfigItem[] = [
  {
    variable: "HIGHLIGHT_MINUTES",
    value: 0,
    label: "Thời gian nổi bật",
    description: "Số phút sản phẩm được đánh dấu nổi bật sau khi đăng",
    type: "number",
    icon: Sparkles,
    category: "Hiển thị",
  },
  {
    variable: "CHECK_PRODUCT_MINUTES",
    value: 5,
    label: "Thời gian kiểm tra sản phẩm",
    description: "Số phút trước khi kết thúc đấu giá để kiểm tra và gia hạn",
    type: "number",
    icon: Clock,
    category: "Đấu giá",
  },
  {
    variable: "EXTENSION_MINUTES",
    value: 10,
    label: "Thời gian gia hạn",
    description: "Số phút gia hạn thêm khi có người đặt giá ở phút cuối",
    type: "number",
    icon: Timer,
    category: "Đấu giá",
  },
];

export function ConfigSettings() {
  const [configs, setConfigs] = useState<Record<string, number | string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedConfigs, setEditedConfigs] = useState<Set<string>>(new Set());

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
      setEditedConfigs(new Set());
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
      const itemLabel = CONFIG_ITEMS.find(
        (i) => i.variable === variable
      )?.label;
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Đã cập nhật cấu hình thành công</span>
          <span className="text-sm font-bold text-foreground/90">
            {itemLabel} đã được lưu
          </span>
        </div>,
        {
          icon: <CheckCircle2 className="h-4 w-4" />,
        }
      );

      // Remove from edited set after successful save
      setEditedConfigs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(variable);
        return newSet;
      });
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

    // Mark as edited
    setEditedConfigs((prev) => new Set(prev).add(variable));
  };

  // Group configs by category
  const groupedConfigs = CONFIG_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ConfigItem[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardContent className="p-8">
            <PageLoader message="Đang tải cấu hình..." className="py-12" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 bg-linear-to-br from-primary/5 via-primary/3 to-background">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  Cấu hình hệ thống
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Quản lý các thông số và cài đặt của hệ thống đấu giá
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="self-start sm:self-auto">
              {CONFIG_ITEMS.length} cấu hình
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Config Items by Category */}
      {Object.entries(groupedConfigs).map(([category, items]) => (
        <Card key={category} className="border-2">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {items.map((item) => {
              const Icon = item.icon;
              const isEdited = editedConfigs.has(item.variable);
              const isSaving = saving === item.variable;

              return (
                <div
                  key={item.variable}
                  className="group relative rounded-lg border-2 border-border/50 p-4 sm:p-5 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  {/* Icon & Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-md bg-primary/10 group-hover:bg-primary/15 transition-colors shrink-0">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Label
                            htmlFor={item.variable}
                            className="text-sm sm:text-base font-semibold cursor-pointer"
                          >
                            {item.label}
                          </Label>
                          <Badge
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {item.variable}
                          </Badge>
                          {isEdited && !isSaving && (
                            <Badge variant="secondary" className="text-xs">
                              Chưa lưu
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Input & Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pl-0 sm:pl-14">
                      <div className="relative shrink-0">
                        <Input
                          id={item.variable}
                          type={item.type}
                          value={configs[item.variable] ?? item.value}
                          onChange={(e) =>
                            handleChange(
                              item.variable,
                              e.target.value,
                              item.type
                            )
                          }
                          className="w-full sm:w-32 h-11 text-lg font-semibold text-center border-2 pr-12"
                          disabled={isSaving}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                          phút
                        </span>
                      </div>

                      <Button
                        onClick={() => handleSave(item.variable)}
                        disabled={isSaving || !isEdited}
                        size="lg"
                        className="w-full sm:w-auto sm:min-w-25 h-11"
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Lưu
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
