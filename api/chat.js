import https from 'https';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contents } = req.body;
  const apiKey = process.env.CHAT_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: { message: "API Key is not configured on the server." } });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  return new Promise((resolve) => {
    try {
      const geminiReq = https.request(url, options, (geminiRes) => {
        let responseData = '';
        geminiRes.setEncoding('utf8');
        geminiRes.on('data', (chunk) => responseData += chunk);
        geminiRes.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            res.status(geminiRes.statusCode).json(parsed);
          } catch (e) {
            res.status(500).json({ error: { message: "Failed to parse Gemini response" } });
          }
          resolve();
        });
      });

      geminiReq.on('error', (e) => {
        res.status(500).json({ error: { message: e.message } });
        resolve();
      });

      geminiReq.write(JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
      }));
      geminiReq.end();
    } catch (err) {
      res.status(500).json({ error: { message: `Serverless Request Error: ${err.message}` } });
      resolve();
    }
  });
}
