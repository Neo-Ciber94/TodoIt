/**
 * The api URL.
 */
export const API_URL = getApiUrl();

// prettier-ignore
function getApiUrl() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_VERCEL_URL) {
    return process.env.NEXT_PUBLIC_VERCEL_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL;
}
