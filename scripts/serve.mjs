import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root = resolve(process.argv[2] || 'dist');
const port = Number(process.env.PORT || 4173);
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${path === '/' ? '/index.html' : path}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.pdf':'application/pdf','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'})[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port}/`));
