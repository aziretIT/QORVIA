import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAuthHandler, sendJson } from './auth-server.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.argv[2] ?? 4173);
const dataDirectories = {
  win32: process.env.LOCALAPPDATA || homedir(),
  darwin: resolve(homedir(), 'Library', 'Application Support'),
};
const dataDirectory = dataDirectories[process.platform] ?? (process.env.XDG_DATA_HOME || resolve(homedir(), '.local', 'share'));
const accountsFile = process.env.QORVIA_ACCOUNTS_FILE ?? resolve(dataDirectory, 'QORVIA', 'accounts.sqlite');
let handleAccounts;
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const pages = new Set(['index', 'dashboard', 'vocabulary', 'grammar', 'ielts', 'sat', 'challenge', 'progress', 'profile', 'pricing', 'login', 'signup']);

function publicFile(pathname) {
  if (pathname === '/') return 'index.html';
  if (pathname.endsWith('.html') && pages.has(pathname.slice(1, -5))) return pathname.slice(1);
  if (/^\/(?:css|js|data|assets)\/[a-zA-Z0-9_./-]+$/.test(pathname)
      && pathname.slice(1).split('/').every((part) => part && !part.startsWith('.'))
      && Object.hasOwn(contentTypes, extname(pathname))) return pathname.slice(1);
  return null;
}

const server = createServer({ requestTimeout: 30_000 }, async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Invalid request path');
    return;
  }
  if (pathname.startsWith('/api/')) {
    try {
      handleAccounts ??= createAuthHandler(accountsFile);
      await handleAccounts(request, response, pathname);
    } catch (error) {
      console.error('QORVIA could not open the account database.', error.code ?? error.name);
      if (!response.destroyed) sendJson(response, 503, { message: 'The account service is temporarily unavailable.' });
    }
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (pathname === '/js/auth-config.js') {
    response.writeHead(200, {
      'Content-Type': contentTypes['.js'],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    }).end(request.method === 'HEAD' ? undefined : 'export const accountEnabled = true;\n');
    return;
  }
  try {
    const file = publicFile(pathname);
    const location = file && resolve(root, file);
    if (!location || !location.startsWith(resolve(root) + sep) || !(await stat(location)).isFile()) {
      response.writeHead(404).end('Page not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(location)],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(location).on('error', () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end('Page not found');
  }
});

server.listen(Number(process.env.PORT ?? port), '0.0.0.0', () => {
  console.log(`QORVIA запущена на порту ${server.address().port}`);
});
