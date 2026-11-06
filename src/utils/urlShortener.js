// Direct-Redirect URL Shortener Utility (is.gd + Vercel Serverless Function)

export const VERCEL_APP_BASE = 'https://ldr-bouquet.vercel.app/';
export const GITHUB_PAGES_BASE = 'https://flavion-fdo.github.io/LDRBouquet/';

const cache = new Map();

/**
 * Normalizes a URL for public shorteners.
 * If running on localhost, map to the live Vercel production deployment
 * so the short link opens on any device/phone worldwide.
 */
export function getPublicShareUrl(currentUrl) {
  try {
    const parsed = new URL(currentUrl);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      const hash = parsed.hash || '';
      return `${VERCEL_APP_BASE}${hash}`;
    }
    return currentUrl;
  } catch {
    return currentUrl;
  }
}

/**
 * Shorten a URL with instant direct 301 redirection (zero warning screens, zero phishing interstitials).
 * @param {string} rawUrl - Full URL to shorten
 * @returns {Promise<{ shortUrl: string, provider: string, isLocalMapped: boolean } | null>}
 */
export async function shortenUrl(rawUrl) {
  if (!rawUrl) return null;

  // Check cache first
  if (cache.has(rawUrl)) {
    return cache.get(rawUrl);
  }

  const isLocal = rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1');
  const targetUrl = getPublicShareUrl(rawUrl);

  // Strategy 1: Try native Vercel /api/shorten endpoint if hosted on Vercel
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const apiUrl = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
      ? `/api/shorten?url=${encodeURIComponent(targetUrl)}`
      : `${VERCEL_APP_BASE}api/shorten?url=${encodeURIComponent(targetUrl)}`;

    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.shortUrl) {
        let short = data.shortUrl;
        if (short.startsWith('http://')) short = short.replace('http://', 'https://');
        const result = {
          shortUrl: short,
          provider: 'is.gd',
          isLocalMapped: isLocal
        };
        cache.set(rawUrl, result);
        return result;
      }
    }
  } catch {
    // Fall back to direct browser fetch
  }

  // Strategy 2: Direct browser fetch to is.gd (instant 301 direct redirect, CORS enabled, no warning screen)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(targetUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.shorturl) {
        let short = data.shorturl;
        if (short.startsWith('http://')) short = short.replace('http://', 'https://');
        const result = {
          shortUrl: short,
          provider: 'is.gd',
          isLocalMapped: isLocal
        };
        cache.set(rawUrl, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Direct is.gd shortener skipped/failed:', err?.message || err);
  }

  return null;
}
