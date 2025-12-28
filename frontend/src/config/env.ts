/**
 * Environment configuration
 * Centralized place for all environment variables
 */

export const env = {
  // API Backend
  API_URL: import.meta.env.VITE_API_URL as string,

  // WebSocket
  WS_URL: import.meta.env.VITE_WS_URL as string,

  // reCAPTCHA v3
  RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY as string,

  // App Info
  APP_NAME: import.meta.env.VITE_APP_NAME as string,
  APP_VERSION: import.meta.env.VITE_APP_VERSION as string,

  // Mode flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  MODE: import.meta.env.MODE as string,
} as const;

// Type for env object
export type Env = typeof env;
