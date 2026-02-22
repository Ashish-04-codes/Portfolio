/**
 * Application configuration
 */
export const config = {
  app: {
    name: 'The Daily Developer',
    version: '1.0.0',
    environment: 'development',
  },
  api: {
    baseUrl: '',
    timeout: 30000,
  },
  features: {
    darkMode: true,
    analytics: false,
    printMode: true,
  },
} as const;
