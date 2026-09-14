import { createContext, useContext } from 'hono/jsx';

export const UMAMI_SCRIPT_URL = 'https://insights.nesasio.xyz/script.js';

/** Umami website ID of the site, or null when analytics is off. */
export const AnalyticsContext = createContext<string | null>(null);

export function useAnalytics(): string | null {
  return useContext(AnalyticsContext);
}
