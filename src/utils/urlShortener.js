// High-Reliability URL Shortener Utility with Multi-Provider Direct Redirection (da.gd, is.gd, v.gd)

export const GITHUB_PAGES_BASE = 'https://flavion-fdo.github.io/LDRBouquet/';
const cache = new Map();

/**
 * Normalizes a URL for public shorteners.
 * Public shortener APIs reject localhost/127.0.0.1.
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
 * Strategy 1: da.gd (Fast direct 302 redirect, CORS enabled, HTTPS)
 * Strategy 2: is.gd (Direct 301 redirect)
 * Strategy 3: v.gd (Sister service)
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

  // Strategy 1: da.gd (Primary - fast, instant direct 302 redirect, HTTPS, CORS enabled)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://da.gd/s?url=${encodeURIComponent(targetUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      let short = (await res.text()).trim();
      if (short && short.startsWith('http')) {
        if (short.startsWith('http://')) short = short.replace('http://', 'https://');
        const result = {
          shortUrl: short,
          provider: 'da.gd',
          isLocalMapped: isLocal
        };
        cache.set(rawUrl, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('da.gd shortener skipped/failed:', err?.message || err);
  }

  // Strategy 2: is.gd (Fast direct 301 redirect fallback)
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
    console.warn('is.gd shortener skipped/failed:', err?.message || err);
  }

  // Strategy 3: v.gd (Backup fallback)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://v.gd/create.php?format=json&url=${encodeURIComponent(targetUrl)}`, {
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

  return null;
}
