import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeRemaining(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return "Đã kết thúc";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  // Nếu trên 3 ngày, hiển thị ngày hết hạn
  if (days > 3) {
    return `${endTime.getDate()}/${
      endTime.getMonth() + 1
    }/${endTime.getFullYear()}`;
  }

  // Nếu 1-3 ngày, hiển thị số ngày
  if (days >= 1) {
    return `Còn ${days} ngày`;
  }

  // Dưới 24h, hiển thị giờ và phút
  if (hours > 0) return `Còn ${hours}h ${minutes}m`;
  return `Còn ${minutes}m`;
}
