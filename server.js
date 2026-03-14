import http from 'http';
import https from 'https';

// Simple environment variable loader (mini-dotenv)
const env = {};
try {
  const fs = await import('fs');
  const path = await import('path');
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
  });
} catch (e) {
  console.warn("Could not load .env file, using process.env");
}

const PORT = env.PORT || process.env.PORT || 3001;
const GEMINI_API_KEY = env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const CHAT_API_KEY = env.CHAT_API_KEY || process.env.VITE_CHAT_API_KEY || GEMINI_API_KEY;

const forwardToGemini = (req, res, body, type) => {
  const apiKey = type === 'chat' ? CHAT_API_KEY : GEMINI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({ error: { message: "API Key is not configured on the server." } }));
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const geminiReq = https.request(url, options, (geminiRes) => {
    let responseData = '';
    geminiRes.on('data', (chunk) => responseData += chunk);
    geminiRes.on('end', () => {
      res.writeHead(geminiRes.statusCode, { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end(responseData);
    });
  });

  geminiReq.on('error', (e) => {
    res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: { message: e.message } }));
  });

  geminiReq.write(body);
  geminiReq.end();
};

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (req.url === '/api/analyze') {
        const data = JSON.parse(body);
        const geminiBody = JSON.stringify({
          contents: [{ parts: [{ text: data.prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        });
        forwardToGemini(req, res, geminiBody, 'analyze');
      } else if (req.url === '/api/chat') {
        forwardToGemini(req, res, body, 'chat');
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`NexCode Secure Proxy (Zero-Dependency) running on http://localhost:${PORT}`);
});
