import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const hashOptions = { N: 2 ** 15, r: 8, p: 3, maxmem: 48 * 1024 ** 2 };
const hashLength = 64;
const cookieName = 'qorvia_session';
const sessionLifetime = 7 * 24 * 60 * 60;
const bodyLimit = 4096;
const attemptLimit = 12;
const attemptWindow = 60_000;
const sessionPath = '/api/session';
const credentialPaths = ['/api/signup', '/api/login'];
const logoutPath = '/api/logout';

class RequestError extends Error {
  constructor(status, message, headers = {}) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

export function sendJson(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  }).end(JSON.stringify(body));
}

function sessionCookie(token, age = sessionLifetime) {
  return `${cookieName}=${token}; Max-Age=${age}; Path=/; HttpOnly; SameSite=Strict`;
}

function sessionDigest(request) {
  const cookie = request.headers.cookie?.split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(cookieName + '='));
  const token = cookie?.slice(cookieName.length + 1);
  return token && /^[a-zA-Z0-9_-]{43}$/.test(token) ? digest(token) : null;
}

function digest(token) {
  return createHash('sha256').update(token).digest('hex');
}

function localOrigin(request) {
  const host = request.headers.host;
  const port = request.socket.localPort;
  for (const hostname of ['127.0.0.1', 'localhost']) {
    if (host === `${hostname}:${port}` || (port === 80 && host === hostname)) {
      return new URL(`http://${host}`).origin;
    }
  }
  return null;
}

async function readJson(request) {
  const contentType = request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    throw new RequestError(415, 'Send this request as JSON.');
  }
  if (Number(request.headers['content-length']) > bodyLimit) {
    request.resume();
    throw new RequestError(413, 'This request is too large.');
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    length += chunk.length;
    if (length > bodyLimit) break;
    chunks.push(chunk);
  }
  if (length > bodyLimit) {
    request.resume();
    throw new RequestError(413, 'This request is too large.');
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  } catch {
    // Invalid JSON uses the same response as an invalid object.
  }
  throw new RequestError(400, 'Send a valid JSON object.');
}

export function createAuthHandler(databasePath) {
  if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });
  const database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      salt BLOB NOT NULL,
      password_hash BLOB NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions (expires_at);
  `);
  const addAccount = database.prepare(`
    INSERT INTO accounts (id, username, salt, password_hash)
    VALUES (?, ?, ?, ?) ON CONFLICT(username) DO NOTHING
  `);
  const findAccount = database.prepare('SELECT id, username, salt, password_hash FROM accounts WHERE username = ?');
  const findSession = database.prepare(`
    SELECT accounts.id, accounts.username
    FROM sessions JOIN accounts ON accounts.id = sessions.account_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `);
  const addSession = database.prepare('INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)');
  const removeSession = database.prepare('DELETE FROM sessions WHERE token_hash = ?');
  const removeExpired = database.prepare('DELETE FROM sessions WHERE expires_at <= ?');
  const dummySalt = randomBytes(16);
  const dummyHash = randomBytes(hashLength);
  let attempts = 0;
  let retryAt = 0;

  function issueSession(request, account, password) {
    const now = Date.now();
    const token = randomBytes(32).toString('base64url');
    database.exec('BEGIN IMMEDIATE');
    try {
      if (password && !addAccount.run(account.id, account.username, password.salt, password.hash).changes) {
        throw new RequestError(409, 'That username is already taken.');
      }
      removeExpired.run(now);
      removeSession.run(sessionDigest(request));
      addSession.run(digest(token), account.id, now + sessionLifetime * 1000);
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
    return sessionCookie(token);
  }

  function countAttempt() {
    const now = Date.now();
    if (now >= retryAt) {
      attempts = 0;
      retryAt = now + attemptWindow;
    }
    if (attempts >= attemptLimit) {
      const seconds = Math.ceil((retryAt - now) / 1000);
      throw new RequestError(429, 'Too many attempts. Wait a minute and try again.', { 'Retry-After': String(seconds) });
    }
    attempts += 1;
  }

  async function authenticate(request, response, body, signup) {
    const submittedName = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!/^[a-zA-Z0-9_-]{3,24}$/.test(submittedName) || password.length < 12 || password.length > 128) {
      if (!signup) throw new RequestError(401, 'The username or password is incorrect.');
      throw new RequestError(400, 'Use a username of 3 to 24 letters, numbers, hyphens, or underscores and a password of 12 to 128 characters.');
    }

    const username = submittedName.toLowerCase();
    countAttempt();
    if (signup) {
      const account = { id: randomUUID(), username };
      const salt = randomBytes(16);
      const hash = await derive(password, salt, hashLength, hashOptions);
      const cookie = issueSession(request, account, { salt, hash });
      sendJson(response, 201, { account }, { 'Set-Cookie': cookie });
      return;
    }

    const stored = findAccount.get(username);
    const hash = await derive(password, stored?.salt ?? dummySalt, hashLength, hashOptions);
    const matches = timingSafeEqual(hash, stored?.password_hash ?? dummyHash);
    if (!stored || !matches) throw new RequestError(401, 'The username or password is incorrect.');
    const account = { id: stored.id, username: stored.username };
    const cookie = issueSession(request, account);
    sendJson(response, 200, { account }, { 'Set-Cookie': cookie });
  }

  return async (request, response, pathname) => {
    try {
      if (pathname !== sessionPath && pathname !== logoutPath && !credentialPaths.includes(pathname)) {
        throw new RequestError(404, 'Account route not found.');
      }
      const method = pathname === sessionPath ? 'GET' : 'POST';
      if (request.method !== method) {
        throw new RequestError(405, 'This request method is unavailable.', { Allow: method });
      }
      const origin = localOrigin(request);
      if (!origin || (method === 'POST' && request.headers.origin !== origin)) {
        throw new RequestError(403, 'Open QORVIA on the local server to manage your account.');
      }
      if (pathname === sessionPath) {
        const account = findSession.get(sessionDigest(request), Date.now()) ?? null;
        sendJson(response, 200, { account });
        return;
      }
      const body = await readJson(request);
      if (pathname === logoutPath) {
        removeSession.run(sessionDigest(request));
        sendJson(response, 200, { account: null }, { 'Set-Cookie': sessionCookie('', 0) });
        return;
      }
      await authenticate(request, response, body, pathname === '/api/signup');
    } catch (error) {
      if (response.destroyed) return;
      if (error instanceof RequestError) sendJson(response, error.status, { message: error.message }, error.headers);
      else {
        console.error('QORVIA account request failed.', error.code ?? error.name);
        sendJson(response, 500, { message: 'The account service is temporarily unavailable.' });
      }
    }
  };
}
