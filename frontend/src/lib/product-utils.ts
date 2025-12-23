/**
 * Product utilities
 */

/**
 * Check if a product is new (created within N minutes)
 * @param createdAt - Product creation timestamp
 * @param minutesThreshold - Threshold in minutes (default: 60)
 * @returns true if product is new
 */
export function isNewProduct(
  createdAt: string | Date,
  minutesThreshold: number = 60
): boolean {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMinutes = (now.getTime() - createdDate.getTime()) / 1000 / 60;

  return diffInMinutes <= minutesThreshold;
}

/**
 * Calculate time left until auction ends
 * @param endDate - Auction end timestamp
 * @returns Object with days, hours, minutes, seconds
 */
export function getTimeLeft(endDate: string | Date): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
} {
  const end = new Date(endDate);
  const now = new Date();
  const total = end.getTime() - now.getTime();

  if (total <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEnded: true,
    };
  }

  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
    isEnded: false,
  };
}

/**
 * Format time left to readable string
 * @param endDate - Auction end timestamp
 * @returns Formatted string like "2 ngày 5 giờ" or "30 phút"
 */
export function formatTimeLeft(endDate: string | Date): string {
  const timeLeft = getTimeLeft(endDate);

  if (timeLeft.isEnded) {
    return "Đã kết thúc";
  }

  if (timeLeft.days > 0) {
    return `${timeLeft.days} ngày ${timeLeft.hours} giờ`;
  }

  if (timeLeft.hours > 0) {
    return `${timeLeft.hours} giờ ${timeLeft.minutes} phút`;
  }

  if (timeLeft.minutes > 0) {
    return `${timeLeft.minutes} phút`;
  }

  return `${timeLeft.seconds} giây`;
}

/**
 * Check if auction is ending soon (within 24 hours)
 * @param endDate - Auction end timestamp
 * @returns true if ending soon
 */
export function isEndingSoon(endDate: string | Date): boolean {
  const timeLeft = getTimeLeft(endDate);
  const hoursLeft = timeLeft.days * 24 + timeLeft.hours;

  return !timeLeft.isEnded && hoursLeft <= 24;
}
