/**
 * Environment configuration
 * Centralized place for all environment variables
 */

export const env = {
  // API Backend
  API_URL: import.meta.env.VITE_API_URL,

  // WebSocket
  WS_URL: import.meta.env.VITE_WS_URL,

  // reCAPTCHA v3
  RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,

  // App Info
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,

  // Mode flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const;

// Type for env object
export type Env = typeof env;
