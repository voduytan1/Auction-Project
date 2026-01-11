/**
 * Rate Limit Manager
 * Quản lý state rate limit toàn cục
 */

type RateLimitCallback = (isRateLimited: boolean) => void;

class RateLimitManager {
  private isRateLimited = false;
  private rateLimitEndTime: number | null = null;
  private listeners: Set<RateLimitCallback> = new Set();
  private readonly RATE_LIMIT_DURATION = 60 * 1000; // 1 minute

  /**
   * Trigger rate limit
   */
  trigger(): void {
    console.log("[RateLimit] Triggered!");
    this.isRateLimited = true;
    this.rateLimitEndTime = Date.now() + this.RATE_LIMIT_DURATION;
    this.notifyListeners();
  }

  /**
   * Clear rate limit (user confirmed)
   */
  clear(): void {
    this.isRateLimited = false;
    this.rateLimitEndTime = null;
    this.notifyListeners();
  }

  /**
   * Check if currently rate limited
   */
  isLimited(): boolean {
    // Auto clear if time has passed
    if (this.rateLimitEndTime && Date.now() >= this.rateLimitEndTime) {
      this.isRateLimited = false;
      this.rateLimitEndTime = null;
    }
    return this.isRateLimited;
  }

  /**
   * Get remaining time in seconds
   */
  getRemainingTime(): number {
    if (!this.rateLimitEndTime) return 0;
    return Math.max(0, Math.ceil((this.rateLimitEndTime - Date.now()) / 1000));
  }

  /**
   * Subscribe to rate limit changes
   */
  subscribe(callback: RateLimitCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback(this.isRateLimited));
  }
}

export const rateLimitManager = new RateLimitManager();
