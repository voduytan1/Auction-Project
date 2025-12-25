/**
 * Helper function Ä‘á»ƒ kiá»ƒm tra xem route hiá»‡n táº¡i cÃ³ pháº£i protected hay khÃ´ng
 */

// Protected route patterns (tá»« routes/index.tsx)
const PROTECTED_ROUTE_PATTERNS = [
  /^\/app\//, // /app/*
  /^\/seller\//, // /seller/*
  /^\/bidder\//, // /bidder/*
  /^\/admin\//, // /admin/*
  /^\/profile\//, // /profile/*
  /^\/auth\/login$/, // /auth/login
  /^\/auth\/register$/, // /auth/register
  /^\/auth\/forgot-password$/, // /auth/forgot-password
];

/**
 * Check if the current route is protected (requires authentication)
 * @param pathname - Current pathname (from window.location.pathname)
 * @returns true if route is protected, false if route is public
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Check if the route is an auth page (login, register, etc.)
 * @param pathname - Current pathname
 * @returns true if it's an auth page
 */
export function isAuthPage(pathname: string): boolean {
  return /^\/auth\//.test(pathname);
}

/**
 * Public routes (khÃ´ng cáº§n authentication)
 * NgÆ°á»i dÃ¹ng cÃ³ thá»ƒ xem sau logout
 */
export const PUBLIC_ROUTES = [
  "/", // Home
  /^\/products\/\d+$/, // Product detail
  "/products", // Products list
  /^\/category\/.*$/, // Category products
  "/search", // Search
  "/unauthorized", // Unauthorized page
];

/**
 * Check if a route is public (no auth required)
 * @param pathname - Current pathname
 * @returns true if route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (typeof route === "string") {
      return pathname === route;
    }
    return route.test(pathname);
  });
}
