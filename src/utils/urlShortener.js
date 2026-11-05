// URL Shortener Utility with Multi-Provider Fallback (is.gd, v.gd, spoo.me)

export const GITHUB_PAGES_BASE = 'https://flavion-fdo.github.io/LDRBouquet/';
const cache = new Map();

/**
 * Normalizes a URL for public shorteners.
 * Public shortener APIs (is.gd, v.gd) reject localhost/127.0.0.1.
 * We map the origin to the deployed GitHub Pages URL
 * so the generated short link opens for anyone on the internet.
 */
export function getPublicShareUrl(currentUrl) {
  try {
    const parsed = new URL(currentUrl);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      const hash = parsed.hash || '';
      return `${GITHUB_PAGES_BASE}${hash}`;
    }
    return currentUrl;
  } catch {
    return currentUrl;
  }
}

/**
 * Shorten a URL using free, CORS-friendly public APIs with cascade fallback.
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

  // Strategy 1: is.gd (Fast, reliable, CORS enabled)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(targetUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.shorturl) {
        const result = {
          shortUrl: data.shorturl,
          provider: 'is.gd',
          isLocalMapped: isLocal
        };
        cache.set(rawUrl, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('is.gd shortener skipped/failed:', err?.message || err);
  }

  // Strategy 2: v.gd (Direct sister service of is.gd)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://v.gd/create.php?format=json&url=${encodeURIComponent(targetUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.shorturl) {
        const result = {
          shortUrl: data.shorturl,
          provider: 'v.gd',
          isLocalMapped: isLocal
        };
        cache.set(rawUrl, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('v.gd shortener skipped/failed:', err?.message || err);
  }

  // Strategy 3: spoo.me (Free public shortener with CORS)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://spoo.me/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({ url: targetUrl }),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.short_url) {
        const result = {
          shortUrl: data.short_url,
          provider: 'spoo.me',
          isLocalMapped: isLocal
        };
        cache.set(rawUrl, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('spoo.me shortener skipped/failed:', err?.message || err);
  }

  return null;
}
