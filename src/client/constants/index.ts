/**
 * The api URL.
 */
export const API_URL = getApiUrl();

function getApiUrl() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && process.env.NEXT_PUBLIC_VERCEL_URL) {
    return process.env.NEXT_PUBLIC_VERCEL_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL;
}
