import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

// Simple environment variable loader
const env = {};
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
  });
} catch (e) {
  console.warn("No .env file found. Using process.env.");
}

const PORT = process.env.PORT || env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
const CHAT_API_KEY = process.env.CHAT_API_KEY || env.CHAT_API_KEY || GEMINI_API_KEY;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const forwardToGemini = (req, res, body, type) => {
  const apiKey = type === 'chat' ? CHAT_API_KEY : GEMINI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({ error: { message: "API Key is not configured on the server." } }));
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const geminiReq = https.request(url, options, (geminiRes) => {
    let responseData = '';
    geminiRes.setEncoding('utf8');
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
  // 1. Handle API Routes
  if (req.url.startsWith('/api/') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        if (req.url === '/api/analyze') {
          const data = JSON.parse(body);
          const geminiBody = JSON.stringify({
            contents: [{ parts: [{ text: data.prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          });
          forwardToGemini(req, res, geminiBody, 'analyze');
        } else if (req.url === '/api/chat') {
          forwardToGemini(req, res, body, 'chat');
        } else if (req.url === '/api/execute') {
          const data = JSON.parse(body);
          const geminiBody = JSON.stringify({
            contents: [{ parts: [{ text: data.prompt }] }],
            generationConfig: { 
              maxOutputTokens: 2000, 
              temperature: 0.1,
              responseMimeType: "application/json" 
            }
          });
          forwardToGemini(req, res, geminiBody, 'execute');
        } else {
          res.writeHead(404);
          res.end();
        }
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // 2. Handle Static Files (Production Mode)
  let filePath = path.join(process.cwd(), 'dist', req.url === '/' ? 'index.html' : req.url);
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
        fs.readFile(path.join(process.cwd(), 'dist', 'index.html'), (err, indexContent) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent || "NexCode: Ensure you have run 'npm run build' first!");
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 NexCode Full-Stack Server running on port ${PORT}`);
  console.log(`🔧 Mode: ${fs.existsSync(path.join(process.cwd(), 'dist')) ? 'Production (UI + API)' : 'Development (API Only)'}`);
});
