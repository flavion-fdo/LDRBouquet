// URL Shortener Utility with Safety Checks & Multi-Provider Fallback (is.gd, v.gd, spoo.me)

export const GITHUB_PAGES_BASE = 'https://flavion-fdo.github.io/LDRBouquet/';
const cache = new Map();

let cachedPagesStatus = null;
let lastCheckTime = 0;

/**
 * Checks whether the GitHub Pages URL is actually deployed and responding with 200.
 * Avoids generating dead short links to 404 pages when developing on localhost.
 */
export async function checkGitHubPagesDeployed() {
  const now = Date.now();
  if (cachedPagesStatus !== null && now - lastCheckTime < 60000) {
    return cachedPagesStatus;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(GITHUB_PAGES_BASE, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    cachedPagesStatus = res.ok;
  } catch {
    cachedPagesStatus = false;
  }
  lastCheckTime = now;
  return cachedPagesStatus;
}

/**
 * Normalizes a URL for public shorteners.
 * Public shortener APIs (is.gd, v.gd) reject localhost/127.0.0.1.
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
 * @returns {Promise<{ shortUrl: string, provider: string, isLocalMapped: boolean, pagesNotDeployed?: boolean } | null>}
 */
export async function shortenUrl(rawUrl) {
  if (!rawUrl) return null;

  // Check cache first
  if (cache.has(rawUrl)) {
    return cache.get(rawUrl);
  }

  const isLocal = rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1');

  // If running locally, verify if GitHub Pages is actually deployed before creating a short link
  if (isLocal) {
    const isDeployed = await checkGitHubPagesDeployed();
    if (!isDeployed) {
      // Don't create broken shortlinks that redirect to a 404 page!
      const fallbackResult = {
        shortUrl: null,
        provider: null,
        isLocalMapped: true,
        pagesNotDeployed: true
      };
      cache.set(rawUrl, fallbackResult);
      return fallbackResult;
    }
  }

  const targetUrl = getPublicShareUrl(rawUrl);

  // Strategy 1: is.gd (Fast, reliable, CORS enabled)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
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
    const timer = setTimeout(() => controller.abort(), 2500);
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
    const timer = setTimeout(() => controller.abort(), 2500);
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
