export default async function handler(req, res) {
  // Enable CORS for localhost or custom deployments
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = req.query.url || req.body?.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const isgdRes = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(targetUrl)}`);
    if (isgdRes.ok) {
      const data = await isgdRes.json();
      if (data && data.shorturl) {
        return res.status(200).json({ shortUrl: data.shorturl, provider: 'is.gd' });
      }
    }
  } catch (err) {
    console.error('Serverless shortener error:', err);
  }

  return res.status(502).json({ error: 'Unable to shorten URL' });
}
