// Simple & Reliable Bouquet Short Link Generator

const VERCEL_APP_BASE = 'https://ldr-bouquet.vercel.app/';
const cache = new Map();

/**
 * Generates a clean, working short link for the bouquet.
 * Direct 301 redirect with zero warning screens or interstitials.
 * @param {string} fullUrl - Full bouquet URL with hash
 * @returns {Promise<string>} - Short URL (e.g. https://is.gd/xyz) or fallback direct URL
 */
export async function createShortLink(fullUrl) {
  if (!fullUrl) return '';

  if (cache.has(fullUrl)) {
    return cache.get(fullUrl);
  }

  // Normalize target URL (if on localhost, route to live Vercel app so recipients can open it)
  let targetUrl = fullUrl;
  if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
    const hash = targetUrl.includes('#') ? targetUrl.substring(targetUrl.indexOf('#')) : '';
    targetUrl = `${VERCEL_APP_BASE}${hash}`;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(targetUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.shorturl) {
        cache.set(fullUrl, data.shorturl);
        return data.shorturl;
      }
    }
  } catch (err) {
    console.warn('Short link creation error, using direct URL:', err?.message || err);
  }

  // Fallback to direct URL seamlessly
  return targetUrl;
}
